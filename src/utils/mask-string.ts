import { mask } from "../core/mask.js";
import type { MaskOptions } from "../types/index.ts";

/**
 * Token patterns ordered by specificity:
 * 1. Email addresses
 * 2. SSNs              ###-##-####
 * 3. Phone numbers     ###-###-#### variants
 * 4. IPv4 addresses    dotted-quad (before long digit runs to avoid partial match)
 * 5. Long digit runs   credit cards, account numbers (12+ digits)
 * 6. URLs              https://...
 * 7. Alphanumeric keys 12+ chars — lookbehind blocks \w prefix, allows = prefix
 *    so "token=sk-abc..." correctly captures "sk-abc..." not "abc..."
 */
const TOKEN_PATTERN =
  /(?:[^\s,;()\[\]{}'"`]+@[^\s,;()\[\]{}'"`]+)|(?:\b\d{3}-\d{2}-\d{4}\b)|(?:\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b)|(?:\b(?:\d{1,3}\.){3}\d{1,3}\b)|(?:\b\d[\d\s\-]{10,}\d\b)|(?:https?:\/\/[^\s]+)|(?:(?<!\w)[A-Za-z0-9_\-]{12,}(?!\w))/g;

// Matches api_key confidence (0.60) — log sanitizer should be aggressive
const MIN_CONFIDENCE = 0.6;

export function maskString(text: string, options: MaskOptions = {}): string {
  return text.replace(TOKEN_PATTERN, (token) => {
    const result = mask(token, options);
    if (result.type !== "generic" && result.confidence >= MIN_CONFIDENCE) {
      return result.masked;
    }
    return token;
  });
}
