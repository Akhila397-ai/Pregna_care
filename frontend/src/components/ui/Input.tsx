interface InputProps {
  label:        string;
  type?:        string;
  value:        string;
  onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?:    boolean;
}

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          border border-gray-300 rounded-lg px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-pink-400
          text-sm w-full
        "
      />
    </div>
  );
};

export default Input;