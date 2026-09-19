import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  loading = false,
  disabled,
  variant = 'primary',
  className = '',
}) => {
  const base =
    'w-full font-semibold py-2.5 px-4 rounded-xl transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const styles = {
    primary: `${base} bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs`,
    outline: `${base} border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30`,
    secondary: `${base} bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)]`,
    danger: `${base} bg-rose-600 hover:bg-rose-700 text-white`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${styles[variant]} ${className}`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Please wait...
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;

