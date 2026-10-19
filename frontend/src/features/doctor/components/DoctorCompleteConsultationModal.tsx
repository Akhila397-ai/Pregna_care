import React, { useState } from 'react';
import { Appointment } from '../types/doctor.types';

interface DoctorCompleteConsultationModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSubmit: (appointmentId: string, consultationNotes: string, prescription: string) => Promise<void>;
}

export const DoctorCompleteConsultationModal: React.FC<DoctorCompleteConsultationModalProps> = ({
  appointment,
  onClose,
  onSubmit,
}) => {
  const [consultationNotes, setConsultationNotes] = useState<string>(
    appointment.consultationNotes || ''
  );
  const [prescription, setPrescription] = useState<string>(
    appointment.prescription || ''
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(appointment.id, consultationNotes, prescription);
      onClose();
    } catch (err: unknown) {
      console.error('Failed to complete consultation:', err);
      setError('Unable to save consultation record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border-primary)] pb-3">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">
              Complete Consultation Record
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Patient: <strong>{appointment.patientName || 'Patient'}</strong> • Slot: {appointment.timeSlot}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-[var(--bg-surface)] transition"
          >
            ✕
          </button>
        </div>

        {/* Patient Pregnancy Context Banner if available */}
        {appointment.patientPregnancyWeek !== undefined && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
            <span>🤰</span>
            <span>Pregnancy Context: Week {appointment.patientPregnancyWeek} (Trimester {appointment.patientTrimester})</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950 text-xs text-rose-600 font-medium border border-rose-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Consultation Notes / Clinical Observations
            </label>
            <textarea
              rows={4}
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              placeholder="Enter diagnosis, clinical notes, patient reassurance, or examination findings..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder:text-[var(--text-muted)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Prescriptions, Supplements & Follow-Up Advice
            </label>
            <textarea
              rows={4}
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="List prescribed medicines, dosage instructions (e.g. Iron, Folic Acid), scan schedules, or dietary advice..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder:text-[var(--text-muted)]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-primary)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>Saving Record...</span>
              ) : (
                <>
                  <span>✓</span>
                  <span>Mark Completed</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
