import { useEffect, useState }  from 'react';
import { useAdmin }             from '../hooks/useAdmin';
import { IDoctorMappedData }   from '../types/admin.types';

// ── Document Viewer Modal ─────────────────────
const DocumentViewerModal = ({
  url,
  title,
  onClose,
}: {
  url:     string;
  title:   string;
  onClose: () => void;
}) => {
  const isPDF = url.toLowerCase().includes('.pdf') ||
                url.includes('doctor-docs/degrees') ||
                url.includes('doctor-docs/reg-certs') ||
                url.includes('%2Fdegrees') ||
                url.includes('%2Freg-certs');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center
      justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full
        max-w-4xl max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
          border-b border-[#dde8dd] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e8f8ef]
              flex items-center justify-center">
              <svg className="w-4 h-4 text-[#2ecc71]" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-[#1a2e1a] text-base">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            
             <a href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5
                rounded-lg bg-[#2ecc71] text-white text-xs
                font-semibold hover:bg-[#27b860] transition"
            >
              <svg className="w-3.5 h-3.5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100
                hover:bg-gray-200 flex items-center justify-center
                text-gray-600 transition text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-4 min-h-0">
          {isPDF ? (
            <iframe
              src={url}
              className="w-full h-[75vh] rounded-xl border
                border-[#dde8dd]"
              title={title}
            />
          ) : (
            <div className="flex items-center justify-center h-[75vh]
              bg-[#f5f7f0] rounded-xl">
              <img
                src={url}
                alt={title}
                className="max-h-full max-w-full object-contain
                  rounded-xl shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    // </div>
  );
};

// ── Doctor Detail Modal ───────────────────────
const DoctorDetailModal = ({
  doctor,
  onClose,
  onViewDoc,
}: {
  doctor:    IDoctorMappedData;
  onClose:   () => void;
  onViewDoc: (url: string, title: string) => void;
}) => {
  const documents = [
    {
      key:   'degreeCertificateUrl',
      label: 'Medical Degree Certificate',
      icon:  '🎓',
      url:   doctor.degreeCertificateUrl,
    },
    {
      key:   'registrationCertificateUrl',
      label: 'Medical Registration Certificate',
      icon:  '📋',
      url:   doctor.registrationCertificateUrl,
    },
    {
      key:   'governmentIdUrl',
      label: 'Government ID',
      icon:  '🪪',
      url:   doctor.governmentIdUrl,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center
      justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full
        max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
          border-b border-[#dde8dd] sticky top-0 bg-white z-10">
          <h3 className="font-bold text-[#1a2e1a] text-lg">
            Doctor Details
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200
              flex items-center justify-center text-gray-600 transition
              text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#d4f5e2]
              flex items-center justify-center text-[#2ecc71]
              font-bold text-2xl flex-shrink-0">
              {doctor.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1a2e1a]">
                {doctor.fullName || doctor.name}
              </h4>
              <p className="text-sm text-[#5a7a5a]">{doctor.email}</p>
              {doctor.phone && (
                <p className="text-sm text-[#5a7a5a]">{doctor.phone}</p>
              )}
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h5 className="text-xs font-bold text-[#8fba8f]
              uppercase tracking-wider mb-3">
              Professional Information
            </h5>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Specialization', value: doctor.specialization },
                { label: 'Qualification',  value: doctor.qualification },
                { label: 'Experience',     value: `${doctor.experience} years` },
                { label: 'Reg. Number',    value: doctor.registrationNumber },
                { label: 'Consultation Fee', value: `$${doctor.consultationFee}` },
                { label: 'Clinic Name',    value: doctor.clinicName },
                { label: 'Clinic Address', value: doctor.clinicAddress },
                {
                  label: 'Available Days',
                  value: doctor.availabilty?.days?.join(', ') || '—',
                },
                {
                  label: 'Timing',
                  value: doctor.availabilty
                    ? `${doctor.availabilty.startTime} – ${doctor.availabilty.endTime}`
                    : '—',
                },
                {
                  label: 'Applied On',
                  value: doctor.createdAt
                    ? new Date(doctor.createdAt).toLocaleDateString()
                    : '—',
                },
              ].map((item) => (
                <div key={item.label}
                  className="bg-[#f5f7f0] rounded-xl px-4 py-3">
                  <p className="text-xs text-[#8fba8f] font-medium mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-[#1a2e1a]
                    break-words">
                    {item.value || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h5 className="text-xs font-bold text-[#8fba8f]
              uppercase tracking-wider mb-3">
              Submitted Documents
            </h5>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.key}
                  className="flex items-center justify-between
                    bg-[#f5f7f0] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{doc.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1a2e1a]">
                        {doc.label}
                      </p>
                      <p className="text-xs text-[#8fba8f]">
                        {doc.url ? 'Uploaded ✓' : 'Not uploaded'}
                      </p>
                    </div>
                  </div>
                  {doc.url ? (
                    <button
                      onClick={() => onViewDoc(doc.url!, doc.label)}
                      className="flex items-center gap-1.5 px-3 py-1.5
                        rounded-lg bg-[#2ecc71] text-white text-xs
                        font-semibold hover:bg-[#27b860] transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor"
                        strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </button>
                  ) : (
                    <span className="text-xs text-red-400 font-medium">
                      Missing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verification Remarks */}
          {doctor.verificationRemarks && (
            <div className="bg-orange-50 border border-orange-100
              rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-orange-700 mb-1">
                Verification Remarks:
              </p>
              <p className="text-sm text-orange-800">
                {doctor.verificationRemarks}
              </p>
            </div>
          )}

          {/* Verification Info */}
          {doctor.verifiedAt && (
            <div className="bg-[#f5f7f0] rounded-xl px-4 py-3">
              <p className="text-xs text-[#8fba8f] font-medium mb-0.5">
                Reviewed At
              </p>
              <p className="text-sm font-semibold text-[#1a2e1a]">
                {new Date(doctor.verifiedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────
const DoctorManagementPage = () => {
  const {
    doctors, totalDoctors, doctorPages,
    loading, error,
    getDoctors,
    verifyDoctor,
    blockDoctor, unblockDoctor, deleteDoctor,
  } = useAdmin();

  const [page,           setPage]           = useState(1);
  const [search,         setSearch]         = useState('');

  // ← reject modal
  const [rejectModal,     setRejectModal]     = useState(false);
  const [selectedDoctor,  setSelectedDoctor]  = useState<IDoctorMappedData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // ← document viewer
  const [docModal,  setDocModal]  = useState<{
    url:   string;
    title: string;
  } | null>(null);

  // ← doctor detail modal
  const [detailModal, setDetailModal] = useState<IDoctorMappedData | null>(null);

  const limit = 10;

  useEffect(() => {
    getDoctors(page, limit);
  }, [page]);

  const filtered = doctors.filter((d) =>
    (d.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (d.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (d.specialization?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => ({
    pending:                 'bg-yellow-100 text-yellow-700',
    under_review:            'bg-blue-100 text-blue-700',
    approved:                'bg-green-100 text-green-700',
    rejected:                'bg-red-100 text-red-700',
    more_documents_required: 'bg-orange-100 text-orange-700',
  }[status] ?? 'bg-gray-100 text-gray-700');

  const statusLabel = (status: string) => ({
    pending:                 'Pending',
    under_review:            'Under Review',
    approved:                'Approved',
    rejected:                'Rejected',
    more_documents_required: 'More Docs',
  }[status] ?? status);

  const handleApprove = async (doctorId: string) => {
    await verifyDoctor(doctorId, 'approve');
    getDoctors(page, limit);
  };

  const handleRejectConfirm = async () => {
    if (!selectedDoctor || !rejectionReason.trim()) return;
    await verifyDoctor(selectedDoctor._id, 'reject', rejectionReason);
    setRejectModal(false);
    setRejectionReason('');
    setSelectedDoctor(null);
    getDoctors(page, limit);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e1a]">
            Doctor Management
          </h1>
          <p className="text-sm text-[#5a7a5a] mt-0.5">
            {totalDoctors} total applications
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name, email or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border-2 border-[#dde8dd]
            bg-white text-sm outline-none focus:border-[#2ecc71] w-72"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700
          text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border
        border-[#dde8dd] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f5f7f0]">
              <tr>
                {[
                  'Doctor', 'Specialization', 'Qualification',
                  'Experience', 'Fee', 'Clinic',
                  'Documents', 'Status', 'Blocked', 'Actions',
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs
                    font-semibold text-[#5a7a5a] uppercase tracking-wider
                    whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f0]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center
                    text-[#8fba8f]">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5 text-[#2ecc71]"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center
                    text-[#8fba8f]">
                    No doctor applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((doctor) => (
                  <tr key={doctor._id}
                    className="hover:bg-[#f9fbf9] transition">

                    {/* Doctor */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#d4f5e2]
                          flex items-center justify-center text-[#2ecc71]
                          font-bold text-sm flex-shrink-0">
                          {doctor.name?.charAt(0).toUpperCase() || 'D'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a2e1a]
                            whitespace-nowrap">
                            {doctor.fullName || doctor.name}
                          </p>
                          <p className="text-xs text-[#8fba8f]">
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-4 py-4 text-sm text-[#5a7a5a]
                      whitespace-nowrap">
                      {doctor.specialization}
                    </td>

                    {/* Qualification */}
                    <td className="px-4 py-4 text-sm text-[#5a7a5a]">
                      {doctor.qualification}
                    </td>

                    {/* Experience */}
                    <td className="px-4 py-4 text-sm text-[#5a7a5a]
                      whitespace-nowrap">
                      {doctor.experience} yrs
                    </td>

                    {/* Fee */}
                    <td className="px-4 py-4 text-sm text-[#5a7a5a]
                      whitespace-nowrap">
                      ${doctor.consultationFee}
                    </td>

                    {/* Clinic */}
                    <td className="px-4 py-4 text-sm text-[#5a7a5a]">
                      <p className="max-w-[100px] truncate">
                        {doctor.clinicName}
                      </p>
                    </td>

                    {/* Documents — quick view buttons */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {[
                          {
                            label: '🎓',
                            title: 'Degree Certificate',
                            url:   doctor.degreeCertificateUrl,
                          },
                          {
                            label: '📋',
                            title: 'Registration Cert.',
                            url:   doctor.registrationCertificateUrl,
                          },
                          {
                            label: '🪪',
                            title: 'Government ID',
                            url:   doctor.governmentIdUrl,
                          },
                        ].map((doc) => (
                          <button
                            key={doc.title}
                            onClick={() =>
                              doc.url && setDocModal({
                                url:   doc.url,
                                title: doc.title,
                              })
                            }
                            disabled={!doc.url}
                            title={doc.url ? `View ${doc.title}` : `${doc.title} not uploaded`}
                            className={`flex items-center gap-1 text-xs
                              px-2 py-1 rounded-lg transition
                              whitespace-nowrap font-medium ${
                              doc.url
                                ? 'bg-[#e8f8ef] text-[#2ecc71] hover:bg-[#d4f5e2] cursor-pointer'
                                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {doc.label} {doc.title.split(' ')[0]}
                            {doc.url ? (
                              <svg className="w-3 h-3 ml-0.5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor"
                                strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 ml-0.5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor"
                                strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            )}
                          </button>
                        ))}

                        {/* View all details */}
                        <button
                          onClick={() => setDetailModal(doctor)}
                          className="flex items-center gap-1 text-xs
                            px-2 py-1 rounded-lg bg-blue-50 text-blue-600
                            hover:bg-blue-100 transition font-medium
                            whitespace-nowrap"
                        >
                          📄 Full Details
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5
                        py-0.5 rounded-full text-xs font-medium
                        ${statusBadge(doctor.status)}`}>
                        {statusLabel(doctor.status)}
                      </span>
                    </td>

                    {/* Blocked */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5
                        py-0.5 rounded-full text-xs font-medium ${
                        doctor.isBlocked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {doctor.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">

                        {doctor.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(doctor._id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg
                              bg-green-50 text-green-700 hover:bg-green-100
                              font-medium transition whitespace-nowrap"
                          >
                            ✓ Approve
                          </button>
                        )}

                        {doctor.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setRejectModal(true);
                            }}
                            className="text-xs px-2.5 py-1.5 rounded-lg
                              bg-orange-50 text-orange-700
                              hover:bg-orange-100 font-medium transition"
                          >
                            ✕ Reject
                          </button>
                        )}

                        {doctor.isBlocked ? (
                          <button
                            onClick={() => unblockDoctor(doctor._id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg
                              bg-blue-50 text-blue-700 hover:bg-blue-100
                              font-medium transition"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => blockDoctor(doctor._id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg
                              bg-red-50 text-red-700 hover:bg-red-100
                              font-medium transition"
                          >
                            Block
                          </button>
                        )}

                        <button
                          onClick={() => deleteDoctor(doctor._id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg
                            bg-gray-50 text-gray-700 hover:bg-gray-100
                            font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {doctorPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#5a7a5a]">
            Page {page} of {doctorPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border-2 border-[#dde8dd]
                text-sm text-[#5a7a5a] disabled:opacity-50
                hover:border-[#2ecc71] hover:text-[#2ecc71] transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(doctorPages, p + 1))}
              disabled={page === doctorPages}
              className="px-4 py-2 rounded-xl border-2 border-[#dde8dd]
                text-sm text-[#5a7a5a] disabled:opacity-50
                hover:border-[#2ecc71] hover:text-[#2ecc71] transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center
          justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full
            max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-[#1a2e1a] mb-2">
              Reject Application
            </h3>
            <p className="text-sm text-[#5a7a5a] mb-4">
              Rejecting{' '}
              <span className="font-semibold text-[#1a2e1a]">
                {selectedDoctor.fullName || selectedDoctor.name}
              </span>
              . Please provide a reason.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#dde8dd]
                bg-white text-sm outline-none focus:border-[#2ecc71]
                resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal(false);
                  setRejectionReason('');
                  setSelectedDoctor(null);
                }}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#dde8dd]
                  text-[#5a7a5a] font-semibold text-sm hover:border-red-300
                  hover:text-red-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-500
                  hover:bg-red-600 text-white font-bold text-sm
                  transition disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Detail Modal */}
      {detailModal && (
        <DoctorDetailModal
          doctor={detailModal}
          onClose={() => setDetailModal(null)}
          onViewDoc={(url, title) => {
            setDetailModal(null);
            setDocModal({ url, title });
          }}
        />
      )}

      {/* Document Viewer Modal */}
      {docModal && (
        <DocumentViewerModal
          url={docModal.url}
          title={docModal.title}
          onClose={() => setDocModal(null)}
        />
      )}
    </div>
  );
};

export default DoctorManagementPage;