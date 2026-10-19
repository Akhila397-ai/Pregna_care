import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { OnboardingType } from '@/features/auth/types/auth.types';

interface PatientProfileViewProps {
  onOpenSwitchModal: () => void;
  onOpenSOSModal?: () => void;
  onOpenLmpModal?: () => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  onOpenSwitchModal,
  onOpenSOSModal,
  onOpenLmpModal,
}) => {
  const { user, logoutUser } = useAuth();

  const getJourneyLabel = (type: OnboardingType) => {
    if (type === 'trying') return '🌱 Planning for a Baby';
    if (type === 'pregnant') return '🤰 Tracking My Pregnancy';
    return '📚 Exploring & Learning';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
          👤 My Profile & Journey
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Manage your account, journey settings, and emergency contacts.
        </p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        {/* User Card */}
        <div className="flex items-center gap-4 pb-5 border-b border-[var(--border-primary)]">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-2xl flex items-center justify-center border border-[var(--border-primary)] shadow-inner">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              {user?.name || 'PregnaCare User'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {user?.email || ''}
            </p>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mt-1">
              Verified Account
            </span>
          </div>
        </div>

        {/* Current Journey Setting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)]">
          <div>
            <span className="text-xs font-semibold text-[var(--text-muted)] block">
              Active Tracking Journey
            </span>
            <span className="text-base font-bold text-[var(--text-primary)] mt-0.5 block">
              {getJourneyLabel(user?.onboardingType || null)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user?.onboardingType === 'pregnant' && onOpenLmpModal && (
              <button
                type="button"
                onClick={onOpenLmpModal}
                className="px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-rose-400 text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
              >
                📅 Edit LMP
              </button>
            )}
            <button
              type="button"
              onClick={onOpenSwitchModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              Change Journey ▾
            </button>
          </div>
        </div>

        {/* Emergency Contacts Management */}
        {onOpenSOSModal && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
            <div>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span>🚨</span> SOS Emergency Contacts
              </span>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Configure trusted family members or friends for 1-tap calling during emergencies.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSOSModal}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
            >
              Manage Contacts 🚨
            </button>
          </div>
        )}

        {/* Account Actions */}
        <div className="pt-2 flex justify-between items-center">
          <span className="text-xs text-[var(--text-muted)]">
            PregnaCare Health Platform
          </span>
          <button
            type="button"
            onClick={logoutUser}
            className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
