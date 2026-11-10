import React from 'react';
import { CheckCircle2, Copy, Download, Home, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

interface SuccessPanelProps {
  memberNumber: string;
  fullName: string;
  email: string;
  phone: string;
}

export const SuccessPanel: React.FC<SuccessPanelProps> = ({
  memberNumber,
  fullName,
  email,
  phone,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(memberNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/30">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
        {t('form.successTitle')}
      </h2>

      <p className="text-stone-600 dark:text-stone-400 mt-3 text-sm sm:text-base leading-relaxed">
        {t('form.successDesc')}
      </p>

      {/* Member Reference Card */}
      <div className="my-8 p-6 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border-2 border-dashed border-amber-400/80 max-w-lg mx-auto">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
          {t('form.memberNo')}
        </span>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-800 dark:text-amber-400 tracking-wider">
            {memberNumber}
          </span>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:text-emerald-700 shadow-sm transition-colors"
            title="Copy Reference Number"
            aria-label="Copy Reference Number"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && (
          <span className="text-xs text-emerald-600 font-semibold block mt-1">
            {t('success.copied')}
          </span>
        )}
      </div>

      {/* Summary details */}
      <div className="text-xs text-left max-w-md mx-auto space-y-2 p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40 text-stone-700 dark:text-stone-300">
        <div className="flex justify-between">
          <span className="text-stone-500">{t('success.applicant')}:</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{fullName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{t('success.regPhone')}:</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{t('success.regEmail')}:</span>
          <span className="font-semibold text-stone-900 dark:text-stone-100">{email}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-emerald-200/40">
          <span className="text-stone-500">{t('success.status')}:</span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" /> {t('success.pendingReview')}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-md transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          {t('success.returnHome')}
        </Link>
        <Link
          to="/about"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold transition-colors text-sm"
        >
          {t('success.learnMore')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
