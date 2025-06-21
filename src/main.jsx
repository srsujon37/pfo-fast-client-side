import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <section className=" bg-[#eaeced]">
      <RouterProvider router={router} />
    </section>
  </StrictMode>
);
