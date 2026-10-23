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
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from "../../../utils/jwt.js";
import { HttpResponse } from "../../../constants/messages.constant.js";
import { OTP_EXPIRY_MS } from "../../../constants/otp.constant.js";
import { ConflictError, UnauthorizedError, ForbiddenError, NotFoundError, ValidationError, } from "../../../shared/errors/AppError.js";
import { ROLE_PORTAL_NAMES } from "../../../types/roles.js";
import { toEmergencyContactDTO } from "../../../mapper/user.mapper.js";
import { hashRefreshToken } from "../../../utils/hashRefreshToken.js";
let AuthService = class AuthService {
    userRepository;
    otpRepository;
    emailService;
    doctorRepository;
    constructor(userRepository, otpRepository, emailService, doctorRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.doctorRepository = doctorRepository;
    }
    async register(name, email, password) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing)
            throw new ConflictError(HttpResponse.EMAIL_ALREADY_EXISTS);
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
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        }
        await this._verifyOtp(user._id.toString(), purpose, otp);
        if (purpose === "signup") {
            await this.userRepository.markVerified(user._id.toString());
            const userId = user._id.toString();
            const accessToken = generateAccessToken(userId, user.role);
            const refreshToken = generateRefreshToken(userId);
            const stored = await this.userRepository.setRefreshTokenHash(userId, hashRefreshToken(refreshToken));
            if (!stored) {
                throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
            }
            return {
                user: toUserAuthDTO(user),
                token: accessToken,
                refreshToken,
            };
        }
        if (purpose === "forgot_password") {
            const resetToken = generateResetToken(user._id.toString());
            return {
                token: resetToken,
            };
        }
        throw new ValidationError("Invalid verification purpose specified.");
    }
    async login(data) {
        const { email, password, expectedRole } = data;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError(HttpResponse.INVALID_CREDENTIALS);
        }
        if (user.isBlocked) {
            throw new ForbiddenError(HttpResponse.USER_BLOCKED);
        }
        if (!user.isVerified) {
            throw new UnauthorizedError(HttpResponse.VERIFY_YOUR_ACCOUNT);
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError(HttpResponse.INVALID_CREDENTIALS);
        }
        // Role & Portal Access Validation
        if (expectedRole === "doctor") {
            const doctorAppWithUser = await this.doctorRepository.findApplicationByUserId(user._id.toString());
            if (!doctorAppWithUser) {
                const portalMessage = this._getPortalErrorMessage(user.role, expectedRole);
                throw new ForbiddenError(portalMessage);
            }
            const appStatus = doctorAppWithUser.application.status;
            if (appStatus === "approved") {
                if (doctorAppWithUser.application.isBlocked) {
                    throw new ForbiddenError(HttpResponse.USER_BLOCKED);
                }
                if (user.role !== "doctor") {
                    await this.userRepository.updateRole(user._id.toString(), "doctor");
                    user.role = "doctor";
                }
            }
            else if (appStatus === "rejected") {
                throw new ForbiddenError("Access denied. Your doctor application has been rejected.");
            }
            else {
                // 'pending', 'under_review', 'more_documents_required'
                throw new ForbiddenError("Access denied. Your doctor application is awaiting admin review.");
            }
        }
        else {
            // If user has an approved doctor application and tries to log in via patient login
            if (expectedRole === "user" && user.role !== "doctor") {
                const doctorAppWithUser = await this.doctorRepository.findApplicationByUserId(user._id.toString());
                if (doctorAppWithUser?.application.status === "approved") {
                    await this.userRepository.updateRole(user._id.toString(), "doctor");
                    user.role = "doctor";
                }
            }
            if (user.role !== expectedRole) {
                const portalMessage = this._getPortalErrorMessage(user.role, expectedRole);
                throw new ForbiddenError(portalMessage);
            }
        }
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());
        const stored = await this.userRepository.setRefreshTokenHash(user._id.toString(), hashRefreshToken(refreshToken));
        if (!stored) {
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        }
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
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
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
            message: HttpResponse.PASSWORD_RESET_SUCCESSFUL,
        };
    }
    async resendOtp(email, purpose) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        }
        await this._sendOTP(user._id.toString(), email, purpose);
        return {
            message: HttpResponse.OTP_RESENT,
            expiresIn: 300,
        };
    }
    async refreshToken(refreshTokenValue) {
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshTokenValue);
        }
        catch {
            throw new UnauthorizedError(HttpResponse.UNAUTHORIZED);
        }
        const userId = decoded.userId;
        const user = await this.userRepository.findById(userId);
        if (!user || user.isDeleted || !user.isVerified) {
            throw new UnauthorizedError(HttpResponse.UNAUTHORIZED);
        }
        if (user.isBlocked) {
            throw new ForbiddenError(HttpResponse.USER_BLOCKED);
        }
        const currentHash = hashRefreshToken(refreshTokenValue);
        const storedHash = await this.userRepository.getRefreshToken(userId);
        if (!storedHash || storedHash !== currentHash) {
            throw new UnauthorizedError(HttpResponse.UNAUTHORIZED);
        }
        const nextRefreshToken = generateRefreshToken(userId);
        const nextHash = hashRefreshToken(nextRefreshToken);
        const rotated = await this.userRepository.rotateRefreshTokenHash(userId, currentHash, nextHash);
        if (!rotated) {
            throw new UnauthorizedError(HttpResponse.UNAUTHORIZED);
        }
        const accessToken = generateAccessToken(userId, user.role);
        return {
            user: toUserAuthDTO(user),
            token: accessToken,
            refreshToken: nextRefreshToken
        };
    }
    async setOnboarding(userId, onboardingType) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        await this.userRepository.setOnboarding(userId, onboardingType);
        return { message: "Onboarding journey updated successfully." };
    }
    async getMe(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        if (user.isBlocked)
            throw new ForbiddenError(HttpResponse.USER_BLOCKED);
        if (user.isDeleted)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        return toUserAuthDTO(user);
    }
    _parseDateOnly(dateInput) {
        if (typeof dateInput === 'string') {
            const trimmed = dateInput.trim();
            const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
            if (match) {
                const y = parseInt(match[1], 10);
                const m = parseInt(match[2], 10) - 1;
                const d = parseInt(match[3], 10);
                const utcTimestamp = Date.UTC(y, m, d);
                if (!isNaN(utcTimestamp)) {
                    return { utcTimestamp, date: new Date(utcTimestamp) };
                }
            }
        }
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) {
            throw new ValidationError("Please enter a valid date.");
        }
        const utcTimestamp = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        return { utcTimestamp, date: new Date(utcTimestamp) };
    }
    async setPregnancyLMP(userId, lmpDateStr) {
        if (!lmpDateStr || !lmpDateStr.trim()) {
            throw new ValidationError("Please enter your last menstrual period date.");
        }
        const { utcTimestamp, date: parsedDate } = this._parseDateOnly(lmpDateStr);
        const now = new Date();
        const currentUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        if (utcTimestamp > currentUtc) {
            throw new ValidationError("LMP cannot be a future date.");
        }
        const maxPastTime = 42 * 7 * 24 * 60 * 60 * 1000;
        if (currentUtc - utcTimestamp > maxPastTime) {
            throw new ValidationError("LMP date cannot be more than 42 weeks ago.");
        }
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        await this.userRepository.setPregnancyLMP(userId, parsedDate);
        return this._calculatePregnancyDetails(parsedDate);
    }
    async getPregnancyDetails(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        if (!user.lmpDate)
            return null;
        return this._calculatePregnancyDetails(user.lmpDate);
    }
    async setCycleInfo(userId, periodStartDateStr, cycleLength = 28, periodLength = 5) {
        if (!periodStartDateStr)
            throw new ValidationError("Last period start date is required.");
        const parsedDate = new Date(periodStartDateStr);
        if (isNaN(parsedDate.getTime()))
            throw new ValidationError("Invalid period date format.");
        const now = new Date();
        if (parsedDate > now)
            throw new ValidationError("Period start date cannot be in the future.");
        const maxPastTime = 90 * 24 * 60 * 60 * 1000;
        if (now.getTime() - parsedDate.getTime() > maxPastTime) {
            throw new ValidationError("Period start date cannot be more than 90 days ago.");
        }
        const validCycleLength = Math.max(20, Math.min(50, cycleLength || 28));
        const validPeriodLength = Math.max(2, Math.min(12, periodLength || 5));
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        await this.userRepository.setCycleInfo(userId, parsedDate, validCycleLength, validPeriodLength);
        return this._calculateCycleDetails(parsedDate, validCycleLength, validPeriodLength);
    }
    async getCycleDetails(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        if (!user.periodStartDate)
            return null;
        return this._calculateCycleDetails(user.periodStartDate, user.cycleLength || 28, user.periodLength || 5);
    }
    async getEmergencyContacts(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        return (user.emergencyContacts || []).map(toEmergencyContactDTO);
    }
    async addEmergencyContact(userId, data) {
        if (!data.name || !data.name.trim())
            throw new ValidationError("Contact name is required.");
        if (!data.phoneNumber || !data.phoneNumber.trim())
            throw new ValidationError("Phone number is required.");
        const validRelationships = [
            'Parent',
            'Husband / Spouse',
            'Partner',
            'Family Member',
            'Friend',
            'Other',
        ];
        if (!validRelationships.includes(data.relationship)) {
            throw new ValidationError("Please select a valid relationship.");
        }
        const updatedUser = await this.userRepository.addEmergencyContact(userId, {
            name: data.name.trim(),
            phoneNumber: data.phoneNumber.trim(),
            relationship: data.relationship,
        });
        if (!updatedUser)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        return (updatedUser.emergencyContacts || []).map(toEmergencyContactDTO);
    }
    async updateEmergencyContact(userId, contactId, data) {
        if (!contactId)
            throw new ValidationError("Contact ID is required.");
        if (!data.name || !data.name.trim())
            throw new ValidationError("Contact name is required.");
        if (!data.phoneNumber || !data.phoneNumber.trim())
            throw new ValidationError("Phone number is required.");
        const validRelationships = [
            'Parent',
            'Husband / Spouse',
            'Partner',
            'Family Member',
            'Friend',
            'Other',
        ];
        if (!validRelationships.includes(data.relationship)) {
            throw new ValidationError("Please select a valid relationship.");
        }
        const updatedUser = await this.userRepository.updateEmergencyContact(userId, contactId, {
            name: data.name.trim(),
            phoneNumber: data.phoneNumber.trim(),
            relationship: data.relationship,
        });
        if (!updatedUser)
            throw new NotFoundError("Contact not found or could not be updated.");
        return (updatedUser.emergencyContacts || []).map(toEmergencyContactDTO);
    }
    async deleteEmergencyContact(userId, contactId) {
        if (!contactId)
            throw new ValidationError("Contact ID is required.");
        const updatedUser = await this.userRepository.deleteEmergencyContact(userId, contactId);
        if (!updatedUser)
            throw new NotFoundError("Contact not found or could not be deleted.");
        return (updatedUser.emergencyContacts || []).map(toEmergencyContactDTO);
    }
    _calculatePregnancyDetails(lmpDate) {
        const { utcTimestamp: lmpUtcMidnight, date: lmp } = this._parseDateOnly(lmpDate);
        const now = new Date();
        const currentUtcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const diffTime = Math.max(0, currentUtcMidnight - lmpUtcMidnight);
        const gestationalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(gestationalDays / 7);
        const days = gestationalDays % 7;
        const trimester = weeks < 13 ? 1 : weeks < 28 ? 2 : 3;
        const estimatedDueDate = new Date(lmpUtcMidnight + 280 * 24 * 60 * 60 * 1000);
        const daysRemaining = Math.max(0, 280 - gestationalDays);
        const babySizes = {
            1: 'Poppy seed',
            2: 'Poppy seed',
            3: 'Poppy seed',
            4: 'Poppy seed',
            5: 'Sesame seed',
            6: 'Sweet pea',
            7: 'Blueberry',
            8: 'Raspberry',
            9: 'Green olive',
            10: 'Prune',
            11: 'Lime',
            12: 'Plum',
            13: 'Lemon',
            14: 'Peach',
            15: 'Apple',
            16: 'Avocado 🥑',
            17: 'Pomegranate',
            18: 'Bell pepper',
            19: 'Mango',
            20: 'Banana 🍌',
            21: 'Carrot',
            22: 'Papaya',
            23: 'Grapefruit',
            24: 'Corn',
            25: 'Cauliflower',
            26: 'Lettuce',
            27: 'Cabbage',
            28: 'Eggplant 🍆',
            29: 'Acorn squash',
            30: 'Cucumber',
            31: 'Coconut 🥥',
            32: 'Jicama',
            33: 'Pineapple 🍍',
            34: 'Cantaloupe',
            35: 'Honeydew melon',
            36: 'Romaine lettuce',
            37: 'Swiss chard',
            38: 'Winter melon',
            39: 'Watermelon 🍉',
            40: 'Pumpkin 🎃',
        };
        const clampedWeek = Math.max(1, Math.min(40, weeks || 1));
        const babySize = babySizes[clampedWeek] || 'Avocado 🥑';
        const progressPercent = Math.min(100, Math.round((weeks / 40) * 100));
        return {
            lmpDate: lmp,
            gestationalAge: {
                weeks,
                days,
            },
            weeks,
            days,
            formattedAge: `${weeks} Weeks ${days} Days`,
            trimester,
            estimatedDueDate,
            daysRemaining,
            babySize,
            progressPercent,
        };
    }
    _calculateCycleDetails(periodStartDate, cycleLength = 28, periodLength = 5) {
        const currentDate = new Date();
        const start = new Date(periodStartDate);
        const diffTime = Math.max(0, currentDate.getTime() - start.getTime());
        const daysSincePeriod = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const currentCycleDay = (daysSincePeriod % cycleLength) + 1;
        const ovulationDay = Math.max(1, cycleLength - 14);
        const fertileWindowStart = Math.max(1, ovulationDay - 4);
        const fertileWindowEnd = Math.min(cycleLength, ovulationDay + 1);
        const isFertile = currentCycleDay >= fertileWindowStart && currentCycleDay <= fertileWindowEnd;
        const daysUntilNextPeriod = cycleLength - currentCycleDay + 1;
        const nextPeriodDate = new Date(currentDate.getTime() + daysUntilNextPeriod * 24 * 60 * 60 * 1000);
        const currentCycleStartOffset = Math.floor(daysSincePeriod / cycleLength) * cycleLength;
        const fertileStartDate = new Date(start.getTime() + (currentCycleStartOffset + fertileWindowStart - 1) * 24 * 60 * 60 * 1000);
        const fertileEndDate = new Date(start.getTime() + (currentCycleStartOffset + fertileWindowEnd - 1) * 24 * 60 * 60 * 1000);
        return {
            periodStartDate: start,
            cycleLength,
            periodLength,
            currentCycleDay,
            ovulationDay,
            isFertile,
            daysUntilNextPeriod,
            nextPeriodDate,
            fertileStartDate,
            fertileEndDate,
        };
    }
    async logout(refreshTokenValue) {
        if (refreshTokenValue) {
            const tokenHash = hashRefreshToken(refreshTokenValue);
            await this.userRepository.revokeRefreshTokenHash(tokenHash);
        }
        return { message: "Logged out successfully" };
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
            throw new ValidationError(HttpResponse.OTP_EXPIRED_OR_INVALID);
        if (Date.now() - otp.createdAt.getTime() >= OTP_EXPIRY_MS) {
            throw new ValidationError(HttpResponse.OTP_EXPIRED_OR_INVALID);
        }
        const updated = await this.otpRepository.incrementOTPAttempts(otp._id.toString());
        if (!updated) {
            throw new ValidationError(HttpResponse.OTP_EXPIRED_OR_INVALID);
        }
        if (Date.now() - updated.createdAt.getTime() >= OTP_EXPIRY_MS) {
            throw new ValidationError(HttpResponse.OTP_EXPIRED_OR_INVALID);
        }
        if (updated.attempts > 3) {
            await this.otpRepository.markOtpAsUsed(otp._id.toString());
            throw new ValidationError(HttpResponse.OTP_MAX_ATTEMPTS);
        }
        const valid = await comparePassword(submittedOtp, otp.otpHash);
        if (!valid) {
            const left = 3 - updated.attempts;
            throw new ValidationError(`Invalid verification code. ${left} attempt${left === 1 ? '' : 's'} remaining.`);
        }
        await this.otpRepository.markOtpAsUsed(otp._id.toString());
    }
};
AuthService = __decorate([
    injectable(),
    __param(0, inject(TYPES.UserRepository)),
    __param(1, inject(TYPES.OtpRepository)),
    __param(2, inject(TYPES.EmailService)),
    __param(3, inject(TYPES.DoctorRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map