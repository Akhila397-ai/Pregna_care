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
import { HttpStatus } from "../../../constants/status.constant.js";
import { logger } from "../../../shared/logger/logger.js";
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllUsers = async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const result = await this.adminService.getAllUsers(page, limit);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.getAllUsers error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch users" });
            }
        }
    };
    blockUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await this.adminService.blockUser(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.blockUser error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to block user" });
            }
        }
    };
    unblockUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await this.adminService.unblockUser(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.unblockUser error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to unblock user" });
            }
        }
    };
    deleteUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const result = await this.adminService.deleteUser(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.deleteUser error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete user" });
            }
        }
    };
    // Doctor Management
    getAllDoctors = async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const result = await this.adminService.getAllDoctors(page, limit);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.getAllDoctors error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch doctors" });
            }
        }
    };
    verifyDoctor = async (req, res) => {
        try {
            const doctorId = req.params.doctorId || req.params.id;
            if (!doctorId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid doctorId" });
                return;
            }
            const adminId = req.user.userId;
            const dto = req.body;
            if (!["approve", "reject", "more_documents_required", "under_review"].includes(dto.action)) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    error: "Invalid Action",
                });
                return;
            }
            const result = await this.adminService.verifyDoctor(doctorId, adminId, dto);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.verifyDoctor error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to verify doctor" });
            }
        }
    };
    approveDoctor = async (req, res) => {
        try {
            const doctorId = req.params.doctorId || req.params.id;
            const adminId = req.user.userId;
            const result = await this.adminService.approveDoctor(doctorId, adminId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.approveDoctor error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to approve doctor" });
            }
        }
    };
    rejectDoctor = async (req, res) => {
        try {
            const doctorId = req.params.doctorId || req.params.id;
            const adminId = req.user.userId;
            const { rejectionReason } = req.body;
            const result = await this.adminService.rejectDoctor(doctorId, adminId, rejectionReason);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.rejectDoctor error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to reject doctor" });
            }
        }
    };
    blockDoctor = async (req, res) => {
        try {
            const doctorId = req.params.doctorId || req.params.id;
            const result = await this.adminService.blockDoctor(doctorId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.blockDoctor error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to block doctor" });
            }
        }
    };
    unblockDoctor = async (req, res) => {
        try {
            const doctorId = req.params.doctorId || req.params.id;
            const result = await this.adminService.unblockDoctor(doctorId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.unblockDoctor error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to unblock doctor" });
            }
        }
    };
    deleteDoctor = async (req, res) => {
        try {
            const doctorId = req.params.doctorId || req.params.id;
            const result = await this.adminService.deleteDoctor(doctorId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.deleteDoctor error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete doctor" });
            }
        }
    };
    getDoctorDocumentUrl = async (req, res) => {
        try {
            const doctorId = (Array.isArray(req.params.doctorId) ? req.params.doctorId[0] : req.params.doctorId);
            const documentType = (Array.isArray(req.params.documentType) ? req.params.documentType[0] : req.params.documentType);
            const validTypes = [
                "degreeCertificate",
                "registrationCertificate",
                "governmentId",
            ];
            if (!validTypes.includes(documentType)) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    error: `Invalid document type. Must be one of: ${validTypes.join(", ")}`,
                });
                return;
            }
            const result = await this.adminService.getDoctorDocumentUrl(doctorId, documentType);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AdminController.getDoctorDocumentUrl error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to generate document URL" });
            }
        }
    };
};
AdminController = __decorate([
    injectable(),
    __param(0, inject(TYPES.AdminService)),
    __metadata("design:paramtypes", [Object])
], AdminController);
export { AdminController };
//# sourceMappingURL=admin.controller.js.map