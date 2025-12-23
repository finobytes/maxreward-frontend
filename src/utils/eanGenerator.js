export const generateEAN13 = () => {
  // Use a timestamp component to ensure uniqueness over time
  // Date.now() is 13 digits, allowing us to use a portion of it
  // We'll use a prefix (e.g., "2" for internal use) + timestamp window + random

  const prefix = "2"; // Internal usage prefix (often 20-29 reserved for internal)
  const timestamp = Date.now().toString().slice(-9); // Last 9 digits of timestamp covers ~115 days cycle continuously unique at ms level, but combined with prefix unique enough.
  // actually Date.now() is like 1734963000000. Last 9 digits: 963000000.
  // It changes every ms.

  // To be safer and more random:
  // 12 digits total needed before checksum.
  // Prefix (1) + Random (11)

  let code = prefix;
  for (let i = 0; i < 11; i++) {
    code += Math.floor(Math.random() * 10);
  }

  // Calculate Checksum for EAN-13
  const checksum = calculateEANChecksum(code);
  return code + checksum;
};

const calculateEANChecksum = (code) => {
  // code should be 12 digits string
  if (code.length !== 12) return 0;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i]);
    if (i % 2 === 0) {
      sum += digit * 1; // Odd positions (0-indexed 0, 2, 4...) -> actually even in 1-based logic but index is even here.
      // EAN-13 rule:
      // Weight 1 for positions 1, 3, 5... (0, 2, 4 in 0-indexed string)
      // Weight 3 for positions 2, 4, 6... (1, 3, 5 in 0-indexed string)
    } else {
      sum += digit * 3;
    }
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
};
