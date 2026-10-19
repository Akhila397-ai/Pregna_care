import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

interface AdminTopNavbarProps {
  onMenuToggle: () => void;
}

export const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) {
      return (
        <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]" aria-label="Breadcrumb">
          <Link to="/admin/dashboard" className="hover:text-[var(--text-primary)] transition">
            Dashboard
          </Link>
          <span>/</span>
          <span>Administration</span>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-semibold">User Management</span>
        </nav>
      );
    }
    if (path.includes('/admin/doctors')) {
      return (
        <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]" aria-label="Breadcrumb">
          <Link to="/admin/dashboard" className="hover:text-[var(--text-primary)] transition">
            Dashboard
          </Link>
          <span>/</span>
          <span>Administration</span>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-semibold">Doctor Management</span>
        </nav>
      );
    }
    return (
      <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]" aria-label="Breadcrumb">
        <span className="text-[var(--text-primary)] font-semibold">Dashboard Overview</span>
      </nav>
    );
  };

  return (
    <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-primary)] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumb navigation */}
        <div className="hidden sm:block">
          {getBreadcrumb()}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Super Admin Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Super Admin</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-primary)]">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-[var(--text-primary)] leading-tight">
              {user?.name || 'Administrator'}
            </span>
            <span className="block text-[11px] text-[var(--text-muted)] leading-tight">
              {user?.role || 'admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

