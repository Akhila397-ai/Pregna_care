import { useState }    from 'react';
import { useAuth }     from '../hooks/useAuth';
import { Link }        from 'react-router-dom';
import { validateRegister, RegisterErrors, hasErrors } from '../utils/validation';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

type FieldState = {
  name:     string;
  email:    string;
  password: string;
};

const RegisterPage = () => {
  const { register, loading, error } = useAuth();

  const [fields,       setFields]       = useState<FieldState>({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focused,      setFocused]      = useState<string | null>(null);
  const [errors,       setErrors]       = useState<RegisterErrors>({});
  const handle = (key: keyof FieldState) =>
  (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const validateError = validateRegister(fields.name,fields.email,fields.password);
     if(hasErrors(validateError)){
        setErrors(validateError)
        return
     }

    await register(fields.name, fields.email, fields.password);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row font-sans bg-[var(--bg-primary)]">

      {/* ── Left Panel ─────────────────────────────── */}
      <div className="flex flex-col px-8 py-6 lg:px-16 lg:py-10 w-full lg:w-1/2 xl:w-5/12 h-full overflow-y-auto bg-[var(--bg-surface)] transition-colors duration-200">

        {/* Logo & Theme Toggle */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shadow-sm">
              <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                  <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
                </svg>
              </div>
            </div>
            <span className="text-[var(--text-primary)] font-bold text-xl tracking-tight">
              PregnaCare
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] leading-tight mb-3">
            Begin Your<br />Journey
          </h1>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-xs">
            Join our community for expert maternity care and support every step of the way.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5 flex-1">

          {/* Error */}
          {error && (
            <p className="text-rose-500 text-sm">{error}</p>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
              Full Name
            </label>
            {errors.name && (
                <p className='text-rose-500 text-xs mb-1'>{errors.name}</p>
            )}
            <input
              type="text"
              placeholder="Jane"
              value={fields.name}
              onChange={handle('name')}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-card)] text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 text-sm ${
                focused === 'name'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-[var(--border-primary)]'
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
              Email Address
            </label>
            {errors.email && (
                <p className='text-rose-500 text-xs mb-1'>{errors.email}</p>
            )}
            <div className="relative">
              <input
                type="email"
                placeholder="jane@example.com"
                value={fields.email}
                onChange={handle('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className={`w-full px-4 py-3 pr-10 rounded-xl border bg-[var(--bg-card)] text-[var(--text-primary)]
                  placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 text-sm ${
                  focused === 'email'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-[var(--border-primary)]'
                }`}
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">
              Password
            </label>
            {errors.password && (
                <p className='text-rose-500 text-xs mb-1'>{errors.password}</p>
            )}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={fields.password}
                onChange={handle('password')}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                className={`w-full px-4 py-3 pr-10 rounded-xl border bg-[var(--bg-card)] text-[var(--text-primary)]
                  placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 text-sm ${
                  focused === 'password'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-[var(--border-primary)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              Must be at least 8 characters
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border-primary)]" />
            <span className="text-xs text-[var(--text-muted)] font-medium">or</span>
            <div className="flex-1 h-px bg-[var(--border-primary)]" />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700
              active:scale-[0.98] text-white font-bold text-base
              shadow-lg shadow-emerald-500/20 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-[var(--text-muted)]">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline hover:text-emerald-600 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-emerald-600 transition-colors">
              Privacy Policy
            </a>
          </p>

          {/* Login link */}
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-10">
          © 2026 PregnaCare. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ────────────────────────────── */}
      <div className="relative hidden lg:flex h-full w-full lg:w-1/2 xl:w-7/12 overflow-hidden rounded-tl-3xl rounded-bl-3xl border-l border-[var(--border-primary)]">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1200&q=80')`,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Testimonial */}
        <div className="absolute bottom-12 left-10 right-10 text-white">

          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < 4 ? 'text-emerald-400' : 'text-emerald-400/60'}`}
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-2xl lg:text-3xl font-bold leading-snug mb-5 max-w-md">
            "The most comforting experience I've had during my pregnancy.
            It feels like having a caring friend by your side."
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/40 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-sm">
              SJ
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Sarah Jenkins</p>
              <p className="text-white/60 text-xs">New Mother</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Hero Strip ───────────────────────── */}
      <div className="lg:hidden relative h-56 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <p className="text-xs font-medium leading-snug opacity-90 max-w-xs">
            "The most comforting experience I've had during my pregnancy."
          </p>
          <p className="text-xs text-white/60 mt-0.5">— Sarah Jenkins, New Mother</p>
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;