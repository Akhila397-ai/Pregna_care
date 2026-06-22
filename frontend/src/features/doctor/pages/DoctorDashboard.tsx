import { useEffect }  from 'react';
import { useDoctor }  from '../hooks/useDoctor';

const DoctorDashboardPage = () => {
  const { profile, fetchProfile, logout } = useDoctor();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f0] font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-[#dde8dd] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <span className="font-bold text-[#1a2e1a]">PregnaCare</span>
        </div>
        <div className="flex items-center gap-3">
          {profile && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#d4f5e2] flex items-center justify-center text-[#2ecc71] font-bold text-sm">
                {profile.fullName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-[#1a2e1a]">
                Dr. {profile.fullName}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-xl bg-red-50 text-red-600
              hover:bg-red-100 font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a2e1a]">
            Doctor Dashboard
          </h1>
          <p className="text-sm text-[#5a7a5a] mt-0.5">
            Welcome back, Dr. {profile?.fullName}
          </p>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="bg-white rounded-2xl border border-[#dde8dd] p-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#2ecc71]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${profile.fullName}&background=d4f5e2&color=2ecc71`;
                }}
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#1a2e1a]">
                  Dr. {profile.fullName}
                </h2>
                <p className="text-sm text-[#5a7a5a]">{profile.specialization}</p>
                <p className="text-xs text-[#8fba8f]">{profile.clinicName}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  ✓ Approved
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#f0f4f0]">
              {[
                { label: 'Experience',   value: `${profile.experience} years` },
                { label: 'Consultation', value: `$${profile.consultationFee}` },
                { label: 'Available',    value: profile.availability.days.slice(0, 3).join(', ') },
                { label: 'Timing',       value: `${profile.availability.startTime} - ${profile.availability.endTime}` },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs text-[#8fba8f] font-medium mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold text-[#1a2e1a]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '👥', label: 'Patients',     desc: 'View and manage your patients',    color: 'bg-blue-50' },
            { icon: '📅', label: 'Appointments', desc: 'Manage upcoming appointments',      color: 'bg-purple-50' },
            { icon: '📋', label: 'Records',       desc: 'Patient medical records',          color: 'bg-orange-50' },
          ].map((card) => (
            <div
              key={card.label}
              className={`${card.color} rounded-2xl p-6 border border-[#dde8dd]
                hover:shadow-md transition cursor-pointer`}
            >
              <span className="text-3xl">{card.icon}</span>
              <h3 className="text-base font-bold text-[#1a2e1a] mt-3 mb-1">{card.label}</h3>
              <p className="text-xs text-[#5a7a5a]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;