import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "./components/context/useFilter.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Spinner from "./components/Spinner.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FilterProvider>
          <Suspense fallback={<Spinner />}>
            <App />
            <ToastContainer />
          </Suspense>
        </FilterProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
