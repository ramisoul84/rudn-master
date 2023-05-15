/*
PKCS#7
method appends bytes to the end of the plaintext message
to ensure that its length is a multiple of the  (block size)
in AES : BlockSize = 16
and covert appended plaintext to array of hexadecimal and binary
*/
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
}
// pkcs7("48656c6c6f",16).appendedPlaintextHex -> ['48', '65', '6c', '6c','6f', '0b', '0b', '0b',........]
// pkcs7("48656c6c6f").appendedPlaintextBin -> ['10101100', '11001010', '00001110', ...............]
export { pkcs7 };
//"48656c6c6f48656c6c6f48656c6c6f48656c6c6f48656c6c6f48656c6c6f"

//pkcs7("48", 16);
