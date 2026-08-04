import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../store/hooks';

import {
  doctorApplyThunk,
  getMyStatusThunk,
  getMyDashboardThunk,
  clearDoctorState,
  clearDoctorError,
} from '../store/doctor.slice';

import { DoctorApplyFormData, DoctorApplyRequest } from '../types/doctor.types';

export const useDoctor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    application,
    dashboard,
    status,
    name,
    loading,
    error,
  } = useAppSelector((state) => state.doctor);

  const { user,token } = useAppSelector((state) => state.auth);

  // Apply as Doctor
  const apply = async (data: DoctorApplyFormData) => {
    const result = await dispatch(doctorApplyThunk(data));

    if (doctorApplyThunk.fulfilled.match(result)) {
      navigate('/doctor/pending', { replace: true});
    }
  };

  // Check Application Status
  const checkStatusAndRedirect = async () => {

    if(!token) return;
    if(user?.role === 'admin'){
      console.warn(`[useDoctor] checkStatusRedirect blocked - user is admin`);
      return;
    }
    const result = await dispatch(getMyStatusThunk());

    if (!getMyStatusThunk.fulfilled.match(result)) return;

    const { status } = result.payload;

    switch (status) {
      case 'approved':
        alert('Your application has been approved. Please login again.');
        dispatch(clearDoctorState());
        navigate('/doctor/login');
        break;

      case 'rejected':
        navigate('/doctor/rejected');
        break;

      case 'pending':
      default:
        navigate('/doctor/pending');
        break;
    }
  };

  // Doctor Dashboard
  const fetchDashboard = async () => {
     if (!user || user.role === 'admin') return;
    await dispatch(getMyDashboardThunk());
  };

  // Fetch Status
  const fetchStatus = async () => {
    if (!user || user.role === 'admin') return;
    await dispatch(getMyStatusThunk());
  };

  // Logout
 const logout = () => {
    sessionStorage.removeItem("accessToken");

    dispatch(clearDoctorState());

    navigate("/doctor/login", {replace: true});
};
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

    clearError: () => dispatch(clearDoctorError()),
  };
};