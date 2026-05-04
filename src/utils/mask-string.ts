import { mask } from "../core/mask.js";
import type { MaskOptions } from "../types/index.js";

/**
 * Token patterns to find sensitive values in free-form text, ordered by specificity:
 * 1. Email addresses
 * 2. SSNs              ###-##-####
 * 3. Phone numbers     ###-###-#### variants
 * 4. Long digit runs   credit cards, account numbers
 * 5. URLs              https://...
 * 6. Long alphanumeric API keys / tokens (20+ chars)
 *
 * NOTE: The api_key segment uses a lookahead/lookbehind instead of \b because
 * tokens containing hyphens (e.g. sk-proj-...) have a non-word char at the
 * boundary, which causes \b to silently fail.
 */
const TOKEN_PATTERN =
  /(?:[^\s,;()\[\]{}'"`]+@[^\s,;()\[\]{}'"`]+)|(?:\b\d{3}-\d{2}-\d{4}\b)|(?:\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b)|(?:\b\d[\d\s\-]{10,}\d\b)|(?:https?:\/\/[^\s]+)|(?:(?<![=\w])[A-Za-z0-9_\-]{20,}(?![=\w]))/g;

// Set to 0.60 to include api_key (confidence: 0.60) — maskString is a
// log sanitizer where aggressive masking is preferable to missed tokens.
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
