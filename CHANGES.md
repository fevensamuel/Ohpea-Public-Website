# Redesign log — all pages

Frontend only. This repository has no server code; the backend is reached through `VITE_API_URL` and is untouched.
Every page now renders inside the editorial shell (`components/home/EditorialShell.tsx`): header, fullscreen menu, cursor, footer.

## Pages redesigned
Home `/` · About `/about` · Programs `/programs` · Program detail `/programs/:slug` · Membership `/membership` · Updates `/updates` ·
Update detail `/updates/:slug` and `/news/:slug` · Contact `/contact` · Register `/register` · Privacy `/privacy` · Terms `/terms` · 404

## API behaviour: unchanged
`src/lib`, `src/api`, `src/hooks`, `src/i18n`, `src/data`, `src/utils`, `src/theme`, `src/routes.tsx` and `src/translations.ts` are byte-for-byte identical to the original.
- **Contact:** the state, validation and submit logic is identical; the request body was compared against the original and matches exactly.
- **Updates:** tabs, `?type=` deep links, search, paging and error handling are the original code.
- **Register:** the form logic, field names and payload assembly are the original code (see the fix below).
- **One additional read:** `ProgramDetail` also calls the existing `GET /public/programs` to pick the page's default photograph by the program's position.

## ⚠ Fix to an existing bug in Register (please read)
In the original `Register.tsx` the field helpers (`Field`, `Select`, `FileSlot`, …) were declared **inside** the component. React therefore recreated their inputs on every render, which had two effects (reproduced against the original build):
1. A chosen document was discarded from the real `<input type="file">`. With the fields marked `required`, the form could not be submitted once a file had been chosen.
2. With `required` removed, the form submitted but all six document parts reached the API empty (`filename=""`, 0 bytes).
Typing also lost focus after a failed submit.

The helpers now keep a stable identity (`live()` in `Register.tsx`). Compared against the original, the same 98 text fields, the same `officialFormData` JSON and the same six file-field names are posted; the documents now arrive with their real contents.
To revert: restore the original `src/pages/Register.tsx` (you'll lose the redesign of that page too).

## Pictures
All photographs are chosen in `src/components/home/images.ts`. See `docs/PHOTO-GUIDE.md` and `docs/photo-catalog.jpg`. Optimised copies of all 29 supplied photographs are in `public/images/web/` (originals untouched).

## Name handling
Locale files and API records may still contain earlier spellings of the organisation name. `brandText()` (in `components/home/content.ts`) swaps them for the current full name at render time on About; non-English strings are not covered.
The registration form's own text uses the acronym **"OHPEA"** while the rest of the site uses **"OPHEA"**. That wording is unchanged; please confirm which is correct.

## Notes
- Removed from the design: the dark-mode toggle and the floating contact button. `Header`, `Footer`, `FloatingContact`, `PageBanner`, the card components and `components/registration/*` are still in `src/components`, unused and unchanged.
- Dev-only files used for testing are not included.

## Run
```
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev            # or: npm run build
```
