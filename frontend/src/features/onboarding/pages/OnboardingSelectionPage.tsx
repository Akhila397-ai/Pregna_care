import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { OnboardingType } from '../../auth/types/auth.types';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { PregnancySetupModal } from '@/features/patient/components/PregnancySetupModal';
import { CycleSetupModal } from '@/features/patient/components/CycleSetupModal';

interface JourneyOption {
  type: OnboardingType;
  badge: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  gradientBg: string;
  borderColor: string;
  badgeColor: string;
  iconBg: string;
  ctaText: string;
}

const PRIMARY_JOURNEYS: JourneyOption[] = [
  {
    type: 'trying',
    badge: 'Pre-Conception & Cycle',
    icon: '🌱',
    title: 'Planning / Trying to Conceive',
    subtitle: 'Prepare your body and optimize your fertility',
    description:
      'Track your cycle, understand your fertile window, and prepare for conception with personalized cycle insights and health tools.',
    highlights: [
      'Menstrual cycle & period countdown',
      'Ovulation & fertile window prediction',
      'Pre-pregnancy wellness & nutrient guides',
    ],
    gradientBg:
      'from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-transparent',
    borderColor: 'hover:border-emerald-400 dark:hover:border-emerald-600 focus:border-emerald-500',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-500/10',
    ctaText: 'Start Conception Journey',
  },
  {
    type: 'pregnant',
    badge: 'Maternal & Baby Care',
    icon: '🤰',
    title: 'I’m Pregnant',
    subtitle: 'Week-by-week support for mother and baby',
    description:
      'Track your pregnancy journey, milestones, appointments, and helpful resources designed to guide you through every trimester.',
    highlights: [
      'Week-by-week baby growth & size milestones',
      'Prenatal appointment & medication reminders',
      'Trimester checklist & symptom relief tips',
    ],
    gradientBg:
      'from-rose-500/10 via-pink-500/5 to-transparent dark:from-rose-950/40 dark:via-pink-950/20 dark:to-transparent',
    borderColor: 'hover:border-rose-400 dark:hover:border-rose-600 focus:border-rose-500',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    iconBg: 'bg-rose-100/80 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 ring-4 ring-rose-500/10',
    ctaText: 'Continue Pregnancy Path',
  },
  {
    type: 'exploring',
    badge: 'Knowledge & Discovery',
    icon: '🔎',
    title: 'Explore',
    subtitle: 'Browse articles, wellness & medical experts',
    description:
      'Discover pregnancy, fertility, wellness, and healthcare information at your own pace with unrestricted access to our resource library.',
    highlights: [
      'Evidence-based healthcare & wellness library',
      'Specialist directory & maternal care guides',
      'Switch into full tracking mode anytime',
    ],
    gradientBg:
      'from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-transparent',
    borderColor: 'hover:border-blue-400 dark:hover:border-blue-600 focus:border-blue-500',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 ring-4 ring-blue-500/10',
    ctaText: 'Explore PregnaCare',
  },
];

