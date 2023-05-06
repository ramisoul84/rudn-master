import { validation } from "./validation";
// Rijndael (S-box)
const sBox = [
  [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76,
  ],
  [
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf,
    0x9c, 0xa4, 0x72, 0xc0,
  ],
  [
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1,
    0x71, 0xd8, 0x31, 0x15,
  ],
  [
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75,
  ],
  [
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3,
    0x29, 0xe3, 0x2f, 0x84,
  ],
  [
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39,
    0x4a, 0x4c, 0x58, 0xcf,
  ],
  [
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8,
  ],
  [
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21,
    0x10, 0xff, 0xf3, 0xd2,
  ],
  [
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d,
    0x64, 0x5d, 0x19, 0x73,
  ],
  [
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb,
  ],
  [
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62,
    0x91, 0x95, 0xe4, 0x79,
  ],
  [
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea,
    0x65, 0x7a, 0xae, 0x08,
  ],
  [
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a,
  ],
  [
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9,
    0x86, 0xc1, 0x1d, 0x9e,
  ],
  [
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9,
    0xce, 0x55, 0x28, 0xdf,
  ],
  [
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16,
  ],
];
const invSBox = [
  [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
    0x81, 0xf3, 0xd7, 0xfb,
  ],
  [
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44,
    0xc4, 0xde, 0xe9, 0xcb,
  ],
  [
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b,
    0x42, 0xfa, 0xc3, 0x4e,
  ],
  [
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
    0x6d, 0x8b, 0xd1, 0x25,
  ],
  [
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc,
    0x5d, 0x65, 0xb6, 0x92,
  ],
  [
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57,
    0xa7, 0x8d, 0x9d, 0x84,
  ],
  [
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
    0xb8, 0xb3, 0x45, 0x06,
  ],
  [
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03,
    0x01, 0x13, 0x8a, 0x6b,
  ],
  [
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce,
    0xf0, 0xb4, 0xe6, 0x73,
  ],
  [
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
    0x1c, 0x75, 0xdf, 0x6e,
  ],
  [
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e,
    0xaa, 0x18, 0xbe, 0x1b,
  ],
  [
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe,
    0x78, 0xcd, 0x5a, 0xf4,
  ],
  [
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
    0x27, 0x80, 0xec, 0x5f,
  ],
  [
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f,
    0x93, 0xc9, 0x9c, 0xef,
  ],
  [
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c,
    0x83, 0x53, 0x99, 0x61,
  ],
  [
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
    0x55, 0x21, 0x0c, 0x7d,
  ],
];
// The round constant table
const rCon = [
  [0x01, 0x00, 0x00, 0x00],
  [0x02, 0x00, 0x00, 0x00],
  [0x04, 0x00, 0x00, 0x00],
  [0x08, 0x00, 0x00, 0x00],
  [0x10, 0x00, 0x00, 0x00],
  [0x20, 0x00, 0x00, 0x00],
  [0x40, 0x00, 0x00, 0x00],
  [0x80, 0x00, 0x00, 0x00],
  [0x1b, 0x00, 0x00, 0x00],
  [0x36, 0x00, 0x00, 0x00],
];
// mixColumn Matrix
const mixMatHex = [
  [0x02, 0x03, 0x01, 0x01],
  [0x01, 0x02, 0x03, 0x01],
  [0x01, 0x01, 0x02, 0x03],
  [0x03, 0x01, 0x01, 0x02],
];
const invMixMatHex = [
  [0x0e, 0x0b, 0x0d, 0x09],
  [0x09, 0x0e, 0x0b, 0x0d],
  [0x0d, 0x09, 0x0e, 0x0b],
  [0x0b, 0x0d, 0x09, 0x0e],
];
// Main Method to AES encrypt a text of any size plainText(str),Key(str)
const aesEncrypt = (plainText, key, aesVersion) => {
  const validPlainText = validation(plainText, key, aesVersion).validPlainText;
  const validKey = validation(plainText, key, aesVersion).validKey;
  const paddedPlainTextBin = validation(
    plainText,
    key,
    aesVersion
  ).paddedPlainTextBin;
  const paddedPlainTextHex = validation(
    plainText,
    key,
    aesVersion
  ).paddedPlainTextHex;
  const paddedKeyHex = validation(plainText, key, aesVersion).paddedKeyHex;
  const paddedKeyBin = validation(plainText, key, aesVersion).paddedKeyBin;
  const numberOfBlocks = paddedPlainTextBin.length / 16;
  const cipherTextBinBlocks = [];
  for (let i = 0; i < numberOfBlocks; i++) {
    cipherTextBinBlocks.push(
      aesEncryptBlock(
        paddedPlainTextBin.slice(i * 16, i * 16 + 16),
        paddedKeyBin
      ).cipherBin
    );
  }
  const cipherTextHexBlocks = cipherTextBinBlocks.map((e) => {
    return e.map((ee) => {
      return parseInt(ee, 2).toString(16).padStart(2, "0");
    });
  });
  const keyWordsHex = keyExpansion(paddedKeyBin).keyWordsHex;
  const roundKeys = keyExpansion(paddedKeyBin).roundKeys;
  const keyWordsTableHex = keyExpansion(paddedKeyBin).keyWordsTableHex;
  const keyWordsTable = keyExpansion(paddedKeyBin).keyWordsTable;
  console.log("cipherTextBinBlocks", keyWordsTableHex);
  const states0 = aesEncryptBlock(
    paddedPlainTextBin.slice(0, 16),
    paddedKeyBin
  ).states;
  const states0Hex = aesEncryptBlock(
    paddedPlainTextBin.slice(0, 16),
    paddedKeyBin
  ).statesHex;
  return {
    validPlainText,
    validKey,
    numberOfBlocks,
    paddedPlainTextHex,
    paddedKeyHex,
    cipherTextHexBlocks,
    keyWordsHex,
    keyWordsTableHex,
    keyWordsTable,
    roundKeys,
    states0,
    states0Hex,
  };
};
// a method to encrypt one block , argument Array of bytes in binary format
const aesEncryptBlock = (plaintextBlockBin, paddedKeyBin) => {
  const Nr = paddedKeyBin.length / 4 + 6; // Number of Rounds
  const roundKeysBin = keyExpansion(paddedKeyBin).roundKeysBin;
  const states = [];
  states[0] = [];
  states[0].push(vectorToState(plaintextBlockBin));
  states[0].push(null);
  states[0].push(null);
  states[0].push(null);
  states[0].push(vectorToState(roundKeysBin[0]));
  states[0].push(xorStates(states[0][0], states[0][4]));
  for (let i = 1; i < Nr; i++) {
    states[i] = [];
    states[i].push(states[i - 1][5]);
    states[i].push(subBytes(states[i - 1][5]));
    states[i].push(shiftRows(subBytes(states[i - 1][5])));
    states[i].push(mixColumns(shiftRows(subBytes(states[i - 1][5]))));
    states[i].push(vectorToState(roundKeysBin[i]));
    states[i].push(xorStates(states[i][3], states[i][4]));
  }
  states[Nr] = [];
  states[Nr].push(states[Nr - 1][5]);
  states[Nr].push(subBytes(states[Nr - 1][5]));
  states[Nr].push(shiftRows(subBytes(states[Nr - 1][5])));
  states[Nr].push(null);
  states[Nr].push(vectorToState(roundKeysBin[Nr]));
  states[Nr].push(
    xorStates(
      shiftRows(subBytes(states[Nr - 1][5])),
      vectorToState(roundKeysBin[Nr])
    )
  );
  const statesHex = states.map((e) => {
    return e.map((ee) => {
      return ee
        ? ee.map((eee) => {
            return eee
              ? eee.map((eeee) => {
                  return parseInt(eeee, 2)
                    .toString(16)
                    .padStart(2, "0")
                    .toUpperCase();
                })
              : null;
          })
        : null;
    });
  });
  const cipherBin = stateToVector(states[Nr][5]);
  return { cipherBin, states, statesHex };
};
// Key Expansion methods to create key rounds
const keyExpansion = (paddedKeyBin) => {
  const N = paddedKeyBin.length / 4; // Number of words (32-bit) in original key
  console.log("N=", N);
  const K = Array(N); // Words of the original key in  binary
  for (let i = 0; i < N; i++) {
    K[i] = paddedKeyBin.slice(i * 4, i * 4 + 4);
  }
  // the number of expanded word
  const numWords = 4 * (paddedKeyBin.length / 4 + 6 + 1);
  // key Words in Binary format
  const keyWordsBin = Array(numWords);
  for (let i = 0; i < numWords; i++) {
    if (i < N) {
      keyWordsBin[i] = K[i];
    } else if (i >= N && i % N === 0) {
      keyWordsBin[i] = xorWord(
        keyWordsBin[i - N],
        xorWord(
          subWord(rotWord(keyWordsBin[i - 1])),
          rCon[i / N - 1].map((e) => {
            return e.toString(2).padStart(8, "0");
          })
        )
      );
    } else if (N > 6 && i >= N && i % N === 4) {
      keyWordsBin[i] = xorWord(keyWordsBin[i - N], subWord(keyWordsBin[i - 1]));
    } else {
      keyWordsBin[i] = xorWord(keyWordsBin[i - N], keyWordsBin[i - 1]);
    }
  }

  // key Words in Hexadecimal format
  const keyWordsHex = Array(numWords);
  keyWordsBin.map((e, i) => {
    keyWordsHex[i] = Array(4);
    return e.map((ee, j) => {
      keyWordsHex[i][j] = parseInt(ee, 2)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();
    });
  });
  const roundKeysBin = Array(paddedKeyBin.length / 4 + 7);
  for (let i = 0; i <= paddedKeyBin.length / 4 + 6; i++) {
    roundKeysBin[i] = keyWordsBin.slice(i * 4, i * 4 + 4).flat();
  }
  const roundKeys = Array(paddedKeyBin.length / 4 + 7);
  for (let i = 0; i <= paddedKeyBin.length / 4 + 6; i++) {
    roundKeys[i] = keyWordsHex.slice(i * 4, i * 4 + 4).flat();
  }
  // Create a table that print all opertations step by step
  const keyWordsTable = [];
  for (let i = 0; i < N; i++) {
    keyWordsTable[i] = [];
    for (let j = 0; j < 7; j++) {
      if (j !== 6) {
        keyWordsTable[i].push(null);
      } else {
        keyWordsTable[i].push(keyWordsBin[i]);
      }
    }
  }
  for (let i = N; i < numWords; i++) {
    keyWordsTable[i] = [];
    keyWordsTable[i].push(keyWordsBin[i - 1]);
    keyWordsTable[i].push(i % N === 0 ? rotWord(keyWordsBin[i - 1]) : null);
    keyWordsTable[i].push(
      i % N === 0
        ? subWord(rotWord(keyWordsBin[i - 1]))
        : N > 6 && i % N === 4
        ? subWord(keyWordsBin[i - 1])
        : null
    );
    keyWordsTable[i].push(
      i % N === 0
        ? rCon[i / N - 1].map((e) => {
            return e.toString(2).padStart(8, "0");
          })
        : null
    );
    keyWordsTable[i].push(
      i % N === 0
        ? xorWord(
            subWord(rotWord(keyWordsBin[i - 1])),
            rCon[i / N - 1].map((e) => {
              return e.toString(2).padStart(8, "0");
            })
          )
        : null
    );
    keyWordsTable[i].push(keyWordsBin[i - N]);
    keyWordsTable[i].push(keyWordsBin[i]);
  }
  const keyWordsTableHex = keyWordsTable.map((e) => {
    return e.map((ee) => {
      return (
        ee &&
        ee.map((eee) => {
          return eee
            ? parseInt(eee, 2).toString(16).padStart(2, "0").toUpperCase()
            : null;
        })
      );
    });
  });

  return {
    roundKeysBin,
    keyWordsHex,
    keyWordsTableHex,
    keyWordsTable,
    roundKeys,
  };
};
/*------------------------------------------------------------
------------------- auxiliaries functions --------------------
------------------------------------------------------------*/
// XORing two Binary numbers bin1,bin2 : (same length)
const xor = (bin1, bin2) => {
  let res = "";
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] === bin2[i]) {
      res += "0";
    } else {
      res += "1";
    }
  }
  return res;
};
// XORing two words (4 bytes )
const xorWord = (word1, word2) => {
  let newWord = [];
  for (let i = 0; i < 4; i++) {
    newWord[i] = xor(word1[i], word2[i]);
  }
  return newWord;
};
// XORing bytes (cells) of two (4x4) States
const xorStates = (stateA, stateB) => {
  let newState = [];
  for (let i = 0; i < 4; i++) {
    newState[i] = [];
    for (let j = 0; j < 4; j++) {
      newState[i][j] = xor(stateA[i][j], stateB[i][j]);
    }
  }
  return newState;
};
// Substitution a byte (S-Box):
const subByte = (byte) => {
  const l = parseInt(byte.substring(0, 4), 2);
  const r = parseInt(byte.substring(4, 8), 2);
  return sBox[l][r].toString(2).padStart(8, "0");
};
// Substitution each byte in word (S-Box):
const subWord = (word) => {
  let newWord = [];
  for (let i = 0; i < 4; i++) {
    newWord[i] = subByte(word[i]);
  }
  return newWord;
};
//substitute each  (byte) of  state matrix by corresponding byte in AES S-Box
const subBytes = (state) => {
  let newState = [];
  for (let i = 0; i < 4; i++) {
    newState[i] = [];
    for (let j = 0; j < 4; j++) {
      newState[i][j] = subByte(state[i][j]);
    }
  }
  return newState;
};
// a method rotates the bytes in the word to the left by one position.
const rotWord = (word) => {
  let newWord = Array(4);
  for (let i = 1; i < 4; i++) {
    newWord[i - 1] = word[i];
  }
  newWord[3] = word[0];
  return newWord;
};
// ShiftRows in Matrix (second row 1 byte to left, third -> 2 , fourth ->4)
const shiftRows = (state) => {
  let newState = [];
  newState.push(state[0]);
  newState.push(rotWord(state[1]));
  newState.push(rotWord(rotWord(state[2])));
  newState.push(rotWord(rotWord(rotWord(state[3]))));
  return newState;
};
//  Muliplication {a}•{bin} in GF(2^8)
function dot(a1, b1) {
  let a = parseInt(a1, 2);
  let b = parseInt(b1, 2);
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) === 1) p ^= a;
    const highBit = a & 0x80;
    a <<= 1;
    if (highBit === 0x80) a ^= 0x1b;
    b >>= 1;
  }
  return p.toString(2).padStart(8, "0").slice(-8);
}
// MixColumns
const mixColumns = (state) => {
  const mixMat = mixMatHex.map((e) => {
    return e.map((ee) => {
      return parseInt(ee, 16).toString(2).padStart(8, "0");
    });
  });
  const newState = [];
  for (let i = 0; i < 4; i++) {
    newState[i] = [];
    for (let j = 0; j < 4; j++) {
      newState[i][j] = xor(
        xor(dot(mixMat[i][0], state[0][j]), dot(mixMat[i][1], state[1][j])),
        xor(dot(mixMat[i][2], state[2][j]), dot(mixMat[i][3], state[3][j]))
      );
    }
  }
  return newState;
};
// Convert a 128-bits binary vector to Matrix 4*4 (binary)
const vectorToState = (vec) => {
  let state = [];
  for (let i = 0; i < 4; i++) {
    state[i] = [];
    for (let j = 0; j < 4; j++) {
      state[i].push(vec[j * 4 + i]);
    }
  }
  return state;
};
// Convert a vector (1D array) to Matrix 2D array
const stateToVector = (state) => {
  let vec = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      vec.push(state[j][i]);
    }
  }
  return vec;
};
//stateToVector([[1,2,3,4],[5,6,7,8],[..],[..]]) -> [1,2,3,4,5,6,7,8,9...]
export { sBox, invSBox, rCon, mixMatHex, invMixMatHex, dot, aesEncrypt };
