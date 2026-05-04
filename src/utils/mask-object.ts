import { mask } from "../core/mask.js";
import type { MaskOptions, MaskType } from "../types/index.ts";

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
    const resolvedType = hint ?? options.type;
    // Avoid spreading `type: undefined` — incompatible with exactOptionalPropertyTypes
    const callOpts: MaskOptions = resolvedType
      ? { ...options, type: resolvedType }
      : { ...options };
    result[k] = mask(v, callOpts).masked;
  }
  return result as { [K in keyof T]: T[K] extends string ? string : T[K] };
}
