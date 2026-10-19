import React, { useState } from 'react';
import { z } from 'zod';
import { DoctorReportReason, Appointment } from '@/features/doctor/types/doctor.types';
import { doctorApi } from '@/features/doctor/api/doctor.api';

interface ReportIssueModalProps {
  doctorId: string;
  doctorName: string;
  appointment?: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

const reportSchema = z.object({
  reason: z.enum(
    [
      'unprofessional_behavior',
      'missed_appointment',
      'incorrect_prescription',
      'billing_issue',
      'other',
    ],
    {
      message: 'Please select a reason for reporting.',
    }
  ),
  description: z
    .string()
    .min(5, 'Please provide at least 5 characters describing the issue.')
    .max(2000, 'Description cannot exceed 2000 characters.'),
});

const REASONS: { value: DoctorReportReason; label: string }[] = [
  { value: 'unprofessional_behavior', label: 'Unprofessional Behavior' },
  { value: 'missed_appointment', label: 'Doctor Missed or Extremely Late for Appointment' },
  { value: 'incorrect_prescription', label: 'Prescription or Clinical Concern' },
  { value: 'billing_issue', label: 'Billing or Consultation Fee Issue' },
  { value: 'other', label: 'Other Issue' },
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  doctorId,
  doctorName,
  appointment,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<DoctorReportReason>('unprofessional_behavior');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validation = reportSchema.safeParse({
      reason,
      description: description.trim(),
    });

    if (!validation.success) {
      const errs: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errs[field]) errs[field] = issue.message;
      });
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await doctorApi.submitDoctorReport({
        doctorId,
        appointmentId: appointment?.id,
        reason,
        description: description.trim(),
      });

      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'Unable to submit report.');
      }
    } catch (err: unknown) {
      console.error('Submit report error:', err);
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.message ||
        'Unable to submit report. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border-primary)] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center text-xl">
              🚨
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--text-primary)]">
                Report an Issue
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Concerning {doctorName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] flex items-center justify-center text-sm font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Your report will be forwarded confidentially to the PregnaCare clinical administration team. We take patient safety and professional standards very seriously.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Reason for Report *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as DoctorReportReason)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition cursor-pointer"
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about what occurred..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition placeholder:text-[var(--text-muted)]"
            />
            {fieldErrors.description && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
