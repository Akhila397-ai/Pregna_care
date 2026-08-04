import { useState, useRef } from 'react';
import { useNavigate }       from 'react-router-dom';
import { useDoctor }         from '../hooks/useDoctor';
import { useAppSelector }    from '../../../store/hooks';
import { DoctorApplyFormData } from '../types/doctor.types';

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
  const { user }                  = useAppSelector((state) => state.auth);
  const navigate                  = useNavigate();

  const [step,   setStep]   = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<DoctorApplyFormData>({
    fullName:           '',
    specialization:     '',
    qualification:      '',
    experience:         0,
    registrationNumber: '',
    consultationFee:    0,
    clinicName:         '',
    clinicAddress:      '',
    availability: {
      days:      [],
      startTime: '',
      endTime:   '',
    },
    profileImage: null,
    degreeCertificate:       null,
    registrationCertificate: null,
    governmentId:            null,
  });

  const profileRef = useRef<HTMLInputElement>(null);
  const degreeRef = useRef<HTMLInputElement>(null);
  const regRef    = useRef<HTMLInputElement>(null);
  const govRef    = useRef<HTMLInputElement>(null);

  const update = (key: keyof DoctorApplyFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const e = {...prev}; delete e[key]; return e; });
  };

  const toggleDay = (day: string) => {
    const days = form.availability.days.includes(day)
      ? form.availability.days.filter((d) => d !== day)
      : [...form.availability.days, day];
    setForm((prev) => ({
      ...prev,
      availability: { ...prev.availability, days },
    }));
  };

  const handleFileChange = (
    field: 'degreeCertificate' | 'registrationCertificate' | 'governmentId' | 'profileImage',
    file:  File | null
  ) => {
    if (!file) return;

    // validate on frontend too
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, [field]: 'File must be under 5MB.' }));
      return;
    }

    if (field === 'degreeCertificate' || field === 'registrationCertificate') {
      if (file.type !== 'application/pdf') {
        setErrors((prev) => ({
          ...prev,
          [field]: 'Only PDF files are allowed.',
        }));
        return;
      }
    } else {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowed.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [field]: 'Only PDF, JPG or PNG files are allowed.',
        }));
        return;
      }
    }

    update(field, file);
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if(!form.profileImage){
      errs.profileImage = 'ProfilImage required'
    }
    if (!form.degreeCertificate)
      errs.degreeCertificate = 'Degree certificate is required.';
    if (!form.registrationCertificate)
      errs.registrationCertificate = 'Registration certificate is required.';
    if (!form.governmentId)
      errs.governmentId = 'Government ID is required.';
    if (!form.availability.days.length)
      errs.days = 'Select at least one available day.';
    if (!form.availability.startTime)
      errs.startTime = 'Start time is required.';
    if (!form.availability.endTime)
      errs.endTime = 'End time is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    await apply(form);
  };

  const FileUploadField = ({
    field,
    label,
    accept,
    hint,
    inputRef,
  }: {
    field:    'degreeCertificate' | 'registrationCertificate' | 'governmentId' | 'profileImage';
    label:    string;
    accept:   string;
    hint:     string;
    inputRef:      React.RefObject<HTMLInputElement | null>;
  }) => {
    const file = form[field] as File | null;
    return (
      <div>
        <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
          {label}
          <span className="text-[#8fba8f] font-normal ml-1">({hint})</span>
        </label>
        {errors[field] && (
          <p className="text-red-500 text-xs mb-1">{errors[field]}</p>
        )}
        <div
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer
            transition-all duration-200 text-center ${
            file
              ? 'border-[#2ecc71] bg-[#e8f8ef]'
              : errors[field]
              ? 'border-red-400 bg-red-50'
              : 'border-[#dde8dd] bg-white hover:border-[#2ecc71] hover:bg-[#f5fbf7]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2ecc71] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1a2e1a]">
                  {file.name}
                </p>
                <p className="text-xs text-[#5a7a5a]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB — Click to replace
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f0f4f0] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#8fba8f]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#5a7a5a]">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-[#8fba8f] mt-1">
                {hint} — Max 5MB
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-white text-[#1a2e1a]
     placeholder-[#b0c8b0] outline-none transition-all duration-200 text-sm ${
    errors[field] ? 'border-red-400' : 'border-[#dde8dd] focus:border-[#2ecc71]'
  }`;

  return (
    <div className="min-h-screen bg-[#f5f7f0] font-sans">

      {/* Navbar */}
      <nav className="bg-white border-b border-[#dde8dd] px-8 py-4
        flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2ecc71]
            flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white"
              fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <span className="font-bold text-[#1a2e1a]">PregnaCare</span>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="text-sm text-[#5a7a5a] hover:text-[#2ecc71] transition"
        >
          ← Back
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#e8f8ef]
            text-[#2ecc71] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            🩺 Doctor Application
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a2e1a] mb-2">
            Apply as a Doctor
          </h1>
          {user && (
            <div className="inline-flex items-center gap-2 bg-white
              border border-[#dde8dd] rounded-xl px-4 py-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-[#d4f5e2]
                flex items-center justify-center text-[#2ecc71]
                font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-[#5a7a5a]">
                Applying as{' '}
                <span className="font-semibold text-[#1a2e1a]">
                  {user.name}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Professional', 'Clinic', 'Documents & Schedule'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center
                justify-center text-xs font-bold transition-all ${
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
              {i < 2 && <div className="w-6 h-px bg-[#dde8dd]" />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border
          border-[#dde8dd] p-8">

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500
              bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-6">
              {error}
            </div>
          )}

          {/* ── STEP 1 ─────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#1a2e1a] mb-4">
                Professional Information
              </h2>

              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Full Name
                </label>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mb-1">{errors.fullName}</p>
                )}
                <input
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className={inputCls('fullName')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Specialization
                </label>
                <select
                  value={form.specialization}
                  onChange={(e) => update('specialization', e.target.value)}
                  className={inputCls('specialization')}
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Qualification
                </label>
                <input
                  type="text"
                  placeholder="MBBS, MD, etc."
                  value={form.qualification}
                  onChange={(e) => update('qualification', e.target.value)}
                  className={inputCls('qualification')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) => update('experience', Number(e.target.value))}
                    className={inputCls('experience')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.consultationFee}
                    onChange={(e) => update('consultationFee', Number(e.target.value))}
                    className={inputCls('consultationFee')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Medical Registration Number
                </label>
                <input
                  type="text"
                  placeholder="MED-123456"
                  value={form.registrationNumber}
                  onChange={(e) => update('registrationNumber', e.target.value)}
                  className={inputCls('registrationNumber')}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const e: Record<string, string> = {};
                  if (!form.fullName.trim()) e.fullName = 'Required.';
                  if (!form.specialization) e.specialization = 'Required.';
                  if (!form.qualification.trim()) e.qualification = 'Required.';
                  if (!form.registrationNumber.trim()) e.registrationNumber = 'Required.';
                  if (Object.keys(e).length > 0) { setErrors(e); return; }
                  setErrors({});
                  setStep(2);
                }}
                className="w-full py-3.5 rounded-xl bg-[#2ecc71]
                  hover:bg-[#27b860] text-white font-bold text-base
                  shadow-lg shadow-green-200 transition"
              >
                Next →
              </button>
            </div>
          )}

          {/* ── STEP 2 ─────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#1a2e1a] mb-4">
                Clinic Details
              </h2>

              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Clinic / Hospital Name
                </label>
                <input
                  type="text"
                  placeholder="City Maternity Hospital"
                  value={form.clinicName}
                  onChange={(e) => update('clinicName', e.target.value)}
                  className={inputCls('clinicName')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                  Clinic Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={form.clinicAddress}
                  onChange={(e) => update('clinicAddress', e.target.value)}
                  className={inputCls('clinicAddress')}
                />
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
                    const e: Record<string, string> = {};
                    if (!form.clinicName.trim()) e.clinicName = 'Required.';
                    if (!form.clinicAddress.trim()) e.clinicAddress = 'Required.';
                    if (Object.keys(e).length > 0) { setErrors(e); return; }
                    setErrors({});
                    setStep(3);
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-[#2ecc71]
                    hover:bg-[#27b860] text-white font-bold transition
                    shadow-lg shadow-green-200"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ─────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#1a2e1a] mb-2">
                Documents & Availability
              </h2>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2d4a2d]">
                  Required Documents
                </h3>

                <FileUploadField 
                field='profileImage'
                label='Profile Image'
                accept='image/jpeg,image/png,image/jpg'
                hint='JPG or PNG'
                inputRef={profileRef}
                 />

                <FileUploadField
                  field="degreeCertificate"
                  label="Medical Degree Certificate"
                  accept="application/pdf"
                  hint="PDF only"
                  inputRef={degreeRef}
                />

                <FileUploadField
                  field="registrationCertificate"
                  label="Medical Registration Certificate"
                  accept="application/pdf"
                  hint="PDF only"
                  inputRef={regRef}
                />

                <FileUploadField
                  field="governmentId"
                  label="Government ID"
                  accept="application/pdf,image/jpeg,image/png"
                  hint="PDF, JPG or PNG"
                  inputRef={govRef}
                />
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2d4a2d]">
                  Availability
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-[#2d4a2d] mb-2">
                    Available Days
                  </label>
                  {errors.days && (
                    <p className="text-red-500 text-xs mb-2">{errors.days}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold
                          transition ${
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                      Start Time
                    </label>
                    {errors.startTime && (
                      <p className="text-red-500 text-xs mb-1">{errors.startTime}</p>
                    )}
                    <input
                      type="time"
                      value={form.availability.startTime}
                      onChange={(e) => setForm((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, startTime: e.target.value }
                      }))}
                      className={inputCls('startTime')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2d4a2d] mb-1.5">
                      End Time
                    </label>
                    {errors.endTime && (
                      <p className="text-red-500 text-xs mb-1">{errors.endTime}</p>
                    )}
                    <input
                      type="time"
                      value={form.availability.endTime}
                      onChange={(e) => setForm((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, endTime: e.target.value }
                      }))}
                      className={inputCls('endTime')}
                    />
                  </div>
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
                  className="flex-1 py-3.5 rounded-xl bg-[#2ecc71]
                    hover:bg-[#27b860] text-white font-bold shadow-lg
                    shadow-green-200 transition disabled:opacity-50
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none"
                        viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Uploading...
                    </>
                  ) : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyAsDoctorPage;