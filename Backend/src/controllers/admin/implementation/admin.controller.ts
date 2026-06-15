import 'reflect-metadata'
import { injectable,inject } from 'inversify'
import { Request, Response } from 'express'
import { Types } from '../../../container/types.js'
import type { IAdminService } from '../../../services/admin/interface/IAdmin.service.js'
import { IAdminController } from '../interface/IAdmin.controller.js'
import { HttpResponse } from '../../../constants/messages.constant.js'
import { HttpStatus } from '../../../constants/status.constant.js'



@injectable()
export class AdminController implements IAdminController {
    constructor(
        @inject(Types.AdminService) private adminService: IAdminService,
    ){}

     async getAllUsers(req: Request, res: Response): Promise<void> {
         try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.adminService.getAllUsers(page, limit)
            res.status(HttpStatus.OK).json(result)
         } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'Internal damage'})
            }
            
         }
     }

     async blockUser(req: Request, res: Response): Promise<void> {
         try {
            const { userId} = req.params;
            const result = await this.adminService.blockUser(userId as string)
            res.status(HttpStatus.OK).json(result)
         } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
            
         }
     }

     async unblockUser(req: Request, res: Response): Promise<void> {
         try {
            const { userId} = req.params;
            const result = await this.adminService.unblockUser(userId as string)
            res.status(HttpStatus.OK).json(result)
            
         } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
            
         }

        }

        async deleteUser(req: Request, res: Response): Promise<void> {
            try {
                const {userId} = req.params;
                const result = await this.adminService.deleteUser(userId as string)
                
            } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
        }

    }


    //doctor management

    async getAllDoctors(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.adminService.getAllDoctors(page,limit)
            res.status(HttpStatus.OK).json(result)

            
        } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
    }
  }

  async approveDoctor(req: Request, res: Response): Promise<void> {
      try {

        const { doctorId} = req.params;
        const result = await this.adminService.approveDoctor(doctorId as string)
        res.status(HttpStatus.OK).json(result)

        
      }catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
        }
  }

  async rejectDoctor(req: Request, res: Response): Promise<void> {
      try {
        const {doctorId} = req.params;
        const result = await this.adminService.rejectDoctor(doctorId as string)
        res.status(HttpStatus.OK).json(result)
        
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
      }
  }

  async blockDoctor(req: Request, res: Response): Promise<void> {
      try {
        const {doctorId} = req.params;
        const result = await this.adminService.blockDoctor(doctorId as string)
        res.status(HttpStatus.OK).json(result)
        
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
        }
  }

  async unblockDoctor(req: Request, res: Response): Promise<void> {
      try {

        const { doctorId} = req.params;
        const result = await this.adminService.unblockDoctor(doctorId as string)
        res.status(HttpStatus.OK).json(result)
        
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
        
            }
      }
  }

   async deleteDoctor(req: Request, res: Response): Promise<void> {
      try {
        const {doctorId} = req.params;
        const result = await this.adminService.deleteDoctor(doctorId as string)
        
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
      }
  }


}
