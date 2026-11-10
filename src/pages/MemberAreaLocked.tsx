import React, { useState } from 'react';
import { Lock, Mail, Bell, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';
import { LockedBadge } from '../components/LockedBadge.js';
import { api } from '../lib/ohpea-api-client.js';

export const MemberAreaLocked: React.FC = () => {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.subscribeNewsletter({
        email,
        language: language === 'om' || language === 'am' ? language : 'en',
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <PageBanner
        title={t('nav.memberArea')}
        subtitle={t('common.comingSoonDesc')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.memberArea') },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-block mb-3">
            <LockedBadge label={t('locked.phase4')} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white mb-3">
            {t('locked.memberAreaTitle')}
          </h2>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed mb-8">
            {t('locked.memberAreaDesc')}
          </p>

          <div className="p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto mb-8 text-xs text-stone-600 dark:text-stone-400 text-left space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>{t('locked.plannedFeatures')}:</span>
            </div>
            <p>&bull; {t('locked.feature1')}</p>
            <p>&bull; {t('locked.feature2')}</p>
            <p>&bull; {t('locked.feature3')}</p>
            <p>&bull; {t('locked.feature4')}</p>
          </div>

          {/* Notification signup */}
          <div className="max-w-md mx-auto">
            {subscribed ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('locked.notifySuccess')}</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="space-y-3">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                  {t('common.notifyMe')}
                </span>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('locked.enterEmail')}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition shrink-0"
                  >
                    {t('common.notifyMe')}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>{t('locked.notAMember')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
