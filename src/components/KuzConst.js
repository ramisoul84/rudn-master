import { linearTransformation } from "../algorithms/kuzz";

const KuzConst = ({ data, index, colorIndex }) => {
  return (
    <table className="flex">
      <p className="break">
        &bull;
        {linearTransformation(data)
          .calc[index].slice(0, 32)
          .map((e, i) => {
            return i % 2 === 0 ? (
              <>{e}*</>
            ) : i !== 31 ? (
              <>{e}&oplus;</>
            ) : (
              <>{e}=</>
            );
          })}
        <span>
          ({linearTransformation(data).calc[index][32]})<sub>10</sub>
        </span>
        =
        <span>
          (
          {linearTransformation(data)
            .calc[index][32].toString(16)
            .padStart(2, "0")}
          )<sub>16</sub>
        </span>
      </p>
      <table>
        <tr>
          {linearTransformation(data)
            .calc[index].slice(32)
            .map((e, i) => {
              return (
                <td
                  style={
                    i === 0
                      ? { color: "red" }
                      : i === colorIndex
                      ? { backgroundColor: "lightgreen" }
                      : null
                  }
                >
                  {e.toString(16).padStart(2, "0")}
                </td>
              );
            })}
        </tr>
      </table>
    </table>
  );
};
export default KuzConst;
