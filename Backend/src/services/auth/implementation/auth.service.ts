import 'reflect-metadata';
import { injectable,inject } from 'inversify';
import { Types } from '../../../container/types.js';
import type { IUserRepository } from '../../../repositories/auth/interface/IUser.repository.js';
import { IAUthService } from '../interface/IAuth.service.js';
import { toUserAuthDTO } from '../../../mapper/user.mapper.js';
import { hashPassword, comparePassword } from '../../../utils/hashPassword.js';
import { generateOTP } from '../../../utils/generateOtp.js';
import { generateAccessToken,generateRefreshToken } from '../../../utils/jwt.js';
import { HttpResponse } from '../../../constants/messages.constant.js';
import { OTPPurpose } from '../../../types/otp.js';
import { EmailService } from '../../email/implementation/email.service.js';
import type { IEmailService } from '../../email/interface/IEmail.service.js';
import  { AuthResponseDTO, MessageResponseDTO, OTPResponseDTO } from '../../../dtos/auth.dto.js';
import { error } from 'node:console';
import { access } from 'node:fs';

@injectable()
export class AuthService implements IAUthService {
    constructor(
        @inject(Types.UserRepository) private userRepository: IUserRepository,
        @inject(Types.EmailService) private emailService: IEmailService
    ) {}

    async register(name: string, email: string, password: string): Promise<OTPResponseDTO> {
        const exiting = await this.userRepository.findByEmail(email);
        if(exiting) throw new Error(HttpResponse.EMAIL_ALREADY_EXISTS);

        const hashedPassword = await hashPassword(password);

        const newUser = await this.userRepository.create({
            name,
            email,
            password:hashedPassword,
            isBlocked: false,
            isVerified: false
        })

        await this._sendOTP(newUser._id.toString(), email, 'signup');

        return {message: HttpResponse.REGISTER_SUCCESS, expiresIn: 300}
        
    }
    async verifyOtp(email: string, otp: string, purpose: string): Promise<AuthResponseDTO> {

        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND)
        }

        await this._verifyOtp(
            user._id.toString(),
            purpose as OTPPurpose,
            otp
        );

        if(purpose === 'signup'){
            await this.userRepository.markVerified(user._id.toString())
        }

        const accessToken = generateAccessToken(user._id.toString(),'user');
        const refreshToken = generateRefreshToken(user._id.toString());

        return {
            user: toUserAuthDTO(user),
            token:  accessToken
        }
        

        
    }

    async login(email: string, password: string): Promise<AuthResponseDTO> {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND)
        }
        if(user.isBlocked){
            throw new Error(HttpResponse.USER_BLOCKED)
        }
        if(!user.isVerified){
            throw new Error(HttpResponse.UNAUTHORIZED)
        }

        const isMatch = await comparePassword(password, user.password);
        if(!isMatch){
            throw new Error(HttpResponse.INVALID_PASSWORD)
        }

        const accessToken = generateAccessToken(user._id.toString(),'user');
        const refreshToken = generateRefreshToken(user._id.toString())

        return {
            user: toUserAuthDTO(user),
            token: accessToken
        }
        
    }

     async forgotPassword(email: string): Promise<OTPResponseDTO> {
        const user = await this.userRepository.findByEmail(email)
        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND)
        }

        await this._sendOTP(user._id.toString(),email,'forgot_password')

        return {
            message: HttpResponse.FORGOT_PASSWORD_SENT,
            expiresIn: 300
        }
    }

    async resetPassword(email: string, submittedOtp: string, newPassword: string): Promise<MessageResponseDTO> {
        const user = await  this.userRepository.findByEmail(email);
        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND)
        }
        
        await this._verifyOtp(user._id.toString(),'forgot_password',submittedOtp);

        const hash = await hashPassword(newPassword);
        await this.userRepository.updatePassword(user._id.toString(),hash);

        return{
            message: HttpResponse.PASSWORD_RESET_SUCCESSFULL
        }
    }

    async resendOtp(email: string, purpose: string): Promise<OTPResponseDTO> {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND)
        }

        await this._sendOTP(
            user._id.toString(),
            email,
            purpose as OTPPurpose,
        )
        return {
            message: HttpResponse.OTP_RESENT,
            expiresIn: 300
        }
    }




    private async _sendOTP(userId: string, email: string, purpose: OTPPurpose): Promise<void>{
        await this.userRepository.invalidateAllOTPs(userId, purpose);

        const rawOtp = generateOTP();
        const otpHash = await hashPassword(rawOtp);

        await this.userRepository.createOtp({
            userId,
            otpHash,
            purpose
        })

        await this.emailService.sendOtp(email, rawOtp, purpose);
    }

    private async _verifyOtp(userId: string, purpose: OTPPurpose, submittedOtp: string): Promise<void> {
        const otp = await  this.userRepository.findActiveOtp(userId,purpose);

        if(!otp) throw new Error(HttpResponse.OTP_EXPIRED_OR_INVALID);

        const updated = await this.userRepository.incrementOTPAttempts(
            otp._id.toString()
        )
        if(!updated){
            throw new Error(HttpResponse.OTP_EXPIRED_OR_INVALID)
        }

        if(updated.attempts > 3){
            await this.userRepository.markOtpAsused(otp._id.toString());
            throw new Error(HttpResponse.OTP_MAX_ATTEMPTS)
        }

        const valid = comparePassword(submittedOtp, otp.otpHash)
        if(!valid){
            const left = 3 - updated.attempts;
            throw new Error(`${HttpResponse.OTP_EXPIRED_OR_INVALID}, only ${left} attempts left..`)
        }

        await this.userRepository.markOtpAsused(otp._id.toString()); 

    }
}


