import type { MaskOptions } from "../types/index.js";

/**
 * Masks all but the last N digits, preserving separators.
 * "(415) 867-5309" → "(***) ***-5309"
 */
export function maskPhone(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const preserve = opts.preserveFormat ?? true;
  const digits = value.replace(/\D/g, "");
  const revealEnd = opts.revealEnd ?? 4;

  if (!preserve) {
    return char.repeat(digits.length - revealEnd) + digits.slice(-revealEnd);
  }

  const maskedDigits =
    digits.slice(0, -revealEnd).replace(/\d/g, char) + digits.slice(-revealEnd);

  let di = 0;
  return value.replace(/\d/g, () => maskedDigits[di++] ?? char);
}
