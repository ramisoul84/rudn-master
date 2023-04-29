import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import Error from "./pages/Error";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import AES from "./pages/AES";
import ECC from "./pages/ECC";
import SHA from "./pages/SHA";
import Hybrid from "./pages/Hybrid";
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
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
