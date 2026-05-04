import type { DetectionRule } from "../types/index.js";

export const emailRule: DetectionRule = {
  type: "email",
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  confidence: 0.98,
};
