import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../../container/types.js';
import type { IDoctorService } from '../../../services/doctor/interface/IDoctor.service.js';
import type { IDoctorController } from '../interface/IDoctor.controller.js';
import { HttpStatus } from '../../../constants/status.constant.js';
import { logger } from '../../../shared/logger/logger.js';

@injectable()
export class DoctorController implements IDoctorController {
  constructor(
    @inject(TYPES.DoctorService) private doctorService: IDoctorService
  ) {}

  apply = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Not authenticated' });
        return;
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (!files || Object.keys(files).length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: 'No files received',
        });
        return;
      }

      let availability;
      try {
        availability =
          typeof req.body.availability === 'string'
            ? JSON.parse(req.body.availability)
            : req.body.availability;
      } catch {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Invalid availability format.',
        });
        return;
      }

      const bodyData = {
        fullName: req.body.fullName,
        specialization: req.body.specialization,
        qualification: req.body.qualification,
        experience: Number(req.body.experience),
        registrationNumber: req.body.registrationNumber,
        consultationFee: Number(req.body.consultationFee),
        clinicName: req.body.clinicName,
        clinicAddress: req.body.clinicAddress,
        availability,
      };

      const result = await this.doctorService.apply(
        req.user.userId,
        bodyData,
        files
      );
      res.status(HttpStatus.CREATED).json(result);
    } catch (error: unknown) {
      logger.error('DoctorController.apply error:', error);
      if (error instanceof Error) {
        const isInternal =
          error.message.includes('credentials') ||
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('AWS');
        const userMessage = isInternal
          ? 'Unable to submit doctor application at the moment. Please try again later.'
          : error.message;
        res.status(HttpStatus.BAD_REQUEST).json({ error: userMessage });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: 'Unable to submit doctor application at the moment. Please try again later.' });
      }
    }
  };

  getMyStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.doctorService.getMyStatus(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error('DoctorController.getMyStatus error:', error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal error occurred' });
      }
    }
  };

  getMyDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.doctorService.getMyDashboard(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      logger.error('DoctorController.getMyDashboard error:', error);
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal error occurred' });
      }
    }
  };
}
