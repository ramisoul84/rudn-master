import { useState } from "react";
import "./base64.css";
const Base64 = () => {
  const [data, setData] = useState({
    format: "text",
    inputData: "",
  });
  return (
    <section id="base64">
      <h1>Base64</h1>

      <fieldset>
        <legend>Encode</legend>
        <form className="flex">
          <div className=" base64-encode">
            <div className="input-data">
              <select>
                <option>Text</option>
                <option>Hexadecimal</option>
                <option>Binary</option>
              </select>
              <textarea />
            </div>
            <button disabled>Encode</button>
            <textarea />
          </div>
        </form>
      </fieldset>
    </section>
  );
};
export default Base64;
