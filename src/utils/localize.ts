export function localize(value: unknown, language: string): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    const pick = (k: string) => (typeof v[k] === 'string' && (v[k] as string).trim() ? (v[k] as string) : '');
    return pick(language) || pick('en') || pick('om') || '';
  }
  return String(value);
}
