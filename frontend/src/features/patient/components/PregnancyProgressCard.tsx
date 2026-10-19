import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PregnancyDetailsResponse } from '@/features/auth/types/auth.types';

interface PregnancyProgressCardProps {
  pregnancyData: PregnancyDetailsResponse | null;
  onOpenLmpModal: () => void;
}

export const PregnancyProgressCard: React.FC<PregnancyProgressCardProps> = ({
  pregnancyData,
  onOpenLmpModal,
}) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'baby' | 'appointments' | 'reminders'>('overview');
  const [tookVitamin, setTookVitamin] = useState<boolean>(true);
  const [drankWater, setDrankWater] = useState<boolean>(true);
  const [wentWalking, setWentWalking] = useState<boolean>(false);

  const weeks = pregnancyData?.weeks || 11;
  const days = pregnancyData?.days || 5;
  const formattedAge = pregnancyData?.formattedAge || `${weeks} Weeks ${days} Days`;
  const babySize = pregnancyData?.babySize || 'Lime';
  const trimester = pregnancyData?.trimester || 1;
  const daysRemaining = pregnancyData?.daysRemaining || 198;
  const progressPercent = pregnancyData?.progressPercent || Math.min(100, Math.round((weeks / 40) * 100));

  const dueDateFormatted = pregnancyData?.estimatedDueDate
    ? new Date(pregnancyData.estimatedDueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Estimated in 28 weeks';

  const lmpFormatted = pregnancyData?.lmpDate
    ? new Date(pregnancyData.lmpDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Not set';

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1 flex items-center gap-2">
            Your Pregnancy Journey 💛
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Here's what's happening with your pregnancy this week.
          </p>
        </div>

        {/* Change LMP Button */}
        <button
          type="button"
          onClick={onOpenLmpModal}
          className="px-3.5 py-2 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-rose-400 text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          📅 Update LMP Date
        </button>
      </div>

      {/* ── Main Pregnancy Card ─────────────────────────── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Trimester {trimester} of 3
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-primary)] text-[var(--text-secondary)] text-xs font-medium">
                <span className="font-bold text-[var(--text-primary)]">LMP:</span> {lmpFormatted}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)]">
              {formattedAge}
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
              Estimated Due Date: <strong>{dueDateFormatted}</strong> • {daysRemaining} Days to go
            </p>

            {/* Simple Progress Bar */}
            <div className="max-w-md w-full pt-2">
              <div className="w-full h-2.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)] mt-1">
                <span>Month 1</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{progressPercent}% Completed</span>
                <span>Month 9</span>
              </div>
            </div>
          </div>

          {/* Baby Size Visual */}
          <div className="p-5 rounded-3xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center gap-4 shrink-0 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-4xl shadow-inner">
              🥑
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                Baby Size Comparison
              </span>
              <h3 className="text-lg font-black text-[var(--text-primary)]">
                Size of a {babySize}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Week {weeks} Growth Milestone
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Action Cards (Progressive Disclosure) ───── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveSection('baby')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeSection === 'baby'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400/30'
              : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-rose-300'
          }`}
        >
          <span className="text-2xl mb-2 block">👶</span>
          <span className="font-bold text-xs sm:text-sm block">Baby Development</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Week {weeks} changes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('appointments')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeSection === 'appointments'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400/30'
              : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-rose-300'
          }`}
        >
          <span className="text-2xl mb-2 block">📅</span>
          <span className="font-bold text-xs sm:text-sm block">Appointments</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Checkup schedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('reminders')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeSection === 'reminders'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400/30'
              : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-rose-300'
          }`}
        >
          <span className="text-2xl mb-2 block">🔔</span>
          <span className="font-bold text-xs sm:text-sm block">Reminders</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Daily habits</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard/explore')}
          className="p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-left hover:border-rose-400 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-2xl mb-2 block">📚</span>
          <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] block">Learn</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Pregnancy articles</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard/doctors')}
          className="p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-left hover:border-rose-400 transition cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <span className="text-2xl mb-2 block">👩‍⚕️</span>
          <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] block">Find a Doctor</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">OB-GYN specialists</span>
        </button>
      </div>

      {/* ── Active Sub-Section View ──────────────────────── */}
      {activeSection === 'baby' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>👶</span> Baby's Highlights at Week {weeks}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1">
              <span className="text-lg block">👂</span>
              <strong className="text-[var(--text-primary)] block">Sensory Development</strong>
              <p className="text-[var(--text-secondary)]">
                Tiny inner ear structures are developing. Baby will soon be able to recognize sounds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1">
              <span className="text-lg block">✨</span>
              <strong className="text-[var(--text-primary)] block">Tiny Fingers & Nails</strong>
              <p className="text-[var(--text-secondary)]">
                Fingers and toes are fully separated with tiny soft nail beds starting to form.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1">
              <span className="text-lg block">❤️</span>
              <strong className="text-[var(--text-primary)] block">Heart & Circulation</strong>
              <p className="text-[var(--text-secondary)]">
                The heart is beating regularly at about 140 to 160 beats per minute.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'appointments' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>📅</span> Upcoming Prenatal Care
          </h3>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-lg">
                👩‍⚕️
              </div>
              <div>
                <strong className="text-[var(--text-primary)] text-sm block">Routine Prenatal Ultrasound</strong>
                <span className="text-xs text-[var(--text-secondary)]">Dr. Sarah Johnson • Obstetrician</span>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Thursday, Oct 24 • 10:30 AM</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/doctors')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto"
            >
              View Doctor Details
            </button>
          </div>
        </div>
      )}

      {activeSection === 'reminders' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 shadow-xs space-y-3 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>🔔</span> Daily Reminders
          </h3>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] cursor-pointer">
              <span className="font-semibold text-[var(--text-primary)]">💊 Take Prenatal Vitamin & Iron</span>
              <input
                type="checkbox"
                checked={tookVitamin}
                onChange={(e) => setTookVitamin(e.target.checked)}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] cursor-pointer">
              <span className="font-semibold text-[var(--text-primary)]">💧 Hydration (8 Glasses of Water)</span>
              <input
                type="checkbox"
                checked={drankWater}
                onChange={(e) => setDrankWater(e.target.checked)}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] cursor-pointer">
              <span className="font-semibold text-[var(--text-primary)]">🚶‍♀️ 15–20 Minute Gentle Walk</span>
              <input
                type="checkbox"
                checked={wentWalking}
                onChange={(e) => setWentWalking(e.target.checked)}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
