import { useEffect } from 'react';
import { useDoctor } from '../hooks/useDoctor';
import { useAppSelector } from '@/app/store/hooks';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

const DoctorPendingPage = () => {
  const {
    application,
    loading,
    checkStatusAndRedirect,
    logout,
  } = useDoctor();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);

  // ← on every load, check if status changed
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (user?.role === 'doctor') {
      navigate('/doctor/dashboard', { replace: true });
      return;
    }
    checkStatusAndRedirect();
  }, [user]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center font-sans px-6 transition-colors duration-200 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-primary)] p-10 max-w-md w-full text-center">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : (
          <>
            {/* Pending Icon */}
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/40 border-4 border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">
              Application Under Review
            </h1>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              Our admin team is reviewing your application.
              This page auto-checks your status on refresh.
            </p>

            {/* Application Summary */}
            {application && (
              <div className="bg-[var(--bg-muted)] rounded-xl p-4 text-left space-y-2 mb-6 border border-[var(--border-primary)]">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)] font-medium">Name</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {application.fullName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)] font-medium">Specialization</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {application.specialization}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)] font-medium">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                    ⏳ Pending Review
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)] font-medium">Submitted</span>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : '—'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl px-4 py-3 text-left">
                <span className="text-lg">📧</span>
                <p className="text-xs text-[var(--text-secondary)]">
                  You'll be notified by email once reviewed.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl px-4 py-3 text-left">
                <span className="text-lg">🔄</span>
                <p className="text-xs text-[var(--text-secondary)]">
                  Refresh this page to check your latest status.
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-3 rounded-xl border border-[var(--border-primary)]
                text-[var(--text-secondary)] font-semibold text-sm hover:border-rose-300
                hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorPendingPage;