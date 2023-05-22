import { inverseLinearTransformation } from "../algorithms/kuznyechik";

const InvKuzConst = ({ data, index, colorIndex }) => {
  return (
    <table className="flex">
      <p className="break">
        &bull;
        {inverseLinearTransformation(data)
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
          ({inverseLinearTransformation(data).calc[index][47]})<sub>10</sub>
        </span>
        =
        <span>
          (
          {inverseLinearTransformation(data)
            .calc[index][47].toString(16)
            .padStart(2, "0")}
          )<sub>16</sub>
        </span>
      </p>
      <table>
        <tr>
          {inverseLinearTransformation(data)
            .calc[index].slice(32)
            .map((e, i) => {
              return (
                <td
                  style={
                    i === 15
                      ? { color: "red", fontWeight: "600" }
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
export default InvKuzConst;
