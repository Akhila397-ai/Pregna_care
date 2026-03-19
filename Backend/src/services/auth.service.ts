import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface.js';
import { HttpResponse } from '../constants/messages.constant.js';
import { HttpStatus } from '../constants/status.constant.js';
import { Logger } from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';


export class AuthService {
    constructor(private userRepo: IUserRepository){}


        private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
        }

            async signup(name: string, email: string, password: string) {
        const existing = await this.userRepo.findEmail(email);

        if (existing && !existing.isVerified) {
            const otp = this.generateOtp();
            const hashedPassword = await bcrypt.hash(password, 10);

            await this.userRepo.updateByEmail(email, {
            name,
            password: hashedPassword,
            otp,
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
            });

            await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

            return otp;
        }

        if (existing && existing.isVerified) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = this.generateOtp();

        Logger.info(`Email:${email} Otp: ${otp}`);

        await this.userRepo.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
            isVerified: false,
        });

        await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

        return otp;
        }

    async verifyOTP(email: string, otp: string) {
        const user = await this.userRepo.findEmail(email);

        console.log("Entered OTP:", otp);
        console.log("Stored OTP:", user?.otp);
        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND);
        }

        if(user.otp !== otp){
            throw new Error(HttpResponse.OTP_INVALID)
        }
        
        if(!user.otpExpiry || user.otpExpiry < new Date()){
            throw new Error(HttpResponse.OTP_EXPIRED_OR_INVALID)
        }

        await this.userRepo.updateByEmail(email, {
            isVerified: true,
            otp: undefined,
            otpExpiry: undefined
        });
    }

    async resendOtp(email: string) {
        const user = await this.userRepo.findEmail(email);

        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND)
        }

        const otp = this.generateOtp();
        Logger.info(`Resent OTP for ${email}: ${otp}`);

        await this.userRepo.updateByEmail(email,{
            otp,
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        })
        await sendEmail(email, "Your OTP Code",`Your OTP id: ${otp}`)
        return otp;
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findEmail(email);

        if(!user){
            throw new Error(HttpResponse.USER_NOT_FOUND)
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            throw new Error(HttpResponse.INVALID_PASSWORD)
        }
        const token = "JWT_TOKEN";

        return { user, token}
    }

    
}