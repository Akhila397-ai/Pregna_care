import React, { useState } from 'react';
import { PatientPrimaryDoctorStatus, VerifiedDoctor } from '@/features/doctor/types/doctor.types';
import { doctorApi } from '@/features/doctor/api/doctor.api';

interface PrimaryDoctorCareCardProps {
  status: PatientPrimaryDoctorStatus | null;
  loading: boolean;
  onRefresh: () => void;
  onFindDoctor: () => void;
  onBookAppointment: (doctor: VerifiedDoctor) => void;
  onViewDoctorProfile: (doctor: VerifiedDoctor) => void;
}

export const PrimaryDoctorCareCard: React.FC<PrimaryDoctorCareCardProps> = ({
  status,
  loading,
  onRefresh,
  onFindDoctor,
  onBookAppointment,
  onViewDoctorProfile,
}) => {
  const [canceling, setCanceling] = useState<boolean>(false);
  const [removing, setRemoving] = useState<boolean>(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);

  const handleCancelRequest = async () => {
    setCanceling(true);
    try {
      await doctorApi.cancelPrimaryDoctorRequest();
      onRefresh();
    } catch (err) {
      console.error('Failed to cancel request:', err);
    } finally {
      setCanceling(false);
    }
  };

  const handleRemoveDoctor = async () => {
    setRemoving(true);
    try {
      await doctorApi.removePrimaryDoctor();
      setShowRemoveConfirm(false);
      onRefresh();
    } catch (err) {
      console.error('Failed to remove doctor:', err);
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] animate-pulse space-y-3">
        <div className="h-5 bg-[var(--bg-muted)] rounded-md w-1/3" />
        <div className="h-4 bg-[var(--bg-muted)] rounded-md w-2/3" />
      </div>
    );
  }

  // ── State 1: Active Primary Doctor ───────────────────────────
  if (status?.hasPrimaryDoctor && status.primaryDoctor) {
    const doc = status.primaryDoctor;
    return (
      <div className="p-6 rounded-3xl bg-linear-to-br from-emerald-500/10 via-[var(--bg-card)] to-teal-500/5 border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {doc.profileImage ? (
              <img
                src={doc.profileImage}
                alt={doc.fullName || doc.name}
                className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/30 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black text-xl flex items-center justify-center border border-emerald-500/30 shadow-inner shrink-0">
                {(doc.fullName || doc.name || 'D').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ★ Your Primary Doctor
                </span>
              </div>
              <h3 className="text-lg font-black text-[var(--text-primary)]">
                {doc.fullName || doc.name}
              </h3>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {doc.specialization} • {doc.experience} yrs exp
              </p>
              {doc.clinicName && (
                <p className="text-xs text-[var(--text-muted)]">
                  🏥 {doc.clinicName} {doc.clinicAddress ? `• ${doc.clinicAddress}` : ''}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:self-center">
            <button
              type="button"
              onClick={() => onBookAppointment(doc)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span>📅</span>
              <span>Book Consultation</span>
            </button>
            <button
              type="button"
              onClick={() => onViewDoctorProfile(doc)}
              className="px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] font-bold text-xs transition cursor-pointer"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={() => setShowRemoveConfirm(true)}
              className="px-2.5 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-rose-500 transition cursor-pointer"
              title="Remove or Change Primary Doctor"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Remove Confirmation Dialog */}
        {showRemoveConfirm && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300">
              Remove {doc.fullName || doc.name} as your primary doctor?
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              You can still book individual appointments with this doctor or choose another primary doctor whenever you wish.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRemoveConfirm(false)}
                disabled={removing}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-secondary)] cursor-pointer"
              >
                Keep Doctor
              </button>
              <button
                type="button"
                onClick={handleRemoveDoctor}
                disabled={removing}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {removing ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── State 2: Pending Request ─────────────────────────────────
  if (status?.hasPendingRequest && status.pendingDoctor) {
    const doc = status.pendingDoctor;
    return (
      <div className="p-6 rounded-3xl bg-amber-500/10 dark:bg-amber-500/5 border-2 border-amber-500/30 shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center text-2xl shrink-0">
              ⏳
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                Request Pending
              </span>
              <h3 className="text-base font-black text-[var(--text-primary)]">
                {doc.fullName || doc.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                We sent your primary doctor request to {doc.fullName || doc.name}. You will be notified once they accept.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancelRequest}
            disabled={canceling}
            className="px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-[var(--bg-card)] hover:bg-amber-50 text-amber-800 dark:text-amber-200 font-bold text-xs transition cursor-pointer self-start sm:self-center disabled:opacity-50"
          >
            {canceling ? 'Canceling...' : 'Cancel Request'}
          </button>
        </div>
      </div>
    );
  }

  // ── State 3: No Primary Doctor (Default discovery prompt) ────
  return (
    <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500/5 via-[var(--bg-card)] to-purple-500/5 border border-[var(--border-primary)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">👩‍⚕️</span>
          <h3 className="text-base font-black text-[var(--text-primary)]">
            Choose Your Primary Doctor
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Select a verified healthcare professional to guide your journey. You can still book appointments with other doctors whenever you want.
        </p>
      </div>

      <button
        type="button"
        onClick={onFindDoctor}
        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
      >
        <span>🔎</span>
        <span>Find & Choose Doctor</span>
      </button>
    </div>
  );
};
