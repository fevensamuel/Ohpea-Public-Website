/**
 * Static editorial content for the homepage (copy + photography).
 * Anything that comes from the backend (stats, programs, announcements,
 * partners, activities, site settings) is NOT defined here — see Home.tsx.
 */

export const ORG_NAME = 'Oromia Hospitality Professionals and Entrepreneurs Association';
export const ORG_SHORT = 'OPHEA';

import { SLOT, photo } from './images.js';

// Which photograph fills which slot is decided in images.ts (SLOT).
export const IMG = {
  bale: photo(SLOT.homeHero),
  hospitalityNature: photo(SLOT.homeAboutLarge),
  coffeeAddis: photo(SLOT.homeAboutInset),
  coffeeEritrea: photo(SLOT.aboutHero),
  training: photo(SLOT.homeStories[0]),
  trail: photo(SLOT.homeMembershipSplit),
} as const;

/** Images cycled by the "Seven ways forward" hover preview. */
export const PREVIEW_POOL: string[] = [
  IMG.training,
  IMG.hospitalityNature,
  IMG.bale,
  IMG.coffeeAddis,
  IMG.trail,
  IMG.coffeeEritrea,
];

/**
 * Seven focus areas. `programIndex` keeps the exact mapping the previous
 * homepage used to resolve each focus area to a live program slug from
 * GET /public/programs (p1,p5,p2,p6,p3,p7,p4 → array positions below).
 */
export const PILLARS = [
  { n: '01', title: 'Research', desc: 'Insights that inform better decisions.', slot: 0, programIndex: 0 },
  { n: '02', title: 'Investment', desc: 'Connecting opportunity with enterprise.', slot: 1, programIndex: 4 },
  { n: '03', title: 'Advocacy', desc: 'A collective voice for the sector.', slot: 2, programIndex: 1 },
  { n: '04', title: 'Networking', desc: 'People, partnerships and possibility.', slot: 3, programIndex: 5 },
  { n: '05', title: 'Training', desc: 'Building skills and raising standards.', slot: 4, programIndex: 2 },
  { n: '06', title: 'International Relations', desc: 'Opening doors beyond our borders.', slot: 5, programIndex: 6 },
  { n: '07', title: 'B2B', desc: 'Growing meaningful business connections.', slot: 0, programIndex: 3 },
] as const;

export const STORIES = [
  {
    label: '01 / PROFESSIONAL DEVELOPMENT',
    title: 'Growing skills. Raising standards.',
    desc: 'Building confidence, capability and a stronger sector.',
    img: photo(SLOT.homeStories[0]),
    alt: 'Growing skills. Raising standards.',
  },
  {
    label: '02 / DESTINATION DEVELOPMENT',
    title: 'Closer to the places we represent.',
    desc: 'Celebrating the natural and cultural wealth of Oromia.',
    img: photo(SLOT.homeStories[1]),
    alt: 'Bale Mountains in Oromia',
  },
  {
    label: '03 / CULTURE & CONNECTION',
    title: 'Where hospitality begins.',
    desc: 'Sharing the stories, traditions and warmth of our home.',
    img: photo(SLOT.homeStories[2]),
    alt: 'Traditional Ethiopian coffee ceremony',
  },
] as const;

export interface GalleryItem { src: string; bg: string; caption: string }

export const GALLERY_BASE: GalleryItem[] = [
  { src: IMG.hospitalityNature, bg: IMG.bale, caption: 'Hospitality rooted in nature' },
  { src: IMG.coffeeAddis, bg: IMG.hospitalityNature, caption: 'Warmth of the traditional Ethiopian coffee ceremony' },
  { src: IMG.training, bg: IMG.coffeeEritrea, caption: '01 / Professional Development — Growing skills. Raising standards.' },
  { src: IMG.bale, bg: IMG.trail, caption: '02 / Destination Development — Closer to the places we represent.' },
  { src: IMG.coffeeEritrea, bg: IMG.bale, caption: '03 / Culture & Connection — Where hospitality begins.' },
  { src: IMG.trail, bg: IMG.coffeeAddis, caption: 'Your people. Your next chapter.' },
];

export const MEMBER_PHOTOS: string[] = SLOT.homeMemberRail.map((n) => photo(n));
export const MEMBER_BULLETS: string[] = [
  '— Explore professional development',
  '— Connect with industry peers',
  '— Discover new opportunities',
];

/** Smooth-scroll to an in-page section (keeps the URL clean). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/**
 * Display-only: the translation files and backend still carry earlier spellings of the
 * organisation's name. Swap them for the current full name at render time so no
 * locale file or API record has to change.
 */
export function brandText(s: string): string {
  return s.replace(
    /Oromia (?:Hospitality (?:&|and) Tourism|Tourism (?:&|and) Hospitality) Professionals(?:['’]s)? Association/gi,
    ORG_NAME,
  );
}
