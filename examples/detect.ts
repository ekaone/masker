import { detect } from "../dist/index.js";

console.log(detect("alice@example.com"));
// { type: "email", confidence: 0.98 }

console.log(detect("4111 1111 1111 1111"));
// { type: "credit_card", confidence: 0.92 }

console.log(detect("123-45-6789"));
// { type: "ssn", confidence: 0.97 }

console.log(detect("(415) 867-5309"));
// { type: "phone", confidence: 0.88 }

console.log(detect("192.168.100.42"));
// { type: "ip_address", confidence: 0.93 }

console.log(detect("eyJhbGci....eyJzdWI....SflKxw..."));
// { type: "api_key", confidence: 0.6 }
