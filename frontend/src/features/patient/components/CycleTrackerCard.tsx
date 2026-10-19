import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CycleDetailsResponse } from '@/features/auth/types/auth.types';

interface CycleTrackerCardProps {
  cycleData: CycleDetailsResponse | null;
  onOpenCycleModal: () => void;
  onSwitchToPregnant?: () => void;
}

export const CycleTrackerCard: React.FC<CycleTrackerCardProps> = ({
  cycleData,
  onOpenCycleModal,
  onSwitchToPregnant,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'period' | 'fertile' | 'history'>('overview');

  const currentCycleDay = cycleData?.currentCycleDay || 12;
  const cycleLength = cycleData?.cycleLength || 28;
  const isFertile = cycleData?.isFertile ?? true;
  const daysUntilNextPeriod = cycleData?.daysUntilNextPeriod || 16;

  const nextPeriodFormatted = cycleData?.nextPeriodDate
    ? new Date(cycleData.nextPeriodDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : `In ${daysUntilNextPeriod} days`;

  const fertileStartFormatted = cycleData?.fertileStartDate
    ? new Date(cycleData.fertileStartDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Day 11';

  const fertileEndFormatted = cycleData?.fertileEndDate
    ? new Date(cycleData.fertileEndDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Day 15';

  const cycleDays = Array.from({ length: cycleLength }, (_, i) => i + 1);

  const getDayType = (day: number) => {
    if (day >= 1 && day <= (cycleData?.periodLength || 5)) return 'period';
    if (day >= 11 && day <= 15) {
      if (day === (cycleData?.ovulationDay || 14)) return 'ovulation';
      return 'fertile';
    }
    return 'normal';
  };

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
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1">
            Your Cycle
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Track your cycle progress and estimated fertile window.
          </p>
        </div>

        {/* Update Period Date Button */}
        <button
          type="button"
          onClick={onOpenCycleModal}
          className="px-3.5 py-2 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-emerald-400 text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          📅 Update Period Date
        </button>
      </div>

      {/* ── Main Cycle Estimation Card ───────────────────── */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isFertile
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isFertile ? 'Fertile Window Active' : 'Follicular / Luteal Phase'}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)]">
              Cycle Day {currentCycleDay}
            </h2>

            <div className="space-y-1 text-xs sm:text-sm text-[var(--text-secondary)]">
              <p>
                <strong>Next period:</strong> Estimated around <strong>{nextPeriodFormatted}</strong> ({daysUntilNextPeriod} days remaining)
              </p>
              <p>
                <strong>Fertile window:</strong> Estimated <strong>{fertileStartFormatted} – {fertileEndFormatted}</strong>
              </p>
            </div>

            <p className="text-[11px] text-[var(--text-muted)] pt-1 italic">
              * Dates are mathematical estimates based on your entered period info.
            </p>
          </div>

          {/* Quick Stat Blocks */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                Next Period
              </span>
              <span className="text-xl font-black text-[var(--text-primary)] mt-1 block">
                {nextPeriodFormatted}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                In {daysUntilNextPeriod} Days
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] text-center min-w-[120px]">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                Fertile Window
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                {fertileStartFormatted} – {fertileEndFormatted}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium">
                High Chance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 Primary Actions ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('period')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'period'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-emerald-300'
          }`}
        >
          <span className="text-2xl mb-2 block">🩸</span>
          <span className="font-bold text-xs sm:text-sm block">Track Period</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Cycle calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fertile')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'fertile'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-emerald-300'
          }`}
        >
          <span className="text-2xl mb-2 block">🌸</span>
          <span className="font-bold text-xs sm:text-sm block">Fertile Window</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Ovulation timing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeTab === 'history'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-emerald-300'
          }`}
        >
          <span className="text-2xl mb-2 block">📅</span>
          <span className="font-bold text-xs sm:text-sm block">Cycle History</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Past cycles</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard/explore')}
          className="p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-left hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between"
        >
          <span className="text-2xl mb-2 block">📚</span>
          <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] block">Learn</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Fertility articles</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard/doctors')}
          className="p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-left hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <span className="text-2xl mb-2 block">👩‍⚕️</span>
          <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] block">Find a Doctor</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Fertility experts</span>
        </button>
      </div>

      {/* ── Sub-Section: Period & Fertile 28-day Calendar ─ */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            28-Day Visual Cycle Overview
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="text-[var(--text-secondary)]">Period</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-[var(--text-secondary)]">Fertile</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span className="text-[var(--text-secondary)]">Ovulation</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cycleDays.map((day) => {
            const type = getDayType(day);
            const isToday = currentCycleDay === day;

            let badgeStyle = 'bg-[var(--bg-surface)] border-[var(--border-primary)] text-[var(--text-primary)]';
            if (type === 'period') {
              badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300 font-bold';
            } else if (type === 'ovulation') {
              badgeStyle = 'bg-teal-100 dark:bg-teal-950/80 border-teal-500 text-teal-800 dark:text-teal-200 font-black';
            } else if (type === 'fertile') {
              badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300 font-bold';
            }

            return (
              <div
                key={day}
                className={`h-11 sm:h-12 rounded-xl border flex flex-col items-center justify-center text-xs relative ${badgeStyle} ${
                  isToday ? 'ring-2 ring-emerald-500 shadow-xs' : ''
                }`}
              >
                <span>Day {day}</span>
                {isToday && <span className="text-[7px] uppercase font-bold text-emerald-600">Today</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Positive Test Switcher */}
      {onSwitchToPregnant && (
        <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-300 dark:border-rose-800 rounded-3xl p-5 text-center shadow-xs">
          <span className="text-2xl block mb-1">🎉</span>
          <h4 className="text-sm font-bold text-[var(--text-primary)]">
            Got a Positive Pregnancy Test?
          </h4>
          <p className="text-xs text-[var(--text-secondary)] mb-3">
            Congratulations! Switch to pregnancy tracking for week-by-week updates and development milestones.
          </p>
          <button
            type="button"
            onClick={onSwitchToPregnant}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Switch to Pregnancy Tracking 🤰
          </button>
        </div>
      )}
    </div>
  );
};
