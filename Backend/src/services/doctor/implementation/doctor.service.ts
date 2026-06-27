import 'reflect-metadata'
import { Types } from 'mongoose'
import { TYPES } from '../../../container/types.js'
import type { IDoctorRepository } from '../../../repositories/doctor/interface/iDoctor.repository.js'
import type { IUserRepository } from '../../../repositories/auth/interface/IUser.repository.js'
import type { IDoctorService } from '../interface/IDoctor.service.js'
import type { IEmailService } from '../../email/interface/IEmail.service.js'
import { toDoctorApplicationDTO,toDoctorProfileDTO } from '../../../mapper/doctor.mapper.js'
import { hashPassword } from '../../../utils/hashPassword.js'
import { generateAccessToken,generateRefreshToken } from '../../../utils/jwt.js'
import { generateOTP } from '../../../utils/generateOtp.js'
import { HttpResponse } from '../../../constants/messages.constant.js'
import { DoctorApplicationDTO, DoctorApplyDTO, DoctorApplyResponseDTO, DoctorProfileDTO, DoctorStatusResponseDTO } from '../../../dtos/doctor.dto.js'
import { inject, injectable } from 'inversify'
import { raw } from 'express'
import app from '../../../app.js'


@injectable()
export class DoctorService implements IDoctorService{
    constructor(
        @inject(TYPES.DoctorRepository) private doctorRepository: IDoctorRepository,
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.EmailService) private emailService: IEmailService,
    ){}

    async apply(data: DoctorApplyDTO): Promise<DoctorApplyResponseDTO> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if(existingUser) throw new Error(HttpResponse.USER_ALREADYEXIST);
        const hashedPassword = await hashPassword(data.password);

        const newUser = await this.userRepository.create({
            name:    data.fullName,
            email:  data.email,
            phone: data.phone,
            password: hashedPassword,
            role: 'doctor',
            isBlocked: false,
            isVerified: false,
            isDeleted: false
        })

        const existingApp = await this.doctorRepository
        .findApplicationByUserId(newUser._id.toString());
        if(existingApp) throw new Error(HttpResponse.DDOCTOR_ALREADY_APPLIED)

        const  application = await this.doctorRepository.createApplication({
            userId:             new Types.ObjectId(newUser._id.toString()),
            fullName:           data.fullName,
            email:              data.email,
            phone:              data.phone,
            specialization:     data.specialization,
            qualification:      data.qualification,
            experience:         Number(data.experience),
            registrationNumber: data.registrationNumber,
            consultationFee:    data.consultationFee,
            clinicName:         data.clinicName,
            clinicAddress:      data.clinicAddress,
            profileImage:       data.profileImage,
            documents:          data.documents,
            availability:       data.availability,
            status:             'pending',
            isBlocked:          false,
            isVerified:         false,
            isDeleted:          false,
        });


        const rawOTP = generateOTP();
        await this.userRepository.createOtp({
            userId: newUser._id.toString(),
            otpHash: await hashPassword(rawOTP),
            purpose: 'signup',
        })

        await this.emailService.sendOtp(data.email, rawOTP, 'signup');

        const token = generateAccessToken(newUser._id.toString(),'doctor');

        return {
            message: HttpResponse.DOCTOR_APPLICATION_SENT,
            token,
            application: toDoctorApplicationDTO(application),
        };


    }
    async getMyApplication(userId: string): Promise<DoctorApplicationDTO | null> {
        const application = await this.doctorRepository.findApplicationByUserId(userId)
        if(!application) return null;
        return toDoctorApplicationDTO(application)
    }

    async getMyProfile(userId: string): Promise<DoctorProfileDTO | null> {
        const profile = await this.doctorRepository
        .findProfileByUserId(userId)
        if(!profile)return null;
        return toDoctorProfileDTO(profile)
    }

    async getMyStatus(userId: string): Promise<DoctorStatusResponseDTO> {
        const application = await this.doctorRepository
        .findApplicationByUserId(userId)

        if(!application){
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
        }

        return {
            status:  application.status,
            application:   toDoctorApplicationDTO(application),
            rejectionReason: application.rejectionReason,
        }
    }



}