import type { MaskOptions } from "../types/index.js";

/**
 * Generic fallback: reveal first N and last N characters.
 * Used directly for unknown types and as a fallback by other maskers.
 */
export function maskGeneric(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const revealStart = opts.revealStart ?? 1;
  const revealEnd = opts.revealEnd ?? 1;

  if (value.length <= revealStart + revealEnd) {
    return char.repeat(value.length);
  }

  return (
    value.slice(0, revealStart) +
    char.repeat(value.length - revealStart - revealEnd) +
    value.slice(-revealEnd)
  );
}
