import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import Error from "./pages/Error";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Kuz from "./pages/Kuznyechik";
import AES from "./pages/AES";
import ECC from "./pages/ECC";
import SHA from "./pages/SHA";
import Hybrid from "./pages/Hybrid";
import UTF8 from "./pages/UTF8";
import Base64 from "./pages/Base64";
import PKCS7 from "./pages/PKCS7";
const router = createBrowserRouter([
  {
    path: "/rudn-master",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/rudn-master/",
        element: <Intro />,
      },
      {
        path: "/rudn-master/home",
        element: <Home />,
      },
      {
        path: "/rudn-master/kuz",
        element: <Kuz />,
      },
      {
        path: "/rudn-master/aes",
        element: <AES />,
      },
      {
        path: "/rudn-master/ecc",
        element: <ECC />,
      },
      {
        path: "/rudn-master/sha",
        element: <SHA />,
      },
      {
        path: "/rudn-master/hybrid",
        element: <Hybrid />,
      },
      {
        path: "/rudn-master/utf8",
        element: <UTF8 />,
      },
      {
        path: "/rudn-master/base64",
        element: <Base64 />,
      },
      {
        path: "/rudn-master/pkcs7",
        element: <PKCS7 />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
