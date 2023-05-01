import { ec } from "elliptic";

// Replace this with your own private key
const privateKey =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

const curve = new ec("secp256k1");
const keyPair = curve.keyFromPrivate(privateKey);

const publicKey = keyPair.getPublic("hex");

console.log("Public key: ", publicKey);
