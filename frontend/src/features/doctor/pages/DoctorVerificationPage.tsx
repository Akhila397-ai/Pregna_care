import { useEffect, useState }  from 'react';
import { useAdmin }             from '../../admin/hooks/useAdmin';
import { IDoctorMappedData }   from '../../admin/types/admin.types';

type VerifyAction = 'approve' | 'reject' | 'more_documents_required' | 'under_review';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dot:   'bg-amber-500',
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    dot:   'bg-sky-500',
  },
  approved: {
    label: 'Approved',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    dot:   'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    dot:   'bg-rose-500',
  },
  more_documents_required: {
    label: 'More Docs Required',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    dot:   'bg-orange-500',
  },
};

const DoctorVerificationPage = () => {
  const {
    doctors, totalDoctors, doctorPages,
    loading, error,
    getDoctors, verifyDoctor,
    blockDoctor, unblockDoctor, deleteDoctor,
  } = useAdmin();

  const [page,           setPage]           = useState(1);
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctorMappedData | null>(null);
  const [actionModal,    setActionModal]    = useState(false);
  const [action,         setAction]         = useState<VerifyAction>('approve');
  const [remarks,        setRemarks]        = useState('');
  const [docModal,       setDocModal]       = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    getDoctors(page, limit);
  }, [page]);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? d.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const openAction = (
    doctor: IDoctorMappedData,
    act:    VerifyAction
  ) => {
    setSelectedDoctor(doctor);
    setAction(act);
    setRemarks('');
    setActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedDoctor) return;
    if (
      (action === 'reject' || action === 'more_documents_required') &&
      !remarks.trim()
    ) return;

    await verifyDoctor(selectedDoctor._id, action, remarks);
    setActionModal(false);
    setSelectedDoctor(null);
    setRemarks('');
    getDoctors(page, limit);
  };

  return (
    <div className="p-6 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Doctor Verification
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {totalDoctors} total applications
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, email or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border
            border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm outline-none
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-[var(--border-primary)]
            bg-[var(--bg-card)] text-[var(--text-primary)] text-sm outline-none focus:border-emerald-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="more_documents_required">More Docs Required</option>
        </select>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500
          text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-emerald-500" fill="none"
            viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">
          No doctor applications found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((doctor) => {
            const statusCfg = STATUS_CONFIG[doctor.status] || STATUS_CONFIG.pending;

            return (
              <div key={doctor._id}
                className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)]
                  shadow-sm p-6 transition-colors duration-200">

                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20
                      flex items-center justify-center text-emerald-600 dark:text-emerald-400
                      font-bold text-lg flex-shrink-0">
                      {doctor.name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)] text-base">
                        {doctor.fullName || doctor.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">{doctor.email}</p>
                      <p className="text-xs text-[var(--text-muted)]">{doctor.phone || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1
                      rounded-full text-xs font-semibold border ${statusCfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4
                  py-4 border-t border-b border-[var(--border-primary)]">
                  {[
                    { label: 'Specialization', value: doctor.specialization },
                    { label: 'Qualification',  value: doctor.qualification },
                    { label: 'Experience',     value: `${doctor.experience} yrs` },
                    { label: 'Reg. Number',    value: doctor.registrationNumber },
                    { label: 'Fee',            value: `$${doctor.consultationFee}` },
                    { label: 'Clinic',         value: doctor.clinicName },
                    {
                      label: 'Applied',
                      value: doctor.createdAt
                        ? new Date(doctor.createdAt).toLocaleDateString()
                        : '—',
                    },
                    {
                      label: 'Verified At',
                      value: doctor.verifiedAt
                        ? new Date(doctor.verifiedAt).toLocaleString()
                        : '—',
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-[var(--text-muted)] font-medium mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Verification Remarks */}
                {doctor.verificationRemarks && (
                  <div className="bg-amber-500/10 border border-amber-500/20
                    rounded-xl px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                      Verification Remarks:
                    </p>
                    <p className="text-sm text-[var(--text-primary)]">
                      {doctor.verificationRemarks}
                    </p>
                  </div>
                )}

                {/* Documents */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <p className="text-xs text-[var(--text-muted)] font-semibold
                    w-full mb-1">
                    Documents:
                  </p>
                  {[
                    {
                      label: '📄 Degree Certificate',
                      url:   doctor.degreeCertificateKey,
                    },
                    {
                      label: '📋 Registration Certificate',
                      url:   doctor.registrationCertificateKey,
                    },
                    {
                      label: '🪪 Government ID',
                      url:   doctor.governmentIdKey,
                    },
                  ].map((doc) => (
                    <button
                      key={doc.label}
                      onClick={() => doc.url && setDocModal(doc.url)}
                      disabled={!doc.url}
                      className="flex items-center gap-2 px-3 py-1.5
                        rounded-xl border border-[var(--border-primary)] text-xs
                        font-medium text-[var(--text-secondary)] hover:border-emerald-500
                        hover:text-emerald-500 transition disabled:opacity-40
                        disabled:cursor-not-allowed bg-[var(--bg-surface)]"
                    >
                      {doc.label}
                      <svg className="w-3 h-3" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor"
                        strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {doctor.status !== 'approved' && (
                    <button
                      onClick={() => openAction(doctor, 'approve')}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                        hover:bg-emerald-500/20 text-xs font-semibold transition"
                    >
                      ✓ Approve
                    </button>
                  )}
                  {doctor.status !== 'under_review' && (
                    <button
                      onClick={() => openAction(doctor, 'under_review')}
                      className="px-4 py-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400
                        hover:bg-sky-500/20 text-xs font-semibold transition"
                    >
                      🔍 Mark Under Review
                    </button>
                  )}
                  {doctor.status !== 'more_documents_required' && (
                    <button
                      onClick={() => openAction(doctor, 'more_documents_required')}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400
                        hover:bg-amber-500/20 text-xs font-semibold transition"
                    >
                      📎 Request More Docs
                    </button>
                  )}
                  {doctor.status !== 'rejected' && (
                    <button
                      onClick={() => openAction(doctor, 'reject')}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400
                        hover:bg-rose-500/20 text-xs font-semibold transition"
                    >
                      ✕ Reject
                    </button>
                  )}
                  <div className="ml-auto flex gap-2">
                    {doctor.isBlocked ? (
                      <button
                        onClick={() => unblockDoctor(doctor._id)}
                        className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] text-[var(--text-secondary)]
                          hover:bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-medium transition"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockDoctor(doctor._id)}
                        className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] text-[var(--text-secondary)]
                          hover:bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-medium transition"
                      >
                        Block
                      </button>
                    )}
                    <button
                      onClick={() => deleteDoctor(doctor._id)}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-500
                        hover:bg-rose-500/20 text-xs font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {doctorPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[var(--text-secondary)]">
            Page {page} of {doctorPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-[var(--border-primary)]
                text-sm text-[var(--text-secondary)] disabled:opacity-50
                hover:border-emerald-500 transition bg-[var(--bg-card)]"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(doctorPages, p + 1))}
              disabled={page === doctorPages}
              className="px-4 py-2 rounded-xl border border-[var(--border-primary)]
                text-sm text-[var(--text-secondary)] disabled:opacity-50
                hover:border-emerald-500 transition bg-[var(--bg-card)]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {docModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center
          justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-2xl w-full
            max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4
              border-b border-[var(--border-primary)]">
              <h3 className="font-bold text-[var(--text-primary)]">Document Viewer</h3>
              <button
                onClick={() => setDocModal(null)}
                className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--border-primary)]
                  flex items-center justify-center text-[var(--text-secondary)] transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              {docModal.endsWith('.pdf') ||
               docModal.includes('application/pdf') ||
               docModal.includes('doctor-docs/degrees') ||
               docModal.includes('doctor-docs/registrations') ? (
                <iframe
                  src={docModal}
                  className="w-full h-[70vh] rounded-xl border border-[var(--border-primary)]"
                  title="Document"
                />
              ) : (
                <div className="flex items-center justify-center h-[70vh]">
                  <img
                    src={docModal}
                    alt="Document"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[var(--border-primary)] flex justify-end">
              <a
                href={docModal}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white
                  text-sm font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20"
              >
                Open in New Tab ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 flex items-center
          justify-center z-50 px-4 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              {action === 'approve'                 && 'Approve Application'}
              {action === 'reject'                  && 'Reject Application'}
              {action === 'under_review'             && 'Mark Under Review'}
              {action === 'more_documents_required'  && 'Request More Documents'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Doctor:{' '}
              <span className="font-semibold text-[var(--text-primary)]">
                {selectedDoctor.fullName || selectedDoctor.name}
              </span>
            </p>

            {/* Remarks required for reject and more_docs */}
            {(action === 'reject' ||
              action === 'more_documents_required' ||
              action === 'under_review') && (
              <div className="mb-4">
                <label className="block text-sm font-semibold
                  text-[var(--text-secondary)] mb-1.5">
                  {action === 'more_documents_required'
                    ? 'Specify what documents are needed:'
                    : 'Remarks:'}
                  {action === 'reject' && (
                    <span className="text-rose-500 ml-1">*</span>
                  )}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    action === 'more_documents_required'
                      ? 'Please upload a clearer copy of your degree certificate...'
                      : 'Enter reason...'
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-primary)]
                    bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm outline-none focus:border-emerald-500
                    resize-none"
                />
              </div>
            )}

            {/* Approve confirmation */}
            {action === 'approve' && (
              <div className="bg-emerald-500/10 border border-emerald-500/20
                rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  This will approve the application and grant the doctor
                  access to their dashboard.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal(false);
                  setRemarks('');
                  setSelectedDoctor(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-primary)]
                  text-[var(--text-secondary)] font-semibold text-sm hover:border-rose-400
                  hover:text-rose-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={
                  (action === 'reject' && !remarks.trim()) ||
                  (action === 'more_documents_required' && !remarks.trim())
                }
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm
                  transition text-white disabled:opacity-50 ${
                  action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : action === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : action === 'under_review'
                    ? 'bg-sky-600 hover:bg-sky-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorVerificationPage;