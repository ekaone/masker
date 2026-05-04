import type { MaskOptions } from "../types/index.js";

/**
 * Reveals country code + check digits (first 4 chars), masks the rest.
 * "GB29NWBK60161331926819" → "GB29******************"
 */
export function maskIBAN(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const revealStart = opts.revealStart ?? 4;
  return value.slice(0, revealStart) + char.repeat(value.length - revealStart);
}
