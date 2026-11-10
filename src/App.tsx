/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.js';
import { ThemeProvider } from './theme/ThemeContext.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { FloatingContact } from './components/FloatingContact.js';
import { AppRoutes } from './routes.js';
import { isDemoMode } from './lib/demoMode.js';

export default function App() {
  const [demoBannerDismissed, setDemoBannerDismissed] = React.useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-400 selection:text-stone-950 transition-colors duration-200">
            {isDemoMode() && !demoBannerDismissed && (
              <div className="bg-amber-100 text-amber-900 text-sm p-2 text-center relative flex items-center justify-center">
                <span>Demo mode — numbers are hardcoded samples, not live data.</span>
                <button
                  type="button"
                  onClick={() => setDemoBannerDismissed(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-900/60 hover:text-amber-950 font-bold text-xs px-2 py-0.5 cursor-pointer"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
            <FloatingContact />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
