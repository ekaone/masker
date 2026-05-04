import { describe, it, expect } from "vitest";
import { detect, DETECTION_RULES } from "../src/index.js";

describe("DETECTION_RULES ordering", () => {
  it("jwt appears before api_key", () => {
    const ji = DETECTION_RULES.findIndex((r) => r.type === "jwt");
    const ai = DETECTION_RULES.findIndex((r) => r.type === "api_key");
    expect(ji).toBeLessThan(ai);
  });
  it("ssn appears before api_key", () => {
    const si = DETECTION_RULES.findIndex((r) => r.type === "ssn");
    const ai = DETECTION_RULES.findIndex((r) => r.type === "api_key");
    expect(si).toBeLessThan(ai);
  });
  it("api_key has the lowest confidence of all rules", () => {
    const apiConf = DETECTION_RULES.find(
      (r) => r.type === "api_key",
    )!.confidence;
    DETECTION_RULES.filter((r) => r.type !== "api_key").forEach((r) => {
      expect(apiConf).toBeLessThan(r.confidence);
    });
  });
});

describe("detect — email", () => {
  it("standard email", () =>
    expect(detect("user@example.com").type).toBe("email"));
  it("subdomain email", () =>
    expect(detect("user@mail.example.co.uk").type).toBe("email"));
  it("plus-tag email", () =>
    expect(detect("user+tag@example.com").type).toBe("email"));
  it("confidence 0.98", () =>
    expect(detect("user@example.com").confidence).toBe(0.98));
  it("no match on plain text", () =>
    expect(detect("hello world").type).not.toBe("email"));
});

describe("detect — phone", () => {
  it("US parens format", () =>
    expect(detect("(415) 867-5309").type).toBe("phone"));
  it("US dots format", () => expect(detect("415.867.5309").type).toBe("phone"));
  it("E.164 international", () =>
    expect(detect("+447911123456").type).toBe("phone"));
  it("confidence 0.88", () =>
    expect(detect("(415) 867-5309").confidence).toBe(0.88));
});

describe("detect — credit_card", () => {
  it("with spaces", () =>
    expect(detect("4111 1111 1111 1111").type).toBe("credit_card"));
  it("with dashes", () =>
    expect(detect("4111-1111-1111-1111").type).toBe("credit_card"));
  it("no separators", () =>
    expect(detect("4111111111111111").type).toBe("credit_card"));
  it("confidence 0.92", () =>
    expect(detect("4111 1111 1111 1111").confidence).toBe(0.92));
});

describe("detect — ssn", () => {
  it("with dashes", () => expect(detect("123-45-6789").type).toBe("ssn"));
  it("raw 9 digits", () => expect(detect("123456789").type).toBe("ssn"));
  it("confidence 0.97", () =>
    expect(detect("123-45-6789").confidence).toBe(0.97));
  it("8 digits no match", () =>
    expect(detect("12345678").type).not.toBe("ssn"));
});

describe("detect — ip_address", () => {
  it("IPv4", () => expect(detect("192.168.1.42").type).toBe("ip_address"));
  it("IPv4 with CIDR", () =>
    expect(detect("10.0.0.0/8").type).toBe("ip_address"));
  it("confidence 0.93", () =>
    expect(detect("192.168.1.42").confidence).toBe(0.93));
});

describe("detect — url", () => {
  it("https", () =>
    expect(detect("https://api.example.com/v1?t=abc").type).toBe("url"));
  it("http", () => expect(detect("http://localhost:3000").type).toBe("url"));
  it("confidence 0.95", () =>
    expect(detect("https://example.com").confidence).toBe(0.95));
  it("no match bare domain", () =>
    expect(detect("example.com").type).not.toBe("url"));
});

describe("detect — jwt", () => {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.abc123XYZ_abc";
  it("three-segment base64url", () => expect(detect(token).type).toBe("jwt"));
  it("confidence 0.95", () => expect(detect(token).confidence).toBe(0.95));
  it("two segments no match", () =>
    expect(detect("header.payload").type).not.toBe("jwt"));
  it("beats api_key for long JWTs", () => {
    const long =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV";
    expect(detect(long).type).toBe("jwt");
  });
  it("dot-format phone does NOT match jwt", () => {
    expect(detect("415.867.5309").type).not.toBe("jwt");
  });
});

describe("detect — api_key", () => {
  it("long alphanumeric key", () =>
    expect(detect("sk-proj-abcDEFghiJKLmno12345XYZ").type).toBe("api_key"));
  it("confidence 0.60", () =>
    expect(detect("sk-proj-abcDEFghiJKLmno12345XYZ").confidence).toBe(0.6));
  it("short string no match", () =>
    expect(detect("abc123").type).not.toBe("api_key"));
});

describe("detect — iban", () => {
  it("GB IBAN", () =>
    expect(detect("GB29NWBK60161331926819").type).toBe("iban"));
  it("confidence 0.85", () =>
    expect(detect("GB29NWBK60161331926819").confidence).toBe(0.85));
  it("short passport-like string does NOT match iban", () => {
    expect(detect("AB1234567").type).not.toBe("iban");
  });
});

describe("detect — passport", () => {
  it("two-letter prefix", () =>
    expect(detect("AB1234567").type).toBe("passport"));
  it("one-letter prefix", () =>
    expect(detect("A12345678").type).toBe("passport"));
  it("confidence 0.75", () =>
    expect(detect("AB1234567").confidence).toBe(0.75));
});

describe("detect — date_of_birth", () => {
  it("YYYY-MM-DD", () =>
    expect(detect("1990-07-15").type).toBe("date_of_birth"));
  it("MM/DD/YYYY", () =>
    expect(detect("07/15/1990").type).toBe("date_of_birth"));
  it("confidence 0.80", () =>
    expect(detect("1990-07-15").confidence).toBe(0.8));
});

describe("detect — generic fallback", () => {
  it("plain text → generic", () =>
    expect(detect("hello world").type).toBe("generic"));
  it("confidence 0 for generic", () =>
    expect(detect("hello world").confidence).toBe(0));
  it("trims whitespace", () =>
    expect(detect("  user@example.com  ").type).toBe("email"));
});
