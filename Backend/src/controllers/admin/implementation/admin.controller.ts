import 'reflect-metadata'
import { injectable,inject } from 'inversify'
import { Request, Response } from 'express'
import { TYPES } from '../../../container/types.js'
import type { IAdminService } from '../../../services/admin/interface/IAdmin.service.js'
import { IAdminController } from '../interface/IAdmin.controller.js'
import { HttpResponse } from '../../../constants/messages.constant.js'
import { HttpStatus } from '../../../constants/status.constant.js'
import { error } from 'node:console'
import { DocumentType } from '../../../services/admin/interface/IAdmin.service.js'


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

    verifyDoctor = async(req: Request, res: Response): Promise<void> => {
       try {
        const doctorId = req.params.doctorId || req.params.id;
        if (!doctorId) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid doctorId' });
            return;
        }
        const adminId = req.user!.userId;
        const dto = req.body;

        if(!['approve','reject','more_documents_required', 'under_review']
            .includes(dto.action)){
               res.status(HttpStatus.BAD_REQUEST).json({
                error: 'Invalid Action'
               });
               return;
            }
            const result = await this.adminService.verifyDoctor(
                doctorId as string, adminId as string, dto
            );
            res.status(HttpStatus.OK).json(result)
        
       } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message })
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'internal error' })
            }
        }
   }

   approveDoctor = async(req: Request, res: Response): Promise<void>=> {
      try {
        const doctorId = req.params.doctorId || req.params.id;
        const adminId = req.user!.userId;
        const result = await this.adminService.approveDoctor(doctorId as string, adminId as string)
        res.status(HttpStatus.OK).json(result)
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message })
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'internal error' })
            }
        }
  }

   rejectDoctor = async(req: Request, res: Response): Promise<void>=> {
      try {
        const doctorId = req.params.doctorId || req.params.id;
        const adminId = req.user!.userId;
        const { rejectionReason } = req.body;
        const result = await this.adminService.rejectDoctor(doctorId as string, adminId as string)
        res.status(HttpStatus.OK).json(result)
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message })
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'internal error' })
            }
      }
  }

   blockDoctor = async(req: Request, res: Response): Promise<void>=> {
      try {
        const doctorId = req.params.doctorId || req.params.id;
        const result = await this.adminService.blockDoctor(doctorId as string)
        res.status(HttpStatus.OK).json(result)
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message })
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'internal error' })
            }
        }
  }

   unblockDoctor = async(req: Request, res: Response): Promise<void> => {
      try {
        const doctorId = req.params.doctorId || req.params.id;
        const result = await this.adminService.unblockDoctor(doctorId as string)
        res.status(HttpStatus.OK).json(result)
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message })
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'internal error' })
            }
      }
  }

    deleteDoctor = async(req: Request, res: Response): Promise<void> => {
      try {
        const doctorId = req.params.doctorId || req.params.id;
        const result = await this.adminService.deleteDoctor(doctorId as string)
        res.status(HttpStatus.OK).json(result)
      } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message })
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'internal error' })
            }
      }
  }

 getDoctorDocumentUrl = async(req: Request, res: Response): Promise<void> => {
      try {
        const doctorId = (Array.isArray(req.params.doctorId) ? req.params.doctorId[0] : req.params.doctorId) as string;
        const documentType = (Array.isArray(req.params.documentType) ? req.params.documentType[0] : req.params.documentType) as string;

        const validTypes: DocumentType[] = [
            'degreeCertificate',
            'registrationCertificate',
            'governmentId',
        ];
        if(!validTypes.includes(documentType as DocumentType)) {
            res.status(HttpStatus.BAD_REQUEST).json({
                error: `Invalid document type. Must be one of: ${validTypes.join(', ')}`
            });
            return;
        }

        const result = await this.adminService.getDoctorDocumentUrl(
            doctorId,
            documentType as DocumentType
        );
        res.status(HttpStatus.OK).json(result);
      } catch (error: unknown) {
        if(error instanceof Error){
            res.status(HttpStatus.BAD_REQUEST).json({error: error.message});
        }else{
            res.status(HttpStatus.BAD_REQUEST).json({message: 'Internal error occured'});
        }
      }
  }


}
