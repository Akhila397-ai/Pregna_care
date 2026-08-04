import { useEffect, useState }  from 'react';
import { useAdmin }             from '../../admin/hooks/useAdmin';
import { IDoctorMappedData }   from '../../admin/types/admin.types';


type VerifyAction = 'approve' | 'reject' | 'more_documents_required' | 'under_review';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dot:   'bg-yellow-500',
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot:   'bg-blue-500',
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot:   'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot:   'bg-red-500',
  },
  more_documents_required: {
    label: 'More Docs Required',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
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
  const [detailModal,    setDetailModal]    = useState(false);
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
          <h1 className="text-2xl font-bold text-[#1a2e1a]">
            Doctor Verification
          </h1>
          <p className="text-sm text-[#5a7a5a] mt-0.5">
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
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border-2
            border-[#dde8dd] bg-white text-sm outline-none
            focus:border-[#2ecc71]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border-2 border-[#dde8dd]
            bg-white text-sm outline-none focus:border-[#2ecc71]"
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
        <div className="bg-red-50 border border-red-200 text-red-700
          text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin w-8 h-8 text-[#2ecc71]" fill="none"
            viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#8fba8f]">
          No doctor applications found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((doctor) => {
            const statusCfg = STATUS_CONFIG[doctor.status] || STATUS_CONFIG.pending;

            return (
              <div key={doctor._id}
                className="bg-white rounded-2xl border border-[#dde8dd]
                  shadow-sm p-6">

                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#d4f5e2]
                      flex items-center justify-center text-[#2ecc71]
                      font-bold text-lg flex-shrink-0">
                      {doctor.name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a2e1a] text-base">
                        {doctor.name || doctor.name}
                      </h3>
                      <p className="text-sm text-[#5a7a5a]">{doctor.email}</p>
                      <p className="text-xs text-[#8fba8f]">{doctor.phone}</p>
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
                  py-4 border-t border-b border-[#f0f4f0]">
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
                      <p className="text-xs text-[#8fba8f] font-medium mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold text-[#1a2e1a] truncate">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Verification Remarks */}
                {doctor.verificationRemarks && (
                  <div className="bg-orange-50 border border-orange-100
                    rounded-xl px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-orange-700 mb-1">
                      Verification Remarks:
                    </p>
                    <p className="text-sm text-orange-800">
                      {doctor.verificationRemarks}
                    </p>
                  </div>
                )}

                {/* Documents */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <p className="text-xs text-[#8fba8f] font-semibold
                    w-full mb-1">
                    Documents:
                  </p>
                  {[
                    {
                      label: '📄 Degree Certificate',
                      url:   doctor.degreeCertificateUrl,
                    },
                    {
                      label: '📋 Registration Certificate',
                      url:   doctor.registrationCertificateUrl,
                    },
                    {
                      label: '🪪 Government ID',
                      url:   doctor.governmentIdUrl,
                    },
                  ].map((doc) => (
                    <button
                      key={doc.label}
                      onClick={() => doc.url && setDocModal(doc.url)}
                      disabled={!doc.url}
                      className="flex items-center gap-2 px-3 py-1.5
                        rounded-xl border-2 border-[#dde8dd] text-xs
                        font-medium text-[#5a7a5a] hover:border-[#2ecc71]
                        hover:text-[#2ecc71] transition disabled:opacity-40
                        disabled:cursor-not-allowed"
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
                      className="px-4 py-2 rounded-xl bg-green-50 text-green-700
                        hover:bg-green-100 text-xs font-semibold transition"
                    >
                      ✓ Approve
                    </button>
                  )}
                  {doctor.status !== 'under_review' && (
                    <button
                      onClick={() => openAction(doctor, 'under_review')}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700
                        hover:bg-blue-100 text-xs font-semibold transition"
                    >
                      🔍 Mark Under Review
                    </button>
                  )}
                  {doctor.status !== 'more_documents_required' && (
                    <button
                      onClick={() => openAction(doctor, 'more_documents_required')}
                      className="px-4 py-2 rounded-xl bg-orange-50 text-orange-700
                        hover:bg-orange-100 text-xs font-semibold transition"
                    >
                      📎 Request More Docs
                    </button>
                  )}
                  {doctor.status !== 'rejected' && (
                    <button
                      onClick={() => openAction(doctor, 'reject')}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-700
                        hover:bg-red-100 text-xs font-semibold transition"
                    >
                      ✕ Reject
                    </button>
                  )}
                  <div className="ml-auto flex gap-2">
                    {doctor.isBlocked ? (
                      <button
                        onClick={() => unblockDoctor(doctor._id)}
                        className="px-3 py-2 rounded-xl bg-gray-50 text-gray-700
                          hover:bg-gray-100 text-xs font-medium transition"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockDoctor(doctor._id)}
                        className="px-3 py-2 rounded-xl bg-gray-50 text-gray-700
                          hover:bg-gray-100 text-xs font-medium transition"
                      >
                        Block
                      </button>
                    )}
                    <button
                      onClick={() => deleteDoctor(doctor._id)}
                      className="px-3 py-2 rounded-xl bg-red-50 text-red-600
                        hover:bg-red-100 text-xs font-medium transition"
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
          <p className="text-sm text-[#5a7a5a]">
            Page {page} of {doctorPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border-2 border-[#dde8dd]
                text-sm text-[#5a7a5a] disabled:opacity-50
                hover:border-[#2ecc71] transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(doctorPages, p + 1))}
              disabled={page === doctorPages}
              className="px-4 py-2 rounded-xl border-2 border-[#dde8dd]
                text-sm text-[#5a7a5a] disabled:opacity-50
                hover:border-[#2ecc71] transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {docModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center
          justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full
            max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4
              border-b border-[#dde8dd]">
              <h3 className="font-bold text-[#1a2e1a]">Document Viewer</h3>
              <button
                onClick={() => setDocModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200
                  flex items-center justify-center text-gray-600 transition"
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
                  className="w-full h-[70vh] rounded-xl border border-[#dde8dd]"
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
            <div className="px-6 py-4 border-t border-[#dde8dd] flex justify-end">
              <a
                href={docModal}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#2ecc71] text-white
                  text-sm font-semibold hover:bg-[#27b860] transition"
              >
                Open in New Tab ↗
              </a>
            </div>
          </div>
          </div>

      )}

      {/* Action Modal */}
      {actionModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center
          justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-[#1a2e1a] mb-2">
              {action === 'approve'                 && 'Approve Application'}
              {action === 'reject'                  && 'Reject Application'}
              {action === 'under_review'             && 'Mark Under Review'}
              {action === 'more_documents_required'  && 'Request More Documents'}
            </h3>
            <p className="text-sm text-[#5a7a5a] mb-4">
              Doctor:{' '}
              <span className="font-semibold text-[#1a2e1a]">
                {selectedDoctor.fullName || selectedDoctor.name}
              </span>
            </p>

            {/* Remarks required for reject and more_docs */}
            {(action === 'reject' ||
              action === 'more_documents_required' ||
              action === 'under_review') && (
              <div className="mb-4">
                <label className="block text-sm font-semibold
                  text-[#2d4a2d] mb-1.5">
                  {action === 'more_documents_required'
                    ? 'Specify what documents are needed:'
                    : 'Remarks:'}
                  {action === 'reject' && (
                    <span className="text-red-500 ml-1">*</span>
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#dde8dd]
                    bg-white text-sm outline-none focus:border-[#2ecc71]
                    resize-none"
                />
              </div>
            )}

            {/* Approve confirmation */}
            {action === 'approve' && (
              <div className="bg-green-50 border border-green-100
                rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-green-700">
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
                className="flex-1 py-2.5 rounded-xl border-2 border-[#dde8dd]
                  text-[#5a7a5a] font-semibold text-sm hover:border-red-300
                  hover:text-red-500 transition"
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
                    ? 'bg-green-500 hover:bg-green-600'
                    : action === 'reject'
                    ? 'bg-red-500 hover:bg-red-600'
                    : action === 'under_review'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-orange-500 hover:bg-orange-600'
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