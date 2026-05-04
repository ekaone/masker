import type { MaskOptions } from "../types/index.ts";
import { maskGeneric } from "./generic.ts";

/**
 * Preserves scheme + host, masks path, query string, and credentials.
 * "https://api.example.com/v1/users?token=abc" → "https://api.example.com/***"
 */
export function maskURL(value: string, opts: MaskOptions): string {
  const char = opts.char ?? "*";
  try {
    const u = new URL(value);
    const base = `${u.protocol}//${u.host}`;
    const rest = value.slice(base.length);
    return base + char.repeat(rest.length || 3);
  } catch {
    return maskGeneric(value, opts);
  }
}
