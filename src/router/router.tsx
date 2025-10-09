import App from "@/App";
import PlaygroundPage from "@/pages/PlaygroundPage";
import RecordPage from "@/pages/RecordPage";
import { createBrowserRouter, type RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: PlaygroundPage,
      },
    ],
  },
  {
    path: "/records/:id",
    Component: RecordPage,
  },
];

export const router = createBrowserRouter(routes);
