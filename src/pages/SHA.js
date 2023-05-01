import React, { useState } from "react";
import { ec } from "elliptic";
const curve = new ec("secp256k1");
function getPubKeyFromPriKey(priKeyBytes) {
  var key = curve.keyFromPrivate(priKeyBytes, "bytes");
  var pubkey = key.getPublic();
  var x = pubkey.x;
  var y = pubkey.y;
  var xHex = x.toString("hex");
  while (xHex.length < 64) {
    xHex = "0" + xHex;
  }
  var yHex = y.toString("hex");
  while (yHex.length < 64) {
    yHex = "0" + yHex;
  }
  var pubkeyHex = "04" + xHex + yHex;

  return pubkeyHex;
}
const SHA = () => {
  const [privateKey, setPrivateKey] = useState(1);
  const [publicKey, setPublicKey] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const keyPair = curve.keyFromPrivate(privateKey);
    setPublicKey(keyPair.getPublic("hex").toUpperCase());
  };

  const handleChange = (event) => {
    setPrivateKey(event.target.value);
  };
  return (
    <section id="sha">
      <form onSubmit={handleSubmit}>
        <label>
          Private Key:
          <input type="text" value={privateKey} onChange={handleChange} />
        </label>
        <input type="submit" value="Generate Public Key" />
      </form>
      <p>{curve.g.encode("hex")}</p>
      {publicKey && (
        <div>
          <p>Public Key:</p>
          <p>{publicKey}</p>

          <p>
            {curve.g
              .mul(parseInt(987654 * 123456))
              .encode("hex")
              .toUpperCase()}
          </p>
        </div>
      )}
    </section>
  );
};
export default SHA;
