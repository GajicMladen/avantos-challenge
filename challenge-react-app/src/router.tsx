
import { createBrowserRouter } from "react-router-dom";
import React from "react";
import { ApplicationRoutes } from "./routes";

export const router = createBrowserRouter([
    {
        path: ApplicationRoutes.LANDING_PAGE,
        element: <>Mladen</>
    }
]);