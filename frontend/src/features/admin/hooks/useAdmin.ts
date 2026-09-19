import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  getUsersThunk,
  blockUserThunk,
  unblockUserThunk,
  deleteUserThunk,
  getDoctorsThunk,
  approveDoctorThunk,
  rejectDoctorThunk,
  blockDoctorThunk,
  unblockDoctorThunk,
  deleteDoctorThunk,
  clearAdminError,
  verifyDoctorThunk,
  clearAdminData,
} from '@/app/store/slices/admin.slice';

export const useAdmin = () => {
  const dispatch = useAppDispatch();

  const {
    loading,
    error,
    users,
    totalUsers,
    totalPages,
    doctors,
    totalDoctors,
    doctorPages,
  } = useAppSelector((state) => state.admin);

  const { user } = useAppSelector((state) => state.auth);

  // ── User Management ───────────────────────────
  const getUsers = (page = 1, limit = 10) => {
    dispatch(getUsersThunk({ page, limit }));
  };

  const blockUser = (userId: string) => {
    dispatch(blockUserThunk(userId));
  };

  const unblockUser = (userId: string) => {
    dispatch(unblockUserThunk(userId));
  };

  const deleteUser = (userId: string) => {
    dispatch(deleteUserThunk(userId));
  };

  // ── Doctor Management ─────────────────────────
  const getDoctors = (page = 1, limit = 10) => {
    dispatch(getDoctorsThunk({ page, limit }));
  };

  const verifyDoctor = (
    doctorId: string,
    action: 'approve' | 'reject' | 'more_documents_required' | 'under_review',
    remarks?: string
  ) => {
    dispatch(verifyDoctorThunk({ doctorId, action, remarks }));
  };

  const approveDoctor = (doctorId: string) => {
    dispatch(approveDoctorThunk(doctorId));
  };

  const rejectDoctor = (doctorId: string, rejectionReason: string) => {
    dispatch(rejectDoctorThunk({ doctorId, rejectionReason }));
  };

  const blockDoctor = (doctorId: string) => {
    dispatch(blockDoctorThunk(doctorId));
  };

  const unblockDoctor = (doctorId: string) => {
    dispatch(unblockDoctorThunk(doctorId));
  };

  const deleteDoctor = (doctorId: string) => {
    dispatch(deleteDoctorThunk(doctorId));
  };

  return {
    admin: user,
    loading,
    error,
    users,
    totalUsers,
    totalPages,
    doctors,
    totalDoctors,
    doctorPages,

    getUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getDoctors,
    approveDoctor,
    rejectDoctor,
    blockDoctor,
    unblockDoctor,
    deleteDoctor,
    verifyDoctor,
    clearError: () => dispatch(clearAdminError()),
    clearData: () => dispatch(clearAdminData()),
  };
};