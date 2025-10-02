import App from "@/App";
import { createBrowserRouter, type RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
];

export const router = createBrowserRouter(routes);
