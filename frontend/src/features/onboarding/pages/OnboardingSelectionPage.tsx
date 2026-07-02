import { useAuth } from '../../auth/hooks/useAuth';
import { OnboardingType } from '../../auth/types/auth.types';

const OPTIONS: {
  type:        OnboardingType;
  icon:        string;
  title:       string;
  desc:        string;
  color:       string;
  borderColor: string;
  iconBg:      string;
}[] = [
  {
    type:        'pregnant',
    icon:        '🤰',
    title:       'I am Pregnant',
    desc:        'Track your pregnancy week by week, monitor baby development and manage appointments.',
    color:       'hover:bg-pink-50',
    borderColor: 'hover:border-pink-300',
    iconBg:      'bg-pink-100',
  },
  {
    type:        'trying',
    icon:        '💝',
    title:       'Trying to Conceive',
    desc:        'Track your cycle, ovulation and fertile window to increase your chances.',
    color:       'hover:bg-purple-50',
    borderColor: 'hover:border-purple-300',
    iconBg:      'bg-purple-100',
  },
  {
    type:        'doctor',
    icon:        '🩺',
    title:       'I am a Doctor',
    desc:        'Apply to join our medical team and help expecting mothers.',
    color:       'hover:bg-green-50',
    borderColor: 'hover:border-green-300',
    iconBg:      'bg-green-100',
  },
  {
    type:        'exploring',
    icon:        '🔍',
    title:       'Just Exploring',
    desc:        'Browse our platform, read health articles and explore features at your own pace.',
    color:       'hover:bg-blue-50',
    borderColor: 'hover:border-blue-300',
    iconBg:      'bg-blue-100',
  },
];

const OnboardingSelectionPage = () => {
  const { user, selectOnboarding, loading, logoutUser } = useAuth();

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
          onClick={logoutUser}
          className="text-sm text-[#5a7a5a] hover:text-red-500 transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          {user && (
            <div className="inline-flex items-center gap-2 bg-white
              border border-[#dde8dd] rounded-full px-4 py-2 mb-6">
              <div className="w-7 h-7 rounded-full bg-[#d4f5e2]
                flex items-center justify-center text-[#2ecc71]
                font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-[#5a7a5a]">
                Welcome,{' '}
                <span className="font-semibold text-[#1a2e1a]">
                  {user.name}
                </span>
              </span>
            </div>
          )}
          <h1 className="text-3xl lg:text-4xl font-extrabold
            text-[#1a2e1a] leading-tight mb-4">
            What brings you<br />to PregnaCare?
          </h1>
          <p className="text-[#5a7a5a] text-base max-w-sm mx-auto">
            Choose the option that best describes you.
            We'll personalize your experience accordingly.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => selectOnboarding(option.type)}
              disabled={loading}
              className={`bg-white rounded-2xl p-6 border-2 border-[#dde8dd]
                text-left transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-[0.98]
                ${option.color} ${option.borderColor}`}
            >
              <div className={`w-14 h-14 rounded-2xl ${option.iconBg}
                flex items-center justify-center mb-4`}>
                <span className="text-3xl">{option.icon}</span>
              </div>
              <h3 className="text-base font-bold text-[#1a2e1a] mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-[#5a7a5a] leading-relaxed">
                {option.desc}
              </p>
              <div className="mt-4 flex items-center gap-1
                text-[#2ecc71] text-sm font-semibold">
                Select
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-[#a0b8a0] mt-8">
          You can change this later in your profile settings.
        </p>
      </div>
    </div>
  );
};

export default OnboardingSelectionPage;