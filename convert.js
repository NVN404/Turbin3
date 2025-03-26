const bs58 = require('bs58').default;  // ✅ Add .default for proper import
const prompt = require('prompt-sync')();

// Convert base58 to 64-byte wallet array
const base58 = prompt("Enter your base58 private key: ");
const walletArray = bs58.decode(base58);
console.log("64-byte array:", Array.from(walletArray));

// Convert 64-byte array back to base58
const base58Converted = bs58.encode(walletArray);
console.log("Base58 again:", base58Converted);
