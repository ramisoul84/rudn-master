const BLOCK_SIZE = 16; // длина блока

//
// таблица прямого нелинейного преобразования
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
const iter_C = Array([]);
// массив для хранения ключей
const iter_key = Array([]);
// функция X
GOST_Kuz_X = (a, b) => {
  let i;
  const c = Array[BLOCK_SIZE];
  for (i = 0; i < BLOCK_SIZE; i++) c[i] = a[i] ^ b[i];
  return c;
};
// Функция S
GOST_Kuz_S = (in_data) => {
  let i;
  const out_data = Array[in_data.length];
  for (i = 0; i < BLOCK_SIZE; i++) {
    let data = in_data[i];
    if (data < 0) {
      data = data + 256;
    }
    out_data[i] = Pi[data];
  }
  return out_data;
};

GOST_Kuz_L = (in_data) => {
  let i;
  let out_data = Array[in_data.length];
  let internal = in_data;
  for (i = 0; i < 16; i++) {
    internal = GOST_Kuz_R(internal);
  }
  out_data = internal;
  return out_data;
};
// функция расчета констант
GOST_Kuz_Get_C = () => {
  let i;
  const iter_num = Array[32][16];
  for (i = 0; i < 32; i++) {
    for (let j = 0; j < BLOCK_SIZE; j++) iter_num[i][j] = 0;
    iter_num[i][0] = byte(i + 1);
  }
  for (i = 0; i < 32; i++) {
    iter_C[i] = GOST_Kuz_L(iter_num[i]);
  }
};
// функция, выполняющая преобразования ячейки Фейстеля
GOST_Kuz_F = (in_key_1, in_key_2, iter_const) => {
  let internal;
  let out_key_2 = in_key_1;
  internal = GOST_Kuz_X(in_key_1, iter_const);
  internal = GOST_Kuz_S(internal);
  internal = GOST_Kuz_L(internal);
  let out_key_1 = GOST_Kuz_X(internal, in_key_2);
  const key = Array[2]();
  key[0] = out_key_1;
  key[1] = out_key_2;
  return key;
};
// функция расчета раундовых ключей
GOST_Kuz_Expand_Key = (key_1, key_2) => {
  let i;
  const iter12 = Array[2]();
  const iter34 = Array[2]();
  GOST_Kuz_Get_C();
  iter_key[0] = key_1;
  iter_key[1] = key_2;
  iter12[0] = key_1;
  iter12[1] = key_2;
  for (i = 0; i < 4; i++) {
    iter34 = GOST_Kuz_F(iter12[0], iter12[1], iter_C[0 + 8 * i]);
    iter12 = GOST_Kuz_F(iter34[0], iter34[1], iter_C[1 + 8 * i]);
    iter34 = GOST_Kuz_F(iter12[0], iter12[1], iter_C[2 + 8 * i]);
    iter12 = GOST_Kuz_F(iter34[0], iter34[1], iter_C[3 + 8 * i]);
    iter34 = GOST_Kuz_F(iter12[0], iter12[1], iter_C[4 + 8 * i]);
    iter12 = GOST_Kuz_F(iter34[0], iter34[1], iter_C[5 + 8 * i]);
    iter34 = GOST_Kuz_F(iter12[0], iter12[1], iter_C[6 + 8 * i]);
    iter12 = GOST_Kuz_F(iter34[0], iter34[1], iter_C[7 + 8 * i]);

    iter_key[2 * i + 2] = iter12[0];
    iter_key[2 * i + 3] = iter12[1];
  }
};
// функция шифрования блока
GOST_Kuz_Encript = (blk) => {
  let i;
  let out_blk = Array[BLOCK_SIZE];
  out_blk = blk;
  for (i = 0; i < 9; i++) {
    out_blk = GOST_Kuz_X(iter_key[i], out_blk);
    out_blk = GOST_Kuz_S(out_blk);
    out_blk = GOST_Kuz_L(out_blk);
  }
  out_blk = GOST_Kuz_X(out_blk, iter_key[9]);
  return out_blk;
};

const key_1 = [
  0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11, 0x00, 0xff, 0xee, 0xdd, 0xcc, 0xbb,
  0xaa, 0x99, 0x88,
];
const key_2 = [
  0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01, 0x10, 0x32, 0x54, 0x76, 0x98,
  0xba, 0xdc, 0xfe,
];
///
////

const block = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// функция R сдвигает данные и реализует уравнение, представленное для расчета L-функции
const GOST_Kuz_R = (state) => {
  let i;
  let a_15 = 0;
  let internal = Array(16);
  for (i = 15; i >= 0; i--) {
    if (i == 0) internal[15] = state[i];
    else internal[i - 1] = state[i];
    a_15 ^= galoisMultiplication(state[i], l_vec[i]).dec;
  }
  internal[15] = a_15;
  return internal;
};

const blk = "8899aabbccddeeff0077665544332211";

