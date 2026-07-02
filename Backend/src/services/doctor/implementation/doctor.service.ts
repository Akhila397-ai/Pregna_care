import 'reflect-metadata';
import { injectable, inject }        from 'inversify';
import { Types }                     from 'mongoose';
import { TYPES }                     from '../../../container/types.js';
import  type { IDoctorRepository }         from '../../../repositories/doctor/interface/iDoctor.repository.js';
import type { IUserRepository }           from '../../../repositories/auth/interface/IUser.repository.js';
import type { IDoctorService }            from '../interface/IDoctor.service.js';
import  type { IEmailService }             from '../../email/interface/IEmail.service.js';
import { toDoctorApplicationDTO, toDoctorDashboardDTO}        from '../../../mapper/doctor.mapper.js';
import { hashPassword }              from '../../../utils/hashPassword.js';
import { generateAccessToken }       from '../../../utils/generateToken.js';
import { generateOTP }               from '../../../utils/generateOtp.js';
import { HttpResponse } from '../../../constants/messages.constant.js';
import { DoctorApplyDTO, DoctorApplyResponseDTO, DoctorDashboardDTO }            from '../../../dtos/doctor.dto.js';
import doctorApplicationModel from '../../../models/doctorApplication.model.js';

@injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @inject(TYPES.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TYPES.UserRepository)   private userRepository:   IUserRepository,
    @inject(TYPES.EmailService)     private emailService:     IEmailService,
  ) {}

  async apply(userId: string, data: DoctorApplyDTO): Promise<DoctorApplyResponseDTO> {
      
    const user = await this.userRepository.findById(userId)
     if(!user) throw new Error(HttpResponse.USER_NOT_FOUND)
    
    const exixting = await this.doctorRepository
    .findApplicationByUserId(userId);

    if(exixting){
        if(exixting.status === 'pending'){
            throw new Error('You already have a pending application')
        }
        if(exixting.status === 'approved'){
            throw new Error("Your application has already been approved")
        }

        await this.doctorRepository.updateApplicationStatus(
            exixting._id.toString(),
            'pending'
        );

       const updated = await this.doctorRepository.updateApplication(
        exixting._id.toString(),
        {
           ...data,
           status: 'pending',
           rejectionReason: undefined,
           approvedBy: undefined,
           approvedAt: undefined,
        }
       );



        return {
            message: 'Application resubmitted successfully',
            application: toDoctorApplicationDTO(updated!)
        }

    }

    const application = await this.doctorRepository.createApplication({
      userId:             new Types.ObjectId(userId),  // ← from JWT
      specialization:     data.specialization,
      qualification:      data.qualification,
      experience:         data.experience,
      registrationNumber: data.registrationNumber,
      consultationFee:    data.consultationFee,
      clinicName:         data.clinicName,
      clinicAddress:      data.clinicAddress,
      profileImage:       data.profileImage,
      documents:          data.documents,
      availability:       data.availability,
      status:             'pending',
      isBlocked:          false,
      isDeleted:          false,
      isVerified:      false
    });


    return {
      message:     HttpResponse.DOCTOR_APPLICATION_SENT,
      application: toDoctorApplicationDTO(application),
    };

}


  async getMyStatus(userId: string) {

    console.log('[getMyStatus] userId:', userId);

    const application = await this.doctorRepository
      .findApplicationByUserId(userId);

    console.log('[getMyStatus] application found:', application ? 'YES' : 'NO');

    if (!application) {
      throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
    }

    return {
      status:          application.status,
      application:     toDoctorApplicationDTO(application),
      rejectionReason: application.rejectionReason,
    };
  }

async getMyDashboard(userId: string): Promise<DoctorDashboardDTO> {
    const result =  await this.doctorRepository
    .findApplicationByUserId(userId)

    if(!result) throw new Error(HttpResponse.DOCTOR_NOT_FOUND)

      if(result.status !== 'approved'){
        throw new Error('Doctor not approved yet')
      }
     const user = await this.userRepository.findById(userId);

    if (!user) {
        throw new Error(HttpResponse.USER_NOT_FOUND);
    }

    return toDoctorDashboardDTO({
        application: result,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            imageUrl: user.imageUrl,
            isBlocked: user.isBlocked,
            isVerified: user.isVerified,
            isDeleted: user.isDeleted,
        },
    });


}

  // async getMyProfile(userId: string) {
  //   const profile = await this.doctorRepository
  //     .findProfileByUserId(userId);
  //   if (!profile) return null;
  //   return toDoctorProfileDTO(profile);
  // }
}