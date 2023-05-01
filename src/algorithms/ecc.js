// Generate all Curve points + Infinity
const pointsGen = (a, b, p) => {
  [a, b, p] = [Number(a), Number(b), Number(p)];
  let points = [];
  for (let x = 0; x < p; x++) {
    for (let y = 0; y < p; y++) {
      if ((x * x * x + a * x + b - y * y) % p === 0) {
        points.push([x, y]);
      }
    }
  }
  points.push("");
  return points;
};
// Add or Double Points
const addPoints = (P, Q, a, b, p) => {
  [a, b, p] = [Number(a), Number(b), Number(p)];
  P = P[0] === "" ? [null, null] : P;
  Q = Q[0] === "" ? [null, null] : Q;
  let R = [null, null];
  let m;
  // P (Infinity)
  if (P[0] === null && P[1] === null) {
    R = [Q[0], Q[1]];
  }
  // Q (Infinity)
  else if (Q[0] === null && Q[1] === null) {
    R = [P[0], P[1]];
  }
  // P & Q Vertical
  else if (P[0] === Q[0] && P[1] !== Q[1]) {
    R = [null, null];
  }
  // P=Q
  else if (P[0] === Q[0] && P[1] === Q[1]) {
    m = (3 * P[0] * P[0] + a) * modInverse(2 * P[1], p);
    R[0] = (m * m - P[0] - Q[0]) % p;
    R[1] = (m * (Q[0] - R[0]) - Q[1]) % p;
  }
  // P != Q
  else {
    m = (Q[1] - P[1]) * modInverse(Q[0] - P[0], p);
    R[0] = (m * m - P[0] - Q[0]) % p;
    R[1] = (m * (Q[0] - R[0]) - Q[1]) % p;
  }
  if (R[0]) {
    R[0] = R[0] <= 0 ? (R[0] + p) % p : R[0] % p; // if negative add p
    R[1] = R[1] <= 0 ? (R[1] + p) % p : R[1] % p;
  }
  R = isOnCurve(R, a, b, p) ? R : [null, null];
  return { R, m };
};
// Helper Functions
function modInverse(a, m) {
  // validate inputs
  [a, m] = [Number(a), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN; // invalid input
  }
  a = ((a % m) + m) % m;
  if (!a || m < 2) {
    return NaN; // invalid input
  }
  // find the gcd
  const s = [];
  let b = m;
  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }
  if (a !== 1) {
    return NaN; // inverse does not exists
  }
  // find the inverse
  let x = 1;
  let y = 0;
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
  }
  return ((y % m) + m) % m;
}
// Scalat Multiplication
const scalarMultiply = (k, G, a, b, p) => {
  [k, a, b, p] = [Number(k), Number(a), Number(b), Number(p)];
  console.log(k, a, b, p);
  console.log(G);
  const bin = parseInt(k, 10).toString(2);
  let newpoint = G;
  let order = 1;
  const scalarPoints = [];
  scalarPoints[0] = [];
  scalarPoints[0].push("1");
  scalarPoints[0].push("--");
  scalarPoints[0].push(`${order}`);
  scalarPoints[0].push(`${G}`);
  for (let i = 1; i < bin.length; i++) {
    scalarPoints[i] = [];
    if (bin[i] === "0") {
      order = order * 2;
      scalarPoints[i].push(`${bin[i]}`);
      scalarPoints[i].push("Double");
      newpoint = addPoints(newpoint, newpoint, a, b, p).R;
      scalarPoints[i].push(`${order}`);
      scalarPoints[i].push(`${newpoint}`);
    } else {
      order = order * 2 + 1;
      scalarPoints[i].push(`${bin[i]}`);
      scalarPoints[i].push("Double+Add");
      newpoint = addPoints(newpoint, newpoint, a, b, p).R;
      newpoint = addPoints(G, newpoint, a, b, p).R;
      scalarPoints[i].push(`${order}`);
      scalarPoints[i].push(`${newpoint}`);
    }
  }
  return scalarPoints;
};
// check if a point on curve
const isOnCurve = (point, a, b, p) => {
  const x = point[0];
  const y = point[1];
  return (y * y - x * x * x - a * x - b) % p === 0;
};
export { pointsGen, addPoints, scalarMultiply };

scalarMultiply(73, [3, 6], 2, 3, 97);
