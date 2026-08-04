import 'reflect-metadata'
import { injectable,inject } from 'inversify'
import { Request, Response } from 'express'
import {TYPES} from '../../../container/types.js'
import type { IDoctorService } from '../../../services/doctor/interface/IDoctor.service.js'
import type { IDoctorController } from '../interface/IDoctor.controller.js'
import { HttpResponse } from '../../../constants/messages.constant.js'
import { HttpStatus } from '../../../constants/status.constant.js'
import { error } from 'node:console'


@injectable()
export class DoctorController implements IDoctorController {
    constructor(
        @inject(TYPES.DoctorService) private doctorService: IDoctorService,
    ) {}
    

     apply = async(req: Request, res: Response): Promise<void> => {
        try {
            if(!req.user?.userId){
                res.status(HttpStatus.UNAUTHORIZED).json({error: 'Not authenticated'})
                return;
            }

            console.log('[DoctorController.apply] body fields:', Object.keys(req.body));
      console.log('[DoctorController.apply] files:', req.files);

            const files = req.files as {
                [filedname: string]: Express.Multer.File[]
            };
            if(!files){
                res.status(HttpStatus.BAD_REQUEST).json({
                    error: 'No files recieved'
                })
                return;
            }

            let availability;
            try {
                availability = typeof req.body.availability === 'string'
                ? JSON.parse(req.body.availability)
                : req.body.availability;
            } catch (error) {
                res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Invalid availability format.'
        });
        return;
                
            }

           const bodyData = {
        fullName:           req.body.fullName,
        specialization:     req.body.specialization,
        qualification:      req.body.qualification,
        experience:         Number(req.body.experience),
        registrationNumber: req.body.registrationNumber,
        consultationFee:    Number(req.body.consultationFee),
        clinicName:         req.body.clinicName,
        clinicAddress:      req.body.clinicAddress,
        availability,
        
      };

            const result = await this.doctorService.apply(
                req.user.userId,
                bodyData,
                files
            )
            res.status(HttpStatus.CREATED).json(result)
        } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'Internal Error occured'})
            }
            
        }
    }



   getMyStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // ← add this log
    console.log('userId from JWT:', userId);
    console.log('typeof userId:', typeof userId);

    const result = await this.doctorService.getMyStatus(userId);
    res.status(HttpStatus.OK).json(result);
  } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'Internal Error occured'})
            }
            
        }
   }

   async getMyDashboard(req: Request, res: Response): Promise<void> {
       try {
        const userId = req.user!.userId;
        const result = await this.doctorService.getMyDashboard(userId)
        res.status(HttpStatus.OK).json(result)
       } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'Internal Error occured'})
            }
            
        }
   }

}