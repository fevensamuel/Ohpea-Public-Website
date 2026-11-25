import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Linkedin, Send, Twitter } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext.js';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { api } from '../../lib/ophea-api-client.js';
import { localize } from '../../utils/localize.js';
import { ORG_NAME } from './content.js';

/* ---------- social icons (Facebook / Instagram / YouTube drawn as in the design) ---------- */
function SocialIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes('facebook')) return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.5l.5-3H13V9.5c0-.28.22-.5.5-.5z" /></svg>
  );
  if (n.includes('instagram')) return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  );
  if (n.includes('youtube')) return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.4-4.8zM10 15.2V8.8L15.6 12 10 15.2z" /></svg>
  );
  if (n.includes('linkedin')) return <Linkedin className="w-4 h-4" aria-hidden="true" />;
  if (n === 'x' || n.includes('twitter')) return <Twitter className="w-4 h-4" aria-hidden="true" />;
  if (n.includes('telegram')) return <Send className="w-4 h-4" aria-hidden="true" />;
  return <Globe className="w-4 h-4" aria-hidden="true" />;
}

/* ---------- newsletter (same endpoint + payload as the existing NewsletterForm) ---------- */
function FooterNewsletter() {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await api.subscribeNewsletter({ email, language: language === 'om' || language === 'am' ? language : 'en' });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <p role="status" className="text-sm text-olive font-semibold">{t('common.subscribed', 'Thank you — you are subscribed.')}</p>;
  }

  return (
    <form onSubmit={submit} className="max-w-md">
      <label htmlFor="ohp-newsletter-email" className="font-body font-bold text-xs tracking-wide text-ink block mb-3">
        {t('home.stayTunedTitle', 'Stay tuned')}
      </label>
      <div className="flex border-b border-ink/40 focus-within:border-ink transition">
        <input
          id="ohp-newsletter-email" type="email" required autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder={t('form.email', 'Email address')}
          className="flex-1 bg-transparent py-3 text-[13px] text-ink placeholder:text-ink/45 focus:outline-hidden"
        />
        <button type="submit" disabled={status === 'loading'} data-cursor="link"
          className="px-1 pl-4 text-xs font-semibold tracking-[0.16em] uppercase whitespace-nowrap hover:text-ochre transition disabled:opacity-50">
          {status === 'loading' ? t('common.subscribing', '…') : 'Subscribe →'}
        </button>
      </div>
      {status === 'error' && <p role="alert" className="mt-2 text-xs text-ochre-dark">Something went wrong. Please try again.</p>}
    </form>
  );
}

export function HomeFooter() {
  const { t, language } = useTranslation();
  const { settings } = useSiteSettings();

  const phones: string[] = settings.contactPhones ?? [];
  const emails: string[] = settings.contactEmails ?? [];
  const address = localize(settings.address, language);
  const socialLinks = Object.entries((settings.socialLinks ?? settings.social ?? {}) as Record<string, string>)
    .filter(([, v]) => typeof v === 'string' && /^https?:\/\//i.test(v));
  const hasContact = !!address || phones.length > 0 || emails.length > 0 || socialLinks.length > 0;
  const year = new Date().getFullYear();

  const linkCls = 'block text-ink/70 hover:text-ink transition';
  const headCls = 'font-body font-semibold text-[11px] tracking-[0.18em] uppercase text-ink/45 mb-5';

  return (
    <footer className="bg-footerbg text-ink pt-20 md:pt-24 overflow-hidden relative font-body">
      <div className="max-w-[1260px] mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-14 md:gap-10">
        {/* Statement + newsletter */}
        <div className="md:col-span-5">
          <h2 className="leading-[1.1] mb-9">
            <span className="block font-body font-bold text-2xl sm:text-[28px] tracking-tight">Bring your experience.</span>
            <span className="block font-display font-normal text-3xl sm:text-[34px]">find your people, shape what comes next.</span>
          </h2>
          <FooterNewsletter />
        </div>

        {/* Links + contact */}
        <div className={`md:col-span-7 grid grid-cols-2 ${hasContact ? 'lg:grid-cols-3' : ''} gap-10 text-[13px] content-start`}>
          <nav aria-label="Explore" className="space-y-3">
            <p className={headCls}>Explore</p>
            <Link to="/about" data-cursor="link" className={linkCls}>{t('nav.about', 'About')}</Link>
            <Link to="/programs" data-cursor="link" className={linkCls}>{t('nav.programs', 'Programs')}</Link>
            <Link to="/membership" data-cursor="link" className={linkCls}>{t('nav.membership', 'Membership')}</Link>
            <Link to="/updates" data-cursor="link" className={linkCls}>{t('nav.updates', 'Updates')}</Link>
            <Link to="/contact" data-cursor="link" className={linkCls}>{t('nav.contact', 'Contact')}</Link>
          </nav>

          <nav aria-label="Association" className="space-y-3">
            <p className={headCls}>Association</p>
            <Link to="/#stories" data-cursor="link" className={linkCls}>Activities &amp; Impact</Link>
            <Link to="/about#mission-vision" data-cursor="link" className={linkCls}>Mission &amp; Vision</Link>
            <Link to="/about#partners" data-cursor="link" className={linkCls}>Partners</Link>
            <Link to="/register" data-cursor="link" className={`${linkCls} text-ink font-semibold`}>Join the Association</Link>
          </nav>

          {hasContact && (
            <div className="col-span-2 lg:col-span-1 space-y-3">
              <p className={headCls}>{t('footer.colContact', 'Contact')}</p>
              {address && <p className="text-ink/70 leading-relaxed">{address}</p>}
              {phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} dir="ltr" data-cursor="link" className={linkCls}>{p}</a>
              ))}
              {emails.map((m) => (
                <a key={m} href={`mailto:${m}`} data-cursor="link" className={linkCls}>{m}</a>
              ))}
              {socialLinks.length > 0 && (
                <ul className="flex flex-wrap gap-2.5 pt-3" aria-label="Social media">
                  {socialLinks.map(([name, url]) => (
                    <li key={name}>
                      <a href={url} target="_blank" rel="noopener noreferrer" aria-label={name} title={name} data-cursor="link"
                        className="w-9 h-9 rounded-full border border-ink/30 flex items-center justify-center hover:bg-ink hover:text-white transition">
                        <SocialIcon name={name} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legal bar */}
      <div className="max-w-[1260px] mx-auto px-6 md:px-12 mt-16 md:mt-20 pb-10">
        <div className="border-t border-ink/10 pt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-xs text-ink/55">
          <p>&copy; {year} {ORG_NAME}. {t('footer.rights', 'All rights reserved.')}</p>
          <p className="flex items-center gap-6">
            <Link to="/privacy" data-cursor="link" className="hover:text-ink transition">{t('footer.privacy', 'Privacy Policy')}</Link>
            <Link to="/terms" data-cursor="link" className="hover:text-ink transition">{t('footer.terms', 'Terms & Conditions')}</Link>
          </p>
        </div>
      </div>

      {/* Monumental cropped serif wordmark — the full institutional name, scrolling continuously */}
      <div className="select-none pointer-events-none overflow-hidden leading-[0.76]" aria-hidden="true">
        <div className="ohp-marquee-track font-display font-normal uppercase text-white tracking-[0.04em] text-[13vw] md:text-[11.5vw] whitespace-nowrap translate-y-[12%]">
          {[0, 1].map((g) => (
            <span key={g} className="shrink-0 flex">
              <span className="pr-[0.3em]">{ORG_NAME}</span>
              <span className="pr-[0.3em]">·</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
