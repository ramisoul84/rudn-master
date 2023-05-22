/*
    Auxiliaries Functions
*/

// PKCS#7 method to append bytes to the end of the plaintext message
function pkcs7(encodedPlainTextHex, blockSize) {
  // Calculate how many bytes should be added
  const paddingLength =
    blockSize - ((0.5 * encodedPlainTextHex.length) % blockSize);
  const appendedPlaintextHex = Array(
    0.5 * encodedPlainTextHex.length + paddingLength
  );
  const appendedPlaintextBin = Array(
    0.5 * encodedPlainTextHex.length + paddingLength
  );
  const appendedPlaintextDec = Array(
    0.5 * encodedPlainTextHex.length + paddingLength
  );
  // Determine the Value which be added in extra bytes
  const paddingValue = paddingLength.toString(16).padStart(2, "0");
  for (let i = 0; i < 0.5 * encodedPlainTextHex.length; i++) {
    appendedPlaintextHex[i] = encodedPlainTextHex.substring(i * 2, i * 2 + 2);
  }
  for (
    let i = 0.5 * encodedPlainTextHex.length;
    i < 0.5 * encodedPlainTextHex.length + paddingLength;
    i++
  ) {
    appendedPlaintextHex[i] = paddingValue;
  }
  appendedPlaintextHex.map((e, i) => {
    return (appendedPlaintextBin[i] = parseInt(e, 16)
      .toString(2)
      .padStart(8, "0"));
  });
  appendedPlaintextHex.map((e, i) => {
    return (appendedPlaintextDec[i] = parseInt(e, 16));
  });
  return { appendedPlaintextHex, appendedPlaintextBin, appendedPlaintextDec };
  // pkcs7("48656c6c6f",16).appendedPlaintextHex -> ['48', '65', '6c', '6c','6f', '0b', '0b', '0b',........]
  // pkcs7("48656c6c6f",16).appendedPlaintextBin -> ['10101100', '11001010', '00001110', ...............]
  // pkcs7("48656c6c6f",16).appendedPlaintextDec -> [72, 101, 108, 108, 111, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11];
}

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
  // charToUtf8("a").charBin ->  01100001
  // charToUtf8("a").charHex ->  61
};

// Encode a Text Using UTF-8
const textToUtf8 = (text) => {
  let encodedTextHex = "";
  let encodedTextBin = "";
  for (let i = 0; i < text.length; i++) {
    encodedTextHex += charToUtf8(text[i]).charHex;
  }
  for (let i = 0; i < text.length; i++) {
    encodedTextBin += charToUtf8(text[i]).charBin;
  }
  return { encodedTextHex, encodedTextBin };
  // textToUtf8("Hello").encodedTextHex ---> "48656c6c6f"
  // textToUtf8("Hello").encodedTextBin ---> "0100100001100101011011000110110001101111"
};

// Decode a Text Using UTF-8
const utf8ToText = (bin) => {
  console.log(bin);
  let temp = Array();
  let dec = Array();
  let text = "";
  for (let i = 0; i < bin.length; ) {
    if (bin[i] === "0") {
      temp.push(bin.substring(i, i + 8));
      i = i + 8;
    } else if (bin[i] === "1" && bin[i + 1] === "1" && bin[i + 2] === "0") {
      temp.push(bin.substring(i, i + 16));
      i = i + 16;
    } else if (
      bin[i] === "1" &&
      bin[i + 1] === "1" &&
      bin[i + 2] === "1" &&
      bin[i + 3] === "0"
    ) {
      temp.push(bin.substring(i, i + 24));
      i = i + 16;
    } else {
      console.log("UnValid Format");
      return;
    }
  }
  temp.map((e) => {
    return dec.push(
      e.length === 8
        ? parseInt(e, 2)
        : parseInt(e.substring(3, 8) + e.substring(10, 16), 2)
    );
  });
  for (let i = 0; i < dec.length; i++) {
    text += String.fromCharCode(dec[i]);
  }
  console.log(text);
  return text;
  // utf8ToText("0100100001100101011011000110110001101111") => Hello
};

// Base64 lookup table
const Base64LookupTable =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

// Encode a hex to Base64
const hexToBase64 = (hex) => {
  if (hex.length % 2 !== 0) {
    console.log("xxx");
    hex += "0";
  }
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
  // Add padding if necessary
  const padding =
    4 - (groups.length % 4) === 1
      ? "="
      : 4 - (groups.length % 4) === 2
      ? "=="
      : "";
  return base64 + padding;
};

// Encode a array ode decimals to Base64
const decToBase64 = (dec) => {
  let hex = dec.map((e) => {
    return e.toString(16).padStart(2, "0");
  });
  let bin = "";
  // Convert input string to binary data using UTF8
  for (let i = 0; i < hex.length; i++) {
    bin += parseInt(hex[i], 16).toString(2).padStart(8, "0");
  } // Split binary data into groups of 6 bits
  const groups = bin.match(/.{1,6}/g);
  // Map each group to its Base64 character, if bin.length <6   add zeroes to right
  const base64 = groups
    .map((group) => {
      const decimal = parseInt(group.padEnd(6, "0"), 2);
      return Base64LookupTable[decimal];
    })
    .join("");
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

// check input data validation in AES
const validation = (plainText, key, version) => {
  const validPlainText = !plainText ? "Welcome to RUDN!" : plainText;
  let keyLength = version === "128" ? 16 : version === "192" ? 24 : 32;
  const newKey = !key
    ? version === "128"
      ? "moscow2023#rudn*"
      : version === "192"
      ? "moscow2023#rudn_ramisoul"
      : "moscow2023#rudn_ramisoul?latakia"
    : key;
  const encodePlainTextHex = textToUtf8(validPlainText).encodedTextHex;
  const encodedKeyHex = textToUtf8(newKey).encodedTextHex;
  const paddedPlainTextHex = pkcs7(encodePlainTextHex, 16).appendedPlaintextHex;
  const paddedPlainTextBin = pkcs7(encodePlainTextHex, 16).appendedPlaintextBin;
  const paddedKeyHex = Array(keyLength);
  for (let i = 0; i < keyLength; i++) {
    paddedKeyHex[i] = encodedKeyHex.substring(i * 2, i * 2 + 2)
      ? encodedKeyHex.substring(i * 2, i * 2 + 2)
      : "23";
  }
  // 23 =>hex for #
  const paddedKeyBin = paddedKeyHex.map((e) => {
    return parseInt(e, 16).toString(2).padStart(8, "0");
  });
  const validKey = utf8ToText(paddedKeyBin.flat().join(""));
  return {
    validPlainText,
    validKey,
    paddedPlainTextBin,
    paddedPlainTextHex,
    paddedKeyBin,
    paddedKeyHex,
  };
};
const binToDec = (bin) => {
  let dec = Array(Math.ceil(bin.length / 8));
  for (let i = 0; i < Math.ceil(bin.length / 8); i++) {
    dec[i] = parseInt(bin.substring(i * 8, i * 8 + 8), 2);
  }
  return dec;
};
const txtToDec = (txt) => {
  let dec = Array(txt.length);
  for (let i = 0; i < txt.length; i++) {
    dec[i] = txt.charCodeAt(i);
  }
  return dec;
};

export {
  pkcs7,
  validation,
  charToUtf8,
  textToUtf8,
  utf8ToText,
  hexToBase64,
  decToBase64,
  txtToDec,
  binToDec,
};
