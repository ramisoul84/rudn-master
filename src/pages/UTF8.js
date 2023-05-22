import { useState } from "react";
import { textToUtf8, charToUtf8 } from "../algorithms/auxiliary";
const UTF8 = () => {
  const [data, setData] = useState("");
  const handleChange = (event) => {
    setData(event.target.value);
    const result = document.getElementById("utf8-result");
    result.style.display = "none";
  };
  const handleSubmit = (event) => {
    const result = document.getElementById("utf8-result");
    result.style.display = "block";
    event.preventDefault();
  };
  return (
    <section id="utf8">
      <h1>Unicode Transformation Format 8-bit (UTF-8)</h1>
      <p>
        UTF-8 is a variable-length character encoding standard,which is used to
        encode all 1,112,064 valid known characters into one to four bytes
      </p>
      <h2>How does it work?</h2>
      <ul className="list">
        <li>
          Each cahracters has a code point,which is a specific numerical value
        </li>
        <li>
          Converting the value to binary <span>xxxx...</span>
        </li>
        <li>
          Depending on this value, we determine how many bytes this character
          needs
        </li>
        <table>
          <th>First code point</th>
          <th>Last code point</th>
          <th>Byte 1</th>
          <th>Byte 2</th>
          <th>Byte 3</th>
          <th>Byte 4</th>
          <tbody>
            <tr>
              <td>
                <span>0</span>
              </td>
              <td>
                <span>127</span>
              </td>
              <td>
                0<span>xxxxxxx</span>
              </td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>
                <span>128</span>
              </td>
              <td>
                <span>2047</span>
              </td>
              <td>
                110<span>xxxxx</span>
              </td>
              <td>
                10<span>xxxxxx</span>
              </td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>
                <span>2048</span>
              </td>
              <td>
                <span>65535</span>
              </td>
              <td>
                1110<span>xxxx</span>
              </td>
              <td>
                10<span>xxxxxx</span>
              </td>
              <td>
                10<span>xxxxxx</span>
              </td>
              <td>-</td>
            </tr>
            <tr>
              <td>
                <span>65536</span>
              </td>
              <td>
                <span>1114111</span>
              </td>
              <td>
                11110<span>xxx</span>
              </td>
              <td>
                10<span>xxxxxx</span>
              </td>
              <td>
                10<span>xxxxxx</span>
              </td>
              <td>
                10<span>xxxxxx</span>
              </td>
            </tr>
          </tbody>
          <p>
            the <span>x</span> characters are the bits of the code point
          </p>
        </table>
        <li>
          Padding the Binary format of to fit the number of x need , by adding 0
          to left
        </li>
        <li>then split the binary and replace the x</li>
      </ul>
      <p></p>
      <div className="container">
        <p>The first 128 code points (ASCII) need one byte</p>
        <p>
          The next 1,920 code points need two bytes to encode, which covers the
          remainder of almost all Latin-script alphabets, Greek, Cyrillic,
          Coptic, Armenian,Arabic, Hebrew....
        </p>
      </div>
      <p>Enter a text below to encode it</p>
      <form className="flex" onSubmit={handleSubmit}>
        <label htmlFor="text">Text:</label>
        <textarea
          type="text"
          name="text"
          id="text"
          placeholder={"Enter a text"}
          onChange={handleChange}
        />
        <input type="submit" value="Encode" disabled={data ? false : true} />
      </form>
      <div className="container flex" id="utf8-result">
        {data[0] && <span>{textToUtf8(data).encodedTextHex}</span>}
        {data.split("").map((e, i) => {
          return e && i < 3 ? (
            <>
              {e && <th className=" flex">{e}</th>}
              {e && (
                <ul className="list">
                  <li>
                    Code Point: <span>{e.charCodeAt(0)}</span> &rArr;
                    {e.charCodeAt(0) < 128 ? (
                      <> One byte Takes this format: 0xxxxxxx</>
                    ) : e.charCodeAt(0) < 2048 ? (
                      <> Two bytes Take this format: 110xxxxx 10xxxxxx</>
                    ) : e.charCodeAt(0) < 65536 ? (
                      <>
                        Three bytes Take this format: 1110xxxx 10xxxxxx 10xxxxxx
                      </>
                    ) : (
                      <>
                        Four bytes Take this format: 11110xxx 10xxxxxx 10xxxxxx
                        10xxxxxx
                      </>
                    )}
                  </li>
                  <li>
                    Converting <span>{e.charCodeAt(0)}</span> to Binary &rArr;{" "}
                    <span>{e.charCodeAt(0).toString(2)}</span>
                  </li>
                  <li>
                    Padding to fit the number of x needed
                    {data[0].charCodeAt(0) < 128 ? (
                      <span>
                        {e.charCodeAt(0).toString(2).padStart(7, "0")}
                      </span>
                    ) : e.charCodeAt(0) < 2048 ? (
                      <span>
                        {e.charCodeAt(0).toString(2).padStart(11, "0")}
                      </span>
                    ) : e.charCodeAt(0) < 65536 ? (
                      <span>
                        {e.charCodeAt(0).toString(2).padStart(16, "0")}
                      </span>
                    ) : (
                      <span>
                        {e.charCodeAt(0).toString(2).padStart(21, "0")}
                      </span>
                    )}
                  </li>
                  <li>
                    Forming the Bytes &rArr;{" "}
                    {e.charCodeAt(0) < 128 ? (
                      <>
                        0
                        <span>
                          {e.charCodeAt(0).toString(2).padStart(7, "0")}
                        </span>
                      </>
                    ) : e.charCodeAt(0) < 2048 ? (
                      <>
                        110
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(11, "0")
                            .substring(0, 5)}
                        </span>{" "}
                        10
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(11, "0")
                            .substring(5, 11)}
                        </span>{" "}
                      </>
                    ) : e.charCodeAt(0) < 65536 ? (
                      <>
                        1110
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(16, "0")
                            .substring(0, 4)}
                        </span>{" "}
                        10
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(16, "0")
                            .substring(4, 10)}
                        </span>{" "}
                        10
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(16, "0")
                            .substring(10, 16)}
                        </span>
                      </>
                    ) : (
                      <>
                        11010
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(21, "0")
                            .substring(0, 3)}
                        </span>{" "}
                        10
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(21, "0")
                            .substring(3, 9)}
                        </span>{" "}
                        10
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(21, "0")
                            .substring(9, 15)}
                        </span>
                        10
                        <span>
                          {e
                            .charCodeAt(0)
                            .toString(2)
                            .padStart(21, "0")
                            .substring(15, 21)}
                        </span>{" "}
                      </>
                    )}
                  </li>
                  <li>
                    Converting to Hexadecimal
                    <span>{charToUtf8(e).charHex}</span>
                  </li>
                </ul>
              )}
            </>
          ) : null;
        })}
      </div>
    </section>
  );
};
export default UTF8;
