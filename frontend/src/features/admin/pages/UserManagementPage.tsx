import { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { IUserMappedData } from '../types/admin.types';
import { Table, TableColumn } from '@/shared/components/Table';
import { AdminLayout } from '../components/AdminLayout';
import { ConfirmModal } from '../components/ConfirmModal';

const UserManagementPage = () => {
  const {
    users,
    totalUsers,
    totalPages,
    loading,
    error,
    getUsers,
    blockUser,
    unblockUser,
    deleteUser,
  } = useAdmin();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'verified'>('all');

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'block' | 'unblock' | 'delete';
    user: IUserMappedData | null;
  }>({
    isOpen: false,
    type: 'block',
    user: null,
  });

  const limit = 10;

  useEffect(() => {
    getUsers(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.mobileNumber && u.mobileNumber.includes(search));

      if (!matchesSearch) return false;

      if (statusFilter === 'active') return !u.isBlocked;
      if (statusFilter === 'blocked') return u.isBlocked;
      if (statusFilter === 'verified') return u.isVerified;
      return true;
    });
  }, [users, search, statusFilter]);

  const handleConfirmAction = async () => {
    if (!confirmModal.user) return;
    const userId = confirmModal.user._id;

    if (confirmModal.type === 'block') {
      await blockUser(userId);
    } else if (confirmModal.type === 'unblock') {
      await unblockUser(userId);
    } else if (confirmModal.type === 'delete') {
      await deleteUser(userId);
    }

    setConfirmModal({ isOpen: false, type: 'block', user: null });
    getUsers(page, limit);
  };

  const columns: TableColumn<IUserMappedData>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'User',
        render: (user) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs flex-shrink-0 border border-[var(--border-primary)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-sm font-semibold text-[var(--text-primary)] block leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] block leading-tight">
                ID: {user._id.slice(-6)}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'email',
        header: 'Email Address',
        accessor: 'email',
        className: 'text-sm text-[var(--text-secondary)]',
      },
      {
        key: 'mobileNumber',
        header: 'Phone Number',
        render: (user) => (
          <span className="text-sm text-[var(--text-secondary)]">
            {user.mobileNumber || <span className="text-[var(--text-muted)]">—</span>}
          </span>
        ),
      },
      {
        key: 'isVerified',
        header: 'Email Verified',
        render: (user) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              user.isVerified
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                user.isVerified ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {user.isVerified ? 'Verified' : 'Pending'}
          </span>
        ),
      },
      {
        key: 'isBlocked',
        header: 'Status',
        render: (user) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              user.isBlocked
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                user.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            {user.isBlocked ? 'Blocked' : 'Active'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        headerClassName: 'text-right',
        className: 'text-right',
        render: (user) => (
          <div className="flex items-center justify-end gap-1.5">
            {user.isBlocked ? (
              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: 'unblock',
                    user,
                  })
                }
                title="Unblock User"
                className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                aria-label="Unblock User"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: 'block',
                    user,
                  })
                }
                title="Block User"
                className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                aria-label="Block User"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            )}

            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  type: 'delete',
                  user,
                })
              }
              title="Delete User"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
              aria-label="Delete User"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                User Management
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-primary)]">
                {totalUsers} total
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage patient accounts, access restrictions, and account verifications.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-4 mb-6 border border-[var(--border-primary)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-muted)] rounded-xl w-full md:w-auto overflow-x-auto">
          {(['all', 'active', 'blocked', 'verified'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === tab
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-muted)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-emerald-500 focus:bg-[var(--bg-card)] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <Table<IUserMappedData>
        columns={columns}
        data={filtered}
        loading={loading}
        keyExtractor={(user) => user._id}
        emptyMessage="No users found matching the search criteria."
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
          totalItems: totalUsers,
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === 'block'
            ? 'Block User Account'
            : confirmModal.type === 'unblock'
            ? 'Unblock User Account'
            : 'Delete User Account'
        }
        message={
          confirmModal.type === 'block'
            ? `Are you sure you want to block ${confirmModal.user?.name}? The user will not be able to log in or access their patient records.`
            : confirmModal.type === 'unblock'
            ? `Are you sure you want to restore access for ${confirmModal.user?.name}?`
            : `Are you sure you want to permanently delete ${confirmModal.user?.name}'s account? This action cannot be undone.`
        }
        confirmText={
          confirmModal.type === 'block'
            ? 'Block Account'
            : confirmModal.type === 'unblock'
            ? 'Unblock Account'
            : 'Delete Account'
        }
        confirmVariant={
          confirmModal.type === 'unblock'
            ? 'primary'
            : confirmModal.type === 'block'
            ? 'warning'
            : 'danger'
        }
        onConfirm={handleConfirmAction}
        onClose={() => setConfirmModal({ isOpen: false, type: 'block', user: null })}
      />
    </AdminLayout>
  );
};

export default UserManagementPage;