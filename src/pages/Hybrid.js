import React, { useState } from "react";
import { ec } from "elliptic";
import Alice from "../images/Alice.png";
import Bob from "../images/Bob.png";
import crypto from "crypto-js";
const Hybrid = () => {
  const [method, setMethod] = useState({
    curve: "secp256k1",
    aes: "aes128",
    mode: "ecb",
  });
  const [usedCurve, setUsedCurve] = useState(new ec("secp256k1"));
  const [alicePrivate, setAlicePrivate] = useState("");
  const [alicePublic, setAlicePublic] = useState("");
  const [aliceShared, setAliceShared] = useState("");
  const [aliceHashed, setAliceHashed] = useState("");
  const [bobPrivate, setBobPrivate] = useState("");
  const [bobPublic, setBobPublic] = useState("");
  const [bobShared, setBobShared] = useState("");
  const [bobHashed, setBobHashed] = useState("");
  const handleChange = (e) => {
    const hybrid = document.getElementById("hybrid-conf");
    hybrid.style.display = "none";
    const { name, value } = e.target;
    setMethod((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUsedCurve(new ec(`${method.curve}`));
    const hybrid = document.getElementById("hybrid-conf");
    hybrid.style.display = "block";
    setAlicePrivate("");
    setAlicePublic("");
    setAliceShared("");
    setAliceHashed("");
    setBobPrivate("");
    setBobPublic("");
    setBobShared("");
    setBobHashed("");
  };
  /////
  const alicePrivateKeyGen = (e) => {
    e.preventDefault();
    const aliceP = usedCurve.genKeyPair().getPrivate();
    const alicePrivateKeyInput = document.getElementById("alice-private-input");
    alicePrivateKeyInput.value = null;
    setAlicePrivate(aliceP);
    setAlicePublic("");
    setAliceShared("");
    setAliceHashed("");
    setBobShared("");
    setBobHashed("");
  };
  const bobPrivateKeyGen = (e) => {
    e.preventDefault();
    const bobP = usedCurve.genKeyPair().getPrivate().toString();
    const bobPrivateKeyInput = document.getElementById("bob-private-input");
    bobPrivateKeyInput.value = null;
    setBobPrivate(bobP);
    setAliceShared("");
    setBobPublic("");
    setBobShared("");
    setAliceHashed("");
    setBobHashed("");
  };
  return (
    <section id="hybrid">
      <fieldset>
        <legend>Choose a Hybrid Cryptography</legend>
        <form className="flex" onSubmit={handleSubmit}>
          <label>Elliptic Curve</label>
          <select id="curve" name="curve" onChange={handleChange}>
            <option value="secp256k1">secp256k1</option>
            <option value="p192">p192</option>
            <option value="p224">p224</option>
            <option value="p256">p256</option>
            <option value="p384">p384</option>
            <option value="p521">p521</option>
          </select>
          <label>Symmetric Encryption</label>
          <select id="aes" name="aes" onChange={handleChange}>
            <option value="kuznyechik">Kuznyechik</option>
            <option value="aes128">AES-128</option>
            <option value="aes192">AES-192</option>
            <option value="aes256">AES-256</option>
          </select>
          <label>Mode</label>
          <select id="mode" name="mode" onChange={handleChange}>
            <option value="ecb">ECB</option>
            <option value="cbc">CBC</option>
          </select>
          <input type="submit" value={"Confirm"} />
        </form>
      </fieldset>
      <div id="hybrid-conf">
        <div className="container">
          <h1 className="center">{method.curve} Parameters</h1>
          <ul className="list">
            <li>
              Generator Point (G) <small>(Hexadecimal)</small>
            </li>
            <p className="break">
              <strong>X-Coordinate</strong>{" "}
              {usedCurve.g.getX().toString(16).toUpperCase()}
            </p>
            <p className="break">
              <strong>Y-Coordinate</strong>{" "}
              {usedCurve.g.getY().toString(16).toUpperCase()}
            </p>
            <p className="break">
              <strong>G:</strong> {usedCurve.g.encode("hex").toUpperCase()}
            </p>
            <li>
              <strong>Order (n)</strong>
            </li>
            <p className="break">{usedCurve.n.toString().toUpperCase()}</p>
          </ul>
        </div>
        <div className="grid2">
          <div className="container flex">
            <div className="profile-grid">
              <div>
                <img src={Alice} alt="Alice" />
                <h1 className="profile">ALICE</h1>
              </div>
              <form className="flex">
                <label>
                  Alice's Private Key: <small>(1 to n-1)</small>
                </label>
                <div className="flex key-gen">
                  <input
                    className="break"
                    id="alice-private-input"
                    type="number"
                    onChange={(e) => {
                      setAlicePrivate(e.target.value);
                      setAlicePublic("");
                      setAliceShared("");
                      setBobShared("");
                      setAliceHashed("");
                      setBobHashed("");
                    }}
                  />
                  <button onClick={alicePrivateKeyGen}>
                    Generate a Private key
                  </button>
                </div>
              </form>
            </div>
            <fieldset>
              <legend>
                Private Key <strong>a</strong>
              </legend>
              <p className="break pad5">{alicePrivate.toString()}</p>
            </fieldset>
            <button
              onClick={() => {
                setAlicePublic(
                  usedCurve
                    .keyFromPrivate(alicePrivate.toString(10))
                    .getPublic("hex")
                    .toUpperCase()
                );
              }}
              disabled={alicePrivate ? false : true}
            >
              Calculate the Public Key <small>(Send it to Bob)</small>
            </button>
            <fieldset>
              <legend>
                Public Key <strong>A</strong>
              </legend>
              <p className="break pad5">
                <strong>A = a * G</strong>
              </p>
              <p className="break pad5">{alicePublic}</p>
            </fieldset>
            <button
              onClick={() =>
                setAliceShared(
                  usedCurve.g
                    .mul(bobPrivate)
                    .mul(alicePrivate)
                    .encode("hex")
                    .toUpperCase()
                )
              }
              disabled={alicePrivate && bobPublic ? false : true}
            >
              Calculate the Shared key
            </button>
            <fieldset>
              <legend>
                Shared Key <strong>S</strong>
              </legend>
              <p className="break pad5">
                <strong>S = a * B</strong>
              </p>
              <p className="break pad5">{aliceShared}</p>
            </fieldset>
            <button
              onClick={() => setAliceHashed(crypto.SHA256(aliceShared))}
              disabled={aliceShared ? false : true}
            >
              Hash the Shared Key <small>(SHA256)</small>
            </button>
            <fieldset>
              <legend>Hashed Key</legend>
              <p className="break pad5">
                {aliceHashed.toString().toUpperCase()}
              </p>
            </fieldset>
            <fieldset>
              <legend>
                Secret Key <small>({method.aes.toUpperCase()})</small>
              </legend>
              <p className="break pad5">
                {aliceHashed
                  .toString()
                  .toUpperCase()
                  .slice(
                    0,
                    method.aes === "aes128"
                      ? 32
                      : method.aes === "aes192"
                      ? 48
                      : 64
                  )}
              </p>
            </fieldset>
            <br />
            <form className="flex">
              <label>Secret Key</label>
              <input type="text" disabled />
              <label>PlainText</label>
              <textarea disabled />
              <button disabled>Encrypt</button>
            </form>
          </div>
          <div className="container flex">
            <div className="profile-grid">
              <div>
                <img src={Bob} alt="Bob" />
                <h1 className="profile">BOB</h1>
              </div>
              <form className="flex">
                <label>
                  BOB's Private Key: <small>(1 to n-1)</small>
                </label>
                <div className="flex key-gen">
                  <input
                    className="break"
                    id="bob-private-input"
                    type="number"
                    onChange={(e) => {
                      setBobPrivate(e.target.value);
                      setAliceShared("");
                      setBobPublic("");
                      setBobShared("");
                      setAliceHashed("");
                      setBobHashed("");
                    }}
                  />
                  <button onClick={bobPrivateKeyGen}>
                    Generate a Private key
                  </button>
                </div>
              </form>
            </div>
            <fieldset>
              <legend>
                Private Key <strong>b</strong>
              </legend>
              <p className="break pad5">{bobPrivate}</p>
            </fieldset>
            <button
              onClick={() => {
                setBobPublic(
                  usedCurve
                    .keyFromPrivate(bobPrivate)
                    .getPublic("hex")
                    .toUpperCase()
                );
              }}
              disabled={bobPrivate ? false : true}
            >
              Calculate the Public Key <small>(send it to Alice)</small>
            </button>
            <fieldset>
              <legend>
                Public Key <strong>B</strong>
              </legend>
              <p className="break pad5">
                <strong>B = b * G</strong>
              </p>
              <p className="break pad5">{bobPublic}</p>
            </fieldset>
            <button
              onClick={() =>
                setBobShared(
                  usedCurve.g
                    .mul(alicePrivate)
                    .mul(bobPrivate)
                    .encode("hex")
                    .toUpperCase()
                )
              }
              disabled={bobPrivate && alicePublic ? false : true}
            >
              Calculate the Shared key
            </button>
            <fieldset>
              <legend>
                Shared Key <strong>S</strong>
              </legend>
              <p className="break pad5">
                <strong>S = b * A</strong>
              </p>
              <p className="break pad5">{bobShared}</p>
            </fieldset>
            <button
              onClick={() => setBobHashed(crypto.SHA256(bobShared))}
              disabled={bobShared ? false : true}
            >
              Hash the Shared Key <small>(SHA256)</small>
            </button>
            <fieldset>
              <legend>Hashed Key</legend>
              <p className="break pad5">{bobHashed.toString().toUpperCase()}</p>
            </fieldset>
            <fieldset>
              <legend>
                Secret Key <small>({method.aes.toUpperCase()})</small>
              </legend>
              <p className="break pad5">
                {bobHashed
                  .toString()
                  .toUpperCase()
                  .slice(
                    0,
                    method.aes === "aes128"
                      ? 32
                      : method.aes === "aes192"
                      ? 48
                      : 64
                  )}
              </p>
            </fieldset>
            <br />
            <form className="flex">
              <label>Secret Key</label>
              <input type="text" disabled />
              <label>CipherText</label>
              <textarea disabled />
              <button disabled>Decrypt</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hybrid;
