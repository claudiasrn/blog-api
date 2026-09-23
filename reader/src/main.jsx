import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
	<StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
	</StrictMode>,
);
