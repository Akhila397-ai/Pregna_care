import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingType } from '@/features/auth/types/auth.types';

interface ExploreArticlesHubProps {
  userJourney?: OnboardingType;
  onSelectJourney?: (type: 'trying' | 'pregnant') => void;
}

type CategoryType = 'All' | 'before' | 'pregnancy' | 'after' | 'womens';

const CATEGORIES: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'All', label: 'All Topics', icon: '✨' },
  { id: 'before', label: 'Before Pregnancy', icon: '🌱' },
  { id: 'pregnancy', label: 'Pregnancy', icon: '🤰' },
  { id: 'after', label: 'After Birth', icon: '👶' },
  { id: 'womens', label: 'Women’s Health', icon: '🩺' },
];

const ARTICLES = [
  // Before Pregnancy
  {
    id: 1,
    category: 'before',
    categoryName: 'Before Pregnancy',
    title: 'Understanding Your Cycle & Fertile Window',
    summary: 'How to track ovulation, basal body temperature, and fertile days naturally.',
    readTime: '3 min read',
    icon: '🌸',
  },
  {
    id: 2,
    category: 'before',
    categoryName: 'Before Pregnancy',
    title: 'Preparing for Pregnancy: Pre-Conception Steps',
    summary: 'Important vitamins, lifestyle habits, and checkups to complete before trying.',
    readTime: '4 min read',
    icon: '🌱',
  },
  {
    id: 3,
    category: 'before',
    categoryName: 'Before Pregnancy',
    title: 'Fertility Basics for Both Partners',
    summary: 'Simple steps couples can take together to optimize natural fertility.',
    readTime: '3 min read',
    icon: '✨',
  },

  // Pregnancy
  {
    id: 4,
    category: 'pregnancy',
    categoryName: 'Pregnancy',
    title: 'Pregnancy Week by Week: What to Expect',
    summary: 'A simple guide to maternal body changes and key baby milestones.',
    readTime: '5 min read',
    icon: '🤰',
  },
  {
    id: 5,
    category: 'pregnancy',
    categoryName: 'Pregnancy',
    title: 'Healthy Nutrition and Safe Foods',
    summary: 'Simple meal ideas packed with folate, iron, calcium, and DHA for baby development.',
    readTime: '4 min read',
    icon: '🥑',
  },
  {
    id: 6,
    category: 'pregnancy',
    categoryName: 'Pregnancy',
    title: 'Common Pregnancy Questions & Doctor Advice',
    summary: 'Answers to sleeping positions, gentle exercises, and when to reach out to your doctor.',
    readTime: '4 min read',
    icon: '👩‍⚕️',
  },

  // After Birth
  {
    id: 7,
    category: 'after',
    categoryName: 'After Birth',
    title: 'Newborn Care in the First 30 Days',
    summary: 'Soothing techniques, diapering, sleep safety, and understanding infant cues.',
    readTime: '4 min read',
    icon: '👶',
  },
  {
    id: 8,
    category: 'after',
    categoryName: 'After Birth',
    title: 'Breastfeeding & Feeding Basics',
    summary: 'Guidance on latching, feeding schedules, pumping, and feeding support.',
    readTime: '4 min read',
    icon: '🍼',
  },
  {
    id: 9,
    category: 'after',
    categoryName: 'After Birth',
    title: 'Postpartum Healing & Emotional Recovery',
    summary: 'Caring for your body and mind in the fourth trimester with compassionate support.',
    readTime: '5 min read',
    icon: '🌸',
  },

  // Women's Health
  {
    id: 10,
    category: 'womens',
    categoryName: 'Women’s Health',
    title: 'Understanding Your Periods & Cycle Health',
    summary: 'What healthy period length, flow, and hormonal fluctuations look like.',
    readTime: '3 min read',
    icon: '🩸',
  },
  {
    id: 11,
    category: 'womens',
    categoryName: 'Women’s Health',
    title: 'General Women’s Wellness & Screenings',
    summary: 'Essential annual checkups, pelvic health, and wellness routines.',
    readTime: '3 min read',
    icon: '🩺',
  },
];

export const ExploreArticlesHub: React.FC<ExploreArticlesHubProps> = ({
  userJourney,
  onSelectJourney,
}) => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = ARTICLES.filter((art) => {
    const matchCat = selectedCat === 'All' || art.category === selectedCat;
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Recommended articles based on user journey
  const getRecommendedArticles = () => {
    if (userJourney === 'pregnant') {
      return ARTICLES.filter((a) => a.category === 'pregnancy').slice(0, 2);
    }
    if (userJourney === 'trying') {
      return ARTICLES.filter((a) => a.category === 'before').slice(0, 2);
    }
    return ARTICLES.slice(0, 2);
  };

  const recommended = getRecommendedArticles();

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1">
            Explore PregnaCare
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            What would you like to learn about?
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <div className="relative">
            <input
              type="text"
              placeholder="Search topics (e.g. cycle, baby)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
              🔍
            </span>
          </div>
        </div>
      </div>

      {/* ── Recommended For You (Personalized) ───────────── */}
      {recommended.length > 0 && selectedCat === 'All' && !searchQuery && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 border border-emerald-500/20 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              ✨ Recommended for You
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Based on your {userJourney === 'pregnant' ? 'pregnancy' : userJourney === 'trying' ? 'conception' : 'explore'} journey
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {recommended.map((art) => (
              <div
                key={`rec-${art.id}`}
                className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-start gap-3.5 shadow-xs"
              >
                <span className="text-2xl shrink-0">{art.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{art.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{art.summary}</p>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2 block">
                    {art.readTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4 Categories Tabs ───────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
              selectedCat === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-emerald-400'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── Articles Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-xs hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{art.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)]">
                  {art.categoryName}
                </span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5 leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                {art.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{art.readTime}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Read Article →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start Prompt */}
      {onSelectJourney && (
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              Ready to start your personalized tracking?
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Choose your journey anytime to get weekly development updates or cycle countdowns.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onSelectJourney('trying')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              🌱 Plan for a Baby
            </button>
            <button
              type="button"
              onClick={() => onSelectJourney('pregnant')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
            >
              🤰 Track Pregnancy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
