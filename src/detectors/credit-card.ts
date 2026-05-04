import type { DetectionRule } from "../types/index.ts";

export const creditCardRule: DetectionRule = {
  type: "credit_card",
  // 13–19 digits optionally separated by spaces or dashes
  pattern: /^(?:\d{4}[\s-]?){3}\d{1,4}$/,
  confidence: 0.92,
};
