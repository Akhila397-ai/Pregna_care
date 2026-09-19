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
import { HttpResponse } from "../../../constants/messages.constant.js";
import { REFRESH_COOKIE_OPTIONS } from "../../../constants/cookie.constant.js";
import { logger } from "../../../shared/logger/logger.js";
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.register(name, email, password);
            res.status(HttpStatus.CREATED).json(result);
        }
        catch (error) {
            logger.error("AuthController.register error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Registration failed. Please try again." });
            }
        }
    };
    verifyOtp = async (req, res) => {
        try {
            const { email, otp, purpose } = req.body;
            const result = await this.authService.verifyOtp(email, otp, purpose);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.verifyOtp error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "OTP verification failed" });
            }
        }
    };
    login = async (req, res) => {
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
        }
        catch (error) {
            logger.error("AuthController.login error:", error);
            const statusCode = error?.statusCode || HttpStatus.BAD_REQUEST;
            if (error instanceof Error) {
                res.status(statusCode).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Login failed" });
            }
        }
    };
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.forgotPassword error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Unable to process request" });
            }
        }
    };
    resetPassword = async (req, res) => {
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
        }
        catch (error) {
            logger.error("AuthController.resetPassword error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Password reset failed" });
            }
        }
    };
    resendOtp = async (req, res) => {
        try {
            const { email, purpose } = req.body;
            const result = await this.authService.resendOtp(email, purpose);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.resendOtp error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to resend OTP" });
            }
        }
    };
    refreshToken = async (req, res) => {
        try {
            const userId = req.user.userId;
            const result = await this.authService.refreshToken(userId);
            if (result.refreshToken) {
                res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
            }
            res.status(HttpStatus.OK).json({
                user: result.user,
                token: result.token,
            });
        }
        catch (error) {
            logger.error("AuthController.refreshToken error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Unable to refresh token" });
            }
        }
    };
    setOnboarding = async (req, res) => {
        try {
            const userId = req.user.userId;
            const { onboardingType } = req.body;
            const result = await this.authService.setOnboarding(userId, onboardingType);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.setOnboarding error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Onboarding update failed" });
            }
        }
    };
    getMe = async (req, res) => {
        try {
            const userId = req.user.userId;
            const result = await this.authService.getMe(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.getMe error:", error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to retrieve user" });
            }
        }
    };
};
AuthController = __decorate([
    injectable(),
    __param(0, inject(TYPES.AuthService)),
    __metadata("design:paramtypes", [Object])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map