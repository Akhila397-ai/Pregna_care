import React from 'react';
import { PrimaryDoctorRelationship, DoctorDashboardResponse } from '../types/doctor.types';

interface DoctorAlertsPanelProps {
  primaryRequests: PrimaryDoctorRelationship[];
  dashboard: DoctorDashboardResponse | null;
  loading?: boolean;
  onAcceptPrimaryRequest: (requestId: string) => void;
  onDeclinePrimaryRequest: (requestId: string) => void;
  onRefreshRequests: () => void;
}

export const DoctorAlertsPanel: React.FC<DoctorAlertsPanelProps> = ({
  primaryRequests,
  dashboard,
  loading,
  onAcceptPrimaryRequest,
  onDeclinePrimaryRequest,
  onRefreshRequests,
}) => {
  return (
    <div className="space-y-6">
      {/* ── 1. Incoming Primary Doctor Requests ───────────── */}
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-primary)] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-primary)]/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👩‍⚕️</span>
            <div>
              <h3 className="text-sm font-black text-[var(--text-primary)]">
                Primary Doctor Requests
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {primaryRequests.length} pending patient requests
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefreshRequests}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] animate-pulse space-y-2">
            <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2" />
            <div className="h-3 bg-[var(--bg-muted)] rounded w-3/4" />
          </div>
        ) : primaryRequests.length === 0 ? (
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-primary)] text-center space-y-1">
            <span className="text-2xl block">🌟</span>
            <p className="text-xs font-bold text-[var(--text-primary)]">All requests up to date</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              When patients select you as their primary doctor, their requests will appear here for your confirmation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {primaryRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-amber-300 dark:border-amber-800 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {(req.patientName || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[var(--text-primary)] truncate">
                        {req.patientName || 'Patient'}
                      </h4>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">
                        {req.patientEmail} {req.patientPhone ? `• ${req.patientPhone}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold shrink-0">
                    Pending
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
                  Requested you as their continuous primary doctor on PregnaCare.
                </p>

                <div className="flex items-center gap-2 pt-1 border-t border-[var(--border-primary)]">
                  <button
                    type="button"
                    onClick={() => onAcceptPrimaryRequest(req.id)}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition cursor-pointer"
                  >
                    ✓ Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeclinePrimaryRequest(req.id)}
                    className="flex-1 py-1.5 rounded-xl border border-[var(--border-primary)] hover:bg-rose-50 hover:text-rose-600 text-[11px] font-bold text-[var(--text-secondary)] transition cursor-pointer"
                  >
                    ✕ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 2. Clinic Schedule & Availability Widget ──────── */}
      {dashboard && (
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-primary)] p-5 sm:p-6 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2 border-b border-[var(--border-primary)]/70 pb-3">
            <span className="text-lg">🕒</span>
            <div>
              <h3 className="text-sm font-black text-[var(--text-primary)]">
                Clinic Schedule
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {dashboard.application.clinicName}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Available Days:</span>
              <span className="font-bold text-[var(--text-primary)] text-right">
                {dashboard.application.availability.days.join(', ')}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Consulting Hours:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {dashboard.application.availability.startTime} – {dashboard.application.availability.endTime}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-primary)] flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Consultation Fee:</span>
              <span className="font-bold text-[var(--text-primary)]">
                ${dashboard.application.consultationFee}
              </span>
            </div>

            {dashboard.application.clinicAddress && (
              <p className="text-[11px] text-[var(--text-muted)] px-1 pt-1">
                📍 {dashboard.application.clinicAddress}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── 3. Quick System Status & Quality Care ─────────── */}
      <div className="p-5 rounded-3xl bg-linear-to-br from-emerald-500/10 via-[var(--bg-card)] to-teal-500/5 border border-emerald-300 dark:border-emerald-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <span>🛡️</span>
          <span>Verified Practitioner Portal</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Your credentials and medical license are verified with PregnaCare Clinical Governance. Need help updating your clinic hours or documents?
        </p>
        <button
          type="button"
          onClick={() => alert('For clinical credential updates, please contact administration via support@pregnacare.com')}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-block pt-1 cursor-pointer"
        >
          Contact Support →
        </button>
      </div>
    </div>
  );
};
