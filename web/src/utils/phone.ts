/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function normalizePhone(rawPhone: string): string {
  let cleaned = rawPhone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('09') || cleaned.startsWith('07')) {
    cleaned = '+251' + cleaned.substring(1);
  } else if (cleaned.startsWith('251') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('9') || cleaned.startsWith('7')) {
    if (cleaned.length === 9) {
      cleaned = '+251' + cleaned;
    }
  }
  return cleaned;
}

export function isValidEthiopianPhone(phone: string): boolean {
  const norm = normalizePhone(phone);
  // Must match +2519XXXXXXXX or +2517XXXXXXXX
  return /^\+251[79]\d{8}$/.test(norm);
}
