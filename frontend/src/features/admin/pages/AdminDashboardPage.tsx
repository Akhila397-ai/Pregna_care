import { Link }     from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

const AdminDashboardPage = () => {
  const { admin, logout } = useAdmin();

  return (
    <div className="min-h-screen bg-[#f5f7f0]">

      {/* Navbar */}
      <nav className="bg-white border-b border-[#dde8dd] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <span className="font-bold text-[#1a2e1a]">PregnaCare Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5a7a5a]">
            Welcome, {admin?.name}
          </span>
          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-xl bg-red-50 text-red-600
              hover:bg-red-100 font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Cards */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#1a2e1a] mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* User Management Card */}
          <Link
            to="/admin/users"
            className="bg-white rounded-2xl p-6 border border-[#dde8dd]
              shadow-sm hover:shadow-md hover:border-[#2ecc71]
              transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#d4f5e2] flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-lg font-bold text-[#1a2e1a] mb-1">
              User Management
            </h2>
            <p className="text-sm text-[#5a7a5a]">
              View, block and manage all registered users.
            </p>
          </Link>

          {/* Doctor Management Card */}
          <Link
            to="/admin/doctors"
            className="bg-white rounded-2xl p-6 border border-[#dde8dd]
              shadow-sm hover:shadow-md hover:border-[#2ecc71]
              transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#d4f5e2] flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-2xl">🩺</span>
            </div>
            <h2 className="text-lg font-bold text-[#1a2e1a] mb-1">
              Doctor Management
            </h2>
            <p className="text-sm text-[#5a7a5a]">
              Approve, reject and manage doctor applications.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;