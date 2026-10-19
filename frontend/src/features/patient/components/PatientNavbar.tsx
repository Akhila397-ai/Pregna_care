import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

interface PatientNavbarProps {
  onOpenSOS?: () => void;
  onOpenSidebar?: () => void;
}

export const PatientNavbar: React.FC<PatientNavbarProps> = ({ onOpenSOS, onOpenSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border-primary)] sticky top-0 z-30 shadow-xs backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Area: Mobile Menu Trigger + Brand */}
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button
              type="button"
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Mobile Brand (visible only on mobile when sidebar is hidden) */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none lg:hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="font-black text-[var(--text-primary)] text-lg tracking-tight">
              PregnaCare
            </span>
          </div>

          {/* Desktop breadcrumb / tagline */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
            <span>Maternal & Family Health Dashboard</span>
          </div>
        </div>

        {/* Right Area: SOS Button, Theme Toggle, User Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Prominent SOS Button */}
          {onOpenSOS && (
            <button
              type="button"
              onClick={onOpenSOS}
              className="px-3.5 py-1.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-rose-500"
              title="Emergency Help & Maternal Helplines"
            >
              <span className="animate-pulse text-sm">🚨</span>
              <span className="tracking-wide">SOS</span>
            </button>
          )}

          <ThemeToggle />

          {/* User Profile Pill */}
          {user && (
            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-emerald-400 transition cursor-pointer shadow-xs"
              title="View Profile & Settings"
            >
              <span className="text-xs font-bold text-[var(--text-primary)] hidden sm:inline">
                {user.name?.split(' ')[0] || 'User'}
              </span>
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-[var(--border-primary)]">
                {user.name?.charAt(0).toUpperCase() || 'P'}
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

