import {
  linearTransformation,
  galoisMultiplication,
} from "../algorithms/kuznyechik";

const Ploynomial = ({ data }) => {
  const res = linearTransformation(data).calc[15];
  return (
    <div className="flex">
      <ul className="list">
        {Array(16)
          .fill(null)
          .map((e, i) => {
            return (
              <li className="break">
                {res[2 * i]}*{res[2 * i + 1]}=
                {res[2 * i].toString(2).padStart(8, "0")}*
                {res[2 * i + 1].toString(2).padStart(8, "0")}= (
                {res[2 * i] !== 0 ? (
                  res[2 * i]
                    .toString(2)
                    .padStart(8, "0")
                    .split("")
                    .map((e, i) => {
                      return e !== "0" && 7 - i > 1 ? (
                        <>
                          +X<sup>{7 - i}</sup>{" "}
                        </>
                      ) : e !== "0" && 7 - i === 1 ? (
                        <>+X </>
                      ) : e !== "0" && 7 - i === 0 ? (
                        <>+1</>
                      ) : null;
                    })
                ) : (
                  <>0</>
                )}
                )* (
                {res[2 * i + 1] !== 0 ? (
                  res[2 * i + 1]
                    .toString(2)
                    .padStart(8, "0")
                    .split("")
                    .map((e, i) => {
                      return e !== "0" && 7 - i > 1 ? (
                        <>
                          +X<sup>{7 - i}</sup>{" "}
                        </>
                      ) : e !== "0" && 7 - i === 1 ? (
                        <>+X </>
                      ) : e !== "0" && 7 - i === 0 ? (
                        <>+1</>
                      ) : null;
                    })
                ) : (
                  <>0</>
                )}
                )=
                {galoisMultiplication(res[2 * i], res[2 * i + 1]).dec !== 0 ? (
                  galoisMultiplication(res[2 * i], res[2 * i + 1])
                    .bin.split("")
                    .map((e, i) => {
                      return e !== "0" && 7 - i > 1 ? (
                        <>
                          +X<sup>{7 - i}</sup>{" "}
                        </>
                      ) : e !== "0" && 7 - i === 1 ? (
                        <>+X </>
                      ) : e !== "0" && 7 - i === 0 ? (
                        <>+1</>
                      ) : null;
                    })
                ) : (
                  <>0</>
                )}
                ={galoisMultiplication(res[2 * i], res[2 * i + 1]).bin}
              </li>
            );
          })}
      </ul>
      <p>Then we XOR the results of multiplication</p>
      <table>
        <tbody>
          {Array(16)
            .fill(null)
            .map((e, i) => {
              return (
                <tr>
                  {galoisMultiplication(res[2 * i], res[2 * i + 1])
                    .bin.split("")
                    .map((ee) => {
                      return <td>{ee}</td>;
                    })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <br />
      <table>
        <tr>
          {linearTransformation(data)
            .calc[15][32].toString(2)
            .padStart(8, "0")
            .split("")
            .map((e) => {
              return <td>{e}</td>;
            })}
        </tr>
      </table>
      <p>
        {" "}
        &rArr; (
        {linearTransformation(data).calc[15][32].toString(2).padStart(8, "0")})
        <sub>2</sub> = (
        <span>
          {" "}
          {linearTransformation(data)
            .calc[15][32].toString(16)
            .padStart(2, "0")}
        </span>
        )<sub>16</sub>
      </p>
    </div>
  );
};
export default Ploynomial;
