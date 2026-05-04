import { describe, it, expect } from "vitest";
import { maskEmail } from "../src/maskers/email.js";
import { maskPhone } from "../src/maskers/phone.js";
import { maskCreditCard } from "../src/maskers/credit-card.js";
import { maskSSN } from "../src/maskers/ssn.js";
import { maskIP } from "../src/maskers/ip-address.js";
import { maskURL } from "../src/maskers/url.js";
import { maskJWT } from "../src/maskers/jwt.js";
import { maskApiKey } from "../src/maskers/api-key.js";
import { maskIBAN } from "../src/maskers/iban.js";
import { maskPassport } from "../src/maskers/passport.js";
import { maskDOB } from "../src/maskers/date-of-birth.js";
import { maskName } from "../src/maskers/name.js";
import { maskAddress } from "../src/maskers/address.js";
import { maskGeneric } from "../src/maskers/generic.js";

const O = { char: "*", preserveFormat: true };

describe("maskEmail", () => {
  it("masks local part, keeps domain", () =>
    expect(maskEmail("john.doe@example.com", O)).toBe("jo******@example.com"));
  it("revealStart option", () =>
    expect(maskEmail("john.doe@example.com", { ...O, revealStart: 4 })).toBe(
      "john****@example.com",
    ));
  it("local length 2 fully masked", () =>
    expect(maskEmail("ab@x.com", O)).toBe("**@x.com"));
  it("local length 1 fully masked", () =>
    expect(maskEmail("a@x.com", O)).toBe("*@x.com"));
  it("falls back for missing @", () =>
    expect(maskEmail("notanemail", O)).toContain("*"));
  it("preserves subdomain in domain", () =>
    expect(maskEmail("u@mail.example.co.uk", O)).toContain(
      "@mail.example.co.uk",
    ));
  it("custom char", () =>
    expect(
      maskEmail("john@x.com", { char: "•", preserveFormat: true }),
    ).toContain("•"));
});

describe("maskPhone", () => {
  it("reveals last 4 digits", () =>
    expect(maskPhone("(415) 867-5309", O)).toContain("5309"));
  it("preserves parens and space", () =>
    expect(maskPhone("(415) 867-5309", O)).toMatch(/^\(\*+\) \*+-\d{4}$/));
  it("revealEnd option", () =>
    expect(maskPhone("(415) 867-5309", { ...O, revealEnd: 2 }).slice(-2)).toBe(
      "09",
    ));
  it("preserveFormat false strips format", () =>
    expect(
      maskPhone("(415) 867-5309", { ...O, preserveFormat: false }),
    ).not.toContain("("));
  it("E.164 format", () =>
    expect(maskPhone("+14158675309", O)).toContain("5309"));
});

describe("maskCreditCard", () => {
  it("reveals last 4 with spaces", () =>
    expect(maskCreditCard("4111 1111 1111 1111", O)).toMatch(
      /\*{4} \*{4} \*{4} 1111/,
    ));
  it("preserves dashes", () =>
    expect(maskCreditCard("4111-1111-1111-1111", O)).toMatch(
      /\*{4}-\*{4}-\*{4}-1111/,
    ));
  it("revealEnd option", () =>
    expect(
      maskCreditCard("4111 1111 1111 1111", { ...O, revealEnd: 6 })
        .replace(/\D/g, "")
        .slice(-6),
    ).toBe("111111"));
  it("preserveFormat false", () => {
    const r = maskCreditCard("4111 1111 1111 1111", {
      ...O,
      preserveFormat: false,
    });
    expect(r).not.toContain(" ");
    expect(r.slice(-4)).toBe("1111");
  });
});

describe("maskSSN", () => {
  it("masks all but last 4, keeps dashes", () =>
    expect(maskSSN("123-45-6789", O)).toBe("***-**-6789"));
  it("raw 9 digits", () => expect(maskSSN("123456789", O)).toBe("*****6789"));
  it("revealEnd option", () =>
    expect(
      maskSSN("123-45-6789", { ...O, revealEnd: 2 })
        .replace(/\D/g, "")
        .slice(-2),
    ).toBe("89"));
  it("custom char", () =>
    expect(maskSSN("123-45-6789", { char: "•", preserveFormat: true })).toBe(
      "•••-••-6789",
    ));
});

describe("maskIP", () => {
  it("masks last two IPv4 octets", () => {
    const r = maskIP("192.168.100.42", O);
    expect(r.startsWith("192.168.")).toBe(true);
    expect(r).toMatch(/\*/);
  });
  it("first two octets exact", () =>
    expect(maskIP("10.20.30.40", O).startsWith("10.20.")).toBe(true));
  it("IPv6 masks second half", () => {
    const r = maskIP("2001:db8::1", O);
    expect(r.startsWith("2001")).toBe(true);
    expect(r).toMatch(/\*/);
  });
  it("custom char", () =>
    expect(
      maskIP("192.168.1.1", { char: "x", preserveFormat: true }),
    ).toContain("x"));
});

describe("maskURL", () => {
  it("preserves scheme and host", () =>
    expect(
      maskURL("https://api.example.com/v1?token=abc", O).startsWith(
        "https://api.example.com",
      ),
    ).toBe(true));
  it("masks path and query", () => {
    const r = maskURL("https://api.example.com/v1?token=abc", O);
    expect(r).toMatch(/\*/);
    expect(r).not.toContain("token");
  });
  it("URL with no path", () =>
    expect(
      maskURL("https://example.com", O).startsWith("https://example.com"),
    ).toBe(true));
  it("invalid URL falls back to generic", () =>
    expect(maskURL("not-a-url", O)).toContain("*"));
});

