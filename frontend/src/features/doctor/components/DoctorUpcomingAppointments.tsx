import React from 'react';
import { Appointment } from '../types/doctor.types';

interface DoctorUpcomingAppointmentsProps {
  appointments: Appointment[];
  loading?: boolean;
  onOpenCompleteModal: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
  onViewAll: () => void;
}

export const DoctorUpcomingAppointments: React.FC<DoctorUpcomingAppointmentsProps> = ({
  appointments,
  loading,
  onOpenCompleteModal,
  onCancelAppointment,
  onViewAll,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-primary)] p-6 sm:p-7 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-primary)]/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-300 flex items-center justify-center text-xl shadow-2xs">
            🗓️
          </div>
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
              Upcoming Appointments
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Scheduled consultations for upcoming days
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-between"
            >
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-[var(--bg-muted)] rounded w-1/3" />
                <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
              </div>
              <div className="h-8 bg-[var(--bg-muted)] rounded-xl w-20" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && appointments.length === 0 && (
        <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-primary)] text-center space-y-2">
          <span className="text-3xl block">📋</span>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No upcoming consultations
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            When patients schedule future appointments with you, they will be listed here automatically.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && appointments.length > 0 && (
        <div className="space-y-3">
          {appointments.slice(0, 5).map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                {/* Date Pill */}
                <div className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] text-center shrink-0 min-w-24">
                  <span className="text-xs font-black text-[var(--text-primary)] block">
                    {formatDate(apt.appointmentDate)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                    {apt.timeSlot}
                  </span>
                </div>

                {/* Patient details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-black text-[var(--text-primary)] truncate">
                      {apt.patientName || 'Patient'}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300">
                      Confirmed
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
                    {apt.patientPregnancyWeek !== undefined ? (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Week {apt.patientPregnancyWeek} •{' '}
                      </span>
                    ) : null}
                    {apt.reason ? `Reason: ${apt.reason}` : 'General Consultation'}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onOpenCompleteModal(apt)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                >
                  Consult
                </button>
                <button
                  type="button"
                  onClick={() => onCancelAppointment(apt)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] hover:bg-rose-50 hover:text-rose-600 text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
