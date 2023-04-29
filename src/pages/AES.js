import { useState, useEffect } from "react";
import {
  aesEncrypt,
  sBox,
  invSBox,
  rCon,
  mixMatHex,
  invMixMatHex,
  aesDecrypt,
  dot as galoisMultiply,
} from "../algorithms/aes";
import keyExpImg from "../images/keyExpansion.svg";
import Block from "../components/Block";
import Word from "../components/Word";
import Box from "../components/Box";
import State from "../components/State";
import "./aes.css";

const AES = () => {
  // Object Contain input data from Form
  const [form, setForm] = useState({
    version: "128",
    plainText: null,
    key: null,
  });
  // Object Contain Corrected Data that we will use in Crypto
  const [data, setData] = useState({
    plainText: "Welcome to RUDN!",
    key: "moscow2023#rudn*",
  });
  // number of words in original key
  const [n, setN] = useState(4);
  //
  const {
    numberOfBlocks,
    appendedPlaintextHex,
    keyWordsHex,
    keyWordsTableHex,
    keyWordsTable,
    roundKeys,
    states0Hex,
    states0,
    cipherTextBinBlocks,
    ciphrtHex,
  } = aesEncrypt(data.plainText, data.key);
  const { statesDec0Hex } = aesDecrypt(ciphrtHex, data.key);
  const [result, setResult] = useState({
    numberOfBlocks: numberOfBlocks,
    appendedPlaintextHex: appendedPlaintextHex,
    keyWordsHex: keyWordsHex,
    keyWordsTableHex: keyWordsTableHex,
    keyWordsTable: keyWordsTable,
    roundKeys: roundKeys,
    states0Hex: states0Hex,
    states0: states0,
    cipherTextBinBlocks: cipherTextBinBlocks,
    ciphrtHex: ciphrtHex,
    statesDec0Hex: statesDec0Hex,
  });
  ///////////////////

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    const result = document.getElementById("result");
    result.style.display = "none";
  };
  const checkData = () => {
    if (form.version === "128") {
      setData((prev) => {
        return {
          ...prev,
          key: !form.key
            ? "moscow2023#rudn*"
            : form.key.length > 16
            ? form.key.substring(0, 16)
            : form.key.padEnd(16, "-"),
          plainText: !form.plainText ? "Welcome to RUDN!" : form.plainText,
        };
      });
    } else if (form.version === "192") {
      setData((prev) => {
        return {
          ...prev,
          key: !form.key
            ? "moscow2023#rudn_ramisoul"
            : form.key.length > 24
            ? form.key.substring(0, 24)
            : form.key.padEnd(24, "-"),
          plainText: !form.plainText ? "Welcome to RUDN!" : form.plainText,
        };
      });
    } else {
      setData((prev) => {
        return {
          ...prev,
          key: !form.key
            ? "moscow2023#rudn_ramisoul?latakia"
            : form.key.length > 32
            ? form.key.substring(0, 32)
            : form.key.padEnd(32, "-"),
          plainText: !form.plainText ? "Welcome to RUDN!" : form.plainText,
        };
      });
    }
  };
  useEffect(checkData, [form]);
  // Handle Submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const {
      numberOfBlocks,
      appendedPlaintextHex,
      keyWordsHex,
      keyWordsTableHex,
      keyWordsTable,
      roundKeys,
      states0Hex,
      states0,
      cipherTextBinBlocks,
    } = aesEncrypt(data.plainText, data.key);
    setResult((prev) => {
      return {
        ...prev,
        numberOfBlocks: numberOfBlocks,
        appendedPlaintextHex: appendedPlaintextHex,
        keyWordsHex: keyWordsHex,
        keyWordsTableHex: keyWordsTableHex,
        keyWordsTable: keyWordsTable,
        roundKeys: roundKeys,
        states0Hex: states0Hex,
        states0: states0,
        cipherTextBinBlocks: cipherTextBinBlocks,
      };
    });
    setN(data.key.length / 4);
    const result = document.getElementById("result");
    result.style.display = "block";
  };
  const toggle = (e) => {
    const el = e.target.className;
    const element = document.getElementById(`${el}`);
    return (element.style.display =
      element.style.display === "block" ? "none" : "block");
  };
  //
  const [indexRotWord, setIndexRotWord] = useState(3);
  const [indexSubWord, setIndexSubWord] = useState(0);
  const [valueSubWord, setValueSubWord] = useState([null, null]);
  const [indexXorWord, setIndexXorWord] = useState(0);
  const [indexEncRound0, setIndexEncRound0] = useState([0, 0]);
  const [indexEncSub, setIndexEncSub] = useState([0, 0]);
  const [valueSubState, setValueSubState] = useState([null, null]);
  const [indexMix, setIndexMix] = useState({
    i: 0,
    j: 0,
  });
  const [indexDecSub, setIndexDecSub] = useState([0, 0]);
  const [valueSubStateDec, setValueSubStateDec] = useState([null, null]);
  return (
    <section id="aes">
      <h1>Advanced Encryption Standard - AES</h1>
      <p>
        The Advanced Encryption Standard (AES) is a widely used symmetric key
        encryption algorithm that is used to encrypt and decrypt data. It was
        first introduced in 2001 by the National Institute of Standards and
        Technology (NIST) and has since become one of the most popular
        encryption algorithms used in various applications.
      </p>
      <p>
        AES uses a block cipher algorithm that encrypts data in fixed-size
        blocks of 128 bits, and supports key sizes of 128, 192, or 256 bits. The
        algorithm uses a series of substitution, permutation, and mixing
        operations to create a complex encryption process that is difficult to
        crack without the correct key .
      </p>
      <h2>AES Implementation</h2>
      <p>
        In this section, we will describe how AES works by providing an example.
        To begin, select the version of AES you wish to use (128-bit as
        default),and you can use your own example by entering your own key &
        plainText, or we will use the default ones..
      </p>
      <form className="flex" onSubmit={handleSubmit}>
        <label htmlFor="version">AES-Version:</label>
        <select id="version" name="version" onChange={handleChange} required>
          <option value="128">AES-128</option>
          <option value="192">AES-192</option>
          <option value="256">AES-256</option>
        </select>
        <label htmlFor="key">Key:</label>
        <input
          type="text"
          id="key"
          name="key"
          placeholder={
            form.version === "128"
              ? "Enter a (128-bit) key - 16 characters"
              : form.version === "192"
              ? "Enter a (192-bit) key - 24 characters"
              : form.version === "256"
              ? "Enter a (256-bit) key - 32 characters"
              : null
          }
          onChange={handleChange}
          autoComplete="off"
        />
        <label htmlFor="plaintext">Plain Text:</label>
        <textarea
          type="text"
          name="plainText"
          id="plainText"
          placeholder={"Enter a text"}
          onChange={handleChange}
        />
        <input type="submit" />
      </form>
      <div id="result">
        <div className="container flex">
          <th>PlainText: </th>
          <span>{data.plainText}</span>

          <th>Key: </th>
          <span>{data.key}</span>

          <br />
          <p>
            Before encrypting the plaintext we use here <strong>PKCS#7</strong>{" "}
            (Public Key Cryptography Standards #7), which is a padding scheme
            that appends bytes to the end of the plaintext message to ensure
            that its length is a multiple of the (16 Bytes - 128bits). The value
            of each appended byte is equal to the number of bytes added, in case
            the plain text length is already length is a multiple of 16 , the
            scheme adds an entire new (16 Bytes) block, where each byte equal to
            16
          </p>
          <br />
          <p>
            Padded plaintext contains <span>{result.numberOfBlocks}</span>{" "}
            (128-bit) block{result.numberOfBlocks > 1 ? "s" : null}
          </p>
          <br />
          <p>
            Converting the first (128-bit) block of a padded plaintext, and the{" "}
            <span>({form.version}-bit)</span> key into hexadecimal format:
          </p>
          <Block
            data={result.appendedPlaintextHex.slice(0, 16)}
            name="PlainText"
          />
          <Block
            data={data.key.split("").map((e) => {
              return e
                .charCodeAt(0)
                .toString(16)
                .padStart(2, "0")
                .toUpperCase();
            })}
            name="Key"
          />
          <br />
          <th>CipherText:</th>
          <table>
            <tbody>
              {result.cipherTextBinBlocks.map((e, i) => {
                return (
                  <tr>
                    <th>Block{i}</th>
                    {e.map((ee) => {
                      return (
                        <span>
                          {parseInt(ee, 2)
                            .toString(16)
                            .padStart(2, "0")
                            .toUpperCase()}
                        </span>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p>
          And here is the explanation how we calculate the ciphertext step by
          step
        </p>
        <h3 className="aes-key-exp" onClick={toggle}>
          &bull; Key Expansion
        </h3>
        <article id="aes-key-exp">
          <p>
            The key Expansion stage in AES involves generating a key schedule
            consisting of a sequence of round keys, which are used in the
            successive encryption rounds of AES. The round keys are derived from
            the original secret key by using this equation :
          </p>
          <img src={keyExpImg} alt="key-exp" />
          <p>
            <strong>Where:</strong>
          </p>
          <ul className="list">
            <li>
              <strong>N</strong> is the number of (32-bit) words in original
              key.
            </li>
            <div className="container flex center">
              <table>
                <th>N</th>
                <p>=</p>
                <td>
                  <span>{n}</span>
                </td>
              </table>
            </div>
            <li>
              <strong>
                K<sub>i</sub>
              </strong>{" "}
              is the (32-bit) words of the original key.
            </li>
            <div className="container flex">
              {result.keyWordsHex.slice(0, n).map((e, i) => {
                return <Word name={`K${i}`} data={e} />;
              })}
            </div>
            <li>
              <strong>RotWord</strong> is a one-byte left circular shift
              function, which works as following:
              <p>
                <strong>
                  RotWord([b<sub>0</sub> b<sub>1</sub> b<sub>2</sub> b
                  <sub>3</sub>
                  ])=[b<sub>1</sub> b<sub>2</sub> b<sub>3</sub> b<sub>0</sub>]
                </strong>
              </p>
            </li>
            <div className="container flex center">
              <p style={{ textAlign: "left" }}>
                &bull; Click any byte to see how the RotWord works
              </p>
              <div className="grid3">
                <Word
                  data={result.keyWordsTableHex[n][0]}
                  index={indexRotWord}
                  func1={setIndexRotWord}
                />
                <p>&rArr;</p>
                <Word
                  data={result.keyWordsTableHex[n][1]}
                  index={indexRotWord !== 0 ? indexRotWord - 1 : 3}
                />
              </div>
            </div>
            <li>
              <strong>SubWord</strong> is substitution function that replace
              each byte of a (32-bit) word with a new byte based on a predefined
              lookup table called the "S-box", and works as following:
              <p>
                <strong>
                  SubWord([b<sub>0</sub> b<sub>1</sub> b<sub>2</sub> b
                  <sub>3</sub>
                  ])=[S(b<sub>0</sub>) S(b<sub>1</sub>) S(b<sub>2</sub>) S(b
                  <sub>3</sub>)]
                </strong>
              </p>
            </li>
            <div className="container flex  center">
              <p style={{ textAlign: "left" }}>
                &bull; Click any byte to see how the SubWord works
              </p>
              <div className="grid3">
                <Word
                  data={result.keyWordsTableHex[n][1]}
                  index={indexSubWord}
                  func1={setIndexSubWord}
                  func2={setValueSubWord}
                />
                <p>&rArr;</p>
                <Word
                  data={result.keyWordsTableHex[n][2]}
                  index={indexSubWord}
                />
              </div>
              <Box data={sBox} value={valueSubWord} caption={"S - Box"} />
            </div>
            <li>
              <strong>
                rcon
                <sub>
                  <i>i|N</i>
                </sub>
              </strong>{" "}
              is the round constant
            </li>
            <div className="container flex center">
              <p style={{ textAlign: "left" }}>
                We add Round Constant just when i &equiv; 0 (mode {n})
              </p>
              <table>
                <caption>Round Constant Table</caption>
                <tbody>
                  {rCon.map((e, i) => {
                    return (
                      <tr>
                        <th>
                          rcon<sub>{i + 1}</sub>
                        </th>
                        {e.map((e1) => {
                          return (
                            <td>
                              {e1.toString(16).padStart(2, "0").toUpperCase()}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p style={{ textAlign: "left" }}>
                <strong>N</strong>={n} & <strong>i</strong>={n} &rArr; i &equiv;
                0 (mode {n}) &rArr; for i = {n} we add round constant rcon
                <sub>1</sub>, and we get its value from that table above
              </p>
              <table>
                <th>
                  rcon<sub>1</sub>
                </th>
                <p>=</p>
                {rCon[0].map((e) => {
                  return (
                    <td>
                      <span>
                        {e.toString(16).padStart(2, "0").toUpperCase()}
                      </span>
                    </td>
                  );
                })}
              </table>
            </div>
            <li>
              <strong>&oplus;</strong> is the bitwise XOR operator
            </li>

            <div className="container flex center">
              <p style={{ textAlign: "left" }}>
                <strong>
                  SubWord(RotWord( W<sub>3</sub>))
                </strong>
                &oplus;
                <strong>
                  rcon<sub>1</sub>
                </strong>
                &oplus;
                <strong>
                  W<sub>0</sub>
                </strong>
                &rArr;
                <strong>
                  W<sub>4</sub>
                </strong>
              </p>
              <p style={{ textAlign: "left" }}>
                &bull; Click any byte to see how the Xor Operation works
              </p>
              <div className="grid7">
                <Word
                  data={result.keyWordsTableHex[n][2]}
                  index={indexXorWord}
                  func1={setIndexXorWord}
                />
                <p>&oplus;</p>
                <Word
                  data={result.keyWordsTableHex[n][3]}
                  index={indexXorWord}
                />
                <p>&oplus;</p>
                <Word
                  data={result.keyWordsTableHex[n][5]}
                  index={indexXorWord}
                />
                <p>&rArr;</p>
                <Word
                  data={result.keyWordsTableHex[n][6]}
                  index={indexXorWord}
                />
              </div>
              <p style={{ textAlign: "left" }}>
                Before XORing, we convert each byte into binary format
              </p>
              <Block
                name={result.keyWordsTableHex[n][2][indexXorWord]}
                data={result.keyWordsTable[n][3][indexXorWord].split("")}
              />
              <Block
                name={result.keyWordsTableHex[n][3][indexXorWord]}
                data={result.keyWordsTable[n][3][indexXorWord].split("")}
              />
              <Block
                name={result.keyWordsTableHex[n][5][indexXorWord]}
                data={result.keyWordsTable[n][5][indexXorWord].split("")}
              />
              <hr />
              <Block
                name={`${result.keyWordsTableHex[n][2][indexXorWord]}+${result.keyWordsTableHex[n][3][indexXorWord]}+${result.keyWordsTableHex[n][5][indexXorWord]}`}
                data={result.keyWordsTable[n][6][indexXorWord].split("")}
              />
              <p style={{ textAlign: "left" }}>
                We devide the result{" "}
                <span>{result.keyWordsTable[n][6][indexXorWord]}</span> into two
                halves (4-bit) each, and calculate the equivalent hexadecimal
                value
              </p>
              <p style={{ textAlign: "left" }}>
                <span>
                  {result.keyWordsTable[n][6][indexXorWord].substring(0, 4)}
                </span>{" "}
                ={" "}
                {result.keyWordsTable[n][6][indexXorWord]
                  .substring(0, 4)
                  .split("")
                  .map((e, i) => {
                    return (
                      <>
                        {e}&sdot;2<sup>{3 - i}</sup>
                        {i !== 3 ? "+" : "="}
                      </>
                    );
                  })}
                <span> {result.keyWordsTableHex[n][6][indexXorWord][0]}</span>
              </p>
              <p style={{ textAlign: "left" }}>
                <span>
                  {result.keyWordsTable[n][6][indexXorWord].substring(4)}
                </span>{" "}
                ={" "}
                {result.keyWordsTable[n][6][indexXorWord]
                  .substring(4)
                  .split("")
                  .map((e, i) => {
                    return (
                      <>
                        {e}&sdot;2<sup>{3 - i}</sup>
                        {i !== 3 ? "+" : "="}
                      </>
                    );
                  })}{" "}
                <span> {result.keyWordsTableHex[n][6][indexXorWord][1]}</span>
              </p>
              <Block
                name={result.keyWordsTableHex[n][6][indexXorWord]}
                data={result.keyWordsTable[n][6][indexXorWord].split("")}
              />
              <p style={{ textAlign: "left" }}>
                This table explains how does this operator work
              </p>
              <table>
                <caption>XOR Table</caption>
                <tbody>
                  <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>A&oplus;B</th>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <li>
              <strong>i</strong> represents the current iteration of the key
              schedule
            </li>
            <div className="container flex">
              <p>
                <strong>i</strong> takes values{" "}
                <span>0, 1, 2, 3, ..., {4 * (n + 7) - 1} </span> Where 4×(N
                <sub>r</sub>+1)-1 = <span> {4 * (n + 7) - 1}</span>, N
                <sub>r</sub> is Number of rounds = <span>{n + 6}</span>
              </p>
              <table>
                <caption>Number Of Rounds</caption>
                <th>AES Version</th>
                <th>
                  N<sub>r</sub>
                </th>
                <tr>
                  <td>AES-128</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>AES-192</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>AES-256</td>
                  <td>14</td>
                </tr>
              </table>
            </div>
            <li>
              <strong>
                W<sub>i</sub>
              </strong>{" "}
              is the i-th word of the key schedule.
            </li>
            <div className="container flex">
              <table>
                <th>i</th>
                <th>
                  W<sub>i-1</sub>
                </th>
                <th>RotWord()</th>
                <th>SubWord()</th>
                <th>
                  rcon<sub>(i/N)</sub>
                </th>
                <th>
                  &oplus; rcon<sub>(i/N)</sub>
                </th>
                <th>
                  W<sub>i-N</sub>
                </th>
                <th>
                  W<sub>i</sub>
                </th>
                <tbody>
                  {result.keyWordsTableHex.map((e, i) => {
                    return (
                      <tr>
                        <th>
                          <strong>{i}</strong>
                        </th>
                        {e.map((e1) => {
                          return (
                            <td>
                              {e1
                                ? e1.map((e2) => {
                                    return (
                                      <p
                                        style={{
                                          display: "inline-block",
                                          width: "25px",
                                        }}
                                      >
                                        <span>{e2}</span>
                                      </p>
                                    );
                                  })
                                : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ul>
          <p> From last chapter we can get all Round Keys as following:</p>
          <div className="container flex">
            <table>
              <caption>Round Keys</caption>
              <tbody>
                {result.roundKeys.map((e, i) => {
                  return (
                    <tr>
                      <th>
                        RoundKey<sub>{i}</sub>
                      </th>
                      <td>
                        {Array(4)
                          .fill(null)
                          .map((e, i1) => {
                            return (
                              <p style={{ display: "inline" }}>
                                <strong>W</strong>
                                <sub>{i * 4 + i1}</sub>
                                {i1 !== 3 ? "+" : null}
                              </p>
                            );
                          })}
                      </td>
                      <td>
                        {e.map((e1) => {
                          return <span>{e1}</span>;
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
        <h3 onClick={toggle} className="aes-encrypt">
          &bull; Encyption Process
        </h3>
        <article id="aes-encrypt">
          <p>
            This stage involves dividing the plaintext into blocks of fixed
            size, which is 128 bits (16 bytes). Each block is then arranged as a
            two-dimensional array (Matrix) of four rows and four columns, called
            the state .
          </p>
          <div className="container flex center">
            <p style={{ textAlign: "left" }}>
              The arrangement undergoes as the following:
            </p>
            <table>
              <tbody>
                <th>PlainText</th>
                {Array(16)
                  .fill("b")
                  .map((e, i) => {
                    return (
                      <td>
                        <span>
                          {e}
                          <sub>{i}</sub>
                        </span>
                      </td>
                    );
                  })}
              </tbody>
            </table>
            &dArr;
            <table>
              <caption>State</caption>
              {[
                [0, 4, 8, 12],
                [1, 5, 9, 13],
                [2, 6, 10, 14],
                [3, 7, 11, 15],
              ].map((e, i) => {
                return (
                  <tr>
                    {e.map((ee) => {
                      return (
                        <td>
                          <span>
                            b<sub>{ee}</sub>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </table>
          </div>
          <p>
            During the encryption process, each byte of the state matrix is
            processed independently in a series of rounds. The number of rounds
            depends on the key size. In each round, the state matrix undergoes a
            sequence of operations, including byte substitution, row shifting,
            column mixing and key mixing.
          </p>
          <h4 onClick={toggle} className="aes-encrypt-zero">
            Round 0
          </h4>
          <article id="aes-encrypt-zero">
            <p>
              In the initial round we XOR each byte of the PlainText Block
              Matrix with a corresponding byte from a RoundKey<sub>0</sub>{" "}
              Matrix
            </p>
            <div className="container flex center">
              <Block
                data={result.appendedPlaintextHex.slice(0, 16)}
                name="PlainText"
              />
              <Block data={result.roundKeys[0]} name="RoundKey0" />
              <p style={{ textAlign: "left" }}>
                After converting PlainText and RoundKey<sub>0</sub> to Matrix
                form, we XOR corresponding bytes to get State<sub>0</sub>{" "}
              </p>
              <p style={{ textAlign: "left" }}>
                &bull; Click any byte in PlainText Matrix to see how the XOR of
                corresponding bytes works
              </p>
              <div className="grid5 ">
                <State
                  data={result.states0Hex[0][0]}
                  caption="PlainText"
                  index={indexEncRound0}
                  func1={setIndexEncRound0}
                />
                <p style={{ margin: "auto 0" }}>&oplus;</p>
                <State
                  data={result.states0Hex[0][4]}
                  caption="RoundKey0"
                  index={indexEncRound0}
                />
                <p style={{ margin: "auto 0" }}>&rArr;</p>
                <State
                  data={result.states0Hex[0][5]}
                  caption="State0"
                  index={indexEncRound0}
                />
              </div>
              <p style={{ textAlign: "left" }}>
                Before XORing, we convert each byte into binary format
              </p>
              <Block
                name={
                  result.states0Hex[0][0][indexEncRound0[0]][indexEncRound0[1]]
                }
                data={result.states0[0][0][indexEncRound0[0]][
                  indexEncRound0[1]
                ].split("")}
              />
              <Block
                name={
                  result.states0Hex[0][4][indexEncRound0[0]][indexEncRound0[1]]
                }
                data={result.states0[0][4][indexEncRound0[0]][
                  indexEncRound0[1]
                ].split("")}
              />
              <hr />
              <Block
                name={`${
                  result.states0Hex[0][0][indexEncRound0[0]][indexEncRound0[1]]
                }+${
                  result.states0Hex[0][4][indexEncRound0[0]][indexEncRound0[1]]
                }`}
                data={result.states0[0][5][indexEncRound0[0]][
                  indexEncRound0[1]
                ].split("")}
              />
              <p style={{ textAlign: "left" }}>
                We devide the result{" "}
                <span>
                  {result.states0[0][5][indexEncRound0[0]][indexEncRound0[1]]}
                </span>{" "}
                into two halves (4-bit) each, and calculate the equivalent
                hexadecimal value
              </p>
              <p style={{ textAlign: "left" }}>
                <span>
                  {result.states0[0][5][indexEncRound0[0]][
                    indexEncRound0[1]
                  ].substring(0, 4)}
                </span>{" "}
                ={" "}
                {result.states0[0][5][indexEncRound0[0]][indexEncRound0[1]]
                  .substring(0, 4)
                  .split("")
                  .map((e, i) => {
                    return (
                      <>
                        {e}&sdot;2<sup>{3 - i}</sup>
                        {i !== 3 ? "+" : "="}
                      </>
                    );
                  })}
                <span>
                  {" "}
                  {
                    result.states0Hex[0][5][indexEncRound0[0]][
                      indexEncRound0[1]
                    ][0]
                  }
                </span>
              </p>
              <p style={{ textAlign: "left" }}>
                <span>
                  {result.states0[0][5][indexEncRound0[0]][
                    indexEncRound0[1]
                  ].substring(4)}
                </span>{" "}
                ={" "}
                {result.states0[0][5][indexEncRound0[0]][indexEncRound0[1]]
                  .substring(4)
                  .split("")
                  .map((e, i) => {
                    return (
                      <>
                        {e}&sdot;2<sup>{3 - i}</sup>
                        {i !== 3 ? "+" : "="}
                      </>
                    );
                  })}{" "}
                <span>
                  {
                    result.states0Hex[0][5][indexEncRound0[0]][
                      indexEncRound0[1]
                    ][1]
                  }
                </span>
              </p>
              <Block
                name={
                  result.states0Hex[0][5][indexEncRound0[0]][indexEncRound0[1]]
                }
                data={result.states0[0][5][indexEncRound0[0]][
                  indexEncRound0[1]
                ].split("")}
              />
            </div>
          </article>
          <h4 onClick={toggle} className="aes-encrypt-rounds">
            Rounds 1, 2, 3, ...{data.key.length / 4 + 5}
          </h4>
          <article id="aes-encrypt-rounds">
            <p>
              Each intermediate round in AES encryption consists of four
              operations applied in sequence on the state matrix: byte
              substitution, shift rows, mix columns, and add round key.
            </p>
            <ul className="list">
              <li>
                <strong>Byte substitution:</strong> This operation substitutes
                each byte of the state matrix with a corresponding byte from a
                fixed lookup table called the S-box. The S-box provides a
                non-linear mapping between the input byte and output byte,
                adding confusion to the data.
              </li>
              <div className="container  flex center">
                <p style={{ textAlign: "left" }}>
                  &bull; Click any byte in State0 Matrix to see how the Byte
                  substitution works
                </p>
                <div className="grid3">
                  <State
                    data={result.states0Hex[1][0]}
                    caption="State0"
                    index={indexEncSub}
                    func1={setIndexEncSub}
                    func2={setValueSubState}
                  />
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <State
                    data={result.states0Hex[1][1]}
                    caption="After SubBytes"
                    index={indexEncSub}
                  />
                </div>
                <Box data={sBox} caption="S-Box" value={valueSubState} />
              </div>
              <li>
                <strong>Shift rows:</strong> In this operation, the second row
                of the state matrix is shifted one byte to the left, the third
                row is shifted two bytes to the left, and the fourth row is
                shifted three bytes to the left. This provides diffusion and
                makes the ciphertext less susceptible to attacks.
              </li>
              <div className="container  flex center">
                <div className="grid3">
                  <table>
                    <caption>Previous Matrix</caption>
                    {result.states0Hex[1][1].map((e, i) => {
                      return (
                        <tr>
                          {e.map((e1, j) => {
                            return (
                              <td
                                style={
                                  i > 0 && j === 3
                                    ? { backgroundColor: "lightgreen" }
                                    : {}
                                }
                              >
                                <span>{e1}</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <table>
                    <caption>After ShiftRows</caption>
                    {result.states0Hex[1][2].map((e, i) => {
                      return (
                        <tr>
                          {e.map((e1, j) => {
                            return (
                              <td
                                style={
                                  (i === 1 && j === 2) ||
                                  (i === 2 && j === 1) ||
                                  (i === 3 && j === 0)
                                    ? { backgroundColor: "lightgreen" }
                                    : {}
                                }
                              >
                                <span>{e1}</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
              <li>
                <strong>MixColumns:</strong>This transformation operates on each
                column of the state matrix, treating it as a four-term
                polynomial over the finite field GF(2^8), and applies a matrix
                multiplication operation using a fixed 4x4 matrix called the
                MixColumns matrix.
              </li>
              <div className="container flex center">
                <p style={{ textAlign: "left" }}>
                  &bull; Click any byte in result Matrix (After MixColumns) to
                  see how the MixColumns transformation works
                </p>
                <div className="grid5">
                  <table>
                    <caption>MixColumns matrix</caption>
                    <tbody>
                      {mixMatHex.map((e, i) => {
                        return (
                          <tr>
                            {e.map((e1, j) => {
                              return (
                                <td
                                  style={
                                    i === indexMix.i
                                      ? { backgroundColor: "lightgreen" }
                                      : {}
                                  }
                                >
                                  <strong>
                                    {" "}
                                    {e1
                                      .toString(16)
                                      .padStart(2, "0")
                                      .toUpperCase()}
                                  </strong>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p style={{ margin: "auto 0" }}>*</p>
                  <table>
                    <caption>Previous State</caption>
                    {result.states0Hex[1][2].map((e, i) => {
                      return (
                        <tr>
                          {e.map((e1, j) => {
                            return (
                              <td
                                style={
                                  j === indexMix.j
                                    ? { backgroundColor: "lightgreen" }
                                    : {}
                                }
                              >
                                <span>{e1}</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <table>
                    <caption>After MixColumns</caption>
                    <tbody>
                      {result.states0Hex[1][3].map((e, i) => {
                        return (
                          <tr>
                            {e.map((e1, j) => {
                              return (
                                <td
                                  className="pointer"
                                  style={
                                    j === indexMix.j && i === indexMix.i
                                      ? { backgroundColor: "lightgreen" }
                                      : {}
                                  }
                                  onClick={() =>
                                    setIndexMix((prev) => {
                                      return { ...prev, i: i, j: j };
                                    })
                                  }
                                >
                                  <span>{e1}</span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <table>
                  <tbody>
                    <td>{mixMatHex[indexMix.i][0]}</td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[1][2][0][indexMix.j]}</td>
                    <p className="center">&oplus;</p>
                    <td>{mixMatHex[indexMix.i][1]}</td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[1][2][1][indexMix.j]}</td>
                    <p className="center">&oplus;</p>
                    <td>{mixMatHex[indexMix.i][2]}</td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[1][2][2][indexMix.j]}</td>
                    <p className="center">&oplus;</p>
                    <td>{mixMatHex[indexMix.i][3]}</td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[1][2][3][indexMix.j]}</td>
                    <p className="center">=</p>
                    <th>{result.states0Hex[1][3][indexMix.i][indexMix.j]}</th>
                  </tbody>
                </table>
                <p style={{ textAlign: "left" }}>
                  To perform these arithmetic operations on bytes, first we
                  convert each byte into its binary form,then we interpret this
                  binary sequence as the coefficients of a polynomial of degree
                  7
                </p>
                <table className="mix-grid4">
                  <th>{mixMatHex[indexMix.i][0]}</th>
                  <td>
                    <span>
                      {mixMatHex[indexMix.i][0].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][0]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][0]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                </table>
                <table className="mix-grid4">
                  <th>{result.states0Hex[1][2][0][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[1][2][0][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[1][2][0][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[1][2][0][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                </table>
                <table className="mix-grid4">
                  <th>
                    {mixMatHex[indexMix.i][0]}*
                    {result.states0Hex[1][2][0][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[1][2][0][indexMix.j],
                      mixMatHex[indexMix.i][0].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        result.states0[1][2][0][indexMix.j],
                        mixMatHex[indexMix.i][0].toString(2).padStart(8, "0")
                      )}
                    </span>
                  </td>
                </table>
                <hr />
                <table className="mix-grid4">
                  <th>{mixMatHex[indexMix.i][1]}</th>
                  <td>
                    <span>
                      {mixMatHex[indexMix.i][1].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][1]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][1]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <th>{result.states0Hex[1][2][1][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[1][2][1][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[1][2][1][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[1][2][1][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>

                  <th>
                    {mixMatHex[indexMix.i][1]}*
                    {result.states0Hex[1][2][1][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[1][2][1][indexMix.j],
                      mixMatHex[indexMix.i][1].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        mixMatHex[indexMix.i][1].toString(2).padStart(8, "0"),
                        result.states0[1][2][1][indexMix.j]
                      )}
                    </span>
                  </td>
                </table>
                <hr />
                <table className="mix-grid4">
                  <th>{mixMatHex[indexMix.i][2]}</th>
                  <td>
                    <span>
                      {mixMatHex[indexMix.i][2].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][2]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][2]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <th>{result.states0Hex[1][2][2][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[1][2][2][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[1][2][2][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[1][2][2][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>

                  <th>
                    {mixMatHex[indexMix.i][2]}*
                    {result.states0Hex[1][2][2][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[1][2][2][indexMix.j],
                      mixMatHex[indexMix.i][2].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        mixMatHex[indexMix.i][2].toString(2).padStart(8, "0"),
                        result.states0[1][2][2][indexMix.j]
                      )}
                    </span>
                  </td>
                </table>
                <hr />
                <table className="mix-grid4">
                  <th>{mixMatHex[indexMix.i][3]}</th>
                  <td>
                    <span>
                      {mixMatHex[indexMix.i][3].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][3]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {mixMatHex[indexMix.i][3]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <th>{result.states0Hex[1][2][3][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[1][2][3][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[1][2][3][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[1][2][3][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>

                  <th>
                    {mixMatHex[indexMix.i][3]}*
                    {result.states0Hex[1][2][3][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[1][2][3][indexMix.j],
                      mixMatHex[indexMix.i][3].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        mixMatHex[indexMix.i][3].toString(2).padStart(8, "0"),
                        result.states0[1][2][3][indexMix.j]
                      )}
                    </span>
                  </td>
                </table>
                <p
                  style={{ textAlign: "left", color: "red", fontSize: "12px" }}
                >
                  * if the result of the multiplication contains a term with
                  degree 8 or highe,we need to reduce the result modulo an
                  irreducible polynomial of degree 8,we can replace any term
                  with degree 8 or higher with an equivalent term that has
                  degree less than 8, using the relation x<sup>8</sup> = x
                  <sup>4</sup> + x<sup>3</sup> + x + 1. then we simplify the
                  result by removing any terms that are equivalent modulo this
                  polynomial.
                </p>
                <p style={{ textAlign: "left" }}>Now we XOR The results</p>
                <table>
                  {galoisMultiply(
                    mixMatHex[indexMix.i][0].toString(2).padStart(8, "0"),
                    result.states0[1][2][0][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <table>
                  {galoisMultiply(
                    mixMatHex[indexMix.i][1].toString(2).padStart(8, "0"),
                    result.states0[1][2][1][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <table>
                  {galoisMultiply(
                    mixMatHex[indexMix.i][2].toString(2).padStart(8, "0"),
                    result.states0[1][2][2][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <table>
                  {galoisMultiply(
                    mixMatHex[indexMix.i][3].toString(2).padStart(8, "0"),
                    result.states0[1][2][3][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <hr />
                <table>
                  {result.states0[1][3][indexMix.i][indexMix.j]
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <p style={{ textAlign: "left" }}>
                  and the resultant binary number represent{" "}
                  <span>{result.states0Hex[1][3][indexMix.i][indexMix.j]}</span>
                </p>
              </div>
              <li>
                <strong>Add Round Key:</strong> In this operation, the state
                matrix is XORed with a corresponding round key derived from the
                key schedule.
              </li>
              <div className="container flex center">
                <div className="grid5">
                  <State
                    data={result.states0Hex[1][3]}
                    caption="Previous Matrix"
                    index={[0, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&oplus;</p>
                  <State
                    data={result.states0Hex[1][4]}
                    caption="RoundKey1"
                    index={[0, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <State
                    data={result.states0Hex[1][5]}
                    caption="State1"
                    index={[0, 0]}
                  />
                </div>
              </div>
            </ul>
            <p>
              These four operations are applied in sequence on the state matrix
              in each intermediate round, except for the final round
            </p>
            <div className="container flex">
              <table>
                <th>i</th>
                <th>
                  State<sub>i-1</sub>
                </th>
                <th>SubBytes</th>
                <th>ShiftRows</th>
                <th>MixColumns</th>
                <th>
                  Round Key<sub>i</sub>
                </th>
                <th>
                  State<sub>i</sub>
                </th>
                <tbody>
                  {result.states0Hex.slice(1, n + 6).map((e, i) => {
                    return (
                      <tr>
                        <th>{i + 1}</th>
                        {e.map((ee) => {
                          return ee ? (
                            <td
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            >
                              <div>
                                {ee.map((e, i) => {
                                  return (
                                    <tr className="all-rounds">
                                      {e.map((e1, j) => {
                                        return (
                                          <td>
                                            <span>{e1}</span>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </div>
                            </td>
                          ) : (
                            <td
                              style={{
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            ></td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
          <h4 onClick={toggle} className="aes-encrypt-last">
            Round {data.key.length / 4 + 6}
          </h4>
          <article id="aes-encrypt-last">
            <p>
              in last round we do all steps as last chapter, except MixColumns
            </p>
            <div className="container flex ">
              <div className="round-last">
                <State
                  data={result.states0Hex[n + 6][0]}
                  caption={`State ${n + 5}`}
                  index={[0, 0]}
                />
                <State
                  data={result.states0Hex[n + 6][1]}
                  caption={"SubBytes"}
                  index={[0, 0]}
                />
                <State
                  data={result.states0Hex[n + 6][2]}
                  caption={"ShiftRows"}
                  index={[0, 0]}
                />
                <p style={{ margin: "auto 0" }}>&oplus;</p>
                <State
                  data={result.states0Hex[n + 6][4]}
                  caption={`RoundKey ${n + 6}`}
                  index={[0, 0]}
                />
                <p style={{ margin: "auto 0" }}>&rArr;</p>
                <State
                  data={result.states0Hex[n + 6][5]}
                  caption={`State ${n + 6}`}
                  index={[0, 0]}
                />
              </div>
              <p>
                We get the the first block of cipher text by converting last
                state to original form
              </p>
              <table>
                <th>Cipher:</th>
                {result.cipherTextBinBlocks[0].map((e) => {
                  return (
                    <td>
                      <span>
                        {parseInt(e, 2)
                          .toString(16)
                          .padStart(2, "0")
                          .toUpperCase()}
                      </span>
                    </td>
                  );
                })}
              </table>
              <p>The full cipher is </p>
              <table>
                {result.cipherTextBinBlocks.map((e, i) => {
                  return (
                    <tr>
                      <th>Block{i}</th>
                      {e.map((ee) => {
                        return (
                          <span>
                            {parseInt(ee, 2)
                              .toString(16)
                              .padStart(2, "0")
                              .toUpperCase()}
                          </span>
                        );
                      })}
                    </tr>
                  );
                })}
              </table>
            </div>
          </article>
        </article>
        <h3 onClick={toggle} className="aes-decryption">
          &bull; Decryption Process
        </h3>
        <article id="aes-decryption">
          <p>
            AES decryption is the process of transforming the ciphertext back
            into the original plaintext using the same key that was used for
            encryption. AES decryption involves performing the inverse of the
            operations used in AES encryption, but in reverse order.
          </p>
          <p>
            This stage involves dividing the cipherText into blocks of fixed
            size, which is 128 bits (16 bytes). Each block is then arranged as a
            two-dimensional array (Matrix) of four rows and four columns, called
            the state matrix.
          </p>
          <div className="container flex center">
            <p style={{ textAlign: "left" }}>
              The arrangement undergoes as the following:
            </p>
            <table>
              <tbody>
                <th>CipherText</th>
                {Array(16)
                  .fill("c")
                  .map((e, i) => {
                    return (
                      <td>
                        <span>
                          {e}
                          <sub>{i}</sub>
                        </span>
                      </td>
                    );
                  })}
              </tbody>
            </table>
            &dArr;
            <table>
              <caption>State Matrix</caption>
              <tbody>
                {Array(4)
                  .fill(null)
                  .map((e, i) => {
                    return (
                      <tr>
                        {[0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15]
                          .slice(4 * i, 4 * i + 4)
                          .map((e1, i1) => {
                            return (
                              <td>
                                <span>
                                  c<sub>{e1}</sub>
                                </span>
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <h4 onClick={toggle} className="aes-decryption-zero">
            Round 0
          </h4>
          <article id="aes-decryption-zero">
            <ul className="list">
              <li>
                <strong>Add Round Key</strong>
              </li>
              <p>We add the last Round key to Cipher State</p>
              <div className="container flex center">
                <div className="grid5">
                  <State
                    data={result.states0Hex[n + 6][5]}
                    caption="CipherText"
                    index={[0, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&oplus;</p>
                  <State
                    data={result.states0Hex[n + 6][4]}
                    caption={`RoundKey${n + 6}`}
                    index={[0, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <State
                    data={result.states0Hex[n + 6][2]}
                    caption="New State"
                    index={[0, 0]}
                  />
                </div>
              </div>
              <li>
                <strong>Inverse Shift Rows:</strong>
                <p>
                  In this operation, the second row of the state is shifted one
                  byte to the right, the third row is shifted two bytes to the
                  right, and the fourth row is shifted three bytes to the right.
                </p>
              </li>
              <div className="container  flex center">
                <div className="grid3">
                  <table>
                    <caption>Previous State</caption>
                    {result.states0Hex[n + 6][2].map((e, i) => {
                      return (
                        <tr>
                          {e.map((e1, j) => {
                            return (
                              <td
                                style={
                                  i > 0 && j === 0
                                    ? { backgroundColor: "lightgreen" }
                                    : {}
                                }
                              >
                                <span>{e1}</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <table>
                    <caption>InvShiftRows</caption>
                    {result.states0Hex[n + 6][1].map((e, i) => {
                      return (
                        <tr>
                          {e.map((e1, j) => {
                            return (
                              <td
                                style={
                                  (i === 1 && j === 1) ||
                                  (i === 2 && j === 2) ||
                                  (i === 3 && j === 3)
                                    ? { backgroundColor: "lightgreen" }
                                    : {}
                                }
                              >
                                <span>{e1}</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
              <li>
                <strong>Inverse Byte substitution</strong>
              </li>
              <p>
                This operation substitutes each byte of the state with a
                corresponding byte from a fixed lookup table called the
                Inv-S-box.
              </p>
              <div className="container  flex center">
                <p style={{ textAlign: "left" }}>
                  &bull; Click any byte in State0 Matrix to see how the Byte
                  substitution works
                </p>
                <div className="grid3">
                  <State
                    data={result.states0Hex[n + 6][1]}
                    caption="Previous State"
                    index={indexDecSub}
                    func1={setIndexDecSub}
                    func2={setValueSubStateDec}
                  />
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <State
                    data={result.states0Hex[n + 6][0]}
                    caption="InvSubBytes"
                    index={indexDecSub}
                  />
                </div>
                <Box
                  data={invSBox}
                  caption="Inv-S-Box"
                  value={valueSubStateDec}
                />
              </div>
            </ul>
          </article>
          <h4 onClick={toggle} className="aes-decrypt-rounds">
            Rounds 1, 2, 3, ...{data.key.length / 4 + 5}
          </h4>
          <article id="aes-decrypt-rounds">
            <p>
              Each intermediate round in AES decryption consists of four
              operations applied in sequence on the state matrix:
            </p>
            <ul className="list">
              <li>
                <strong>Add Round Key</strong>
              </li>
              <div className="container flex center">
                <div className="grid5">
                  <State
                    data={result.states0Hex[n + 5][5]}
                    caption="Previous State"
                    index={[0, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&oplus;</p>
                  <State
                    data={result.states0Hex[n + 5][4]}
                    caption={`RoundKey${n + 5}`}
                    index={[0, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <State
                    data={result.states0Hex[n + 5][3]}
                    caption="New State"
                    index={[0, 0]}
                  />
                </div>
              </div>
              <li>
                <strong>Inverse MixColumns:</strong>
              </li>
              <div className="container flex center">
                <p style={{ textAlign: "left" }}>
                  &bull; Click any byte in result Matrix (After MixColumns) to
                  see how the MixColumns transformation works
                </p>
                <div className="grid5">
                  <table>
                    <caption>MixColumns matrix</caption>
                    <tbody>
                      {invMixMatHex.map((e, i) => {
                        return (
                          <tr>
                            {e.map((e1, j) => {
                              return (
                                <td
                                  style={
                                    i === indexMix.i
                                      ? { backgroundColor: "lightgreen" }
                                      : {}
                                  }
                                >
                                  <strong>
                                    {e1
                                      .toString(16)
                                      .padStart(2, "0")
                                      .toUpperCase()}
                                  </strong>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p style={{ margin: "auto 0" }}>*</p>
                  <table>
                    <caption>Previous State</caption>
                    {result.states0Hex[n + 5][3].map((e, i) => {
                      return (
                        <tr>
                          {e.map((e1, j) => {
                            return (
                              <td
                                style={
                                  j === indexMix.j
                                    ? { backgroundColor: "lightgreen" }
                                    : {}
                                }
                              >
                                <span>{e1}</span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </table>
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <table>
                    <caption>InvMixColumns</caption>
                    <tbody>
                      {result.states0Hex[n + 5][2].map((e, i) => {
                        return (
                          <tr>
                            {e.map((e1, j) => {
                              return (
                                <td
                                  className="pointer"
                                  style={
                                    j === indexMix.j && i === indexMix.i
                                      ? { backgroundColor: "lightgreen" }
                                      : {}
                                  }
                                  onClick={() =>
                                    setIndexMix((prev) => {
                                      return { ...prev, i: i, j: j };
                                    })
                                  }
                                >
                                  <span>{e1}</span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <table>
                  <tbody>
                    <td>
                      {invMixMatHex[indexMix.i][0]
                        .toString(16)
                        .padStart(2, "0")
                        .toUpperCase()}
                    </td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[n + 5][3][0][indexMix.j]}</td>
                    <p className="center">&oplus;</p>
                    <td>
                      {invMixMatHex[indexMix.i][1]
                        .toString(16)
                        .padStart(2, "0")
                        .toUpperCase()}
                    </td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[n + 5][3][1][indexMix.j]}</td>
                    <p className="center">&oplus;</p>
                    <td>
                      {invMixMatHex[indexMix.i][2]
                        .toString(16)
                        .padStart(2, "0")
                        .toUpperCase()}
                    </td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[n + 5][3][2][indexMix.j]}</td>
                    <p className="center">&oplus;</p>
                    <td>
                      {invMixMatHex[indexMix.i][3]
                        .toString(16)
                        .padStart(2, "0")
                        .toUpperCase()}
                    </td>
                    <p className="center">*</p>
                    <td>{result.states0Hex[n + 5][3][3][indexMix.j]}</td>
                    <p className="center">=</p>
                    <th>
                      {result.states0Hex[n + 5][2][indexMix.i][indexMix.j]}
                    </th>
                  </tbody>
                </table>
                <p style={{ textAlign: "left" }}>
                  To perform these arithmetic operations on bytes, first we
                  convert each byte into its binary form,then we interpret this
                  binary sequence as the coefficients of a polynomial of degree
                  7
                </p>
                <table className="mix-grid4">
                  <th>
                    {invMixMatHex[indexMix.i][0]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                  </th>
                  <td>
                    <span>
                      {invMixMatHex[indexMix.i][0].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][0]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][0]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                </table>
                <table className="mix-grid4">
                  <th>{result.states0Hex[n + 5][3][0][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[n + 5][3][0][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[n + 5][3][0][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[n + 5][3][0][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                </table>
                <table className="mix-grid4">
                  <th>
                    {invMixMatHex[indexMix.i][0]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                    *{result.states0Hex[n + 5][3][0][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[n + 5][3][0][indexMix.j],
                      invMixMatHex[indexMix.i][0].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        result.states0[n + 5][3][0][indexMix.j],
                        invMixMatHex[indexMix.i][0].toString(2).padStart(8, "0")
                      )}
                    </span>
                  </td>
                </table>
                <hr />
                <table className="mix-grid4">
                  <th>
                    {invMixMatHex[indexMix.i][1]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                  </th>
                  <td>
                    <span>
                      {invMixMatHex[indexMix.i][1].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][1]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][1]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <th>{result.states0Hex[n + 5][3][1][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[n + 5][3][1][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[n + 5][3][1][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[n + 5][3][1][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <th>
                    {invMixMatHex[indexMix.i][1]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                    *{result.states0Hex[n + 5][3][1][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[n + 5][3][1][indexMix.j],
                      invMixMatHex[indexMix.i][1].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        invMixMatHex[indexMix.i][1]
                          .toString(2)
                          .padStart(8, "0"),
                        result.states0[n + 5][3][1][indexMix.j]
                      )}
                    </span>
                  </td>
                </table>
                <hr />
                <table className="mix-grid4">
                  <th>
                    {invMixMatHex[indexMix.i][2]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                  </th>
                  <td>
                    <span>
                      {invMixMatHex[indexMix.i][2].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][2]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][2]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <th>{result.states0Hex[n + 5][3][2][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[n + 5][3][2][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[n + 5][3][2][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[n + 5][3][2][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>

                  <th>
                    {invMixMatHex[indexMix.i][2]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                    *{result.states0Hex[n + 5][3][2][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[n + 5][3][2][indexMix.j],
                      invMixMatHex[indexMix.i][2].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        invMixMatHex[indexMix.i][2]
                          .toString(2)
                          .padStart(8, "0"),
                        result.states0[n + 5][3][2][indexMix.j]
                      )}
                    </span>
                  </td>
                </table>
                <hr />
                <table className="mix-grid4">
                  <th>
                    {invMixMatHex[indexMix.i][3]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                  </th>
                  <td>
                    <span>
                      {invMixMatHex[indexMix.i][3].toString(2).padStart(8, "0")}
                    </span>
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][3]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {invMixMatHex[indexMix.i][3]
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <th>{result.states0Hex[n + 5][3][3][indexMix.j]}</th>
                  <td>
                    <span>{result.states0[n + 5][3][3][indexMix.j]}</span>
                  </td>
                  <td>
                    {result.states0[n + 5][3][3][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return (
                          <>
                            {e}X<sup>{7 - i}</sup>
                            {i !== 7 ? "+" : null}
                          </>
                        );
                      })}
                  </td>
                  <td>
                    {result.states0[n + 5][3][3][indexMix.j]
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>

                  <th>
                    {invMixMatHex[indexMix.i][3]
                      .toString(16)
                      .padStart(2, "0")
                      .toUpperCase()}
                    *{result.states0Hex[n + 5][3][3][indexMix.j]}
                  </th>
                  <>=</>
                  <td>
                    {galoisMultiply(
                      result.states0[n + 5][3][3][indexMix.j],
                      invMixMatHex[indexMix.i][3].toString(2).padStart(8, "0")
                    )
                      .split("")
                      .map((e, i) => {
                        return e !== "0" && 7 - i > 1 ? (
                          <>
                            +X<sup>{7 - i}</sup>{" "}
                          </>
                        ) : e !== "0" && 7 - i === 1 ? (
                          <>+X </>
                        ) : e !== "0" && 7 - i === 0 ? (
                          <>+1</>
                        ) : null;
                      })}
                  </td>
                  <td>
                    <span>
                      {galoisMultiply(
                        invMixMatHex[indexMix.i][3]
                          .toString(2)
                          .padStart(8, "0"),
                        result.states0[n + 5][3][3][indexMix.j]
                      )}
                    </span>
                  </td>
                </table>
                <p
                  style={{ textAlign: "left", color: "red", fontSize: "12px" }}
                >
                  * if the result of the multiplication contains a term with
                  degree 8 or highe,we need to reduce the result modulo an
                  irreducible polynomial of degree 8,we can replace any term
                  with degree 8 or higher with an equivalent term that has
                  degree less than 8, using the relation x<sup>8</sup> = x
                  <sup>4</sup> + x<sup>3</sup> + x + 1. then we simplify the
                  result by removing any terms that are equivalent modulo this
                  polynomial.
                </p>
                <p style={{ textAlign: "left" }}>Now we XOR The results</p>
                <table>
                  {galoisMultiply(
                    invMixMatHex[indexMix.i][0].toString(2).padStart(8, "0"),
                    result.states0[n + 5][3][0][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <table>
                  {galoisMultiply(
                    invMixMatHex[indexMix.i][1].toString(2).padStart(8, "0"),
                    result.states0[n + 5][3][1][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <table>
                  {galoisMultiply(
                    invMixMatHex[indexMix.i][2].toString(2).padStart(8, "0"),
                    result.states0[n + 5][3][2][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <table>
                  {galoisMultiply(
                    invMixMatHex[indexMix.i][3].toString(2).padStart(8, "0"),
                    result.states0[n + 5][3][3][indexMix.j]
                  )
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <hr />
                <table>
                  {result.states0[n + 5][2][indexMix.i][indexMix.j]
                    .split("")
                    .map((e) => {
                      return <td>{e}</td>;
                    })}
                </table>
                <p style={{ textAlign: "left" }}>
                  and the resultant binary number represent{" "}
                  <span>
                    {result.states0Hex[n + 5][2][indexMix.i][indexMix.j]}
                  </span>
                </p>
              </div>
              <li>
                <strong>InvShiftRows</strong>
              </li>
              <div className="container  flex center">
                <div className="grid3">
                  <State
                    data={result.states0Hex[n + 5][2]}
                    caption="Previous State"
                    index={[1, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <State
                    data={result.states0Hex[n + 5][1]}
                    caption="InvShiftRows"
                    index={[1, 1]}
                  />
                </div>
              </div>
              <li>
                <strong>InvSubBytes</strong>
              </li>
              <div className="container  flex center">
                <div className="grid3">
                  <State
                    data={result.states0Hex[n + 5][1]}
                    caption="Previous State"
                    index={[1, 0]}
                  />
                  <p style={{ margin: "auto 0" }}>&rArr;</p>
                  <State
                    data={result.states0Hex[n + 5][0]}
                    caption="InvSubBytes"
                    index={[1, 1]}
                  />
                </div>
              </div>
            </ul>
            <p>
              These four operations are applied in sequence on the state matrix
              in each intermediate round, except for the final round
            </p>
            <div className="container flex">
              <table>
                <th>i</th>
                <th>
                  State<sub>i-1</sub>
                </th>
                <th>
                  Round Key<sub>{n + 6}-i</sub>
                </th>
                <th>AddRoundKey</th>
                <th>InvMixColumn</th>
                <th>InvShiftRows</th>
                <th>InvSubBytes</th>
                <tbody>
                  {result.states0Hex
                    .slice(1, n + 6)
                    .reverse()
                    .map((e, i) => {
                      return (
                        <tr>
                          <th>{i + 1}</th>
                          {e.reverse().map((ee) => {
                            return ee ? (
                              <td
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <div>
                                  {ee.map((e, i) => {
                                    return (
                                      <tr className="all-rounds">
                                        {e.map((e1, j) => {
                                          return (
                                            <td>
                                              <span>{e1}</span>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                                </div>
                              </td>
                            ) : (
                              <td
                                style={{
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                              ></td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </article>
          <h4 onClick={toggle} className="aes-decrypt-last">
            Rounds {n + 6}
          </h4>
          <article id="aes-decrypt-last">
            <p>In this Round we Add RoundKey0 to the previous State </p>
            <div className="container flex center">
              <div className="grid5">
                <State
                  data={result.states0Hex[0][5]}
                  caption="Previous State"
                  index={[0, 0]}
                />
                <p style={{ margin: "auto 0" }}>&oplus;</p>
                <State
                  data={result.states0Hex[0][4]}
                  caption="RoundKey0"
                  index={[0, 0]}
                />
                <p style={{ margin: "auto 0" }}>&rArr;</p>
                <State
                  data={result.states0Hex[0][0]}
                  caption="PlainText"
                  index={[0, 0]}
                />
              </div>
              <p style={{ textAlign: "left" }}>
                We get the the first block of Decrypted text by converting last
                state to original form
              </p>
              <Block
                data={result.appendedPlaintextHex.slice(0, 16)}
                name="PlainText"
              />
              <hr />
              <p style={{ textAlign: "left" }}>The whole decrypted text is</p>
              <p style={{ textAlign: "left" }}>
                {result.appendedPlaintextHex.map((e) => {
                  return <>{e} </>;
                })}
              </p>
              <p style={{ textAlign: "left" }}>
                As we have used the PKCS#7, hence the last byte of encrypted
                text refer to the number of padded bytes to original plainText
              </p>
              <p style={{ textAlign: "left" }}>
                <strong>{result.appendedPlaintextHex.slice(-1)}</strong> ={" "}
                <span>
                  {parseInt(result.appendedPlaintextHex.slice(-1), 16)}
                </span>
                &rArr; we remove the last{" "}
                {parseInt(result.appendedPlaintextHex.slice(-1), 16)} bytes
              </p>
              <p style={{ textAlign: "left" }}>
                The Plain Text in hexadecimal format is{" "}
                <span>
                  {result.appendedPlaintextHex
                    .slice(
                      0,
                      -parseInt(result.appendedPlaintextHex.slice(-1), 16)
                    )
                    .map((e) => {
                      return <>{e} </>;
                    })}
                </span>
              </p>
              <p style={{ textAlign: "left" }}>
                By converting it from hexadecimal form , to strings using ASCII
                table, the plain text will be
              </p>
              <p style={{ textAlign: "left" }}>
                <span>{data.plainText}</span>
              </p>
            </div>
          </article>
        </article>
      </div>
    </section>
  );
};
export default AES;
