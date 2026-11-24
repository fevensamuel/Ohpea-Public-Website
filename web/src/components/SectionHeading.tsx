/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SectionHeadingProps {
  pill?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
  className?: string;
}

export function SectionHeading({
  pill,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const isStart = align === 'start';

  return (
    <div className={`max-w-3xl ${isStart ? 'text-start' : 'mx-auto text-center'} ${className}`}>
      {pill && (
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#0B3D2E] dark:text-[#C9A24A] bg-[#0B3D2E]/10 dark:bg-[#C9A24A]/10 px-3 py-1 rounded-full mb-3 border border-[#0B3D2E]/15 dark:border-[#C9A24A]/20">
          {pill}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B3D2E] dark:text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
