# OPHEA Public Website — Translation & Review Documentation

This document summarizes the translation system and linguistic parity established for the Oromia Tourism & Hospitality Professionals Association (OPHEA) web portal.

---

## 1. Supported Languages & Standardization

| Code | Standard Code | Language Name | Native Label | Text Direction | Ethiopic / Arabic Font |
|---|---|---|---|---|---|
| `en` | `en` | English | English | LTR | System Sans |
| `om` | `om` | Afaan Oromoo | Afaan Oromoo | LTR | System Sans |
| `am` | `am` | Amharic | አማርኛ | LTR | Noto Sans Ethiopic |
| `ar` | `ar` | Arabic | العربية | RTL | Noto Naskh Arabic |
| `fr` | `fr` | French | Français | LTR | System Sans |

---

## 2. Parity Status

- **Total Translation Keys**: 177 keys across all sections.
- **Locales Covered**:
  - `src/i18n/locales/en.json` (177 keys)
  - `src/i18n/locales/om.json` (177 keys)
  - `src/i18n/locales/am.json` (177 keys)
  - `src/i18n/locales/ar.json` (177 keys)
  - `src/i18n/locales/fr.json` (177 keys)
- **Automated Check**:
  - Run `npm run i18n:check`
  - Current Result: **100% key parity with 0 missing and 0 extra keys**.

---

## 3. RTL & Typography Implementation

- **Arabic (`ar`) Layout**:
  - Automatically toggles `dir="rtl"` on `<html>` and sets `lang="ar"`.
  - Direction-aware arrow icons: chevron and back/forward icons flip dynamically.
  - Floating contact widget switches sides (left vs right) according to text direction.
  - Fonts loaded via Google Fonts CDN for seamless Ethiopic and Arabic glyph rendering.
