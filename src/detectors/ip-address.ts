import type { DetectionRule } from "../types/index.js";

export const ipAddressRule: DetectionRule = {
  type: "ip_address",
  // IPv4 with optional CIDR, or basic IPv6
  pattern:
    /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/,
  confidence: 0.93,
};
