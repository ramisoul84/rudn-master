import { useState, useEffect } from "react";
import { textToUtf8, decToBase64 } from "../algorithms/encode";
import { pkcs7 } from "../algorithms/pkcs7";
import {
  createConstants,
  Coefficients,
  linearTransformation,
  keyExpansion,
  encryptBlock,
  encrypt,
  toBlocks,
} from "../algorithms/kuzz";
import KuzConst from "../components/KuzConst";
import Ploynomial from "../components/Polynomial";
import Box from "../components/Box";
import "./kuz.css";
const Pi = [
  [
    0xfc, 0xee, 0xdd, 0x11, 0xcf, 0x6e, 0x31, 0x16, 0xfb, 0xc4, 0xfa, 0xda,
    0x23, 0xc5, 0x04, 0x4d,
  ],
  [
    0xe9, 0x77, 0xf0, 0xdb, 0x93, 0x2e, 0x99, 0xba, 0x17, 0x36, 0xf1, 0xbb,
    0x14, 0xcd, 0x5f, 0xc1,
  ],
  [
    0xf9, 0x18, 0x65, 0x5a, 0xe2, 0x5c, 0xef, 0x21, 0x81, 0x1c, 0x3c, 0x42,
    0x8b, 0x01, 0x8e, 0x4f,
  ],
  [
    0x05, 0x84, 0x02, 0xae, 0xe3, 0x6a, 0x8f, 0xa0, 0x06, 0x0b, 0xed, 0x98,
    0x7f, 0xd4, 0xd3, 0x1f,
  ],
  [
    0xeb, 0x34, 0x2c, 0x51, 0xea, 0xc8, 0x48, 0xab, 0xf2, 0x2a, 0x68, 0xa2,
    0xfd, 0x3a, 0xce, 0xcc,
  ],
  [
    0xb5, 0x70, 0x0e, 0x56, 0x08, 0x0c, 0x76, 0x12, 0xbf, 0x72, 0x13, 0x47,
    0x9c, 0xb7, 0x5d, 0x87,
  ],
  [
    0x15, 0xa1, 0x96, 0x29, 0x10, 0x7b, 0x9a, 0xc7, 0xf3, 0x91, 0x78, 0x6f,
    0x9d, 0x9e, 0xb2, 0xb1,
  ],
  [
    0x32, 0x75, 0x19, 0x3d, 0xff, 0x35, 0x8a, 0x7e, 0x6d, 0x54, 0xc6, 0x80,
    0xc3, 0xbd, 0x0d, 0x57,
  ],
  [
    0xdf, 0xf5, 0x24, 0xa9, 0x3e, 0xa8, 0x43, 0xc9, 0xd7, 0x79, 0xd6, 0xf6,
    0x7c, 0x22, 0xb9, 0x03,
  ],
  [
    0xe0, 0x0f, 0xec, 0xde, 0x7a, 0x94, 0xb0, 0xbc, 0xdc, 0xe8, 0x28, 0x50,
    0x4e, 0x33, 0x0a, 0x4a,
  ],
  [
    0xa7, 0x97, 0x60, 0x73, 0x1e, 0x00, 0x62, 0x44, 0x1a, 0xb8, 0x38, 0x82,
    0x64, 0x9f, 0x26, 0x41,
  ],
  [
    0xad, 0x45, 0x46, 0x92, 0x27, 0x5e, 0x55, 0x2f, 0x8c, 0xa3, 0xa5, 0x7d,
    0x69, 0xd5, 0x95, 0x3b,
  ],
  [
    0x07, 0x58, 0xb3, 0x40, 0x86, 0xac, 0x1d, 0xf7, 0x30, 0x37, 0x6b, 0xe4,
    0x88, 0xd9, 0xe7, 0x89,
  ],
  [
    0xe1, 0x1b, 0x83, 0x49, 0x4c, 0x3f, 0xf8, 0xfe, 0x8d, 0x53, 0xaa, 0x90,
    0xca, 0xd8, 0x85, 0x61,
  ],
  [
    0x20, 0x71, 0x67, 0xa4, 0x2d, 0x2b, 0x09, 0x5b, 0xcb, 0x9b, 0x25, 0xd0,
    0xbe, 0xe5, 0x6c, 0x52,
  ],
  [
    0x59, 0xa6, 0x74, 0xd2, 0xe6, 0xf4, 0xb4, 0xc0, 0xd1, 0x66, 0xaf, 0xc2,
    0x39, 0x4b, 0x63, 0xb6,
  ],
];
const reverse_Pi = [
  [
    0xa5, 0x2d, 0x32, 0x8f, 0x0e, 0x30, 0x38, 0xc0, 0x54, 0xe6, 0x9e, 0x39,
    0x55, 0x7e, 0x52, 0x91,
  ],
  [
    0x64, 0x03, 0x57, 0x5a, 0x1c, 0x60, 0x07, 0x18, 0x21, 0x72, 0xa8, 0xd1,
    0x29, 0xc6, 0xa4, 0x3f,
  ],
  [
    0xe0, 0x27, 0x8d, 0x0c, 0x82, 0xea, 0xae, 0xb4, 0x9a, 0x63, 0x49, 0xe5,
    0x42, 0xe4, 0x15, 0xb7,
  ],
  [
    0xc8, 0x06, 0x70, 0x9d, 0x41, 0x75, 0x19, 0xc9, 0xaa, 0xfc, 0x4d, 0xbf,
    0x2a, 0x73, 0x84, 0xd5,
  ],
  [
    0xc3, 0xaf, 0x2b, 0x86, 0xa7, 0xb1, 0xb2, 0x5b, 0x46, 0xd3, 0x9f, 0xfd,
    0xd4, 0x0f, 0x9c, 0x2f,
  ],
  [
    0x9b, 0x43, 0xef, 0xd9, 0x79, 0xb6, 0x53, 0x7f, 0xc1, 0xf0, 0x23, 0xe7,
    0x25, 0x5e, 0xb5, 0x1e,
  ],
  [
    0xa2, 0xdf, 0xa6, 0xfe, 0xac, 0x22, 0xf9, 0xe2, 0x4a, 0xbc, 0x35, 0xca,
    0xee, 0x78, 0x05, 0x6b,
  ],
  [
    0x51, 0xe1, 0x59, 0xa3, 0xf2, 0x71, 0x56, 0x11, 0x6a, 0x89, 0x94, 0x65,
    0x8c, 0xbb, 0x77, 0x3c,
  ],
  [
    0x7b, 0x28, 0xab, 0xd2, 0x31, 0xde, 0xc4, 0x5f, 0xcc, 0xcf, 0x76, 0x2c,
    0xb8, 0xd8, 0x2e, 0x36,
  ],
  [
    0xdb, 0x69, 0xb3, 0x14, 0x95, 0xbe, 0x62, 0xa1, 0x3b, 0x16, 0x66, 0xe9,
    0x5c, 0x6c, 0x6d, 0xad,
  ],
  [
    0x37, 0x61, 0x4b, 0xb9, 0xe3, 0xba, 0xf1, 0xa0, 0x85, 0x83, 0xda, 0x47,
    0xc5, 0xb0, 0x33, 0xfa,
  ],
  [
    0x96, 0x6f, 0x6e, 0xc2, 0xf6, 0x50, 0xff, 0x5d, 0xa9, 0x8e, 0x17, 0x1b,
    0x97, 0x7d, 0xec, 0x58,
  ],
  [
    0xf7, 0x1f, 0xfb, 0x7c, 0x09, 0x0d, 0x7a, 0x67, 0x45, 0x87, 0xdc, 0xe8,
    0x4f, 0x1d, 0x4e, 0x04,
  ],
  [
    0xeb, 0xf8, 0xf3, 0x3e, 0x3d, 0xbd, 0x8a, 0x88, 0xdd, 0xcd, 0x0b, 0x13,
    0x98, 0x02, 0x93, 0x80,
  ],
  [
    0x90, 0xd0, 0x24, 0x34, 0xcb, 0xed, 0xf4, 0xce, 0x99, 0x10, 0x44, 0x40,
    0x92, 0x3a, 0x01, 0x26,
  ],
  [
    0x12, 0x1a, 0x48, 0x68, 0xf5, 0x81, 0x8b, 0xc7, 0xd6, 0x20, 0x0a, 0x08,
    0x00, 0x4c, 0xd7, 0x74,
  ],
];
const Kuz = () => {
  // Data Parameters
  const [data, setData] = useState({
    mode: "ecb",
    key: "",
    iv: "",
    plainText: "",
    plainTextHex: false,
  });

  const [plainTextValidity, setPlainTextValidity] = useState(false);
  const [paddedPlainText, setPaddedPlainText] = useState("");
  const [result, setResult] = useState({
    state: false,
    constants: createConstants().constantsHex,
    roundKeys: Array(10).fill(null),
    encryptionStates: Array(10).fill(Array(5).fill(null)),
    cipher: "",
  });
  const [inputBlock, setInputBlock] = useState(
    encrypt(
      [
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x00, 0xff, 0xee, 0xdd, 0xcc,
        0xbb, 0xaa, 0x99, 0x88,
      ],
      "8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef",
      data.mode,
      data.iv
    ).states
  );
  const [iterNum, setIterNum] = useState(1);
  const [encryptionRound, setEncryptionRound] = useState(0);
  const [block, setBlock] = useState(0);
  const [xorOp, setXorOp] = useState(0);
  const [encNonLin, setEncNonLin] = useState([null, null]);
  // method That change data parameters  by any change in form inputs ..
  const handleChange = (event) => {
    const res = document.getElementById("kuz-res");
    res.style.display = "none";
    const { name, value, type, checked } = event.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
    setResult((prev) => {
      return {
        ...prev,
        state: false,
      };
    });
  };
  // Submit Button
  const handleSubmit = (event) => {
    const res = document.getElementById("kuz-res");
    event.preventDefault();
    res.style.display = "block";
    setResult((prev) => {
      return {
        ...prev,
        state: true,
        roundKeys: keyExpansion(data.key),
        encryptionStates: encryptBlock(inputBlock[block][1], data.key).state,
        cipher: encrypt(paddedPlainText, data.key, data.mode, data.iv)
          .CipherText,
      };
    });
  };
  useEffect(
    () =>
      setPaddedPlainText(
        data.plainTextHex
          ? pkcs7(data.plainText, 16).appendedPlaintextDec
          : pkcs7(textToUtf8(data.plainText).encodedTextHex, 16)
              .appendedPlaintextDec
      ),
    [data.plainText, data.plainTextHex]
  );
  useEffect(
    () =>
      setInputBlock(
        encrypt(paddedPlainText, data.key, data.mode, data.iv).states
      ),
    [paddedPlainText, data.key, data.mode, data.iv]
  );
  useEffect(
    () =>
      setResult((prev) => {
        return {
          ...prev,
          encryptionStates: encryptBlock(inputBlock[block][1], data.key).state,
          cipher: encrypt(paddedPlainText, data.key, data.mode, data.iv)
            .CipherText,
        };
      }),
    [block]
  );
  //

  // Function to Show and Hide main sections
  const toggle = (e) => {
    const el = e.target.className;
    const element = document.getElementById(`${el}`);
    return (element.style.display =
      element.style.display === "block" ? "none" : "block");
  };
  // method to generate a 256-bit key
  const generateKey = (event) => {
    event.preventDefault();
    const charactersHex = "0123456789abcdef";
    let key = "";
    for (let i = 0; i < 64; i++) {
      key += charactersHex.charAt(Math.floor(Math.random() * 16));
    }
    setData((prev) => {
      return {
        ...prev,
        key: key,
      };
    });
  };
  // method to generate a 128-bit IV
  const generateIV = (event) => {
    event.preventDefault();
    const charactersHex = "0123456789abcdef";
    let iv = "";
    for (let i = 0; i < 32; i++) {
      iv += charactersHex.charAt(Math.floor(Math.random() * 16));
    }
    setData((prev) => {
      return {
        ...prev,
        iv: iv,
      };
    });
  };
  // method to check validation of inputs
  const validation = () => {
    const submit = document.getElementById("submit");
    const key = document.getElementById("key");
    const iv = document.getElementById("iv");
    const plainText = document.getElementById("plainText");
    if (data.mode === "ecb") {
      if (key.checkValidity() && plainTextValidity) {
        submit.disabled = false;
      } else {
        submit.disabled = true;
      }
    } else if (data.mode === "cbc") {
      if (key.checkValidity() && iv.checkValidity() && plainTextValidity) {
        submit.disabled = false;
      } else {
        submit.disabled = true;
      }
    }
    plainText.style.backgroundColor = plainTextValidity ? "#aff5ac" : "#fdc8bf";
  };
  useEffect(validation, [data.key, data.iv, plainTextValidity]);
  const plainTextValidate = () => {
    const plainText = document.getElementById("plainText");
    const regex = /^[0-9A-Fa-f]+$/g;
    setPlainTextValidity(
      data.plainTextHex
        ? plainText.checkValidity() &&
            regex.test(data.plainText) &&
            data.plainText.length % 2 === 0
        : plainText.checkValidity()
    );
  };
  useEffect(plainTextValidate, [data.plainText, data.plainTextHex]);
  return (
    <section id="kuz">
      <h1>Kuznyechik - Кузнечик</h1>
      <p>
        Kuznyechik is a symmetric block cipher. It has a block size of 128 bits
        and key length of 256 bits. It is defined in the National Standard of
        the Russian Federation GOST R 34.12-2015.
      </p>
      <fieldset>
        <legend>Kuznyechik Implementation</legend>
        <form className="flex" onSubmit={handleSubmit}>
          <label htmlFor="version">Mode:</label>
          <select id="mode" name="mode" onChange={handleChange} required>
            <option value="ecb">Electronic Code Book - ECB</option>
            <option value="cbc">Cipher Block Chaining - CBC</option>
          </select>
          <label htmlFor="key">
            Key: <small>(Hexadecimal)</small>
          </label>
          <div className="grid-cbc">
            <input
              type="text"
              id="key"
              name="key"
              value={data.key}
              placeholder={
                !data.key ? "Enter a 256-bit Key or Generate it" : data.key
              }
              onChange={handleChange}
              autoComplete="off"
              pattern={"[0-9A-Fa-f]{64,64}"}
              required
            />
            <button id="key-gen" onClick={generateKey}>
              Generate a Key
            </button>
          </div>
          {data.mode === "cbc" ? (
            <>
              <label htmlFor="iv">
                Initialization vector (IV):<small>(Hexadecimal)</small>
              </label>
              <div className="grid-cbc">
                <input
                  type="text"
                  id="iv"
                  name="iv"
                  value={data.iv}
                  placeholder={
                    !data.iv ? "Enter a 16 Bytes IV or Generate it" : data.iv
                  }
                  onChange={handleChange}
                  autoComplete="off"
                  pattern={"[0-9A-Fa-f]{32,32}"}
                  required
                />
                <button id="iv-gen" onClick={generateIV}>
                  Generate an IV
                </button>
              </div>
            </>
          ) : null}
          <label htmlFor="plainText">
            Plain Text{" "}
            <small>({data.plainTextHex ? "Hexadecimal" : "String"})</small>
          </label>
          <textarea
            type="text"
            name="plainText"
            id="plainText"
            placeholder="Enter a Plain Text"
            onChange={handleChange}
            value={data.plainText}
            pattern={"[0-9A-Fa-f]{64,64}"}
            required
          />
          <div className="plainText-hex">
            <input
              type="checkbox"
              id="plainTextHex"
              name="plainTextHex"
              onChange={handleChange}
            />
            <label for="plainTextHex">Hexadecimal</label>
          </div>

          <input id="submit" type="submit" value="ENCRYPT" />
        </form>
      </fieldset>
      <div id="kuz-res">
        <div className="container flex">
          <th className="left">
            PlainText:{" "}
            <small>({data.plainTextHex ? "Hexadecimal" : "String"})</small>
          </th>
          <span className="break">{data.plainText}</span>
          <th className="left">
            Key: <small>(Hexadecimal)</small>
          </th>
          <span className="break">{data.key}</span>
          {data.mode === "cbc" && (
            <>
              <th className="left">
                IV: <small>(Hexadecimal)</small>
              </th>
              <span className="break">{data.iv}</span>
            </>
          )}
          <th className="left">
            CipherText: <small>(Hexadecimal)</small>
          </th>
          <span className="break">
            {result.state &&
              result.cipher.map((e) => {
                return (
                  <>
                    {e.map((ee) => {
                      return <>{ee.toString(16).padStart(2, "0")}</>;
                    })}
                  </>
                );
              })}
          </span>
          <th className="left">
            CipherText: <small>(Base64)</small>
          </th>
          <span className="break">
            {result.state && decToBase64(result.cipher.flat())}
          </span>
        </div>
        <h3 className="kuz-format-data" onClick={toggle}>
          &bull; Formatting Data
        </h3>
        <article id="kuz-format-data">
          <div className="container flex">
            <p>
              After encoding PlainText using UTF-8 and padding it using PCSK#7,
              we get the following blocks
            </p>
            <p>
              Number of (128-bit) blocks in this PlainText:{" "}
              <span>{paddedPlainText.length / 16}</span>
            </p>

            <table>
              <caption>PlainText Blocks</caption>
              {Array(paddedPlainText.length / 16)
                .fill(null)
                .map((e, i) => {
                  return (
                    <tr>
                      <th>Block{i + 1}</th>
                      {paddedPlainText.slice(i * 16, i * 16 + 16).map((ee) => {
                        return (
                          <td>
                            <span>{ee.toString(16).padStart(2, "0")}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </table>
          </div>
        </article>

        <h3 className="kuz-key-exp" onClick={toggle}>
          &bull; Key Expansion
        </h3>
        <article id="kuz-key-exp">
          <p>
            The key Expansion stage involves generating a key schedule
            consisting of <span>10</span> round keys
          </p>
          <p>
            The process starts by splitting the master key into two halves to
            form the first pair of round keys
          </p>
          <p>
            First Round Key is the left half of the master key, while the second
            is the right half
          </p>
          <div className="container flex">
            <table>
              <caption> Constants </caption>
              <tbody>
                {result.constants.map((e, i) => {
                  return (
                    <tr>
                      <th className="pointer" onClick={() => setIterNum(i + 1)}>
                        C{i + 1}
                      </th>
                      {e.map((ee) => {
                        return (
                          <td>
                            <span>{ee}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p>
            we get these constants, by appling a linear transformation on a (16
            bytes) block, where all bytes are "00" except the mostright one
            equals to number of constant
          </p>
          <p>
            In this transformation, each byte of the 128-bit block is multiplied
            by a fixed set of coefficients, represented as a 16-byte sequence of
            values. The multiplication is performed in the Galois field GF
            (2^8). The resulting number is written to the place of the most
            significant byte (a15) while the remaining bytes are shifted one bit
            towards least significant bit (left).
          </p>
          <div className="container flex">
            <table>
              <tr>
                <th>Block</th>
                {Array(16)
                  .fill("00")
                  .map((e, i) => {
                    return i !== 15 ? (
                      <td
                        style={
                          i === 0 ? { backgroundColor: "lightgreen" } : null
                        }
                      >
                        {e}
                      </td>
                    ) : (
                      <td>{iterNum}</td>
                    );
                  })}
              </tr>
              <tr>
                <th>Coefficients </th>
                {Coefficients.map((e, i) => {
                  return <td>{e}</td>;
                })}
              </tr>
            </table>
            <div className="flex">
              {Array(16)
                .fill(null)
                .map((e, i) => {
                  return (
                    <KuzConst
                      data={[
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
                        iterNum,
                      ]}
                      index={i}
                      colorIndex={i + 1}
                    />
                  );
                })}
              <p>Last Multiplication as follows: </p>
              <Ploynomial
                data={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, iterNum]}
              />
            </div>
            <p>
              After we generate the constants we can now calculate the rest
              round keys using feistelNetwork
            </p>
          </div>
          <div className="container flex">
            <table>
              <caption>Round Keys</caption>
              {result.state &&
                result.roundKeys.map((e, i) => {
                  return (
                    <tr>
                      <th>
                        RoundKey<sub>{i + 1}</sub>
                      </th>
                      {e.map((ee) => {
                        return (
                          <td>
                            <span>{ee.toString(16).padStart(2, "0")}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </table>
          </div>
        </article>

        <h3 className="kuz-encrypt" onClick={toggle}>
          &bull; Encryption Process
        </h3>
        <article id="kuz-encrypt">
          <p>
            After calculated all the Roundkeys now we can finally proceed
            directly to encrypting each block of plaintext,Where each block
            undergoes ten rounds as follows:
          </p>
          <p></p>
          <h4>Rounds 1 &rarr; 9</h4>
          <p>
            Each intermediate round in Kuznyechik encryption consists of 3
            operations applied in sequence on the 16 bytes block of plaintext:
            XORing with corresponding round key,non-linear transformation and a
            linear transformation
          </p>
          <div className="container flex">
            <p>&bull; Choose a block</p>
            <table>
              {Array(paddedPlainText.length / 16)
                .fill(null)
                .map((e, i) => {
                  return (
                    <tr>
                      <th className="pointer" onClick={() => setBlock(i)}>
                        Block{i + 1}
                      </th>
                      {paddedPlainText.slice(i * 16, i * 16 + 16).map((ee) => {
                        return (
                          <td>
                            <span>{ee.toString(16).padStart(2, "0")}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </table>
            <p>&bull; Choose a round</p>
            <table>
              {Array(9)
                .fill(null)
                .map((e, i) => {
                  return (
                    <th
                      className="pointer"
                      onClick={() => setEncryptionRound(i)}
                    >
                      {i + 1}
                    </th>
                  );
                })}
            </table>
            <br />
            <table>
              <tr>
                <th className="left">
                  {encryptionRound === 0
                    ? data.mode === "ecb"
                      ? `Block${block + 1}`
                      : block === 0
                      ? `Xored Block${block + 1} With IV`
                      : `Xored Block${block + 1} With Cipher${block}`
                    : `Block${block + 1} after round${encryptionRound}`}
                </th>
                {result.state &&
                  result.encryptionStates[encryptionRound][0].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <tr>
                <th className="left">RoundKey{encryptionRound + 1}</th>
                {result.state &&
                  result.encryptionStates[encryptionRound][1].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <br />

              <tr>
                <th className="left">XORing Operation</th>
                {result.state &&
                  result.encryptionStates[encryptionRound][2].map((e, i) => {
                    return (
                      <td
                        className="pointer"
                        onClick={(e) => {
                          setXorOp(i);
                          setEncNonLin([
                            parseInt(
                              e && e.target.innerText.substring(0, 1),
                              16
                            ),
                            parseInt(
                              e && e.target.innerText.substring(1, 2),
                              16
                            ),
                          ]);
                        }}
                      >
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <tr>
                <th className="left">Non-Linear Transformation</th>
                {result.state &&
                  result.encryptionStates[encryptionRound][3].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <tr>
                <th className="left">Linear Transformation</th>
                {result.state &&
                  result.encryptionStates[encryptionRound][4].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <br />
              <tr>
                <th className="left">{`Block${block + 1} after round${
                  encryptionRound + 1
                }`}</th>
                {result.state &&
                  result.encryptionStates[encryptionRound + 1][0].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
            </table>
            <br />
            <p>
              &bull; Press a Byte from a Xoring Operation result above to see
              details{" "}
            </p>
            <table>
              <caption>XORing Operation</caption>
              <tr>
                <th>
                  {result.state &&
                    result.encryptionStates[encryptionRound][0][xorOp]
                      .toString(16)
                      .padStart(2, "0")}
                </th>
                {result.state &&
                  result.encryptionStates[encryptionRound][0][xorOp]
                    .toString(2)
                    .padStart(8, "0")
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
              </tr>
              <tr>
                <th>
                  {result.state &&
                    result.encryptionStates[encryptionRound][1][xorOp]
                      .toString(16)
                      .padStart(2, "0")}
                </th>
                {result.state &&
                  result.encryptionStates[encryptionRound][1][xorOp]
                    .toString(2)
                    .padStart(8, "0")
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
              </tr>
              <tr>
                <th>
                  {result.state &&
                    result.encryptionStates[encryptionRound][0][xorOp]
                      .toString(16)
                      .padStart(2, "0")}
                  &oplus;
                  {result.state &&
                    result.encryptionStates[encryptionRound][1][xorOp]
                      .toString(16)
                      .padStart(2, "0")}
                  =
                  <span>
                    {result.state &&
                      result.encryptionStates[encryptionRound][2][xorOp]
                        .toString(16)
                        .padStart(2, "0")}
                  </span>
                </th>
                {result.state &&
                  result.encryptionStates[encryptionRound][2][xorOp]
                    .toString(2)
                    .padStart(8, "0")
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
              </tr>
            </table>
            <br />
            <Box
              data={Pi}
              value={encNonLin}
              caption={"Non-Linear Transformation"}
            />

            <br />
            <table>
              <caption>Linear Transformation</caption>
              <tr>
                <th className="left">
                  Input <small>Hexadecimal</small>
                </th>
                {result.state &&
                  result.encryptionStates[encryptionRound][3].map((e) => {
                    return <td>{e.toString(16).padStart(2, "0")}</td>;
                  })}
              </tr>
              <tr>
                <th className="left">
                  Input <small>Decimal</small>
                </th>
                {result.state &&
                  result.encryptionStates[encryptionRound][3].map((e) => {
                    return <td>{e}</td>;
                  })}
              </tr>
              <tr>
                <th className="left">Coefficients </th>
                {Coefficients.map((e, i) => {
                  return <td>{e}</td>;
                })}
              </tr>
            </table>
            <div className="flex">
              {result.state &&
                Array(16)
                  .fill(null)
                  .map((e, i) => {
                    return (
                      <KuzConst
                        data={result.encryptionStates[encryptionRound][3]}
                        index={i}
                        colorIndex={i + 1}
                      />
                    );
                  })}
              <p>Last Multiplication as follows: </p>
              {result.state && (
                <Ploynomial
                  data={result.encryptionStates[encryptionRound][3]}
                />
              )}
            </div>
          </div>

          <h4>Round 10</h4>
          <div className="container flex">
            <table>
              <tr>
                <th className="left">{`plainText after round9`}</th>
                {result.state &&
                  result.encryptionStates[9][0].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <tr>
                <th className="left">RoundKey10</th>
                {result.state &&
                  result.encryptionStates[9][1].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <tr>
                <th className="left">XOR</th>
                {result.state &&
                  result.encryptionStates[9][4].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <br />
              <tr>
                <th className="left">{`Cipher${block}`}</th>
                {result.state &&
                  result.encryptionStates[9][4].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
            </table>
          </div>
        </article>
        <h3 className="kuz-decrypt" onClick={toggle}>
          &bull; Decryption Process
        </h3>
        <article id="kuz-decrypt">
          <Box data={reverse_Pi} value={[null, null]} />
        </article>
      </div>
    </section>
  );
};
export default Kuz;
