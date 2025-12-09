import { Button, buttonVariants } from "@/components/ui/button";
import { useMemo } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import type { RecordLoaderData } from "@/router/router";
import { useRecord } from "@/hooks";
import type { ProjectMD } from "@/types/mdpositTypes";
import { Spinner } from "@/components/ui/spinner";
import QueryErrorComponent from "@/components/shared/QueryErrorComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getBaseAnalysisId, groupAnalysesByBase } from "../utils";
import type { AnalysisGroup } from "../utils";
import VariantSelect from "./VariantSelect";

const views = {
  OVERVIEW: "overview",
  TRAJECTORY: "trajectory",
  ANALYSES: "analyses",
} as const;

type View = (typeof views)[keyof typeof views];

export type ExperimentReplicaContextValue = {
  parentRecord: RecordLoaderData;
  replicaRecord?: ProjectMD;
  replicaLabel?: string;
  replicaIndex: number;
  replicaNumber?: number;
  replicaInstanceId?: string;
  isReplicaLoading: boolean;
  replicaError?: Error;
  analysisGroups: AnalysisGroup[];
};

const handleReplicaIndexing = (
  mds: string[],
  id: string,
  replicaId: string
) => {
  const decodedReplicaId = decodeURIComponent(replicaId);
  const replicaIndex = mds.findIndex((entry) => entry === decodedReplicaId);
  const replicaNumber = replicaIndex >= 0 ? replicaIndex + 1 : undefined;
  const replicaInstanceId =
    replicaIndex >= 0 ? `${id}.${replicaIndex + 1}` : undefined;

  return { decodedReplicaId, replicaIndex, replicaNumber, replicaInstanceId };
};

const ExperimentReplicaLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  if (!params.id || !params.replicaId) {
    throw new Error("Record ID and replica ID are required here.");
  }

  const { id, replicaId, analysisId } = params;
  const parentRecord = useOutletContext<RecordLoaderData>();

  const { decodedReplicaId, replicaIndex, replicaNumber, replicaInstanceId } =
    handleReplicaIndexing(parentRecord.mds, id, replicaId);

  const {
    data: replicaRecord,
    isPending,
    isError,
    error,
  } = useRecord(replicaInstanceId); // Replica specific record fetch

  const analysisGroups = useMemo(
    () => groupAnalysesByBase(replicaRecord?.analyses),
    [replicaRecord?.analyses]
  );

  const decodedAnalysisId = analysisId
    ? decodeURIComponent(analysisId)
    : undefined;

  const selectedBaseId = decodedAnalysisId
    ? getBaseAnalysisId(decodedAnalysisId)
    : undefined;

  const currentBaseGroup =
    (selectedBaseId &&
      analysisGroups.find((group) => group.baseId === selectedBaseId)) ??
    analysisGroups[0];

  const currentView: View = useMemo(() => {
    if (location.pathname.includes("/trajectory")) return views.TRAJECTORY;
    if (location.pathname.includes("/analyses")) return views.ANALYSES;
    return views.OVERVIEW;
  }, [location.pathname]);

  const showAnalysesSelect =
    currentView === views.ANALYSES && analysisGroups.length > 0;

  const contextValue: ExperimentReplicaContextValue = {
    parentRecord,
    replicaRecord,
    replicaLabel: decodedReplicaId,
    replicaIndex,
    replicaNumber,
    replicaInstanceId,
    isReplicaLoading: isPending,
    replicaError: isError ? (error as Error) : undefined,
    analysisGroups,
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={currentView === views.OVERVIEW ? "default" : "outline"}
            onClick={() => navigate("overview")}
          >
            Overview
          </Button>
          <Button
            variant={currentView === views.TRAJECTORY ? "default" : "outline"}
            onClick={() => navigate("trajectory")}
          >
            Trajectory viewer
          </Button>
          <Button
            variant={currentView === views.ANALYSES ? "default" : "outline"}
            onClick={() => navigate("analyses")}
          >
            Analyses
          </Button>
          {showAnalysesSelect && currentBaseGroup && (
            <>
              <Select
                value={currentBaseGroup.baseId}
                onValueChange={(nextBaseId) => {
                  const targetGroup = analysisGroups.find(
                    (group) => group.baseId === nextBaseId
                  );
                  const targetVariant = targetGroup?.variants[0];
                  if (targetVariant) {
                    navigate(`analyses/${encodeURIComponent(targetVariant)}`);
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-auto justify-between px-6 has-[>svg]:px-6"
                  )}
                >
                  <SelectValue placeholder="Select analysis" />
                </SelectTrigger>
                <SelectContent>
                  {analysisGroups.map((group) => (
                    <SelectItem key={group.baseId} value={group.baseId}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentBaseGroup.hasVariants && (
                <VariantSelect
                  recordId={parentRecord.accession}
                  baseId={currentBaseGroup.baseId}
                  replicaNumber={replicaNumber}
                  variants={currentBaseGroup.variants}
                  value={
                    decodedAnalysisId &&
                    currentBaseGroup.variants.includes(decodedAnalysisId)
                      ? decodedAnalysisId
                      : currentBaseGroup.variants[0]
                  }
                  onChange={(nextVariant) =>
                    navigate(`analyses/${encodeURIComponent(nextVariant)}`)
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 h-full">
        {isPending && (
          <div className="flex gap-2 h-full justify-center items-center text-muted-foreground border border-dashed border-muted-foreground rounded-lg p-4">
            <span>Loading experiment data...</span>
            <Spinner className="w-5 h-5" />
          </div>
        )}
        {isError && <QueryErrorComponent error={error as Error} />}
        {!isPending && !isError && <Outlet context={contextValue} />}
      </div>
    </div>
  );
};

export default ExperimentReplicaLayout;
