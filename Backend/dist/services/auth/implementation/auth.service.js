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
import { toUserAuthDTO } from "../../../mapper/user.mapper.js";
import { hashPassword, comparePassword } from "../../../utils/hashPassword.js";
import { generateOTP } from "../../../utils/generateOtp.js";
import { generateAccessToken, generateRefreshToken, generateResetToken } from "../../../utils/jwt.js";
import { HttpResponse } from "../../../constants/messages.constant.js";
import { ROLE_PORTAL_NAMES } from "../../../types/roles.js";
let AuthService = class AuthService {
    userRepository;
    otpRepository;
    emailService;
    constructor(userRepository, otpRepository, emailService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }
    async register(name, email, password) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing)
            throw new Error(HttpResponse.EMAIL_ALREADY_EXISTS);
        const hashedPassword = await hashPassword(password);
        const newUser = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            isBlocked: false,
            isVerified: false,
        });
        await this._sendOTP(newUser._id.toString(), email, "signup");
        return { message: HttpResponse.REGISTER_SUCCESS, expiresIn: 300 };
    }
    async verifyOtp(email, otp, purpose) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error(HttpResponse.USER_NOT_FOUND);
        }
        await this._verifyOtp(user._id.toString(), purpose, otp);
        if (purpose === "signup") {
            await this.userRepository.markVerified(user._id.toString());
            const accessToken = generateAccessToken(user._id.toString(), user.role);
            return {
                user: toUserAuthDTO(user),
                token: accessToken,
            };
        }
        if (purpose === "forgot_password") {
            const resetToken = generateResetToken(user._id.toString());
            return {
                token: resetToken,
            };
        }
        throw new Error("Invalid OTP purpose");
    }
    async login(data) {
        const { email, password, expectedRole } = data;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error(HttpResponse.USER_NOT_FOUND);
        }
        if (user.isBlocked) {
            throw new Error(HttpResponse.USER_BLOCKED);
        }
        if (!user.isVerified) {
            throw new Error(HttpResponse.UNAUTHORIZED);
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error(HttpResponse.INVALID_PASSWORD);
        }
        if (user.role !== expectedRole) {
            const portalMessage = this._getPortalErrorMessage(user.role, expectedRole);
            const error = new Error(portalMessage);
            error.statusCode = 403;
            throw error;
        }
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());
        return {
            user: toUserAuthDTO(user),
            token: accessToken,
            refreshToken,
        };
    }
    _getPortalErrorMessage(actualRole, expectedRole) {
        const correctPortal = ROLE_PORTAL_NAMES[actualRole] || "appropriate login portal";
        if (expectedRole === "admin") {
            return `Access denied. Admin portal is for administrators only. Please use the ${correctPortal}.`;
        }
        if (expectedRole === "doctor") {
            return `Access denied. Doctor portal is for verified doctors only. Please use the ${correctPortal}.`;
        }
        if (expectedRole === "user") {
            return `Access denied. This portal is for patients only. Please use the ${correctPortal}.`;
        }
        return HttpResponse.FORBIDDEN;
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error(HttpResponse.USER_NOT_FOUND);
        }
        await this._sendOTP(user._id.toString(), email, "forgot_password");
        return {
            message: HttpResponse.FORGOT_PASSWORD_SENT,
            expiresIn: 300,
        };
    }
    async resetPassword(userId, newPassword) {
        const hash = await hashPassword(newPassword);
        await this.userRepository.updatePassword(userId, hash);
        return {
            message: HttpResponse.PASSWORD_RESET_SUCCESSFULL,
        };
    }
    async resendOtp(email, purpose) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error(HttpResponse.USER_NOT_FOUND);
        }
        await this._sendOTP(user._id.toString(), email, purpose);
        return {
            message: HttpResponse.OTP_RESENT,
            expiresIn: 300,
        };
    }
    async refreshToken(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        if (user.isBlocked)
            throw new Error(HttpResponse.USER_BLOCKED);
        if (user.isDeleted)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());
        return { user: toUserAuthDTO(user), token: accessToken, refreshToken };
    }
    async setOnboarding(userId, onboardingType) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        await this.userRepository.setOnboarding(userId, onboardingType);
        return { message: "onboarding updated successfully" };
    }
    async getMe(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        if (user.isBlocked)
            throw new Error(HttpResponse.USER_BLOCKED);
        if (user.isDeleted)
            throw new Error(HttpResponse.USER_NOT_FOUND);
        return toUserAuthDTO(user);
    }
    async _sendOTP(userId, email, purpose) {
        await this.otpRepository.invalidateAllOTPs(userId, purpose);
        const rawOtp = generateOTP();
        const otpHash = await hashPassword(rawOtp);
        await this.otpRepository.createOtp({
            userId,
            otpHash,
            purpose,
        });
        await this.emailService.sendOtp(email, rawOtp, purpose);
    }
    async _verifyOtp(userId, purpose, submittedOtp) {
        const otp = await this.otpRepository.findActiveOtp(userId, purpose);
        if (!otp)
            throw new Error(HttpResponse.OTP_EXPIRED_OR_INVALID);
        const updated = await this.otpRepository.incrementOTPAttempts(otp._id.toString());
        if (!updated) {
            throw new Error(HttpResponse.OTP_EXPIRED_OR_INVALID);
        }
        if (updated.attempts > 3) {
            await this.otpRepository.markOtpAsUsed(otp._id.toString());
            throw new Error(HttpResponse.OTP_MAX_ATTEMPTS);
        }
        const valid = await comparePassword(submittedOtp, otp.otpHash);
        if (!valid) {
            const left = 3 - updated.attempts;
            throw new Error(`${HttpResponse.OTP_EXPIRED_OR_INVALID}, only ${left} attempts left..`);
        }
        await this.otpRepository.markOtpAsUsed(otp._id.toString());
    }
};
AuthService = __decorate([
    injectable(),
    __param(0, inject(TYPES.UserRepository)),
    __param(1, inject(TYPES.OtpRepository)),
    __param(2, inject(TYPES.EmailService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map