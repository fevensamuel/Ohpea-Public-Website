/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronDown, UserCheck, Phone, Mail, Award, BookOpen, Lock } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { LanguageSwitcher } from './LanguageSwitcher.js';
import { ThemeToggle } from './ThemeToggle.js';
import { Logo } from './Logo.js';

export function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, isRtl } = useTranslation();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 ${
          isRtl ? 'right-0' : 'left-0'
        } max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-50`}
      >
        {/* Top bar with close and logo */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Logo />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language selector toggle pills */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            {t('common.selectLanguage')}
          </span>
          <LanguageSwitcher variant="toggle" />
        </div>

        {/* Scrollable Nav Accordion */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-semibold">
          <Link
            to="/"
            onClick={onClose}
            className="block py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {t('nav.home')}
          </Link>

          {/* About Accordion */}
          <div>
            <button
              onClick={() => toggleSection('about')}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <span>{t('nav.about')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'about' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'about' && (
              <div className="ps-4 space-y-1 py-1 border-s-2 border-[#0B3D2E] ms-3">
                <Link to="/about#who-we-are" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]">
                  {t('nav.whoWeAre')}
                </Link>
                <Link to="/about#mission-vision" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]">
                  {t('nav.missionVision')}
                </Link>
                <Link to="/about#objectives" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]">
                  {t('nav.objectives')}
                </Link>
                <Link to="/about#partners" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-[#0B3D2E] dark:hover:text-[#C9A24A]">
                  {t('nav.partners')}
                </Link>
              </div>
            )}
          </div>

          {/* Programs Accordion */}
          <div>
            <button
              onClick={() => toggleSection('programs')}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <span>{t('nav.programs')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'programs' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'programs' && (
              <div className="ps-4 space-y-1 py-1 border-s-2 border-[#0B3D2E] ms-3">
                <Link to="/programs" onClick={onClose} className="block py-1.5 text-xs font-bold text-[#E8772E]">
                  {t('common.viewAll')}
                </Link>
                <Link to="/programs/research-and-study" onClick={onClose} className="block py-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('programs.p1Title')}
                </Link>
                <Link to="/programs/advocacy" onClick={onClose} className="block py-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('programs.p2Title')}
                </Link>
                <Link to="/programs/training-and-awareness" onClick={onClose} className="block py-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('programs.p3Title')}
                </Link>
                <Link to="/programs/b2b-bridge" onClick={onClose} className="block py-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('programs.p4Title')}
                </Link>
                <Link to="/programs/investment-bridge" onClick={onClose} className="block py-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('programs.p5Title')}
                </Link>
                <Link to="/programs/member-networking-jobs" onClick={onClose} className="block py-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('programs.p6Title')}
                </Link>
                <Link to="/programs/international-relations" onClick={onClose} className="block py-1 text-xs text-slate-600 dark:text-slate-400">
                  {t('programs.p7Title')}
                </Link>
              </div>
            )}
          </div>

          {/* Updates Accordion */}
          <div>
            <button
              onClick={() => toggleSection('updates')}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <span>{t('nav.updates')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'updates' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'updates' && (
              <div className="ps-4 space-y-1 py-1 border-s-2 border-[#0B3D2E] ms-3">
                <Link to="/updates?type=news" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {t('nav.news')}
                </Link>
                <Link to="/updates?type=event" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {t('nav.events')}
                </Link>
                <Link to="/updates?type=vacancy" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {t('nav.vacancies')}
                </Link>
                <Link to="/updates?type=call_for_proposal" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {t('nav.callsProposals')}
                </Link>
                <Link to="/updates?type=call_for_research" onClick={onClose} className="block py-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {t('nav.callsResearch')}
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/membership"
            onClick={onClose}
            className="block py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {t('nav.membership')}
          </Link>

          <Link
            to="/resources"
            onClick={onClose}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <span>{t('nav.resources')}</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              {t('common.comingSoon')}
            </span>
          </Link>

          <Link
            to="/member-area"
            onClick={onClose}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('nav.memberArea')}</span>
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              {t('common.comingSoon')}
            </span>
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className="block py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {t('nav.contact')}
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link
            to="/register"
            onClick={onClose}
            className="w-full bg-[#E8772E] hover:bg-[#CF6420] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t('common.becomeMember')}</span>
          </Link>
          <div className="flex justify-between items-center text-xs text-slate-400 px-1 pt-1">
            <span>Theme:</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
