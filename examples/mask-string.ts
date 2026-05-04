import { mask, detect, maskObject, maskString } from "../dist/index.js";

// Auto-detect and mask
console.log(mask("john.doe@example.com"));
// { masked: "jo*******@example.com", type: "email", confidence: 0.98 }

console.log(mask("4111 1111 1111 1111"));
// { masked: "**** **** **** 1111", type: "credit_card", confidence: 0.92 }

console.log(mask("123-45-6789"));
// { masked: "***-**-6789", type: "ssn", confidence: 0.97 }

console.log(mask("(415) 867-5309"));
// { masked: "(***) ***-5309", type: "phone", confidence: 0.88 }

console.log(mask("192.168.100.42"));
// { masked: "192.168.***.**, type: "ip_address", confidence: 0.93 }

console.log(mask("eyJhbGci....eyJzdWI....SflKxw..."));
// { masked: "eyJhbGci....****....****", type: "jwt", confidence: 0.95 }

console.log(
  maskString(
    "Request from user@example.com at 192.168.1.1 token=sk-abc123def456",
  ),
);
// "Request from us***@example.com at 192.168.***.* token=sk-a*******56"
