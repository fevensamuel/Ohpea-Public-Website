/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';

export function ShareButtons({ title, url }: { title: string; url?: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="font-bold text-slate-500 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" />
        <span>{t('common.share')}:</span>
      </span>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition text-[11px] font-medium"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <LinkIcon className="w-3 h-3" />}
        <span>{copied ? 'Copied' : 'Copy Link'}</span>
      </button>

      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
        className="px-2.5 py-1 rounded-md bg-[#229ED9]/15 text-[#229ED9] hover:bg-[#229ED9]/25 font-bold transition text-[11px]"
      >
        Telegram
      </a>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`}
        target="_blank"
        rel="noreferrer"
        className="px-2.5 py-1 rounded-md bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 font-bold transition text-[11px]"
      >
        WhatsApp
      </a>
    </div>
  );
}
