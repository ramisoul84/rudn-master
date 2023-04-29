const Block = ({ data, name }) => {
  return (
    data && (
      <table>
        <tr>
          <th style={{ width: "100px" }}>{name}</th>
          {data.map((e, i) => {
            return (
              <td>
                <span>{e}</span>
              </td>
            );
          })}
        </tr>
      </table>
    )
  );
};
export default Block;
