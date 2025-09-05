
import { createBrowserRouter } from "react-router-dom";
import React from "react";
import { ApplicationRoutes } from "./routes";
import { DisplayGraphPage } from "./pages/graph/displayGraphPage";

export const router = createBrowserRouter([
    {
        path: ApplicationRoutes.LANDING_PAGE,
        element: <DisplayGraphPage />
    }
]);