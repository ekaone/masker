import type { MaskOptions } from "../types/index.ts";

/**
 * IPv4: masks last two octets.   "192.168.100.42" → "192.168.***.***"
 * IPv6: masks second half of string.
 */
export function maskIP(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";

  if (value.includes(".")) {
    const parts = value.split(".");
    const masked = parts
      .slice(2)
      .map((p) => char.repeat(p.length));
    return parts.slice(0, 2).join(".") + "." + masked.join(".");
  }

  // IPv6 — mask second half
  const mid = Math.floor(value.length / 2);
  return value.slice(0, mid) + char.repeat(value.length - mid);
}
