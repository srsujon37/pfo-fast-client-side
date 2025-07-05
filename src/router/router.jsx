import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayOuts from "../layouts/AuthLayOuts";
import Login from "../Pages/Authentaction/Login/Login";
import Register from "../Pages/Authentaction/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from "./../routes/PrivateRoute";
import DashBoardLayout from "../layouts/DashBoardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../Pages/Dashboard/Pending Riders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/Active Riders/activeRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "./AdminRoute";

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
        path: "coverage",
        Component: Coverage,
        loader: () => fetch("./mapData.json"),
      },
      {
        path: "forbidden",
        Component: Forbidden
      },
      {
        path: "beARider",
        element: <PrivateRoute> <BeARider></BeARider> </PrivateRoute>,
        loader: () => fetch("./mapData.json"),
      },
      {
        path: "/sendParcel",
        element: (
          <PrivateRoute>
            {" "}
            <SendParcel></SendParcel>{" "}
          </PrivateRoute>
        ),
        loader: () => fetch("./mapData.json"),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayOuts,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute>
      <DashBoardLayout></DashBoardLayout>
    </PrivateRoute>,
    children:[
      {
        path: 'myParcels',
        Component: MyParcels,
      },
      {
        path: 'payment/:parcelId',
        Component: Payment
      },
      {
        path: 'paymentHistory',
        Component: PaymentHistory
      },
      {
        path: 'track',
        Component: TrackParcel
      },
      {
        path: 'pendingRiders',
        // Component: PendingRiders
        element: <AdminRoute> <PendingRiders></PendingRiders></AdminRoute>
      },
      {
        path: 'activeRiders',
        // Component: ActiveRiders
         element: <AdminRoute> <ActiveRiders></ActiveRiders></AdminRoute>
      },
      {
        path: 'makeAdmin',
        element: <AdminRoute> <MakeAdmin></MakeAdmin></AdminRoute>
      },
    ]
  },
]);
