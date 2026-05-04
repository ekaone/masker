import type { MaskOptions } from "../types/index.ts";
import { maskGeneric } from "./generic.ts";

/**
 * Masks the local part of an email address, preserving the domain.
 * "john.doe@example.com" → "jo*******@example.com"
 */
export function maskEmail(value: string, opts: MaskOptions): string {
  const atIdx = value.indexOf("@");
  if (atIdx === -1) return maskGeneric(value, opts);

  const local = value.slice(0, atIdx);
  const domain = value.slice(atIdx); // includes '@'
  const char = opts.char ?? "*";

  if (local.length <= 2) {
    return char.repeat(local.length) + domain;
  }

  const revealStart = opts.revealStart ?? 2;
  return local.slice(0, revealStart) + char.repeat(local.length - revealStart) + domain;
}
