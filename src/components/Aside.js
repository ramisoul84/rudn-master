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
    title: "SHA",
    link: "/rudn-master/sha",
  },
  {
    title: "Hybrid Crypto",
    link: "/rudn-master/hybrid",
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
          <List
            title={e.title}
            link={e.link}
            active={active[i]}
            onClick={() => handleClick(i)}
          />
        );
      })}
    </aside>
  );
};
export default Aside;
