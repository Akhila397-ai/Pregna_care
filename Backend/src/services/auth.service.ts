import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import { OTPGenerator } from '../utils/otpGenarator.js';
import { Logger } from '../utils/logger.js';
import { GoogleAuth } from 'google-auth-library';
import jwt from "jsonwebtoken";



export class AuthService {
    private repo = new UserRepository();

    async signup(name: string, email: string, password: string, ): Promise<string>{

        const existing = await this.repo.findByEmail(email)
        if(existing)throw new Error('User already exists');


        const hashed = await bcrypt.hash(password,10);
        const otp = OTPGenerator.generate();

        const data = {
            name,
            email,
            password:hashed,
            otp,
            otpExpiry: OTPGenerator.expiry()
        };
        await this.repo.create(data)
        Logger.info(`User verified: ${email} using OTP: ${otp}`);
        return otp
    }
    async verifyOTP(email: string, otp: string): Promise<boolean> {
        const user = await this.repo.findByEmail(email);
        if(!user){
            throw new Error('User not found...')
        }
        if(user.otpAttempts >= 5){
            throw new Error('Too many attempts,Try again later')

        }
        if(user.otp !== otp){
            user.otpAttempts += 1
            await user.save()
            throw new Error('Invalid otp')
        }
        if(user.otpExpiry && user.otpExpiry < new Date()){
            throw new Error("OTP expired")
        }
        Logger.info(`Otp: ${otp}`)
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        user.otpAttempts = 0;


        await user.save();

        Logger.info(`User verified: ${email}`);

        return true

    }

    async resendOtp(email:string): Promise<string>{
        const user = await this.repo.findByEmail(email);
        if(!user){
            throw new Error('User mot found')
        }
        if(user.isVerified){
            throw new Error('User already verified')
        }

        const cooldowntime = 60 * 1000;

        if(user.otpRequestedAt && Date.now() - user.otpRequestedAt.getTime() < cooldowntime){
            throw new Error('Please wait before requesting a new otp')
        }
        const newOtp = OTPGenerator.generate();
        user.otp = newOtp;
        user.otpExpiry = OTPGenerator.expiry();
        user.otpRequestedAt = new Date();
        user.otpAttempts = 0

        await user.save()

        Logger.info(`Resend otp for ${email}: ${newOtp}`)
        return newOtp;

    }

    async login(email: string, password: string){

        const user = await this.repo.findByEmail(email)

        if(!user){
            throw new Error("User not found")
        }

        if(!user.isVerified){
            throw new Error('user is not verified')
        }

        const match = await bcrypt.compare(password,user.password);

        if(!match){
            throw new Error("invalid password")
        }

        const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );
        return {user,token}
    }
   
    

    
}