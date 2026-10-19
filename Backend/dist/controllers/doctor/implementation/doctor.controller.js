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
import { ZodError } from 'zod';
import { TYPES } from '../../../container/types.js';
import { HttpStatus } from '../../../constants/status.constant.js';
import { HttpResponse } from '../../../constants/messages.constant.js';
import { logger } from '../../../shared/logger/logger.js';
import { applyDoctorSchema } from '../../../validators/doctor.validator.js';
import { AppError } from '../../../shared/errors/AppError.js';
let DoctorController = class DoctorController {
    doctorService;
    constructor(doctorService) {
        this.doctorService = doctorService;
    }
    apply = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            if (!req.user?.userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: HttpResponse.UNAUTHORIZED,
                    error: HttpResponse.UNAUTHORIZED,
                    requestId,
                });
                return;
            }
            const files = req.files;
            if (!files || Object.keys(files).length === 0) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Please upload the required verification documents.',
                    error: 'Please upload the required verification documents.',
                    requestId,
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
                    success: false,
                    message: 'Invalid schedule availability format.',
                    error: 'Invalid schedule availability format.',
                    requestId,
                });
                return;
            }
            const bodyData = {
                fullName: req.body.fullName,
                specialization: req.body.specialization,
                qualification: req.body.qualification,
                experience: req.body.experience !== undefined ? Number(req.body.experience) : undefined,
                registrationNumber: req.body.registrationNumber,
                consultationFee: req.body.consultationFee !== undefined ? Number(req.body.consultationFee) : undefined,
                clinicName: req.body.clinicName,
                clinicAddress: req.body.clinicAddress,
                availability,
            };
            const validatedBody = applyDoctorSchema.parse(bodyData);
            const result = await this.doctorService.apply(req.user.userId, validatedBody, files);
            res.status(HttpStatus.CREATED).json(result);
        }
        catch (error) {
            logger.error('DoctorController.apply error:', error);
            if (error instanceof ZodError) {
                const firstErrorMessage = error.issues[0]?.message || 'Please check your application details.';
                const formattedErrors = {};
                for (const issue of error.issues) {
                    const path = issue.path.join('.');
                    if (path && !formattedErrors[path])
                        formattedErrors[path] = issue.message;
                }
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: firstErrorMessage,
                    error: firstErrorMessage,
                    errors: formattedErrors,
                    requestId,
                });
                return;
            }
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.message,
                    requestId,
                });
                return;
            }
            if (error instanceof Error) {
                const isInternal = error.message.includes('credentials') ||
                    error.message.includes('ECONNREFUSED') ||
                    error.message.includes('AWS');
                const userMessage = isInternal
                    ? 'Unable to submit doctor application at the moment. Please try again later.'
                    : error.message;
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: userMessage,
                    error: userMessage,
                    requestId,
                });
                return;
            }
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: HttpResponse.SERVER_ERROR,
                error: HttpResponse.SERVER_ERROR,
                requestId,
            });
        }
    };
    getMyStatus = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getMyStatus(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error('DoctorController.getMyStatus error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.message,
                    requestId,
                });
                return;
            }
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    error: error.message,
                    requestId,
                });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: HttpResponse.SERVER_ERROR,
                    error: HttpResponse.SERVER_ERROR,
                    requestId,
                });
            }
        }
    };
    getMyDashboard = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getMyDashboard(userId);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error('DoctorController.getMyDashboard error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.message,
                    requestId,
                });
                return;
            }
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    error: error.message,
                    requestId,
                });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: HttpResponse.SERVER_ERROR,
                    error: HttpResponse.SERVER_ERROR,
                    requestId,
                });
            }
        }
    };
    getVerifiedDoctors = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const result = await this.doctorService.getVerifiedDoctors();
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            logger.error('DoctorController.getVerifiedDoctors error:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.message,
                    requestId,
                });
                return;
            }
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    error: error.message,
                    requestId,
                });
            }
            else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: HttpResponse.SERVER_ERROR,
                    error: HttpResponse.SERVER_ERROR,
                    requestId,
                });
            }
        }
    };
    // ── Appointments ───────────────────────────
    bookAppointment = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.bookAppointment(userId, req.body);
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Appointment booked successfully.',
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.bookAppointment error:', error);
            this._handleError(res, error, requestId);
        }
    };
    getPatientAppointments = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getPatientAppointments(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.getPatientAppointments error:', error);
            this._handleError(res, error, requestId);
        }
    };
    getDoctorAppointments = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getDoctorAppointments(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.getDoctorAppointments error:', error);
            this._handleError(res, error, requestId);
        }
    };
    completeAppointment = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const appointmentId = req.params.appointmentId;
            const result = await this.doctorService.completeAppointment(userId, appointmentId, req.body);
            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Consultation marked as completed.',
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.completeAppointment error:', error);
            this._handleError(res, error, requestId);
        }
    };
    cancelAppointment = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const appointmentId = req.params.appointmentId;
            const result = await this.doctorService.cancelAppointment(userId, appointmentId, req.body);
            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Appointment cancelled successfully.',
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.cancelAppointment error:', error);
            this._handleError(res, error, requestId);
        }
    };
    // ── Primary Doctor Relationships ───────────
    getPatientPrimaryDoctor = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getPatientPrimaryDoctor(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.getPatientPrimaryDoctor error:', error);
            this._handleError(res, error, requestId);
        }
    };
    requestPrimaryDoctor = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const { doctorId } = req.body;
            const result = await this.doctorService.requestPrimaryDoctor(userId, doctorId);
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Primary doctor request sent successfully.',
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.requestPrimaryDoctor error:', error);
            this._handleError(res, error, requestId);
        }
    };
    cancelPrimaryDoctorRequest = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.cancelPrimaryDoctorRequest(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            logger.error('DoctorController.cancelPrimaryDoctorRequest error:', error);
            this._handleError(res, error, requestId);
        }
    };
    removePrimaryDoctor = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.removePrimaryDoctor(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            logger.error('DoctorController.removePrimaryDoctor error:', error);
            this._handleError(res, error, requestId);
        }
    };
    getDoctorPrimaryRequests = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.getDoctorPrimaryRequests(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.getDoctorPrimaryRequests error:', error);
            this._handleError(res, error, requestId);
        }
    };
    respondToPrimaryRequest = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const primaryRequestId = req.params.requestId;
            const result = await this.doctorService.respondToPrimaryRequest(userId, primaryRequestId, req.body);
            res.status(HttpStatus.OK).json({
                success: true,
                message: req.body.action === 'accept' ? 'Primary doctor request accepted.' : 'Primary doctor request declined.',
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.respondToPrimaryRequest error:', error);
            this._handleError(res, error, requestId);
        }
    };
    // ── Reporting ──────────────────────────────
    submitDoctorReport = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const userId = req.user.userId;
            const result = await this.doctorService.submitDoctorReport(userId, req.body);
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Your report has been submitted to administration for review.',
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.submitDoctorReport error:', error);
            this._handleError(res, error, requestId);
        }
    };
    getDoctorReports = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const status = typeof req.query.status === 'string' ? req.query.status : undefined;
            const result = await this.doctorService.getDoctorReports(status);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.getDoctorReports error:', error);
            this._handleError(res, error, requestId);
        }
    };
    resolveDoctorReport = async (req, res) => {
        const requestId = req.id || 'N/A';
        try {
            const adminUserId = req.user.userId;
            const reportId = req.params.reportId;
            const { adminRemarks } = req.body;
            const result = await this.doctorService.resolveDoctorReport(reportId, adminRemarks, adminUserId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Doctor report resolved successfully.',
                data: result,
            });
        }
        catch (error) {
            logger.error('DoctorController.resolveDoctorReport error:', error);
            this._handleError(res, error, requestId);
        }
    };
    _handleError(res, error, requestId) {
        if (error instanceof ZodError) {
            const firstErrorMessage = error.issues[0]?.message || 'Validation error.';
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: firstErrorMessage,
                error: firstErrorMessage,
                requestId,
            });
            return;
        }
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.message,
                requestId,
            });
            return;
        }
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
                error: error.message,
                requestId,
            });
            return;
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: HttpResponse.SERVER_ERROR,
            error: HttpResponse.SERVER_ERROR,
            requestId,
        });
    }
};
DoctorController = __decorate([
    injectable(),
    __param(0, inject(TYPES.DoctorService)),
    __metadata("design:paramtypes", [Object])
], DoctorController);
export { DoctorController };
//# sourceMappingURL=doctor.controller.js.map