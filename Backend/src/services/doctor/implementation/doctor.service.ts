import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Types } from 'mongoose';
import { TYPES } from '../../../container/types.js';
import type { IDoctorRepository } from '../../../repositories/doctor/interface/IDoctor.repository.js';
import type { IUserRepository } from '../../../repositories/auth/interface/IUser.repository.js';
import type { IAppointmentRepository } from '../../../repositories/appointment/interface/IAppointment.repository.js';
import type { IPrimaryDoctorRepository } from '../../../repositories/primaryDoctor/interface/IPrimaryDoctor.repository.js';
import type { IDoctorReportRepository } from '../../../repositories/doctorReport/interface/IDoctorReport.repository.js';
import type { IDoctorService } from '../interface/IDoctor.service.js';
import {
  toDoctorApplicationDTO,
  toDoctorStatusDTO,
  toDoctorDashboardDTO,
  toVerifiedDoctorDTO,
  toAppointmentDTO,
  toPrimaryDoctorRelationshipDTO,
  toDoctorReportDTO,
} from '../../../mapper/doctor.mapper.js';
import { HttpResponse } from '../../../constants/messages.constant.js';
import {
  DoctorApplyDTO,
  DoctorDashboardDTO,
  GetVerifiedDoctorsResponseDTO,
  BookAppointmentDTO,
  AppointmentDTO,
  CompleteAppointmentDTO,
  CancelAppointmentDTO,
  PatientPrimaryDoctorStatusDTO,
  PrimaryDoctorRelationshipDTO,
  RespondPrimaryDoctorRequestDTO,
  SubmitDoctorReportDTO,
  DoctorReportDTO,
} from '../../../dtos/doctor.dto.js';
import UserModel from '../../../models/User.model.js';
import {
  uploadToS3,
  generateS3Key,
  getPresignedUrl,
  validateFile,
  PDF_ONLY,
  ALLOWED_MIME_TYPES,
  IMAGE_ONLY,
} from '../../../utils/s3Upload.js';
import { DoctorApplicationDocument } from '../../../types/doctor.js';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../../../shared/errors/AppError.js';

export interface UploadFiles {
  profileImage?: Express.Multer.File[];
  degreeCertificate?: Express.Multer.File[];
  registrationCertificate?: Express.Multer.File[];
  governmentId?: Express.Multer.File[];
}

@injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @inject(TYPES.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.AppointmentRepository) private appointmentRepository: IAppointmentRepository,
    @inject(TYPES.PrimaryDoctorRepository) private primaryDoctorRepository: IPrimaryDoctorRepository,
    @inject(TYPES.DoctorReportRepository) private doctorReportRepository: IDoctorReportRepository,
  ) {}

  async apply(
    userId: string,
    data: DoctorApplyDTO,
    files: {
      [field: string]: Express.Multer.File[];
    }
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);

    const existing = await this.doctorRepository.findApplicationByUserId(userId);
    if (existing) {
      if (
        existing.application.status === 'pending' ||
        existing.application.status === 'under_review'
      ) {
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

    let profileKey: string = '';
    const uploadPromises: Promise<string>[] = [];

    if (profileImageFile) {
      const profileValidation = validateFile(
        profileImageFile.mimetype,
        profileImageFile.size,
        IMAGE_ONLY
      );
      if (!profileValidation.valid) {
        throw new ValidationError(`Profile Image: ${profileValidation.error}`);
      }
      profileKey = generateS3Key('doctor-profiles', profileImageFile.mimetype);
      uploadPromises.push(
        uploadToS3(profileImageFile.buffer, profileKey, profileImageFile.mimetype)
      );
    }

    // degree — PDF only
    const degreeValidation = validateFile(
      degreeFile.mimetype,
      degreeFile.size,
      PDF_ONLY
    );
    if (!degreeValidation.valid) {
      throw new ValidationError(`Degree Certificate: ${degreeValidation.error}`);
    }

    // registration — PDF only
    const regValidation = validateFile(
      regFile.mimetype,
      regFile.size,
      PDF_ONLY
    );
    if (!regValidation.valid) {
      throw new ValidationError(`Registration Certificate: ${regValidation.error}`);
    }

    // government ID — PDF/JPG/PNG
    const govValidation = validateFile(
      govFile.mimetype,
      govFile.size,
      ALLOWED_MIME_TYPES
    );
    if (!govValidation.valid) {
      throw new ValidationError(`Government ID: ${govValidation.error}`);
    }

    const degreeKey = generateS3Key('doctor-documents', degreeFile.mimetype);
    const regKey = generateS3Key('doctor-documents', regFile.mimetype);
    const govKey = generateS3Key('doctor-documents', govFile.mimetype);

    uploadPromises.push(
      uploadToS3(degreeFile.buffer, degreeKey, degreeFile.mimetype),
      uploadToS3(regFile.buffer, regKey, regFile.mimetype),
      uploadToS3(govFile.buffer, govKey, govFile.mimetype)
    );

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

  async getMyStatus(userId: string) {
    const data = await this.doctorRepository.findApplicationByUserId(userId);
    if (!data) throw new NotFoundError(HttpResponse.DOCTOR_PROFILE_NOT_FOUND);
    const presignedUrls = await this._resolvePresignedUrls(data.application);
    return toDoctorStatusDTO(data, presignedUrls);
  }

  async getMyDashboard(userId: string): Promise<DoctorDashboardDTO> {
    const data = await this.doctorRepository.findApplicationByUserId(userId);
    if (!data) throw new NotFoundError(HttpResponse.DOCTOR_PROFILE_NOT_FOUND);

    if (data.application.status !== 'approved') {
      throw new ForbiddenError(HttpResponse.FORBIDDEN);
    }

    const presignedUrls = await this._resolvePresignedUrls(data.application);
    return toDoctorDashboardDTO(data, presignedUrls);
  }

  async getVerifiedDoctors(): Promise<GetVerifiedDoctorsResponseDTO> {
    const verifiedDoctors = await this.doctorRepository.findVerifiedDoctors();

    const doctorsWithUrls = await Promise.all(
      verifiedDoctors.map(async (doc) => {
        let profileUrl: string | undefined;
        if (doc.application.profileImage) {
          try {
            profileUrl = await getPresignedUrl(doc.application.profileImage);
          } catch {
            profileUrl = undefined;
          }
        }
        return toVerifiedDoctorDTO(doc, profileUrl);
      })
    );

    return {
      doctors: doctorsWithUrls,
      total: doctorsWithUrls.length,
    };
  }

  // ── Appointments ───────────────────────────

  async bookAppointment(patientId: string, data: BookAppointmentDTO): Promise<AppointmentDTO> {
    const patient = await this.userRepository.findById(patientId);
    if (!patient) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);

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
    const isBooked = await this.appointmentRepository.isSlotBooked(
      doctorApp.user._id.toString(),
      appDate,
      data.timeSlot
    );

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

  async getPatientAppointments(patientId: string): Promise<AppointmentDTO[]> {
    const appointments = await this.appointmentRepository.findPatientAppointments(patientId);
    return appointments.map(toAppointmentDTO);
  }

  async getDoctorAppointments(doctorId: string): Promise<AppointmentDTO[]> {
    const appointments = await this.appointmentRepository.findDoctorAppointments(doctorId);
    return appointments.map(toAppointmentDTO);
  }

  async completeAppointment(
    doctorId: string,
    appointmentId: string,
    data: CompleteAppointmentDTO
  ): Promise<AppointmentDTO> {
    const appointment = await this.appointmentRepository.findAppointmentById(appointmentId);
    if (!appointment) throw new NotFoundError('Appointment not found.');

    const docId = (appointment.doctorId as any)?._id?.toString() || appointment.doctorId.toString();
    if (docId !== doctorId.toString()) {
      throw new ForbiddenError("You don't have permission to complete this appointment.");
    }

    const updated = await this.appointmentRepository.completeAppointment(
      appointmentId,
      data.consultationNotes,
      data.prescription
    );

    if (!updated) throw new NotFoundError('Appointment not found.');
    return toAppointmentDTO(updated);
  }

  async cancelAppointment(
    userId: string,
    appointmentId: string,
    data: CancelAppointmentDTO
  ): Promise<AppointmentDTO> {
    const appointment = await this.appointmentRepository.findAppointmentById(appointmentId);
    if (!appointment) throw new NotFoundError('Appointment not found.');

    const pId = (appointment.patientId as any)?._id?.toString() || appointment.patientId.toString();
    const dId = (appointment.doctorId as any)?._id?.toString() || appointment.doctorId.toString();

    if (pId !== userId.toString() && dId !== userId.toString()) {
      throw new ForbiddenError("You don't have permission to cancel this appointment.");
    }

    const updated = await this.appointmentRepository.cancelAppointment(
      appointmentId,
      data.cancelReason
    );

    if (!updated) throw new NotFoundError('Appointment not found.');
    return toAppointmentDTO(updated);
  }

  // ── Primary Doctor Relationships ───────────

  async getPatientPrimaryDoctor(patientId: string): Promise<PatientPrimaryDoctorStatusDTO> {
    const active = await this.primaryDoctorRepository.findActiveRelationship(patientId);
    if (active) {
      const doctorDto = active.doctorApplicationId ? {
        id: (active.doctorApplicationId as any)._id?.toString() || '',
        userId: (active.doctorId as any)?._id?.toString() || active.doctorId.toString(),
        name: (active.doctorId as any)?.name || (active.doctorApplicationId as any).fullName,
        fullName: (active.doctorApplicationId as any).fullName,
        specialization: (active.doctorApplicationId as any).specialization,
        qualification: (active.doctorApplicationId as any).qualification || '',
        experience: (active.doctorApplicationId as any).experience || 0,
        registrationNumber: (active.doctorApplicationId as any).registrationNumber || '',
        consultationFee: (active.doctorApplicationId as any).consultationFee || 0,
        clinicName: (active.doctorApplicationId as any).clinicName,
        clinicAddress: (active.doctorApplicationId as any).clinicAddress || '',
        profileImage: (active.doctorApplicationId as any).profileImage,
        availability: (active.doctorApplicationId as any).availability,
        isVerified: true,
        phone: (active.doctorId as any)?.phone,
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
        id: (pending.doctorApplicationId as any)._id?.toString() || '',
        userId: (pending.doctorId as any)?._id?.toString() || pending.doctorId.toString(),
        name: (pending.doctorId as any)?.name || (pending.doctorApplicationId as any).fullName,
        fullName: (pending.doctorApplicationId as any).fullName,
        specialization: (pending.doctorApplicationId as any).specialization,
        qualification: (pending.doctorApplicationId as any).qualification || '',
        experience: (pending.doctorApplicationId as any).experience || 0,
        registrationNumber: (pending.doctorApplicationId as any).registrationNumber || '',
        consultationFee: (pending.doctorApplicationId as any).consultationFee || 0,
        clinicName: (pending.doctorApplicationId as any).clinicName,
        clinicAddress: (pending.doctorApplicationId as any).clinicAddress || '',
        profileImage: (pending.doctorApplicationId as any).profileImage,
        availability: (pending.doctorApplicationId as any).availability,
        isVerified: true,
        phone: (pending.doctorId as any)?.phone,
      } : ({} as any);

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

  async requestPrimaryDoctor(patientId: string, doctorId: string): Promise<PrimaryDoctorRelationshipDTO> {
    const patient = await this.userRepository.findById(patientId);
    if (!patient) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);

    const doctorApp = await this.doctorRepository.findApplicationByUserId(doctorId);
    if (!doctorApp || doctorApp.application.status !== 'approved') {
      throw new ValidationError('This doctor is no longer available for selection.');
    }

    // Check if patient already has active with THIS doctor
    const active = await this.primaryDoctorRepository.findActiveRelationship(patientId);
    if (active) {
      const currentDocId = (active.doctorId as any)?._id?.toString() || active.doctorId.toString();
      if (currentDocId === doctorApp.user._id.toString()) {
        throw new ValidationError('This doctor is already your active primary doctor.');
      }
    }

    // Check if patient has pending with THIS doctor
    const pending = await this.primaryDoctorRepository.findPendingRelationship(patientId);
    if (pending) {
      const pendingDocId = (pending.doctorId as any)?._id?.toString() || pending.doctorId.toString();
      if (pendingDocId === doctorApp.user._id.toString()) {
        throw new ValidationError('Your request to this doctor is already pending.');
      }
      // If pending with another doctor, cancel the previous pending request
      await this.primaryDoctorRepository.updateStatus(
        pending._id.toString(),
        'cancelled',
        'PRIMARY_CANCELLED',
        'Cancelled in favor of a new primary doctor request.'
      );
    }

    const newReq = await this.primaryDoctorRepository.createRequest(
      patientId,
      doctorApp.user._id.toString(),
      doctorApp.application._id.toString()
    );

    const populated = await this.primaryDoctorRepository.findRelationshipById(newReq._id.toString());
    return toPrimaryDoctorRelationshipDTO(populated || newReq);
  }

  async cancelPrimaryDoctorRequest(patientId: string): Promise<{ message: string }> {
    const pending = await this.primaryDoctorRepository.findPendingRelationship(patientId);
    if (!pending) throw new NotFoundError('No pending primary doctor request found.');

    await this.primaryDoctorRepository.updateStatus(
      pending._id.toString(),
      'cancelled',
      'PRIMARY_CANCELLED',
      'Request cancelled by patient.'
    );

    return { message: 'Primary doctor request cancelled successfully.' };
  }

  async removePrimaryDoctor(patientId: string): Promise<{ message: string }> {
    const active = await this.primaryDoctorRepository.findActiveRelationship(patientId);
    if (!active) throw new NotFoundError('No active primary doctor found.');

    await this.primaryDoctorRepository.updateStatus(
      active._id.toString(),
      'ended',
      'PRIMARY_ENDED',
      'Primary doctor removed by patient.'
    );

    return { message: 'Primary doctor removed successfully.' };
  }

  async getDoctorPrimaryRequests(doctorId: string): Promise<PrimaryDoctorRelationshipDTO[]> {
    const requests = await this.primaryDoctorRepository.findRequestsForDoctor(doctorId, 'pending');
    return requests.map(toPrimaryDoctorRelationshipDTO);
  }

  async respondToPrimaryRequest(
    doctorId: string,
    requestId: string,
    data: RespondPrimaryDoctorRequestDTO
  ): Promise<PrimaryDoctorRelationshipDTO> {
    const request = await this.primaryDoctorRepository.findRelationshipById(requestId);
    if (!request) throw new NotFoundError('Primary doctor request not found.');

    const dId = (request.doctorId as any)?._id?.toString() || request.doctorId.toString();
    if (dId !== doctorId.toString()) {
      throw new ForbiddenError("You don't have permission to respond to this request.");
    }

    const patientId = (request.patientId as any)?._id?.toString() || request.patientId.toString();

    if (data.action === 'accept') {
      const docUser = await UserModel.findById(doctorId).lean();
      // End any previous active primary doctor for this patient
      await this.primaryDoctorRepository.endActiveRelationshipsForPatient(
        patientId,
        docUser?.name || 'New Doctor'
      );

      const updated = await this.primaryDoctorRepository.updateStatus(
        requestId,
        'active',
        'PRIMARY_ACCEPTED',
        'Primary doctor request accepted by doctor.'
      );

      if (!updated) throw new NotFoundError('Request could not be updated.');
      return toPrimaryDoctorRelationshipDTO(updated);
    } else {
      const updated = await this.primaryDoctorRepository.updateStatus(
        requestId,
        'declined',
        'PRIMARY_DECLINED',
        data.reason || 'Primary doctor request declined by doctor.',
        data.reason
      );

      if (!updated) throw new NotFoundError('Request could not be updated.');
      return toPrimaryDoctorRelationshipDTO(updated);
    }
  }

  // ── Reporting ──────────────────────────────

  async submitDoctorReport(patientId: string, data: SubmitDoctorReportDTO): Promise<DoctorReportDTO> {
    const patient = await this.userRepository.findById(patientId);
    if (!patient) throw new NotFoundError(HttpResponse.USER_NOT_FOUND);

    const doctorApp = await this.doctorRepository.findApplicationByUserId(data.doctorId);
    if (!doctorApp) throw new NotFoundError('Doctor not found.');

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

  async getDoctorReports(status?: string): Promise<DoctorReportDTO[]> {
    const reports = await this.doctorReportRepository.findAllReports(status);
    return reports.map(toDoctorReportDTO);
  }

  async resolveDoctorReport(
    reportId: string,
    adminRemarks: string,
    adminUserId: string
  ): Promise<DoctorReportDTO> {
    const resolved = await this.doctorReportRepository.resolveReport(reportId, adminRemarks, adminUserId);
    if (!resolved) throw new NotFoundError('Doctor report not found.');
    return toDoctorReportDTO(resolved);
  }

  private async _resolvePresignedUrls(
    application: DoctorApplicationDocument
  ): Promise<{
    degreeCertificateUrl?: string;
    registrationCertificateUrl?: string;
    governmentIdUrl?: string;
  }> {
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
}