import type { MaskType, MaskOptions } from "../types/index.js";
import { maskEmail } from "./email.js";
import { maskPhone } from "./phone.js";
import { maskCreditCard } from "./credit-card.js";
import { maskSSN } from "./ssn.js";
import { maskIP } from "./ip-address.js";
import { maskURL } from "./url.js";
import { maskJWT } from "./jwt.js";
import { maskApiKey } from "./api-key.js";
import { maskIBAN } from "./iban.js";
import { maskPassport } from "./passport.js";
import { maskDOB } from "./date-of-birth.js";
import { maskName } from "./name.js";
import { maskAddress } from "./address.js";
import { maskGeneric } from "./generic.js";

type MaskerFn = (value: string, opts: MaskOptions) => string;

const MASKERS: Record<MaskType, MaskerFn> = {
  email: maskEmail,
  phone: maskPhone,
  credit_card: maskCreditCard,
  ssn: maskSSN,
  ip_address: maskIP,
  url: maskURL,
  jwt: maskJWT,
  api_key: maskApiKey,
  iban: maskIBAN,
  passport: maskPassport,
  date_of_birth: maskDOB,
  name: maskName,
  address: maskAddress,
  generic: maskGeneric,
};

/**
 * Dispatch to the correct masker for a given type.
 */
export function applyMask(
  value: string,
  type: MaskType,
  opts: MaskOptions,
): string {
  const masker = MASKERS[type] ?? maskGeneric;
  return masker(value, opts);
}
