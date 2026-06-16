import { useState }  from 'react';
import { useAdmin }  from '../hooks/useAdmin';
import {
  validateAdminLogin,
  AdminLoginErrors,
  hasErrors,
} from '../utils/validation';

const AdminLoginPage = () => {
  const { login, loading, error } = useAdmin();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused,      setFocused]      = useState<string | null>(null);
  const [errors,       setErrors]       = useState<AdminLoginErrors>({});

  const handleLogin = async () => {
    const errs = validateAdminLogin(email, password);
    if (hasErrors(errs)) { setErrors(errs); return; }
    setErrors({});
    await login(email, password);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row font-sans bg-[#f5f7f0]">

      {/* ── Left Panel ─────────────────────────────── */}
      <div className="flex flex-col px-8 py-6 lg:px-16 lg:py-10 w-full lg:w-1/2 xl:w-5/12 h-full overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-[#d4f5e2] flex items-center justify-center shadow-sm">
            <div className="w-6 h-6 rounded-md bg-[#2ecc71] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
              </svg>
            </div>
          </div>
          <span className="text-[#1a2e1a] font-bold text-xl tracking-tight">PregnaCare</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#e8f8ef] text-[#2ecc71] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 w-fit">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Admin Portal
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1a2e1a] leading-tight mb-3">
            Welcome<br />Admin
          </h1>
          <p className="text-[#5a7a5a] text-base leading-relaxed max-w-xs">
            Sign in to manage users, doctors and platform settings.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5 flex-1">

          {/* API error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
              Email Address
            </label>
            {errors.email && (
              <p className="text-red-500 text-xs mb-1">{errors.email}</p>
            )}
            <div className="relative">
              <input
                type="email"
                placeholder="admin@pregnacare.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`w-full px-4 py-3 pr-10 rounded-xl border-2 bg-white
                  text-[#1a2e1a] placeholder-[#b0c8b0] outline-none
                  transition-all duration-200 text-sm ${
                  errors.email
                    ? 'border-red-400'
                    : focused === 'email'
                    ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
                    : 'border-[#dde8dd]'
                }`}
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fba8f]"
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
            <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
              Password
            </label>
            {errors.password && (
              <p className="text-red-500 text-xs mb-1">{errors.password}</p>
            )}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: undefined }));
                }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`w-full px-4 py-3 pr-10 rounded-xl border-2 bg-white
                  text-[#1a2e1a] placeholder-[#b0c8b0] outline-none
                  transition-all duration-200 text-sm ${
                  errors.password
                    ? 'border-red-400'
                    : focused === 'password'
                    ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
                    : 'border-[#dde8dd]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fba8f] hover:text-[#2ecc71] transition-colors"
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
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
              active:scale-[0.98] text-white font-bold text-base
              shadow-lg shadow-green-200 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>

          <p className="text-center text-sm text-[#5a7a5a]">
            Not an admin?{' '}
            <a href="/login" className="text-[#2ecc71] font-semibold hover:underline">
              User Login
            </a>
          </p>
        </div>

        <p className="text-xs text-[#a0b8a0] mt-10">
          © 2024 PregnaCare. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ────────────────────────────── */}
      <div className="relative hidden lg:flex h-full w-full lg:w-1/2 xl:w-7/12 overflow-hidden rounded-tl-3xl rounded-bl-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Features */}
        <div className="absolute top-12 left-10 right-10">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            Admin Capabilities
          </p>
          <div className="space-y-3">
            {[
              { icon: '👥', label: 'User Management',    desc: 'View, block and manage all users' },
              { icon: '🩺', label: 'Doctor Management',  desc: 'Approve or reject doctor applications' },
              { icon: '📊', label: 'Platform Analytics', desc: 'Monitor platform activity' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-white/60 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-[#2ecc71]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <blockquote className="text-2xl lg:text-3xl font-bold leading-snug mb-5 max-w-md">
            "Managing maternal healthcare has never been more seamless."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2ecc71]/40 border-2 border-[#2ecc71] flex items-center justify-center text-white font-bold text-sm">
              DR
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Dr. Rachel</p>
              <p className="text-white/60 text-xs">Platform Administrator</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminLoginPage;