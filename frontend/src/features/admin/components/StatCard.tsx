import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  badge?: {
    text: string;
    type?: 'success' | 'warning' | 'info' | 'neutral';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  badge,
}) => {
  const badgeColors = {
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60',
    info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60',
    neutral: 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border-primary)]',
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 border border-[var(--border-primary)] shadow-xs hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          {value}
        </h3>
        {badge && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              badgeColors[badge.type || 'success']
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

