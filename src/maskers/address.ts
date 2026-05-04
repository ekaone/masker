import type { MaskOptions } from "../types/index.ts";
import { maskGeneric } from "./generic.ts";

/**
 * Keeps the street number and everything after the first comma
 * (city, state, zip). Masks the street name.
 * "123 Baker Street, London, W1U 6RS" → "123 **********, London, W1U 6RS"
 */
export function maskAddress(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const parts = value.split(",");

  if (parts.length < 2) return maskGeneric(value, opts);

  const firstPart = parts[0].trim();
  const numMatch = firstPart.match(/^\d+/);
  const num = numMatch ? numMatch[0] : "";
  const streetName = firstPart.slice(num.length).trim();
  const maskedFirst = num + (num ? " " : "") + char.repeat(streetName.length || 3);

  return [maskedFirst, ...parts.slice(1)].join(",");
}
