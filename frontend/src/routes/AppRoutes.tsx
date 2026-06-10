import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage       from '../features/auth/pages/RegisterPage';
import LoginPage          from '../features/auth/pages/LoginPage';
import OTPPage            from '../features/auth/pages/OTPPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPassword';
import ResetPasswordPage from '../features/auth/pages/ResetPassword';

const AppRoutes = () => (
  <Routes>
    <Route path="/"                element={<Navigate to="/login" />} />
    <Route path="/register"        element={<RegisterPage />} />
    <Route path="/login"           element={<LoginPage />} />
    <Route path="/verify-otp"      element={<OTPPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password"  element={<ResetPasswordPage />} />
  </Routes>
);

export default AppRoutes;