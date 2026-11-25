/**
 * Membership — editorial redesign. All copy comes from the existing
 * `membership.*` / `home.*` translation keys; every call to action still
 * goes to /register.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/LanguageContext.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { EditorialPageHero } from '../components/home/EditorialPageHero.js';
import { OdaaMark } from '../components/home/OdaaMark.js';
import { Reveal } from '../components/home/Reveal.js';
import { SLOT, photo } from '../components/home/images.js';

const EYEBROW = 'text-[11px] font-semibold tracking-[0.22em] uppercase text-ochre';

export const Membership: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    { title: t('membership.cat1Title'), badge: t('membership.cat1Badge'), desc: t('membership.cat1Desc'),
      benefits: [t('membership.cat1Benefit1'), t('membership.cat1Benefit2'), t('membership.cat1Benefit3'), t('membership.cat1Benefit4')] },
    { title: t('membership.cat2Title'), badge: t('membership.cat2Badge'), desc: t('membership.cat2Desc'),
      benefits: [t('membership.cat2Benefit1'), t('membership.cat2Benefit2'), t('membership.cat2Benefit3')] },
    { title: t('membership.cat3Title'), badge: t('membership.cat3Badge'), desc: t('membership.cat3Desc'),
      benefits: [t('membership.cat3Benefit1'), t('membership.cat3Benefit2'), t('membership.cat3Benefit3')] },
    { title: t('membership.cat4Title'), badge: t('membership.cat4Badge'), desc: t('membership.cat4Desc'),
      benefits: [t('membership.cat4Benefit1'), t('membership.cat4Benefit2'), t('membership.cat4Benefit3')] },
  ];

  const whyJoinBenefits = [
    t('membership.whyJoinBenefit1'), t('membership.whyJoinBenefit2'), t('membership.whyJoinBenefit3'),
    t('membership.whyJoinBenefit4'), t('membership.whyJoinBenefit5'),
  ];

  const steps = [
    { titleKey: 'joinStep1Title', descKey: 'joinStep1Desc' },
    { titleKey: 'joinStep2Title', descKey: 'joinStep2Desc' },
    { titleKey: 'joinStep3Title', descKey: 'joinStep3Desc' },
    { titleKey: 'joinStep4Title', descKey: 'joinStep4Desc' },
  ];

  return (
    <EditorialShell>
      <main id="main">
        <EditorialPageHero
          image={photo(SLOT.membershipHero)}
          imageClass="object-[50%_35%]"
          title={t('nav.membership')}
          subtitle={t('membership.heroSubtitle')}
          crumbs={[{ label: t('nav.membership') }]}
        />

        {/* Why join + how to join */}
        <Reveal as="section" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          <div className="lg:col-span-6">
            <p className={`${EYEBROW} mb-4`}>{t('nav.whyJoin')}</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mb-7">{t('membership.whyJoinTitle')}</h2>
            <p className="text-ink/75 leading-relaxed mb-8">{t('membership.whyJoinDesc')}</p>
            <ul className="border-t border-ink/15 mb-10">
              {whyJoinBenefits.map((b, i) => (
                <li key={i} className="flex gap-4 py-3.5 border-b border-ink/15 text-[15px] text-ink/80">
                  <span className="text-ochre" aria-hidden="true">—</span><span>{b}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" data-cursor="link" className="border border-ink/70 px-8 py-3.5 font-display text-lg hover:bg-ink hover:text-white transition inline-flex items-center gap-2">
              {t('hero.ctaRegister')} <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="lg:col-span-6 relative lg:pb-24">
            <div className="overflow-hidden lg:w-[72%] lg:ml-auto">
              <img src={photo(SLOT.membershipSide)} alt="A chef at work in a restaurant kitchen" loading="lazy" decoding="async"
                className="w-full h-[460px] lg:h-[560px] object-cover hover:scale-[1.03] transition-transform duration-700" />
            </div>
            <div className="relative lg:absolute lg:left-0 lg:bottom-0 lg:w-[68%] mt-6 lg:mt-0 bg-olive text-white p-8 md:p-10 overflow-hidden">
              <OdaaMark variant="watermark" className="absolute -right-10 -bottom-10 w-[220px] h-[200px] text-white/[0.07] pointer-events-none" />
              <h3 className="relative font-display text-2xl md:text-3xl font-light mb-6">{t('home.howToJoinTitle')}</h3>
              <ol className="relative space-y-5">
                {steps.map((s, i) => (
                  <li key={s.titleKey} className="flex gap-4">
                    <span className="font-display text-2xl text-[#EAE2D0] w-8 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className="text-sm font-semibold">{String(t(s.titleKey as any)).replace(/^\s*\d+\s*[.)-]\s*/, '')}</h4>
                      <p className="text-[13px] text-white/75 mt-0.5 leading-relaxed">{t(s.descKey as any)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Categories */}
        <Reveal as="section" className="bg-sand py-24 md:py-32">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-10 mb-14">
              <h2 className="lg:col-span-7 font-display text-4xl md:text-5xl leading-[1.08]">{t('membership.categoriesTitle')}</h2>
              <p className="lg:col-span-5 text-sm leading-relaxed text-ink/70 lg:pt-6">{t('membership.categoriesSubtitle')}</p>
            </div>

            <ol className="border-t border-ink/15">
              {categories.map((cat, idx) => (
                <li key={idx} className="grid lg:grid-cols-12 gap-x-12 gap-y-6 py-10 border-b border-ink/15">
                  <div className="lg:col-span-6 flex gap-6">
                    <span className="font-display text-3xl text-ochre w-10 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ochre mb-2">{cat.badge}</p>
                      <h3 className="font-display text-3xl md:text-4xl leading-tight mb-3">{cat.title}</h3>
                      <p className="text-[15px] text-ink/70 leading-relaxed max-w-md">{cat.desc}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-6 flex flex-col justify-between gap-6">
                    <ul className="space-y-2.5">
                      {cat.benefits.map((b, bi) => (
                        <li key={bi} className="flex gap-3 text-sm text-ink/80"><span className="text-ochre" aria-hidden="true">—</span><span>{b}</span></li>
                      ))}
                    </ul>
                    <div>
                      <Link to="/register" data-cursor="link" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase border-b border-ink/40 pb-1.5 hover:border-ink transition">
                        {t('membership.applyCategory')} <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </main>
    </EditorialShell>
  );
};
