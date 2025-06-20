import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <section className="max-w-7xl mx-auto">
      <RouterProvider router={router} />
    </section>
  </StrictMode>
);
