import type { DetectionResult } from "../types/index.ts";
import { emailRule } from "./email.ts";
import { phoneRule } from "./phone.ts";
import { creditCardRule } from "./credit-card.ts";
import { ssnRule } from "./ssn.ts";
import { ipAddressRule } from "./ip-address.ts";
import { urlRule } from "./url.ts";
import { jwtRule } from "./jwt.ts";
import { apiKeyRule } from "./api-key.ts";
import { ibanRule } from "./iban.ts";
import { passportRule } from "./passport.ts";
import { dateOfBirthRule } from "./date-of-birth.ts";

/**
 * Ordered from most-specific to least-specific.
 * Rules earlier in the list win when two patterns both match
 * (e.g. JWT beats api_key for long base64url strings).
 */
export const DETECTION_RULES = [
  jwtRule,        // most specific: three-segment base64url
  creditCardRule, // digit groups
  ssnRule,        // ###-##-#### — checked before generic digit runs
  emailRule,      // contains @
  phoneRule,      // digit + separators
  ipAddressRule,  // dotted quads / colons
  ibanRule,       // alpha + digits, country-code prefix
  passportRule,   // short alpha + digit sequence
  dateOfBirthRule,// date patterns
  urlRule,        // http(s):// prefix
  apiKeyRule,     // catch-all long alphanumeric — lowest confidence, last
] as const;

/**
 * Detect the most likely data type for a given value.
 * Iterates all rules, returns the highest-confidence match.
 */
export function detect(value: string): DetectionResult {
  const trimmed = value.trim();
  let best: DetectionResult = { type: "generic", confidence: 0 };

  for (const rule of DETECTION_RULES) {
    if (rule.pattern.test(trimmed) && rule.confidence > best.confidence) {
      best = { type: rule.type, confidence: rule.confidence };
    }
  }

  return best;
}
