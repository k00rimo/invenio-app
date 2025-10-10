import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import RecordsListPage from "@/pages/RecordsListPage";
import PlaygroundPage from "@/pages/PlaygroundPage";
import RecordPage from "@/pages/RecordPage";

import { createBrowserRouter, type RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/records-list",
        element: <RecordsListPage />,
      },
      {
        path: "/playgorund",
        Component: PlaygroundPage,
      },
      {
        path: "/records/:id",
        Component: RecordPage,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
