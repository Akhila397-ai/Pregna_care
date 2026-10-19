import React from 'react';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { DoctorDashboardResponse } from '../types/doctor.types';

interface DoctorNavbarProps {
  onOpenSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
  dashboard: DoctorDashboardResponse | null;
  onLogout: () => void;
}

export const DoctorNavbar: React.FC<DoctorNavbarProps> = ({
  onOpenSidebar,
  searchQuery,
  onSearchChange,
  notificationCount = 0,
  onOpenNotifications,
  dashboard,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 h-18 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-primary)]/70 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Mobile menu hamburger */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition cursor-pointer shrink-0"
          aria-label="Open Sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patients, appointments..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 transition shadow-2xs"
          />
          <svg
            className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Notifications, Theme Toggle, Doctor Info, Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-3">
        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
          title="Recent Alerts & Requests"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Doctor Avatar + Name Preview */}
        {dashboard && (
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[var(--border-primary)]">
            <img
              src={
                dashboard.imageUrl ||
                dashboard.application.profileImage ||
                `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=10b981`
              }
              alt={dashboard.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=10b981`;
              }}
            />
            <div className="text-left">
              <span className="text-xs font-black text-[var(--text-primary)] block leading-tight">
                Dr. {dashboard.name}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                {dashboard.application.specialization}
              </span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
        >
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
