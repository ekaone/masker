import type { MaskOptions } from "../types/index.js";

/**
 * Masks all but the last 4 digits, preserving dashes.
 * "123-45-6789" → "***-**-6789"
 */
export function maskSSN(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const digits = value.replace(/\D/g, "");
  const revealEnd = opts.revealEnd ?? 4;

  const maskedDigits =
    char.repeat(digits.length - revealEnd) + digits.slice(-revealEnd);

  if (!value.includes("-")) return maskedDigits;

  let di = 0;
  return value.replace(/\d/g, () => maskedDigits[di++] ?? char);
}
