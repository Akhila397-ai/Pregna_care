import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  doctorApplyThunk,
  getMyStatusThunk,
  getMyDashboardThunk,
  clearDoctorState,
  clearDoctorError,
} from '../store/doctor.slice';
import { DoctorApplyFormData } from '../types/doctor.types';

export const useDoctor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { application, dashboard, status, name, loading, error } = useAppSelector(
    (state) => state.doctor
  );

  const { user, token } = useAppSelector((state) => state.auth);

  // Apply as Doctor
  const apply = useCallback(
    async (data: DoctorApplyFormData) => {
      const result = await dispatch(doctorApplyThunk(data));

      if (doctorApplyThunk.fulfilled.match(result)) {
        navigate('/doctor/pending', { replace: true });
      }
    },
    [dispatch, navigate]
  );

  // Check Application Status
  const checkStatusAndRedirect = useCallback(async () => {
    if (!token) return;
    if (user?.role === 'admin') {
      console.warn(`[useDoctor] checkStatusRedirect blocked - user is admin`);
      return;
    }
    const result = await dispatch(getMyStatusThunk());

    if (!getMyStatusThunk.fulfilled.match(result)) return;

    const { status: appStatus } = result.payload;

    switch (appStatus) {
      case 'approved':
        navigate('/doctor/dashboard', { replace: true });
        break;

      case 'rejected':
        navigate('/doctor/rejected');
        break;

      case 'pending':
      default:
        navigate('/doctor/pending');
        break;
    }
  }, [dispatch, navigate, token, user?.role]);

  // Doctor Dashboard
  const fetchDashboard = useCallback(async () => {
    if (!user || user.role === 'admin') return;
    await dispatch(getMyDashboardThunk());
  }, [dispatch, user?.role, Boolean(user)]);

  // Fetch Status
  const fetchStatus = useCallback(async () => {
    if (!user || user.role === 'admin') return;
    await dispatch(getMyStatusThunk());
  }, [dispatch, user?.role, Boolean(user)]);

  // Logout
  const logout = useCallback(() => {
    sessionStorage.removeItem('accessToken');
    dispatch(clearDoctorState());
    navigate('/doctor/login', { replace: true });
  }, [dispatch, navigate]);

  const clearError = useCallback(() => {
    dispatch(clearDoctorError());
  }, [dispatch]);

  return {
    application,
    dashboard,
    status,
    name,
    user,
    loading,
    error,

    apply,
    checkStatusAndRedirect,
    fetchDashboard,
    fetchStatus,
    logout,
    clearError,
  };
};