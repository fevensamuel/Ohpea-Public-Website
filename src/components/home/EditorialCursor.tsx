import React, { useEffect, useRef } from 'react';

/**
 * Circular cursor that grows over [data-cursor] elements:
 *   data-cursor="link" → ring,  data-cursor="view" → filled "VIEW" disc.
 * Desktop / fine pointers only; the native cursor is never hidden, so
 * usability and accessibility are unaffected.
 */
export function EditorialCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;

    let cx = 0, cy = 0, tx = 0, ty = 0, raf = 0, started = false;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!started) { started = true; cx = tx; cy = ty; el.classList.add('ohp-cursor-on'); }
    };
    const loop = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    const setMode = (mode: 'view' | 'link' | null) => {
      el.classList.toggle('ohp-cursor-view', mode === 'view');
      el.classList.toggle('ohp-cursor-link', mode === 'link');
      if (labelRef.current) labelRef.current.textContent = mode === 'view' ? 'VIEW' : '';
    };
    const onOver = (e: MouseEvent) => {
      const host = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      setMode(host ? (host.dataset.cursor === 'view' ? 'view' : 'link') : null);
    };
    const onLeaveWindow = () => el.classList.remove('ohp-cursor-on');
    const onEnterWindow = () => { if (started) el.classList.add('ohp-cursor-on'); };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);
    document.documentElement.addEventListener('mouseenter', onEnterWindow);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      document.documentElement.removeEventListener('mouseenter', onEnterWindow);
    };
  }, []);

  return (
    <div ref={ref} className="ohp-cursor" aria-hidden="true">
      <span ref={labelRef} />
    </div>
  );
}
