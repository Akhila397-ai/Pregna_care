import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage       from '../features/auth/pages/RegisterPage';
import LoginPage          from '../features/auth/pages/LoginPage';
import OTPPage            from '../features/auth/pages/OTPPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPassword';
import ResetPasswordPage from '../features/auth/pages/ResetPassword';
import OnboardingSelectionPage from '../features/onboarding/pages/OnboardingSelectionPage';
import { useAppSelector } from '../store/hooks';
import DoctorLoginPage from '../features/doctor/pages/DoctorLoginPage';
//Admin
import AdminLoginPage from '../features/admin/pages/AdminLogin';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import UserManagementPage from '../features/admin/pages/UserManagementPage';
import ApplyAsDoctorPage from '../features/doctor/pages/ApplyAsDoctorPage';
import DoctorPendingPage from '../features/doctor/pages/DoctorPendingPage';
import DoctorRejectedPage from '../features/doctor/pages/DoctorRejectedPage';
import DoctorDashboardPage from '../features/doctor/pages/DoctorDashboard';
import DoctorManagementPage from '../features/admin/pages/DoctorManagementPage';
 const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RequireRole = ({
  children,
  roles,
  fallback = '/login',
}: {
  children: React.ReactNode;
  roles:    string[];
  fallback?: string;
}) => {
  const user  = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  if (!token || !user) return <Navigate to="/login" replace />;

  if (!roles.includes(user.role)) {
    // redirect to appropriate page based on actual role
    if (user.role === 'admin')  return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor/pending" replace />;
    if (user.role === 'user')   return <Navigate to="/onboarding" replace />;
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};



const AppRoutes = () => (
  <Routes>
    <Route path="/"                element={<Navigate to="/login" />} />
    <Route path="/register"        element={<RegisterPage />} />
    <Route path="/login"           element={<LoginPage />} />
    <Route path="/verify-otp"      element={<OTPPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password"  element={<ResetPasswordPage />} />

    {/* Admin*/}
    <Route path='/admin/login'  element={
      <RequireRole roles={['admin']}>
           <AdminLoginPage/>
      </RequireRole>
      
      } />
    <Route path='/admin/dashboard'  element={
      <RequireRole roles={['admin']}>
          <AdminDashboardPage/>
      </RequireRole>
      
      }/>
    <Route path='/admin/users' element={
      <RequireRole roles={['admin']}>
<UserManagementPage/>
      </RequireRole>
    }
      />
    <Route path='/admin/doctors'element={
      <RequireRole roles={['admin']}>
<DoctorManagementPage/>
      </RequireRole>
      
      }/>

    <Route path='/onboarding' element={
      <RequireRole roles={['user']}>
 <OnboardingSelectionPage/>
      </RequireRole>
     
      }/>

    {/* Doctor*/}

    <Route path='/doctor/login' element= {
      <RequireRole roles={['doctor']}>
      <DoctorLoginPage/>
      </RequireRole>
      }/>

    <Route path='/doctor/apply' element={
      <RequireRole roles={['user']}>
 <ApplyAsDoctorPage/>
      </RequireRole>
     
      }/>
    <Route path='/doctor/pending' element={
      <RequireRole roles={['doctor']}>
 <DoctorPendingPage/>
      </RequireRole>
     
      }/>
    <Route path='/doctor/rejected' element={
      <RequireRole roles={['doctor']}>
  <DoctorRejectedPage/>
      </RequireRole>
    
      }/>
    <Route path='/doctor/dashboard' element= {
    <RequireRole roles={['doctor']}>
       <DoctorDashboardPage/>
    </RequireRole>
   
  }
    />

  </Routes>
);

export default AppRoutes;