/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Menu,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { Logo } from './Logo.js';
import { LanguageSwitcher } from './LanguageSwitcher.js';
import { ThemeToggle } from './ThemeToggle.js';
import { MegaMenu } from './MegaMenu.js';
import { MobileDrawer } from './MobileDrawer.js';
import { useTranslation } from '../i18n/LanguageContext.js';
import { useSiteSettings } from '../hooks/useSiteSettings.js';

export function Header() {
  const { t, isRtl } = useTranslation();
  const { settings } = useSiteSettings();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [location]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Safe accessors — settings may be {} on first paint while the API resolves,
  // so contactPhones / contactEmails can be undefined. Optional chaining + ??
  // prevents "Cannot read properties of undefined (reading '0')" at render time.
  const primaryPhone: string = settings.contactPhones?.[0] ?? '';
  const primaryEmail: string = settings.contactEmails?.[0] ?? '';

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* 1. Utility Top Bar (Dark Green like EEA) */}
        <div className="bg-[#0B3D2E] text-slate-200 border-b border-[#C9A24A]/25 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            {/* Contact info on start */}
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              {primaryPhone && <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 hover:text-white transition"
              >
                <Phone className="w-3 h-3 text-[#C9A24A]" />
                <span dir="ltr">{primaryPhone}</span>
              </a>}
              {primaryPhone && primaryEmail && <span className="text-white/20 hidden sm:inline">|</span>}
              {primaryEmail && <a
                href={`mailto:${primaryEmail}`}
                className="hidden sm:inline-flex items-center gap-1.5 hover:text-white transition"
              >
                <Mail className="w-3 h-3 text-[#C9A24A]" />
                <span>{primaryEmail}</span>
              </a>}
            </div>

            {/* Utility right tools */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher variant="dropdown" />
              <span className="text-white/20">|</span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Bar (White/Surface, shrinks on scroll) */}
        <div
          ref={dropdownRef}
          className={`bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-xs ${
            isScrolled ? 'py-2 shadow-md' : 'py-3.5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Brand Logo */}
            <Logo />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse font-semibold text-xs">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg transition ${
                  location.pathname === '/'
                    ? 'text-[#0B3D2E] dark:text-[#C9A24A] bg-[#0B3D2E]/5 dark:bg-[#C9A24A]/10 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]'
                }`}
              >
                {t('nav.home')}
              </Link>

              {/* About dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition cursor-pointer ${
                    location.pathname.startsWith('/about')
                      ? 'text-[#0B3D2E] dark:text-[#C9A24A] bg-[#0B3D2E]/5 dark:bg-[#C9A24A]/10 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]'
                  }`}
                >
                  <span>{t('nav.about')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'about' && (
                  <div
                    className={`absolute top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-start ${
                      isRtl ? 'right-0' : 'left-0'
                    }`}
                  >
                    <Link to="/about#who-we-are" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.whoWeAre')}
                    </Link>
                    <Link to="/about#mission-vision" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.missionVision')}
                    </Link>
                    <Link to="/about#objectives" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.objectives')}
                    </Link>
                    <Link to="/about#partners" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.partners')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Programs Mega Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'programs' ? null : 'programs')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition cursor-pointer ${
                    location.pathname.startsWith('/programs')
                      ? 'text-[#0B3D2E] dark:text-[#C9A24A] bg-[#0B3D2E]/5 dark:bg-[#C9A24A]/10 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]'
                  }`}
                >
                  <span>{t('nav.programs')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'programs' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'programs' && (
                  <div
                    className={`absolute top-full mt-2 z-50 ${
                      isRtl ? 'right-0 -translate-x-1/4' : 'left-0 -translate-x-1/4'
                    }`}
                  >
                    <MegaMenu onClose={() => setActiveDropdown(null)} />
                  </div>
                )}
              </div>

              {/* Updates Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'updates' ? null : 'updates')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition cursor-pointer ${
                    location.pathname.startsWith('/updates')
                      ? 'text-[#0B3D2E] dark:text-[#C9A24A] bg-[#0B3D2E]/5 dark:bg-[#C9A24A]/10 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]'
                  }`}
                >
                  <span>{t('nav.updates')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'updates' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'updates' && (
                  <div
                    className={`absolute top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-start ${
                      isRtl ? 'right-0' : 'left-0'
                    }`}
                  >
                    <Link to="/updates?type=news" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.news')}
                    </Link>
                    <Link to="/updates?type=event" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.events')}
                    </Link>
                    <Link to="/updates?type=vacancy" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.vacancies')}
                    </Link>
                    <Link to="/updates?type=call_for_proposal" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.callsProposals')}
                    </Link>
                    <Link to="/updates?type=call_for_research" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t('nav.callsResearch')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Membership */}
              <Link
                to="/membership"
                className={`px-3 py-2 rounded-lg transition ${
                  location.pathname === '/membership'
                    ? 'text-[#0B3D2E] dark:text-[#C9A24A] bg-[#0B3D2E]/5 dark:bg-[#C9A24A]/10 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]'
                }`}
              >
                {t('nav.membership')}
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-lg transition ${
                  location.pathname === '/contact'
                    ? 'text-[#0B3D2E] dark:text-[#C9A24A] bg-[#0B3D2E]/5 dark:bg-[#C9A24A]/10 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]'
                }`}
              >
                {t('nav.contact')}
              </Link>
            </nav>

            {/* Right Action: Orange CTA button & Mobile Hamburger */}
            <div className="flex items-center gap-2">
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#E8772E] hover:bg-[#CF6420] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-orange-950/15 transition-all hover:scale-102"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t('common.becomeMember')}</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
}