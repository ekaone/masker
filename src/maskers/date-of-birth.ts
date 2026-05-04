import type { MaskOptions } from "../types/index.js";

/**
 * Reveals only the year component, masks month and day.
 * "1990-07-15"  → "1990-**-**"
 * "07/15/1990"  → "xx/xx/1990"
 */
export function maskDOB(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const yearFirst = /^\d{4}/.test(value);

  if (yearFirst) {
    return value.slice(0, 4) + value.slice(4).replace(/\d/g, char);
  }

  return value.slice(0, -4).replace(/\d/g, char) + value.slice(-4);
}
