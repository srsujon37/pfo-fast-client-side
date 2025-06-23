import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayOuts from "../layouts/AuthLayOuts";
import Login from "../Pages/Authentaction/Login/Login";
import Register from "../Pages/Authentaction/Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home,
        },
    ]
  },
  {
    path: '/',
    Component: AuthLayOuts,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      },
    ]
  }
]);