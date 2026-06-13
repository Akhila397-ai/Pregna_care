import { useState, useRef, useEffect } from 'react';
import { useNavigate }                  from 'react-router-dom';
import { useAuth }                      from '../hooks/useAuth';
import { validateOTP,OTPErrors,hasErrors } from '../utils/validation';

const OTPPage = () => {
  const { verifyOTP, resendOTP, loading, error, pendingEmail } = useAuth();

  const [digits,      setDigits]      = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [localError,  setLocalError]  = useState<OTPErrors>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate  = useNavigate();

  const otp   = digits.join('');
  const email = pendingEmail ?? 'your email';

  // ── Resend countdown ──────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Input handlers ────────────────────────────
  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next    = [...digits];
    next[index]   = cleaned;
    setDigits(next);
    setLocalError({})
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Verify ────────────────────────────────────
  const handleVerify = async () => {
    const validationError = validateOTP(otp);
    if(hasErrors(validationError)){
        setLocalError(validationError)
        return
    }
    await verifyOTP(otp);

    // reset if error (redux error will show)
    if (error) {
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // ── Resend ────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    await resendOTP();
    setResendTimer(30);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const displayError = localError.otp || error;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-[#f5f7f0]">

      {/* ── Left Panel ─────────────────────────────── */}
      <div className="flex flex-col justify-between px-8 py-10 lg:px-16 lg:py-14 w-full lg:w-1/2 xl:w-5/12">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
          </div>
          <span className="text-[#1a2e1a] font-bold text-xl tracking-tight">
            PregnaCare
          </span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#5a7a5a] hover:text-[#2ecc71] transition-colors mb-8 w-fit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#e8f8ef] flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-8 h-8 text-[#2ecc71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1a2e1a] leading-tight mb-3">
            Verify Your<br />Identity
          </h1>
          <p className="text-[#5a7a5a] text-base leading-relaxed max-w-xs">
            We sent a 6-digit verification code to
          </p>
          <p className="text-[#2ecc71] font-semibold text-base mt-0.5 truncate max-w-xs">
            {email}
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`
                w-full aspect-square max-w-[56px] text-center
                text-2xl font-bold rounded-xl border-2 bg-white
                text-[#1a2e1a] outline-none transition-all duration-200
                focus:border-[#2ecc71] focus:shadow-[0_0_0_3px_rgba(46,204,113,0.15)]
                ${d && !displayError ? 'border-[#2ecc71] bg-[#f0fdf4]' : 'border-[#dde8dd]'}
                ${displayError      ? 'border-red-400 bg-red-50'       : ''}
              `}
            />
          ))}
        </div>

        {/* Error */}
        {displayError && (
          <div className="flex items-center gap-2 text-sm text-red-500 mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <span>
                {displayError}
            </span>
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
            active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-bold text-base shadow-lg shadow-green-200
            transition-all duration-200 flex items-center justify-center gap-2 mb-4"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Verifying…
            </>
          ) : (
            'Verify Account'
          )}
        </button>

        {/* Resend */}
        <p className="text-center text-sm text-[#5a7a5a]">
          Didn't receive the code?{' '}
          {resendTimer > 0 ? (
            <span className="text-[#8fba8f]">
              Resend in{' '}
              <span className="font-semibold text-[#2ecc71]">{resendTimer}s</span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-[#2ecc71] font-semibold hover:underline disabled:opacity-50"
            >
              Resend Code
            </button>
          )}
        </p>

        <p className="text-xs text-[#a0b8a0] mt-10">
          © 2024 PregnaCare. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ────────────────────────────── */}
      <div className="relative hidden lg:flex w-full lg:w-1/2 xl:w-7/12 overflow-hidden rounded-tl-3xl rounded-bl-3xl">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Steps Indicator */}
        <div className="absolute top-10 left-10 right-10">
          <div className="flex items-center gap-3">
            {['Create Account', 'Verify Email', "You're In!"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i === 0 ? 'bg-[#2ecc71] text-white'                :
                  i === 1 ? 'bg-white text-[#1a2e1a] ring-2 ring-[#2ecc71]' :
                            'bg-white/20 text-white/60'
                }`}>
                  {i === 0 ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === 1 ? 'text-white' : 'text-white/50'}`}>
                  {label}
                </span>
                {i < 2 && (
                  <div className={`h-px w-6 ${i < 1 ? 'bg-[#2ecc71]' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
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
      <div className="lg:hidden relative h-44 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <p className="text-xs font-medium leading-snug opacity-90">
            "The most comforting experience I've had during my pregnancy."
          </p>
          <p className="text-xs text-white/60 mt-0.5">— Sarah Jenkins, New Mother</p>
        </div>
      </div>

    </div>
  );
};

export default OTPPage;