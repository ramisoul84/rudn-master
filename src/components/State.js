const State = ({ data, caption, index, func1, func2 }) => {
  return (
    <table>
      <caption>{caption}</caption>
      {data.map((e, i) => {
        return (
          <tr>
            {e.map((ee, j) => {
              return (
                <td
                  className={func1 ? "pointer" : null}
                  style={
                    i === index[0] && j === index[1]
                      ? { backgroundColor: "lightgreen" }
                      : {}
                  }
                  onClick={
                    func2
                      ? (e) => {
                          func1([i, j]);
                          func2([
                            parseInt(
                              e && e.target.innerText.substring(0, 1),
                              16
                            ),
                            parseInt(
                              e && e.target.innerText.substring(1, 2),
                              16
                            ),
                          ]);
                        }
                      : func1
                      ? () => func1([i, j])
                      : null
                  }
                >
                  <span>{ee}</span>
                </td>
              );
            })}
          </tr>
        );
      })}
    </table>
  );
};
export default State;
