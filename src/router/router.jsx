import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayOuts from "../layouts/AuthLayOuts";
import Login from "../Pages/Authentaction/Login/Login";
import Register from "../Pages/Authentaction/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from './../routes/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home,
        },
        {
            path: 'coverage',
            Component: Coverage,
            loader: () => fetch('./mapData.json')
        },
        {
            path: '/sendParcel',
            element: <PrivateRoute> <SendParcel></SendParcel> </PrivateRoute>,
            loader: () => fetch('./mapData.json')
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