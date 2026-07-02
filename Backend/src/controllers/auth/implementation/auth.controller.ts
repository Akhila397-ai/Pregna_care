import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import e, { Request, Response } from 'express'
import { TYPES } from '../../../container/types.js'
import type { IAUthService } from '../../../services/auth/interface/IAuth.service.js'
import { IAuthController } from '../interface/IAuth.controller.js'
import { HttpStatus } from '../../../constants/status.constant.js'
import { HttpResponse } from '../../../constants/messages.constant.js'


@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.AuthService) private authService: IAUthService,
    ) {}

     register = async (req: Request, res: Response): Promise<void> => {
       try {
        console.log("Body:",req.body);
         const {name, email, password} = req.body;
         const result = await this.authService.register(name,email,password);
         res.status(HttpStatus.CREATED).json(result);

       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json(error.message)
        }else{
            res.status(HttpStatus.BAD_REQUEST).json({message: 'something went wrong'})
        }
    }
   }

 verifyOtp = async(req: Request, res: Response): Promise<void> => {
       try {
           const {email, otp, purpose} = req.body;
           const result = await this.authService.verifyOtp(email, otp, purpose)
           res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json(error.message)
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message: 'internal error'})
        
       }
   }

    login = async (req: Request, res: Response): Promise<void> => {
       try {
          const { email, password} = req.body;
          const result = await this.authService.login(email,password)
          res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
        if(error instanceof  Error){
            res.status(HttpStatus.BAD_REQUEST).json({message: error.message})
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Internal error happened'})
        }
   }

    forgotPassword = async (req: Request, res: Response): Promise<void> =>  {
       try {
        const {email} =req.body;
        const result = this.authService.forgotPassword(email)
        res.status(HttpStatus.OK).json(result)

       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message})
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message:'Internal error occured'})

        
       }
   }
    resetPassword =  async(req: Request, res: Response): Promise<void> => {
       try {

          const { newPassword} = req.body;
          
          const userId = req.user?.userId;
          if(!userId){
            res.status(HttpStatus.NOT_FOUND).json({
                message: HttpResponse.FORBIDDEN
            });
            return
          }

          const result = 
          await this.authService.resetPassword(
            userId,
            newPassword
          )
          res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message})
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message:'invalid'})
        
       }
   }
    resendOtp = async (req: Request, res: Response): Promise<void> => {
       try {
          const { email, purpose} =  req.body;
          const result = this.authService.resendOtp(email,purpose)
          res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message})
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Invalid'})
        
       }
   }


   refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.authService.refreshToken(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message})
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Invalid'})
        
       }
  };

 setOnboarding = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const {onboardingType} = req.body;
        const result = await this.authService.setOnboarding(
            userId,onboardingType
        )
        res.status(HttpStatus.OK).json(result);
      } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message})
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Invalid'})
        
       }
  }





   






}