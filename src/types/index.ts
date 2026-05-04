// ─── Core domain types

export type MaskType =
  | "email"
  | "phone"
  | "credit_card"
  | "ssn"
  | "ip_address"
  | "url"
  | "jwt"
  | "api_key"
  | "iban"
  | "passport"
  | "date_of_birth"
  | "name"
  | "address"
  | "generic";

export interface MaskOptions {
  /** Force a specific type instead of auto-detecting */
  type?: MaskType;
  /** Characters to reveal at the start (type-dependent default) */
  revealStart?: number;
  /** Characters to reveal at the end (type-dependent default) */
  revealEnd?: number;
  /** Character used for masking (default: '*') */
  char?: string;
  /** Keep formatting separators like spaces, dashes, @ (default: true) */
  preserveFormat?: boolean;
}

export interface MaskResult {
  original: string;
  masked: string;
  type: MaskType;
  confidence: number; // 0–1
}

export interface DetectionResult {
  type: MaskType;
  confidence: number;
}

export interface DetectionRule {
  type: MaskType;
  pattern: RegExp;
  confidence: number;
}
