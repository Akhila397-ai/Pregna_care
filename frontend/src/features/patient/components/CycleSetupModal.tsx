import React, { useState } from 'react';
import { authApi } from '@/features/auth/api/auth.api';
import { CycleDetailsResponse } from '@/features/auth/types/auth.types';
import { validateCycleInfo, hasErrors } from '../utils/validation';

interface CycleSetupModalProps {
  isOpen: boolean;
  initialDate?: string;
  initialCycleLength?: number;
  onClose: () => void;
  onSuccess: (data: CycleDetailsResponse) => void;
}

export const CycleSetupModal: React.FC<CycleSetupModalProps> = ({
  isOpen,
  initialDate = '',
  initialCycleLength = 28,
  onClose,
  onSuccess,
}) => {
  const [periodStartDate, setPeriodStartDate] = useState<string>(
    initialDate ? new Date(initialDate).toISOString().split('T')[0] : ''
  );
  const [cycleLength, setCycleLength] = useState<number>(initialCycleLength || 28);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const maxDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCycleInfo({
      periodStartDate,
      cycleLength: Number(cycleLength),
    });

    if (hasErrors(validationErrors)) {
      setError(
        validationErrors.periodStartDate ||
        validationErrors.cycleLength ||
        'Please enter valid period information.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.setCycleInfo({
        periodStartDate,
        cycleLength: Number(cycleLength),
      });
      onSuccess(response);
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.userFriendlyMessage ||
        err?.response?.data?.message ||
        'Failed to save cycle information. Please try again.';
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xl">
              🌱
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Cycle & Period Setup
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Estimate your cycle progress and fertile window
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

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-1">
              When did your last period start?
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-2.5">
              Select the first day of bleeding of your most recent period.
            </p>
            <input
              type="date"
              max={maxDate}
              value={periodStartDate}
              onChange={(e) => {
                setPeriodStartDate(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-1">
              Average Cycle Length
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              Number of days from the start of one period to the start of the next (Usually 28 days).
            </p>
            <div className="flex items-center gap-2">
              {[26, 28, 30, 32].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setCycleLength(days)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    cycleLength === days
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-emerald-400'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
            <span className="font-bold block mb-0.5">ℹ️ Medical Disclaimer</span>
            <p>
              Period predictions and fertile window estimates are mathematical approximations based on the dates you enter. They are not guaranteed results.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Estimating...' : 'Save & Track Cycle →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
