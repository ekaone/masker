/**
 * @file index.ts
 * @description Core entry point for @ekaone/masker.
 * @author Eka Prasetia
 * @website https://prasetia.me
 * @license MIT
 */

// Types
export type {
  MaskType,
  MaskOptions,
  MaskResult,
  DetectionResult,
  DetectionRule,
} from "./types/index.js";

// Core
export { mask } from "./core/mask.js";

// Detection (exposed for consumers who only need to identify, not mask)
export { detect } from "./detectors/index.js";

// Utilities
export { maskObject } from "./utils/mask-object.js";
export { maskString } from "./utils/mask-string.js";
