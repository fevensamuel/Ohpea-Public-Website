/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { api } from '../lib/ohpea-api-client.js';

export function NewsletterForm({ variant = 'banner' }: { variant?: 'banner' | 'footer' | 'compact' }) {
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await api.subscribeNewsletter({
        email,
        name: name || undefined,
        language: language === 'om' || language === 'am' ? language : 'en',
      });
      setStatus('success');
      setEmail('');
      setName('');
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{t('common.subscribed')}</span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#C9A24A]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#E8772E] hover:bg-[#CF6420] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer disabled:opacity-50"
        >
          {status === 'loading' ? '...' : <Send className="w-3.5 h-3.5" />}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5">
      <input
        type="text"
        placeholder={t('contact.name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-3 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#C9A24A] flex-1"
      />
      <input
        type="email"
        required
        placeholder={t('form.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#C9A24A] flex-1"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#E8772E] hover:bg-[#CF6420] text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-md shadow-orange-950/20 shrink-0 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        <span>{status === 'loading' ? t('common.subscribing') : t('common.notifyMe')}</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
