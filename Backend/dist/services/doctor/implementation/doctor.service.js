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
import { Types } from 'mongoose';
import { TYPES } from '../../../container/types.js';
import { toDoctorApplicationDTO, toDoctorStatusDTO, toDoctorDashboardDTO, toVerifiedDoctorDTO, toAppointmentDTO, toPrimaryDoctorRelationshipDTO, toDoctorReportDTO, } from '../../../mapper/doctor.mapper.js';
import { HttpResponse } from '../../../constants/messages.constant.js';
import UserModel from '../../../models/User.model.js';
import { uploadToS3, generateS3Key, getPresignedUrl, validateFile, PDF_ONLY, ALLOWED_MIME_TYPES, IMAGE_ONLY, } from '../../../utils/s3Upload.js';
import { ValidationError, NotFoundError, ForbiddenError, ConflictError, } from '../../../shared/errors/AppError.js';
let DoctorService = class DoctorService {
    doctorRepository;
    userRepository;
    appointmentRepository;
    primaryDoctorRepository;
    doctorReportRepository;
    constructor(doctorRepository, userRepository, appointmentRepository, primaryDoctorRepository, doctorReportRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.primaryDoctorRepository = primaryDoctorRepository;
        this.doctorReportRepository = doctorReportRepository;
    }
    async apply(userId, data, files) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        const existing = await this.doctorRepository.findApplicationByUserId(userId);
        if (existing) {
            if (existing.application.status === 'pending' ||
                existing.application.status === 'under_review') {
                throw new ValidationError('You already have a pending application.');
            }
            if (existing.application.status === 'approved') {
                throw new ValidationError('Your application is already approved.');
            }
        }
        // ── Validate files ────────────────────────
        const profileImageFile = files.profileImage?.[0];
        const degreeFile = files.degreeCertificate?.[0];
        const regFile = files.registrationCertificate?.[0];
        const govFile = files.governmentId?.[0];
        if (!degreeFile || !regFile || !govFile) {
            throw new ValidationError('All three documents are required.');
        }
        let profileKey = '';
        const uploadPromises = [];
        if (profileImageFile) {
            const profileValidation = validateFile(profileImageFile.mimetype, profileImageFile.size, IMAGE_ONLY);
            if (!profileValidation.valid) {
                throw new ValidationError(`Profile Image: ${profileValidation.error}`);
            }
            profileKey = generateS3Key('doctor-profiles', profileImageFile.mimetype);
            uploadPromises.push(uploadToS3(profileImageFile.buffer, profileKey, profileImageFile.mimetype));
        }
        // degree — PDF only
        const degreeValidation = validateFile(degreeFile.mimetype, degreeFile.size, PDF_ONLY);
        if (!degreeValidation.valid) {
            throw new ValidationError(`Degree Certificate: ${degreeValidation.error}`);
        }
        // registration — PDF only
        const regValidation = validateFile(regFile.mimetype, regFile.size, PDF_ONLY);
        if (!regValidation.valid) {
            throw new ValidationError(`Registration Certificate: ${regValidation.error}`);
        }
        // government ID — PDF/JPG/PNG
        const govValidation = validateFile(govFile.mimetype, govFile.size, ALLOWED_MIME_TYPES);
        if (!govValidation.valid) {
            throw new ValidationError(`Government ID: ${govValidation.error}`);
        }
        const degreeKey = generateS3Key('doctor-documents', degreeFile.mimetype);
        const regKey = generateS3Key('doctor-documents', regFile.mimetype);
        const govKey = generateS3Key('doctor-documents', govFile.mimetype);
        uploadPromises.push(uploadToS3(degreeFile.buffer, degreeKey, degreeFile.mimetype), uploadToS3(regFile.buffer, regKey, regFile.mimetype), uploadToS3(govFile.buffer, govKey, govFile.mimetype));
        await Promise.all(uploadPromises);
        const docApp = await this.doctorRepository.createApplication({
            userId: new Types.ObjectId(userId),
            fullName: data.fullName,
            specialization: data.specialization,
            qualification: data.qualification,
            experience: data.experience,
            registrationNumber: data.registrationNumber,
            consultationFee: data.consultationFee,
            clinicName: data.clinicName,
            clinicAddress: data.clinicAddress,
            profileImage: profileKey,
            availability: data.availability,
            degreeCertificateUrl: degreeKey,
            registrationCertificateUrl: regKey,
            governmentIdUrl: govKey,
            status: 'pending',
            isBlocked: false,
            isDeleted: false,
        });
        return {
            message: HttpResponse.DOCTOR_APPLICATION_SENT,
            application: toDoctorApplicationDTO(docApp),
        };
    }
    async getMyStatus(userId) {
        const data = await this.doctorRepository.findApplicationByUserId(userId);
        if (!data)
            throw new NotFoundError(HttpResponse.DOCTOR_PROFILE_NOT_FOUND);
        const presignedUrls = await this._resolvePresignedUrls(data.application);
        return toDoctorStatusDTO(data, presignedUrls);
    }
    async getMyDashboard(userId) {
        const data = await this.doctorRepository.findApplicationByUserId(userId);
        if (!data)
            throw new NotFoundError(HttpResponse.DOCTOR_PROFILE_NOT_FOUND);
        if (data.application.status !== 'approved') {
            throw new ForbiddenError(HttpResponse.FORBIDDEN);
        }
        const presignedUrls = await this._resolvePresignedUrls(data.application);
        return toDoctorDashboardDTO(data, presignedUrls);
    }
    async getVerifiedDoctors() {
        const verifiedDoctors = await this.doctorRepository.findVerifiedDoctors();
        const doctorsWithUrls = await Promise.all(verifiedDoctors.map(async (doc) => {
            let profileUrl;
            if (doc.application.profileImage) {
                try {
                    profileUrl = await getPresignedUrl(doc.application.profileImage);
                }
                catch {
                    profileUrl = undefined;
                }
            }
            return toVerifiedDoctorDTO(doc, profileUrl);
        }));
        return {
            doctors: doctorsWithUrls,
            total: doctorsWithUrls.length,
        };
    }
    // ── Appointments ───────────────────────────
    async bookAppointment(patientId, data) {
        const patient = await this.userRepository.findById(patientId);
        if (!patient)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        // Look up doctor
        const doctorApp = await this.doctorRepository.findApplicationByUserId(data.doctorId);
        if (!doctorApp || doctorApp.application.status !== 'approved') {
            throw new ValidationError('This doctor is no longer available for booking.');
        }
        const appDate = new Date(data.appointmentDate);
        if (isNaN(appDate.getTime())) {
            throw new ValidationError('Please enter a valid appointment date.');
        }
        // Check slot availability
        const isBooked = await this.appointmentRepository.isSlotBooked(doctorApp.user._id.toString(), appDate, data.timeSlot);
        if (isBooked) {
            throw new ConflictError('This appointment slot is no longer available. Please select another slot.');
        }
        const appointment = await this.appointmentRepository.createAppointment({
            patientId,
            doctorId: doctorApp.user._id.toString(),
            doctorApplicationId: doctorApp.application._id.toString(),
            appointmentDate: appDate,
            timeSlot: data.timeSlot,
            reason: data.reason,
        });
        const populated = await this.appointmentRepository.findAppointmentById(appointment._id.toString());
        return toAppointmentDTO(populated || appointment);
    }
    async getPatientAppointments(patientId) {
        const appointments = await this.appointmentRepository.findPatientAppointments(patientId);
        return appointments.map(toAppointmentDTO);
    }
    async getDoctorAppointments(doctorId) {
        const appointments = await this.appointmentRepository.findDoctorAppointments(doctorId);
        return appointments.map(toAppointmentDTO);
    }
    async completeAppointment(doctorId, appointmentId, data) {
        const appointment = await this.appointmentRepository.findAppointmentById(appointmentId);
        if (!appointment)
            throw new NotFoundError('Appointment not found.');
        const docId = appointment.doctorId?._id?.toString() || appointment.doctorId.toString();
        if (docId !== doctorId.toString()) {
            throw new ForbiddenError("You don't have permission to complete this appointment.");
        }
        const updated = await this.appointmentRepository.completeAppointment(appointmentId, data.consultationNotes, data.prescription);
        if (!updated)
            throw new NotFoundError('Appointment not found.');
        return toAppointmentDTO(updated);
    }
    async cancelAppointment(userId, appointmentId, data) {
        const appointment = await this.appointmentRepository.findAppointmentById(appointmentId);
        if (!appointment)
            throw new NotFoundError('Appointment not found.');
        const pId = appointment.patientId?._id?.toString() || appointment.patientId.toString();
        const dId = appointment.doctorId?._id?.toString() || appointment.doctorId.toString();
        if (pId !== userId.toString() && dId !== userId.toString()) {
            throw new ForbiddenError("You don't have permission to cancel this appointment.");
        }
        const updated = await this.appointmentRepository.cancelAppointment(appointmentId, data.cancelReason);
        if (!updated)
            throw new NotFoundError('Appointment not found.');
        return toAppointmentDTO(updated);
    }
    // ── Primary Doctor Relationships ───────────
    async getPatientPrimaryDoctor(patientId) {
        const active = await this.primaryDoctorRepository.findActiveRelationship(patientId);
        if (active) {
            const doctorDto = active.doctorApplicationId ? {
                id: active.doctorApplicationId._id?.toString() || '',
                userId: active.doctorId?._id?.toString() || active.doctorId.toString(),
                name: active.doctorId?.name || active.doctorApplicationId.fullName,
                fullName: active.doctorApplicationId.fullName,
                specialization: active.doctorApplicationId.specialization,
                qualification: active.doctorApplicationId.qualification || '',
                experience: active.doctorApplicationId.experience || 0,
                registrationNumber: active.doctorApplicationId.registrationNumber || '',
                consultationFee: active.doctorApplicationId.consultationFee || 0,
                clinicName: active.doctorApplicationId.clinicName,
                clinicAddress: active.doctorApplicationId.clinicAddress || '',
                profileImage: active.doctorApplicationId.profileImage,
                availability: active.doctorApplicationId.availability,
                isVerified: true,
                phone: active.doctorId?.phone,
            } : undefined;
            return {
                status: 'active',
                primaryDoctor: doctorDto,
                relationshipId: active._id.toString(),
            };
        }
        const pending = await this.primaryDoctorRepository.findPendingRelationship(patientId);
        if (pending) {
            const doctorDto = pending.doctorApplicationId ? {
                id: pending.doctorApplicationId._id?.toString() || '',
                userId: pending.doctorId?._id?.toString() || pending.doctorId.toString(),
                name: pending.doctorId?.name || pending.doctorApplicationId.fullName,
                fullName: pending.doctorApplicationId.fullName,
                specialization: pending.doctorApplicationId.specialization,
                qualification: pending.doctorApplicationId.qualification || '',
                experience: pending.doctorApplicationId.experience || 0,
                registrationNumber: pending.doctorApplicationId.registrationNumber || '',
                consultationFee: pending.doctorApplicationId.consultationFee || 0,
                clinicName: pending.doctorApplicationId.clinicName,
                clinicAddress: pending.doctorApplicationId.clinicAddress || '',
                profileImage: pending.doctorApplicationId.profileImage,
                availability: pending.doctorApplicationId.availability,
                isVerified: true,
                phone: pending.doctorId?.phone,
            } : {};
            return {
                status: 'pending',
                pendingRequest: {
                    id: pending._id.toString(),
                    doctor: doctorDto,
                    requestedAt: pending.requestedAt,
                },
                relationshipId: pending._id.toString(),
            };
        }
        return { status: 'none' };
    }
    async requestPrimaryDoctor(patientId, doctorId) {
        const patient = await this.userRepository.findById(patientId);
        if (!patient)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        const doctorApp = await this.doctorRepository.findApplicationByUserId(doctorId);
        if (!doctorApp || doctorApp.application.status !== 'approved') {
            throw new ValidationError('This doctor is no longer available for selection.');
        }
        // Check if patient already has active with THIS doctor
        const active = await this.primaryDoctorRepository.findActiveRelationship(patientId);
        if (active) {
            const currentDocId = active.doctorId?._id?.toString() || active.doctorId.toString();
            if (currentDocId === doctorApp.user._id.toString()) {
                throw new ValidationError('This doctor is already your active primary doctor.');
            }
        }
        // Check if patient has pending with THIS doctor
        const pending = await this.primaryDoctorRepository.findPendingRelationship(patientId);
        if (pending) {
            const pendingDocId = pending.doctorId?._id?.toString() || pending.doctorId.toString();
            if (pendingDocId === doctorApp.user._id.toString()) {
                throw new ValidationError('Your request to this doctor is already pending.');
            }
            // If pending with another doctor, cancel the previous pending request
            await this.primaryDoctorRepository.updateStatus(pending._id.toString(), 'cancelled', 'PRIMARY_CANCELLED', 'Cancelled in favor of a new primary doctor request.');
        }
        const newReq = await this.primaryDoctorRepository.createRequest(patientId, doctorApp.user._id.toString(), doctorApp.application._id.toString());
        const populated = await this.primaryDoctorRepository.findRelationshipById(newReq._id.toString());
        return toPrimaryDoctorRelationshipDTO(populated || newReq);
    }
    async cancelPrimaryDoctorRequest(patientId) {
        const pending = await this.primaryDoctorRepository.findPendingRelationship(patientId);
        if (!pending)
            throw new NotFoundError('No pending primary doctor request found.');
        await this.primaryDoctorRepository.updateStatus(pending._id.toString(), 'cancelled', 'PRIMARY_CANCELLED', 'Request cancelled by patient.');
        return { message: 'Primary doctor request cancelled successfully.' };
    }
    async removePrimaryDoctor(patientId) {
        const active = await this.primaryDoctorRepository.findActiveRelationship(patientId);
        if (!active)
            throw new NotFoundError('No active primary doctor found.');
        await this.primaryDoctorRepository.updateStatus(active._id.toString(), 'ended', 'PRIMARY_ENDED', 'Primary doctor removed by patient.');
        return { message: 'Primary doctor removed successfully.' };
    }
    async getDoctorPrimaryRequests(doctorId) {
        const requests = await this.primaryDoctorRepository.findRequestsForDoctor(doctorId, 'pending');
        return requests.map(toPrimaryDoctorRelationshipDTO);
    }
    async respondToPrimaryRequest(doctorId, requestId, data) {
        const request = await this.primaryDoctorRepository.findRelationshipById(requestId);
        if (!request)
            throw new NotFoundError('Primary doctor request not found.');
        const dId = request.doctorId?._id?.toString() || request.doctorId.toString();
        if (dId !== doctorId.toString()) {
            throw new ForbiddenError("You don't have permission to respond to this request.");
        }
        const patientId = request.patientId?._id?.toString() || request.patientId.toString();
        if (data.action === 'accept') {
            const docUser = await UserModel.findById(doctorId).lean();
            // End any previous active primary doctor for this patient
            await this.primaryDoctorRepository.endActiveRelationshipsForPatient(patientId, docUser?.name || 'New Doctor');
            const updated = await this.primaryDoctorRepository.updateStatus(requestId, 'active', 'PRIMARY_ACCEPTED', 'Primary doctor request accepted by doctor.');
            if (!updated)
                throw new NotFoundError('Request could not be updated.');
            return toPrimaryDoctorRelationshipDTO(updated);
        }
        else {
            const updated = await this.primaryDoctorRepository.updateStatus(requestId, 'declined', 'PRIMARY_DECLINED', data.reason || 'Primary doctor request declined by doctor.', data.reason);
            if (!updated)
                throw new NotFoundError('Request could not be updated.');
            return toPrimaryDoctorRelationshipDTO(updated);
        }
    }
    // ── Reporting ──────────────────────────────
    async submitDoctorReport(patientId, data) {
        const patient = await this.userRepository.findById(patientId);
        if (!patient)
            throw new NotFoundError(HttpResponse.USER_NOT_FOUND);
        const doctorApp = await this.doctorRepository.findApplicationByUserId(data.doctorId);
        if (!doctorApp)
            throw new NotFoundError('Doctor not found.');
        const report = await this.doctorReportRepository.createReport({
            patientId,
            doctorId: doctorApp.user._id.toString(),
            appointmentId: data.appointmentId,
            reason: data.reason,
            description: data.description,
        });
        const populated = await this.doctorReportRepository.findReportById(report._id.toString());
        return toDoctorReportDTO(populated || report);
    }
    async getDoctorReports(status) {
        const reports = await this.doctorReportRepository.findAllReports(status);
        return reports.map(toDoctorReportDTO);
    }
    async resolveDoctorReport(reportId, adminRemarks, adminUserId) {
        const resolved = await this.doctorReportRepository.resolveReport(reportId, adminRemarks, adminUserId);
        if (!resolved)
            throw new NotFoundError('Doctor report not found.');
        return toDoctorReportDTO(resolved);
    }
    async _resolvePresignedUrls(application) {
        const [degreeUrl, regUrl, govUrl] = await Promise.allSettled([
            application.degreeCertificateUrl
                ? getPresignedUrl(application.degreeCertificateUrl)
                : Promise.resolve(undefined),
            application.registrationCertificateUrl
                ? getPresignedUrl(application.registrationCertificateUrl)
                : Promise.resolve(undefined),
            application.governmentIdUrl
                ? getPresignedUrl(application.governmentIdUrl)
                : Promise.resolve(undefined),
        ]);
        return {
            degreeCertificateUrl: degreeUrl.status === 'fulfilled'
                ? degreeUrl.value : undefined,
            registrationCertificateUrl: regUrl.status === 'fulfilled'
                ? regUrl.value : undefined,
            governmentIdUrl: govUrl.status === 'fulfilled'
                ? govUrl.value : undefined,
        };
    }
};
DoctorService = __decorate([
    injectable(),
    __param(0, inject(TYPES.DoctorRepository)),
    __param(1, inject(TYPES.UserRepository)),
    __param(2, inject(TYPES.AppointmentRepository)),
    __param(3, inject(TYPES.PrimaryDoctorRepository)),
    __param(4, inject(TYPES.DoctorReportRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DoctorService);
export { DoctorService };
//# sourceMappingURL=doctor.service.js.map