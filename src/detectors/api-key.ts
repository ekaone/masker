import type { DetectionRule } from "../types/index.js";

export const apiKeyRule: DetectionRule = {
  type: "api_key",
  // Heuristic: 20+ alphanumeric chars (often with underscores/dashes)
  // Lower confidence — intentionally last resort
  pattern: /^[A-Za-z0-9_\-./]{20,}$/,
  confidence: 0.6,
};
