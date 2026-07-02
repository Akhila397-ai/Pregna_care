import axiosInstance  from '../../../api/axiosInstance'
import { DoctorApplyRequest,DoctorApplyResponse,DoctorApplicationResponse,DoctorProfileResponse,DoctorStatusResponse, DoctorDashboardResponse  } from '../types/doctor.types'

export const doctorApi = {

    //apply
    apply: async (
        data: DoctorApplyRequest
    ): Promise<DoctorApplyResponse> => {
        const res = await axiosInstance.post('/doctor/apply',data);
        return res.data;
    },

    getMyStatus: async (): Promise<DoctorStatusResponse> => {
        const res = await axiosInstance.get('/doctor/my-status')
        return res.data;
    },


    getMyDashboard: async (): Promise<DoctorDashboardResponse> => {
    const res = await axiosInstance.get('/doctor/my-dashboard');
    return res.data;
  },
}