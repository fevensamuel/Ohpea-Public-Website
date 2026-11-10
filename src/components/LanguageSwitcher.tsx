/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { StandardLanguage, LanguageOption } from '../i18n/config.js';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle';
  className?: string;
}

export function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, currentOption, languages, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside and Esc key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const orderedLanguages: LanguageOption[] = [
    languages.en,
    languages.om,
    languages.am,
    languages.ar,
    languages.fr,
  ];

  if (variant === 'toggle') {
    return (
      <div className={`flex flex-wrap gap-1.5 p-1 bg-black/10 dark:bg-white/10 rounded-xl ${className}`}>
        {orderedLanguages.map((opt) => {
          const isActive = language === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              aria-pressed={isActive}
              onClick={() => setLanguage(opt.code)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
              } ${opt.fontClass}`}
            >
              <span className="text-sm">{opt.flag}</span>
              <span>{opt.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-start ${className}`} ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-100 bg-white/10 hover:bg-white/20 border border-white/15 transition cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <span>{currentOption.flag}</span>
        <span className={`font-semibold ${currentOption.fontClass}`}>{currentOption.nativeLabel}</span>
        <span className="text-white/60 text-[10px]">({currentOption.code.toUpperCase()})</span>
        <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute top-full mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 ${
            isRtl ? 'start-0' : 'end-0'
          }`}
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Select Language / Afaan Oromoo / ቋንቋ / اللغة / Langue
          </div>

          <div className="p-1 space-y-0.5">
            {orderedLanguages.map((opt) => {
              const isActive = language === opt.code;
              return (
                <button
                  key={opt.code}
                  role="option"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition cursor-pointer text-start ${
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{opt.flag}</span>
                    <div>
                      <div className={`font-bold text-sm ${opt.fontClass}`}>{opt.nativeLabel}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {opt.label} • {opt.code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
