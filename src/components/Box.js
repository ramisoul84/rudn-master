const Box = ({ data, value, caption }) => {
  return (
    <table>
      <caption>{caption}</caption>
      <th>-</th>
      {Array(16)
        .fill(null)
        .map((e, i) => {
          return (
            <th style={i === value[1] ? { backgroundColor: "tomato" } : {}}>
              {i.toString(16).toUpperCase()}
            </th>
          );
        })}
      <tbody>
        {data.map((e, i) => {
          return (
            <tr>
              <th style={i === value[0] ? { backgroundColor: "tomato" } : {}}>
                {i.toString(16).toUpperCase()}
              </th>
              {e.map((e1, i1) => {
                return (
                  <td
                    style={
                      i === value[0] && i1 !== value[1]
                        ? { backgroundColor: "tomato" }
                        : i1 === value[1] && i !== value[0]
                        ? { backgroundColor: "tomato" }
                        : i1 === value[1] && i === value[0]
                        ? { backgroundColor: "lightgreen" }
                        : {}
                    }
                  >
                    {e1.toString(16).padStart(2, "0").toUpperCase()}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default Box;
