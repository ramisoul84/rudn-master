const decode = (bin) => {
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
  return text;
};
export { decode };
//const bin =
// "11011000101001111101100110000100110110001010110111011000101100011101100010101000110110011000001011011000101010010010000011011000";
//decode(bin);
//decode(bin1);
