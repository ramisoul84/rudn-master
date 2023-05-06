const UTF8 = () => {
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
          Depending on this value, we determine how many bytes this character
          needs
        </li>
        <table>
          <tbody>
            <tr>
              <td>0</td>
              <td>127</td>
              <td>One Byte</td>
            </tr>
            <tr>
              <td>128</td>
              <td>53526</td>
              <td>Two Byte</td>
            </tr>
          </tbody>
        </table>
        <li>Converting the value to binary</li>
      </ul>
      <p></p>
      <p>The first 128 code points (ASCII) need one byte</p>
      <p>
        The next 1,920 code points need two bytes to encode, which covers the
        remainder of almost all Latin-script alphabets, and also IPA extensions,
        Greek, Cyrillic, Coptic, Armenian, Hebrew, Arabic, Syriac, Thaana and
        N'Ko alphabets, as well as Combining Diacritical Marks.
      </p>
      <p>
        First we determine how many bytes each character need depending to its
        numerical value{" "}
      </p>
      <ul>
        <li> 0 127 one byte</li>
        <li> 128 50000 Two bytes</li>
        <li> 0 127 one byte</li>
        <li> 0 127 one byte</li>
      </ul>
      <p></p>
      <form>
        <lable>Text</lable>
        <textarea />
      </form>
    </section>
  );
};
export default UTF8;
