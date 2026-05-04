import { describe, it, expect } from "vitest";
import { maskObject } from "../src/utils/mask-object.js";

describe("maskObject() — basic", () => {
  it("masks a string field", () => {
    const r = maskObject({ email: "alice@example.com" });
    expect(r.email).toContain("*");
    expect(r.email).not.toBe("alice@example.com");
  });
  it("non-string values pass through", () => {
    const r = maskObject({ age: 30, active: true, tags: ["a"] });
    expect(r.age).toBe(30);
    expect(r.active).toBe(true);
    expect(r.tags).toEqual(["a"]);
  });
  it("empty object", () => expect(maskObject({})).toEqual({}));
});

describe("maskObject() — key-name hints", () => {
  const hints: [string, string][] = [
    ["email", "alice@example.com"],
    ["mail", "alice@example.com"],
    ["phone", "(415) 867-5309"],
    ["mobile", "+14158675309"],
    ["tel", "415-867-5309"],
    ["card", "4111 1111 1111 1111"],
    ["cc", "4111 1111 1111 1111"],
    ["pan", "4111111111111111"],
    ["ssn", "123-45-6789"],
    ["sin", "123456789"],
    ["token", "sk-proj-abcDEFghiJKLmno123"],
    ["apikey", "sk-proj-abcDEFghiJKLmno123"],
    ["secret", "sk-proj-abcDEFghiJKLmno123"],
    ["iban", "GB29NWBK60161331926819"],
    ["passport", "AB1234567"],
    ["dob", "1990-07-15"],
    ["birthday", "07/15/1990"],
    ["name", "Margaret Thatcher"],
    ["fullname", "Margaret Thatcher"],
  ];
  for (const [key, value] of hints) {
    it(`key "${key}" is masked`, () => {
      const r = maskObject({ [key]: value }) as Record<string, string>;
      expect(r[key]).toContain("*");
      expect(r[key]).not.toBe(value);
    });
  }
});

describe("maskObject() — key normalisation", () => {
  it("snake_case api_key", () =>
    expect(
      (maskObject({ api_key: "sk-proj-abcDEFghiJKLmno12345" }) as any).api_key,
    ).toContain("*"));
  it("kebab-case api-key", () =>
    expect(
      (maskObject({ "api-key": "sk-proj-abcDEFghiJKLmno12345" }) as any)[
        "api-key"
      ],
    ).toContain("*"));
});

describe("maskObject() — options", () => {
  it("custom char passed through", () => {
    const r = maskObject(
      { email: "alice@example.com" },
      { char: "•" },
    ) as Record<string, string>;
    expect(r.email).toContain("•");
    expect(r.email).not.toContain("*");
  });
});

describe("maskObject() — mixed object", () => {
  it("masks strings, preserves non-strings", () => {
    const r = maskObject({
      email: "alice@example.com",
      phone: "(415) 867-5309",
      age: 30,
      active: true,
      score: 99.5,
    }) as any;
    expect(r.email).toContain("*");
    expect(r.phone).toContain("*");
    expect(r.age).toBe(30);
    expect(r.active).toBe(true);
    expect(r.score).toBe(99.5);
  });
});
