import { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }   from '../hooks/useAuth';
import { validateForgotPassword } from '../utils/validation';

type Step = 'email' | 'otp' | 'reset' | 'success';

// ── Sub Components ────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
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
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels     = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors     = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-[#2ecc71]'];
  const textColors = ['', 'text-red-400', 'text-yellow-500', 'text-blue-400', 'text-[#2ecc71]'];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : 'bg-[#dde8dd]'
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-xs font-medium ${textColors[score]}`}>
          {labels[score]}
        </p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────
const ForgotPasswordPage = () => {
  const {
    forgotPassword,
    verifyOTP,
    resetPassword,
    loading,
    error,
    pendingEmail,
  } = useAuth();

  const navigate = useNavigate();

  const [step,            setStep]            = useState<Step>('email');
  const [focused,         setFocused]         = useState<string | null>(null);
  const [email,           setEmail]           = useState('');
  const [otp,             setOtp]             = useState(['', '', '', '', '', '']);
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [localError,      setLocalError]      = useState('');

  const steps: Step[]  = ['email', 'otp', 'reset', 'success'];
  const currentIdx     = steps.indexOf(step);
  const displayError   = localError || error;

  // ── Step Meta ─────────────────────────────────
  const stepMeta = {
    email: {
      heading: 'Forgot\nPassword?',
      sub:     'No worries! Enter your email and we\'ll send you a 6-digit verification code.',
    },
    otp: {
      heading: 'Check Your\nEmail',
      sub:     `We've sent a 6-digit code to ${email}. Enter it below to continue.`,
    },
    reset: {
      heading: 'New\nPassword',
      sub:     'Create a strong password that you haven\'t used before.',
    },
    success: {
      heading: 'All\nDone!',
      sub:     'Your password has been reset successfully. You can now log in with your new password.',
    },
  };

  const { heading, sub } = stepMeta[step];

  // ── Handlers ──────────────────────────────────

  const handleSendOtp = async () => {
   const validationError = validateForgotPassword(email);
   if(validationError){
    setLocalError(validationError)
    return
   }
    await forgotPassword(email);
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otp.some((d) => d === '')) {
      setLocalError('Please enter all 6 digits.');
      return;
    }
    setLocalError('');
    await verifyOTP(otp.join(''));
    setStep('reset');
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    setLocalError('');
    await resetPassword(otp.join(''), password);
    setStep('success');
  };

  // ── OTP Input Helpers ─────────────────────────

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next  = [...otp];
    next[idx]   = val;
    setOtp(next);
    if (val && idx < 5) {
      (document.getElementById(`otp-${idx + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      (document.getElementById(`otp-${idx - 1}`) as HTMLInputElement)?.focus();
    }
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

        {/* Back Button */}
        {step !== 'success' && (
          <button
            onClick={() =>
              step === 'email'
                ? navigate('/login')
                : setStep(steps[currentIdx - 1] as Step)
            }
            className="flex items-center gap-1.5 text-sm text-[#5a7a5a] hover:text-[#2ecc71] transition-colors mb-6 w-fit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            {step === 'email' ? 'Back to Login' : 'Back'}
          </button>
        )}

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentIdx
                  ? 'bg-[#2ecc71] w-8'
                  : 'bg-[#dde8dd] w-4'
              }`}
            />
          ))}
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1a2e1a] leading-tight mb-3 whitespace-pre-line">
            {heading}
          </h1>
          <p className="text-[#5a7a5a] text-base leading-relaxed max-w-xs">
            {sub}
          </p>
        </div>

        {/* ── STEP: EMAIL ──────────────────────────── */}
        {step === 'email' && (
          <div className="space-y-5 flex-1">
            {displayError && (
              <p className="text-red-500 text-sm">{displayError}</p>
            )}
            <div>
              <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border-2 bg-white
                    text-[#1a2e1a] placeholder-[#b0c8b0] outline-none
                    transition-all duration-200 text-sm ${
                    focused === 'email'
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

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
                active:scale-[0.98] text-white font-bold text-base
                shadow-lg shadow-green-200 transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>

            <p className="text-center text-sm text-[#5a7a5a]">
              Remembered it?{' '}
              <a href="/login" className="text-[#2ecc71] font-semibold hover:underline">
                Log in
              </a>
            </p>
          </div>
        )}

        {/* ── STEP: OTP ────────────────────────────── */}
        {step === 'otp' && (
          <div className="space-y-6 flex-1">
            {displayError && (
              <p className="text-red-500 text-sm">{displayError}</p>
            )}
            <div>
              <label className="block text-sm font-semibold text-[#2d4a2d] mb-4">
                Enter 6-digit code
              </label>
              <div className="flex gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    onFocus={() => setFocused(`otp-${idx}`)}
                    onBlur={() => setFocused(null)}
                    style={{ width: '2.75rem', height: '3.25rem' }}
                    className={`text-center text-lg font-bold rounded-xl border-2
                      bg-white text-[#1a2e1a] outline-none transition-all duration-200 ${
                      focused === `otp-${idx}`
                        ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
                        : digit
                        ? 'border-[#2ecc71] bg-[#f0fdf4]'
                        : 'border-[#dde8dd]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
                active:scale-[0.98] text-white font-bold text-base
                shadow-lg shadow-green-200 transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <p className="text-center text-sm text-[#5a7a5a]">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-[#2ecc71] font-semibold hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
        )}

        {/* ── STEP: RESET PASSWORD ─────────────────── */}
        {step === 'reset' && (
          <div className="space-y-5 flex-1">
            {displayError && (
              <p className="text-red-500 text-sm">{displayError}</p>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border-2 bg-white
                    text-[#1a2e1a] placeholder-[#b0c8b0] outline-none
                    transition-all duration-200 text-sm ${
                    focused === 'password'
                      ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
                      : 'border-[#dde8dd]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fba8f] hover:text-[#2ecc71] transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {password && <PasswordStrength password={password} />}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  className={`w-full px-4 py-3 pr-10 rounded-xl border-2 bg-white
                    text-[#1a2e1a] placeholder-[#b0c8b0] outline-none
                    transition-all duration-200 text-sm ${
                    focused === 'confirm'
                      ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
                      : confirmPassword && confirmPassword !== password
                      ? 'border-red-400'
                      : 'border-[#dde8dd]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fba8f] hover:text-[#2ecc71] transition-colors"
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
                active:scale-[0.98] text-white font-bold text-base
                shadow-lg shadow-green-200 transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        )}

        {/* ── STEP: SUCCESS ────────────────────────── */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-[#d4f5e2] flex items-center justify-center shadow-md">
              <svg className="w-10 h-10 text-[#2ecc71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#2d4a2d]">
                Password updated for
              </p>
              <p className="text-base font-bold text-[#1a2e1a]">{email}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
                active:scale-[0.98] text-white font-bold text-base
                shadow-lg shadow-green-200 transition-all duration-200"
            >
              Back to Login
            </button>
          </div>
        )}

        <p className="text-xs text-[#a0b8a0] mt-10">
          © 2024 PregnaCare. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ────────────────────────────── */}
      <div className="relative hidden lg:flex h-full w-full lg:w-1/2 xl:w-7/12 overflow-hidden rounded-tl-3xl rounded-bl-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-[#2ecc71]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <blockquote className="text-2xl lg:text-3xl font-bold leading-snug mb-5 max-w-md">
            "The most comforting experience I've had during my pregnancy.
            It feels like having a caring friend by your side."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2ecc71]/40 border-2 border-[#2ecc71] flex items-center justify-center text-white font-bold text-sm">
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
            backgroundImage: `url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-[#2ecc71]" fill="currentColor" viewBox="0 0 20 20">
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

export default ForgotPasswordPage;