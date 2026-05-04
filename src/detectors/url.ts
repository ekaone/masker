import type { DetectionRule } from "../types/index.ts";

export const urlRule: DetectionRule = {
  type: "url",
  pattern: /^https?:\/\/.+/i,
  confidence: 0.95,
};
