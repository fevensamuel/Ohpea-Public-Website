# Oromia Tourism & Hospitality Professionals Association (OHPEA) Public Website

Official public web portal of the **Oromia Tourism & Hospitality Professionals Association (OHPEA)** / **Waldaa Ogeeyyii Tuurizimii fi Keessummeessuu Oromiyaa**.

The site presents the association (mission, vision, objectives, 7 strategic programs), publishes public announcements (news, events, career vacancies, calls for proposals and research), displays live membership statistics, and provides an online multi-step registration form for hospitality practitioners.

---

## 🏛️ Project Scope

- **Public Website Only**: Pure client-side static Vite application.
- **No Private Portals or Documentation Viewers**: Contains strictly public-facing routes and content.
- **Coming Soon Placeholders**: Phase 4 features (such as Member Self-Service Area and Knowledge Repository) are marked with locked badges and notification forms.

---

## 🌍 Complete 5-Language Translation System

Every user-visible string is translated across all 5 supported languages:
1. **English** (`en`) — Default
2. **Afaan Oromoo** (`om`)
3. **Amharic** (`am`)
4. **Arabic** (`ar`) — Native RTL layout
5. **French** (`fr`)

### Key Parity Verification
Run the automated translation parity checker:
```bash
npm run i18n:check
```

---

## 🎨 UI/UX Architecture (EEA Modeled)

Modeled on the Ethiopian Economic Association (EEA) structure:
1. **Top Utility Bar**: Hotline, email, operating hours, language picker, dark/light theme switch.
2. **Sticky Main Header**: High-contrast branding, multi-level Mega Menu for Programs and Updates, and quick CTA.
3. **14 Home Sections**:
   - Welcome Hero with dual CTAs
   - Stats Strip with animated count-up metrics
   - Featured Event with live countdown timer
   - Recent News & Stories
   - Latest Announcements with tabs (Vacancies, Calls for Proposals, Calls for Research)
   - Don't Miss Out Events (Upcoming & Past)
   - The 7 Core Strategic Programs
   - How to Join OHPEA (4 steps)
   - Institutional Partners Grid
   - Recent Activities & Projects
   - About Us Statutory Summary
   - Newsletter Subscription
   - 4-Column Footer with localized links and legal statements
4. **5-Step Member Registration**:
   - Personal details (with phone verification)
   - Education & Sector background
   - Regional Zone & Identification (Fayda / Kebele / Passport)
   - Credential document uploads
   - Review, consent declaration, and reference number generation

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Build & Verification
```bash
npm run lint
npm run build
```
