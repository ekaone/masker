import { describe, it, expect } from "vitest";
import { maskString } from "../src/utils/mask-string.js";

describe("maskString() — email", () => {
  it("masks email in a log line", () => {
    const r = maskString("Login: email=user@example.com status=ok");
    expect(r).not.toContain("user@example.com");
    expect(r).toContain("status=ok");
  });
  it("masks email mid-sentence", () => {
    const r = maskString("Contact alice@example.com for help");
    expect(r).not.toContain("alice@example.com");
    expect(r).toContain("for help");
  });
  it("masks multiple emails", () => {
    const r = maskString("From: a@x.com To: b@y.com");
    expect(r).not.toContain("a@x.com");
    expect(r).not.toContain("b@y.com");
  });
});

describe("maskString() — SSN", () => {
  it("masks SSN in a log line", () => {
    const r = maskString("SSN: 123-45-6789 verified");
    expect(r).not.toContain("123-45-6789");
    expect(r).toContain("verified");
  });
});

describe("maskString() — phone", () => {
  it("masks US phone in text", () => {
    const r = maskString("Call 415-867-5309 anytime");
    expect(r).not.toContain("867-5309");
    expect(r).toContain("anytime");
  });
});

describe("maskString() — URL", () => {
  it("masks URL with token param", () => {
    const r = maskString(
      "Request to https://api.example.com/v1?token=abc123 failed",
    );
    expect(r).not.toContain("token=abc123");
    expect(r).toContain("failed");
  });
});

describe("maskString() — API key", () => {
  it("masks standalone token", () => {
    const r = maskString("Bearer sk-proj-abcDEFghiJKLmno12345XYZ status=ok");
    expect(r).not.toContain("sk-proj-abcDEFghiJKLmno12345XYZ");
    expect(r).toContain("status=ok");
  });
});

describe("maskString() — unchanged content", () => {
  it("plain text untouched", () => {
    const s = "Hello world, nothing here.";
    expect(maskString(s)).toBe(s);
  });
  it("preserves surrounding words", () => {
    const r = maskString("Error for user@example.com in production");
    expect(r).toContain("Error for");
    expect(r).toContain("in production");
  });
  it("empty string unchanged", () => expect(maskString("")).toBe(""));
});

describe("maskString() — options", () => {
  it("passes custom char through", () => {
    const r = maskString("Login user@example.com failed", { char: "•" });
    expect(r).toContain("•");
  });
});

describe("maskString() — multiple tokens", () => {
  it("masks all sensitive tokens in one pass", () => {
    const r = maskString(
      "user=alice@example.com ip=192.168.1.1 ssn=123-45-6789 status=ok",
    );
    expect(r).not.toContain("alice@example.com");
    expect(r).not.toContain("123-45-6789");
    expect(r).toContain("status=ok");
  });
});
