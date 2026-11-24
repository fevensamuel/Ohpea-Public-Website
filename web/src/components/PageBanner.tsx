/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';

interface BreadcrumbItem {
  label: string;
  href?: string;
  to?: string;
}

export function PageBanner({ title, subtitle, breadcrumbs = [] }: { title: string; subtitle?: string; breadcrumbs?: BreadcrumbItem[] }) {
  const { t, isRtl } = useTranslation();

  return (
    <div className="relative bg-gradient-to-r from-[#0B3D2E] via-[#14573F] to-[#0B3D2E] text-white py-14 lg:py-16 overflow-hidden border-b border-[#C9A24A]/25">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A24A_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-start">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-300 mb-4 flex-wrap">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-white transition">
            <Home className="w-3.5 h-3.5" />
            <span>{t('nav.home')}</span>
          </Link>
          {breadcrumbs.map((b, i) => {
            const target = b.href || b.to;
            return (
              <React.Fragment key={i}>
                <ChevronRight className={`w-3 h-3 text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
                {target ? (
                  <Link to={target} className="hover:text-white transition">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-[#C9A24A] font-semibold">{b.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
