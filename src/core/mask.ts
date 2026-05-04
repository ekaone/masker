import { detect } from "../detectors/index.js";
import { applyMask } from "../maskers/index.js";
import type { MaskOptions, MaskResult } from "../types/index.js";

/**
 * Auto-detect the type of `value` and apply appropriate masking.
 * Pass `options.type` to skip detection and force a specific type.
 *
 * @example
 * mask("john.doe@example.com")
 * // { masked: "jo*******@example.com", type: "email", confidence: 0.98 }
 *
 * mask("4111 1111 1111 1111")
 * // { masked: "**** **** **** 1111", type: "credit_card", confidence: 0.92 }
 *
 * mask("sk-abc123XYZ", { type: "api_key" })
 * // { masked: "sk-a****XYZ", type: "api_key", confidence: 1.0 }
 */
export function mask(value: string, options: MaskOptions = {}): MaskResult {
  const trimmed = value.trim();

  const detected = options.type
    ? { type: options.type, confidence: 1.0 }
    : detect(trimmed);

  const opts: MaskOptions = { preserveFormat: true, char: "*", ...options };
  const masked = applyMask(trimmed, detected.type, opts);

  return {
    original: trimmed,
    masked,
    type: detected.type,
    confidence: detected.confidence,
  };
}
