import type { DetectionRule } from "../types/index.ts";

export const phoneRule: DetectionRule = {
  type: "phone",
  // E.164, US domestic, international variants
  pattern:
    /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$|^\+?[1-9]\d{6,14}$/,
  confidence: 0.88,
};
