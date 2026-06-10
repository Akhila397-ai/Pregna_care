interface ButtonProps {
  label:     string;
  onClick?:  () => void;
  type?:     'button' | 'submit';
  loading?:  boolean;
  disabled?: boolean;
  variant?:  'primary' | 'outline';
}

const Button = ({
  label,
  onClick,
  type    = 'button',
  loading = false,
  disabled,
  variant = 'primary',
}: ButtonProps) => {
  const base = 'w-full font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed';

  const styles = {
    primary: `${base} bg-pink-500 hover:bg-pink-600 text-white`,
    outline: `${base} border border-pink-500 text-pink-500 hover:bg-pink-50`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={styles[variant]}
    >
      {loading ? 'Please wait...' : label}
    </button>
  );
};

export default Button;