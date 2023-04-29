import { GiHamburgerMenu } from "react-icons/gi";
import { VscCloseAll } from "react-icons/vsc";
import { BsGithub } from "react-icons/bs";
import { useState } from "react";
import "./header.css";

const Header = () => {
  const [menuState, setMenuState] = useState(false);
  const handleMenu = () => {
    setMenuState((prev) => !prev);
    const aside = document.getElementById("aside");
    const body = document.getElementById("page");
    aside.style.display = menuState ? "none" : "block";
    body.style.margin = menuState ? "60px 0 80px 0px" : "60px 0 80px 260px";
  };
  return (
    <header>
      {menuState ? (
        <VscCloseAll onClick={handleMenu} className="icon" />
      ) : (
        <GiHamburgerMenu onClick={handleMenu} className="icon" />
      )}

      <h3>HYBRID CRYPTOGRAPHY</h3>
      <BsGithub className="icon right" />
    </header>
  );
};
export default Header;
