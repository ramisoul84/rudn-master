import React, { useState } from "react";
import { ec } from "elliptic";

const curve = new ec("secp256k1");
const Hybrid = () => {
  const [alicePrivate, setAlicePrivate] = useState(null);
  const [bobPrivate, setBobPrivate] = useState(null);
  const [alicePublic, setAlicePublic] = useState(null);
  const [bobPublic, setBobPublic] = useState(null);
  const handleMultiply = () => {
    const G = curve.g;
    setAlicePublic(G.mul(parseInt(alicePrivate)).encode("hex").toUpperCase());
    setBobPublic(G.mul(parseInt(bobPrivate)).encode("hex").toUpperCase());
  };
  return (
    <section id="hybrid">
      <div className="flex">
        <label htmlFor="curve">Choose a Curve:</label>
        <select id="curve" name="version" required>
          <option value="128">secp256k1 </option>
        </select>
        <div className="container">
          <h3 className="center">Curve Parameters</h3>
          <ul className="list">
            <li>
              <strong>G(x,y)</strong> - Generator Point
            </li>
            <ul className="list">
              <li>
                <strong>x</strong>: {curve.g.getX().toString(16).toUpperCase()}
              </li>
              <li>
                <strong>y</strong>: {curve.g.getY().toString(16).toUpperCase()}
              </li>
            </ul>
            <li>
              <strong>n</strong> : {curve.n.toString().toUpperCase()}
            </li>
          </ul>
        </div>
      </div>
      <div className="hybrid-main">
        <div className="container flex">
          <h3 className="center">Alice</h3>
          <label>
            Alice choose a Private key <strong>a</strong> : (any number Between
            1 and n)
          </label>
          <input
            type="text"
            value={alicePrivate}
            onChange={(e) => setAlicePrivate(e.target.value)}
          />
          <p>
            Alice calculate her Public key <strong>A</strong> = a * G
          </p>
        </div>
        <div className="container flex">
          <h3 className="center">Bob</h3>
          <label>
            Bob choose a Private key <strong>b</strong> : (any number Between 1
            and n)
          </label>
          <input
            type="text"
            value={bobPrivate}
            onChange={(e) => setBobPrivate(e.target.value)}
          />
          <p>
            Bob calculate his Public key <strong>B</strong> = b * G
          </p>
        </div>
      </div>
      <div className="flex">
        <button onClick={handleMultiply}>Multiply by G</button>
      </div>

      <div className="container flex">
        <ul className="list">
          <li>
            Alice's Private Key <strong>a</strong> = <span>{alicePrivate}</span>
          </li>
          <li>
            <p>
              Alice's Public Key <strong>A</strong> =
            </p>
            <p>
              <span>{alicePublic}</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="container flex">
        <ul className="list">
          <li>
            Bob's Private Key <strong>b</strong> = <span>{bobPrivate}</span>
          </li>
          <li>
            <p>
              Bob's Public Key <strong>B</strong> =
            </p>
            <span>{bobPublic}</span>
          </li>
        </ul>
      </div>

      <p>Now both Alice and Bob exchange their Public keys</p>
    </section>
  );
};
export default Hybrid;
