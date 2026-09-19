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
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../container/types.js";
import { toUserMappedData, toDoctorsMappedData } from "../../../mapper/admin.mapper.js";
import { HttpResponse } from "../../../constants/messages.constant.js";
import { getPresignedUrl } from "../../../utils/s3Upload.js";
let AdminService = class AdminService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async getAllUsers(page, limit) {
        const { users, total } = await this.adminRepository.findAllUsers(page, limit);
        return {
            users: users.map(toUserMappedData),
            totalUsers: total,
            totalPages: Math.ceil(total / limit),
        };
    }
    async blockUser(userId) {
        const user = await this.adminRepository.findUserById(userId);
        if (!user)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        await this.adminRepository.blockUser(userId);
        return { message: HttpResponse.USER_BLOCKED };
    }
    async unblockUser(userId) {
        const user = await this.adminRepository.findUserById(userId);
        if (!user)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        await this.adminRepository.unblockUser(userId);
        return { message: HttpResponse.USER_UNBLOCK_SUCCESS };
    }
    async deleteUser(userId) {
        const user = await this.adminRepository.findUserById(userId);
        if (!user)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        await this.adminRepository.softDeleteUser(userId);
        return { message: HttpResponse.USER_DELETE_SUCCESS };
    }
    // Doctor Management
    async getAllDoctors(page, limit) {
        const { doctors, total } = await this.adminRepository.findAllDoctors(page, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            doctors: doctors.map(toDoctorsMappedData),
            totalDoctors: total,
            totalPages,
            doctorPages: totalPages,
        };
    }
    async verifyDoctor(doctorId, adminId, dto) {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        await this.adminRepository.verifyDoctor(doctorId, dto.action, adminId, dto.remarks);
        const messageMap = {
            approved: HttpResponse.DOCTOR_APPROVED,
            reject: HttpResponse.DOCTOR_REJECTED,
            more_documents_required: "Requested more documents from doctor",
            under_review: "Application moved to under review",
        };
        return {
            message: messageMap[dto.action] || "Doctor status updated",
        };
    }
    async approveDoctor(doctorId, adminId) {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        await this.adminRepository.approveDoctor(doctorId, adminId);
        return { message: HttpResponse.DOCTOR_APPROVED };
    }
    async rejectDoctor(doctorId, _adminId, rejectionReason = "Application rejected by admin") {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        await this.adminRepository.rejectDoctor(doctorId, rejectionReason);
        return { message: HttpResponse.DOCTOR_REJECTED };
    }
    async blockDoctor(doctorId) {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        await this.adminRepository.blockDoctor(doctorId);
        return { message: HttpResponse.DOCTOR_BLOCK_SUCCESS };
    }
    async unblockDoctor(doctorId) {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        await this.adminRepository.unblockDoctor(doctorId);
        return { message: HttpResponse.DOCTOR_UNBLOCK_SUCCESS };
    }
    async deleteDoctor(doctorId) {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        await this.adminRepository.softDeleteDoctor(doctorId);
        return { message: HttpResponse.DOCTOR_DELETE_SUCCESS };
    }
    async getDoctorDocumentUrl(doctorId, documentType) {
        const result = await this.adminRepository.findDoctorById(doctorId);
        if (!result)
            throw new Error(HttpResponse.DOCTOR_NOT_FOUND);
        const { application } = result;
        const keyMap = {
            degreeCertificate: application.degreeCertificateUrl,
            registrationCertificate: application.registrationCertificateUrl,
            governmentId: application.governmentIdUrl,
        };
        const s3Key = keyMap[documentType];
        if (!s3Key) {
            throw new Error(`Document "${documentType}" not found for this application.`);
        }
        const EXPIRY_SECONDS = 600; // 10 minutes
        const url = await getPresignedUrl(s3Key, EXPIRY_SECONDS);
        return {
            url,
            expiresIn: EXPIRY_SECONDS,
            key: s3Key,
        };
    }
};
AdminService = __decorate([
    injectable(),
    __param(0, inject(TYPES.AdminRepository)),
    __metadata("design:paramtypes", [Object])
], AdminService);
export { AdminService };
//# sourceMappingURL=admin.service.js.map