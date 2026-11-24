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

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-400 selection:text-stone-950 transition-colors duration-200">
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
