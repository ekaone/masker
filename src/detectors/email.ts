import type { DetectionRule } from "../types/index.ts";

export const emailRule: DetectionRule = {
  type: "email",
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  confidence: 0.98,
};
