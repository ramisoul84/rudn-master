const Word = ({ data, name, index, func1, func2 }) => {
  return (
    data && (
      <table>
        <tr>
          {name && <th style={{ width: "100px" }}>{name}</th>}
          {data.map((e, i) => {
            return (
              <td
                style={i === index ? { backgroundColor: "lightgreen" } : {}}
                className={func1 ? "pointer" : null}
                onClick={
                  func2
                    ? (e) => {
                        func1(i);
                        func2([
                          parseInt(e && e.target.innerText.substring(0, 1), 16),
                          parseInt(e && e.target.innerText.substring(1, 2), 16),
                        ]);
                      }
                    : func1
                    ? () => func1(i)
                    : null
                }
              >
                <span>{e}</span>
              </td>
            );
          })}
        </tr>
      </table>
    )
  );
};
export default Word;
