import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./Context/AuthContext/AuthProvider";
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query'

AOS.init();
const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <section className=" bg-[#eaeced]">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </section>
  </StrictMode>
);
