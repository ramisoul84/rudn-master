/*import { ec } from "elliptic";

// Replace this with your own private key
const privateKey =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const curve = new ec("secp256k1");
const keyPair = curve.keyFromPrivate(privateKey);

const publicKey = keyPair.getPublic("hex");

console.log("Public key: ", publicKey);
function addPoints(p1, p2, a, b, p) {
  let r;
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    // point doubling
    const s = (3 * p1[0] * p1[0] + a) * modInverse(2 * p1[1], p);
    const x3 = (s * s - 2 * p1[0]) % p;
    const y3 = (s * (p1[0] - x3) - p1[1]) % p;
    r = [x3, y3];
  } else {
    // point addition
    const s = (p2[1] - p1[1]) * modInverse(p2[0] - p1[0], p);
    const x3 = (s * s - p1[0] - p2[0]) % p;
    const y3 = (s * (p1[0] - x3) - p1[1]) % p;
    r = [x3, y3];
  }
  return { r, s };
}

function modInverse(a, m) {
  let [m0, x0, x1] = [m, 0, 1];
  if (m === 1) return 1;
  while (a > 1) {
    const q = Math.floor(a / m);
    [a, m] = [m, a % m];
    [x0, x1] = [x1 - q * x0, x0];
  }
  return x1 < 0 ? x1 + m0 : x1;
}

/*

// Define the parameters of the elliptic curve
const a = 0;
const b = 7;
const p = 73;

// Define the two points to add
const P = { x: 47, y: 42 };
const Q = { x: 17, y: 56 };

// Define the point at infinity
const O = { x: null, y: null };

// Check if P = Q
if (P.x === Q.x && P.y === Q.y) {
  // Compute the slope of the tangent at P
  const slope = ((3 * P.x * P.x + a) * modInverse(2 * P.y, p)) % p;

  // Compute the sum of P and Q
  const xR = (slope * slope - P.x - Q.x + p) % p;
  const yR = (-P.y + slope * (P.x - xR) + p) % p;

  // Negate the resulting point to obtain the final sum of P and Q
  const R = { x: xR, y: (-yR + p) % p };
  console.log('P + Q =', R);
} else {
  // Compute the slope of the line connecting P and Q
  const slope = ((Q.y - P.y) * modInverse(Q.x - P.x, p)) % p;

  // Compute the sum of P and Q
  const xR = (slope * slope - P.x - Q.x + p) % p;
  const yR = (-P.y + slope * (P.x - xR) + p) % p;

  // Negate the resulting point to obtain the final sum of P and Q
  const R = { x: xR, y: (-yR + p) % p };
  console.log('P + Q =', R);
}

// Function to compute the modular inverse of a number


*/
// Add two points
/*
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
  const resultPoint = isOnCurve(R, a, b, p) ? R : [null, null];
  return { resultPoint, m };
};
*/
//

