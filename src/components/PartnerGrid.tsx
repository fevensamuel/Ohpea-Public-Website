/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building2 } from 'lucide-react';
import { Partner } from '../types.js';

export function PartnerGrid({ partners }: { partners: Partner[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {partners.map((partner) => (
        <div
          key={partner.id}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-[#0B3D2E]/40 transition group grayscale hover:grayscale-0"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-[#0B3D2E] dark:group-hover:text-[#C9A24A] flex items-center justify-center mb-3 transition">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition">
            {partner.name}
          </span>
        </div>
      ))}
    </div>
  );
}
