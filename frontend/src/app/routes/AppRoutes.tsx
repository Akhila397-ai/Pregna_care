import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import OTPPage from '@/features/auth/pages/OTPPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPassword';
import ResetPasswordPage from '@/features/auth/pages/ResetPassword';
import OnboardingSelectionPage from '@/features/onboarding/pages/OnboardingSelectionPage';
import { useAppSelector } from '@/app/store/hooks';
import DoctorLoginPage from '@/features/doctor/pages/DoctorLoginPage';
// Admin
import AdminLoginPage from '@/features/admin/pages/AdminLogin';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import UserManagementPage from '@/features/admin/pages/UserManagementPage';
import ApplyAsDoctorPage from '@/features/doctor/pages/ApplyAsDoctorPage';
import DoctorPendingPage from '@/features/doctor/pages/DoctorPendingPage';
import DoctorRejectedPage from '@/features/doctor/pages/DoctorRejectedPage';
import DoctorDashboardPage from '@/features/doctor/pages/DoctorDashboard';
import DoctorManagementPage from '@/features/admin/pages/DoctorManagementPage';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { token, user, initialized } = useAppSelector((s) => s.auth);
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-200">
        <svg
          className="animate-spin w-8 h-8 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }
  if (!token || !user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RequireRole = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: string[];
  fallback?: string;
}) => {
  const { user, token, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-200">
        <svg
          className="animate-spin w-8 h-8 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Public & Auth */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-otp" element={<OTPPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/doctor/login" element={<DoctorLoginPage />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />

    {/* Admin Routes */}
    <Route
      path="/admin/dashboard"
      element={
        <RequireRole roles={['admin']}>
          <AdminDashboardPage />
        </RequireRole>
      }
    />
    <Route
      path="/admin/users"
      element={
        <RequireRole roles={['admin']}>
          <UserManagementPage />
        </RequireRole>
      }
    />
    <Route
      path="/admin/doctors"
      element={
        <RequireRole roles={['admin']}>
          <DoctorManagementPage />
        </RequireRole>
      }
    />

    {/* Onboarding */}
    <Route
      path="/onboarding"
      element={
        <RequireRole roles={['user']}>
          <OnboardingSelectionPage />
        </RequireRole>
      }
    />

    {/* Doctor Routes */}
    <Route
      path="/doctor/apply"
      element={
        <RequireRole roles={['user']}>
          <ApplyAsDoctorPage />
        </RequireRole>
      }
    />
    <Route
      path="/doctor/pending"
      element={
        <RequireAuth>
          <DoctorPendingPage />
        </RequireAuth>
      }
    />
    <Route
      path="/doctor/rejected"
      element={
        <RequireAuth>
          <DoctorRejectedPage />
        </RequireAuth>
      }
    />
    <Route
      path="/doctor/dashboard"
      element={
        <RequireRole roles={['doctor']}>
          <DoctorDashboardPage />
        </RequireRole>
      }
    />
  </Routes>
);

export default AppRoutes;
