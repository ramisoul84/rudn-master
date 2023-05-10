import { useState, useEffect } from "react";
import { textToUtf8 } from "../algorithms/utf8";
import { pkcs7 } from "../algorithms/pkcs7";
import {
  createConstants,
  Coefficients,
  linearTransformation,
  keyExpansion,
  encryptBlock,
} from "../algorithms/kuzz";
import KuzConst from "../components/KuzConst";
import Ploynomial from "../components/Polynomial";
import "./kuz.css";
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
    encryptionStates: Array(10).fill(null),
  });
  const [iterNum, setIterNum] = useState(1);
  const [encryptionRound, setEncryptionRound] = useState(0);
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
        encryptionStates: encryptBlock(paddedPlainText, data.key).state,
      };
    });
  };
  useEffect(
    () =>
      setPaddedPlainText(
        data.plainTextHex
          ? pkcs7(data.plainText, 16).appendedPlaintextHex
          : pkcs7(textToUtf8(data.plainText).encodedTextHex, 16)
              .appendedPlaintextHex
      ),
    [data.plainText]
  );
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
          <th className="left">
            CipherText: <small>(Hexadecimal)</small>
          </th>
          <span className="break">{data.key}</span>
          <th className="left">
            CipherText: <small>(Base64)</small>
          </th>
          <span className="break">{data.key}</span>
        </div>
        <h3 className="kuz-format-data" onClick={toggle}>
          &bull; Formatting Data
        </h3>
        <article id="kuz-format-data">
          <div className="container flex">
            <th className="left">
              Encoded PlainText: <small>(UTF-8)</small>
            </th>
            <span className="break">
              {data.plainTextHex
                ? data.plainText
                : textToUtf8(data.plainText).encodedTextHex}
            </span>
          </div>
          <div className="container flex">
            <th className="left">
              Padded PlainText: <small>(PKCS#7)</small>
            </th>
            <span className="break">{paddedPlainText}</span>
          </div>
        </article>
        <h3 className="kuz-key-exp" onClick={toggle}>
          &bull; Key Expansion
        </h3>
        <article id="kuz-key-exp">
          <p>
            The key Expansion stage involves generating a key schedule
            consisting of 10 round keys{" "}
          </p>
          <p>
            The process starts by splitting the master key into two halves to
            form the first pair of round keys
          </p>
          <p>
            First Round Key is the left half of the master key, while the second
            is the right half
          </p>
          <div className="container">
            <p className="break">
              <strong>RoundKey1: </strong>
              <span>{result.roundKeys[0]}</span>
            </p>
            <p className="break">
              <strong>RoundKey2: </strong>
              <span>{result.roundKeys[0]}</span>
            </p>
          </div>
          <p>The rest 8 keys </p>
          <table className="container">
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
          <p>
            To generate the Constants, we apply the linear transformation on a
            (16 bytes) block, where all bytes are "00" except the mostright one
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
            We have calculated all the Roundkeys and now we can finally proceed
            directly to encrypting a block of text, and if you carefully read
            everything written above, then it will not be difficult to encrypt
            the text, since all the operations used in this and their sequence
            have been considered in detail.
          </p>
          <h4>Rounds 1 &rarr; 9</h4>
          <p>
            Each intermediate round in Kuznyechik encryption consists of 3
            operations applied in sequence on the 16 bytes block of plain text:
            XORing with corresponding round key,non-linear transformation and a
            linear transformation
          </p>
          <div className="container flex">
            <p>Choose a round</p>
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
                <th>
                  {encryptionRound === 0
                    ? "PlainText"
                    : `plainText after ${encryptionRound} round`}
                </th>
                {result.state &&
                  result.encryptionStates[encryptionRound].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
              <tr>
                <th>RoundKey{encryptionRound + 1}</th>
                {result.state &&
                  result.roundKeys[encryptionRound].map((e) => {
                    return (
                      <td>
                        <span>{e.toString(16).padStart(2, "0")}</span>
                      </td>
                    );
                  })}
              </tr>
            </table>
          </div>
          <h4>Round 10</h4>
          <p>{result.cipher}</p>
        </article>
        <h3 className="kuz-decrypt" onClick={toggle}>
          &bull; Encryption Process
        </h3>
        <article id="kuz-decrypt"></article>
      </div>
    </section>
  );
};
export default Kuz;
