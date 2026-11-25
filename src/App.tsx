/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.js';
import { ThemeProvider } from './theme/ThemeContext.js';
import { AppRoutes } from './routes.js';

/**
 * Every page now renders inside the editorial shell (header, fullscreen menu,
 * footer, cursor) itself — see components/home/EditorialShell.tsx — so the app
 * only provides the router and the existing theme / language contexts.
 * The previous Header, Footer and FloatingContact components are still in
 * src/components, unused and unchanged.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
