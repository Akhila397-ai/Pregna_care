import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '@/features/doctor/api/doctor.api';
import {
  VerifiedDoctor,
  PatientPrimaryDoctorStatus,
  Appointment,
} from '@/features/doctor/types/doctor.types';
import { BookAppointmentModal } from './BookAppointmentModal';
import { DoctorProfileModal } from './DoctorProfileModal';

interface DoctorDiscoveryCardProps {
  primaryDoctorStatus?: PatientPrimaryDoctorStatus | null;
  onRefreshPrimaryDoctor?: () => void;
  onViewAppointments?: () => void;
}

export const DoctorDiscoveryCard: React.FC<DoctorDiscoveryCardProps> = ({
  primaryDoctorStatus,
  onRefreshPrimaryDoctor,
  onViewAppointments,
}) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<VerifiedDoctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedProfileDoctor, setSelectedProfileDoctor] = useState<VerifiedDoctor | null>(null);
  const [selectedBookingDoctor, setSelectedBookingDoctor] = useState<VerifiedDoctor | null>(null);
  const [justBookedAppointment, setJustBookedAppointment] = useState<Appointment | null>(null);

  const fetchVerifiedDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await doctorApi.getVerifiedDoctors();
      setDoctors(response.doctors || []);
    } catch (err: unknown) {
      console.error('Failed to fetch verified doctors:', err);
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data
          ?.message ||
        'Unable to load doctors at this time. Please check your connection and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifiedDoctors();
  }, [fetchVerifiedDoctors]);

  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors;
    const query = searchQuery.toLowerCase();
    return doctors.filter(
      (d) =>
        (d.fullName || d.name || '').toLowerCase().includes(query) ||
        (d.specialization || '').toLowerCase().includes(query) ||
        (d.clinicName || '').toLowerCase().includes(query)
    );
  }, [doctors, searchQuery]);

  const formatAvailability = (availability?: VerifiedDoctor['availability']) => {
    if (!availability || !availability.days || availability.days.length === 0) {
      return 'Available by scheduled appointment';
    }
    const daysStr = availability.days.join(', ');
    const timeStr =
      availability.startTime && availability.endTime
        ? ` • ${availability.startTime} – ${availability.endTime}`
        : '';
    return `${daysStr}${timeStr}`;
  };

  const handleBookingSuccess = (apt: Appointment) => {
    setSelectedBookingDoctor(null);
    setJustBookedAppointment(apt);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1">
            👩‍⚕️ Find a Doctor
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Connect with verified healthcare professionals, explore clinic profiles, and book consultations.
          </p>
        </div>

        {/* Refresh Action */}
        {!loading && (
          <button
            type="button"
            onClick={fetchVerifiedDoctors}
            className="px-3.5 py-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-emerald-400 text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer self-start sm:self-auto shadow-xs flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* ── Search & Filter Bar ──────────────────────────── */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doctor by name, specialization, or clinic..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs transition placeholder:text-[var(--text-muted)]"
        />
        <span className="absolute left-3.5 top-3 text-sm text-[var(--text-muted)]">🔍</span>
      </div>

      {/* ── Loading State ───────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-muted)] shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[var(--bg-muted)] rounded-md w-3/4" />
                  <div className="h-3 bg-[var(--bg-muted)] rounded-md w-1/2" />
                  <div className="h-3 bg-[var(--bg-muted)] rounded-md w-2/3" />
                </div>
              </div>
              <div className="h-9 bg-[var(--bg-muted)] rounded-xl w-full" />
              <div className="h-10 bg-[var(--bg-muted)] rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* ── Error State ─────────────────────────────────── */}
      {!loading && error && (
        <div className="p-6 rounded-3xl bg-rose-50/80 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/70 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl mx-auto">
            ⚠️
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Failed to Load Doctors
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchVerifiedDoctors}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Empty State ─────────────────────────────────── */}
      {!loading && !error && filteredDoctors.length === 0 && (
        <div className="p-10 rounded-3xl bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-primary)] text-center space-y-4 max-w-lg mx-auto my-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🩺
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[var(--text-primary)]">
              {searchQuery ? 'No matching doctors found' : 'No doctors available yet'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {searchQuery
                ? 'Try searching with different keywords.'
                : 'Verified doctors will appear here once they are available.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Doctors Grid ─────────────────────────────────── */}
      {!loading && !error && filteredDoctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDoctors.map((doc) => {
            const isCurrentPrimary =
              primaryDoctorStatus?.primaryDoctor?.userId === doc.userId ||
              primaryDoctorStatus?.primaryDoctor?.id === doc.id;
            const isPendingPrimary =
              primaryDoctorStatus?.pendingDoctor?.userId === doc.userId ||
              primaryDoctorStatus?.pendingDoctor?.id === doc.id;

            return (
              <div
                key={doc.id}
                className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Info Row */}
                  <div className="flex items-start gap-4 mb-4">
                    {doc.profileImage ? (
                      <img
                        src={doc.profileImage}
                        alt={doc.fullName || doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-[var(--border-primary)] shadow-xs shrink-0 cursor-pointer"
                        onClick={() => setSelectedProfileDoctor(doc)}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        onClick={() => setSelectedProfileDoctor(doc)}
                        className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-black text-xl flex items-center justify-center border border-[var(--border-primary)] shadow-inner shrink-0 cursor-pointer"
                      >
                        {(doc.fullName || doc.name || 'D').charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          onClick={() => setSelectedProfileDoctor(doc)}
                          className="text-base font-black text-[var(--text-primary)] truncate hover:text-emerald-600 transition cursor-pointer"
                        >
                          {doc.fullName || doc.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800 shrink-0">
                          ✓ Verified
                        </span>
                      </div>

                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">
                        {doc.specialization}
                      </p>

                      {doc.qualification && (
                        <p className="text-[11px] text-[var(--text-muted)] truncate">
                          {doc.qualification}
                        </p>
                      )}

                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {doc.clinicName && <span>{doc.clinicName} • </span>}
                        {doc.experience} yrs exp •{' '}
                        <span className="font-bold text-[var(--text-primary)]">
                          ${doc.consultationFee}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Primary doctor status tags */}
                  {isCurrentPrimary && (
                    <div className="mb-3 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                      <span>★</span>
                      <span>Your Primary Doctor</span>
                    </div>
                  )}

                  {isPendingPrimary && (
                    <div className="mb-3 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1.5">
                      <span>⏳</span>
                      <span>Primary Doctor Request Pending</span>
                    </div>
                  )}

                  {/* Clinic Address & Availability */}
                  {doc.clinicAddress && (
                    <p className="text-[11px] text-[var(--text-muted)] mb-2.5 truncate flex items-center gap-1">
                      <span>📍</span>
                      <span>{doc.clinicAddress}</span>
                    </p>
                  )}

                  <div className="p-2.5 rounded-xl bg-[var(--bg-muted)]/50 text-xs text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                    <span>🕒</span>
                    <span className="truncate">{formatAvailability(doc.availability)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProfileDoctor(doc)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBookingDoctor(doc)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>📅</span>
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Doctor Profile Modal ──────────────────────────── */}
      {selectedProfileDoctor && (
        <DoctorProfileModal
          doctor={selectedProfileDoctor}
          isCurrentPrimary={
            primaryDoctorStatus?.primaryDoctor?.userId === selectedProfileDoctor.userId ||
            primaryDoctorStatus?.primaryDoctor?.id === selectedProfileDoctor.id
          }
          isPendingPrimary={
            primaryDoctorStatus?.pendingDoctor?.userId === selectedProfileDoctor.userId ||
            primaryDoctorStatus?.pendingDoctor?.id === selectedProfileDoctor.id
          }
          onClose={() => setSelectedProfileDoctor(null)}
          onBookAppointment={(doc) => {
            setSelectedProfileDoctor(null);
            setSelectedBookingDoctor(doc);
          }}
          onPrimaryDoctorRequested={() => {
            setSelectedProfileDoctor(null);
            onRefreshPrimaryDoctor?.();
          }}
        />
      )}

      {/* ── Book Appointment Modal ───────────────────────── */}
      {selectedBookingDoctor && (
        <BookAppointmentModal
          doctor={selectedBookingDoctor}
          onClose={() => setSelectedBookingDoctor(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* ── Booking Success Confirmation Dialog ──────────── */}
      {justBookedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              ✅
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Appointment Booked Successfully!
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Your consultation with <strong>{justBookedAppointment.doctorName}</strong> is scheduled for{' '}
                <strong>
                  {new Date(justBookedAppointment.appointmentDate).toLocaleDateString()} at{' '}
                  {justBookedAppointment.timeSlot}
                </strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJustBookedAppointment(null)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-secondary)] transition cursor-pointer"
              >
                Close
              </button>
              {onViewAppointments && (
                <button
                  type="button"
                  onClick={() => {
                    setJustBookedAppointment(null);
                    onViewAppointments();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  View Appointments
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
