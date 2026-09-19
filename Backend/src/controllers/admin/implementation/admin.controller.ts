import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../container/types.js";
import type { IAdminService } from "../../../services/admin/interface/IAdmin.service.js";
import { IAdminController } from "../interface/IAdmin.controller.js";
import { HttpStatus } from "../../../constants/status.constant.js";
import { DocumentType } from "../../../services/admin/interface/IAdmin.service.js";
import { logger } from "../../../shared/logger/logger.js";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService) private adminService: IAdminService
  ) {}

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await this.adminService.getAllUsers(page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.getAllUsers error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch users" });
      }
    }
  };

  blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const result = await this.adminService.blockUser(userId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.blockUser error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to block user" });
      }
    }
  };

  unblockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const result = await this.adminService.unblockUser(userId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.unblockUser error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to unblock user" });
      }
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const result = await this.adminService.deleteUser(userId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.deleteUser error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete user" });
      }
    }
  };

  // Doctor Management
  getAllDoctors = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await this.adminService.getAllDoctors(page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.getAllDoctors error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch doctors" });
      }
    }
  };

  verifyDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      if (!doctorId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid doctorId" });
        return;
      }
      const adminId = req.user!.userId;
      const dto = req.body;

      if (!["approve", "reject", "more_documents_required", "under_review"].includes(dto.action)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: "Invalid Action",
        });
        return;
      }
      const result = await this.adminService.verifyDoctor(doctorId as string, adminId as string, dto);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.verifyDoctor error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to verify doctor" });
      }
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
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to approve doctor" });
      }
    }
  };

  rejectDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const adminId = req.user!.userId;
      const { rejectionReason } = req.body;
      const result = await this.adminService.rejectDoctor(doctorId as string, adminId as string, rejectionReason);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.rejectDoctor error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to reject doctor" });
      }
    }
  };

  blockDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const result = await this.adminService.blockDoctor(doctorId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.blockDoctor error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to block doctor" });
      }
    }
  };

  unblockDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const result = await this.adminService.unblockDoctor(doctorId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.unblockDoctor error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to unblock doctor" });
      }
    }
  };

  deleteDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = req.params.doctorId || req.params.id;
      const result = await this.adminService.deleteDoctor(doctorId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.deleteDoctor error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete doctor" });
      }
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
        res.status(HttpStatus.BAD_REQUEST).json({
          error: `Invalid document type. Must be one of: ${validTypes.join(", ")}`,
        });
        return;
      }

      const result = await this.adminService.getDoctorDocumentUrl(
        doctorId,
        documentType as DocumentType
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AdminController.getDoctorDocumentUrl error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to generate document URL" });
      }
    }
  };
}
