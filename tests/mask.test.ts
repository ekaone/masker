import { describe, it, expect } from "vitest";
import { mask } from "../src/core/mask.js";

describe("mask() — return shape", () => {
  it("has original, masked, type, confidence", () => {
    const r = mask("user@example.com");
    expect(r).toHaveProperty("original");
    expect(r).toHaveProperty("masked");
    expect(r).toHaveProperty("type");
    expect(r).toHaveProperty("confidence");
  });
  it("trims whitespace from original", () =>
    expect(mask("  user@example.com  ").original).toBe("user@example.com"));
  it("confidence between 0 and 1", () => {
    const { confidence } = mask("user@example.com");
    expect(confidence).toBeGreaterThan(0);
    expect(confidence).toBeLessThanOrEqual(1);
  });
});

describe("mask() — auto-detection routing", () => {
  const cases: [string, string][] = [
    ["user@example.com", "email"],
    ["(415) 867-5309", "phone"],
    ["4111 1111 1111 1111", "credit_card"],
    ["123-45-6789", "ssn"],
    ["192.168.1.42", "ip_address"],
    ["https://api.example.com/v1?t=abc", "url"],
    ["eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.SflKxwRJSMeKKF2QT4fwpM", "jwt"],
    ["sk-proj-abcDEFghiJKLmno12345XYZ", "api_key"],
    ["GB29NWBK60161331926819", "iban"],
    ["AB1234567", "passport"],
    ["1990-07-15", "date_of_birth"],
  ];
  for (const [value, expected] of cases) {
    it(`"${value.slice(0, 22)}…" → ${expected}`, () =>
      expect(mask(value).type).toBe(expected));
  }
});

describe("mask() — force type override", () => {
  it("forces type, confidence becomes 1.0", () => {
    const r = mask("MYKEY-abc123def456ghi", { type: "api_key" });
    expect(r.type).toBe("api_key");
    expect(r.confidence).toBe(1.0);
  });
  it("forces name", () => {
    const r = mask("Alice Smith", { type: "name" });
    expect(r.type).toBe("name");
    expect(r.masked[0]).toBe("A");
  });
  it("forces address", () => {
    const r = mask("123 Main St, Springfield", { type: "address" });
    expect(r.type).toBe("address");
    expect(r.masked).toContain("123");
  });
});

describe("mask() — options passthrough", () => {
  it("custom char", () => {
    const { masked } = mask("123-45-6789", { char: "•" });
    expect(masked).toContain("•");
    expect(masked).not.toContain("*");
  });
  it("revealStart to email", () =>
    expect(
      mask("john.doe@example.com", { revealStart: 4 }).masked.startsWith(
        "john",
      ),
    ).toBe(true));
  it("revealEnd to card", () =>
    expect(
      mask("4111 1111 1111 1111", { revealEnd: 6 })
        .masked.replace(/\D/g, "")
        .slice(-6),
    ).toBe("111111"));
  it("preserveFormat false", () =>
    expect(
      mask("(415) 867-5309", { preserveFormat: false }).masked,
    ).not.toContain("("));
});

describe("mask() — masked differs from original", () => {
  [
    "user@example.com",
    "4111 1111 1111 1111",
    "123-45-6789",
    "(415) 867-5309",
    "192.168.1.42",
  ].forEach((v) => {
    it(v, () => expect(mask(v).masked).not.toBe(v));
  });
});

describe("mask() — generic fallback", () => {
  it("unknown input → generic type", () =>
    expect(mask("helloworld").type).toBe("generic"));
  it("still produces masked output", () => {
    const { masked, original } = mask("helloworld");
    expect(masked).not.toBe(original);
    expect(masked).toContain("*");
  });
});
