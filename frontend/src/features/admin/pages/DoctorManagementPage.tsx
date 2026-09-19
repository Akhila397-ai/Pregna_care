import React, { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { adminApi } from '../api/admin.api';
import { IDoctorMappedData } from '../types/admin.types';
import { Table, TableColumn } from '@/shared/components/Table';
import { AdminLayout } from '../components/AdminLayout';
import { ConfirmModal } from '../components/ConfirmModal';

export type DocumentType = 'degreeCertificate' | 'registrationCertificate' | 'governmentId';

// ── Document Viewer Modal ─────────────────────
const DocumentViewerModal: React.FC<{
  url: string;
  title: string;
  onClose: () => void;
}> = ({ url, title, onClose }) => {
  const isPDF =
    url.includes('.pdf') || url.includes('degrees') || url.includes('reg-certs');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-primary)] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)] bg-[var(--bg-muted)]/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] text-sm leading-tight">{title}</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Doctor Credential Verification</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs"
            >
              <span>Open in Tab</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden p-4 min-h-0 bg-[var(--bg-muted)]/20">
          {isPDF ? (
            <iframe
              src={url}
              className="w-full h-[70vh] rounded-xl border border-[var(--border-primary)] shadow-inner"
              title={title}
            />
          ) : (
            <div className="flex items-center justify-center h-[70vh] bg-[var(--bg-muted)]/40 rounded-xl border border-[var(--border-primary)] overflow-auto p-2">
              <img
                src={url}
                alt={title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DocButtonProps {
  doctorId: string;
  docType: DocumentType;
  label: string;
  icon: string;
  exists: boolean;
  docLoading: string | null;
  onView: (doctorId: string, docType: DocumentType, label: string) => void;
}

const DocButton: React.FC<DocButtonProps> = ({
  doctorId,
  docType,
  label,
  icon,
  exists,
  docLoading,
  onView,
}) => (
  <button
    onClick={() => exists && onView(doctorId, docType, label)}
    disabled={!exists || docLoading === docType}
    title={exists ? `View ${label}` : `${label} not uploaded`}
    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition font-medium whitespace-nowrap border ${
      !exists
        ? 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-transparent cursor-not-allowed opacity-60'
        : docLoading === docType
        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 cursor-wait'
        : 'bg-[var(--bg-card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-300 border-[var(--border-primary)] hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer shadow-2xs'
    }`}
  >
    {docLoading === docType ? (
      <svg className="animate-spin w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    ) : (
      <span className="text-xs">{icon}</span>
    )}
    <span>{label.split(' ')[0]}</span>
    {exists && docLoading !== docType && (
      <svg className="w-3 h-3 text-[var(--text-muted)] group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    )}
  </button>
);

// ── Main Page ─────────────────────────────────
const DoctorManagementPage = () => {
  const {
    doctors,
    totalDoctors,
    doctorPages,
    loading,
    error,
    getDoctors,
    verifyDoctor,
    blockDoctor,
    unblockDoctor,
    deleteDoctor,
  } = useAdmin();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctorMappedData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'block' | 'unblock' | 'delete' | 'approve';
    doctor: IDoctorMappedData | null;
  }>({
    isOpen: false,
    type: 'block',
    doctor: null,
  });

  // Document viewer state
  const [docModal, setDocModal] = useState<{ url: string; title: string } | null>(null);
  const [docLoading, setDocLoading] = useState<string | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  const limit = 10;

  useEffect(() => {
    getDoctors(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleViewDocument = async (
    doctorId: string,
    documentType: DocumentType,
    title: string
  ) => {
    setDocLoading(documentType);
    setDocError(null);
    try {
      const result = await adminApi.getDocumentUrl(doctorId, documentType);
      setDocModal({ url: result.url, title });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setDocError(e.response?.data?.error || 'Failed to load document.');
    } finally {
      setDocLoading(null);
    }
  };

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        (d.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (d.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (d.specialization?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (d.clinicName?.toLowerCase() || '').includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      return true;
    });
  }, [doctors, search, statusFilter]);

  const handleConfirmAction = async () => {
    if (!confirmModal.doctor) return;
    const docId = confirmModal.doctor._id;

    if (confirmModal.type === 'approve') {
      await verifyDoctor(docId, 'approve');
    } else if (confirmModal.type === 'block') {
      await blockDoctor(docId);
    } else if (confirmModal.type === 'unblock') {
      await unblockDoctor(docId);
    } else if (confirmModal.type === 'delete') {
      await deleteDoctor(docId);
    }

    setConfirmModal({ isOpen: false, type: 'block', doctor: null });
    getDoctors(page, limit);
  };

  const statusBadge = (status: string) =>
    ({
      pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60',
      under_review: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60',
      approved: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60',
      rejected: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60',
      more_documents_required: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/60 dark:border-orange-800/60',
    }[status] ?? 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border-primary)]');

  const statusLabel = (status: string) =>
    ({
      pending: 'Pending',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      more_documents_required: 'More Docs Needed',
    }[status] ?? status);

  const columns: TableColumn<IDoctorMappedData>[] = useMemo(
    () => [
      {
        key: 'doctor',
        header: 'Doctor Info',
        render: (doctor) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-muted)] border border-[var(--border-primary)]">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.fullName || doctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)] font-bold text-xs">
                  {(doctor.fullName || doctor.name)?.charAt(0).toUpperCase() || 'D'}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                {doctor.fullName || doctor.name}
              </p>
              <p className="text-xs text-[var(--text-muted)] leading-tight mt-0.5">{doctor.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'specialization',
        header: 'Specialization & Exp',
        render: (doctor) => (
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-primary)]">
              {doctor.specialization}
            </span>
            <span className="block text-[11px] text-[var(--text-muted)] mt-1">
              {doctor.experience} yrs exp • {doctor.qualification}
            </span>
          </div>
        ),
      },
      {
        key: 'fee',
        header: 'Clinic & Fee',
        render: (doctor) => (
          <div>
            <span className="text-xs font-semibold text-[var(--text-primary)] block truncate max-w-[140px]">
              {doctor.clinicName}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
              ${doctor.consultationFee} / consult
            </span>
          </div>
        ),
      },
      {
        key: 'documents',
        header: 'Documents',
        render: (doctor) => (
          <div className="flex flex-col gap-1">
            <DocButton
              doctorId={doctor._id}
              docType="degreeCertificate"
              label="Degree Certificate"
              icon="🎓"
              exists={doctor.hasDegreeCertificate}
              docLoading={docLoading}
              onView={handleViewDocument}
            />
            <DocButton
              doctorId={doctor._id}
              docType="registrationCertificate"
              label="Registration License"
              icon="📋"
              exists={doctor.hasRegistrationCertificate}
              docLoading={docLoading}
              onView={handleViewDocument}
            />
            <DocButton
              doctorId={doctor._id}
              docType="governmentId"
              label="Government ID"
              icon="🪪"
              exists={doctor.hasGovernmentId}
              docLoading={docLoading}
              onView={handleViewDocument}
            />
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Approval Status',
        render: (doctor) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(
              doctor.status
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
            {statusLabel(doctor.status)}
          </span>
        ),
      },
      {
        key: 'isBlocked',
        header: 'Access',
        render: (doctor) => (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
              doctor.isBlocked
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
            }`}
          >
            {doctor.isBlocked ? 'Blocked' : 'Active'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        headerClassName: 'text-right',
        className: 'text-right',
        render: (doctor) => (
          <div className="flex items-center justify-end gap-1.5">
            {doctor.status === 'pending' && (
              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: 'approve',
                    doctor,
                  })
                }
                title="Approve Doctor"
                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition border border-emerald-200 dark:border-emerald-800"
                aria-label="Approve Doctor"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}

            {doctor.status !== 'rejected' && (
              <button
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setRejectModal(true);
                }}
                title="Reject Application"
                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition border border-rose-200 dark:border-rose-800"
                aria-label="Reject Application"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {doctor.isBlocked ? (
              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: 'unblock',
                    doctor,
                  })
                }
                title="Unblock Doctor"
                className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition border border-[var(--border-primary)]"
                aria-label="Unblock Doctor"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: 'block',
                    doctor,
                  })
                }
                title="Block Doctor"
                className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition border border-[var(--border-primary)]"
                aria-label="Block Doctor"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            )}

            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  type: 'delete',
                  doctor,
                })
              }
              title="Delete Doctor"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border border-[var(--border-primary)]"
              aria-label="Delete Doctor"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ),
      },
    ],
    [docLoading]
  );

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                Doctor Management
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-primary)]">
                {totalDoctors} applications
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Verify medical credentials, review licenses, and authorize practitioner accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-4 mb-6 border border-[var(--border-primary)] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-muted)] rounded-xl w-full lg:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'under_review', label: 'Under Review' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search name, email, specialty, clinic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-muted)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-emerald-500 focus:bg-[var(--bg-card)] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Error Banners */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {docError && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{docError}</span>
          </div>
          <button onClick={() => setDocError(null)} className="text-rose-500 hover:text-rose-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Doctor Management Table */}
      <Table<IDoctorMappedData>
        columns={columns}
        data={filtered}
        loading={loading}
        keyExtractor={(doctor) => doctor._id}
        emptyMessage="No doctor applications found."
        pagination={{
          currentPage: page,
          totalPages: doctorPages,
          onPageChange: setPage,
          totalItems: totalDoctors,
        }}
      />

      {/* Rejection Reason Modal */}
      {rejectModal && selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 w-full max-w-md shadow-xl border border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                ✕
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Reject Application</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Doctor: {selectedDoctor.fullName || selectedDoctor.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
              Please enter the justification for rejecting this medical application. The doctor will receive this feedback:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Medical registration certificate could not be verified with the council registry..."
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-muted)] text-xs text-[var(--text-primary)] outline-none focus:border-rose-500 focus:bg-[var(--bg-card)] resize-none mb-4 transition"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectModal(false);
                  setRejectionReason('');
                  setSelectedDoctor(null);
                }}
                className="px-4 py-2 rounded-xl border border-[var(--border-primary)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!rejectionReason.trim()) return;
                  await verifyDoctor(selectedDoctor._id, 'reject', rejectionReason);
                  setRejectModal(false);
                  setRejectionReason('');
                  setSelectedDoctor(null);
                  getDoctors(page, limit);
                }}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === 'approve'
            ? 'Approve Doctor Application'
            : confirmModal.type === 'block'
            ? 'Block Doctor Account'
            : confirmModal.type === 'unblock'
            ? 'Unblock Doctor Account'
            : 'Delete Doctor Profile'
        }
        message={
          confirmModal.type === 'approve'
            ? `Are you sure you want to approve Dr. ${
                confirmModal.doctor?.fullName || confirmModal.doctor?.name
              }? Their account will be activated immediately for consultations.`
            : confirmModal.type === 'block'
            ? `Are you sure you want to block Dr. ${
                confirmModal.doctor?.fullName || confirmModal.doctor?.name
              }? They will lose access to consultations.`
            : confirmModal.type === 'unblock'
            ? `Are you sure you want to restore access for Dr. ${
                confirmModal.doctor?.fullName || confirmModal.doctor?.name
              }?`
            : `Are you sure you want to delete this doctor application? All uploaded certificates will be deleted.`
        }
        confirmText={
          confirmModal.type === 'approve'
            ? 'Approve Application'
            : confirmModal.type === 'block'
            ? 'Block Account'
            : confirmModal.type === 'unblock'
            ? 'Unblock Account'
            : 'Delete Doctor'
        }
        confirmVariant={
          confirmModal.type === 'approve' || confirmModal.type === 'unblock'
            ? 'primary'
            : confirmModal.type === 'block'
            ? 'warning'
            : 'danger'
        }
        onConfirm={handleConfirmAction}
        onClose={() => setConfirmModal({ isOpen: false, type: 'block', doctor: null })}
      />

      {/* Document Viewer Modal */}
      {docModal && (
        <DocumentViewerModal
          url={docModal.url}
          title={docModal.title}
          onClose={() => setDocModal(null)}
        />
      )}
    </AdminLayout>
  );
};

export default DoctorManagementPage;