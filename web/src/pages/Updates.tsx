import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';
import { AnnouncementCard } from '../components/AnnouncementCard.js';
import { NewsCard } from '../components/NewsCard.js';
import { EventCard } from '../components/EventCard.js';
import { api, Announcement, ApiMeta } from '../lib/ophea-api-client.js';

export const Updates: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const [searchParams] = useSearchParams();
  const validTabs = [
    'all',
    'news',
    'event',
    'vacancy',
    'call_for_proposal',
    'call_for_research',
  ] as const;
  type Tab = (typeof validTabs)[number];
  const getTabFromSearchParams = (): Tab => {
    const type = searchParams.get('type');
    return validTabs.find((tab) => tab === type) || 'all';
  };
  const [activeTab, setActiveTab] = useState<
    Tab
  >(getTabFromSearchParams);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [meta, setMeta] = useState<ApiMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all', labelKey: 'common.all' },
    { id: 'news', labelKey: 'nav.news' },
    { id: 'event', labelKey: 'nav.events' },
    { id: 'vacancy', labelKey: 'nav.vacancies' },
    { id: 'call_for_proposal', labelKey: 'nav.callsProposals' },
    { id: 'call_for_research', labelKey: 'nav.callsResearch' },
  ] as const;

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setPage(1);
  };

  useEffect(() => {
    setActiveTab(getTabFromSearchParams());
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const queryType: Announcement['type'] | undefined =
      activeTab === 'all'
        ? undefined
        : activeTab === 'call_for_proposal'
        ? 'proposal'
        : activeTab === 'call_for_research'
        ? 'research'
        : (activeTab as Announcement['type']);

    api
      .getAnnouncements({ type: queryType, limit: 10, page })
      .then((res) => {
        if (mounted && res && Array.isArray(res.data)) {
          setAnnouncements(res.data);
          setMeta(res.meta);
        }
      })
      .catch(() => {
        if (mounted) {
          setAnnouncements([]);
          setMeta({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, page]);

  const displayedItems = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const q = searchQuery.toLowerCase();
    return announcements.filter((item) => {
      const title = (
        typeof item.title === 'string'
          ? item.title
          : (item.title as any)?.[language] || (item.title as any)?.en || ''
      ).toLowerCase();
      const summary = (
        typeof item.summary === 'string'
          ? item.summary
          : (item.summary as any)?.[language] || (item.summary as any)?.en || ''
      ).toLowerCase();
      return title.includes(q) || summary.includes(q);
    });
  }, [announcements, searchQuery, language]);

  return (
    <div className="space-y-12 pb-16">
      <PageBanner
        title={t('nav.updates')}
        subtitle={t('updates.subtitle')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.updates') },
        ]}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-1 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-amber-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {t(tab.labelKey as any)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-stone-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
            <span className="text-xs font-medium">{t('common.loading', 'Loading…')}</span>
          </div>
        )}

        {!loading && displayedItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <p className="text-sm text-stone-500">
              {t('updates.noResults', 'No updates found')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => {
              if (item.type === 'news') {
                return <NewsCard key={item.id} news={item as any} />;
              }
              if (item.type === 'event') {
                return <EventCard key={item.id} event={item as any} />;
              }
              return <AnnouncementCard key={item.id} announcement={item as any} />;
            })}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500">
              Showing <span className="font-semibold text-stone-900 dark:text-stone-100">{(meta.page - 1) * meta.pageSize + 1}</span> - <span className="font-semibold text-stone-900 dark:text-stone-100">{Math.min(meta.page * meta.pageSize, meta.total)}</span> of <span className="font-semibold text-stone-900 dark:text-stone-100">{meta.total}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => {
                      setPage(pNum);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                      meta.page === pNum
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={meta.page >= meta.totalPages}
                onClick={() => {
                  setPage((p) => Math.min(meta.totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};