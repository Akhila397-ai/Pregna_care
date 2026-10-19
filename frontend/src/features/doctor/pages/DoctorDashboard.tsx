import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDoctor } from '../hooks/useDoctor';
import { doctorApi } from '../api/doctor.api';
import {
  Appointment,
  PrimaryDoctorRelationship,
} from '../types/doctor.types';
import { DoctorSidebar, DoctorNavTab } from '../components/DoctorSidebar';
import { DoctorNavbar } from '../components/DoctorNavbar';
import { DoctorSummaryStats } from '../components/DoctorSummaryStats';
import { DoctorTodaysAppointments } from '../components/DoctorTodaysAppointments';
import { DoctorUpcomingAppointments } from '../components/DoctorUpcomingAppointments';
import { DoctorAlertsPanel } from '../components/DoctorAlertsPanel';
import { DoctorCompleteConsultationModal } from '../components/DoctorCompleteConsultationModal';

const DoctorDashboardPage: React.FC = () => {
  const { dashboard, loading, logout, fetchDashboard } = useDoctor();

  // Navigation and layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<DoctorNavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Backend Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [primaryRequests, setPrimaryRequests] = useState<PrimaryDoctorRelationship[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Modals state
  const [activeCompletingAppointment, setActiveCompletingAppointment] = useState<Appointment | null>(null);
  const [cancelingAppointment, setCancelingAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isCanceling, setIsCanceling] = useState<boolean>(false);

  // Decline primary doctor request state
  const [decliningRequestId, setDecliningRequestId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState<string>('');

  const loadDoctorData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [aptsRes, reqsRes] = await Promise.allSettled([
        doctorApi.getDoctorAppointments(),
        doctorApi.getDoctorPrimaryRequests(),
      ]);
      if (aptsRes.status === 'fulfilled') {
        setAppointments(aptsRes.value.data || []);
      }
      if (reqsRes.status === 'fulfilled') {
        setPrimaryRequests(reqsRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    loadDoctorData();
  }, [fetchDashboard, loadDoctorData]);

  // Greeting based on time of day
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Formatted current date string: "Tuesday, 21 September 2026"
  const formattedTodayDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  // Filter appointments for Today vs Upcoming
  const { todayAppointments, upcomingAppointments, uniquePatients } = useMemo(() => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    const query = searchQuery.trim().toLowerCase();

    const filtered = appointments.filter((apt) => {
      if (!query) return true;
      return (
        (apt.patientName || '').toLowerCase().includes(query) ||
        (apt.patientEmail || '').toLowerCase().includes(query) ||
        (apt.reason || '').toLowerCase().includes(query) ||
        (apt.timeSlot || '').toLowerCase().includes(query)
      );
    });

    const todayList: Appointment[] = [];
    const upcomingList: Appointment[] = [];
    const patientMap = new Map<string, { id: string; name: string; email?: string; phone?: string; pregnancyWeek?: number; lastAppointmentDate?: string; appointmentCount: number }>();

    filtered.forEach((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      if (aptDate >= todayMidnight && aptDate < tomorrowMidnight) {
        todayList.push(apt);
      } else if (aptDate >= tomorrowMidnight && apt.status === 'scheduled') {
        upcomingList.push(apt);
      }

      // Track distinct patients
      if (apt.patientId) {
        const existing = patientMap.get(apt.patientId);
        if (existing) {
          existing.appointmentCount += 1;
        } else {
          patientMap.set(apt.patientId, {
            id: apt.patientId,
            name: apt.patientName || 'Patient',
            email: apt.patientEmail,
            phone: apt.patientPhone,
            pregnancyWeek: apt.patientPregnancyWeek,
            lastAppointmentDate: apt.appointmentDate,
            appointmentCount: 1,
          });
        }
      }
    });

    return {
      todayAppointments: todayList,
      upcomingAppointments: upcomingList,
      uniquePatients: Array.from(patientMap.values()),
    };
  }, [appointments, searchQuery]);

  const scheduledAppointmentsCount = useMemo(() => {
    return appointments.filter((a) => a.status === 'scheduled').length;
  }, [appointments]);

  // Complete consultation handler
  const handleSaveConsultation = async (
    appointmentId: string,
    notes: string,
    prescriptionText: string
  ) => {
    const res = await doctorApi.completeAppointment(appointmentId, {
      consultationNotes: notes.trim() || undefined,
      prescription: prescriptionText.trim() || undefined,
    });

    if (res.success) {
      setFeedbackMessage('Consultation record updated and marked as completed!');
      loadDoctorData();
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  // Cancel appointment handler
  const handleCancelSubmit = async () => {
    if (!cancelingAppointment) return;
    setIsCanceling(true);
    try {
      await doctorApi.cancelAppointment(cancelingAppointment.id, {
        cancelReason: cancelReason.trim() || undefined,
      });
      setFeedbackMessage('Appointment cancelled.');
      setCancelingAppointment(null);
      setCancelReason('');
      loadDoctorData();
      setTimeout(() => setFeedbackMessage(null), 5000);
    } catch (err) {
      console.error('Cancel appointment error:', err);
    } finally {
      setIsCanceling(false);
    }
  };

  // Accept/Decline Primary Doctor Request
  const handlePrimaryResponse = async (
    requestId: string,
    action: 'accept' | 'decline',
    reason?: string
  ) => {
    try {
      const res = await doctorApi.respondToPrimaryRequest(requestId, {
        action,
        reason: reason?.trim() || undefined,
      });
      if (res.success) {
        setFeedbackMessage(
          action === 'accept'
            ? 'Primary doctor request accepted!'
            : 'Primary doctor request declined.'
        );
        setDecliningRequestId(null);
        setDeclineReason('');
        loadDoctorData();
        setTimeout(() => setFeedbackMessage(null), 5000);
      }
    } catch (err) {
      console.error('Primary doctor response error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-200">
      {/* ── Left Sidebar ───────────────────────────────────── */}
      <DoctorSidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onClose={() => setIsSidebarOpen(false)}
        dashboard={dashboard}
        onLogout={logout}
      />

      {/* ── Main Layout Wrapper (shifted right on desktop) ─── */}
      <div className="lg:pl-64 flex flex-col min-h-screen justify-between">
        {/* Top Navbar */}
        <DoctorNavbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationCount={primaryRequests.length}
          onOpenNotifications={() => setActiveTab('dashboard')}
          dashboard={dashboard}
          onLogout={logout}
        />

        {/* Main Workspace Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 w-full flex-1 space-y-7">
          {/* Feedback Banner */}
          {feedbackMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between shadow-2xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>{feedbackMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ── 1. Page Header (Greeting + Date) ──────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-primary)]/70 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                {greetingText}, Dr. {dashboard?.name || 'Practitioner'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                Here's an overview of your appointments, patients and important updates.
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-bold text-[var(--text-secondary)] self-start sm:self-auto shadow-2xs flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">📅</span>
              <span>{formattedTodayDate}</span>
            </div>
          </div>

          {/* ── 2. Summary Stats Row ──────────────────────────── */}
          <DoctorSummaryStats
            todayAppointmentsCount={todayAppointments.length}
            totalPatientsCount={uniquePatients.length}
            pendingConsultationsCount={scheduledAppointmentsCount}
            primaryRequestsCount={primaryRequests.length}
            loading={loadingData}
          />

          {/* ── 3. Quick Actions Bar ──────────────────────────── */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] p-3.5 shadow-2xs flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider px-2 shrink-0">
              Quick Actions:
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('appointments')}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] hover:border-emerald-400 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] transition cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>📅</span> All Appointments
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('patients')}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] hover:border-emerald-400 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] transition cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>👥</span> Patient Records
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] hover:border-emerald-400 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] transition cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>🕒</span> Clinic Hours
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-primary)] hover:border-emerald-400 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] transition cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <span>🚨</span> Patient Inquiries & Reports
            </button>
          </div>

          {/* ── 4. Main Multi-Column Content Area ─────────────── */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* Left Column: Today's Appointments & Upcoming (col-span-8) */}
              <div className="lg:col-span-8 space-y-7">
                {/* Today's Appointments Card */}
                <DoctorTodaysAppointments
                  appointments={todayAppointments}
                  loading={loadingData}
                  onOpenCompleteModal={(apt) => setActiveCompletingAppointment(apt)}
                  onCancelAppointment={(apt) => setCancelingAppointment(apt)}
                  onViewAll={() => setActiveTab('appointments')}
                />

                {/* Upcoming Appointments Card */}
                <DoctorUpcomingAppointments
                  appointments={upcomingAppointments}
                  loading={loadingData}
                  onOpenCompleteModal={(apt) => setActiveCompletingAppointment(apt)}
                  onCancelAppointment={(apt) => setCancelingAppointment(apt)}
                  onViewAll={() => setActiveTab('appointments')}
                />
              </div>

              {/* Right Column: Alerts, Primary Requests & Schedule (col-span-4) */}
              <div className="lg:col-span-4 space-y-7">
                <DoctorAlertsPanel
                  primaryRequests={primaryRequests}
                  dashboard={dashboard}
                  loading={loadingData}
                  onAcceptPrimaryRequest={(reqId) => handlePrimaryResponse(reqId, 'accept')}
                  onDeclinePrimaryRequest={(reqId) => setDecliningRequestId(reqId)}
                  onRefreshRequests={loadDoctorData}
                />
              </div>
            </div>
          )}

          {/* ── Tab 2: All Appointments ───────────────────────── */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
                  <span>📅</span> All Doctor Consultations ({appointments.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  ← Back to Dashboard
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="p-10 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-center text-xs text-[var(--text-secondary)]">
                  No consultation records found.
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-[var(--text-primary)]">
                            {apt.patientName || 'Patient'}
                          </h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              apt.status === 'scheduled'
                                ? 'bg-emerald-100 text-emerald-700'
                                : apt.status === 'completed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {apt.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          📅 {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.timeSlot}
                          {apt.patientPregnancyWeek !== undefined ? ` • 🤰 Week ${apt.patientPregnancyWeek}` : ''}
                        </p>
                        {apt.reason && (
                          <p className="text-xs text-[var(--text-muted)]">
                            Reason: {apt.reason}
                          </p>
                        )}
                        {apt.consultationNotes && (
                          <div className="text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] p-2 rounded-xl mt-1">
                            <strong>Notes:</strong> {apt.consultationNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => setActiveCompletingAppointment(apt)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                        >
                          {apt.status === 'completed' ? 'Edit Record' : 'Complete Record'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tab 3: Patients Directory ─────────────────────── */}
          {activeTab === 'patients' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
                  <span>👥</span> Patient Directory ({uniquePatients.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  ← Back to Dashboard
                </button>
              </div>

              {uniquePatients.length === 0 ? (
                <div className="p-10 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-center text-xs text-[var(--text-secondary)]">
                  No patients under your care yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniquePatients.map((pat) => (
                    <div
                      key={pat.id}
                      className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xs space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-base flex items-center justify-center">
                          {pat.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-[var(--text-primary)] truncate">
                            {pat.name}
                          </h4>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {pat.email || 'No email'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Pregnancy Stage:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {pat.pregnancyWeek !== undefined ? `Week ${pat.pregnancyWeek}` : 'Cycle Planning'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Total Consultations:</span>
                          <span className="font-bold text-[var(--text-primary)]">{pat.appointmentCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tab 4: Reports & Inquiries ────────────────────── */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
                  <span>🚨</span> Reports & Governance Inquiries
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Clinical Governance & Quality Support</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  PregnaCare adheres to strict clinical excellence standards. Any administrative reviews or patient care feedback handled by governance will be communicated directly to your verified email address.
                </p>
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                  ✓ Your practitioner standing is: <strong>Active & Verified</strong>. No outstanding clinical actions.
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 5: Profile & Settings ─────────────────────── */}
          {(activeTab === 'profile' || activeTab === 'settings' || activeTab === 'records' || activeTab === 'messages' || activeTab === 'help') && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[var(--text-primary)] capitalize">
                  {activeTab} Overview
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  ← Back to Dashboard
                </button>
              </div>

              {dashboard && (
                <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-primary)] p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        dashboard.imageUrl ||
                        dashboard.application.profileImage ||
                        `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=10b981`
                      }
                      alt={dashboard.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <h3 className="text-lg font-black text-[var(--text-primary)]">Dr. {dashboard.name}</h3>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{dashboard.application.specialization}</p>
                      <p className="text-xs text-[var(--text-muted)]">{dashboard.application.clinicName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)]">
                      <span className="text-[var(--text-muted)]">Qualification: </span>
                      <strong className="text-[var(--text-primary)]">{dashboard.application.qualification}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)]">
                      <span className="text-[var(--text-muted)]">Medical Reg. Number: </span>
                      <strong className="text-[var(--text-primary)]">{dashboard.application.registrationNumber}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)]">
                      <span className="text-[var(--text-muted)]">Consultation Fee: </span>
                      <strong className="text-emerald-600">${dashboard.application.consultationFee}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)]">
                      <span className="text-[var(--text-muted)]">Clinic Address: </span>
                      <strong className="text-[var(--text-primary)]">{dashboard.application.clinicAddress}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-surface)] py-4 text-center text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} PregnaCare Health • Verified Doctor Practice Portal
        </footer>
      </div>

      {/* ── Complete Consultation Modal ────────────────────── */}
      {activeCompletingAppointment && (
        <DoctorCompleteConsultationModal
          appointment={activeCompletingAppointment}
          onClose={() => setActiveCompletingAppointment(null)}
          onSubmit={handleSaveConsultation}
        />
      )}

      {/* ── Cancel Appointment Modal ───────────────────────── */}
      {cancelingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[var(--text-primary)]">
              Cancel Appointment with {cancelingAppointment.patientName || 'Patient'}?
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Slot: <strong>{cancelingAppointment.timeSlot}</strong> on{' '}
              {new Date(cancelingAppointment.appointmentDate).toLocaleDateString()}
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (e.g., Emergency surgery, clinic reschedule)..."
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-rose-500 placeholder:text-[var(--text-muted)]"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCancelingAppointment(null)}
                disabled={isCanceling}
                className="flex-1 py-2 rounded-xl border border-[var(--border-primary)] text-xs font-bold text-[var(--text-secondary)] cursor-pointer"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={handleCancelSubmit}
                disabled={isCanceling}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {isCanceling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Decline Primary Doctor Request Modal ───────────── */}
      {decliningRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[var(--text-primary)]">
              Decline Primary Doctor Request?
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Optionally provide a reason (e.g., patient capacity full, out of service area):
            </p>
            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for declining..."
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-rose-500 placeholder:text-[var(--text-muted)]"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDecliningRequestId(null)}
                className="flex-1 py-2 rounded-xl border border-[var(--border-primary)] text-xs font-bold text-[var(--text-secondary)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePrimaryResponse(decliningRequestId, 'decline', declineReason)
                }
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;