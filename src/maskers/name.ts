import type { MaskOptions } from "../types/index.ts";

/**
 * Reveals the first letter of each word, masks the rest.
 * "Margaret Thatcher" → "M******** T*******"
 */
export function maskName(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  return value
    .split(/\s+/)
    .map((word) =>
      word.length <= 1 ? word : word[0] + char.repeat(word.length - 1)
    )
    .join(" ");
}
