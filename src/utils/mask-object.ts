import { mask } from "../core/mask.js";
import type { MaskOptions, MaskType } from "../types/index.js";

/**
 * Key-name hints that bias type detection when a field name is recognized.
 * e.g. a field named "email" will be treated as type "email" before
 * auto-detection runs on the value itself.
 */
const KEY_HINTS: Record<string, MaskType> = {
  email: "email",
  mail: "email",
  phone: "phone",
  mobile: "phone",
  tel: "phone",
  card: "credit_card",
  cc: "credit_card",
  pan: "credit_card",
  ssn: "ssn",
  sin: "ssn",
  ip: "ip_address",
  ipaddress: "ip_address",
  token: "api_key",
  apikey: "api_key",
  secret: "api_key",
  key: "api_key",
  jwt: "jwt",
  iban: "iban",
  passport: "passport",
  dob: "date_of_birth",
  birthday: "date_of_birth",
  birthdate: "date_of_birth",
  name: "name",
  fullname: "name",
  address: "address",
};

/**
 * Mask all string fields in a plain object.
 * Field names bias type detection via KEY_HINTS.
 * Non-string values pass through untouched.
 *
 * @example
 * maskObject({ email: "alice@example.com", age: 30 })
 * // { email: "al***@example.com", age: 30 }
 *
 * maskObject({ apiKey: "sk-abc123xyz456abc", active: true })
 * // { apiKey: "sk-a***********abc", active: true }
 */
export function maskObject<T extends Record<string, unknown>>(
  obj: T,
  options: MaskOptions = {},
): { [K in keyof T]: T[K] extends string ? string : T[K] } {
  const result: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(obj)) {
    if (typeof v !== "string") {
      result[k] = v;
      continue;
    }
    const hint = KEY_HINTS[k.toLowerCase().replace(/[_\s-]/g, "")];
    result[k] = mask(v, { ...options, type: hint ?? options.type }).masked;
  }

  return result as { [K in keyof T]: T[K] extends string ? string : T[K] };
}
