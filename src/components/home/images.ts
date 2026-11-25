/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PHOTO MANIFEST — the one place that decides which picture appears where.
 *
 *  CATALOG  lists every optimised photograph (numbers match docs/photo-catalog.jpg).
 *  PHOTO    names each slot on the site and points it at a catalog number.
 *
 *  To change a picture: edit the number beside its slot in PHOTO. Nothing else.
 *  To add a new photo: drop an optimised .jpg into public/images/web/, add a
 *  catalog line (next free number), then point a slot at it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const CATALOG: Record<number, { file: string; label: string }> = {
  1: { file: 'bale-cliffs-forest.jpg', label: 'Bale Mountains — cliffs and forest' },
  2: { file: 'bale-forest-overlook.jpg', label: 'Bale forest overlook, hazy valley' },
  3: { file: 'harenna-ridge.jpg', label: 'Harenna forest and Bale ridge' },
  4: { file: 'wenchi-crater-lake.jpg', label: 'Wenchi crater lake' },
  5: { file: 'abijata-lake-shore.jpg', label: 'Abijata-Shalla lake shore with horses' },
  6: { file: 'abijata-flamingos.jpg', label: 'Abijata-Shalla — flamingos' },
  7: { file: 'bale-lobelia-plateau.jpg', label: 'Bale plateau — giant lobelia' },
  8: { file: 'lodge-aerial-lake.jpg', label: 'Eco-lodge by a turquoise lake (aerial)' },
  9: { file: 'harenna-moss-forest.jpg', label: 'Harenna moss forest' },
  10: { file: 'irreecha-festival.jpg', label: 'Irreecha festival crowd' },
  11: { file: 'langano-sunset.jpg', label: 'Lake Langano at sunset' },
  12: { file: 'blue-starlings.jpg', label: 'Blue starlings in the bush' },
  13: { file: 'langano-resort-hill.jpg', label: 'Lodge above Lake Langano' },
  14: { file: 'hot-spring-ripples.jpg', label: 'Hot-spring water, abstract' },
  15: { file: 'shala-flamingos.jpg', label: 'Lake Shala — flamingos' },
  16: { file: 'sof-omar-cave-dark.jpg', label: 'Sof Omar cave, dark' },
  17: { file: 'sof-omar-cave.jpg', label: 'Sof Omar cave interior' },
  18: { file: 'business-newspaper.jpg', label: 'Reading the business newspaper' },
  19: { file: 'oromo-ceremony.jpg', label: 'Oromo ceremonial gathering' },
  20: { file: 'eco-lodge-aerial.jpg', label: 'Round eco-lodges (aerial)' },
  21: { file: 'elder-portrait.jpg', label: 'Elder in traditional dress (portrait)' },
  22: { file: 'conference-speaker.jpg', label: 'Conference — delegate speaking' },
  23: { file: 'green-hills-village.jpg', label: 'Green hills and village road' },
  24: { file: 'chef-flambe.jpg', label: 'Chef flambé (portrait)' },
  25: { file: 'chef-flame.jpg', label: 'Chef at the flame (portrait)' },
  26: { file: 'coffee-harvest.jpg', label: 'Coffee harvest, smiling farmers' },
  27: { file: 'farmland-aerial.jpg', label: 'Farmland ridge (aerial)' },
  28: { file: 'restaurant-tables.jpg', label: 'Restaurant dining room' },
  29: { file: 'training-laptops.jpg', label: 'Training session at laptops' },
  // photographs that were already part of the site
  30: { file: 'jeff-siepman-z-IxdGQ7lPU-unsplash.jpg', label: 'Chef plating a dish (portrait)' },
  31: { file: 'Coffee_ceremony_in_Ethiopia_-_Addis_Ababa.jpg', label: 'Coffee ceremony — Addis Ababa (portrait)' },
  32: { file: 'Coffee_ceremony_of_Ethiopia_and_Eritrea_3.jpg', label: 'Coffee roasting close-up' },
  33: { file: 'pexels-mogomotsi-makolo-85583351-33411205.jpg', label: 'Conference audience (portrait)' },
  34: { file: 'pexels-stephan-tomiczek-34804742-36104487.jpg', label: 'Guide driving a safari vehicle (portrait)' },
};

export const photo = (n: number): string => `/images/web/${(CATALOG[n] ?? CATALOG[7]).file}`;

/** Slot → catalog number. Change the number to change the picture. */
export const SLOT = {
  // Home & About (approved)
  homeHero: 7,
  homeAboutLarge: 30,
  homeAboutInset: 31,
  homeStories: [33, 7, 32],
  homeMembershipSplit: 34,
  homeMemberRail: [32, 31, 7],
  homeClosingCta: 30,
  aboutHero: 32,
  aboutWho: 30,
  aboutInset: 34,

  // Other pages
  programsHero: 1,
  /** by program position in GET /public/programs (Research, Advocacy, Training, B2B, Investment, Networking, International) */
  programDetail: [18, 22, 29, 28, 27, 13, 11],
  membershipHero: 22,
  membershipSide: 24,
  updatesHero: 18,
  /** hero photograph by announcement type */
  updateDetailNews: 18,
  updateDetailEvent: 22,
  updateDetailOpportunity: 29,
  contactHero: 23,
  registerHero: 26,
  notFound: 9,
} as const;
