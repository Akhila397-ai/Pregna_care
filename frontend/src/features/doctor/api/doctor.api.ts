import axiosInstance  from '../../../api/axiosInstance'
import { DoctorApplyRequest,DoctorApplyResponse,DoctorApplicationResponse,DoctorProfileResponse } from '../types/doctor.types'

export const doctorApi = {

    //apply
    apply: async (
        data: DoctorApplyRequest
    ): Promise<DoctorApplyResponse> => {
        const res = await axiosInstance.post('/doctor/apply',data);
        return res.data;
    },

    getMyApplication: async (): Promise<DoctorApplicationResponse> => {
        const res = await axiosInstance.get('/doctor/my-application');
        return res.data
    },

    getMyProfile: async (): Promise<DoctorProfileResponse> => {
        const res = await axiosInstance.get('/doctor/my-profile');
        return res.data;
    }
}