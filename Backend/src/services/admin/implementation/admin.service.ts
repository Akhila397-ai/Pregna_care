import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { TYPES } from '../../../container/types.js'
import type { IAdminService } from '../interface/IAdmin.service.js'
import type { IAdminRepository } from '../../../repositories/admin/interface/IAdmin.repository.js'
import { toAdminAuthDTO,toUserMappedData,toDoctorsMappedData} from '../../../mapper/admin.mapper.js'
import { HttpResponse } from '../../../constants/messages.constant.js'
import { HttpStatus } from '../../../constants/status.constant.js'
import { privateDecrypt } from 'node:crypto'
import { MessageResponseDTO } from '../../../dtos/auth.dto.js'
import { GetMappedDoctorsResponse, GetMappedUsersResponse } from '../../../dtos/admin.dto.js'
import { getPresignedUrl } from '../../../utils/s3Upload.js'
import { VerifyDoctorDTO, } from '../../../dtos/admin.dto.js'
import { DoctorStatus, DoctorApplicationWithUser,DoctorApplicationDocument} from '../../../types/doctor.js'
import { application } from 'express'
import { DocumentType } from '../interface/IAdmin.service.js'
import { DocumentPresignedUrlDTO } from '../../../dtos/admin.dto.js'
import { PresignedURI } from 'aws-sdk/clients/iotanalytics.js'
import { toDoctorApplicationDTO } from '../../../mapper/doctor.mapper.js'


@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository,
    ){}

    async getAllUsers(page: number, limit: number): Promise<GetMappedUsersResponse> {
        const { users, total} = await this.adminRepository.findAllUsers(
            page, limit
        );
        return {
            users: users.map(toUserMappedData),
            totalUsers: total,
            totalPages: Math.ceil(total/ limit)
        }
    }

    async blockUser(userId: string): Promise<MessageResponseDTO> {
        const user = await this.adminRepository.findUserById(userId);
        if(!user) throw new Error(HttpResponse.USER_NOT_FOUND)
        await this.adminRepository.blockUser(userId)
        return { message: HttpResponse.USER_BLOCKED}
    }

    async unblockUser(userId: string): Promise<MessageResponseDTO> {
        const user = await this.adminRepository.findUserById(userId)
        if(!user) throw new Error(HttpResponse.USER_NOT_FOUND)
        await this.adminRepository.unblockUser(userId);
        return { message: HttpResponse.USER_UNBLOCK_SUCCESS}
    }

    
    async deleteUser(userId: string): Promise<MessageResponseDTO> {
        const user = await this.adminRepository.findUserById(userId)
        if(!user) throw new Error(HttpResponse.USER_NOT_FOUND)
        await this.adminRepository.softDeleteUser(userId)
        return {message: HttpResponse.USER_DELETE_SUCCESS}
    }

    //doctor managment

    async getAllDoctors(page: number, limit: number): Promise<GetMappedDoctorsResponse> {
       const { doctors:items, total} = await this.adminRepository
       .findAllDoctors(page,limit)

    const doctors = items.map(toDoctorsMappedData)


       return {
        doctors,
        totalDoctors: total,
        totalPages: Math.ceil(total/limit)
       }
    }

async verifyDoctor(doctorId: string, adminId: string,dto: VerifyDoctorDTO): Promise<MessageResponseDTO> {
    const doctor = await this.adminRepository.findDoctorById(doctorId);
    if (!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND);

    const statusMap: Record<VerifyDoctorDTO['action'], DoctorStatus> = {
      approve:                 'approved',
      reject:                  'rejected',
      more_documents_required: 'more_documents_required',
      under_review:            'under_review',
    };
     const status = statusMap[dto.action];

    await this.adminRepository.verifyDoctor(
      doctorId, status, adminId, dto.remarks
    );

    const messageMap: Record<VerifyDoctorDTO['action'], string> = {
      approve:                 HttpResponse.DOCTOR_APPROVED,
      reject:                  HttpResponse.DOCTOR_REJECTED,
      more_documents_required: 'Requested more documents from doctor.',
      under_review:            'Application moved to under review.',
    };

    return { message: messageMap[dto.action] };

}

    async approveDoctor(
    doctorId: string,
    adminId: string
): Promise<MessageResponseDTO> {

    const doctor = await this.adminRepository.findDoctorById(doctorId);
    if (!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND);

    await this.adminRepository.approveDoctor(doctorId, adminId);

    return { message: HttpResponse.DOCTOR_APPROVED };
}

    async rejectDoctor(doctorId: string,adminId: string): Promise<MessageResponseDTO> {
        const doctor = await this.adminRepository.findDoctorById(doctorId)
        if(!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
        await this.adminRepository.rejectDoctor(doctorId,adminId)
        return {message: HttpResponse.DOCTOR_REJECTED}
    }

    async blockDoctor(doctorId: string): Promise<MessageResponseDTO> {
        const doctor = await this.adminRepository.findDoctorById(doctorId)
        if(!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
        await this.adminRepository.blockDoctor(doctorId)
        return {message: HttpResponse.DOCTOR_BLOCK_SUCCESS}
    }

    async unblockDoctor(doctorId: string): Promise<MessageResponseDTO> {
        const doctor = await this.adminRepository.findDoctorById(doctorId)
        if(!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
        await this.adminRepository.unblockDoctor(doctorId)
        return { message: HttpResponse.DOCTOR_UNBLOCK_SUCCESS}
    }
    async deleteDoctor(doctorId: string): Promise<MessageResponseDTO> {
        const doctor = await this.adminRepository.findDoctorById(doctorId)
        if(!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
        await  this.adminRepository.softDeleteDoctor(doctorId)
        return {message: HttpResponse.DOCTOR_DELETE_SUCCESS}
    }

    private async _resolvePresignedUrls(application: any) {
    const [degreeUrl, regUrl, govUrl] = await Promise.all([
      application.degreeCertificateUrl
        ? getPresignedUrl(application.degreeCertificateUrl)
        : undefined,
      application.registrationCertificateUrl
        ? getPresignedUrl(application.registrationCertificateUrl)
        : undefined,
      application.governmentIdUrl
        ? getPresignedUrl(application.governmentIdUrl)
        : undefined,
    ]);
    return {
      degreeCertificateUrl:       degreeUrl,
      registrationCertificateUrl: regUrl,
      governmentIdUrl:            govUrl,
    };
  }
  async getDoctorDocumentUrl(doctorId: string, documentType: DocumentType): Promise<DocumentPresignedUrlDTO> {
      const result = await this.adminRepository.findDoctorById(doctorId);
  if (!result) throw new Error(HttpResponse.DOCTOR_NOT_FOUND);

  const { application } = result;

  // ← get the correct S3 key based on document type
  const keyMap: Record< DocumentType, string | undefined> = {
    degreeCertificate:       application.degreeCertificateUrl,
    registrationCertificate: application.registrationCertificateUrl,
    governmentId:            application.governmentIdUrl,
  };

  const s3Key = keyMap[documentType];
  if (!s3Key) {
    throw new Error(
      `Document "${documentType}" not found for this application.`
    );
  }

  // ← generate FRESH presigned URL with 10 min expiry
  const EXPIRY_SECONDS = 600; // 10 minutes
  const url = await getPresignedUrl(s3Key, EXPIRY_SECONDS);
  
    return {
    url,
    expiresIn: EXPIRY_SECONDS,
    key:       s3Key,
  };
}
}

