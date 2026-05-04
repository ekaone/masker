import type { DetectionRule } from "../types/index.ts";

export const apiKeyRule: DetectionRule = {
  type: "api_key",
  // Minimum 12 chars to cover short-prefix keys like sk-<9chars>, pk-<9chars> etc.
  // Kept as last rule and lowest confidence — it is intentionally a catch-all.
  pattern: /^[A-Za-z0-9_\-./]{12,}$/,
  confidence: 0.6,
};
