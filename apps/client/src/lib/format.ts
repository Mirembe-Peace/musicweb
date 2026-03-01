export function parseNumber(input: string): number | undefined {
  const cleaned = input.replaceAll(/[^\d]/g, '');
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}
