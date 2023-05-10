// Table Non-Linear Transformation
const Pi = [
  0xfc, 0xee, 0xdd, 0x11, 0xcf, 0x6e, 0x31, 0x16, 0xfb, 0xc4, 0xfa, 0xda, 0x23,
  0xc5, 0x04, 0x4d, 0xe9, 0x77, 0xf0, 0xdb, 0x93, 0x2e, 0x99, 0xba, 0x17, 0x36,
  0xf1, 0xbb, 0x14, 0xcd, 0x5f, 0xc1, 0xf9, 0x18, 0x65, 0x5a, 0xe2, 0x5c, 0xef,
  0x21, 0x81, 0x1c, 0x3c, 0x42, 0x8b, 0x01, 0x8e, 0x4f, 0x05, 0x84, 0x02, 0xae,
  0xe3, 0x6a, 0x8f, 0xa0, 0x06, 0x0b, 0xed, 0x98, 0x7f, 0xd4, 0xd3, 0x1f, 0xeb,
  0x34, 0x2c, 0x51, 0xea, 0xc8, 0x48, 0xab, 0xf2, 0x2a, 0x68, 0xa2, 0xfd, 0x3a,
  0xce, 0xcc, 0xb5, 0x70, 0x0e, 0x56, 0x08, 0x0c, 0x76, 0x12, 0xbf, 0x72, 0x13,
  0x47, 0x9c, 0xb7, 0x5d, 0x87, 0x15, 0xa1, 0x96, 0x29, 0x10, 0x7b, 0x9a, 0xc7,
  0xf3, 0x91, 0x78, 0x6f, 0x9d, 0x9e, 0xb2, 0xb1, 0x32, 0x75, 0x19, 0x3d, 0xff,
  0x35, 0x8a, 0x7e, 0x6d, 0x54, 0xc6, 0x80, 0xc3, 0xbd, 0x0d, 0x57, 0xdf, 0xf5,
  0x24, 0xa9, 0x3e, 0xa8, 0x43, 0xc9, 0xd7, 0x79, 0xd6, 0xf6, 0x7c, 0x22, 0xb9,
  0x03, 0xe0, 0x0f, 0xec, 0xde, 0x7a, 0x94, 0xb0, 0xbc, 0xdc, 0xe8, 0x28, 0x50,
  0x4e, 0x33, 0x0a, 0x4a, 0xa7, 0x97, 0x60, 0x73, 0x1e, 0x00, 0x62, 0x44, 0x1a,
  0xb8, 0x38, 0x82, 0x64, 0x9f, 0x26, 0x41, 0xad, 0x45, 0x46, 0x92, 0x27, 0x5e,
  0x55, 0x2f, 0x8c, 0xa3, 0xa5, 0x7d, 0x69, 0xd5, 0x95, 0x3b, 0x07, 0x58, 0xb3,
  0x40, 0x86, 0xac, 0x1d, 0xf7, 0x30, 0x37, 0x6b, 0xe4, 0x88, 0xd9, 0xe7, 0x89,
  0xe1, 0x1b, 0x83, 0x49, 0x4c, 0x3f, 0xf8, 0xfe, 0x8d, 0x53, 0xaa, 0x90, 0xca,
  0xd8, 0x85, 0x61, 0x20, 0x71, 0x67, 0xa4, 0x2d, 0x2b, 0x09, 0x5b, 0xcb, 0x9b,
  0x25, 0xd0, 0xbe, 0xe5, 0x6c, 0x52, 0x59, 0xa6, 0x74, 0xd2, 0xe6, 0xf4, 0xb4,
  0xc0, 0xd1, 0x66, 0xaf, 0xc2, 0x39, 0x4b, 0x63, 0xb6,
];
// Convertor from vec to Array
const vecToArr = (vec) => {
  const arr = Array(vec.length / 2);
  for (let i = 0; i < vec.length / 2; i++) {
    arr[i] = parseInt(vec.substring(i * 2, i * 2 + 2), 16);
  }
  // vecToArr("6ea276726c487ab85d27bd10dd849401") =>
  // [110, 162, 118, 114, 108, 72, 122, 184, 93, 39, 189, 16, 221, 132, 148, 1];
  return arr;
};
// Multiplication in GF(2^8) : a,b in decimal => binary|decimal|hexa
const galoisMultiplication = (a, b) => {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) === 1) p ^= a;
    const highBit = a & 0x80;
    a <<= 1;
    if (highBit === 0x80) a ^= 0xc3; // polynomial  x^8+x^7+x^6+x+1
    b >>= 1;
  }
  const bin = p.toString(2).padStart(8, "0").slice(-8);
  const dec = parseInt(bin, 2);
  const hex = dec.toString(16).padStart(2, "0");
  return { dec, bin, hex };
  // galoisMultiplication(148, 148) => 164 | 10100100 | a4
};
// Coefficients for Linear transformation
const Coefficients = [
  148, 32, 133, 16, 194, 192, 1, 251, 1, 192, 194, 16, 133, 32, 148, 1,
];
// Linear Transformation L
const linearTransformation = (block) => {
  let aZero;
  // result block in decimal
  let dec = Array(16).fill(null);
  // result block in hex
  let hex = Array(16).fill(null);
  // intermediate states
  //let temp = Array(16);
  let calc = Array(16);
  for (let j = 0; j < 16; j++) {
    calc[j] = Array(48);
    aZero = 0;
    for (let i = 0; i < 16; i++) {
      aZero ^= galoisMultiplication(block[i], Coefficients[i]).dec;
      calc[j][2 * i] = block[i];
      calc[j][2 * i + 1] = Coefficients[i];
    }
    for (let i = 15; i >= 1; i--) {
      dec[i] = block[i - 1];
    }

    dec[0] = aZero;
    block = dec;
    for (let i = 32; i < 48; i++) {
      calc[j][i] = block[i - 32];
    }
  }
  dec.map((e, i) => {
    return (hex[i] = e.toString(16).padStart(2, "0"));
  });
  return { dec, hex, calc };
  // linearTransformation([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) =>
  // [110, 162, 118, 114, 108, 72, 122, 184, 93, 39, 189, 16, 221, 132, 148, 1];
  // ['6e', 'a2', '76', '72','6c', '48', '7a', 'b8','5d', '27', 'bd', '10','dd', '84', '94', '01']
};
// Non-Linear Transformation S
const subBytes = (block) => {
  const dec = Array(16);
  for (let i = 0; i < 16; i++) {
    dec[i] = Pi[block[i]];
  }
  const hex = Array(16);
  dec.map((e, i) => {
    return (hex[i] = e.toString(16).padStart(2, "0"));
  });
  return { dec, hex };
  /*
  subBytes([32, 168, 237, 156, 69, 193, 106, 241, 97, 155, 20, 30, 88, 216, 167, 94,]);
  => [249, 26, 229, 78, 200, 88, 120, 166, 161, 80, 147, 95, 191, 141, 68, 93]
  => ['f9', '1a', 'e5', '4e','c8', '58', '78', 'a6','a1', '50', '93', '5f','bf', '8d', '44', '5d']
    */
};
// Xoring two blocks, each byte with the corresponding byte : b1,b2 array of dec
const XOR = (b1, b2) => {
  const dec = Array(16);
  for (let i = 0; i < 16; i++) {
    dec[i] = b1[i] ^ b2[i];
  }
  const hex = Array(16);
  dec.map((e, i) => {
    return (hex[i] = e.toString(16).padStart(2, "0"));
  });
  return { dec, hex };
  /*
  XOR(
    [32, 168, 237, 156, 69, 193, 106, 241, 97, 155, 20, 30, 88, 216, 167, 94],
    [1, 148, 132, 221, 16, 189, 39, 93, 184, 122, 72, 108, 114, 118, 162, 110]
  )
  =>  [33, 60, 105, 65, 85, 124, 77, 172, 217, 225, 92, 114, 42, 174, 5, 48];
  => ['21', '3c', '69', '41','55', '7c', '4d', 'ac','d9', 'e1', '5c', '72','2a', 'ae', '05', '30'
  ]
   */
};
// Create 32 Constants that used in KeyExpansion
const createConstants = () => {
  const iterNum = Array(32);
  const constantsDec = Array(32);
  const constantsHex = Array(32);
  for (let i = 0; i < 32; i++) {
    iterNum[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, i + 1];
    constantsDec[i] = linearTransformation(iterNum[i]).dec;
  }
  constantsDec.map((e, i) => {
    constantsHex[i] = Array(16);
    return e.map((e1, j) => {
      return (constantsHex[i][j] = constantsDec[i][j]
        .toString(16)
        .padStart(2, "0"));
    });
  });
  return { constantsDec, constantsHex };
};
//
const feistelNetwork = (key, constant) => {
  let L = key.slice(0, 16);
  let R = key.slice(16, 32);
  /*
  console.log(
    "key1=",
    L.map((e) => {
      return e.toString(16);
    })
  );
  console.log(
    "key2=",
    R.map((e) => {
      return e.toString(16);
    })
  );*/
  let temp = Array(16);
  let tempKey = Array(32);
  temp = XOR(L, constant);
  //console.log("X=", temp.hex);
  temp = subBytes(temp.dec);
  //console.log("S=", temp.hex);
  temp = linearTransformation(temp.dec);
  //console.log("L=", temp.hex);
  temp = XOR(R, temp.dec);
  tempKey = temp.dec.concat(L);
  return tempKey;
};
//
const keyExpansion = (key) => {
  console.log(key);
  key = vecToArr(key);
  console.log(key);
  const constants = createConstants().constantsDec;
  const roundKeys = Array(10);
  roundKeys[0] = key.slice(0, 16);
  roundKeys[1] = key.slice(16, 32);
  let tempKey = key.slice();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      tempKey = feistelNetwork(tempKey, constants[i * 8 + j]);
    }
    roundKeys[i * 2 + 2] = tempKey.slice(0, 16);
    roundKeys[i * 2 + 3] = tempKey.slice(16, 32);
  }
  /*
  for (let i = 0; i < 10; i++) {
    console.log(
      `Key${i + 1}`,
      roundKeys[i].map((e) => {
        return e.toString(16);
      })
    );
  }*/
  console.log(roundKeys);
  return roundKeys;
};
//
const encryptBlock = (block, key) => {
  const roundKey = keyExpansion(key);
  const state = Array(10);
  let cipher = block.slice();
  for (let i = 0; i < 10; i++) {
    state[i] = cipher.slice();
    if (i === 9) {
      cipher = XOR(cipher, roundKey[i]).dec;
    } else {
      cipher = XOR(cipher, roundKey[i]);
      cipher = subBytes(cipher.dec);
      cipher = linearTransformation(cipher.dec).dec;
    }
  }
  return { cipher, state };
};
const encrypt = (plainText, key, mode) => {
  const roundKey = keyExpansion(key);
  const numberOfBlocks = 1;
};

export {
  createConstants,
  Coefficients,
  linearTransformation,
  galoisMultiplication,
  keyExpansion,
  encryptBlock,
};
//createConstants();
//subBytes(vecToArr("0c3322fed531e4630d80ef5c5a81c50b"));
let key1 = "8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef";
let k1 = "c3d5fa01ebe36f7a9374427ad7ca89498899aabbccddeeff0011223344556677";
const key = vecToArr(key1);
const plainText = vecToArr("1122334455667700ffeeddccbbaa9988");
//vecToArr("6ea276726c487ab85d27bd10dd849401");
//constants = createConstants().constantsDec;
//feistelNetwork(vecToArr(k1), constants[1]);
//subBytes(vecToArr("e63bdcc9a09594475d369f2399d1f276"));
//keyExpansion(vecToArr(key));
//encrypt(plainText, key);
//linearTransformation([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
keyExpansion(
  "8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef"
);
