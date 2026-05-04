import type { DetectionRule } from "../types/index.ts";

export const ssnRule: DetectionRule = {
  type: "ssn",
  // ###-##-#### or 9 raw digits
  pattern: /^\d{3}-\d{2}-\d{4}$|^\d{9}$/,
  confidence: 0.97,
};
