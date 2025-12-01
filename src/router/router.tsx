import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import RecordsListPage from "@/pages/RecordsListPage";
import PlaygroundPage from "@/pages/PlaygroundPage";
import RecordPage from "@/pages/RecordPage";

import { createBrowserRouter, type RouteObject } from "react-router";
import DepositPage from "@/pages/DepositPage";
import DepositSuccessPage from "@/pages/DepositSuccessPage";
import CommunityPage from "@/pages/CommunitiyPage";
import CommunityDetailPage from "@/pages/CommunityDetailPage";
import CommunityFormPage from "@/pages/CommunityFormPage";
import LoginPage from "@/pages/LoginPage";

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
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/records-list",
        element: <RecordsListPage />,
      },
      {
        path: "/deposition",
        element: <DepositPage />,
      },
      {
        path: "/deposition-success",
        element: <DepositSuccessPage />,
      },
      {
        path: "/community",
        children: [
          {
            index: true,
            element: <CommunityPage />,
          },
          {
            path: "new",
            element: <CommunityFormPage />,
          },
          {
            path: ":id/edit",
            element: <CommunityFormPage />,
          },
          {
            path: ":id",
            element: <CommunityDetailPage />,
          },
        ],
      },
      {
        path: "/playgorund",
        Component: PlaygroundPage,
      },
      {
        path: "/records/:id",
        Component: RecordPage,
        children: [
          {
            path: "overview",
            lazy: async () => {
              const { default: RecordOverviewPage } = await import(
                "@/pages/RecordOverviewPage"
              );
              return { Component: RecordOverviewPage };
            },
          },
          {
            path: "analyses",
            lazy: async () => {
              const { default: RecordAnalysesPage } = await import(
                "@/pages/RecordAnalysesPage"
              );
              return { Component: RecordAnalysesPage };
            },
          },
          {
            path: "trajectories",
            lazy: async () => {
              const { default: RecordTrajectoriesPage } = await import(
                "@/pages/RecordTrajectoriesPage"
              );
              return { Component: RecordTrajectoriesPage };
            },
          },
          {
            path: "downloads",
            element: <div>Downloads Page - TODO</div>,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
