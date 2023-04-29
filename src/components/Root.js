import { Outlet } from "react-router-dom";
import Header from "./Header";
import Aside from "./Aside";
import Footer from "./Footer";
const Root = () => {
  return (
    <>
      <Header />
      <Aside />
      <section id="page">
        <Outlet />
      </section>
      <Footer />
    </>
  );
};
export default Root;