// умножение в поле Галуа Multiplication in GF(2^8) : a,b in decimal => binary|decimal|hexa
/* «Кузнечик» */

const multiCoef = [
  1, 148, 32, 133, 16, 194, 192, 1, 251, 1, 192, 194, 16, 133, 32, 148,
];

// Multiplication in GF(2^8) : a,b in decimal => binary|decimal|hexa
function galoisMultiplication(a, b) {
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
}

// Linear Function : Block is Array(16) elements: dec => Array(16) elements: hex|dec
const linearFunc = (block) => {
  let sum;
  let dec;
  for (let j = 0; j < 16; j++) {
    sum = 0;
    dec = Array(16).fill(null);
    for (let i = 15; i >= 0; i--) {
      if (i == 0) dec[15] = block[i];
      else dec[i - 1] = block[i];
      sum ^= galoisMultiplication(block[i], multiCoef[i]).dec;
    }
    dec[15] = sum;
    block = dec;
  }
  const hex = Array(16);
  dec.map((e, i) => {
    return (hex[i] = e.toString(16).padStart(2, "0"));
  });
  return { dec, hex };
  // linearFunc([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) =>
  // [1, 148, 132, 221, 16, 189, 39, 93, 184, 122, 72, 108, 114, 118, 162, 110]
  // ['01', '94', '84', 'dd','10', 'bd', '27', '5d', 'b8', '7a', '48', '6c',72', '76', 'a2', '6e']
};

// Create 32 Constants  dec|hex
const createConstants = () => {
  const constantsDec = Array(32);
  const constantsHex = Array(32);
  for (let i = 0; i < 32; i++) {
    constantsDec[i] = linearFunc([
      i + 1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]).dec;
  }
  constantsDec.map((e, i) => {
    constantsHex[i] = Array(16);
    return e.map((e1, j) => {
      return (constantsHex[i][j] = constantsDec[i][j].toString(16));
    });
  });

  return { constantsDec, constantsHex };
  //createConstants() =>
  /*
[
  [1, 148, 132, 221, 16, 189, 39, 93, 184, 122, 72, 108, 114, 118, 162, 110],
  [2, 235, 203, 121, 32, 185, 78, 186, 179, 244, 144, 216, 228, 236, 135, 220],
  [....],
  .
  .
  [32, 168, 237, 156, 69, 193, 106, 241, 97, 155, 20, 30, 88, 216, 167, 94],
];
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

// non-linear trasformtion by substitue each byte with another value from a a table ... block array of dec elements
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

// a method to create 10 roundkeys .. key Array of bytes in dec =>
const KeyExpansion = (key) => {
  const constants = createConstants().constantsDec;
  //console.log("Key=", key);
  let L = key.slice(0, 16);
  let R = key.slice(16, 32);
  const roundKeys = Array();
  roundKeys.push(L);
  roundKeys.push(R);
  let tempKey;
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[i]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[1]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[2]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[3]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[4]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[5]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[6]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }
  for (let i = 0; i < 1; i++) {
    //temp = XOR(linearFunc(subBytes(XOR(L, constants[0]).dec).dec), R);
    temp = XOR(linearFunc(subBytes(XOR(L, constants[7]).dec).dec).dec, R);
    L = R;
    R = temp.dec;
    tempKey = L.concat(R);
    console.log(tempKey);
    console.log(
      tempKey.map((e) => {
        return e.toString(16);
      })
    );
    (i + 1) % 8 === 0 ? roundKeys.push(L) : null;
    (i + 1) % 8 === 0 ? roundKeys.push(R) : null;
    console.log("----");
  }

  const roundKeysHex = Array(10);
  roundKeys.map((e, i) => {
    roundKeysHex[i] = Array(16);
    return e.map((e1, j) => {
      return (roundKeysHex[i][j] = e1.toString(16).padStart(2, "0"));
    });
  });
};
//

// Practice
const key = [
  0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11, 0x00, 0xff, 0xee, 0xdd, 0xcc, 0xbb,
  0xaa, 0x99, 0x88, 0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01, 0x10, 0x32,
  0x54, 0x76, 0x98, 0xba, 0xdc, 0xfe,
];
const key1 = [
  239, 205, 171, 137, 103, 69, 35, 1, 16, 50, 84, 118, 152, 186, 220, 254, 73,
  137, 202, 215, 122, 66, 116, 147, 122, 111, 227, 235, 1, 250, 213, 195,
];

const kk = [
  0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x11, 0x22, 0x33, 0x44,
  0x55, 0x66, 0x77, 0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10, 0x01, 0x23,
  0x45, 0x67, 0x89, 0xab, 0xcd, 0xef,
];

xx = [
  0xd4, 0x56, 0x58, 0x4d, 0xd0, 0xe3, 0xe8, 0x4c, 0xc3, 0x16, 0x6e, 0x4b, 0x7f,
  0xa2, 0x89, 0x0d,
];
KeyExpansion(key);
