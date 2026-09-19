var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../container/types.js';
import { HttpStatus } from '../../../constants/status.constant.js';
import { logger } from '../../../shared/logger/logger.js';
let DoctorController = class DoctorController {
    doctorService;
    constructor(doctorService) {
        this.doctorService = doctorService;
    }
    apply = async (req, res) => {
        try {
            if (!req.user?.userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Not authenticated' });
                return;
            }
            const files = req.files;
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
            }
            catch {
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
            const result = await this.doctorService.apply(req.user.userId, bodyData, files);
            res.status(HttpStatus.CREATED).json(result);
        }
        catch (error) {
            logger.error('DoctorController.apply error:', error);
            if (error instanceof Error) {
                const isInternal = error.message.includes('credentials') ||
                    error.message.includes('ECONNREFUSED') ||
                    error.message.includes('AWS');
                const userMessage = isInternal
                    ? 'Unable to submit doctor application at the moment. Please try again later.'
                    : error.message;
                res.status(HttpStatus.BAD_REQUEST).json({ error: userMessage });
            }
            else {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Unable to submit doctor application at the moment. Please try again later.' });
            }
        }
    };
    getMyStatus = async (req, res) => {
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getMyStatus(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error('DoctorController.getMyStatus error:', error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal error occurred' });
            }
        }
    };
    getMyDashboard = async (req, res) => {
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getMyDashboard(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error('DoctorController.getMyDashboard error:', error);
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal error occurred' });
            }
        }
    };
};
DoctorController = __decorate([
    injectable(),
    __param(0, inject(TYPES.DoctorService)),
    __metadata("design:paramtypes", [Object])
], DoctorController);
export { DoctorController };
//# sourceMappingURL=doctor.controller.js.map