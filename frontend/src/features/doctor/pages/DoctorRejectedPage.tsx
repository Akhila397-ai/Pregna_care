import { useEffect }  from 'react';
import { Link }       from 'react-router-dom';
import { useDoctor }  from '../hooks/useDoctor';

const DoctorRejectedPage = () => {
  const { application, fetchApplication, logout } = useDoctor();

  useEffect(() => {
    fetchApplication();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f0] flex items-center justify-center font-sans px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#dde8dd] p-10 max-w-md w-full text-center">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-[#1a2e1a] mb-3">
          Application Not Approved
        </h1>
        <p className="text-[#5a7a5a] text-sm leading-relaxed mb-6">
          Unfortunately, your doctor application was not approved at this time.
          Please review the feedback below and consider reapplying.
        </p>

        {/* Rejection Reason */}
        {application?.rejectionReason && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left mb-6">
            <p className="text-xs font-semibold text-red-600 mb-1">
              Reason for Rejection:
            </p>
            <p className="text-sm text-red-700">
              {application.rejectionReason}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 bg-[#f5f7f0] rounded-xl px-4 py-3 text-left">
            <span className="text-lg">📝</span>
            <p className="text-xs text-[#5a7a5a]">
              Review the rejection reason and gather any missing documents.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#f5f7f0] rounded-xl px-4 py-3 text-left">
            <span className="text-lg">🔄</span>
            <p className="text-xs text-[#5a7a5a]">
              You may reapply after addressing the concerns mentioned.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/apply-as-doctor"
            className="block w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
              text-white font-bold text-sm shadow-lg shadow-green-200 transition"
          >
            Reapply as Doctor
          </Link>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl border-2 border-[#dde8dd]
              text-[#5a7a5a] font-semibold text-sm hover:border-red-300
              hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorRejectedPage;