import React, { useState, useEffect, useCallback } from 'react';
import { Appointment, PatientPrimaryDoctorStatus } from '@/features/doctor/types/doctor.types';
import { doctorApi } from '@/features/doctor/api/doctor.api';
import { ReportIssueModal } from './ReportIssueModal';

interface PatientAppointmentsViewProps {
  primaryDoctorStatus?: PatientPrimaryDoctorStatus | null;
  onFindDoctor: () => void;
  onRefreshPrimaryDoctor: () => void;
}

export const PatientAppointmentsView: React.FC<PatientAppointmentsViewProps> = ({
  primaryDoctorStatus,
  onFindDoctor,
  onRefreshPrimaryDoctor,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  // Cancel Appointment state
  const [cancelingAppointment, setCancelingAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isCanceling, setIsCanceling] = useState<boolean>(false);

  // Reporting State
  const [reportingAppointment, setReportingAppointment] = useState<Appointment | null>(null);
  const [reportSuccessMessage, setReportSuccessMessage] = useState<string | null>(null);

  // Requesting Primary Doctor state
  const [requestingDoctorId, setRequestingDoctorId] = useState<string | null>(null);
  const [primarySuccessMessage, setPrimarySuccessMessage] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await doctorApi.getPatientAppointments();
      setAppointments(res.data || []);
    } catch (err: unknown) {
      console.error('Fetch appointments error:', err);
      setError('Unable to load appointments. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelSubmit = async () => {
    if (!cancelingAppointment) return;
    setIsCanceling(true);
    try {
      await doctorApi.cancelAppointment(cancelingAppointment.id, {
        cancelReason: cancelReason.trim() || undefined,
      });
      setCancelingAppointment(null);
      setCancelReason('');
      fetchAppointments();
    } catch (err) {
      console.error('Cancel appointment error:', err);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleMakePrimaryDoctor = async (doctorId: string, doctorName: string) => {
    setRequestingDoctorId(doctorId);
    try {
      const res = await doctorApi.requestPrimaryDoctor(doctorId);
      if (res.success) {
        setPrimarySuccessMessage(`Primary doctor request sent to ${doctorName}!`);
        onRefreshPrimaryDoctor();
        setTimeout(() => setPrimarySuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Request primary doctor error:', err);
    } finally {
      setRequestingDoctorId(null);
    }
  };

  const upcomingList = appointments.filter((a) => a.status === 'scheduled');
  const pastList = appointments.filter((a) => a.status !== 'scheduled');

  const displayedList = tab === 'upcoming' ? upcomingList : pastList;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            📅 My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Manage your doctor consultations, visit records, and prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAppointments}
            className="px-3.5 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-emerald-400 text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
          >
            🔄 Refresh
          </button>
          <button
            type="button"
            onClick={onFindDoctor}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1"
          >
            <span>+</span>
            <span>Book New</span>
          </button>
        </div>
      </div>

      {/* Primary Success Banner */}
      {primarySuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between animate-in fade-in">
          <span>🌟 {primarySuccessMessage}</span>
          <button
            type="button"
            onClick={() => setPrimarySuccessMessage(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Report Success Banner */}
      {reportSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between animate-in fade-in">
          <span>✅ {reportSuccessMessage}</span>
          <button
            type="button"
            onClick={() => setReportSuccessMessage(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[var(--border-primary)] pb-1">
        <button
          type="button"
          onClick={() => setTab('upcoming')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            tab === 'upcoming'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
          }`}
        >
          Upcoming Consultations ({upcomingList.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('past')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
            tab === 'past'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
          }`}
        >
          Past & Completed ({pastList.length})
        </button>
      </div>

      {/* ── Loading ─────────────────────────────────────── */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-3"
            >
              <div className="h-5 bg-[var(--bg-muted)] rounded-md w-1/4" />
              <div className="h-4 bg-[var(--bg-muted)] rounded-md w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* ── Error ───────────────────────────────────────── */}
      {!loading && error && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-center space-y-3">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">{error}</p>
          <button
            type="button"
            onClick={fetchAppointments}
            className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────── */}
      {!loading && !error && displayedList.length === 0 && (
        <div className="p-10 rounded-3xl bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-primary)] text-center space-y-4 max-w-md mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
            🩺
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[var(--text-primary)]">
              {tab === 'upcoming' ? 'No Upcoming Consultations' : 'No Past Consultations'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {tab === 'upcoming'
                ? 'You do not have any scheduled doctor appointments at the moment.'
                : 'Your past consultations, clinical notes, and prescriptions will show up here.'}
            </p>
          </div>
          {tab === 'upcoming' && (
            <button
              type="button"
              onClick={onFindDoctor}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Browse Doctors & Book
            </button>
          )}
        </div>
      )}

      {/* ── Appointments List ────────────────────────────── */}
      {!loading && !error && displayedList.length > 0 && (
        <div className="space-y-5">
          {displayedList.map((apt) => {
            const isDoctorPrimary =
              primaryDoctorStatus?.primaryDoctor?.userId === apt.doctorId ||
              primaryDoctorStatus?.primaryDoctor?.id === apt.doctorId;

            return (
              <div
                key={apt.id}
                className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Top Row: Doctor Info + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {apt.doctorProfileImage ? (
                      <img
                        src={apt.doctorProfileImage}
                        alt={apt.doctorName || 'Doctor'}
                        className="w-12 h-12 rounded-2xl object-cover border border-[var(--border-primary)]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black text-lg flex items-center justify-center border border-[var(--border-primary)]">
                        {(apt.doctorName || 'D').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-black text-[var(--text-primary)]">
                        {apt.doctorName || 'Doctor'}
                      </h3>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {apt.doctorSpecialization}
                        {apt.doctorClinicName ? ` • ${apt.doctorClinicName}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {apt.status === 'scheduled' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-800">
                        ● Scheduled
                      </span>
                    )}
                    {apt.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-black border border-blue-300 dark:border-blue-800">
                        ✓ Completed
                      </span>
                    )}
                    {apt.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-black border border-rose-300 dark:border-rose-800">
                        ✕ Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Timing Row */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <div>
                      <span className="text-[var(--text-muted)]">Date: </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {formatDate(apt.appointmentDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🕒</span>
                    <div>
                      <span className="text-[var(--text-muted)]">Time Slot: </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {apt.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {apt.reason && (
                  <div className="text-xs">
                    <span className="font-bold text-[var(--text-primary)]">Visit Reason: </span>
                    <span className="text-[var(--text-secondary)]">{apt.reason}</span>
                  </div>
                )}

                {/* Cancellation Note */}
                {apt.status === 'cancelled' && apt.cancelReason && (
                  <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300">
                    <strong>Cancellation Reason:</strong> {apt.cancelReason}
                  </div>
                )}

                {/* Consultation Details if Completed */}
                {apt.status === 'completed' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-3">
                    <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-200 uppercase tracking-wider">
                      Consultation Summary & Notes
                    </h4>
                    {apt.consultationNotes ? (
                      <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-primary)]">
                        {apt.consultationNotes}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] italic">
                        No additional notes entered by doctor.
                      </p>
                    )}

                    {apt.prescription && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          💊 Prescription / Advice:
                        </span>
                        <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-primary)]">
                          {apt.prescription}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Post-Consultation Primary Doctor Recommendation */}
                {apt.status === 'completed' && !isDoctorPrimary && (
                  <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/10 via-[var(--bg-card)] to-teal-500/10 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">
                        👩‍⚕️ Make {apt.doctorName || 'this doctor'} your Primary Doctor?
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        If you loved your consultation, you can set them as your main doctor for continuous care.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleMakePrimaryDoctor(apt.doctorId, apt.doctorName || 'Doctor')
                      }
                      disabled={requestingDoctorId === apt.doctorId}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {requestingDoctorId === apt.doctorId
                        ? 'Sending...'
                        : 'Make Primary Doctor'}
                    </button>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border-primary)]">
                  {/* Report Doctor button */}
                  <button
                    type="button"
                    onClick={() => setReportingAppointment(apt)}
                    className="text-xs text-rose-500 hover:text-rose-600 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>🚨</span>
                    <span>Report an Issue</span>
                  </button>

                  {/* Cancel action for scheduled appointments */}
                  {apt.status === 'scheduled' && (
                    <button
                      type="button"
                      onClick={() => setCancelingAppointment(apt)}
                      className="text-xs text-[var(--text-muted)] hover:text-rose-500 font-bold transition cursor-pointer"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {cancelingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[var(--text-primary)]">
              Cancel Appointment with {cancelingAppointment.doctorName}?
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Please let us know the reason for canceling this consultation:
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict, feeling better..."
              className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-rose-500 placeholder:text-[var(--text-muted)]"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelingAppointment(null)}
                disabled={isCanceling}
                className="flex-1 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-secondary)] cursor-pointer"
              >
                Keep Appointment
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

      {/* Report Issue Modal */}
      {reportingAppointment && (
        <ReportIssueModal
          doctorId={reportingAppointment.doctorId}
          doctorName={reportingAppointment.doctorName || 'Doctor'}
          appointment={reportingAppointment}
          onClose={() => setReportingAppointment(null)}
          onSuccess={() => {
            setReportingAppointment(null);
            setReportSuccessMessage(
              'Your report has been submitted confidentially to administration for review.'
            );
            setTimeout(() => setReportSuccessMessage(null), 6000);
          }}
        />
      )}
    </div>
  );
};
