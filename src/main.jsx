import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./Context/AuthContext/AuthProvider";

AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <section className=" bg-[#eaeced]">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </section>
  </StrictMode>
);
