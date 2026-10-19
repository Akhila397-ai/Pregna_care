import React, { useState } from 'react';
import { VerifiedDoctor } from '@/features/doctor/types/doctor.types';
import { doctorApi } from '@/features/doctor/api/doctor.api';

interface DoctorProfileModalProps {
  doctor: VerifiedDoctor;
  isCurrentPrimary?: boolean;
  isPendingPrimary?: boolean;
  onClose: () => void;
  onBookAppointment: (doctor: VerifiedDoctor) => void;
  onPrimaryDoctorRequested: () => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  isCurrentPrimary,
  isPendingPrimary,
  onClose,
  onBookAppointment,
  onPrimaryDoctorRequested,
}) => {
  const [showConfirmPrimary, setShowConfirmPrimary] = useState<boolean>(false);
  const [loadingPrimary, setLoadingPrimary] = useState<boolean>(false);
  const [errorPrimary, setErrorPrimary] = useState<string | null>(null);

  const handleRequestPrimary = async () => {
    setLoadingPrimary(true);
    setErrorPrimary(null);
    try {
      const response = await doctorApi.requestPrimaryDoctor(doctor.userId || doctor.id);
      if (response.success) {
        onPrimaryDoctorRequested();
        setShowConfirmPrimary(false);
      } else {
        setErrorPrimary(response.message || 'Unable to request primary doctor.');
      }
    } catch (err: unknown) {
      console.error('Request primary doctor error:', err);
      const msg =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.message ||
        'Unable to send primary doctor request. Please try again.';
      setErrorPrimary(msg);
    } finally {
      setLoadingPrimary(false);
    }
  };

  const formatAvailability = (availability?: VerifiedDoctor['availability']) => {
    if (!availability || !availability.days || availability.days.length === 0) {
      return 'Available by scheduled appointment';
    }
    const daysStr = availability.days.join(', ');
    const timeStr =
      availability.startTime && availability.endTime
        ? ` (${availability.startTime} – ${availability.endTime})`
        : '';
    return `${daysStr}${timeStr}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header with Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.fullName || doctor.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[var(--border-primary)] shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black text-2xl flex items-center justify-center border border-[var(--border-primary)]">
                {(doctor.fullName || doctor.name || 'D').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[var(--text-primary)]">
                  {doctor.fullName || doctor.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800">
                  ✓ Verified
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {doctor.specialization}
              </p>
              {doctor.qualification && (
                <p className="text-[11px] text-[var(--text-muted)]">
                  {doctor.qualification}
                </p>
              )}
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

        {/* Primary Doctor Status Badges */}
        {isCurrentPrimary && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <span>🌟</span>
            <span>This is your active <strong>Primary Doctor</strong> on PregnaCare.</span>
          </div>
        )}

        {isPendingPrimary && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2 font-medium">
            <span>⏳</span>
            <span>You have a pending Primary Doctor request sent to this doctor.</span>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[var(--text-muted)] tracking-wider">
              Experience
            </span>
            <p className="font-bold text-[var(--text-primary)]">
              {doctor.experience} Years
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[var(--text-muted)] tracking-wider">
              Consultation Fee
            </span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              ${doctor.consultationFee}
            </p>
          </div>

          <div className="col-span-2 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[var(--text-muted)] tracking-wider">
              Clinic & Address
            </span>
            <p className="font-bold text-[var(--text-primary)]">
              {doctor.clinicName || 'Clinic'}
            </p>
            {doctor.clinicAddress && (
              <p className="text-[11px] text-[var(--text-secondary)]">
                📍 {doctor.clinicAddress}
              </p>
            )}
          </div>

          <div className="col-span-2 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[var(--text-muted)] tracking-wider">
              Working Availability
            </span>
            <p className="text-[11px] text-[var(--text-secondary)]">
              🕒 {formatAvailability(doctor.availability)}
            </p>
          </div>
        </div>

        {/* Confirmation Modal Section if requesting Primary Doctor */}
        {showConfirmPrimary ? (
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-900/60 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
              <span>👩‍⚕️</span>
              <span>Confirm Primary Doctor Request</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Would you like to choose <strong>{doctor.fullName || doctor.name}</strong> as your primary doctor? They will receive your request and become your main healthcare provider on PregnaCare.
            </p>
            {errorPrimary && (
              <p className="text-xs text-rose-600 font-medium">⚠️ {errorPrimary}</p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmPrimary(false)}
                disabled={loadingPrimary}
                className="flex-1 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleRequestPrimary}
                disabled={loadingPrimary}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {loadingPrimary ? 'Sending Request...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        ) : (
          /* Primary Actions */
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onBookAppointment(doctor)}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📅</span>
              <span>Book Appointment</span>
            </button>

            {!isCurrentPrimary && !isPendingPrimary && (
              <button
                type="button"
                onClick={() => setShowConfirmPrimary(true)}
                className="w-full py-3 px-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 text-emerald-800 dark:text-emerald-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>👩‍⚕️</span>
                <span>Choose as My Primary Doctor</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
