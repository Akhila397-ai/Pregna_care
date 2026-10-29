import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authApi } from '@/features/auth/api/auth.api';
import { doctorApi } from '@/features/doctor/api/doctor.api';
import {
  OnboardingType,
  PregnancyDetailsResponse,
  CycleDetailsResponse,
} from '@/features/auth/types/auth.types';
import {
  PatientPrimaryDoctorStatus,
  VerifiedDoctor,
} from '@/features/doctor/types/doctor.types';
import { PatientNavbar } from '../components/PatientNavbar';
import { PatientSidebar } from '../components/PatientSidebar';
import { JourneySwitchModal } from '../components/JourneySwitchModal';
import { CycleTrackerCard } from '../components/CycleTrackerCard';
import { PregnancyProgressCard } from '../components/PregnancyProgressCard';
import { ExploreArticlesHub } from '../components/ExploreArticlesHub';
import { DoctorDiscoveryCard } from '../components/DoctorDiscoveryCard';
import { PatientProfileView } from '../components/PatientProfileView';
import { PrimaryDoctorCareCard } from '../components/PrimaryDoctorCareCard';
import { PatientAppointmentsView } from '../components/PatientAppointmentsView';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import { DoctorProfileModal } from '../components/DoctorProfileModal';
import { SOSModal } from '../components/SOSModal';
import { PregnancySetupModal } from '../components/PregnancySetupModal';
import { CycleSetupModal } from '../components/CycleSetupModal';

type ViewMode =
  | 'home'
  | 'plan'
  | 'pregnancy'
  | 'learn'
  | 'doctors'
  | 'appointments'
  | 'profile';

