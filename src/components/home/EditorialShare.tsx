import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext.js';

/** Same behaviour as ShareButtons (copy link · Telegram · WhatsApp), editorial styling. */
export function EditorialShare({ title, url }: { title: string; url?: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const cls = 'text-[11px] font-semibold tracking-[0.16em] uppercase border-b border-ink/30 pb-0.5 hover:border-ink transition';
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink/45">{t('common.share')}</span>
      <button type="button" onClick={copyLink} data-cursor="link" className={cls} aria-live="polite">{copied ? 'Copied' : 'Copy link'}</button>
      <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" data-cursor="link" className={cls}>Telegram</a>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`} target="_blank" rel="noreferrer" data-cursor="link" className={cls}>WhatsApp</a>
    </div>
  );
}
