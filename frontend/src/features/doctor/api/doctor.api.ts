import axiosInstance from '@/shared/api/axiosInstance';
import {
  DoctorApplyFormData,
  DoctorApplyResponse,
  DoctorStatusResponse,
  DoctorDashboardResponse,
  GetVerifiedDoctorsResponse,
} from '../types/doctor.types';

export const doctorApi = {
  // apply
  apply: async (data: DoctorApplyFormData): Promise<DoctorApplyResponse> => {
    const formData = new FormData();

    formData.append('fullName', data.fullName);
    formData.append('specialization', data.specialization);
    formData.append('qualification', data.qualification);
    formData.append('experience', data.experience.toString());
    formData.append('registrationNumber', data.registrationNumber);
    formData.append('consultationFee', data.consultationFee.toString());
    formData.append('clinicName', data.clinicName);
    formData.append('clinicAddress', data.clinicAddress);
    formData.append('availability', JSON.stringify(data.availability));

    if (data.profileImage) {
      formData.append('profileImage', data.profileImage);
    }
    if (data.degreeCertificate) {
      formData.append('degreeCertificate', data.degreeCertificate);
    }
    if (data.registrationCertificate) {
      formData.append('registrationCertificate', data.registrationCertificate);
    }
    if (data.governmentId) {
      formData.append('governmentId', data.governmentId);
    }

    const res = await axiosInstance.post('/doctor/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  },

  getMyStatus: async (): Promise<DoctorStatusResponse> => {
    const res = await axiosInstance.get('/doctor/my-status');
    return res.data;
  },

  getMyDashboard: async (): Promise<DoctorDashboardResponse> => {
    const res = await axiosInstance.get('/doctor/my-dashboard');
    return res.data;
  },

  getVerifiedDoctors: async (): Promise<GetVerifiedDoctorsResponse> => {
    const res = await axiosInstance.get('/doctor/verified');
    return res.data;
  },

  // ── Appointments ───────────────────────────
  bookAppointment: async (data: import('../types/doctor.types').BookAppointmentRequest) => {
    const res = await axiosInstance.post<{ success: boolean; message: string; data: import('../types/doctor.types').Appointment }>(
      '/doctor/appointments/book',
      data
    );
    return res.data;
  },

  getPatientAppointments: async () => {
    const res = await axiosInstance.get<{ success: boolean; data: import('../types/doctor.types').Appointment[] }>(
      '/doctor/appointments/patient'
    );
    return res.data;
  },

  getDoctorAppointments: async () => {
    const res = await axiosInstance.get<{ success: boolean; data: import('../types/doctor.types').Appointment[] }>(
      '/doctor/appointments/doctor'
    );
    return res.data;
  },

  completeAppointment: async (
    appointmentId: string,
    data: import('../types/doctor.types').CompleteAppointmentRequest
  ) => {
    const res = await axiosInstance.patch<{ success: boolean; message: string; data: import('../types/doctor.types').Appointment }>(
      `/doctor/appointments/${appointmentId}/complete`,
      data
    );
    return res.data;
  },

  cancelAppointment: async (
    appointmentId: string,
    data: import('../types/doctor.types').CancelAppointmentRequest
  ) => {
    const res = await axiosInstance.patch<{ success: boolean; message: string; data: import('../types/doctor.types').Appointment }>(
      `/doctor/appointments/${appointmentId}/cancel`,
      data
    );
    return res.data;
  },

  // ── Primary Doctor (Patient Side) ───────────
  getPatientPrimaryDoctor: async () => {
    const res = await axiosInstance.get<{ success: boolean; data: import('../types/doctor.types').PatientPrimaryDoctorStatus }>(
      '/auth/primary-doctor'
    );
    return res.data;
  },

  requestPrimaryDoctor: async (doctorId: string) => {
    const res = await axiosInstance.post<{ success: boolean; message: string; data: import('../types/doctor.types').PrimaryDoctorRelationship }>(
      '/auth/primary-doctor/request',
      { doctorId }
    );
    return res.data;
  },

  cancelPrimaryDoctorRequest: async () => {
    const res = await axiosInstance.post<{ success: boolean; message: string }>(
      '/auth/primary-doctor/cancel'
    );
    return res.data;
  },

  removePrimaryDoctor: async () => {
    const res = await axiosInstance.post<{ success: boolean; message: string }>(
      '/auth/primary-doctor/remove'
    );
    return res.data;
  },

  // ── Primary Doctor (Doctor Side) ───────────
  getDoctorPrimaryRequests: async () => {
    const res = await axiosInstance.get<{ success: boolean; data: import('../types/doctor.types').PrimaryDoctorRelationship[] }>(
      '/doctor/primary-requests'
    );
    return res.data;
  },

  respondToPrimaryRequest: async (
    requestId: string,
    data: import('../types/doctor.types').RespondPrimaryDoctorRequest
  ) => {
    const res = await axiosInstance.post<{ success: boolean; message: string; data: import('../types/doctor.types').PrimaryDoctorRelationship }>(
      `/doctor/primary-requests/${requestId}/respond`,
      data
    );
    return res.data;
  },

  // ── Reporting ──────────────────────────────
  submitDoctorReport: async (data: import('../types/doctor.types').SubmitDoctorReportRequest) => {
    const res = await axiosInstance.post<{ success: boolean; message: string; data: import('../types/doctor.types').DoctorReport }>(
      '/doctor/reports',
      data
    );
    return res.data;
  },
};