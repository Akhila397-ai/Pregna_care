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
            const result = await this.doctorService.apply(req.body)
            res.status(HttpStatus.CREATED).json(result)
        } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'Internal Error occured'})
            }
            
        }
    }

 getMyApplication = async(req: Request, res: Response): Promise<void> => {
        try {
           const userId = req.user !.userId;
           const result = await this.doctorService.getMyApplication(userId)
           if(!result){
            res.status(HttpStatus.NOT_FOUND).json({
                error: HttpResponse.DOCTOR_NOT_FOUND
            });
            return;
           }
        } catch (error : unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:"intrenal error occured"})
            }
            
        }
    }

     getMyProfile = async(req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const result = await this.doctorService.getMyProfile(userId);
            if(!result){
                res.status(HttpStatus.NOT_FOUND).json({
                    error: HttpResponse.DOCTOR_PROFILE_NOT_FOUND
                });
                return;
            }
            res.status(HttpStatus.OK).json(result)
        } catch (error: unknown) {
            if(error instanceof Error){
                res.status(HttpStatus.BAD_REQUEST).json(error.message)
            }else{
                res.status(HttpStatus.BAD_REQUEST).json({message:'internal error'})
            }
            
        }
    }

}