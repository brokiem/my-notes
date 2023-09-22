import { createBrowserRouter } from "react-router-dom";
import {MainView} from "./views/MainView.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainView />,
    },
]);
