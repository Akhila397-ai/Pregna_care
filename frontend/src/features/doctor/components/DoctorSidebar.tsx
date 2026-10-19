import React from 'react';
import { DoctorDashboardResponse } from '../types/doctor.types';

export type DoctorNavTab =
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'records'
  | 'messages'
  | 'reports'
  | 'profile'
  | 'settings'
  | 'help';

interface DoctorSidebarProps {
  isOpen: boolean;
  activeTab: DoctorNavTab;
  onSelectTab: (tab: DoctorNavTab) => void;
  onClose: () => void;
  dashboard: DoctorDashboardResponse | null;
  onLogout: () => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  isOpen,
  activeTab,
  onSelectTab,
  onClose,
  dashboard,
}) => {
  const navItems: { id: DoctorNavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'records',
      label: 'Medical Records',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      id: 'reports',
      label: 'Reports & Complaints',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[var(--bg-surface)] border-r border-[var(--border-primary)] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Logo */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="h-18 px-6 flex items-center justify-between border-b border-[var(--border-primary)]/70">
            <div
              onClick={() => {
                onSelectTab('dashboard');
                onClose();
              }}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 002 0v-6h6a1 1 0 000-2z" />
                </svg>
              </div>
              <div>
                <span className="font-black text-[var(--text-primary)] text-lg tracking-tight block leading-tight">
                  PregnaCare
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                  Doctor Portal
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1" aria-label="Doctor Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 shadow-xs border border-emerald-200/50 dark:border-emerald-800/50'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Doctor Profile Card */}
        {dashboard && (
          <div className="p-4 border-t border-[var(--border-primary)]/70 bg-[var(--bg-surface)]">
            <div
              onClick={() => {
                onSelectTab('profile');
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center gap-3 hover:border-emerald-400 transition cursor-pointer group"
            >
              <img
                src={
                  dashboard.imageUrl ||
                  dashboard.application.profileImage ||
                  `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=10b981`
                }
                alt={dashboard.name}
                className="w-10 h-10 rounded-xl object-cover border border-emerald-400 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${dashboard.name}&background=d4f5e2&color=10b981`;
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-[var(--text-primary)] truncate group-hover:text-emerald-600 transition">
                  Dr. {dashboard.name}
                </h4>
                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
                  {dashboard.application.specialization}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Approved Doctor
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
