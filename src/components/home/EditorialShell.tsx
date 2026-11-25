import React, { useEffect, useRef } from 'react';
import { EditorialCursor } from './EditorialCursor.js';
import { HomeHeader } from './HomeHeader.js';
import { HomeFooter } from './HomeFooter.js';

/**
 * Shared chrome for every redesigned page: scroll-progress bar, editorial cursor,
 * transparent-to-frosted header with the fullscreen menu, and the cream footer.
 */
export function EditorialShell({ children }: { children: React.ReactNode }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.width = `${docH > 0 ? Math.min(100, (window.scrollY / docH) * 100) : 0}%`;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <div className="bg-cream text-ink font-body antialiased selection:bg-olive selection:text-white">
      <div ref={barRef} className="fixed top-0 left-0 h-[2px] bg-ochre z-50 transition-all duration-75" style={{ width: '0%' }} aria-hidden="true" />
      <EditorialCursor />
      <HomeHeader />
      {children}
      <HomeFooter />
    </div>
  );
}
