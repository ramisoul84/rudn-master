const Home = () => {
  return (
    <section id="home">
      <h1>Cryptography</h1>
      <p>
        Cryptography is the practice of converting an original message or data,
        known as plaintext, into an unreadable form, known as ciphertext, to
        protect its confidentiality, integrity, and authenticity.
      </p>
      <h2>types of cryptography</h2>
      <p>Cryptography can be broken down into three different types:</p>
      <ul className="list">
        <li>
          <strong>Secret Key Cryptography:</strong>
          <p>
            Secret Key Cryptography, or symmetric cryptography is a type of
            cryptography that uses the same key for both encryption and
            decryption of the message. The most common symmetric-key
            cryptography algorithm is the Advanced Encryption Standard (AES).
          </p>
        </li>
        <li>
          <strong>Public Key Cryptography:</strong>
          <p>
            Public Key Cryptography, or asymmetric cryptography is a type of
            cryptography that uses two different keys for encryption and
            decryption of the message. The two keys are known as the public key
            and the private key. Examples of public-key cryptography algorithms
            include RSA and Elliptic Curve Cryptography (ECC).
          </p>
        </li>
        <li>
          <strong>Hash Functions:</strong>
          <p>
            Hash Functions are mathematical functions that are used to convert
            data of any size into a fixed-size output known as a hash. Hash
            functions are used to verify the integrity of data and to ensure
            that the original data has not been tampered with. Examples of hash
            functions include SHA-256 and MD5.
          </p>
        </li>
      </ul>
      <h2>Hybrid cryptography</h2>
      <p>
        Hybrid cryptography is a combination of symmetric-key and asymmetric-key
        cryptography.
      </p>
      <p>This hybrid approach involves the following stages:</p>
      <ul className="list">
        <li>
          Use an asymmetric key algorithm <strong>(ECC)</strong> that allows two
          parties to generate a shared secret key over an insecure communication
          channel without actually transmitting the key over the channel.
        </li>
        <li>
          Hashing the shared secret key generated in the first step use{" "}
          <strong>(SHA)</strong> to obtain a fixed-size key.
        </li>
        <li>
          Truncate the derived key to the appropriate length to fit the AES
          version you want to use. For example, for AES-128, use the first 128
          bits (16 bytes) of the key.
        </li>
        <li>
          Use the truncated key as the Encryption key for a symmetric key
          algorithm <strong>(AES)</strong> to encrypt your plaintext.
        </li>
      </ul>
    </section>
  );
};
export default Home;
