import { useState } from "react";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./ecc.css";
import { pointsGen, addPoints, scalarMultiply } from "../algorithms/ecc";
// Prime numn 3>p>1000
const pNumbers = [
  5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79,
  83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163,
  167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241,
  251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337,
  347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431,
  433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521,
  523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617,
  619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719,
  727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823,
  827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929,
  937, 941, 947, 953, 967, 971, 977, 983, 991, 997,
];
const ECC = () => {
  const [curve, setCurve] = useState({
    a: 0,
    b: 0,
    p: 5,
  });
  const [points, setPoints] = useState([]);
  const [point, setPoint] = useState({
    P: [null, null],
    Q: [null, null],
  });
  const [add, setAdd] = useState({
    m: null,
    R: [null, null],
  });
  const [scalar, setScalar] = useState({
    K: null,
    G: [null, null],
  });

  const handleChange = (e) => {
    const genCurve = document.getElementById("genCurve");
    genCurve.style.display = "none";
    const { value, name } = e.target;
    setCurve((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleChangeAdd = (e) => {
    const genCurve = document.getElementById("add-res");
    genCurve.style.display = "none";
    const { value, name } = e.target;
    setPoint((prev) => {
      return {
        ...prev,
        [name]: value.split(","),
      };
    });
  };
  const handleChangeScalar = (e) => {
    const genCurve = document.getElementById("scalar-res");
    genCurve.style.display = "none";
    const { value, name } = e.target;
    setScalar((prev) => {
      return {
        ...prev,
        [name]: value.split(","),
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const genCurve = document.getElementById("genCurve");
    genCurve.style.display = "block";
    setPoints(pointsGen(curve.a, curve.b, curve.p));
  };
  const handleSubmitAdd = (e) => {
    const genCurve = document.getElementById("add-res");
    genCurve.style.display = "block";
    e.preventDefault();
    const { R, m } = addPoints(point.P, point.Q, curve.a, curve.b, curve.p);
    setAdd((prev) => {
      return {
        ...prev,
        R: R,
        m: m,
      };
    });
  };
  const handleSubmitScalar = (e) => {
    const genCurve = document.getElementById("scalar-res");
    genCurve.style.display = "block";
    e.preventDefault();
    const { R, m } = addPoints(point.P, point.Q, curve.a, curve.b, curve.p);
    setAdd((prev) => {
      return {
        ...prev,
        R: R,
        m: m,
      };
    });
  };
  const toggle = (e) => {
    const el = e.target.className;
    const element = document.getElementById(`${el}`);
    return (element.style.display =
      element.style.display === "block" ? "none" : "block");
  };
  return (
    <section id="ecc">
      <h1>Elliptic Curve Cryptography - ECC</h1>
      <p>
        ECC is a type of public key cryptography that uses the mathematics of
        elliptic curves to provide security for various applications such as
        digital signatures, key exchange, and encryption
      </p>
      <p>
        ECC (Elliptic Curve Cryptography) uses curves that are defined over a
        finite field, which is typically a prime field or a binary field.
      </p>
      <p>
        An elliptic curve <strong>E</strong> over a finite field F is defined as
        the set of all points (x,y) that satisfy the equation:
      </p>
      <p>
        y<sup>2</sup>
        =x
        <sup>3</sup>+<strong>a</strong>x+<strong>b</strong> over 𝔽
        <sub>
          <strong>p</strong>
        </sub>
      </p>
      <ul className="list">
        <li>
          <strong>a</strong> and <strong>b</strong> are constants
        </li>
        <li>
          The prime field modulus <strong>p</strong>: This is the size of the
          finite field over which the curve is defined. The prime field modulus
          is usually a large prime number
        </li>
        <li>
          The base point <stong>G</stong>: This is a fixed point on the curve
          that is used as a generator for scalar multiplication
        </li>
        <li>
          The order of the curve <strong>|E|</strong>: This is the number of
          points on the curve, including the point at infinity.
        </li>
      </ul>

      <h2>ECC Implementation</h2>
      <ul className="list">
        <li>Choose a suitable elliptic curve</li>
        <li>
          Generate a private key: Choose a random number as the private key. The
          private key should be a positive integer that is less than the order
          |E|
        </li>
        <li>
          Compute the public key: Multiply the private key with the base point
          on the curve using scalar multiplication to obtain the public key.
        </li>
      </ul>
      <br />
      <p>
        To understand how does it work, Let's create a simple elliptic curve and
        perform some operations on its points
      </p>
      <form onSubmit={handleSubmit}>
        <div className="ecc-form">
          <label htmlFor="a">a</label>
          <input
            type="number"
            name="a"
            onChange={handleChange}
            value={curve.a}
          />
          <label htmlFor="b">b</label>
          <input
            type="number"
            name="b"
            onChange={handleChange}
            value={curve.b}
          />
          <label>p</label>
          <select name="p" onChange={handleChange} value={curve.p}>
            {pNumbers.map((e) => {
              return <option value={e}>{e}</option>;
            })}
          </select>
        </div>
        <input type="submit" value="Create an elliptic curve" />
      </form>
      <div id="genCurve">
        <div className="container">
          <ul className="list">
            <li>
              The elliptic curve equation: y<sup>2</sup>=x<sup>3</sup>+
              <span>{curve.a}</span>
              x+<span>{curve.b}</span> over 𝔽
              <sub>
                <span>{curve.p}</span>
              </sub>
            </li>
            <li>
              Curve Order |E|= <span>{points.length}</span> (Number of Points in
              this curve)
            </li>
            <li>
              Points:
              <p style={{ fontSize: "0.7rem" }}>
                {points.map((e, i) => {
                  return e !== "" ? (
                    <>
                      ({e[0]},{e[1]})
                    </>
                  ) : (
                    <>,and O (Infinity)</>
                  );
                })}
              </p>
            </li>
          </ul>

          <ResponsiveContainer width="90%" height={500}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" />
              <YAxis type="number" dataKey="y" />
              <Tooltip cursor={{}} />
              <Scatter
                data={points.map((e, i) => {
                  return { x: e[0], y: e[1] };
                })}
                fill="var(--color-dark)"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <h2>Points Operations on an EC over 𝔽p</h2>
        <p>
          Given two points P
          <small>
            (x<sub>1</sub>, y<sub>1</sub>)
          </small>{" "}
          and Q
          <small>
            (x
            <sub>2</sub>, y<sub>2</sub>)
          </small>{" "}
          on an elliptic curve <strong>E</strong> defined by the equation y
          <sup>2</sup>=x<sup>3</sup>+<strong>a</strong>
          x+<strong>b</strong> (mod <strong>p</strong>)
        </p>
        <p>operation is defined as follows:</p>
        <ul className="list">
          <li>
            <h4 onClick={toggle} className="ecc-point-addition">
              Points Addition & Doubling
            </h4>
          </li>
          <article id="ecc-point-addition">
            <p>
              <strong>P ≠ Q</strong> &rArr; R=P+Q is defined as follows:
            </p>
            <ul className="list">
              <li>
                <p>Compute the slope of the line passing through P and Q:</p>
                <p>
                  m = (y<sub>2</sub> - y<sub>1</sub>) / (x<sub>2</sub> - x
                  <sub>1</sub>) (mod p)
                </p>
              </li>
              <li>
                <p>Compute the x-coordinate of the point R:</p>
                <p>
                  x<sub>3</sub> = m<sup>2</sup> - x<sub>1</sub> - x<sub>2</sub>{" "}
                  (mod p)
                </p>
              </li>
              <li>
                <p>Compute the y-coordinate of the point R:</p>
                <p>
                  y<sub>3</sub> = y<sub>1</sub> + m(x<sub>3</sub> - x
                  <sub>1</sub>) (mod p)
                </p>
              </li>
            </ul>
            <p>
              The point R
              <small>
                (x
                <sub>3</sub>, y<sub>3</sub>)
              </small>{" "}
              is the result of P + Q:
            </p>
            <br />
            <p>
              <strong>P = Q</strong> &rArr; R=2P is defined as follows:
            </p>
            <ul className="list">
              <li>
                <p>
                  Compute the slope of the tangent line to the curve at point P:
                </p>
                <p>
                  m=(3x<sub>1</sub>
                  <sup>2</sup>+a)⁄(2y<sub>1</sub>)(mod p)
                </p>
              </li>
              <li>
                <p>Compute the x-coordinate of the point R:</p>
                <p>
                  x<sub>3</sub> = m<sup>2</sup> - 2x<sub>1</sub> (mod p)
                </p>
              </li>
              <li>
                <p>Compute the y-coordinate of the point R:</p>
                <p>
                  y<sub>3</sub> = m(x<sub>1</sub>-x<sub>3</sub>)-y<sub>1</sub>{" "}
                  (mod p)
                </p>
              </li>
            </ul>
            <p>
              The point R
              <small>
                (x
                <sub>3</sub>, y<sub>3</sub>)
              </small>{" "}
              is the result of 2P:
            </p>
            <form onSubmit={handleSubmitAdd}>
              <label>
                P{" "}
                <small>
                  (x<sub>1</sub>, y<sub>1</sub>)
                </small>
              </label>
              <select
                name="P"
                value={point.P}
                onChange={handleChangeAdd}
                required
              >
                <option value={null}>-- Select P --</option>
                {points.map((e) => {
                  return (
                    <option value={e}>
                      {e !== "" ? `(${e[0]}, ${e[1]})` : "O-Infinity"}
                    </option>
                  );
                })}
              </select>
              <label>
                Q{" "}
                <small>
                  (x<sub>2</sub>, y<sub>2</sub>)
                </small>
              </label>
              <select
                name="Q"
                value={point.Q}
                onChange={handleChangeAdd}
                required
              >
                <option value={null}>-- Select Q --</option>
                {points.map((e) => {
                  return (
                    <option value={e}>
                      {e !== "" ? `(${e[0]}, ${e[1]})` : "O-Infinity"}
                    </option>
                  );
                })}
              </select>
              <input
                type="submit"
                value={
                  point.P[0] === point.Q[0] && point.P[1] === point.Q[1]
                    ? "Double"
                    : "Add"
                }
              />
            </form>
            <div className="container" id="add-res">
              <p>
                {point.P[0] === "" ? (
                  <strong>O</strong>
                ) : (
                  <>
                    <strong>P</strong>
                    <small>
                      ({point.P[0]},{point.P[1]})
                    </small>
                  </>
                )}{" "}
                +{" "}
                {point.Q[0] === "" ? (
                  <strong>O</strong>
                ) : (
                  <>
                    <strong>Q</strong>
                    <small>
                      ({point.Q[0]},{point.Q[1]})
                    </small>
                  </>
                )}{" "}
                ={" "}
                {point.P[0] === "" && point.Q[0] === "" ? (
                  <strong>O</strong>
                ) : point.P[0] === "" && point.Q[0] !== "" ? (
                  <>
                    <strong>Q</strong>({add.R[0]},{add.R[1]})
                  </>
                ) : point.P[0] !== "" && point.Q[0] === "" ? (
                  <>
                    <strong>P</strong>({add.R[0]},{add.R[1]})
                  </>
                ) : (
                  <>
                    <strong>R</strong>({add.R[0]},{add.R[1]})
                  </>
                )}
              </p>
            </div>
          </article>

          <li>
            <h4 onClick={toggle} className="ecc-scalar-multi">
              Scalar Multiplication
            </h4>
          </li>
          <article id="ecc-scalar-multi">
            <form onSubmit={handleSubmitScalar}>
              <label>Generator Point G</label>
              <select
                name="G"
                value={scalar.G}
                onChange={handleChangeScalar}
                required
              >
                <option value={null}>-- Select G --</option>
                {points.slice(0, points.length - 1).map((e) => {
                  return (
                    <option value={e}>
                      ({e[0]},{e[1]})
                    </option>
                  );
                })}
              </select>
              <label>K</label>
              <input
                type="number"
                name="K"
                value={scalar.K}
                onChange={handleChangeScalar}
              />
              <input type="submit" value="Multiply" />
            </form>
            <div className="container flex" id="scalar-res">
              <p>
                <strong>{scalar.K}</strong>*
                <strong>
                  ({scalar.G[0]},{scalar.G[1]})
                </strong>
              </p>
              <div>
                <table className="flex">
                  {scalarMultiply(
                    scalar.K,
                    [Number(scalar.G[0]), Number(scalar.G[1])],
                    curve.a,
                    curve.b,
                    curve.p
                  ).map((e) => {
                    return (
                      <tr className="grid4">
                        {e.map((e1) => {
                          return <td>{e1}</td>;
                        })}
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
          </article>
        </ul>
      </div>
      <h1>secp256k1</h1>
    </section>
  );
};
export default ECC;
