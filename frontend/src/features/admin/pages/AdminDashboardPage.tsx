import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { AdminLayout } from '../components/AdminLayout';
import { StatCard } from '../components/StatCard';

const AdminDashboardPage = () => {
  const {
    admin,
    totalUsers,
    totalDoctors,
    doctors,
    getUsers,
    getDoctors,
  } = useAdmin();

  useEffect(() => {
    getUsers(1, 10);
    getDoctors(1, 10);
  }, []);

  const pendingDoctors = doctors.filter((d) => d.status === 'pending').length;
  const approvedDoctors = doctors.filter((d) => d.status === 'approved').length;

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{admin?.name || 'Admin'}</span>. Here is a summary of the PregnaCare platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/doctors"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Review Applications</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Registered Users"
          value={totalUsers}
          subtitle="Patients & expectant mothers"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          iconBgColor="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
          badge={{ text: 'Live', type: 'info' }}
        />

        <StatCard
          title="Doctor Applications"
          value={totalDoctors}
          subtitle="Total verified & submitted profiles"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          iconBgColor="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
          badge={{ text: 'Profiles', type: 'neutral' }}
        />

        <StatCard
          title="Pending Approvals"
          value={pendingDoctors}
          subtitle="Awaiting administrative review"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
          badge={{ text: 'Action Required', type: 'warning' }}
        />

        <StatCard
          title="Approved Doctors"
          value={approvedDoctors}
          subtitle="Active on consultation network"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          badge={{ text: 'Verified', type: 'success' }}
        />
      </div>

      {/* Navigation Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Management Hub */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-primary)] shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-200">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1.5">
              User Management
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              View, search, filter, block, or delete patient accounts. Manage account verification statuses and security settings.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-semibold transition group border border-[var(--border-primary)]"
          >
            <span>Manage All Users</span>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-1 transition-all">
              →
            </span>
          </Link>
        </div>

        {/* Doctor Management Hub */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-primary)] shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-200">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1.5">
              Doctor Management
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Review credential documents (medical degree, registration license, ID proofs), approve or reject doctor applications, and handle doctor accounts.
            </p>
          </div>

          <Link
            to="/admin/doctors"
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-semibold transition group border border-[var(--border-primary)]"
          >
            <span>Manage Doctors ({pendingDoctors} Pending)</span>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-1 transition-all">
              →
            </span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;