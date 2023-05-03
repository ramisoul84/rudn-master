var EC = require("elliptic").ec;
var ec = new EC("curve25519");

// Generate keys
var key1 = ec.genKeyPair();
var key2 = ec.genKeyPair();
console.log(ec.g.mul("1").toString());
var shared1 = key1.derive(key2.getPublic());
var shared2 = key2.derive(key1.getPublic());
console.log("Both shared secrets are BN instances");
console.log(shared1.toString(16));
console.log(shared2.toString(16));

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

// Define a function for point addition on the curve
function pointAdd(x1, y1, x2, y2) {
  if (x1 === x2 && y1 === y2) {
    return pointDouble(x1, y1);
  }
  const m = (y2 - y1) * modInverse(x2 - x1, p);
  const x3 = (m * m - x1 - x2) % p;
  const y3 = (m * (x1 - x3) - y1) % p;
  return [x3, y3];
}

// Define a function for point doubling on the curve
function pointDouble(x, y) {
  const m = (3n * x * x + a) * modInverse(2n * y, p);
  const x3 = (m * m - 2n * x) % p;
  const y3 = (m * (x - x3) - y) % p;
  return [x3, y3];
}

// Define a function for scalar multiplication on the curve
function scalarMult(k, x, y) {
  let result = [0n, 0n];
  let addend = [x, y];
  while (k > 0n) {
    if (k & 1n) {
      result = pointAdd(result[0], result[1], addend[0], addend[1]);
    }
    addend = pointDouble(addend[0], addend[1]);
    k >>= 1n;
  }
  return result;
}

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

// Generate a random private key
const privateKey = BigInt("1");

// Get the corresponding public key
const [publicKeyX, publicKeyY] = scalarMult(privateKey, Gx, Gy);

// Define the scalar value k
const k = BigInt("9876543210987654321");

// Perform scalar multiplication on the curve
const [resultX, resultY] = scalarMult(k, publicKeyX, publicKeyY);

console.log(`Private key: ${privateKey}`);
console.log(
  `Public key: (${publicKeyX.toString(16)}, ${publicKeyY.toString(16)})`
);
console.log(`Result point: (${resultX}, ${resultY})`);
