import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled = false,
  className = '',
  id,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          border border-[var(--border-primary)] rounded-xl px-4 py-2.5
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          text-sm w-full bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition duration-150
          disabled:bg-[var(--bg-muted)] disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? 'border-rose-400 focus:ring-rose-400' : ''}
          ${className}
        `}
      />
      {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
};

export default Input;

