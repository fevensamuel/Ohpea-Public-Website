import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext';
import { useSiteSettings } from '../hooks/useSiteSettings';

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useTranslation();
  const isRtl = language === 'ar';
  const { settings } = useSiteSettings();
  const phone: string = settings.contactPhones?.[0] ?? '';
  const email: string = settings.contactEmails?.[0] ?? '';

  return (
    <div
      className={`fixed bottom-6 ${
        isRtl ? 'left-6' : 'right-6'
      } z-40 flex flex-col items-end print:hidden`}
    >
      {isOpen && (
        <div className="mb-3 w-72 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {t('contact.title')}
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg"
              aria-label="Close contact options"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="py-2 space-y-2 text-xs">
            {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
            >
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 rounded-md text-emerald-800 dark:text-emerald-300">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">{t('floating.hotline')}</p>
                <p className="text-stone-500 text-[11px]">{phone}</p>
              </div>
            </a>
            )}
            {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
            >
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 rounded-md text-emerald-800 dark:text-emerald-300">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">{t('floating.inquiries')}</p>
                <p className="text-stone-500 text-[11px]">{email}</p>
              </div>
            </a>
            )}
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
            >
              <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-md text-amber-800 dark:text-amber-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">{t('hero.ctaRegister')}</p>
                <p className="text-stone-500 text-[11px]">{t('floating.joinToday')}</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-amber-400"
        aria-label="Toggle contact help"
      >
        <MessageSquare className="w-5 h-5 text-amber-300" />
      </button>
    </div>
  );
};
