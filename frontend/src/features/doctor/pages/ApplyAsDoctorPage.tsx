import { useState }   from 'react';
import { Link }       from 'react-router-dom';
import { useDoctor }  from '../hooks/useDoctor';
import {
  validateDoctorApply,
  DoctorApplyErrors,
  hasErrors,
} from '../utils/validation';

const SPECIALIZATIONS = [
  'Obstetrics & Gynecology', 'Maternal-Fetal Medicine',
  'Pediatrics', 'Neonatology', 'General Practice',
  'Midwifery', 'Reproductive Medicine',
];

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const ApplyAsDoctorPage = () => {
  const { apply, loading, error } = useDoctor();

  const [step,    setStep]    = useState(1);   // multi-step form
  const [errors,  setErrors]  = useState<DoctorApplyErrors>({});
  const [focused, setFocused] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName:           '',
    email:              '',
    password:           '',
    phone:              '',
    specialization:     '',
    qualification:      '',
    experience:         0,
    registrationNumber: '',
    consultationFee:    0,
    clinicName:         '',
    clinicAddress:      '',
    profileImage:       '',
    documents:          [] as string[],
    availability: {
      days:      [] as string[],
      startTime: '',
      endTime:   '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const updateAvailability = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      availability: { ...prev.availability, [key]: value },
    }));
    setErrors((prev) => ({ ...prev, [`availability${key}`]: undefined }));
  };

  const toggleDay = (day: string) => {
    const days = form.availability.days.includes(day)
      ? form.availability.days.filter((d) => d !== day)
      : [...form.availability.days, day];
    updateAvailability('days', days);
  };

  const handleSubmit = async () => {
    const errs = validateDoctorApply(form);
    if (hasErrors(errs)) { setErrors(errs); return; }
    await apply(form);
  };

  const inputClass = (field: keyof DoctorApplyErrors) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-white text-[#1a2e1a]
     placeholder-[#b0c8b0] outline-none transition-all duration-200 text-sm ${
      errors[field]
        ? 'border-red-400'
        : focused === field
        ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
        : 'border-[#dde8dd]'
    }`;

  return (
    <div className="min-h-screen bg-[#f5f7f0] font-sans">

      {/* ── Navbar ─────────────────────────────── */}
      <nav className="bg-white border-b border-[#dde8dd] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2ecc71] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <span className="font-bold text-[#1a2e1a]">PregnaCare</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-[#5a7a5a] hover:text-[#2ecc71] transition">
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm px-4 py-2 rounded-xl bg-[#2ecc71] text-white font-semibold hover:bg-[#27b860] transition"
          >
            Register
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* ── Header ───────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#e8f8ef] text-[#2ecc71] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            🩺 Doctor Application
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a2e1a] mb-2">
            Join PregnaCare as a Doctor
          </h1>
          <p className="text-[#5a7a5a] text-sm">
            Fill in your details. Your application will be reviewed by our admin team.
          </p>
        </div>

        {/* ── Step Indicator ───────────────────── */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {['Personal Info', 'Professional', 'Clinic & Schedule'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i + 1 === step
                  ? 'bg-[#2ecc71] text-white'
                  : i + 1 < step
                  ? 'bg-[#d4f5e2] text-[#2ecc71]'
                  : 'bg-[#dde8dd] text-[#8fba8f]'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                i + 1 === step ? 'text-[#1a2e1a]' : 'text-[#8fba8f]'
              }`}>
                {label}
              </span>
              {i < 2 && <div className="w-8 h-px bg-[#dde8dd]" />}
            </div>
          ))}
        </div>

        {/* ── Form Card ────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#dde8dd] p-8">

          {/* API Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-6">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {/* ── STEP 1: Personal Info ───────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#1a2e1a] mb-4">
                Personal Information
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">Full Name</label>
                {errors.fullName && <p className="text-red-500 text-xs mb-1">{errors.fullName}</p>}
                <input
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  onFocus={() => setFocused('fullName')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('fullName')}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">Email Address</label>
                {errors.email && <p className="text-red-500 text-xs mb-1">{errors.email}</p>}
                <input
                  type="email"
                  placeholder="doctor@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('email')}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">Password</label>
                {errors.password && <p className="text-red-500 text-xs mb-1">{errors.password}</p>}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className={inputClass('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8fba8f] hover:text-[#2ecc71]"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">Phone Number</label>
                {errors.phone && <p className="text-red-500 text-xs mb-1">{errors.phone}</p>}
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('phone')}
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Profile Image URL
                </label>
                {errors.profileImage && <p className="text-red-500 text-xs mb-1">{errors.profileImage}</p>}
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.profileImage}
                  onChange={(e) => update('profileImage', e.target.value)}
                  onFocus={() => setFocused('profileImage')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('profileImage')}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const errs = validateDoctorApply(form);
                  const stepErrs = {
                    ...(errs.fullName    && { fullName: errs.fullName }),
                    ...(errs.email       && { email: errs.email }),
                    ...(errs.password    && { password: errs.password }),
                    ...(errs.phone       && { phone: errs.phone }),
                    ...(errs.profileImage && { profileImage: errs.profileImage }),
                  };
                  if (Object.keys(stepErrs).length > 0) {
                    setErrors(stepErrs);
                    return;
                  }
                  setErrors({});
                  setStep(2);
                }}
                className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
                  text-white font-bold text-base shadow-lg shadow-green-200
                  transition-all duration-200"
              >
                Next →
              </button>
            </div>
          )}

          {/* ── STEP 2: Professional Info ───────── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#1a2e1a] mb-4">
                Professional Information
              </h2>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">Specialization</label>
                {errors.specialization && <p className="text-red-500 text-xs mb-1">{errors.specialization}</p>}
                <select
                  value={form.specialization}
                  onChange={(e) => update('specialization', e.target.value)}
                  className={inputClass('specialization')}
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">Qualification</label>
                {errors.qualification && <p className="text-red-500 text-xs mb-1">{errors.qualification}</p>}
                <input
                  type="text"
                  placeholder="MBBS, MD, etc."
                  value={form.qualification}
                  onChange={(e) => update('qualification', e.target.value)}
                  onFocus={() => setFocused('qualification')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('qualification')}
                />
              </div>

              {/* Experience + Fee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                    Years of Experience
                  </label>
                  {errors.experience && <p className="text-red-500 text-xs mb-1">{errors.experience}</p>}
                  <input
                    type="number"
                    placeholder="5"
                    min={0}
                    value={form.experience}
                    onChange={(e) => {
                        update(
                            'experience',
                            e.target.value === ''? 0 : Number(e.target.value)
                        )
                    }}
                    onFocus={() => setFocused('experience')}
                    onBlur={() => setFocused(null)}
                    className={inputClass('experience')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                    Consultation Fee ($)
                  </label>
                  {errors.consultationFee && <p className="text-red-500 text-xs mb-1">{errors.consultationFee}</p>}
                  <input
                    type="number"
                    placeholder="100"
                    min={0}
                    value={form.consultationFee}
                    onChange={(e)=> {
                        update(
                            'consultationFee',
                            e.target.value === '' ? 0 : Number(e.target.value)
                        )
                    }}
                    onFocus={() => setFocused('consultationFee')}
                    onBlur={() => setFocused(null)}
                    className={inputClass('consultationFee')}
                  />
                </div>
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Medical Registration Number
                </label>
                {errors.registrationNumber && <p className="text-red-500 text-xs mb-1">{errors.registrationNumber}</p>}
                <input
                  type="text"
                  placeholder="MED-123456"
                  value={form.registrationNumber}
                  onChange={(e) => update('registrationNumber', e.target.value)}
                  onFocus={() => setFocused('registrationNumber')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('registrationNumber')}
                />
              </div>

              {/* Documents */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Document URLs
                  <span className="text-[#8fba8f] font-normal ml-1">(license, degree)</span>
                </label>
                {errors.documents && <p className="text-red-500 text-xs mb-1">{errors.documents}</p>}
                <div className="space-y-2">
                  {form.documents.map((doc, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://..."
                        value={doc}
                        onChange={(e) => {
                          const docs = [...form.documents];
                          docs[i] = e.target.value;
                          update('documents', docs);
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#dde8dd]
                          bg-white text-sm outline-none focus:border-[#2ecc71]"
                      />
                      <button
                        type="button"
                        onClick={() => update('documents', form.documents.filter((_, idx) => idx !== i))}
                        className="px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update('documents', [...form.documents, ''])}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#dde8dd]
                      text-[#8fba8f] text-sm hover:border-[#2ecc71] hover:text-[#2ecc71] transition"
                  >
                    + Add Document URL
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl border-2 border-[#dde8dd]
                    text-[#5a7a5a] font-semibold hover:border-[#2ecc71]
                    hover:text-[#2ecc71] transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const errs = validateDoctorApply(form);
                    const stepErrs = {
                      ...(errs.specialization     && { specialization: errs.specialization }),
                      ...(errs.qualification      && { qualification: errs.qualification }),
                      ...(errs.experience         && { experience: errs.experience }),
                      ...(errs.consultationFee    && { consultationFee: errs.consultationFee }),
                      ...(errs.registrationNumber && { registrationNumber: errs.registrationNumber }),
                      ...(errs.documents          && { documents: errs.documents }),
                    };
                    if (Object.keys(stepErrs).length > 0) {
                      setErrors(stepErrs);
                      return;
                    }
                    setErrors({});
                    setStep(3);
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
                    text-white font-bold shadow-lg shadow-green-200 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Clinic & Schedule ───────── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#1a2e1a] mb-4">
                Clinic & Availability
              </h2>

              {/* Clinic Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Clinic / Hospital Name
                </label>
                {errors.clinicName && <p className="text-red-500 text-xs mb-1">{errors.clinicName}</p>}
                <input
                  type="text"
                  placeholder="City Maternity Hospital"
                  value={form.clinicName}
                  onChange={(e) => update('clinicName', e.target.value)}
                  onFocus={() => setFocused('clinicName')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('clinicName')}
                />
              </div>

              {/* Clinic Address */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Clinic Address
                </label>
                {errors.clinicAddress && <p className="text-red-500 text-xs mb-1">{errors.clinicAddress}</p>}
                <input
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={form.clinicAddress}
                  onChange={(e) => update('clinicAddress', e.target.value)}
                  onFocus={() => setFocused('clinicAddress')}
                  onBlur={() => setFocused(null)}
                  className={inputClass('clinicAddress')}
                />
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-2">
                  Available Days
                </label>
                {errors.availabilityDays && <p className="text-red-500 text-xs mb-2">{errors.availabilityDays}</p>}
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        form.availability.days.includes(day)
                          ? 'bg-[#2ecc71] text-white'
                          : 'bg-[#f0f4f0] text-[#5a7a5a] hover:bg-[#d4f5e2]'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                    Start Time
                  </label>
                  {errors.startTime && <p className="text-red-500 text-xs mb-1">{errors.startTime}</p>}
                  <input
                    type="time"
                    value={form.availability.startTime}
                    onChange={(e) => updateAvailability('startTime', e.target.value)}
                    onFocus={() => setFocused('startTime')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white
                      text-[#1a2e1a] outline-none transition-all duration-200 text-sm ${
                      errors.startTime
                        ? 'border-red-400'
                        : focused === 'startTime'
                        ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
                        : 'border-[#dde8dd]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                    End Time
                  </label>
                  {errors.endTime && <p className="text-red-500 text-xs mb-1">{errors.endTime}</p>}
                  <input
                    type="time"
                    value={form.availability.endTime}
                    onChange={(e) => updateAvailability('endTime', e.target.value)}
                    onFocus={() => setFocused('endTime')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white
                      text-[#1a2e1a] outline-none transition-all duration-200 text-sm ${
                      errors.endTime
                        ? 'border-red-400'
                        : focused === 'endTime'
                        ? 'border-[#2ecc71] shadow-[0_0_0_3px_rgba(46,204,113,0.15)]'
                        : 'border-[#dde8dd]'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 rounded-xl border-2 border-[#dde8dd]
                    text-[#5a7a5a] font-semibold hover:border-[#2ecc71]
                    hover:text-[#2ecc71] transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27b860]
                    text-white font-bold shadow-lg shadow-green-200 transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#a0b8a0] mt-6">
          Already applied?{' '}
          <Link to="/login" className="text-[#2ecc71] hover:underline font-semibold">
            Login to check status
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ApplyAsDoctorPage;