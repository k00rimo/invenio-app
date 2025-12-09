import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import RecordsListPage from "@/pages/RecordsListPage";
import RecordPage from "@/pages/RecordPage";
import {
  Navigate,
  createBrowserRouter,
  type LoaderFunctionArgs,
  type RouteObject,
} from "react-router";
import DepositPage from "@/pages/DepositPage";
import DepositSuccessPage from "@/pages/DepositSuccessPage";
import CommunityPage from "@/pages/CommunitiyPage";
import CommunityDetailPage from "@/pages/CommunityDetailPage";
import CommunityFormPage from "@/pages/CommunityFormPage";
import LoginPage from "@/pages/LoginPage";
import { queryClient } from "@/lib/queryClient";
import { getRecordById } from "@/api/projects";
import RecordOverview from "@/components/layout/record/recordOverview/RecordOverview";
import RecordExperiments from "@/components/layout/record/experiments/RecordExperiments";
import ExperimentOverview from "@/components/layout/record/experiments/ExperimentOverview";
import ExperimentTrajectory from "@/components/layout/record/experiments/ExperimentTrajectory";
import ExperimentDefaultRedirect from "@/components/layout/record/experiments/ExperimentDefaultRedirect";
import ExperimentReplicaLayout from "@/components/layout/record/experiments/ExperimentReplicaLayout";
import ExperimentAnalysesRedirect from "@/components/layout/record/experiments/ExperimentAnalysesRedirect";
import ExperimentAnalyses from "@/components/layout/record/experiments/ExperimentAnalyses";
import ExperimentAnalysisDetail from "@/components/layout/record/experiments/ExperimentAnalysisDetail";

export const recordLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params?.id;

  if (!id) {
    throw new Response("Record ID is required", { status: 400 });
  }

  return queryClient.ensureQueryData({
    queryKey: ["record", id],
    queryFn: () => getRecordById(id),
  });
};

export type RecordLoaderData = Awaited<ReturnType<typeof recordLoader>>;

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
        path: "/records/:id",
        loader: recordLoader,
        handle: {
          breadcrumb: (match: { params: { id: string } }) =>
            `Record ${match.params.id}`,
        },
        element: <RecordPage />,
        children: [
          {
            index: true,
            element: <Navigate to="overview" replace />,
          },
          {
            path: "overview",
            handle: {
              breadcrumb: "Overview",
            },
            element: <RecordOverview />,
          },
          {
            path: "experiments",
            handle: { breadcrumb: "Experiments" },
            element: <RecordExperiments />,
            children: [
              {
                index: true,
                element: <ExperimentDefaultRedirect />,
              },
              {
                path: ":replicaId",
                handle: {
                  breadcrumb: (match: { params: { replicaId: string } }) =>
                    match.params.replicaId,
                },
                element: <ExperimentReplicaLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="overview" replace />,
                  },
                  {
                    path: "overview",
                    handle: { breadcrumb: "Overview" },
                    element: <ExperimentOverview />,
                  },
                  {
                    path: "trajectory",
                    handle: { breadcrumb: "Trajectory Viewer" },
                    element: <ExperimentTrajectory />,
                  },
                  {
                    path: "analyses",
                    handle: { breadcrumb: "Analyses" },
                    element: <ExperimentAnalyses />,
                    children: [
                      {
                        index: true,
                        element: <ExperimentAnalysesRedirect />,
                      },
                      {
                        path: ":analysisId",
                        handle: {
                          breadcrumb: (match: {
                            params: { analysisId: string };
                          }) => match.params.analysisId,
                        },
                        element: <ExperimentAnalysisDetail />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
