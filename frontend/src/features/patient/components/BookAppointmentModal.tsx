import React, { useState } from 'react';
import { z } from 'zod';
import { VerifiedDoctor, Appointment } from '@/features/doctor/types/doctor.types';
import { doctorApi } from '@/features/doctor/api/doctor.api';

interface BookAppointmentModalProps {
  doctor: VerifiedDoctor;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
}

const bookSchema = z.object({
  appointmentDate: z.string().min(1, 'Please select an appointment date.'),
  timeSlot: z.string().min(1, 'Please select a time slot.'),
  reason: z.string().max(500, 'Reason cannot exceed 500 characters.').optional(),
});

const DEFAULT_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
];

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  doctor,
  onClose,
  onSuccess,
}) => {
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Get today's date formatted as YYYY-MM-DD for min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validation = bookSchema.safeParse({
      appointmentDate,
      timeSlot,
      reason: reason.trim() || undefined,
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
      const response = await doctorApi.bookAppointment({
        doctorId: doctor.userId || doctor.id,
        appointmentDate,
        timeSlot,
        reason: reason.trim() || undefined,
      });

      if (response.success && response.data) {
        onSuccess(response.data);
      } else {
        setError(response.message || 'Unable to book appointment. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Book appointment error:', err);
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.message ||
        'This slot might already be booked or unavailable. Please choose another time.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border-primary)] pb-4">
          <div className="flex items-center gap-3">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.fullName || doctor.name}
                className="w-12 h-12 rounded-2xl object-cover border border-[var(--border-primary)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black text-lg flex items-center justify-center border border-[var(--border-primary)]">
                {(doctor.fullName || doctor.name || 'D').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-black text-[var(--text-primary)]">
                Book Appointment
              </h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                {doctor.fullName || doctor.name} • {doctor.specialization}
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

        {/* Doctor Quick Details */}
        <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-between text-xs">
          <div>
            <span className="text-[var(--text-muted)]">Clinic: </span>
            <span className="font-semibold text-[var(--text-primary)]">
              {doctor.clinicName || 'Main Clinic'}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Fee: </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              ${doctor.consultationFee}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Select Consultation Date *
            </label>
            <input
              type="date"
              min={todayStr}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
            />
            {fieldErrors.appointmentDate && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.appointmentDate}</p>
            )}
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Select Time Slot *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEFAULT_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition border cursor-pointer ${
                    timeSlot === slot
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-emerald-400'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {fieldErrors.timeSlot && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.timeSlot}</p>
            )}
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
              Reason for Visit (Optional)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Regular prenatal checkup, first trimester scan consultation, nausea advice..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition placeholder:text-[var(--text-muted)]"
            />
            {fieldErrors.reason && (
              <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.reason}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Booking...</span>
              ) : (
                <>
                  <span>✓</span>
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
