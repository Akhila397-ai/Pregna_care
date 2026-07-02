import { useEffect }  from 'react';
import { useDoctor }  from '../hooks/useDoctor';

const DoctorDashboardPage = () => {
  const { dashboard, loading, logout, fetchDashboard } = useDoctor();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f0] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-[#2ecc71]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f0] font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-[#dde8dd] px-6 py-4
        flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2ecc71]
            flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white"
              fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <span className="font-bold text-[#1a2e1a]">PregnaCare</span>
        </div>
        <div className="flex items-center gap-3">
          {dashboard && (
            <div className="flex items-center gap-2">
              <img
                src={
                  dashboard.imageUrl ||
                  `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=2ecc71`
                }
                alt={dashboard.name}
                className="w-8 h-8 rounded-full object-cover border border-[#dde8dd]"
              />
              <span className="text-sm font-medium text-[#1a2e1a]">
                Dr. {dashboard.name}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-xl bg-red-50
              text-red-600 hover:bg-red-100 font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">

        {/* Profile Card */}
        {dashboard && (
          <div className="bg-white rounded-2xl border border-[#dde8dd] p-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  dashboard.imageUrl ||
                  `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=2ecc71`
                }
                alt={dashboard.name}
                className="w-16 h-16 rounded-full object-cover
                  border-2 border-[#2ecc71]"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1a2e1a]">
                  Dr. {dashboard.name}
                </h2>
                <p className="text-sm text-[#5a7a5a]">
                  {dashboard.application.specialization}
                </p>
                <p className="text-xs text-[#8fba8f]">
                  {dashboard.application.clinicName}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1
                rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                ✓ Approved
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6
              pt-6 border-t border-[#f0f4f0]">
              {[
                {
                  label: 'Experience',
                  value: `${dashboard.application.experience} yrs`,
                },
                {
                  label: 'Consultation',
                  value: `$${dashboard.application.consultationFee}`,
                },
                {
                  label: 'Available Days',
                  value: dashboard.application.availability.days
                    .slice(0, 3)
                    .map((d) => d.slice(0, 3))
                    .join(', '),
                },
                {
                  label: 'Timing',
                  value: `${dashboard.application.availability.startTime} - ${dashboard.application.availability.endTime}`,
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs text-[#8fba8f] font-medium mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-[#1a2e1a]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon:  '👥',
              label: 'Patients',
              desc:  'View and manage your patients',
              color: 'bg-blue-50',
            },
            {
              icon:  '📅',
              label: 'Appointments',
              desc:  'Manage upcoming appointments',
              color: 'bg-purple-50',
            },
            {
              icon:  '📋',
              label: 'Medical Records',
              desc:  'Patient medical records',
              color: 'bg-orange-50',
            },
            {
              icon:  '💊',
              label: 'Prescriptions',
              desc:  'Add and view prescriptions',
              color: 'bg-pink-50',
            },
            {
              icon:  '🗓️',
              label: 'Availability',
              desc:  'Manage your schedule',
              color: 'bg-green-50',
            },
            {
              icon:  '📊',
              label: 'Reports',
              desc:  'View and upload reports',
              color: 'bg-yellow-50',
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`${card.color} rounded-2xl p-6 border
                border-[#dde8dd] hover:shadow-md transition cursor-pointer`}
            >
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-base font-bold text-[#1a2e1a] mt-3 mb-1">
                {card.label}
              </h3>
              <p className="text-xs text-[#5a7a5a]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;