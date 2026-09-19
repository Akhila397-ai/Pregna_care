import { useAuth } from '../../auth/hooks/useAuth';
import { OnboardingType } from '../../auth/types/auth.types';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

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
    color:       'hover:bg-pink-50 dark:hover:bg-pink-950/30',
    borderColor: 'hover:border-pink-300 dark:hover:border-pink-700',
    iconBg:      'bg-pink-100 dark:bg-pink-950/60',
  },
  {
    type:        'trying',
    icon:        '💝',
    title:       'Trying to Conceive',
    desc:        'Track your cycle, ovulation and fertile window to increase your chances.',
    color:       'hover:bg-purple-50 dark:hover:bg-purple-950/30',
    borderColor: 'hover:border-purple-300 dark:hover:border-purple-700',
    iconBg:      'bg-purple-100 dark:bg-purple-950/60',
  },
  {
    type:        'doctor',
    icon:        '🩺',
    title:       'I am a Doctor',
    desc:        'Apply to join our medical team and help expecting mothers.',
    color:       'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    borderColor: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    iconBg:      'bg-emerald-100 dark:bg-emerald-950/60',
  },
  {
    type:        'exploring',
    icon:        '🔍',
    title:       'Just Exploring',
    desc:        'Browse our platform, read health articles and explore features at your own pace.',
    color:       'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    borderColor: 'hover:border-blue-300 dark:hover:border-blue-700',
    iconBg:      'bg-blue-100 dark:bg-blue-950/60',
  },
];

const OnboardingSelectionPage = () => {
  const { user, selectOnboarding, loading, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-200">
      {/* Navbar */}
      <nav className="bg-[var(--bg-surface)] border-b border-[var(--border-primary)] px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 002 0v-6h6a1 1 0 000-2z"/>
            </svg>
          </div>
          <span className="font-bold text-[var(--text-primary)]">PregnaCare</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={logoutUser}
            className="text-sm text-[var(--text-secondary)] hover:text-rose-500 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          {user && (
            <div className="inline-flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full px-4 py-2 mb-6 shadow-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                Welcome,{' '}
                <span className="font-semibold text-[var(--text-primary)]">
                  {user.name}
                </span>
              </span>
            </div>
          )}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] leading-tight mb-4">
            What brings you<br />to PregnaCare?
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-sm mx-auto">
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
              className={`bg-[var(--bg-card)] rounded-2xl p-6 border-2 border-[var(--border-primary)]
                text-left transition-all duration-200 cursor-pointer shadow-xs
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-[0.98]
                ${option.color} ${option.borderColor}`}
            >
              <div className={`w-14 h-14 rounded-2xl ${option.iconBg} flex items-center justify-center mb-4`}>
                <span className="text-3xl">{option.icon}</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {option.desc}
              </p>
              <div className="mt-4 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                Select
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          You can change this later in your profile settings.
        </p>
      </div>
    </div>
  );
};

export default OnboardingSelectionPage;