import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import e, { Request, Response } from 'express'
import { Types } from '../../../container/types.js'
import type { IAUthService } from '../../../services/auth/interface/IAuth.service.js'
import { IAuthController } from '../interface/IAuth.controller.js'
import { HttpStatus } from '../../../constants/status.constant.js'


@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(Types.AuthService) private authService: IAUthService,
    ) {}

    async regiter(req: Request, res: Response): Promise<void> {
       try {
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

   async verifyOtp(req: Request, res: Response): Promise<void> {
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

   async login(req: Request, res: Response): Promise<void> {
       try {
          const { email, password} = req.body;
          const result = await this.authService.login(email,password)
          res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
        if(error instanceof  Error){
            res.status(HttpStatus.BAD_REQUEST).json(error.message)
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Internal error happened'})
        }
   }

   async forgotPassword(req: Request, res: Response): Promise<void> {
       try {
        const {email} =req.body;
        const result = this.authService.forgotPassword(email)
        res.status(HttpStatus.OK).json(result)

       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json(error.message)
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message:'Internal error occured'})

        
       }
   }
   async resetPassword(req: Request, res: Response): Promise<void> {
       try {
          const { email, otp, newPassword} = req.body;
          const result = this.authService.resetPassword(email,otp,newPassword)
          res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json(error.message)
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message:'invalid'})
        
       }
   }
   async resendOtp(req: Request, res: Response): Promise<void> {
       try {
          const { email, purpose} =  req.body;
          const result = this.authService.resendOtp(email,purpose)
          res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json(error.message)
        }else
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Invalid'})
        
       }
   }

   


   






}