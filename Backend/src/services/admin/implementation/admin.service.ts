import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { TYPES } from '../../../container/types.js'
import type { IAdminService } from '../interface/IAdmin.service.js'
import type { IAdminRepository } from '../../../repositories/admin/interface/IAdmin.repository.js'
import { toAdminAuthDTO,toUserMappedData,toDoctorMappedData } from '../../../mapper/admin.mapper.js'
import { HttpResponse } from '../../../constants/messages.constant.js'
import { HttpStatus } from '../../../constants/status.constant.js'
import { privateDecrypt } from 'node:crypto'
import { MessageResponseDTO } from '../../../dtos/auth.dto.js'
import { GetMappedDoctorsResponse, GetMappedUsersResponse } from '../../../dtos/admin.dto.js'


injectable()
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
        const { doctors, total} = await this.adminRepository.findAllDoctors(
            page, limit
        );
        return {
          doctors: doctors.map(toDoctorMappedData),
          totalDoctors: total,
          totalPages: Math.ceil(total/limit)
        }
    }

    async approveDoctor(doctorId: string): Promise<MessageResponseDTO> {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if(!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
        await this.adminRepository.approveDoctor(doctorId);
        return {message: HttpResponse.DOCTOR_APPROVED}
    }

    async rejectDoctor(doctorId: string): Promise<MessageResponseDTO> {
        const doctor = await this.adminRepository.findDoctorById(doctorId)
        if(!doctor) throw new Error(HttpResponse.DOCTOR_NOT_FOUND)
        await this.adminRepository.rejectDoctor(doctorId)
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
        await  this.adminRepository.delete(doctorId)
        return {message: HttpResponse.DOCTOR_DELETE_SUCCESS}
    }

}