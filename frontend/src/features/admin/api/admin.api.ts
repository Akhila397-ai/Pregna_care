import axiosInstance from "../../../api/axiosInstance";
import { AdminAuthResponse, AdminLoginRequest,AdminLoginResponse,GetMappedDoctorsResponse,getMappedUsersResponse } from "../types/admin.types";

export const adminApi = {
   login: async (data: AdminLoginRequest): Promise<AdminAuthResponse> => {
    const res = await axiosInstance.post<AdminAuthResponse>(
        '/auth/login',
        data
    );
    return res.data;
},

    getAllUsers: async(
        page: number,
        limit: number
    ): Promise<getMappedUsersResponse> => {
        const res = await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}`)
        return res.data
    },
    blockUser: async(userId: string): Promise<{ message: String}> =>  {
        const res = await axiosInstance.patch(`/admin/users/${userId}/unblock`)
        return res.data
    },

    unblockUser: async(userId: string): Promise<{message: string}> => {
        const res = await axiosInstance.patch(`/admin/users/${userId}/unblock`);
        return res.data
    },

    deleteUser: async(userId: string): Promise<{message: string}> => {
        const  res = await axiosInstance.delete(`/admin/users/${userId}`)
        return res.data
    },

    getAllDoctors: async (
    page  = 1,
    limit = 10
  ): Promise<GetMappedDoctorsResponse> => {
    const res = await axiosInstance.get(
      `/admin/doctors?page=${page}&limit=${limit}`
    );
    return res.data;
  },

  approveDoctor: async (doctorId: string): Promise<{ message: string }> => {
    const res = await axiosInstance.patch(`/admin/doctors/${doctorId}/approve`);
    return res.data;
  },

  rejectDoctor: async (doctorId: string): Promise<{ message: string }> => {
    const res = await axiosInstance.patch(`/admin/doctors/${doctorId}/reject`);
    return res.data;
  },

   blockDoctor: async (doctorId: string): Promise<{ message: string }> => {
    const res = await axiosInstance.patch(`/admin/doctors/${doctorId}/block`);
    return res.data;
  },

  unblockDoctor: async (doctorId: string): Promise<{ message: string }> => {
    const res = await axiosInstance.patch(`/admin/doctors/${doctorId}/unblock`);
    return res.data;
  },

   deleteDoctor: async (doctorId: string): Promise<{ message: string }> => {
    const res = await axiosInstance.delete(`/admin/doctors/${doctorId}`);
    return res.data;
  },


}