import React from 'react';
import { OnboardingType } from '@/features/auth/types/auth.types';

interface JourneySwitchModalProps {
  isOpen: boolean;
  currentType: OnboardingType;
  onClose: () => void;
  onSelect: (type: OnboardingType) => Promise<void>;
  loading?: boolean;
}

const JOURNEY_OPTIONS: {
  type: OnboardingType;
  icon: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  activeRing: string;
}[] = [
  {
    type: 'trying',
    icon: '🌱',
    title: 'Planning / Trying to Conceive',
    desc: 'Prioritize cycle tracker, period calendar, fertile window prediction, and pre-conception wellness.',
    badge: 'Pre-Conception',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
    activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/30',
  },
  {
    type: 'pregnant',
    icon: '🤰',
    title: 'I’m Pregnant',
    desc: 'Prioritize week-by-week baby development, trimester milestones, prenatal appointments, and reminders.',
    badge: 'Maternal Care',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
    activeRing: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/20 dark:bg-rose-950/30',
  },
  {
    type: 'exploring',
    icon: '🔎',
    title: 'Explore & Knowledge',
    desc: 'Focus on discovering medical articles, wellness guides, specialist directory, and general healthcare.',
    badge: 'Discovery',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300',
    activeRing: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20 dark:bg-blue-950/30',
  },
];

export const JourneySwitchModal: React.FC<JourneySwitchModalProps> = ({
  isOpen,
  currentType,
  onClose,
  onSelect,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Switch Your Journey
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Your dashboard and priority tools will adapt to your chosen journey.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 my-5">
          {JOURNEY_OPTIONS.map((item) => {
            const isSelected = currentType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onSelect(item.type)}
                disabled={loading}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? item.activeRing
                    : 'border-[var(--border-primary)] bg-[var(--bg-surface)] hover:border-emerald-400 dark:hover:border-emerald-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[var(--text-primary)]">
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    {isSelected && (
                      <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
