import type { MaskType, MaskOptions } from "../types/index.ts";
import { maskEmail } from "./email.ts";
import { maskPhone } from "./phone.ts";
import { maskCreditCard } from "./credit-card.ts";
import { maskSSN } from "./ssn.ts";
import { maskIP } from "./ip-address.ts";
import { maskURL } from "./url.ts";
import { maskJWT } from "./jwt.ts";
import { maskApiKey } from "./api-key.ts";
import { maskIBAN } from "./iban.ts";
import { maskPassport } from "./passport.ts";
import { maskDOB } from "./date-of-birth.ts";
import { maskName } from "./name.ts";
import { maskAddress } from "./address.ts";
import { maskGeneric } from "./generic.ts";

type MaskerFn = (value: string, opts: MaskOptions) => string;

const MASKERS: Record<MaskType, MaskerFn> = {
  email:         maskEmail,
  phone:         maskPhone,
  credit_card:   maskCreditCard,
  ssn:           maskSSN,
  ip_address:    maskIP,
  url:           maskURL,
  jwt:           maskJWT,
  api_key:       maskApiKey,
  iban:          maskIBAN,
  passport:      maskPassport,
  date_of_birth: maskDOB,
  name:          maskName,
  address:       maskAddress,
  generic:       maskGeneric,
};

/**
 * Dispatch to the correct masker for a given type.
 */
export function applyMask(
  value: string,
  type: MaskType,
  opts: MaskOptions
): string {
  const masker = MASKERS[type] ?? maskGeneric;
  return masker(value, opts);
}
