import { mask, maskString } from "../dist/index.js";

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

// Long string with multiple sensitive tokens
console.log(
  maskString(
    "[INFO] 2025-05-04T10:24:00Z user=alice@example.com ip=10.0.0.42 " +
      "ssn=123-45-6789 card=4111 1111 1111 1111 phone=415-867-5309 " +
      "apiKey=sk-proj-abcDEFg....mno12345XYZ jwt=eyJhbGciO....zI1NiJ9.eyJzdWIiOiIx....NTY3ODkwIn0.SflKxwRJSMeKKF2Q....MeJf36POk6yJV_adQssw5c " +
      "status=200 latency=42ms",
  ),
);
// [INFO] 2025*****4T10:24:00Z us********@example.com ip=10.0.*.** ssn=***-**-6789
// card=**** **** **** 1111 phone=***-***-5309 apiKey=sk-p***********************5XYZ
// jwt=eyJhbGciO....zI1NiJ9.eyJz****OiIx....NTY3ODkwIn0.SflK********KF2Q....MeJf**************sw5c status=200 latency=42ms

// Long string with custom masking character
console.log(
  maskString(
    "Auth: email=bob@corp.io ssn=987-65-4320 ip=172.16.0.1 token=ghp_xABCd...IjklMNO123 " +
      "path=/api/v2/users session=active duration=150ms",
    { char: "•" },
  ),
);
// Auth: em•••••••@corp.io ssn=•••-••-4320 ip=172.16.•.•
// token=ghp_xABCd...IjklMNO123 path=/api/v2/users session=active duration=150ms
