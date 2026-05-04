import type { DetectionRule } from "../types/index.ts";
export const ibanRule: DetectionRule = {
  type: "iban",
  // Total length >= 15: 2 country + 2 check + min 11 BBAN. Excludes short passport-like strings.
  pattern: /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/i,
  confidence: 0.85,
};
