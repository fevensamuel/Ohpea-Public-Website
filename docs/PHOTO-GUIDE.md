# Changing the pictures

Every photograph on the redesigned site is chosen in **one file**: `src/components/home/images.ts`.

1. Open `docs/photo-catalog.jpg`. Each photo has a **number** (1–34) and shows where it is currently used.
2. In `images.ts`, find the **slot** you want to change under `SLOT` and replace its number.

```ts
export const SLOT = {
  homeHero: 7,          // <- change 7 to any catalog number
  contactHero: 23,
  ...
```

Slots written as lists (e.g. `programDetail: [18, 22, 29, …]`) take several numbers, in order.

## Slots
| Slot | Where it appears | Now |
|---|---|---|
| `homeHero` | Home — full-screen hero | 7 |
| `homeAboutLarge` / `homeAboutInset` | Home — "The Association" overlapping pair | 30 / 31 |
| `homeStories` | Home — three "Ideas into action" stories | 33, 7, 32 |
| `homeMembershipSplit` | Home — left half of the membership split | 34 |
| `homeMemberRail` | Home — rotating portrait in the membership panel | 32, 31, 7 |
| `homeClosingCta` | Home — background of the closing call to action | 30 |
| `aboutHero` / `aboutWho` / `aboutInset` | About — hero, large photo, inset photo | 32 / 30 / 34 |
| `programsHero` | Programs — hero | 1 |
| `programDetail` | Program pages — hero and Programs hover preview, by program order | 18, 22, 29, 28, 27, 13, 11 |
| `membershipHero` / `membershipSide` | Membership — hero and the portrait beside "How to join" | 22 / 24 |
| `updatesHero` | Updates — hero | 18 |
| `updateDetailNews` / `updateDetailEvent` / `updateDetailOpportunity` | Update pages — hero by type | 18 / 22 / 29 |
| `contactHero` | Contact — hero | 23 |
| `registerHero` | Register — hero | 26 |
| `notFound` | 404 page background | 9 |

A program or announcement that carries its own image in the API (`imageUrl`) keeps using that image.

## Adding a photo that isn't in the catalog
1. Resize it (about 2000 px wide, JPEG quality ~78) and save it in `public/images/web/`.
2. Add a line to `CATALOG` in `images.ts` with the next free number.
3. Point a slot at that number.
