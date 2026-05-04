import type { MaskOptions } from "../types/index.ts";

/**
 * Reveals a small window at both ends, masks the middle.
 * "sk-proj-abc123XYZ789" → "sk-p************Z789"
 */
export function maskApiKey(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const revealStart = opts.revealStart ?? 4;
  const revealEnd = opts.revealEnd ?? 4;

  if (value.length <= revealStart + revealEnd) {
    return char.repeat(value.length);
  }

  return (
    value.slice(0, revealStart) +
    char.repeat(value.length - revealStart - revealEnd) +
    value.slice(-revealEnd)
  );
}
