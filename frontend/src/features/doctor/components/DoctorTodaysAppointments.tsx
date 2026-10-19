import React, { useState } from 'react';
import { Appointment } from '../types/doctor.types';

interface DoctorTodaysAppointmentsProps {
  appointments: Appointment[];
  loading?: boolean;
  onOpenCompleteModal: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
  onViewAll: () => void;
}

export const DoctorTodaysAppointments: React.FC<DoctorTodaysAppointmentsProps> = ({
  appointments,
  loading,
  onOpenCompleteModal,
  onCancelAppointment,
  onViewAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const filteredList = appointments.filter((apt) => {
    if (filter === 'scheduled') return apt.status === 'scheduled';
    if (filter === 'completed') return apt.status === 'completed';
    return true;
  });

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-primary)] p-6 sm:p-7 shadow-2xs space-y-5">
      {/* Header with Title, Tabs & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-primary)]/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xl shadow-2xs">
            📅
          </div>
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
              Today's Appointments
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Scheduled consultations and patient visits for today
            </p>
          </div>
        </div>

        {/* Action / Filter Bar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)] text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('scheduled')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'scheduled'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Scheduled ({appointments.filter((a) => a.status === 'scheduled').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Completed ({appointments.filter((a) => a.status === 'completed').length})
            </button>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 cursor-pointer shrink-0"
          >
            View All →
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-between"
            >
              <div className="space-y-2 w-1/2">
                <div className="h-4 bg-[var(--bg-muted)] rounded w-1/3" />
                <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
              </div>
              <div className="h-8 bg-[var(--bg-muted)] rounded-xl w-24" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredList.length === 0 && (
        <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-primary)] text-center space-y-2">
          <span className="text-3xl block">🩺</span>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No consultations found for today
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            {filter === 'all'
              ? 'You do not have any patient appointments booked for today. You can check upcoming appointments below.'
              : `No appointments currently marked as ${filter}.`}
          </p>
        </div>
      )}

      {/* Appointments List */}
      {!loading && filteredList.length > 0 && (
        <div className="space-y-3.5">
          {filteredList.map((apt) => {
            const hasPregnancy = apt.patientPregnancyWeek !== undefined;

            return (
              <div
                key={apt.id}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                {/* Left: Time & Patient Details */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Time Badge */}
                  <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center shrink-0 min-w-20">
                    <span className="text-xs font-black text-emerald-800 dark:text-emerald-200 block">
                      {apt.timeSlot}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Slot
                    </span>
                  </div>

                  {/* Patient Info & Clinical Context */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-[var(--text-primary)] truncate">
                        {apt.patientName || 'Patient'}
                      </h4>

                      {/* Status Badge */}
                      {apt.status === 'scheduled' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300">
                          ● Scheduled
                        </span>
                      )}
                      {apt.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold border border-blue-300">
                          ✓ Completed
                        </span>
                      )}
                      {apt.status === 'cancelled' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold border border-rose-300">
                          ✕ Cancelled
                        </span>
                      )}
                    </div>

                    {/* Patient Clinical Context */}
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1 flex-wrap">
                      {hasPregnancy ? (
                        <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/50">
                          🤰 Week {apt.patientPregnancyWeek} (Trimester {apt.patientTrimester})
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">
                          {apt.patientOnboardingType === 'trying' ? '🌱 Cycle Planning' : 'General Consultation'}
                        </span>
                      )}

                      {apt.reason && (
                        <span className="truncate max-w-xs text-[var(--text-muted)]">
                          • Reason: {apt.reason}
                        </span>
                      )}
                    </div>

                    {/* Completed Consultation Notes Summary */}
                    {apt.status === 'completed' && (apt.consultationNotes || apt.prescription) && (
                      <div className="mt-2 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-primary)] space-y-1">
                        {apt.consultationNotes && (
                          <p><strong className="text-[var(--text-primary)]">Notes:</strong> {apt.consultationNotes}</p>
                        )}
                        {apt.prescription && (
                          <p><strong className="text-emerald-600 dark:text-emerald-400">Prescription:</strong> {apt.prescription}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {apt.status === 'scheduled' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onOpenCompleteModal(apt)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>📝</span>
                        <span>Complete</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelAppointment(apt)}
                        className="px-3 py-2 rounded-xl border border-[var(--border-primary)] hover:bg-rose-50 hover:text-rose-600 text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
                        title="Cancel Appointment"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {apt.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => onOpenCompleteModal(apt)}
                      className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
                    >
                      Edit Notes
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
