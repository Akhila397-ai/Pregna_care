import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/app/routes/AppRoutes';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearError, getMeThunk, refreshTokenThunk,logout } from './app/store/slices/auth.slice';
import { clearAdminData } from './app/store/slices/admin.slice';
import { clearDoctorState } from './features/doctor/store/doctor.slice';

const App = () => {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.auth);
  const hasFetched = useRef(false);

  useEffect(() => {
   if(hasFetched.current) return
   hasFetched.current = true;

   const initializeAuth = async () => {
    const storedToken = sessionStorage.getItem('accessToken')

    if(storedToken){
      const result = await dispatch(getMeThunk())

      if(getMeThunk.fulfilled.match(result)){
        return
      }
    }
    const refreshResult = await dispatch(refreshTokenThunk())

    if(refreshTokenThunk.rejected.match(refreshResult)){
      dispatch(clearError())
    }
   };

   void initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logout());
      dispatch(clearAdminData())
      dispatch(clearDoctorState())
    }
    window.addEventListener('auth:session-expired',handleSessionExpired)

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired)
    }
  },[dispatch])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center transition-colors duration-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 002 0v-6h6a1 1 0 000-2z" />
            </svg>
          </div>
          <svg className="animate-spin w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Loading PregnaCare...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;