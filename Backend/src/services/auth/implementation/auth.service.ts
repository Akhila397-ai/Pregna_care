import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../container/types.js";
import type { IUserRepository } from "../../../repositories/auth/interface/IUser.repository.js";
import type { IOtpRepository } from "../../../repositories/otp/interface/IOtp.repository.js";
import type { IDoctorRepository } from "../../../repositories/doctor/interface/IDoctor.repository.js";
import type { IEmailService } from "../../email/interface/IEmail.service.js";
import { IAUthService } from "../interface/IAuth.service.js";
import { toUserAuthDTO } from "../../../mapper/user.mapper.js";
import { hashPassword, comparePassword } from "../../../utils/hashPassword.js";
import { generateOTP } from "../../../utils/generateOtp.js";
import { generateAccessToken, generateRefreshToken, generateResetToken } from "../../../utils/jwt.js";
import { HttpResponse } from "../../../constants/messages.constant.js";
import { OTPPurpose } from "../../../types/otp.js";
import { OTP_EXPIRY_MS } from "../../../constants/otp.constant.js";
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/AppError.js";
import {
  AuthResponseDTO,
  MessageResponseDTO,
  OTPResponseDTO,
  VerifyOtpResponseDTO,
  LoginDTO,
} from "../../../dtos/auth.dto.js";
import {
  UserAuthDTO,
  PregnancyDetailsDTO,
  CycleDetailsDTO,
  EmergencyContactDTO,
  AddEmergencyContactDTO,
  UpdateEmergencyContactDTO,
} from "../../../dtos/user.dto.js";
import { ROLE_PORTAL_NAMES, UserRole } from "../../../types/roles.js";
import { EmergencyContactRelationship, onboardingType } from "../../../types/user.js";
import { toEmergencyContactDTO } from "../../../mapper/user.mapper.js";


