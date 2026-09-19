import axiosInstance from '@/shared/api/axiosInstance';
import {
  DoctorApplyFormData,
  DoctorApplyResponse,
  DoctorStatusResponse,
  DoctorDashboardResponse,
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
};