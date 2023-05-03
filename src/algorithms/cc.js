// Define the secp256k1 curve parameters
const p = BigInt(
  "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"
);
const a = BigInt("0");
const b = BigInt("7");
const Gx = BigInt(
  "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
);
const Gy = BigInt(
  "0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
);
const n = BigInt(
  "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"
);
// Define a function for modular inverse
function modInverse(a, n) {
  let t = 0n;
  let newt = 1n;
  let r = n;
  let newr = a % n;
  while (newr !== 0n) {
    const quotient = r / newr;
    [t, newt] = [newt, t - quotient * newt];
    [r, newr] = [newr, r - quotient * newr];
  }
  if (r > 1n) {
    throw new Error("a is not invertible");
  }
  if (t < 0n) {
    t += n;
  }
  return t;
}
// Add or Double Points
const addPoints = (P, Q) => {
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
    m = (3n * P[0] * P[0] + a) * modInverse(2n * P[1], p);
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

  //console.log(R[0].toString(16), R[1].toString(16));
  return { R, m };
};
// check if a point on curve
const isOnCurve = (point) => {
  const x = BigInt(point[0]);
  const y = BigInt(point[1]);
  return (y * y - x * x * x - a * x - b) % p === 0;
};
const scalarMultiply = (k) => {
  console.log(k);
  const bin = parseInt(k, 10).toString(2);
  console.log(bin);
  let newpoint = [Gx, Gy];
  for (let i = 1; i < bin.length; i++) {
    if (bin[i] === "0") {
      newpoint = addPoints(newpoint, newpoint).R;
    } else {
      newpoint = addPoints(newpoint, newpoint).R;
      newpoint = addPoints([Gx, Gy], newpoint, a, b, p).R;
    }
  }
  console.log(newpoint[0].toString(16), newpoint[1].toString(16));
  return newpoint;
};
//addPoints([Gx, Gy], [Gx, Gy]);
//scalarMultiply(1000);
