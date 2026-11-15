import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink, Globe } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePrograms } from '../hooks/usePrograms';
import { localize } from '../utils/localize';

export const Footer: React.FC = () => {
  const { t, language } = useTranslation();
  const { settings } = useSiteSettings();
  const programs = usePrograms();
  const phones: string[] = settings.contactPhones ?? [];
  const emails: string[] = settings.contactEmails ?? [];
  const address = localize(settings.address, language);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-sm text-emerald-200/80 leading-relaxed pt-2">
              {t('brandTagline')}
            </p>
            <div className="pt-2 space-y-2 text-sm text-emerald-200/90">
              {address && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{address}</span>
                </div>
              )}
              {phones.length > 0 && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span dir="ltr">
                    {phones.map((p, i) => (
                      <React.Fragment key={p}>
                        {i > 0 && ' / '}
                        <a href={`tel:${p.replace(/\s+/g, '')}`} className="hover:text-amber-300 transition-colors">{p}</a>
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              )}
              {emails.length > 0 && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`mailto:${emails[0]}`} className="hover:text-amber-300 transition-colors">{emails[0]}</a>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Programs */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 uppercase tracking-wider mb-4">
              {t('footer.colPrograms')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {programs.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/programs/${p.slug}`}
                    className="hover:text-amber-300 transition-colors flex items-center justify-between group"
                  >
                    <span>{localize(p.title, language)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 uppercase tracking-wider mb-4">
              {t('footer.colLinks')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-amber-300 transition-colors">
                  {t('nav.membership')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-amber-400 font-medium hover:text-amber-300 transition-colors">
                  {t('hero.ctaRegister')}
                </Link>
              </li>
              <li>
                <Link to="/updates" className="hover:text-amber-300 transition-colors">
                  {t('nav.updates')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 uppercase tracking-wider mb-4">
              {t('footer.colContact')}
            </h3>
            <p className="text-sm text-emerald-200/80 mb-4">
              {t('home.stayTunedSubtitle')}
            </p>
            <NewsletterForm variant="compact" />
          </div>
        </div>

        {/* Bottom separator */}
        <div className="border-t border-emerald-900 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <div>
            &copy; {currentYear} {t('brandName')}. {t('footer.rights')}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-amber-300 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-amber-300 transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
