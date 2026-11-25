# OPHEA website redesign

This project keeps the existing React + Vite application, page routes, forms, registration and OTP flow, language switcher, theme toggle, and API client. The homepage has been restyled to follow the supplied desktop and mobile Figma references.

## Visual direction

- Full-bleed Bale Mountains hero with a dark photographic overlay and editorial serif typography.
- Warm ivory backgrounds, deep forest-green purpose/member sections, and restrained brass accents.
- Asymmetric hospitality and coffee-ceremony photography, spacious editorial layouts, and responsive mobile stacking.
- The supplied public image library is included under `public/images/` and used by the homepage.
- The supplied Figma screenshots are included in `design-reference/` for reference.

## API integration

The redesign preserves the existing public API integrations for site settings, public statistics, programs and program detail, objectives, partners, activities, announcements and announcement detail, regions and registration lookups, membership registration, OTP send/verify, contact messages, newsletter subscriptions, and UI translations. The consolidated `/public/lookups` and `/public/translations/{lang}` endpoints are also called.

The `/admin/*` and `/auth/*` endpoints in the supplied endpoint catalogue are intentionally not called from this public website. Those endpoints belong in a separately authenticated administrator application; exposing admin workflows or credentials in the public client would be unsafe. The public site does not replace or weaken the existing API authorization model.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to the API base URL.
3. Run `npm run dev`.
4. Run `npm run build` to create the production bundle.

The API base URL defaults to `http://localhost:3000/api` when `VITE_API_URL` is not set.
