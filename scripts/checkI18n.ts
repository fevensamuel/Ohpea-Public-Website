import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, '../src/i18n/locales');
const languages = ['en', 'om', 'am', 'ar', 'fr'];

console.log('--- Checking i18n Locales Completeness ---');

const contents: Record<string, Record<string, string>> = {};

for (const lang of languages) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: Locale file missing: ${filePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  contents[lang] = JSON.parse(raw);
}

const enKeys = Object.keys(contents['en']).sort();
console.log(`Source of truth (en.json): ${enKeys.length} keys`);

let hasError = false;

for (const lang of ['om', 'am', 'ar', 'fr']) {
  const langKeys = Object.keys(contents[lang]).sort();
  const missing = enKeys.filter((k) => !(k in contents[lang]));
  const extra = langKeys.filter((k) => !(k in contents['en']));

  if (missing.length > 0) {
    console.error(`[${lang}] Missing ${missing.length} keys:`, missing.slice(0, 5));
    hasError = true;
  }
  if (extra.length > 0) {
    console.warn(`[${lang}] Extra ${extra.length} keys:`, extra.slice(0, 5));
    hasError = true;
  }
  if (missing.length === 0 && extra.length === 0) {
    console.log(`[${lang}] OK - Exactly matching all ${enKeys.length} keys.`);
  }
}

if (hasError) {
  console.error('\nFAIL: Translation dictionary mismatch detected.');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All 5 languages (en, om, am, ar, fr) have 100% key parity.');
}
