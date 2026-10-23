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
import { logger } from "../../../shared/logger/logger.js";
import { AppError, UnauthorizedError } from "../../../shared/errors/AppError.js";
import { CLEAR_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "../../../constants/cookie.constant.js";
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    handleError(error, req, res, fallbackMessage) {
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
            const statusCode = error.statusCode || HttpStatus.BAD_REQUEST;
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
    register = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.register(name, email, password);
            res.status(HttpStatus.CREATED).json(result);
        }
        catch (error) {
            logger.error("AuthController.register error:", error);
            this.handleError(error, req, res, "Registration failed. Please try again.");
        }
    };
    verifyOtp = async (req, res) => {
        try {
            const { email, otp, purpose } = req.body;
            const result = await this.authService.verifyOtp(email, otp, purpose);
            if ("refreshToken" in result && result.refreshToken) {
                const { refreshToken, ...safeResult } = result;
                res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
                res.status(HttpStatus.OK).json(safeResult);
                return;
            }
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.verifyOtp error:", error);
            this.handleError(error, req, res, "Verification failed. Please try again.");
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
            this.handleError(error, req, res, "Login failed. Please check your credentials.");
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
            this.handleError(error, req, res, "Unable to process password reset request.");
        }
    };
    resetPassword = async (req, res) => {
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
        }
        catch (error) {
            logger.error("AuthController.resetPassword error:", error);
            this.handleError(error, req, res, "Password reset failed. Please try again.");
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
            this.handleError(error, req, res, "Failed to resend verification code.");
        }
    };
    refreshToken = async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (typeof refreshToken !== "string" || !refreshToken) {
                throw new UnauthorizedError(HttpResponse.UNAUTHORIZED);
            }
            const result = await this.authService.refreshToken(refreshToken);
            if (!result.refreshToken) {
                throw new UnauthorizedError(HttpResponse.UNAUTHORIZED);
            }
            res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
            res.status(HttpStatus.OK).json({
                user: result.user,
                token: result.token,
            });
        }
        catch (error) {
            logger.error("AuthController.refreshToken error:", error);
            this.handleError(error, req, res, "Unable to refresh session.");
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
            this.handleError(error, req, res, "Onboarding journey update failed.");
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
            this.handleError(error, req, res, "Failed to retrieve user information.");
        }
    };
    setPregnancyLMP = async (req, res) => {
        try {
            const userId = req.user.userId;
            const { lmpDate } = req.body;
            const result = await this.authService.setPregnancyLMP(userId, lmpDate);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.setPregnancyLMP error:", error);
            this.handleError(error, req, res, "Failed to update pregnancy LMP.");
        }
    };
    getPregnancyDetails = async (req, res) => {
        try {
            const userId = req.user.userId;
            const result = await this.authService.getPregnancyDetails(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.getPregnancyDetails error:", error);
            this.handleError(error, req, res, "Failed to fetch pregnancy details.");
        }
    };
    setCycleInfo = async (req, res) => {
        try {
            const userId = req.user.userId;
            const { periodStartDate, cycleLength, periodLength } = req.body;
            const result = await this.authService.setCycleInfo(userId, periodStartDate, cycleLength, periodLength);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.setCycleInfo error:", error);
            this.handleError(error, req, res, "Failed to update cycle information.");
        }
    };
    getCycleDetails = async (req, res) => {
        try {
            const userId = req.user.userId;
            const result = await this.authService.getCycleDetails(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error("AuthController.getCycleDetails error:", error);
            this.handleError(error, req, res, "Failed to fetch cycle details.");
        }
    };
    getEmergencyContacts = async (req, res) => {
        try {
            const userId = req.user.userId;
            const result = await this.authService.getEmergencyContacts(userId);
            res.status(HttpStatus.OK).json({ emergencyContacts: result });
        }
        catch (error) {
            logger.error("AuthController.getEmergencyContacts error:", error);
            this.handleError(error, req, res, "Failed to retrieve emergency contacts.");
        }
    };
    addEmergencyContact = async (req, res) => {
        try {
            const userId = req.user.userId;
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
        }
        catch (error) {
            logger.error("AuthController.addEmergencyContact error:", error);
            this.handleError(error, req, res, "Failed to add emergency contact.");
        }
    };
    updateEmergencyContact = async (req, res) => {
        try {
            const userId = req.user.userId;
            const contactId = req.params.contactId;
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
        }
        catch (error) {
            logger.error("AuthController.updateEmergencyContact error:", error);
            this.handleError(error, req, res, "Failed to update emergency contact.");
        }
    };
    deleteEmergencyContact = async (req, res) => {
        try {
            const userId = req.user.userId;
            const contactId = req.params.contactId;
            const result = await this.authService.deleteEmergencyContact(userId, contactId);
            res.status(HttpStatus.OK).json({
                message: "Emergency contact removed successfully.",
                emergencyContacts: result,
            });
        }
        catch (error) {
            logger.error("AuthController.deleteEmergencyContact error:", error);
            this.handleError(error, req, res, "Failed to remove emergency contact.");
        }
    };
    logout = async (req, res) => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            const result = await this.authService.logout(typeof refreshToken === 'string' ? refreshToken : undefined);
            res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);
            logger.error('AuthController.logout error:', error);
            this.handleError(error, req, res, "Logout Failed.Please try again");
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