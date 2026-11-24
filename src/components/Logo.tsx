import React from 'react';
import { Link } from 'react-router-dom';

export function Logo({ variant = 'default', className = '' }: { variant?: 'default' | 'white' | 'light'; size?: string; className?: string }) {
  const light = variant === 'white' || variant === 'light';
  return (
    <Link to="/" aria-label="OHPEA - Oromia Hospitality Professionals and Entrepreneurs Association" className={`flex items-center gap-3 group text-start ${className}`}>
      <img src="/ohpea-mark.png" alt="OHPEA emblem" className="h-12 w-12 shrink-0 object-contain transition-transform group-hover:scale-105" />
      <span className="min-w-0">
        <span className={`block text-xl font-extrabold tracking-tight leading-none ${light ? 'text-white' : 'text-[#07583d] dark:text-white'}`}>OHPEA</span>
        <span className={`mt-1 block max-w-[230px] text-[9px] sm:text-[10px] font-semibold uppercase leading-snug tracking-[.08em] ${light ? 'text-white/80' : 'text-slate-600 dark:text-slate-300'}`}>Oromia Hospitality Professionals and Entrepreneurs Association</span>
      </span>
    </Link>
  );
}
