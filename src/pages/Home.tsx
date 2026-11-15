import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Users,
  Award,
  Globe,
  BookOpen,
  Shield,
  Briefcase,
  FileCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { useStats } from '../hooks/useStats.js';
import { StatCounter } from '../components/StatCounter.js';
import { SectionHeading } from '../components/SectionHeading.js';
import { ProgramCard } from '../components/ProgramCard.js';
import { AnnouncementCard } from '../components/AnnouncementCard.js';
import { NewsCard } from '../components/NewsCard.js';
import { EventCard } from '../components/EventCard.js';
import { PartnerGrid } from '../components/PartnerGrid.js';
import { CountdownTimer } from '../components/CountdownTimer.js';
import { NewsletterForm } from '../components/NewsletterForm.js';
import {
  fallbackAnnouncements,
  fallbackPartners,
  fallbackActivities,
} from '../data/fallbackContent.js';
import { api } from '../lib/ophea-api-client.js';

export const Home: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const { stats } = useStats();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [announcements, setAnnouncements] = useState<any[]>(fallbackAnnouncements);
  const [partners, setPartners] = useState<any[]>(fallbackPartners);
  const [activities, setActivities] = useState<any[]>(fallbackActivities);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    api
      .getPrograms()
      .then((data) => {
        if (mounted && Array.isArray(data)) setPrograms(data);
      })
      .catch(() => {});

    api
      .getAnnouncements({ limit: 12 })
      .then((res) => {
        if (mounted && res?.data?.length) setAnnouncements(res.data);
      })
      .catch(() => {});

    api
      .getPartners()
      .then((data) => {
        if (mounted && data?.length) setPartners(data);
      })
      .catch(() => {});

    api
      .getActivities()
      .then((data) => {
        if (mounted && data?.length) setActivities(data);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const [announcementTab, setAnnouncementTab] = useState<'all' | 'vacancy' | 'call_for_proposal' | 'call_for_research'>('all');
  const [eventTab, setEventTab] = useState<'upcoming' | 'past'>('upcoming');

  // Filtered data
  const newsItems = announcements.filter((a) => a.type === 'news');
  const featuredEvent = announcements.find((a) => a.type === 'event' && a.featured) || announcements.find((a) => a.type === 'event');

  const filteredAnnouncements = announcements.filter((a) => {
    if (a.type === 'news' || a.type === 'event') return false;
    if (announcementTab === 'all') return true;
    return (
      a.type === announcementTab ||
      (announcementTab === 'call_for_proposal' && a.type === 'proposal') ||
      (announcementTab === 'call_for_research' && a.type === 'research')
    );
  });

  const eventItems = announcements.filter((a) => {
    if (a.type !== 'event') return false;
    const isPast = a.eventStartAt ? new Date(a.eventStartAt).getTime() < Date.now() : false;
    return eventTab === 'past' ? isPast : !isPast;
  });

  const joinSteps = [
    { titleKey: 'joinStep1Title', descKey: 'joinStep1Desc', icon: FileCheck },
    { titleKey: 'joinStep2Title', descKey: 'joinStep2Desc', icon: Award },
    { titleKey: 'joinStep3Title', descKey: 'joinStep3Desc', icon: Shield },
    { titleKey: 'joinStep4Title', descKey: 'joinStep4Desc', icon: Users },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A24A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <span>{t('hero.ctaRegister')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all"
              >
                {t('hero.ctaAbout')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-stone-100 dark:divide-stone-800">
            <StatCounter value={(stats.totalMembers ?? 0)} label={t('stats.registeredMembers')} />
            <div className="pt-4 md:pt-0">
              <StatCounter value={(stats.accreditedHotels ?? 0)} label={t('stats.activeMembers')} />
            </div>
            <div className="pt-4 md:pt-0">
              <StatCounter value={(stats.certifiedGuides ?? 0)} label={t('stats.regionsRepresented')} />
            </div>
            <div className="pt-4 md:pt-0">
              <StatCounter value={(stats.trainingGraduates ?? 0)} label={t('stats.activitiesThisYear')} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Upcoming Featured Event Block */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-400/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl text-start">
                <span className="inline-block text-xs uppercase tracking-widest font-bold text-amber-400 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/30">
                  {t('countdown.nextEvent')}
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
                  {featuredEvent.title[language] || featuredEvent.title.en}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                  {featuredEvent.summary[language] || featuredEvent.summary.en}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-2">
                  {featuredEvent.eventStartAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{new Date(featuredEvent.eventStartAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {featuredEvent.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{featuredEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Countdown Component */}
              <div className="w-full lg:w-auto bg-stone-950/40 p-6 rounded-2xl border border-white/10 shrink-0">
                {featuredEvent.eventStartAt && (
                  <CountdownTimer targetDateString={featuredEvent.eventStartAt} />
                )}
                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/updates/${featuredEvent.slug}`}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
                  >
                    {t('common.readMore')}
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors"
                  >
                    {t('hero.ctaRegister')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Recent News & Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <SectionHeading
            align="start"
            title={t('home.recentNews')}
            subtitle={t('home.recentNewsDesc')}
          />
          <Link
            to="/updates"
            className="text-xs font-bold text-emerald-800 dark:text-amber-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t('common.viewAll')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.slice(0, 3).map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </section>

      {/* 6. Latest Announcements (Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <SectionHeading
            align="start"
            title={t('home.latestAnnouncements')}
            subtitle={t('home.latestAnnouncementsDesc')}
          />
          {/* Tab Selector */}
          <div className="flex flex-wrap gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            {(['all', 'vacancy', 'call_for_proposal', 'call_for_research'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAnnouncementTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  announcementTab === tab
                    ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab === 'all'
                  ? t('common.all')
                  : tab === 'vacancy'
                  ? t('nav.vacancies')
                  : tab === 'call_for_proposal'
                  ? t('nav.callsProposals')
                  : t('nav.callsResearch')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.slice(0, 6).map((item) => (
            <AnnouncementCard key={item.id} announcement={item} />
          ))}
        </div>
      </section>

      {/* 7. Don't Miss Out Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <SectionHeading
            align="start"
            title={t('home.upcomingEvents')}
            subtitle={t('home.upcomingEventsDesc')}
          />
          <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setEventTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                eventTab === 'upcoming'
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {t('home.upcomingTab')}
            </button>
            <button
              onClick={() => setEventTab('past')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                eventTab === 'past'
                  ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {t('home.pastTab')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventItems.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* 8. Strategic Pillars: 7 Programs */}
      <section className="bg-stone-50 dark:bg-stone-900/50 py-16 border-y border-stone-200/70 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            pill={t('home.strategicPillars')}
            title={t('home.strategicPillarsTitle')}
            subtitle={t('home.strategicPillarsDesc')}
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programs.map((prog, idx) => (
              <ProgramCard key={prog.id} program={prog} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. How to Join OPHEA (4 steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('home.howToJoinTitle')}
          subtitle={t('home.howToJoinSubtitle')}
          className="mb-12"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {joinSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs relative text-start"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                  {t(step.titleKey as any)}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {t(step.descKey as any)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors"
          >
            <span>{t('hero.ctaRegister')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. Our Institutional Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('home.partnersTitle')}
          className="mb-10"
        />
        <PartnerGrid partners={fallbackPartners} />
      </section>

      {/* 11. Recent Activities & Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t('home.recentActivitiesTitle')}
          className="mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fallbackActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition text-start flex flex-col"
            >
              <div className="h-40 bg-stone-100 dark:bg-stone-800 flex items-center justify-center p-4 border-b border-stone-200 dark:border-stone-800">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {act.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">
                    {new Date(act.activityDate).toLocaleDateString()}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-2">
                    {act.title[language] || act.title.en}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                    {act.description[language] || act.description.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. About Us Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2 block">
            {t('about.whoWeAre')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mb-4">
            {t('brandName')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed italic mb-8">
            &ldquo;{t('generalObjective')}&rdquo;
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-semibold text-sm hover:opacity-90 transition"
          >
            <span>{t('hero.ctaAbout')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 13. Stay Tuned (Newsletter) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 border border-emerald-800 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {t('home.stayTunedTitle')}
          </h2>
          <p className="text-sm text-emerald-100/90 max-w-xl mx-auto mb-6">
            {t('home.stayTunedSubtitle')}
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="banner" />
          </div>
        </div>
      </section>
    </div>
  );
};
