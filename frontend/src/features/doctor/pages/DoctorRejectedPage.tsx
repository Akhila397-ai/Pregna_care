import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDoctor } from '../hooks/useDoctor';
import { useAppSelector } from '@/app/store/hooks';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

const DoctorRejectedPage = () => {
  const { application, fetchStatus, logout } = useDoctor();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center font-sans px-6 transition-colors duration-200 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-primary)] p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 border-4 border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">
          Application Not Approved
        </h1>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
          Unfortunately, your doctor application was not approved at this time.
          Please review the feedback below and consider reapplying.
        </p>

        {/* Rejection Reason */}
        {application?.verificationRemarks && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 rounded-xl p-4 text-left mb-6">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
              Reason for Rejection:
            </p>
            <p className="text-sm text-rose-700 dark:text-rose-300">
              {application.verificationRemarks}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 bg-[var(--bg-muted)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-left">
            <span className="text-lg">📝</span>
            <p className="text-xs text-[var(--text-secondary)]">
              Review the rejection reason and gather any missing documents.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--bg-muted)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-left">
            <span className="text-lg">🔄</span>
            <p className="text-xs text-[var(--text-secondary)]">
              You may reapply after addressing the concerns mentioned.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/apply-as-doctor"
            className="block w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700
              text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition"
          >
            Reapply as Doctor
          </Link>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl border border-[var(--border-primary)]
              text-[var(--text-secondary)] font-semibold text-sm hover:border-rose-300
              hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRejectedPage;