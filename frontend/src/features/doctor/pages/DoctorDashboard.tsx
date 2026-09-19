import { useEffect } from 'react';
import { useDoctor } from '../hooks/useDoctor';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

const DoctorDashboardPage = () => {
  const { dashboard, loading, logout, fetchDashboard } = useDoctor();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-[var(--bg-surface)] border-b border-[var(--border-primary)] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-[var(--text-primary)] tracking-tight text-base block leading-tight">PregnaCare</span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">Doctor Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {dashboard && (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-primary)]">
              <img
                src={
                  dashboard.imageUrl ||
                  `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=10b981`
                }
                alt={dashboard.name}
                className="w-8 h-8 rounded-full object-cover border border-[var(--border-primary)]"
              />
              <span className="text-sm font-semibold text-[var(--text-primary)] hidden sm:inline">
                Dr. {dashboard.name}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Profile Card */}
        {dashboard && (
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] p-6 mb-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={
                  dashboard.imageUrl ||
                  `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=10b981`
                }
                alt={dashboard.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Dr. {dashboard.name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {dashboard.application.specialization}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {dashboard.application.clinicName}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-semibold">
                ✓ Approved Practitioner
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border-primary)]">
              {[
                {
                  label: 'Experience',
                  value: `${dashboard.application.experience} yrs`,
                },
                {
                  label: 'Consultation Fee',
                  value: `$${dashboard.application.consultationFee}`,
                },
                {
                  label: 'Available Days',
                  value: dashboard.application.availability.days
                    .slice(0, 3)
                    .map((d) => d.slice(0, 3))
                    .join(', '),
                },
                {
                  label: 'Consulting Hours',
                  value: `${dashboard.application.availability.startTime} - ${dashboard.application.availability.endTime}`,
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs text-[var(--text-muted)] font-medium mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              icon: '👥',
              label: 'Patients',
              desc: 'View and manage your patient records',
            },
            {
              icon: '📅',
              label: 'Appointments',
              desc: 'Manage upcoming consultations',
            },
            {
              icon: '📋',
              label: 'Medical Records',
              desc: 'Review maternal charts & history',
            },
            {
              icon: '💊',
              label: 'Prescriptions',
              desc: 'Issue and verify prescriptions',
            },
            {
              icon: '🗓️',
              label: 'Availability',
              desc: 'Manage weekly clinic schedule',
            },
            {
              icon: '📊',
              label: 'Reports & Analytics',
              desc: 'View maternal health analytics',
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-primary)] hover:border-emerald-500 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mt-3 mb-1 group-hover:text-emerald-500 transition">
                {card.label}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;