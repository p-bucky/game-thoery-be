const crypto = require("crypto");

function generateHex() {
  const randomUuid = crypto.randomUUID();
  const hex = randomUuid.substring(0, 8);
  return hex;
}

module.exports = { generateHex };
