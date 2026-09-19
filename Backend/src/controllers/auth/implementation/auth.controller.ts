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

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAUthService
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.register(name, email, password);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.register error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Registration failed. Please try again." });
      }
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, purpose } = req.body;
      const result = await this.authService.verifyOtp(email, otp, purpose);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.verifyOtp error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "OTP verification failed" });
      }
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
      const statusCode = (error as any)?.statusCode || HttpStatus.BAD_REQUEST;
      if (error instanceof Error) {
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Login failed" });
      }
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.forgotPassword error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Unable to process request" });
      }
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { newPassword } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HttpStatus.FORBIDDEN).json({
          message: HttpResponse.FORBIDDEN,
        });
        return;
      }

      const result = await this.authService.resetPassword(userId, newPassword);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.resetPassword error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Password reset failed" });
      }
    }
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, purpose } = req.body;
      const result = await this.authService.resendOtp(email, purpose);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.resendOtp error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to resend OTP" });
      }
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
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Unable to refresh token" });
      }
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
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Onboarding update failed" });
      }
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.getMe(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error("AuthController.getMe error:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to retrieve user" });
      }
    }
  };
}