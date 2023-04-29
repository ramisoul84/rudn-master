// find all points that ocated on curve
const pointsGen = (a, b, p) => {
  [a, b, p] = [Number(a), Number(b), Number(p)];
  //const prime = p <= 50 ? p : 50;
  let points = [];
  for (let x = 0; x < p; x++) {
    for (let y = 0; y < p; y++) {
      if ((x * x * x + a * x + b - y * y) % p === 0) {
        points.push([x, y]);
      }
    }
  }
  console.log(points[0][0]);
  return points;
};

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
// check if a point on curve
const isOnCurve = (point, a, b, p) => {
  const x = point[0];
  const y = point[1];
  return (y * y - x * x * x - a * x - b) % p === 0;
};
// Add two points
const addPoints = (P, Q, a, b, p) => {
  let R = [null, null];
  let m;
  if (P[0] === null && P[1] === null) {
    R = [Q[0], Q[1]];
  } else if (Q[0] === null && Q[1] === null) {
    R = [P[0], P[1]];
  } else if (P[0] === Q[0] && P[1] !== Q[1]) {
    R = [null, null];
  } else if (P[0] === Q[0] && P[1] === Q[1]) {
    m = (3 * P[0] * P[0] + a) * modInverse(2 * P[1], p);
    R[0] = (m * m - P[0] - Q[0]) % p;
    R[1] = (m * (Q[0] - R[0]) - Q[1]) % p;
  } else {
    m = (Q[1] - P[1]) * modInverse(Q[0] - P[0], p);
    R[0] = (m * m - P[0] - Q[0]) % p;
    R[1] = (m * (Q[0] - R[0]) - Q[1]) % p;
  }
  R[0] = R[0] < 0 ? R[0] + p : R[0]; // if negative add p
  R[1] = R[1] < 0 ? R[1] + p : R[1];
  console.log(R[0]);
  return isOnCurve(R, a, b, p) ? R : [null, null];
};
export { pointsGen, addPoints };

pointsGen(1, 5, 17);
