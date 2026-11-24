import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home.js';
import { About } from './pages/About.js';
import { Programs } from './pages/Programs.js';
import { ProgramDetail } from './pages/ProgramDetail.js';
import { Updates } from './pages/Updates.js';
import { UpdateDetail } from './pages/UpdateDetail.js';
import { Membership } from './pages/Membership.js';
import { Register } from './pages/Register.js';
import { Contact } from './pages/Contact.js';
import { Privacy } from './pages/Privacy.js';
import { Terms } from './pages/Terms.js';
import { NotFound } from './pages/NotFound.js';

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/updates/:slug" element={<UpdateDetail />} />
        <Route path="/news/:slug" element={<UpdateDetail />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
