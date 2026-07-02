import { useEffect, useState }   from 'react';
import { useAdmin }              from '../hooks/useAdmin';
import { IDoctorMappedData }    from '../types/admin.types';

const DoctorManagementPage = () => {
  const {
    doctors, totalDoctors, doctorPages,
    loading, error,
    getDoctors,
    approveDoctor, rejectDoctor,
    blockDoctor, unblockDoctor, deleteDoctor,
  } = useAdmin();

  const [page,            setPage]            = useState(1);
  const [search,          setSearch]          = useState('');
  const [rejectModal,     setRejectModal]     = useState(false);
  const [selectedDoctor,  setSelectedDoctor]  = useState<IDoctorMappedData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const limit = 10;

  useEffect(() => {
    getDoctors(page, limit);
  }, [page]);

  const filtered = doctors.filter((d) =>
    d.fullName.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => ({
    pending:  'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }[status] ?? 'bg-gray-100 text-gray-700');

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

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
                  'Status', 'Blocked', 'Actions',
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
                  <td colSpan={9} className="px-6 py-10 text-center
                    text-[#8fba8f]">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center
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
                        <img
                          src={
                            doctor.profileImage ||
                            `https://ui-avatars.com/api/?name=${doctor.fullName}&background=d4f5e2&color=2ecc71`
                          }
                          alt={doctor.fullName}
                          className="w-9 h-9 rounded-full object-cover
                            border border-[#dde8dd]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#1a2e1a]
                            whitespace-nowrap">
                            {doctor.fullName}       {/* ← from User */}
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
                      <p className="max-w-[120px] truncate">
                        {doctor.clinicName}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5
                        py-0.5 rounded-full text-xs font-medium
                        ${statusBadge(doctor.status)}`}>
                        {doctor.status.charAt(0).toUpperCase() +
                          doctor.status.slice(1)}
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
                            onClick={() => approveDoctor(doctor._id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg
                              bg-green-50 text-green-700 hover:bg-green-100
                              font-medium transition whitespace-nowrap"
                          >
                            Approve
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
                            Reject
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
                {selectedDoctor.fullName}
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
                onClick={async () => {
                  if (!rejectionReason.trim()) return;
                  await rejectDoctor(
                    selectedDoctor._id,
                    rejectionReason
                  );
                  setRejectModal(false);
                  setRejectionReason('');
                  setSelectedDoctor(null);
                }}
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
    </div>
  );
};

export default DoctorManagementPage;