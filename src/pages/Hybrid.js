import React, { useState } from "react";
import { ec } from "elliptic";
import Alice from "../images/Alice.png";
import Bob from "../images/Bob.png";

const Hybrid = () => {
  const [method, setMethod] = useState({
    curve: "secp256k1",
    aes: "aes128",
    mode: "ecb",
  });
  const [usedCurve, setUsedCurve] = useState(new ec("secp256k1"));
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
  };
  /////

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
            <option value="curve25519">curve25519</option>
            <option value="ed25519">ed25519</option>
          </select>
          <label>AES-Version</label>
          <select id="aes" name="aes" onChange={handleChange}>
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
          <h1>{method.curve} Parameters</h1>
          <ul className="list">
            <li>Generator Point (G)</li>
            <p>X: {usedCurve.g.getX().toString().toUpperCase()}</p>
            <p>Y: {usedCurve.g.getY().toString().toUpperCase()}</p>
            <p>G: {usedCurve.g.encode("hex").toUpperCase()}</p>

            <li>Order (n)</li>
            <p>{usedCurve.n.toString(16).toUpperCase()}</p>
          </ul>
        </div>
        <div className="grid2">
          <div className="container profile-grid">
            <div>
              <img src={Alice} alt="Alice" />
              <h1 className="profile">Alice</h1>
            </div>
            <div>
              <form className="flex">
                <label> Alice Private Key: (any number Between 1 and n)</label>
                <input type="number" />
                <input type="submit" value="Generate Alice public key" />
              </form>
              <form className="flex">
                <label>Enter Bob Public Key:</label>
                <input type="number" />
                <input type="submit" value="Generate Shared Key" />
              </form>
            </div>
          </div>
          <div className="container profile-grid ">
            <div>
              <img src={Bob} alt="Bob" />
              <h1 className="profile">Bob</h1>
            </div>
            <div>
              <form className="flex">
                <label> Bob Private Key: (any number Between 1 and n)</label>
                <input type="number" />
                <input type="submit" value="Generate Bob public key" />
              </form>
              <form className="flex">
                <label>Enter Alice Public Key:</label>
                <input type="number" />
                <input type="submit" value="Generate Shared Key" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hybrid;
