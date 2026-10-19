import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../container/types.js";
import type { IAdminService } from "../../../services/admin/interface/IAdmin.service.js";
import { IAdminController } from "../interface/IAdmin.controller.js";
import { HttpStatus } from "../../../constants/status.constant.js";
import { HttpResponse } from "../../../constants/messages.constant.js";
import { DocumentType } from "../../../services/admin/interface/IAdmin.service.js";
import { logger } from "../../../shared/logger/logger.js";
import { AppError, ValidationError } from "../../../shared/errors/AppError.js";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService) private adminService: IAdminService
  ) {}

  private handleError(error: unknown, req: Request, res: Response, fallbackMessage: string): void {
    const requestId = req.id || 'N/A';
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error.message,
        errors: error.errors,
        requestId,
      });
      return;
    }
    if (error instanceof Error) {
      const statusCode = (error as any).statusCode || HttpStatus.BAD_REQUEST;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.message,
        requestId,
      });
      return;
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: fallbackMessage || HttpResponse.SERVER_ERROR,
      error: fallbackMessage || HttpResponse.SERVER_ERROR,
      requestId,
    });
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await this.adminService.getAllUsers(page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.getAllUsers error:", error);
      this.handleError(error, req, res, "Failed to fetch user list.");
    }
  };

  blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const result = await this.adminService.blockUser(userId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.blockUser error:", error);
      this.handleError(error, req, res, "Failed to block user.");
    }
  };

  unblockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const result = await this.adminService.unblockUser(userId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.unblockUser error:", error);
      this.handleError(error, req, res, "Failed to unblock user.");
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const result = await this.adminService.deleteUser(userId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.deleteUser error:", error);
      this.handleError(error, req, res, "Failed to remove user.");
    }
  };

  getAllDoctors = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await this.adminService.getAllDoctors(page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.getAllDoctors error:", error);
      this.handleError(error, req, res, "Failed to fetch doctors list.");
    }
  };

  verifyDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      if (!doctorId) {
        throw new ValidationError("Doctor ID is required.");
      }
      const adminId = req.user!.userId;
      const dto = req.body;

      if (!["approve", "reject", "more_documents_required", "under_review"].includes(dto.action)) {
        throw new ValidationError("Invalid doctor verification action.");
      }
      const result = await this.adminService.verifyDoctor(doctorId as string, adminId as string, dto);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.verifyDoctor error:", error);
      this.handleError(error, req, res, "Failed to verify doctor application.");
    }
  };

  approveDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const adminId = req.user!.userId;
      const result = await this.adminService.approveDoctor(doctorId as string, adminId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.approveDoctor error:", error);
      this.handleError(error, req, res, "Failed to approve doctor.");
    }
  };

  rejectDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const adminId = req.user!.userId;
      const { rejectionReason, reason } = req.body;
      const finalReason = rejectionReason || reason;
      const result = await this.adminService.rejectDoctor(doctorId as string, adminId as string, finalReason);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.rejectDoctor error:", error);
      this.handleError(error, req, res, "Failed to reject doctor.");
    }
  };

  blockDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const result = await this.adminService.blockDoctor(doctorId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.blockDoctor error:", error);
      this.handleError(error, req, res, "Failed to block doctor.");
    }
  };

  unblockDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const result = await this.adminService.unblockDoctor(doctorId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.unblockDoctor error:", error);
      this.handleError(error, req, res, "Failed to unblock doctor.");
    }
  };

  deleteDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const result = await this.adminService.deleteDoctor(doctorId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.deleteDoctor error:", error);
      this.handleError(error, req, res, "Failed to remove doctor.");
    }
  };

  getDoctorDocumentUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = (Array.isArray(req.params.doctorId) ? req.params.doctorId[0] : req.params.doctorId) as string;
      const documentType = (Array.isArray(req.params.documentType) ? req.params.documentType[0] : req.params.documentType) as string;

      const validTypes: DocumentType[] = [
        "degreeCertificate",
        "registrationCertificate",
        "governmentId",
      ];
      if (!validTypes.includes(documentType as DocumentType)) {
        throw new ValidationError(`Invalid document type requested.`);
      }

      const result = await this.adminService.getDoctorDocumentUrl(
        doctorId,
        documentType as DocumentType
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.getDoctorDocumentUrl error:", error);
      this.handleError(error, req, res, "Failed to retrieve document URL.");
    }
  };
}
