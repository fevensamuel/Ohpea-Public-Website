/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.js';
import { ThemeProvider } from './theme/ThemeContext.js';
import { AppRoutes } from './routes.js';

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