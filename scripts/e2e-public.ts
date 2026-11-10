// scripts/e2e-public.ts
// Run with: npx tsx scripts/e2e-public.ts
// Requires the backend to be running at VITE_API_URL (default http://localhost:3000/api).
// Exits non-zero on the first failure. No fallbacks, no "assumed passing" mode.

import { api, ApiError } from '../src/lib/ohpea-api-client';

const base = (import.meta as any).env?.VITE_API_URL ?? (typeof process !== 'undefined' ? process.env?.VITE_API_URL : undefined) ?? 'http://localhost:3000/api';
const phone = '+251911000' + String(Math.floor(Math.random() * 9000) + 1000);
const email = `e2e-${Date.now()}@example.io`;

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`  ❌ ${name}`);
    console.log(`     ${msg}`);
    failed++;
  }
}

async function main() {
  // ── Hard preflight: backend MUST be reachable ────────────────
  try {
    const res = await fetch(`${base}/public/stats`, { credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (body?.success !== true) throw new Error('Envelope is not { success: true }');
  } catch (e) {
    console.error(`\n❌ FATAL: Backend is not reachable at ${base}`);
    console.error(`   Reason: ${e instanceof Error ? e.message : String(e)}`);
    console.error(`\n   This script does NOT simulate success. Start the backend first.`);
    process.exit(1);
  }

  console.log(`\nOHPEA Public API E2E — target ${base}\n`);

  // ── Test 1: stats has exactly 4 numeric fields ───────────────
  await test('GET /public/stats returns exactly 4 numeric fields', async () => {
    const stats = await api.getStats();
    const keys = Object.keys(stats).filter(k => !k.startsWith('_'));
    const expected = ['totalMembers', 'accreditedHotels', 'certifiedGuides', 'trainingGraduates'];
    for (const k of expected) {
      if (typeof (stats as any)[k] !== 'number') throw new Error(`stats.${k} missing or not a number`);
    }
    for (const k of keys) {
      if (!expected.includes(k)) throw new Error(`unexpected extra field: stats.${k}`);
    }
  });

  // ── Test 2: announcements pagination shape ───────────────────
  await test('GET /public/announcements returns { data, meta }', async () => {
    const { data, meta } = await api.getAnnouncements({ limit: 5, page: 1 });
    if (!Array.isArray(data)) throw new Error('data is not an array');
    for (const k of ['page', 'pageSize', 'total', 'totalPages']) {
      if (typeof (meta as any)[k] !== 'number') throw new Error(`meta.${k} missing or not a number`);
    }
    if (meta.pageSize !== 5) throw new Error(`expected pageSize 5, got ${meta.pageSize}`);
  });

  // ── Test 3: unknown slug → 404 ApiError ──────────────────────
  await test('GET /public/announcements/:slug returns 404 envelope', async () => {
    try {
      await api.getAnnouncement('definitely-not-a-real-slug-' + Date.now());
      throw new Error('expected 404, got success');
    } catch (e) {
      if (!(e instanceof ApiError) || e.status !== 404) throw e;
    }
  });

  // ── Test 4: contact submission ───────────────────────────────
  await test('POST /public/contact succeeds', async () => {
    await api.sendContact({
      fullName: 'E2E Bot',
      email,
      phone,
      subject: 'E2E smoke',
      message: 'Automated E2E message — safe to ignore. At least ten characters.',
    });
  });

  // ── Test 5: newsletter is idempotent ─────────────────────────
  await test('POST /public/newsletter is idempotent', async () => {
    await api.subscribeNewsletter({ email, name: 'E2E', language: 'en' });
    await api.subscribeNewsletter({ email, name: 'E2E', language: 'en' });
  });

  // ── Test 6: OTP send dispatches ──────────────────────────────
  await test('POST /public/registrations/otp/send dispatches', async () => {
    const res = await api.sendRegistrationOtp(phone);
    if (!res || typeof res.message !== 'string') throw new Error('no message in response');
  });

  // ── Summary ───────────────────────────────────────────────────
  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

main().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
