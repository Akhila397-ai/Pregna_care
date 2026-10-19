import React, { useState } from 'react';
import { authApi } from '@/features/auth/api/auth.api';
import { PregnancyDetailsResponse } from '@/features/auth/types/auth.types';
import { validatePregnancyLmp, hasErrors } from '../utils/validation';

interface PregnancySetupModalProps {
  isOpen: boolean;
  initialLmp?: string;
  onClose: () => void;
  onSuccess: (data: PregnancyDetailsResponse) => void;
}

export const PregnancySetupModal: React.FC<PregnancySetupModalProps> = ({
  isOpen,
  initialLmp = '',
  onClose,
  onSuccess,
}) => {
  const [lmpDate, setLmpDate] = useState<string>(
    initialLmp ? new Date(initialLmp).toISOString().split('T')[0] : ''
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Max date is today in YYYY-MM-DD
  const maxDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validatePregnancyLmp(lmpDate);
    if (hasErrors(validationErrors)) {
      setError(validationErrors.lmpDate || 'Please enter your last menstrual period date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.setPregnancyLMP({ lmpDate });
      onSuccess(response);
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.userFriendlyMessage ||
        err?.response?.data?.message ||
        "We couldn't save your pregnancy information. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 flex items-center justify-center text-xl">
              🤰
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Pregnancy Setup
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Calculate your pregnancy weeks & milestones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 my-2">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
              When was the first day of your last period?
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
              We'll use this date to calculate how far along your pregnancy is.
            </p>

            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
              LMP Date
            </label>
            <input
              type="date"
              max={maxDate}
              value={lmpDate}
              onChange={(e) => {
                setLmpDate(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-primary)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Continue →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

