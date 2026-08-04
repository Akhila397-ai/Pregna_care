import 'reflect-metadata';
import { injectable, inject }        from 'inversify';
import { Types }                     from 'mongoose';
import { TYPES }                     from '../../../container/types.js';
import  type { IDoctorRepository }         from '../../../repositories/doctor/interface/iDoctor.repository.js';
import type { IUserRepository }           from '../../../repositories/auth/interface/IUser.repository.js';
import type { IDoctorService }            from '../interface/IDoctor.service.js';
import  type { IEmailService }             from '../../email/interface/IEmail.service.js';
import { toDoctorApplicationDTO,toDoctorStatusDTO, toDoctorDashboardDTO}        from '../../../mapper/doctor.mapper.js';
import { hashPassword }              from '../../../utils/hashPassword.js';
import { generateAccessToken }       from '../../../utils/generateToken.js';
import { generateOTP }               from '../../../utils/generateOtp.js';
import { HttpResponse } from '../../../constants/messages.constant.js';
import { DoctorApplyDTO, DoctorApplyResponseDTO, DoctorDashboardDTO, DoctorStatusResponseDTO }            from '../../../dtos/doctor.dto.js';
import doctorApplicationModel from '../../../models/doctorApplication.model.js';
import { uploadToS3,generateS3Key,getPresignedUrl,validateFile,PDF_ONLY,ALLOWED_MIME_TYPES, IMAGE_ONLY } from '../../../utils/s3Upload.js';
import { Expr } from 'aws-sdk/clients/cloudsearchdomain.js';
import { DoctorApplicationDocument } from '../../../types/doctor.js';
import { Type } from '@aws-sdk/client-s3';

export interface UploadFiles {
  profileImage?:   Express.Multer.File[];
  degreeCertificate ?: Express.Multer.File[];
  registrationCertificate?: Express.Multer.File[];
  governmentId?:            Express.Multer.File[];
}
@injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @inject(TYPES.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TYPES.UserRepository)   private userRepository:   IUserRepository,
  ) {}

  async apply(
    userId:  string,
    data:    DoctorApplyDTO,
    files:   {
      [field: string]: Express.Multer.File[];
    }
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error(HttpResponse.USER_NOT_FOUND);

    const existing = await this.doctorRepository.findApplicationByUserId(userId);
    if (existing) {
  if (
    existing.application.status === 'pending' ||
    existing.application.status === 'under_review'
  ) {
    throw new Error('You already have a pending application.');
  }

  if (existing.application.status === 'approved') {
    throw new Error('Your application is already approved.');
  }
}

    // ── Validate files ────────────────────────
    const profileImageFile = files.profileImage?.[0];
    const degreeFile = files.degreeCertificate?.[0];
    const regFile    = files.registrationCertificate?.[0];
    const govFile    = files.governmentId?.[0];

    if (!degreeFile || !regFile || !govFile) {
      throw new Error('All three documents are required.');
    }

    const profilevalidation = validateFile(
      profileImageFile.mimetype,
      profileImageFile.size,
      IMAGE_ONLY
    );
    if(!profilevalidation.valid){
      throw new Error(`Profile Image: ${profilevalidation.error}`);
    }

    // degree — PDF only
    const degreeValidation = validateFile(
      degreeFile.mimetype, degreeFile.size, PDF_ONLY
    );
    if (!degreeValidation.valid) {
      throw new Error(`Degree Certificate: ${degreeValidation.error}`);
    }

    // registration — PDF only
    const regValidation = validateFile(
      regFile.mimetype, regFile.size, PDF_ONLY
    );
    if (!regValidation.valid) {
      throw new Error(`Registration Certificate: ${regValidation.error}`);
    }

    // government ID — PDF/JPG/PNG
    const govValidation = validateFile(
      govFile.mimetype, govFile.size, ALLOWED_MIME_TYPES
    );
    if (!govValidation.valid) {
      throw new Error(`Government ID: ${govValidation.error}`);
    }

    // ── Upload to S3 ──────────────────────────
    const profileKey = generateS3Key('doctor-profiles', profileImageFile.mimetype)
    const degreeKey = generateS3Key('doctor-docs/degrees',  degreeFile.mimetype);
    const regKey    = generateS3Key('doctor-docs/registrations', regFile.mimetype);
    const govKey    = generateS3Key('doctor-docs/government-ids', govFile.mimetype);

    await Promise.all([
      uploadToS3(profileImageFile.buffer, profileKey, profileImageFile.mimetype),
      uploadToS3(degreeFile.buffer, degreeKey, degreeFile.mimetype),
      uploadToS3(regFile.buffer,    regKey,    regFile.mimetype),
      uploadToS3(govFile.buffer,    govKey,    govFile.mimetype),
    ]);

    //Building APplicationData

    const applicationData = {
      userId:   new Types.ObjectId(userId),
      fullName:           data.fullName,
      specialization:     data.specialization,
      qualification:      data.qualification,
      experience:         Number(data.experience),
      registrationNumber: data.registrationNumber,
      consultationFee:    Number(data.consultationFee),
      clinicName:         data.clinicName,
      clinicAddress:      data.clinicAddress,
      availability:       data.availability,
      profileImage:                   profileKey,   // ← S3 key
      degreeCertificateUrl:           degreeKey,    // ← S3 key
      registrationCertificateUrl:     regKey,       // ← S3 key
      governmentIdUrl:                govKey,       // ← S3 key
      status:    'pending'  as const,
      isBlocked: false,
      isDeleted: false,
    }

    // ── Create application ────────────────────
    let application: DoctorApplicationDocument;

    if (existing && existing.application.status === 'rejected' ||
        existing && existing.application.status === 'more_documents_required') {
      // resubmit
      await doctorApplicationModel.findByIdAndUpdate(
        existing.application._id,
        {
          $set: {
            ...applicationData,
            verificationRemarks:        undefined,
            verifiedBy:                 undefined,
            verifiedAt:                 undefined,
          },
        }
      );
      const updated = await this.doctorRepository
        .findApplicationById(existing.application._id.toString());
      application = updated!;
    } else {
      application = await this.doctorRepository.createApplication(applicationData);
    }

    return {
      message:     HttpResponse.DOCTOR_APPLICATION_SENT,
      application: toDoctorApplicationDTO(application),
    };
  }




  async getMyStatus(userId: string) {
   const result = await this.doctorRepository.findApplicationByUserId(userId);

   if(!result){
    throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
   }

   const presignedUrls = await this._resolvePresignedUrls(result.application)
   return toDoctorStatusDTO(result,presignedUrls)
  }
