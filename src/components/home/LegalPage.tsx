import React from 'react';
import { EditorialShell } from './EditorialShell.js';
import { EditorialPageHero } from './EditorialPageHero.js';
import { Reveal } from './Reveal.js';

export interface LegalSection { title: string; text: string }

/** Shared layout for Privacy and Terms: calm hero, sticky numbered index, generous reading column. */
export function LegalPage({ title, subtitle, crumb, sections }: { title: string; subtitle?: string; crumb: string; sections: LegalSection[] }) {
  return (
    <EditorialShell>
      <main id="main">
        <EditorialPageHero size="sm" title={title} subtitle={subtitle} crumbs={[{ label: crumb }]} />

        <Reveal as="section" className="max-w-[1100px] mx-auto px-6 md:px-12 py-20 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-20">
          <nav aria-label="On this page" className="hidden lg:block lg:col-span-4 sticky top-28 self-start">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-ochre mb-5">{title}</p>
            <ol className="border-t border-ink/15">
              {sections.map((s, i) => (
                <li key={i} className="border-b border-ink/15">
                  <a href={`#section-${i + 1}`} data-cursor="link" className="flex gap-4 py-3.5 text-sm text-ink/70 hover:text-ink transition">
                    <span className="font-display text-ochre w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="lg:col-span-8 space-y-16">
            {sections.map((s, i) => (
              <section key={i} id={`section-${i + 1}`} className="scroll-mt-28">
                <p className="font-display text-xl text-ochre mb-2">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="font-display text-3xl md:text-4xl leading-tight mb-5">{s.title}</h2>
                <p className="text-[16px] leading-[1.85] text-ink/75 whitespace-pre-line">{s.text}</p>
              </section>
            ))}
          </div>
        </Reveal>
      </main>
    </EditorialShell>
  );
}