const PatientDashboardPage: React.FC = () => {
  const { user, selectOnboarding, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [pregnancyData, setPregnancyData] = useState<PregnancyDetailsResponse | null>(null);
  const [cycleData, setCycleData] = useState<CycleDetailsResponse | null>(null);
  const [primaryDoctorStatus, setPrimaryDoctorStatus] = useState<PatientPrimaryDoctorStatus | null>(null);
  const [loadingPrimaryDoc, setLoadingPrimaryDoc] = useState<boolean>(false);

  // Modals & Navigation state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isLmpModalOpen, setIsLmpModalOpen] = useState<boolean>(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState<boolean>(false);

  // Primary doctor modal states
  const [activeBookingDoctor, setActiveBookingDoctor] = useState<VerifiedDoctor | null>(null);
  const [activeProfileDoctor, setActiveProfileDoctor] = useState<VerifiedDoctor | null>(null);

  // Fetch pregnancy & cycle details from backend
  const loadPatientData = useCallback(async () => {
    try {
      const [pregRes, cycRes] = await Promise.allSettled([
        authApi.getPregnancyDetails(),
        authApi.getCycleDetails(),
      ]);
      if (pregRes.status === 'fulfilled') {
        setPregnancyData(pregRes.value);
      }
      if (cycRes.status === 'fulfilled') {
        setCycleData(cycRes.value);
      }
    } catch (err) {
      console.error('Failed to load patient tracking details:', err);
    }
  }, []);

  // Fetch Primary Doctor relationship status
  const loadPrimaryDoctorStatus = useCallback(async () => {
    setLoadingPrimaryDoc(true);
    try {
      const res = await doctorApi.getPatientPrimaryDoctor();
      if (res.success && res.data) {
        setPrimaryDoctorStatus(res.data);
      }
    } catch (err) {
      console.error('Failed to load primary doctor status:', err);
    } finally {
      setLoadingPrimaryDoc(false);
    }
  }, []);

  useEffect(() => {
    loadPatientData();
    loadPrimaryDoctorStatus();
  }, [loadPatientData, loadPrimaryDoctorStatus]);

  // Sync route with view mode
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/plan') || path.includes('/dashboard/menstruation')) {
      setViewMode('plan');
    } else if (path.includes('/dashboard/pregnancy')) {
      setViewMode('pregnancy');
    } else if (path.includes('/dashboard/learn') || path.includes('/dashboard/explore')) {
      setViewMode('learn');
    } else if (path.includes('/dashboard/doctors')) {
      setViewMode('doctors');
    } else if (path.includes('/dashboard/appointments')) {
      setViewMode('appointments');
    } else if (path.includes('/dashboard/profile')) {
      setViewMode('profile');
    } else {
      setViewMode('home');
    }
  }, [location.pathname]);

  const handleSwitchJourney = async (newType: OnboardingType) => {
    await selectOnboarding(newType);
    setIsSwitchModalOpen(false);
    if (newType === 'trying') {
      if (!cycleData?.periodStartDate) {
        setIsCycleModalOpen(true);
      } else {
        navigate('/dashboard/plan');
      }
    } else if (newType === 'pregnant') {
      if (!pregnancyData?.lmpDate) {
        setIsLmpModalOpen(true);
      } else {
        navigate('/dashboard/pregnancy');
      }
    } else if (newType === 'exploring') {
      navigate('/dashboard/explore');
    }
  };

  const handleSelectTryingToConceive = async () => {
    if (user?.onboardingType !== 'trying') {
      await selectOnboarding('trying');
    }
    if (!cycleData?.periodStartDate) {
      setIsCycleModalOpen(true);
    } else {
      navigate('/dashboard/plan');
    }
  };

  const handleSelectPregnant = async () => {
    if (user?.onboardingType !== 'pregnant') {
      await selectOnboarding('pregnant');
    }
    if (!pregnancyData?.lmpDate) {
      setIsLmpModalOpen(true);
    } else {
      navigate('/dashboard/pregnancy');
    }
  };

  const handleSelectExplore = async () => {
    if (user?.onboardingType !== 'exploring') {
      await selectOnboarding('exploring');
    }
    navigate('/dashboard/explore');
  };

  const currentJourney = user?.onboardingType;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-200">
      {/* ── Left Sidebar ─────────────────────────────────── */}
      <PatientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ── Main Layout Wrapper (Shifted right on desktop) ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen justify-between">
        {/* Top Header Bar */}
        <PatientNavbar
          onOpenSOS={() => setIsSOSModalOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full flex-1">
          {/* ── 1. HOME SCREEN (Simple, Calm, Welcoming) ────── */}
          {viewMode === 'home' && (
            <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-200">
              {/* Welcoming Header */}
              <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
                  Welcome to PregnaCare 👋
                </h1>
                <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  How can we help you today?
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  Choose what you would like to do. We'll guide you step by step.
                </p>
              </div>

              {/* Primary Doctor Care Card Banner */}
              <PrimaryDoctorCareCard
                status={primaryDoctorStatus}
                loading={loadingPrimaryDoc}
                onRefresh={loadPrimaryDoctorStatus}
                onFindDoctor={() => navigate('/dashboard/doctors')}
                onBookAppointment={(doc) => setActiveBookingDoctor(doc)}
                onViewDoctorProfile={(doc) => setActiveProfileDoctor(doc)}
              />

              {/* Quick Active Journey Resume Card (if user has active data) */}
              {currentJourney === 'pregnant' && pregnancyData?.lmpDate && (
                <div className="bg-rose-50/80 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-rose-100 dark:bg-rose-900/70 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                      🥑
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                        Active Pregnancy Tracking • Trimester {pregnancyData.trimester}
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                        {pregnancyData.formattedAge} (Size of a {pregnancyData.babySize})
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {pregnancyData.daysRemaining} days until estimated due date
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/pregnancy')}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
                  >
                    Continue Pregnancy Tracking →
                  </button>
                </div>
              )}

              {currentJourney === 'trying' && cycleData?.periodStartDate && (
                <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-900/70 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                      🌱
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        Active Cycle Tracking
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                        Cycle Day {cycleData.currentCycleDay} • {cycleData.isFertile ? 'Fertile Window Active' : 'Cycle in Progress'}
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Next period expected in {cycleData.daysUntilNextPeriod} days
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/plan')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
                  >
                    Continue Cycle Tracking →
                  </button>
                </div>
              )}

              {/* 3 Large, Visually Engaging Primary Journey Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: I'm Trying to Have a Baby */}
                <div
                  onClick={handleSelectTryingToConceive}
                  className="group relative bg-[var(--bg-card)] border-2 border-emerald-100 dark:border-emerald-950/80 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-3xl p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform shadow-xs">
                      🌱
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                      I'm Trying to Have a Baby
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                      Track your periods, understand your cycle, and learn about your fertile window.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Period Tracking
                      </span>
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Fertile Days
                      </span>
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Ovulation
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-primary)]/70 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Get Started →
                    </span>
                    <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>

                {/* Card 2: I'm Pregnant */}
                <div
                  onClick={handleSelectPregnant}
                  className="group relative bg-[var(--bg-card)] border-2 border-rose-100 dark:border-rose-950/80 hover:border-rose-400 dark:hover:border-rose-600 rounded-3xl p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 bg-gradient-to-b from-rose-500/10 via-rose-500/5 to-transparent"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform shadow-xs">
                      🤰
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mb-2">
                      I'm Pregnant
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                      Track your pregnancy journey and follow your baby's development.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Week by Week
                      </span>
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Baby Size
                      </span>
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Appointments
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-primary)]/70 flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Get Started →
                    </span>
                    <span className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-sm group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>

                {/* Card 3: I Want to Explore */}
                <div
                  onClick={handleSelectExplore}
                  className="group relative bg-[var(--bg-card)] border-2 border-blue-100 dark:border-blue-950/80 hover:border-blue-400 dark:hover:border-blue-600 rounded-3xl p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform shadow-xs">
                      📚
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      I Want to Explore
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                      Learn about pregnancy, fertility, women's health, and parenting.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Easy Guides
                      </span>
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Healthy Nutrition
                      </span>
                      <span className="bg-[var(--bg-surface)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                        Wellness
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-primary)]/70 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Explore →
                    </span>
                    <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>

              {/* Healthcare Specialists & Appointments Shortcut */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Find a Doctor */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-300 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      👩‍⚕️
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                        Need to consult a specialist?
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                        Connect with verified obstetricians, gynecologists, and fertility doctors for checkups.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard/doctors')}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        <span>Find a Doctor</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-14 bg-[var(--border-primary)]" />

                  {/* My Appointments Shortcut */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      📅
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                        Upcoming Consultations & Records
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                        Review your booked appointments, consultation summaries, and medical prescriptions.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard/appointments')}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <span>My Appointments</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                            {/* Healthcare Professional Application CTA */}
              <div className="mt-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-950/40 dark:via-[var(--bg-card)] dark:to-teal-950/30 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/70 flex items-center justify-center text-2xl shrink-0">
                      🩺
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                        For Healthcare Professionals
                      </p>

                      <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mb-2">
                        Are you a healthcare professional?
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
                        Join PregnaCare as a doctor and help women receive
                        trusted maternity and reproductive healthcare.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/doctor/apply')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer shrink-0"
                  >
                    Apply as a Doctor
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── 2. PROGRESSIVE DISCLOSURE VIEWS ─────────────── */}
          {viewMode === 'plan' && (
            <div className="animate-in fade-in duration-200">
              <CycleTrackerCard
                cycleData={cycleData}
                onOpenCycleModal={() => setIsCycleModalOpen(true)}
                onSwitchToPregnant={() => handleSwitchJourney('pregnant')}
              />
            </div>
          )}

          {viewMode === 'pregnancy' && (
            <div className="animate-in fade-in duration-200">
              <PregnancyProgressCard
                pregnancyData={pregnancyData}
                onOpenLmpModal={() => setIsLmpModalOpen(true)}
              />
            </div>
          )}

          {viewMode === 'learn' && (
            <div className="animate-in fade-in duration-200">
              <ExploreArticlesHub
                userJourney={currentJourney}
                onSelectJourney={(type) => handleSwitchJourney(type)}
              />
            </div>
          )}

          {viewMode === 'doctors' && (
            <div className="animate-in fade-in duration-200">
              <DoctorDiscoveryCard
                primaryDoctorStatus={primaryDoctorStatus}
                onRefreshPrimaryDoctor={loadPrimaryDoctorStatus}
                onViewAppointments={() => navigate('/dashboard/appointments')}
              />
            </div>
          )}

          {viewMode === 'appointments' && (
            <div className="animate-in fade-in duration-200">
              <PatientAppointmentsView
                primaryDoctorStatus={primaryDoctorStatus}
                onFindDoctor={() => navigate('/dashboard/doctors')}
                onRefreshPrimaryDoctor={loadPrimaryDoctorStatus}
              />
            </div>
          )}

          {viewMode === 'profile' && (
            <div className="animate-in fade-in duration-200">
              <PatientProfileView
                onOpenSwitchModal={() => setIsSwitchModalOpen(true)}
                onOpenSOSModal={() => setIsSOSModalOpen(true)}
                onOpenLmpModal={() => setIsLmpModalOpen(true)}
              />
            </div>
          )}
        </main>

        {/* ── Setup & Action Modals ────────────────────────── */}
        <PregnancySetupModal
          isOpen={isLmpModalOpen}
          initialLmp={pregnancyData?.lmpDate}
          onClose={() => setIsLmpModalOpen(false)}
          onSuccess={(data) => {
            setPregnancyData(data);
            setIsLmpModalOpen(false);
            navigate('/dashboard/pregnancy');
          }}
        />

        <CycleSetupModal
          isOpen={isCycleModalOpen}
          initialDate={cycleData?.periodStartDate}
          initialCycleLength={cycleData?.cycleLength}
          onClose={() => setIsCycleModalOpen(false)}
          onSuccess={(data) => {
            setCycleData(data);
            setIsCycleModalOpen(false);
            navigate('/dashboard/plan');
          }}
        />

        <JourneySwitchModal
          isOpen={isSwitchModalOpen}
          currentType={currentJourney || null}
          onClose={() => setIsSwitchModalOpen(false)}
          onSelect={handleSwitchJourney}
          loading={loading}
        />

        <SOSModal
          isOpen={isSOSModalOpen}
          onClose={() => setIsSOSModalOpen(false)}
        />

        {/* Global Doctor Booking Modal (from Primary Doctor Card) */}
        {activeBookingDoctor && (
          <BookAppointmentModal
            doctor={activeBookingDoctor}
            onClose={() => setActiveBookingDoctor(null)}
            onSuccess={() => {
              setActiveBookingDoctor(null);
              navigate('/dashboard/appointments');
            }}
          />
        )}

        {/* Global Doctor Profile Modal (from Primary Doctor Card) */}
        {activeProfileDoctor && (
          <DoctorProfileModal
            doctor={activeProfileDoctor}
            isCurrentPrimary={true}
            onClose={() => setActiveProfileDoctor(null)}
            onBookAppointment={(doc) => {
              setActiveProfileDoctor(null);
              setActiveBookingDoctor(doc);
            }}
            onPrimaryDoctorRequested={() => {
              setActiveProfileDoctor(null);
              loadPrimaryDoctorStatus();
            }}
          />
        )}

        {/* ── Clean Footer ────────────────────────────────── */}
        <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-surface)] py-4 text-center text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} PregnaCare Health • Simple maternal and family care.
        </footer>
      </div>

    </div>
  );
};

export default PatientDashboardPage;
