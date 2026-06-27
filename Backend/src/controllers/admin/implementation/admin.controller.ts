import 'reflect-metadata'
import { injectable,inject } from 'inversify'
import { Request, Response } from 'express'
import { TYPES } from '../../../container/types.js'
import type { IAdminService } from '../../../services/admin/interface/IAdmin.service.js'
import { IAdminController } from '../interface/IAdmin.controller.js'
import { HttpResponse } from '../../../constants/messages.constant.js'
import { HttpStatus } from '../../../constants/status.constant.js'



@injectable()
export class AdminController implements IAdminController {
    constructor(
        @inject(TYPES.AdminService) private adminService: IAdminService,
    ){}

      getAllUsers = async(req: Request, res: Response): Promise<void> => {
        console.log('GET ALL USERS CONTROLLER HIT');
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

      blockUser = async(req: Request, res: Response): Promise<void> => {
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

     unblockUser =async(req: Request, res: Response): Promise<void>=> {
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

     getAllDoctors = async(req: Request, res: Response): Promise<void> =>{
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

   approveDoctor = async(req: Request, res: Response): Promise<void>=> {
      try {

        const { doctorId,adminId} = req.params;
        const result = await this.adminService.approveDoctor(doctorId as string,adminId as string)
        res.status(HttpStatus.OK).json(result)

        
      }catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
        }
  }

   rejectDoctor = async(req: Request, res: Response): Promise<void>=> {
      try {
        const {doctorId,adminId} = req.params;
        const result = await this.adminService.rejectDoctor(doctorId as string, adminId as string)
        res.status(HttpStatus.OK).json(result)
        
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
      }
  }

   blockDoctor = async(req: Request, res: Response): Promise<void>=> {
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

   unblockDoctor = async(req: Request, res: Response): Promise<void> => {
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

    deleteDoctor = async(req: Request, res: Response): Promise<void> => {
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
