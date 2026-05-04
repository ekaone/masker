import type { DetectionRule } from "../types/index.js";

export const dateOfBirthRule: DetectionRule = {
  type: "date_of_birth",
  // MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD, YYYY/MM/DD
  pattern:
    /^(0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])[/-]\d{2,4}$|^\d{4}[/-](0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])$/,
  confidence: 0.8,
};
