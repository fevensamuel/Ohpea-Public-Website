import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryItem } from './content.js';

interface LightboxProps {
  items: GalleryItem[];
  openIndex: number | null;        // null = closed
  onClose: () => void;
}

/**
 * Dual-image cinematic lightbox: framed foreground photo over a blurred
 * complementary photo. Esc closes, ←/→ step, focus is trapped on the
 * dialog's controls and returned to the opener on close.
 */
export function Lightbox({ items, openIndex, onClose }: LightboxProps) {
  const open = openIndex !== null;
  const [idx, setIdx] = useState(0);        // target index
  const [shown, setShown] = useState(0);    // index currently displayed (swaps mid-fade)
  const [dim, setDim] = useState(false);
  const swapTimer = useRef<number | undefined>(undefined);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const n = items.length;

  const go = useCallback((next: number) => {
    const target = ((next % n) + n) % n;
    setIdx(target);
    setDim(true);
    window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => { setShown(target); setDim(false); }, 120);
  }, [n]);

  // open → show requested photo immediately, remember opener, move focus in
  useEffect(() => {
    if (openIndex === null) return;
    opener.current = document.activeElement as HTMLElement | null;
    setIdx(openIndex); setShown(openIndex); setDim(false);
    const t = window.setTimeout(() => closeBtn.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [openIndex]);

  // return focus when closed
  useEffect(() => {
    if (!open && opener.current) { opener.current.focus?.(); opener.current = null; }
  }, [open]);

  // lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // keyboard: Esc / arrows / Tab trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowRight') { go(idx + 1); return; }
      if (e.key === 'ArrowLeft') { go(idx - 1); return; }
      if (e.key === 'Tab' && root.current) {
        const f = Array.from(root.current.querySelectorAll<HTMLElement>('button'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, idx, go, onClose]);

  useEffect(() => () => window.clearTimeout(swapTimer.current), []);

  const item = items[shown] ?? items[0];

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className={`fixed inset-0 z-50 bg-olive-deeper transition-opacity duration-300 flex flex-col items-center justify-center p-6 overflow-hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {open && (
        <img src={item.bg} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-35 transition-all duration-700 pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-olive-deeper/60 pointer-events-none" />

      <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close gallery" data-cursor="link"
        className="absolute top-6 right-6 z-20 w-10 h-10 border border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-olive-deeper transition">✕</button>

      <div className="absolute top-7 left-8 z-20 text-[11px] font-semibold tracking-[0.22em] uppercase text-white/75" aria-live="polite">
        {`0${idx + 1} / 0${n}`}
      </div>

      <div className="relative z-10 flex items-center gap-4 md:gap-8 max-w-[92vw]">
        <button type="button" onClick={() => go(idx - 1)} aria-label="Previous photo" data-cursor="link"
          className="w-11 h-11 shrink-0 border border-white/50 text-white flex items-center justify-center hover:bg-white hover:text-olive-deeper transition">←</button>
        {open && (
          <img src={item.src} alt={item.caption}
            className={`max-h-[75vh] max-w-[74vw] object-contain border border-white/20 transition-opacity duration-300 ${dim ? 'opacity-25' : 'opacity-100'}`} />
        )}
        <button type="button" onClick={() => go(idx + 1)} aria-label="Next photo" data-cursor="link"
          className="w-11 h-11 shrink-0 border border-white/50 text-white flex items-center justify-center hover:bg-white hover:text-olive-deeper transition">→</button>
      </div>

      <p className="relative z-10 font-display italic text-xl text-white/95 mt-5 text-center">{item.caption}</p>
    </div>
  );
}
