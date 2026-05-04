# @ekaone/masker

> Universal masking library — detects data type and applies appropriate masking automatically.

Zero dependencies. TypeScript-native. Works in Node.js, Deno, Bun, and the browser.

## Features

- **Auto-detection** — `mask(value)` just works for 12 data types
- **Explicit override** — `mask(value, { type: 'ssn' })` when you know the type
- **Format-preserving** — keeps spaces, dashes, `@` symbols by default
- **Configurable** — custom mask char, reveal start/end counts
- **Object helper** — `maskObject(obj)` uses key name hints to bias detection
- **Log sanitizer** — `maskString(text)` scrubs tokens from free-form log lines
- **TypeScript-native** — full types, discriminated union results

## Install

```sh
npm install @ekaone/masker
# or
pnpm add @ekaone/masker
```

## Quick Start

```ts
import { mask, detect, maskObject, maskString } from "@ekaone/masker";

// Auto-detect and mask
mask("john.doe@example.com");
// { masked: "jo*******@example.com", type: "email", confidence: 0.98 }

mask("4111 1111 1111 1111");
// { masked: "**** **** **** 1111", type: "credit_card", confidence: 0.92 }

mask("123-45-6789");
// { masked: "***-**-6789", type: "ssn", confidence: 0.97 }

mask("(415) 867-5309");
// { masked: "(***) ***-5309", type: "phone", confidence: 0.88 }

mask("192.168.100.42");
// { masked: "192.168.***.**, type: "ip_address", confidence: 0.93 }

mask("eyJhbGci....eyJzdWI....SflKxw...");
// { masked: "eyJhbGci....****....****", type: "jwt", confidence: 0.95 }
```

## Supported Types

| Type            | Example input              | Strategy                              |
|-----------------|----------------------------|---------------------------------------|
| `email`         | `user@example.com`         | Mask local part, keep domain          |
| `phone`         | `(415) 867-5309`           | Mask all but last 4 digits            |
| `credit_card`   | `4111 1111 1111 1111`      | Mask all but last 4, preserve spaces  |
| `ssn`           | `123-45-6789`              | Mask all but last 4                   |
| `ip_address`    | `192.168.100.42`           | Mask last two octets                  |
| `url`           | `https://api.io/v1?k=abc`  | Preserve host, mask path/query        |
| `jwt`           | `aaa.bbb.ccc`              | Keep header, mask payload + signature |
| `api_key`       | `sk-proj-abc123XYZ`        | Reveal first/last 4 chars             |
| `iban`          | `GB29NWBK601613...`        | Reveal country + check digits only    |
| `passport`      | `AB1234567`                | Reveal first 2 chars                  |
| `date_of_birth` | `1990-07-15`               | Reveal year only                      |
| `name`          | `Margaret Thatcher`        | Reveal first letter of each word      |
| `generic`       | anything else              | Reveal first + last char              |

## API

### `mask(value, options?): MaskResult`

Auto-detect or force-type and mask a string.

```ts
interface MaskOptions {
  type?: MaskType;        // force a specific type
  revealStart?: number;   // chars to show at start (type-dependent default)
  revealEnd?: number;     // chars to show at end
  char?: string;          // mask character (default: '*')
  preserveFormat?: boolean; // keep separators (default: true)
}

interface MaskResult {
  original: string;
  masked: string;
  type: MaskType;
  confidence: number;     // 0–1
}
```

### `detect(value): { type: MaskType; confidence: number }`

Identify the data type without masking.

```ts
detect("user@example.com"); // { type: "email", confidence: 0.98 }
```

### `maskObject(obj, options?)`

Mask all string fields in a plain object. Key name hints (e.g. `email`, `ssn`, `token`) bias the type detection.

```ts
maskObject({
  email: "alice@example.com",
  phone: "555-123-4567",
  apiKey: "sk-abc123xyz456abc",
  age: 30,                      // non-strings are untouched
});
// {
//   email: "al***@example.com",
//   phone: "***-***-4567",
//   apiKey: "sk-a***********c",
//   age: 30,
// }
```

### `maskString(text, options?)`

Sanitize sensitive tokens found inside a free-form string. Useful for log scrubbing.

```ts
maskString("Request from user@example.com at 192.168.1.1 token=sk-abc123def456");
// "Request from us***@example.com at 192.168.***.* token=sk-a*******56"
```

## Options Examples

```ts
// Custom mask character
mask("123-45-6789", { char: "•" });
// "•••-••-6789"

// Custom reveal window
mask("sk-proj-abc123XYZ789", { revealStart: 6, revealEnd: 0 });
// "sk-pro*************"

// Disable format preservation
mask("4111 1111 1111 1111", { preserveFormat: false });
// "************1111"
```

## License

MIT © [Eka Prasetia](./LICENSE)

## Links

- [npm package](https://www.npmjs.com/package/@ekaone/masker)
- [GitHub repository](https://github.com/ekaone/masker)
- [Issue tracker](https://github.com/ekaone/masker/issues)
