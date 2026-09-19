var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Types } from 'mongoose';
import { TYPES } from '../../../container/types.js';
import { toDoctorApplicationDTO, toDoctorStatusDTO, toDoctorDashboardDTO } from '../../../mapper/doctor.mapper.js';
import { HttpResponse } from '../../../constants/messages.constant.js';
import doctorApplicationModel from '../../../models/doctorApplication.model.js';
import { uploadToS3, generateS3Key, getPresignedUrl, validateFile, PDF_ONLY, ALLOWED_MIME_TYPES, IMAGE_ONLY } from '../../../utils/s3Upload.js';
let DoctorService = class DoctorService {
    doctorRepository;
    userRepository;
    constructor(doctorRepository, userRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }
    async apply(userId, data, files) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        const existing = await this.doctorRepository.findApplicationByUserId(userId);
        if (existing) {
            if (existing.application.status === 'pending' ||
                existing.application.status === 'under_review') {
                throw new Error('You already have a pending application.');
            }
            if (existing.application.status === 'approved') {
                throw new Error('Your application is already approved.');
            }
        }
        // ── Validate files ────────────────────────
        const profileImageFile = files.profileImage?.[0];
        const degreeFile = files.degreeCertificate?.[0];
        const regFile = files.registrationCertificate?.[0];
        const govFile = files.governmentId?.[0];
        if (!degreeFile || !regFile || !govFile) {
            throw new Error('All three documents are required.');
        }
        let profileKey = '';
        const uploadPromises = [];
        if (profileImageFile) {
            const profileValidation = validateFile(profileImageFile.mimetype, profileImageFile.size, IMAGE_ONLY);
            if (!profileValidation.valid) {
                throw new Error(`Profile Image: ${profileValidation.error}`);
            }
            profileKey = generateS3Key('doctor-profiles', profileImageFile.mimetype);
            uploadPromises.push(uploadToS3(profileImageFile.buffer, profileKey, profileImageFile.mimetype));
        }
        // degree — PDF only
        const degreeValidation = validateFile(degreeFile.mimetype, degreeFile.size, PDF_ONLY);
        if (!degreeValidation.valid) {
            throw new Error(`Degree Certificate: ${degreeValidation.error}`);
        }
        // registration — PDF only
        const regValidation = validateFile(regFile.mimetype, regFile.size, PDF_ONLY);
        if (!regValidation.valid) {
            throw new Error(`Registration Certificate: ${regValidation.error}`);
        }
        // government ID — PDF/JPG/PNG
        const govValidation = validateFile(govFile.mimetype, govFile.size, ALLOWED_MIME_TYPES);
        if (!govValidation.valid) {
            throw new Error(`Government ID: ${govValidation.error}`);
        }
        // ── Upload to S3 / Storage ─────────────────
        const degreeKey = generateS3Key('doctor-docs/degrees', degreeFile.mimetype);
        const regKey = generateS3Key('doctor-docs/registrations', regFile.mimetype);
        const govKey = generateS3Key('doctor-docs/government-ids', govFile.mimetype);
        uploadPromises.push(uploadToS3(degreeFile.buffer, degreeKey, degreeFile.mimetype), uploadToS3(regFile.buffer, regKey, regFile.mimetype), uploadToS3(govFile.buffer, govKey, govFile.mimetype));
        await Promise.all(uploadPromises);
        //Building APplicationData
        const applicationData = {
            userId: new Types.ObjectId(userId),
            fullName: data.fullName,
            specialization: data.specialization,
            qualification: data.qualification,
            experience: Number(data.experience),
            registrationNumber: data.registrationNumber,
            consultationFee: Number(data.consultationFee),
            clinicName: data.clinicName,
            clinicAddress: data.clinicAddress,
            availability: data.availability,
            profileImage: profileKey, // ← S3 key
            degreeCertificateUrl: degreeKey, // ← S3 key
            registrationCertificateUrl: regKey, // ← S3 key
            governmentIdUrl: govKey, // ← S3 key
            status: 'pending',
            isBlocked: false,
            isDeleted: false,
        };
        // ── Create application ────────────────────
        let application;
        if (existing && existing.application.status === 'rejected' ||
            existing && existing.application.status === 'more_documents_required') {
            // resubmit
            await doctorApplicationModel.findByIdAndUpdate(existing.application._id, {
                $set: {
                    ...applicationData,
                    verificationRemarks: undefined,
                    verifiedBy: undefined,
                    verifiedAt: undefined,
                },
            });
            const updated = await this.doctorRepository
                .findApplicationById(existing.application._id.toString());
            application = updated;
        }
        else {
            application = await this.doctorRepository.createApplication(applicationData);
        }
        return {
            message: HttpResponse.DOCTOR_APPLICATION_SENT,
            application: toDoctorApplicationDTO(application),
        };
    }
    async getMyStatus(userId) {
        const result = await this.doctorRepository.findApplicationByUserId(userId);
        if (!result) {
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        }
        const presignedUrls = await this._resolvePresignedUrls(result.application);
        return toDoctorStatusDTO(result, presignedUrls);
    }
    async getMyDashboard(userId) {
        const result = await this.doctorRepository
            .findApplicationByUserId(userId);
        if (!result)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
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
    async _resolvePresignedUrls(application) {
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
};
DoctorService = __decorate([
    injectable(),
    __param(0, inject(TYPES.DoctorRepository)),
    __param(1, inject(TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], DoctorService);
export { DoctorService };
//# sourceMappingURL=doctor.service.js.map