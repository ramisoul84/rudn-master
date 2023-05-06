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

  console.log("Bin=", bin);
  console.log("Bin=", base64Bin.join(""));
  console.log("BinL=", bin.length);
  console.log("B64L=", base64Length);
  console.log("B64=", base64Bin);
  console.log("B64=", base64Hex);
};

const hex = "308705e8245041c62e2504aa28833373d9d5de3416022735fa1e39ad5ac6261b";
hexToBase64(hex);