async getMyDashboard(userId: string): Promise<DoctorDashboardDTO> {
     const result = await this.doctorRepository
      .findApplicationByUserId(userId);
    if (!result) throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
    if (result.application.status !== 'approved') {
      throw new Error('Doctor not approved yet.');
    }

    const presignedUrls = await this._resolvePresignedUrls(result.application);
    return toDoctorDashboardDTO(result, presignedUrls);


}

  // async getMyProfile(userId: string) {
  //   const profile = await this.doctorRepository
  //     .findProfileByUserId(userId);
  //   if (!profile) return null;
  //   return toDoctorProfileDTO(profile);
  // }
 private async _resolvePresignedUrls(
    application: DoctorApplicationDocument
  ): Promise<{
    degreeCertificateUrl?:       string;
    registrationCertificateUrl?: string;
    governmentIdUrl?:            string;
  }> {
    const [degreeUrl, regUrl, govUrl] = await Promise.allSettled([
      application.degreeCertificateUrl
        ? getPresignedUrl(application.degreeCertificateUrl)
        : Promise.resolve(undefined),
      application.registrationCertificateUrl
        ? getPresignedUrl(application.registrationCertificateUrl)
        : Promise.resolve(undefined),
      application.governmentIdUrl
        ? getPresignedUrl(application.governmentIdUrl)
        : Promise.resolve(undefined),
    ]);

    return {
      degreeCertificateUrl: degreeUrl.status === 'fulfilled'
        ? degreeUrl.value : undefined,
      registrationCertificateUrl: regUrl.status === 'fulfilled'
        ? regUrl.value : undefined,
      governmentIdUrl: govUrl.status === 'fulfilled'
        ? govUrl.value : undefined,
    };
  }
}