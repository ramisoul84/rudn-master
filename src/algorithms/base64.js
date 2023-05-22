const hexToBase64 = (hex) => {
  console.log("Hex=", hex);
  console.log("Length=", hex.length);
  let bin = "";
  for (let i = 0; i < hex.length / 2; i++) {
    bin += parseInt(hex.substring(i * 2, i * 2 + 2), 16)
      .toString(2)
      .padStart(8, "0");
  }
  const base64Length = Math.ceil(bin.length / 6);
  const base64Bin = Array(base64Length);
  for (let i = 0; i < base64Length; i++) {
    base64Bin[i] = bin.substring(i * 6, i * 6 + 6);
  }
  const base64Hex = Array(base64Length);
  for (let i = 0; i < base64Length - 1; i++) {
    base64Hex[i] = String.fromCharCode(33);
  }
  /*
  console.log("Bin=", bin);
  console.log("Bin=", base64Bin.join(""));
  console.log("BinL=", bin.length);
  console.log("B64L=", base64Length);
  console.log("B64=", base64Bin);
  console.log("B64=", base64Hex);
  */
};

const hex = "308705e8245041c62e2504aa28833373d9d5de3416022735fa1e39ad5ac6261b";
hexToBase64(hex);

// Base64 encoding function
function base64Encode(input) {
  console.log("Input=", input);
  // Convert input string to binary data

  let binary = "";
  for (let i = 0; i < input.length; i++) {
    binary += input[i].charCodeAt(0).toString(2).padStart(8, "0");
  }
  console.log("Bin=", binary);
  // Split binary data into groups of 6 bits
  const groups = binary.match(/.{1,6}/g);
  console.log("groups=", groups);
  // Map each group to its Base64 character
  const encoded = groups
    .map((group) => {
      const decimal = parseInt(group, 2);
      return Base64LookupTable[decimal];
    })
    .join("");
  console.log("encoded=", encoded);
  // Add padding if necessary
  const padding =
    input.length % 3 === 1 ? "==" : input.length % 3 === 2 ? "=" : "";
  console.log("encoded=", encoded + padding);
  return encoded + padding;
}

// Base64 decoding function
function base64Decode(encoded) {
  // Remove padding characters
  encoded = encoded.replace(/=+$/, "");
  console.log("--------------------------------");
  console.log("encoded=", encoded);
  // Reverse lookup table for decoding
  /*
  const reverseLookupTable = Base64LookupTable.reduce((lookup, char, index) => {
    lookup[char] = index;
    return lookup;
  }, {});
  */
  // Convert encoded string to binary data
  let binary = "";
  for (let i = 0; i < encoded.length; i++) {
    binary += Base64LookupTable.indexOf([encoded[i]])
      .toString(2)
      .padStart(6, "0");
  }
  console.log("encoded=", binary);
  // Split binary data into groups of 8 bits
  const groups = binary.match(/.{1,8}/g);

  console.log("encoded=", groups);
  // Convert each group to its decimal value and get the corresponding ASCII character
  const decoded = groups
    .map((group) => String.fromCharCode(parseInt(group.padEnd(8, "0"), 2)))
    .join("");
  console.log("encoded=", decoded);
  return decoded;
}

// Base64 lookup table
const Base64LookupTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

// Example usage
//const input = "привет";
//const encoded = base64Encode(input);
//const decoded = base64Decode(encoded);

//console.log("Encoded:", encoded);
//console.log("Decoded:", decoded);

const textToBase64 = (text) => {};

const hexToBase64_1 = (hex) => {};

const binToBase64 = (hex) => {};
