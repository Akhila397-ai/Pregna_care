import { useEffect }  from 'react';
import { useDoctor }  from '../hooks/useDoctor';

const DoctorPendingPage = () => {
  const {
    application,
    loading,
    checkStatusAndRedirect,
    logout,
  } = useDoctor();

  // ← on every load, check if status changed
  useEffect(() => {
    checkStatusAndRedirect();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f0] flex items-center justify-center font-sans px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#dde8dd] p-10 max-w-md w-full text-center">

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin w-8 h-8 text-[#2ecc71]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : (
          <>
            {/* Pending Icon */}
            <div className="w-20 h-20 rounded-full bg-yellow-50 border-4 border-yellow-200 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-[#1a2e1a] mb-3">
              Application Under Review
            </h1>
            <p className="text-[#5a7a5a] text-sm leading-relaxed mb-6">
              Our admin team is reviewing your application.
              This page auto-checks your status on refresh.
            </p>

            {/* Application Summary */}
            {application && (
              <div className="bg-[#f5f7f0] rounded-xl p-4 text-left space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8fba8f] font-medium">Name</span>
                  <span className="text-[#1a2e1a] font-semibold">
                    {application.fullName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8fba8f] font-medium">Specialization</span>
                  <span className="text-[#1a2e1a] font-semibold">
                    {application.specialization}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8fba8f] font-medium">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                    ⏳ Pending Review
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8fba8f] font-medium">Submitted</span>
                  <span className="text-[#1a2e1a] font-semibold">
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : '—'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-[#e8f8ef] rounded-xl px-4 py-3 text-left">
                <span className="text-lg">📧</span>
                <p className="text-xs text-[#5a7a5a]">
                  You'll be notified by email once reviewed.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-[#e8f8ef] rounded-xl px-4 py-3 text-left">
                <span className="text-lg">🔄</span>
                <p className="text-xs text-[#5a7a5a]">
                  Refresh this page to check your latest status.
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-3 rounded-xl border-2 border-[#dde8dd]
                text-[#5a7a5a] font-semibold text-sm hover:border-red-300
                hover:text-red-500 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorPendingPage;