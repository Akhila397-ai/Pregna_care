import { Request,Response } from "express";
import { AuthService } from "../services/auth.service.js";


const service = new AuthService();


export class AuthController {

    static async signup(req: Request, res: Response): Promise<void>{
        try {
            const {name, email, password} = req.body;

            const otp = await service.signup(name,email,password);

            res.json({message: "OTP sent" ,otp})
        } catch (error) {
            if(error instanceof Error){
                res.status(400).json({error: error.message})
            }
            
        }
    }
    static async verifyOtp(req: Request, res: Response):Promise<void>{
        try {
            const {email, otp} = req.body;

            await service.verifyOTP(email,otp);

            res.json({message: 'Account verified'})
        } catch (error) {
            if(error instanceof Error){
                res.status(400).json({error: error.message})
            }
            
        }
    }
    static async resendOtp(req:Request,res:Response):Promise<void> {
        try {
            const {email} = req.body;

            const otp = await service.resendOtp(email);
            res.json({message:'OTP resent successfully',otp});
        } catch (error) {
            if(error instanceof Error){
                res.status(400).json({error: error.message})
            }
        }
    }
    static async login(req: Request, res: Response):Promise<void> {
        try {
            const {email,password} = req.body;
            const {user,token} = await service.login(email,password);

            res.cookie("token",token, {
                httpOnly:true,
                sameSite:"strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.status(200).json({
                success:true,
                user
            })
        } catch (error) {
              res.status(400).json({
            message: (error as Error).message
        });
        }
    }
}