//
/*
function addPoints(p1, p2, a, b, p) {
  [a, b, p] = [Number(a), Number(b), Number(p)];
  let resultPoint = [88, 33];
  let s;

  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    // point doubling
    s = (3 * p1[0] * p1[0] + a) * modInverse(2 * p1[1], p);
    const x3 = (s * s - 2 * p1[0]) % p;
    const y3 = (s * (p1[0] - x3) - p1[1]) % p;
    y3 = y3 <= 0 ? p + y3 : y3;
    resultPoint = [x3, 99];
  } else {
    // point addition
    s = (p2[1] - p1[1]) * modInverse(p2[0] - p1[0], p);
    const x3 = (s * s - p1[0] - p2[0]) % p;
    const y3 = (s * (p1[0] - x3) - p1[1]) % p;
    resultPoint = [x3, 100];
  }
  let m = s;

  /*
  if (resultPoint[1] < 0) {
    console.log("we fucked", resultPoint[1]);
    var yR_squared = resultPoint[1] * resultPoint[1];
    var yR_squared_mod_p = yR_squared % p;
    if (yR_squared_mod_p >= p / 2) {
      // Compute the two's complement of yR^2 mod p to obtain (-yR^2) mod p
      resultPoint[1] = p - yR_squared_mod_p;
    } else {
      // Return the negative value of yR^2 mod p as (-yR^2) mod p
      resultPoint[1] = yR_squared_mod_p;
    }
    console.log("re", resultPoint[1]);
  }

  if (resultPoint[1] >= p / 2) {
    var yR_squared = resultPoint[1] * resultPoint[1];
    var yR_squared_mod_p = yR_squared % p;
    if (yR_squared_mod_p >= p / 2) {
      // Compute the two's complement of yR^2 mod p to obtain (-yR^2) mod p
      resultPoint[1] = p - yR_squared_mod_p;
    } else {
      // Return the negative value of yR^2 mod p as (-yR^2) mod p
      resultPoint[1] = yR_squared_mod_p;
    }
  }
 
  //resultPoint = [resultPoint[0], (-resultPoint[1] + p) % p];
  return { resultPoint, m };
}
*/
function scalarMultiply(k, p1, a, b, p) {
  console.log(k);
  const bin = parseInt(k, 10).toString(2);
  console.log(bin);
  console.log(bin.slice(1));
  let newpoint = p1;
  console.log(k, p1);
  for (let i = 1; i < bin.length; i++) {
    console.log(bin[i]);
    if (bin[i] === "0") {
      console.log("start-D", newpoint);
      newpoint = addPoints(newpoint, newpoint, a, b, p).resultPoint;
      console.log("doubled", newpoint);
    } else {
      console.log("start-d-a", newpoint);
      newpoint = addPoints(newpoint, newpoint, a, b, p).resultPoint;
      console.log("wait");
      newpoint = addPoints(p1, newpoint, a, b, p).resultPoint;
      console.log("add+doubled+add", newpoint);
    }

    //console.log(newpoint);
  }
}
/*
function addPoints(p1, p2, a, b, p) {
  let resultPoint;
  let s;
  if (p1[0] === p2[0] && p1[1] === p2[1]) {
    // point doubling
    s = (3 * p1[0] * p1[0] + a) * modInverse(2 * p1[1], p);
    const x3 = (s * s - 2 * p1[0]) % p;
    const y3 = (s * (p1[0] - x3) - p1[1]) % p;
    resultPoint = [x3, y3];
  } else {
    // point addition
    s = (p2[1] - p1[1]) * modInverse(p2[0] - p1[0], p);
    const x3 = (s * s - p1[0] - p2[0]) % p;
    const y3 = (s * (p1[0] - x3) - p1[1]) % p;
    resultPoint = [x3, y3];
  }
  let m = s;
  if (resultPoint[1] < 0) {
    console.log("Negative y-coordinate detected: ", resultPoint[1]);
    const yR_squared = resultPoint[1] * resultPoint[1];
    const yR_squared_mod_p = ((yR_squared % p) + p) % p; // Ensure positive modulus
    const yR_squared_complement = p - yR_squared_mod_p;
    resultPoint[1] = yR_squared_complement;
    console.log("y-coordinate corrected to: ", resultPoint[1]);
  }
  console.log(p1, p2, "=", resultPoint);
  return { resultPoint, m };
}
*/
// check if a point on curve
const isOnCurve = (point, a, b, p) => {
  const x = point[0];
  const y = point[1];
  return (y * y - x * x * x - a * x - b) % p === 0;
};

function modInverse1(a, m) {
  let m0 = m,
    t,
    q;
  let x0 = 0,
    x1 = 1;

  if (m === 1) return 0;

  // Apply extended Euclid algorithm
  while (a > 1) {
    // q is quotient
    q = Math.floor(a / m);

    t = m;

    // m is remainder now, process same as Euclid's algo
    (m = a % m), (a = t);

    t = x0;

    x0 = x1 - q * x0;

    x1 = t;
  }

  // Make x1 positive
  if (x1 < 0) x1 += m0;
  console.log("inv1=", x1);
  return x1;
}

function modInverse(a, m) {
  // validate inputs
  [a, m] = [Number(a), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN; // invalid input
  }
  a = ((a % m) + m) % m;
  console.log(a);
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
  console.log("2=");
  return ((y % m) + m) % m;
}

modInverse1(1, 73);
modInverse(1, 73);
