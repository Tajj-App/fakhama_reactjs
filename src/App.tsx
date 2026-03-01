import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Tripdetails from "./pages/Tripdetails";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Trips from "./pages/Trips";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "trip-details/:id",
        element: <Tripdetails />,
      },
      {
        path: "trips",
        element: <Trips />,
      },
    ],
  },
]);

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.dir(i18n.language);
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <RouterProvider router={router} />;
}

export default App;
