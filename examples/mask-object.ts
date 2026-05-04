import { maskObject } from "../dist/index.js";

console.log(
  maskObject({
    email: "alice@example.com",
    phone: "555-123-4567",
    apiKey: "sk-abc123xyz456abc",
    age: 30, // non-strings are untouched
  }),
);