@injectable()
export class AuthService implements IAUthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.OtpRepository) private otpRepository: IOtpRepository,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.DoctorRepository) private doctorRepository: IDoctorRepository
  ) {}

  async register(name: string, email: string, password: string): Promise<OTPResponseDTO> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictError(HttpResponse.EMAIL_ALREADY_EXISTS);

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

  async verifyOtp(email: string, otp: string, purpose: string): Promise<VerifyOtpResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    }

    await this._verifyOtp(user._id.toString(), purpose as OTPPurpose, otp);

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

    throw new ValidationError("Invalid verification purpose specified.");
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
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
      } else if (appStatus === "rejected") {
        throw new ForbiddenError("Access denied. Your doctor application has been rejected.");
      } else {
        // 'pending', 'under_review', 'more_documents_required'
        throw new ForbiddenError("Access denied. Your doctor application is awaiting admin review.");
      }
    } else {
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

    return {
      user: toUserAuthDTO(user),
      token: accessToken,
      refreshToken,
    };
  }

  private _getPortalErrorMessage(actualRole: UserRole, expectedRole: UserRole): string {
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

  async forgotPassword(email: string): Promise<OTPResponseDTO> {
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

  async resetPassword(userId: string, newPassword: string): Promise<MessageResponseDTO> {
    const hash = await hashPassword(newPassword);
    await this.userRepository.updatePassword(userId, hash);
    return {
      message: HttpResponse.PASSWORD_RESET_SUCCESSFUL,
    };
  }

  async resendOtp(email: string, purpose: string): Promise<OTPResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    }

    await this._sendOTP(user._id.toString(), email, purpose as OTPPurpose);
    return {
      message: HttpResponse.OTP_RESENT,
      expiresIn: 300,
    };
  }

  async refreshToken(userId: string): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    if (user.isBlocked) throw new ForbiddenError(HttpResponse.USER_BLOCKED);
    if (user.isDeleted) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    return { user: toUserAuthDTO(user), token: accessToken, refreshToken };
  }

  async setOnboarding(userId: string, onboardingType: onboardingType): Promise<MessageResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    await this.userRepository.setOnboarding(userId, onboardingType);
    return { message: "Onboarding journey updated successfully." };
  }

  async getMe(userId: string): Promise<UserAuthDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    if (user.isBlocked) throw new ForbiddenError(HttpResponse.USER_BLOCKED);
    if (user.isDeleted) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    return toUserAuthDTO(user);
  }

  private _parseDateOnly(dateInput: string | Date): { utcTimestamp: number; date: Date } {
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

  async setPregnancyLMP(userId: string, lmpDateStr: string): Promise<PregnancyDetailsDTO> {
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
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);

    await this.userRepository.setPregnancyLMP(userId, parsedDate);
    return this._calculatePregnancyDetails(parsedDate);
  }

  async getPregnancyDetails(userId: string): Promise<PregnancyDetailsDTO | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    if (!user.lmpDate) return null;
    return this._calculatePregnancyDetails(user.lmpDate);
  }

  async setCycleInfo(
    userId: string,
    periodStartDateStr: string,
    cycleLength = 28,
    periodLength = 5
  ): Promise<CycleDetailsDTO> {
    if (!periodStartDateStr) throw new ValidationError("Last period start date is required.");
    const parsedDate = new Date(periodStartDateStr);
    if (isNaN(parsedDate.getTime())) throw new ValidationError("Invalid period date format.");

    const now = new Date();
    if (parsedDate > now) throw new ValidationError("Period start date cannot be in the future.");

    const maxPastTime = 90 * 24 * 60 * 60 * 1000;
    if (now.getTime() - parsedDate.getTime() > maxPastTime) {
      throw new ValidationError("Period start date cannot be more than 90 days ago.");
    }

    const validCycleLength = Math.max(20, Math.min(50, cycleLength || 28));
    const validPeriodLength = Math.max(2, Math.min(12, periodLength || 5));

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);

    await this.userRepository.setCycleInfo(userId, parsedDate, validCycleLength, validPeriodLength);
    return this._calculateCycleDetails(parsedDate, validCycleLength, validPeriodLength);
  }

  async getCycleDetails(userId: string): Promise<CycleDetailsDTO | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    if (!user.periodStartDate) return null;
    return this._calculateCycleDetails(
      user.periodStartDate,
      user.cycleLength || 28,
      user.periodLength || 5
    );
  }

  async getEmergencyContacts(userId: string): Promise<EmergencyContactDTO[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    return (user.emergencyContacts || []).map(toEmergencyContactDTO);
  }

  async addEmergencyContact(userId: string, data: AddEmergencyContactDTO): Promise<EmergencyContactDTO[]> {
    if (!data.name || !data.name.trim()) throw new ValidationError("Contact name is required.");
    if (!data.phoneNumber || !data.phoneNumber.trim()) throw new ValidationError("Phone number is required.");

    const validRelationships: EmergencyContactRelationship[] = [
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

    if (!updatedUser) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
    return (updatedUser.emergencyContacts || []).map(toEmergencyContactDTO);
  }

  async updateEmergencyContact(
    userId: string,
    contactId: string,
    data: UpdateEmergencyContactDTO
  ): Promise<EmergencyContactDTO[]> {
    if (!contactId) throw new ValidationError("Contact ID is required.");
    if (!data.name || !data.name.trim()) throw new ValidationError("Contact name is required.");
    if (!data.phoneNumber || !data.phoneNumber.trim()) throw new ValidationError("Phone number is required.");

    const validRelationships: EmergencyContactRelationship[] = [
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

    if (!updatedUser) throw new NotFoundError("Contact not found or could not be updated.");
    return (updatedUser.emergencyContacts || []).map(toEmergencyContactDTO);
  }

  async deleteEmergencyContact(userId: string, contactId: string): Promise<EmergencyContactDTO[]> {
    if (!contactId) throw new ValidationError("Contact ID is required.");

    const updatedUser = await this.userRepository.deleteEmergencyContact(userId, contactId);
    if (!updatedUser) throw new NotFoundError("Contact not found or could not be deleted.");
    return (updatedUser.emergencyContacts || []).map(toEmergencyContactDTO);
  }

  private _calculatePregnancyDetails(lmpDate: Date): PregnancyDetailsDTO {
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

    const babySizes: Record<number, string> = {
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

  private _calculateCycleDetails(
    periodStartDate: Date,
    cycleLength = 28,
    periodLength = 5
  ): CycleDetailsDTO {
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
    const fertileStartDate = new Date(
      start.getTime() + (currentCycleStartOffset + fertileWindowStart - 1) * 24 * 60 * 60 * 1000
    );
    const fertileEndDate = new Date(
      start.getTime() + (currentCycleStartOffset + fertileWindowEnd - 1) * 24 * 60 * 60 * 1000
    );

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

  private async _sendOTP(userId: string, email: string, purpose: OTPPurpose): Promise<void> {
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

  private async _verifyOtp(userId: string, purpose: OTPPurpose, submittedOtp: string): Promise<void> {
    const otp = await this.otpRepository.findActiveOtp(userId, purpose);

    if (!otp) throw new ValidationError(HttpResponse.OTP_EXPIRED_OR_INVALID);
    if(Date.now() - otp.createdAt.getTime() >= OTP_EXPIRY_MS){
      throw new ValidationError(HttpResponse.OTP_EXPIRED_OR_INVALID)
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
}
