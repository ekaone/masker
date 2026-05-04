import type { DetectionRule } from "../types/index.js";

export const passportRule: DetectionRule = {
  type: "passport",
  // 1–2 letters followed by 6–9 digits (covers most issuing countries)
  pattern: /^[A-Z]{1,2}\d{6,9}$/i,
  confidence: 0.75,
};
