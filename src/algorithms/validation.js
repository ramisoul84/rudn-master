import { decode } from "./decode";
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
  const paddedKeyBin = paddedKeyHex.map((e) => {
    return parseInt(e, 16).toString(2).padStart(8, "0");
  });
  const validKey = decode(paddedKeyBin.flat().join(""));
  return {
    validPlainText,
    validKey,
    paddedPlainTextBin,
    paddedPlainTextHex,
    paddedKeyBin,
    paddedKeyHex,
  };
};
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
  for (let i = 0; i < text.length; i++) {
    encodedTextHex += charToUtf8(text[i]).charHex;
  }
  for (let i = 0; i < text.length; i++) {
    encodedTextBin += charToUtf8(text[i]).charBin;
  }
  return { encodedTextHex, encodedTextBin };
};
// textToUtf8("Hello").encodedTextHex ---> "48656c6c6f"
// textToUtf8("Hello").encodedTextBin ---> "0100100001100101011011000110110001101111"

//
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
  return { appendedPlaintextHex, appendedPlaintextBin };
}
// padPKCS7("48656c6c6f").appendedPlaintextHex -> ['48', '65', '6c', '6c','6f', '0b', '0b', '0b',........]
// padPKCS7("48656c6c6f").appendedPlaintextBin -> ['10101100', '11001010', '00001110', ...............]

export { validation };
validation("ффы", "fdfdf", "128");
