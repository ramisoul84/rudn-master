import { useState } from "react";
import crypto from "crypto-js";
import "./sha.css";

const SHA = () => {
  const [data, setData] = useState({
    version: "256",
    text: "Welcome to RUDN!",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    const result = document.getElementById("hash-result");
    result.style.display = "none";
  };
  const handleSubmit = (event) => {
    const result = document.getElementById("hash-result");
    result.style.display = "block";
    event.preventDefault();
  };
  return (
    <section id="sha">
      <h1>Secure Hash Algorithm - SHA</h1>
      <p>
        <strong>SHA</strong> a family of cryptographic hash functions published
        by the National Institute of Standards and Technology (NIST)
      </p>
      <p>
        A <strong>Hash Function</strong> is a mathematical function that
        converts an input message of arbitrary length into a fixed-size output,
        called a hash or message digest, in a way that is computationally
        efficient and that provides a unique representation of the input. Hash
        functions are designed to be one-way functions, which means that it is
        easy to compute the hash value from the input, but it is computationally
        infeasible to find the input that corresponds to a given hash value.
      </p>
      <p>
        <strong>SHA-3</strong> (Secure Hash Algorithm 3) is the latest member of
        the Secure Hash Algorithm family of standards, released by NIST in 2015
      </p>
      <form className="flex" onSubmit={handleSubmit}>
        <label htmlFor="version">SHA3-Version:</label>
        <select id="version" name="version" onChange={handleChange} required>
          <option value="224">SHA-224</option>
          <option value="256">SHA-256</option>
          <option value="384">SHA-384</option>
          <option value="512">SHA-512</option>
        </select>

        <label htmlFor="text">Plain Text:</label>
        <textarea
          type="text"
          name="text"
          id="text"
          placeholder={"Enter a text"}
          onChange={handleChange}
        />
        <input type="submit" value="HASH" />
      </form>
      <div className="container" id="hash-result">
        <p>
          Hash Function <strong>SHA{data.version}</strong>
        </p>
        <p>
          <strong>Text: </strong>
          {data.text}
        </p>
        <p className="break">
          <strong>Digest: </strong>
          {data.version === "224"
            ? crypto.SHA224("Hello, world!").toString()
            : data.version === "256"
            ? crypto.SHA256("Hello, world!").toString()
            : data.version === "384"
            ? crypto.SHA384("Hello, world!").toString()
            : crypto.SHA512("Hello, world!").toString()}
        </p>
        <p>
          {/*crypto.AES.encrypt("Welcome to RUDN!000", "moscow2023#rudn*", {
            mode: crypto.mode.ECB,
          }).ciphertext.toString(crypto.enc.Hex)*/}
        </p>
      </div>
    </section>
  );
};
export default SHA;
