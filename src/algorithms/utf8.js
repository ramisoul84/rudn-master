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
  console.log(encodedTextHex);
  console.log(encodedTextBin);
  return { encodedTextHex, encodedTextBin };
};
// textToUtf8("Hello").encodedTextHex ---> "48656c6c6f"
// textToUtf8("Hello").encodedTextBin ---> "0100100001100101011011000110110001101111"
export { textToUtf8 };