const OnboardingSelectionPage: React.FC = () => {
  const { user, selectOnboarding, loading, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [isLmpModalOpen, setIsLmpModalOpen] = useState<boolean>(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState<boolean>(false);

  // If returning patient already completed onboarding, redirect directly to their dashboard
  useEffect(() => {
    if (user?.isOnboarded) {
      if (user.onboardingType === 'pregnant') {
        navigate('/dashboard/pregnancy', { replace: true });
      } else if (user.onboardingType === 'trying') {
        navigate('/dashboard/plan', { replace: true });
      } else if (user.onboardingType === 'exploring') {
        navigate('/dashboard/explore', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSelectJourney = async (type: OnboardingType) => {
    if (loading) return;
    if (type === 'trying') {
      setIsCycleModalOpen(true);
    } else if (type === 'pregnant') {
      setIsLmpModalOpen(true);
    } else if (type === 'exploring') {
      await selectOnboarding('exploring');
      navigate('/dashboard/explore', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-200 flex flex-col justify-between">
      {/* Top Navigation */}
      <nav className="bg-[var(--bg-surface)] border-b border-[var(--border-primary)] px-6 lg:px-12 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-[var(--text-primary)] tracking-tight text-lg leading-tight block">
              PregnaCare
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Personalized Journey
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={logoutUser}
            className="text-xs px-3.5 py-1.5 rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900/60 transition font-medium cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14 w-full">
        {/* Welcome Header */}
        <div className="text-center mb-10 lg:mb-12">
          {user && (
            <div className="inline-flex items-center gap-2.5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-1.5 mb-5 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                {user.name?.charAt(0).toUpperCase() || 'P'}
              </div>
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Welcome back,{' '}
                <span className="font-semibold text-[var(--text-primary)]">
                  {user.name}
                </span>
              </span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">
            Welcome to PregnaCare 👋
          </h1>
          <p className="text-lg sm:text-xl font-medium text-emerald-600 dark:text-emerald-400 mb-2">
            Where are you on your journey?
          </p>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Select a pathway to personalize your dashboard, health tools, and developmental timeline.
            You can effortlessly switch this anytime in your profile settings.
          </p>
        </div>

        {/* 3 Primary Journey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRIMARY_JOURNEYS.map((journey) => (
            <div
              key={journey.type}
              className={`group relative bg-[var(--bg-card)] rounded-3xl p-6 sm:p-7 border-2 border-[var(--border-primary)]
                shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between
                hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-emerald-500/40
                bg-gradient-to-b ${journey.gradientBg} ${journey.borderColor}`}
            >
              <div>
                {/* Header Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl ${journey.iconBg} flex items-center justify-center text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    {journey.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${journey.badgeColor}`}
                  >
                    {journey.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {journey.title}
                </h2>
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-3">
                  {journey.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  {journey.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 mb-6 pt-2 border-t border-[var(--border-primary)]/60">
                  {journey.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <svg
                        className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleSelectJourney(journey.type)}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm
                  bg-[var(--bg-surface)] hover:bg-emerald-600 hover:text-white
                  dark:bg-[var(--bg-muted)] dark:hover:bg-emerald-600
                  text-[var(--text-primary)] border border-[var(--border-primary)]
                  shadow-xs group-hover:shadow-md transition-all duration-200
                  flex items-center justify-center gap-2 cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-emerald-500"
              >
                <span>{journey.ctaText}</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Distinct Healthcare Professional & Specialist Section */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Doctor Application Info */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl shrink-0">
                🩺
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                  Are you a healthcare professional?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                  Join our certified medical network, provide verified consultations, and care for expecting families across the globe.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => navigate('/doctor/apply')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition group cursor-pointer"
                  >
                    <span>Join PregnaCare as a Doctor</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Divider on desktop */}
            <div className="hidden md:block w-px h-16 bg-[var(--border-primary)]" />

            {/* Patient Doctor Finder */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shrink-0">
                👩‍⚕️
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                  Looking for a verified specialist?
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                  Discover verified gynecologists, obstetricians, and fertility doctors ready to support you with prenatal care.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => handleSelectJourney('exploring')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition group cursor-pointer"
                  >
                    <span>Find a Doctor</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="mt-8 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Your selection personalizes your dashboard feed. You can change your journey anytime in profile settings.</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-primary)] py-4 text-center text-xs text-[var(--text-muted)]">
        © {new Date().getFullYear()} PregnaCare Health. All rights reserved.
      </footer>

      {/* ── Journey Setup Modals ────────────────────────── */}
      <PregnancySetupModal
        isOpen={isLmpModalOpen}
        onClose={() => setIsLmpModalOpen(false)}
        onSuccess={() => {
          setIsLmpModalOpen(false);
          navigate('/dashboard/pregnancy', { replace: true });
        }}
      />

      <CycleSetupModal
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        onSuccess={() => {
          setIsCycleModalOpen(false);
          navigate('/dashboard/plan', { replace: true });
        }}
      />
    </div>
  );
};

export default OnboardingSelectionPage;