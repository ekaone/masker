import type { MaskOptions } from "../types/index.ts";
import { maskGeneric } from "./generic.ts";

/**
 * Keeps the header segment (algorithm metadata — not sensitive),
 * masks the payload and signature.
 * "aaa.bbb.ccc" → "aaa.******.***"
 */
export function maskJWT(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  const parts = value.split(".");
  if (parts.length !== 3) return maskGeneric(value, opts);
  return (
    parts[0] +
    "." +
    char.repeat(parts[1].length) +
    "." +
    char.repeat(parts[2].length)
  );
}
