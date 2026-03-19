import { Request,Response,NextFunction } from "express";
import { container } from "../container/index.js";
import { HttpStatus } from "../constants/status.constant.js";
import { HttpResponse } from "../constants/messages.constant.js";
export class AuthController {

    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, email,password} = req.body;

            const otp = await container.authService.signup(name,email,password);

            res.status(HttpStatus.OK).json({
                success:true,
                message:HttpResponse.OTP_SENT,
                otp
            });
        } catch (error) {
            next(error)
            
        }
    }
    static async verifyOtp(req: Request, res: Response, next: NextFunction) {
         try {
            const {email,otp} = req.body;

            await container.authService.verifyOTP(email,otp)
            res.status(HttpStatus.OK).json({
                success:true,
                message:HttpResponse.CREATED
            })
         } catch (error) {
            next(error)
         }
    }

    static async resentOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;

            const otp = await container.authService.resendOtp(email)

            res.status(HttpStatus.OK).json({
                success:true,
                message:HttpResponse.OTP_RESENT,
                otp
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;

            const {user,token} = await container.authService.login(email,password);

            res.cookie('token',token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })


            res.status(HttpStatus.OK).json({
                success:true,
                user,
            })
        } catch (error) {
            next(error)
            
        }
    }
}