import type { MaskOptions } from "../types/index.ts";

/**
 * Reveals only the last 4 digits, preserving card group separators.
 * "4111 1111 1111 1111" → "**** **** **** 1111"
 */
export function maskCreditCard(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const preserve = opts.preserveFormat ?? true;
  const digits = value.replace(/\D/g, "");
  const revealEnd = opts.revealEnd ?? 4;

  const maskedDigits =
    char.repeat(digits.length - revealEnd) + digits.slice(-revealEnd);

  if (!preserve) return maskedDigits;

  let di = 0;
  return value.replace(/\d/g, () => maskedDigits[di++] ?? char);
}
