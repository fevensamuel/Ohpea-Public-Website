import React, { useEffect, useRef, useState } from 'react';

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  children?: React.ReactNode;
};

/** Fades/slides an element in once, when ~12% of it enters the viewport. */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={`ohp-reveal ${seen ? 'ohp-in-view' : ''} ${className}`} {...rest}>
      {children}
    </Comp>
  );
}
