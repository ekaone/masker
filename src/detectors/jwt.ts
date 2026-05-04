import type { DetectionRule } from "../types/index.ts";
export const jwtRule: DetectionRule = {
  type: "jwt",
  // Each segment must be at least 8 chars to rule out short digit runs (e.g. phone dots format)
  pattern: /^[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}$/,
  confidence: 0.95,
};
