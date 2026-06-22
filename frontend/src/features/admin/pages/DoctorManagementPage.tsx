import { useEffect, useState } from 'react';
import { useAdmin }            from '../hooks/useAdmin';

const DoctorManagementPage = () => {
  const {
    doctors, totalDoctors, doctorPages,
    loading, error,
    getDoctors,
    approveDoctor, rejectDoctor,
    blockDoctor, unblockDoctor, deleteDoctor,
  } = useAdmin();

  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  useEffect(() => {
    getDoctors(page, limit);
  }, [page]);

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e1a]">Doctor Management</h1>
          <p className="text-sm text-[#5a7a5a] mt-0.5">
            Total {totalDoctors} doctors
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border-2 border-[#dde8dd] bg-white
            text-sm outline-none focus:border-[#2ecc71] w-64
            transition-all duration-200"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#dde8dd] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f5f7f0]">
            <tr>
              {['Name', 'Email', 'Specialization', 'Approval', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-[#5a7a5a] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f0]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[#8fba8f]">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[#8fba8f]">
                  No doctors found.
                </td>
              </tr>
            ) : (
              filtered.map((doctor) => (
                <tr key={doctor._id} className="hover:bg-[#f9fbf9] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d4f5e2] flex items-center justify-center text-[#2ecc71] font-bold text-sm">
                        {doctor.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-[#1a2e1a]">
                        {doctor.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5a7a5a]">
                    {doctor.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5a7a5a]">
                    {doctor.specialization || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.isApproved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doctor.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.isBlocked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {doctor.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {!doctor.isApproved && (
                        <button
                          onClick={() => approveDoctor(doctor._id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-green-50
                            text-green-700 hover:bg-green-100 font-medium transition"
                        >
                          Approve
                        </button>
                      )}
                      {doctor.isApproved && (
                        <button
                          onClick={() => rejectDoctor(doctor._id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-orange-50
                            text-orange-700 hover:bg-orange-100 font-medium transition"
                        >
                          Reject
                        </button>
                      )}
                      {doctor.isBlocked ? (
                        <button
                          onClick={() => unblockDoctor(doctor._id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-50
                            text-blue-700 hover:bg-blue-100 font-medium transition"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => blockDoctor(doctor._id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50
                            text-red-700 hover:bg-red-100 font-medium transition"
                        >
                          Block
                        </button>
                      )}
                      <button
                        onClick={() => deleteDoctor(doctor._id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-50
                          text-gray-700 hover:bg-gray-100 font-medium transition"
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
              className="px-4 py-2 rounded-xl border-2 border-[#dde8dd] text-sm
                font-medium text-[#5a7a5a] disabled:opacity-50
                hover:border-[#2ecc71] hover:text-[#2ecc71] transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(doctorPages, p + 1))}
              disabled={page === doctorPages}
              className="px-4 py-2 rounded-xl border-2 border-[#dde8dd] text-sm
                font-medium text-[#5a7a5a] disabled:opacity-50
                hover:border-[#2ecc71] hover:text-[#2ecc71] transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagementPage;