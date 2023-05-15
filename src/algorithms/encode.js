// Encode One char Using UTF-8
const charToUtf8 = (char) => {
  const charDec = char.charCodeAt(0);
  let charBin = charDec.toString(2);
  if (charDec >= 0 && charDec < 127) {
    charBin = charBin.padStart(8, "0");
  }
  if (charDec >= 128 && charDec < 2047) {
    let byte1 = "110";
    let byte2 = "10";

    charBin = charBin.padStart(11, "0");
    byte1 = byte1 + charBin.substring(0, 5);
    byte2 = byte2 + charBin.substring(5, 11);
    charBin = byte1 + byte2;
  }
  if (charDec >= 2048 && charDec < 65535) {
    let byte1 = "1110";
    let byte2 = "10";
    let byte3 = "10";
    charBin = charBin.padStart(16, "0");
    byte1 = byte1 + charBin.substring(0, 4);
    byte2 = byte2 + charBin.substring(4, 10);
    byte3 = byte3 + charBin.substring(10, 16);
    charBin = byte1 + byte2 + byte3;
  }
  if (charDec >= 65536 && charDec < 1114111) {
    let byte1 = "11110";
    let byte2 = "10";
    let byte3 = "10";
    let byte4 = "10";
    charBin = charBin.padStart(21, "0");
    byte1 = byte1 + charBin.substring(0, 3);
    byte2 = byte2 + charBin.substring(3, 9);
    byte3 = byte3 + charBin.substring(9, 15);
    byte4 = byte4 + charBin.substring(15, 21);
    charBin = byte1 + byte2 + byte3 + byte4;
  }
  const charHex = parseInt(charBin, 2).toString(16);
  return { charBin, charHex };
};
// Encode a Text Using UTF-8
const textToUtf8 = (text) => {
  let encodedTextHex = "";
  let encodedTextBin = "";
  let encodedTextDec = Array();
  for (let i = 0; i < text.length; i++) {
    encodedTextHex += charToUtf8(text[i]).charHex;
  }
  for (let i = 0; i < text.length; i++) {
    encodedTextBin += charToUtf8(text[i]).charBin;
  }
  for (let i = 0; i < encodedTextHex.length / 2; i++) {
    encodedTextDec.push(
      parseInt(encodedTextHex.substring(i * 2, i * 2 + 2), 16)
    );
  }
  return { encodedTextHex, encodedTextBin, encodedTextDec };
};
// textToUtf8("Hello").encodedTextHex ---> "48656c6c6f"
// textToUtf8("Hello").encodedTextBin ---> "0100100001100101011011000110110001101111"
// textToUtf8("Hello").encodedTextDec ---> [ 72, 101, 108, 108, 111 ]

// Base64 encoding function
function base64Encode1(input) {
  // Convert input string to binary data using UTF8
  let binary = textToUtf8(input).encodedTextBin;
  // Split binary data into groups of 6 bits
  const groups = binary.match(/.{1,6}/g);
  // Map each group to its Base64 character, if bin.length <6   add zeroes to right
  const encoded = groups
    .map((group) => {
      const decimal = parseInt(group.padEnd(6, "0"), 2);
      return Base64LookupTable[decimal];
    })
    .join("");
  // Add padding if necessary
  const padding =
    input.length % 3 === 1 ? "==" : input.length % 3 === 2 ? "=" : "";
  return encoded + padding;
}
// Base64 lookup table
const Base64LookupTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

// Example usage
const input = "приветz";
const input1 = [22, 65, 96, 45, 111, 25, 36];
//const encoded = base64Encode(input1, true);
//const decoded = base64Decode(encoded);

const decToBase64 = (dec) => {
  console.log(dec);
  console.log(dec.length);
  let hex = dec.map((e) => {
    return e.toString(16).padStart(2, "0");
  });
  console.log(hex);
  let bin = "";
  // Convert input string to binary data using UTF8
  for (let i = 0; i < hex.length; i++) {
    bin += parseInt(hex[i], 16).toString(2).padStart(8, "0");
  }
  console.log(bin);
  // Split binary data into groups of 6 bits
  const groups = bin.match(/.{1,6}/g);
  // Map each group to its Base64 character, if bin.length <6   add zeroes to right
  const base64 = groups
    .map((group) => {
      const decimal = parseInt(group.padEnd(6, "0"), 2);
      return Base64LookupTable[decimal];
    })
    .join("");

  console.log(base64);
  // Add padding if necessary
  const padding =
    Math.floor(bin.length / 8) % 3 === 1
      ? "=="
      : Math.floor(bin.length / 8) % 3 === 2
      ? "="
      : "";
  console.log(base64 + padding);
  return base64 + padding;
};

const hexToBase64 = (hex) => {
  console.log(hex);
  console.log(hex.length);
  let bin = "";
  for (let i = 0; i < hex.length / 2; i++) {
    bin += parseInt(hex.substring(i * 2, i * 2 + 2), 16)
      .toString(2)
      .padStart(8, "0");
  }
  console.log(bin);
  // Split binary data into groups of 6 bits
  const groups = bin.match(/.{1,6}/g);
  // Map each group to its Base64 character, if bin.length <6   add zeroes to right
  const base64 = groups
    .map((group) => {
      const decimal = parseInt(group.padEnd(6, "0"), 2);
      return Base64LookupTable[decimal];
    })
    .join("");

  console.log(base64);
  // Add padding if necessary
  const padding =
    Math.floor(hex.length / 2) % 3 === 1
      ? "=="
      : Math.floor(hex.length / 2) % 3 === 2
      ? "="
      : "";
  console.log(base64 + padding);
  return base64 + padding;
};

export { textToUtf8, charToUtf8, decToBase64, hexToBase64 };
//hexToBase64("");
