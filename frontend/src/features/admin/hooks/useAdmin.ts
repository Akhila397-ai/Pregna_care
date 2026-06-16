import { useNavigate }    from 'react-router-dom';
import { useAppDispatch,
         useAppSelector } from '../../../store/hooks';
import {
  adminLoginThunk,
  adminLogout,
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
} from '../../../store/slices/admin.slice';

export const useAdmin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    admin, token, loading, error,
    users, totalUsers, totalPages,
    doctors, totalDoctors, doctorPages,
  } = useAppSelector((state) => state.admin);

  // ── Auth ──────────────────────────────────────
  const login = async (email: string, password: string) => {
    const result = await dispatch(adminLoginThunk({ email, password }));
    if (adminLoginThunk.fulfilled.match(result)) {
      navigate('/admin/dashboard');
    }
  };

  const logout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

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

  const approveDoctor = (doctorId: string) => {
    dispatch(approveDoctorThunk(doctorId));
  };

  const rejectDoctor = (doctorId: string) => {
    dispatch(rejectDoctorThunk(doctorId));
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
    // state
    admin, token, loading, error,
    users, totalUsers, totalPages,
    doctors, totalDoctors, doctorPages,
    // auth
    login, logout,
    // users
    getUsers, blockUser, unblockUser, deleteUser,
    // doctors
    getDoctors, approveDoctor, rejectDoctor,
    blockDoctor, unblockDoctor, deleteDoctor,
    clearError: () => dispatch(clearAdminError()),
  };
};