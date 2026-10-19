import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../container/types.js";
import type { IAUthService } from "../../../services/auth/interface/IAuth.service.js";
import { IAuthController } from "../interface/IAuth.controller.js";
import { HttpStatus } from "../../../constants/status.constant.js";
import { HttpResponse } from "../../../constants/messages.constant.js";
import { REFRESH_COOKIE_OPTIONS } from "../../../constants/cookie.constant.js";
import { logger } from "../../../shared/logger/logger.js";
import { AppError } from "../../../shared/errors/AppError.js";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAUthService
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

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.register(name, email, password);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.register error:", error);
      this.handleError(error, req, res, "Registration failed. Please try again.");
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, purpose } = req.body;
      const result = await this.authService.verifyOtp(email, otp, purpose);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.verifyOtp error:", error);
      this.handleError(error, req, res, "Verification failed. Please try again.");
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, expectedRole } = req.body;
      const result = await this.authService.login({ email, password, expectedRole });

      if (result.refreshToken) {
        res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
      }

      res.status(HttpStatus.OK).json({
        user: result.user,
        token: result.token,
      });
    } catch (error: unknown) {
      logger.error("AuthController.login error:", error);
      this.handleError(error, req, res, "Login failed. Please check your credentials.");
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.forgotPassword error:", error);
      this.handleError(error, req, res, "Unable to process password reset request.");
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { newPassword } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: HttpResponse.FORBIDDEN,
          error: HttpResponse.FORBIDDEN,
          requestId: req.id || 'N/A',
        });
        return;
      }

      const result = await this.authService.resetPassword(userId, newPassword);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.resetPassword error:", error);
      this.handleError(error, req, res, "Password reset failed. Please try again.");
    }
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, purpose } = req.body;
      const result = await this.authService.resendOtp(email, purpose);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.resendOtp error:", error);
      this.handleError(error, req, res, "Failed to resend verification code.");
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.refreshToken(userId);

      if (result.refreshToken) {
        res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
      }

      res.status(HttpStatus.OK).json({
        user: result.user,
        token: result.token,
      });
    } catch (error: unknown) {
      logger.error("AuthController.refreshToken error:", error);
      this.handleError(error, req, res, "Unable to refresh session.");
    }
  };

  setOnboarding = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { onboardingType } = req.body;
      const result = await this.authService.setOnboarding(userId, onboardingType);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.setOnboarding error:", error);
      this.handleError(error, req, res, "Onboarding journey update failed.");
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.getMe(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.getMe error:", error);
      this.handleError(error, req, res, "Failed to retrieve user information.");
    }
  };

  setPregnancyLMP = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { lmpDate } = req.body;
      const result = await this.authService.setPregnancyLMP(userId, lmpDate);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.setPregnancyLMP error:", error);
      this.handleError(error, req, res, "Failed to update pregnancy LMP.");
    }
  };

  getPregnancyDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.getPregnancyDetails(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.getPregnancyDetails error:", error);
      this.handleError(error, req, res, "Failed to fetch pregnancy details.");
    }
  };

  setCycleInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { periodStartDate, cycleLength, periodLength } = req.body;
      const result = await this.authService.setCycleInfo(
        userId,
        periodStartDate,
        cycleLength,
        periodLength
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.setCycleInfo error:", error);
      this.handleError(error, req, res, "Failed to update cycle information.");
    }
  };

  getCycleDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.getCycleDetails(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.getCycleDetails error:", error);
      this.handleError(error, req, res, "Failed to fetch cycle details.");
    }
  };

  getEmergencyContacts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.getEmergencyContacts(userId);
      res.status(HttpStatus.OK).json({ emergencyContacts: result });
    } catch (error: unknown) {
      logger.error("AuthController.getEmergencyContacts error:", error);
      this.handleError(error, req, res, "Failed to retrieve emergency contacts.");
    }
  };

  addEmergencyContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { name, phoneNumber, relationship } = req.body;
      const result = await this.authService.addEmergencyContact(userId, {
        name,
        phoneNumber,
        relationship,
      });
      res.status(HttpStatus.OK).json({
        message: "Emergency contact added successfully.",
        emergencyContacts: result,
      });
    } catch (error: unknown) {
      logger.error("AuthController.addEmergencyContact error:", error);
      this.handleError(error, req, res, "Failed to add emergency contact.");
    }
  };

  updateEmergencyContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const contactId = req.params.contactId as string;
      const { name, phoneNumber, relationship } = req.body;
      const result = await this.authService.updateEmergencyContact(userId, contactId, {
        name,
        phoneNumber,
        relationship,
      });
      res.status(HttpStatus.OK).json({
        message: "Emergency contact updated successfully.",
        emergencyContacts: result,
      });
    } catch (error: unknown) {
      logger.error("AuthController.updateEmergencyContact error:", error);
      this.handleError(error, req, res, "Failed to update emergency contact.");
    }
  };

  deleteEmergencyContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const contactId = req.params.contactId as string;
      const result = await this.authService.deleteEmergencyContact(userId, contactId);
      res.status(HttpStatus.OK).json({
        message: "Emergency contact removed successfully.",
        emergencyContacts: result,
      });
    } catch (error: unknown) {
      logger.error("AuthController.deleteEmergencyContact error:", error);
      this.handleError(error, req, res, "Failed to remove emergency contact.");
    }
  };
}