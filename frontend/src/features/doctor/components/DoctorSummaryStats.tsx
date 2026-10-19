import React from 'react';

interface DoctorSummaryStatsProps {
  todayAppointmentsCount: number;
  totalPatientsCount: number;
  pendingConsultationsCount: number;
  primaryRequestsCount: number;
  loading?: boolean;
}

export const DoctorSummaryStats: React.FC<DoctorSummaryStatsProps> = ({
  todayAppointmentsCount,
  totalPatientsCount,
  pendingConsultationsCount,
  primaryRequestsCount,
  loading,
}) => {
  const stats = [
    {
      id: 'today',
      label: "Today's Appointments",
      value: todayAppointmentsCount,
      subText: todayAppointmentsCount > 0 ? 'Consultations scheduled today' : 'No consultations today',
      icon: '📅',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'patients',
      label: 'Total Patients',
      value: totalPatientsCount,
      subText: 'Under your clinical care',
      icon: '👥',
      iconBg: 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300',
      badgeColor: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
    },
    {
      id: 'pending',
      label: 'Pending Consultations',
      value: pendingConsultationsCount,
      subText: 'Scheduled upcoming visits',
      icon: '⏳',
      iconBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    },
    {
      id: 'requests',
      label: 'Primary Doctor Requests',
      value: primaryRequestsCount,
      subText: primaryRequestsCount > 0 ? 'Patients requesting your care' : 'All requests responded',
      icon: '👩‍⚕️',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300',
      badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] animate-pulse space-y-3 shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-muted)]" />
            <div className="h-6 bg-[var(--bg-muted)] rounded w-1/3" />
            <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((item) => (
        <div
          key={item.id}
          className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-2xs ${item.iconBg}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
              Active
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-[var(--text-secondary)] block">
              {item.label}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight mt-0.5">
              {item.value}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1 truncate">
              {item.subText}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
