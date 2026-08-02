import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";


import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { TourProvider } from "./dashboard/_components/DashboardTour";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TourProvider>
            <App />
          </TourProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
