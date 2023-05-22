import { useState, useEffect } from "react";
import {
  hexToBase64,
  decToBase64,
  txtToDec,
  binToDec,
} from "../algorithms/auxiliary";
import "./base64.css";
const Base64 = () => {
  const [data, setData] = useState({
    format: "text",
    inputData: "",
  });
  const [res, setRes] = useState(null);
  const [validity, setValidity] = useState("false");
  //
  const handleChange = (event) => {
    const res = document.getElementById("base64-res");
    const { name, value } = event.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    res.style.display = "none";
  };
  //
  const inputValidity = () => {
    const inputData = document.getElementById("inputData");
    const regexHex = /^[0-9A-Fa-f]+$/g;
    const regexBin = /^[0-9A-Fa-f]+$/g;
    let res;
    if (data.format === "hex") {
      res =
        inputData.checkValidity() &&
        regexHex.test(data.inputData) &&
        data.inputData.length % 2 === 0;
    } else if (data.format === "bin") {
      res =
        inputData.checkValidity() &&
        regexBin.test(data.inputData) &&
        data.inputData.length % 8 === 0;
    } else {
      res = inputData.checkValidity();
    }
    setValidity(res);
  };
  // method to check validation of inputs
  const validation = () => {
    const submit = document.getElementById("submit");
    const inputData = document.getElementById("inputData");

    if (validity) {
      submit.disabled = false;
    } else {
      submit.disabled = true;
    }

    inputData.style.backgroundColor = validity ? "#aff5ac" : "#fdc8bf";
  };

  useEffect(inputValidity, [data.format, data.inputData]);
  useEffect(validation, [validity]);
  // Submit Button
  const handleSubmit = (event) => {
    event.preventDefault();
    const res = document.getElementById("base64-res");
    if (data.format === "hex") {
      setRes(hexToBase64(data.inputData));
    } else {
      setRes(
        decToBase64(
          data.format === "bin"
            ? binToDec(data.inputData)
            : txtToDec(data.inputData)
        )
      );
    }
    res.style.display = "block";
  };
  return (
    <section id="base64">
      <h1>Base64</h1>
      <p>
        Base64 converts binary data to a text representation consisting of ASCII
        characters. Here's how the encoding process works:
      </p>
      <ul className="list">
        <li>
          Input binary data is divided into groups of three bytes (24 bits). •
          Each group of three bytes is divided into four 6-bit chunks.
        </li>
        <li>
          The decimal value of each 6-bit chunk is mapped to a specific ASCII
          character using a predefined table.
        </li>
        <li>
          The table usually contains 64 characters, including uppercase letters
          (A-Z), lowercase letters (a-z), numbers (0-9) and two additional
          characters, often '+' and '/'.
        </li>
        <li>
          The four ASCII characters received form a sequence representing the
          encoded data.
        </li>
        <li>
          If the input binary data is not divisible into three equal parts,
          padding is added at the end of the data. The padding character,
          usually '=', indicates the number of bytes added to divide the data by
          three.
        </li>
      </ul>
      <fieldset>
        <legend>Encode</legend>
        <form className="flex" onSubmit={handleSubmit}>
          <div className="base64-encode">
            <div className="input-data">
              <select
                id="format"
                name="format"
                onChange={handleChange}
                required
              >
                <option value="text">Text</option>
                <option value="hex">Hexadecimal</option>
                <option value="bin">Binary</option>
              </select>
              <textarea
                type="inputData"
                name="inputData"
                id="inputData"
                placeholder="Enter a Text"
                onChange={handleChange}
                value={data.inputData}
                required
              />
            </div>
            <input id="submit" type="submit" value="Encode" disabled />
            <fieldset id="base64-res">
              <p className="break">{res}</p>
            </fieldset>
          </div>
        </form>
      </fieldset>
    </section>
  );
};
export default Base64;