describe("maskJWT", () => {
  const t =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV";
  it("keeps header intact", () =>
    expect(maskJWT(t, O).split(".")[0]).toBe("eyJhbGciOiJIUzI1NiJ9"));
  it("fully masks payload", () =>
    expect(maskJWT(t, O).split(".")[1]).toMatch(/^\*+$/));
  it("fully masks signature", () =>
    expect(maskJWT(t, O).split(".")[2]).toMatch(/^\*+$/));
  it("preserves segment lengths", () => {
    const p = t.split(".");
    const r = maskJWT(t, O).split(".");
    expect(r[1].length).toBe(p[1].length);
    expect(r[2].length).toBe(p[2].length);
  });
  it("falls back for non-JWT", () =>
    expect(maskJWT("header.payload", O)).toContain("*"));
});

describe("maskApiKey", () => {
  it("reveals first and last 4", () => {
    const r = maskApiKey("sk-proj-abc123XYZ789", O);
    expect(r.startsWith("sk-p")).toBe(true);
    expect(r.slice(-4)).toBe("Z789");
  });
  it("short key fully masked", () =>
    expect(maskApiKey("short", O)).toMatch(/^\*+$/));
  it("custom revealStart and revealEnd", () => {
    const r = maskApiKey("sk-proj-abc123XYZ789", {
      ...O,
      revealStart: 2,
      revealEnd: 2,
    });
    expect(r.startsWith("sk")).toBe(true);
    expect(r.slice(-2)).toBe("89");
  });
  it("middle is fully masked", () =>
    expect(maskApiKey("sk-proj-abc123XYZ789", O).slice(4, -4)).toMatch(
      /^\*+$/,
    ));
});

describe("maskIBAN", () => {
  it("reveals first 4 chars", () =>
    expect(maskIBAN("GB29NWBK60161331926819", O).startsWith("GB29")).toBe(
      true,
    ));
  it("masks everything after pos 4", () =>
    expect(maskIBAN("GB29NWBK60161331926819", O).slice(4)).toMatch(/^\*+$/));
  it("custom revealStart", () => {
    const r = maskIBAN("GB29NWBK60161331926819", { ...O, revealStart: 2 });
    expect(r.startsWith("GB")).toBe(true);
    expect(r[2]).toBe("*");
  });
});

describe("maskPassport", () => {
  it("reveals first 2 chars", () =>
    expect(maskPassport("AB1234567", O).startsWith("AB")).toBe(true));
  it("masks digits after prefix", () =>
    expect(maskPassport("AB1234567", O).slice(2)).toMatch(/^\*+$/));
  it("preserves length", () =>
    expect(maskPassport("AB1234567", O).length).toBe(9));
  it("custom revealStart", () =>
    expect(maskPassport("AB1234567", { ...O, revealStart: 1 })[1]).toBe("*"));
});

describe("maskDOB", () => {
  it("reveals year in YYYY-MM-DD", () => {
    const r = maskDOB("1990-07-15", O);
    expect(r.startsWith("1990")).toBe(true);
    expect(r).toMatch(/\*/);
  });
  it("reveals year in MM/DD/YYYY", () => {
    const r = maskDOB("07/15/1990", O);
    expect(r.endsWith("1990")).toBe(true);
    expect(r).toMatch(/\*/);
  });
  it("masks the month digits", () =>
    expect(maskDOB("1990-07-15", O).slice(5, 7)).toMatch(/^\*+$/));
  it("custom char", () =>
    expect(
      maskDOB("1990-07-15", { char: "•", preserveFormat: true }),
    ).toContain("•"));
});

describe("maskName", () => {
  it("reveals first letter of each word", () => {
    const r = maskName("Margaret Thatcher", O);
    expect(r[0]).toBe("M");
    expect(r.split(" ")[1][0]).toBe("T");
  });
  it("masks remaining letters", () =>
    expect(maskName("Margaret Thatcher", O).split(" ")[0].slice(1)).toMatch(
      /^\*+$/,
    ));
  it("single word", () => {
    const r = maskName("Madonna", O);
    expect(r[0]).toBe("M");
    expect(r.slice(1)).toMatch(/^\*+$/);
  });
  it("single-char word unchanged", () =>
    expect(maskName("J K Rowling", O)).toMatch(/^J K R\*+$/));
  it("preserves word count", () =>
    expect(maskName("John Paul Jones", O).split(" ").length).toBe(3));
});

describe("maskAddress", () => {
  it("keeps number, masks street name", () => {
    const r = maskAddress("123 Baker Street, London, W1U 6RS", O);
    expect(r.startsWith("123")).toBe(true);
    expect(r).toContain("*");
  });
  it("preserves city/state after comma", () =>
    expect(maskAddress("123 Baker Street, London, W1U 6RS", O)).toContain(
      ", London,",
    ));
  it("no comma falls back to generic", () =>
    expect(maskAddress("123 Baker Street", O)).toContain("*"));
});

describe("maskGeneric", () => {
  it("reveals first and last char", () => {
    const r = maskGeneric("abcdefgh", O);
    expect(r[0]).toBe("a");
    expect(r.at(-1)).toBe("h");
  });
  it("very short value fully masked", () =>
    expect(maskGeneric("ab", O)).toBe("**"));
  it("middle fully masked", () =>
    expect(maskGeneric("abcdefgh", O).slice(1, -1)).toMatch(/^\*+$/));
  it("custom revealStart + revealEnd", () => {
    const r = maskGeneric("abcdefgh", { ...O, revealStart: 2, revealEnd: 2 });
    expect(r.startsWith("ab")).toBe(true);
    expect(r.endsWith("gh")).toBe(true);
  });
  it("custom char", () =>
    expect(
      maskGeneric("abcdefgh", { char: "▪", preserveFormat: true }),
    ).toContain("▪"));
});
