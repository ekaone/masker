import type { MaskOptions } from "../types/index.ts";

/**
 * Reveals only the first 2 characters (country/type prefix), masks digits.
 * "AB1234567" → "AB*******"
 */
export function maskPassport(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const revealStart = opts.revealStart ?? 2;
  return value.slice(0, revealStart) + char.repeat(value.length - revealStart);
}
