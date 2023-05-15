import { useState } from "react";
import List from "./List";
import "./aside.css";

const data = [
  {
    title: "Home",
    link: "/rudn-master/home",
  },
  {
    title: "Kuznyechik ",
    link: "/rudn-master/kuz",
  },
  {
    title: "AES",
    link: "/rudn-master/aes",
  },
  {
    title: "ECC",
    link: "/rudn-master/ecc",
  },
  {
    title: "Hybrid Encryption",
    link: "/rudn-master/hybrid",
  },
  {
    title: "UTF-8 Encode",
    link: "/rudn-master/utf8",
  },
  {
    title: "Base64 Encode",
    link: "/rudn-master/base64",
  },
  {
    title: "PKCS#7 Padding Scheme",
    link: "/rudn-master/pkcs7",
  },
];

const Aside = () => {
  const [active, setActive] = useState(Array(data.length).fill(false));
  const handleClick = (i) => {
    setActive(Array(data.length).fill(false));
    let activeList = Array(data.length).fill(false);
    activeList[i] = true;
    setActive(activeList);
  };
  return (
    <aside id="aside">
      <h3>Get Start</h3>
      {data.map((e, i) => {
        return (
          <>
            {i === 4 ? (
              <>
                <List
                  title={e.title}
                  link={e.link}
                  active={active[i]}
                  onClick={() => handleClick(i)}
                />
                <h3>Auxiliary methods</h3>
              </>
            ) : (
              <List
                title={e.title}
                link={e.link}
                active={active[i]}
                onClick={() => handleClick(i)}
                small={i > 4 ? true : false}
              />
            )}
          </>
        );
      })}
    </aside>
  );
};
export default Aside;
