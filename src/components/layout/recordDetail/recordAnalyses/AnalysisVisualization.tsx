import { useProjectAnalysisData } from "@/hooks";
import { Separator } from "@/components/ui/separator";
import LoadingComponent from "@/components/shared/LoadingComponent";
import QueryErrorComponent from "@/components/shared/QueryErrorComponent";
import type { FC } from "react";
import AnalysisRenderer from "./renderers";

interface AnalysisVisualizationProps {
  projectId: string;
  analysisName: string;
  replica?: number | string;
}

// A lightweight wrapper that:
// - Detects whether the selected analysis is a base that returns options
// - If options exist, renders a selector to pick a concrete variant and syncs it to the URL
// - If it's already a concrete variant, fetches the data (ready for chart rendering)
const AnalysisVisualization: FC<AnalysisVisualizationProps> = ({
  projectId,
  analysisName,
  replica,
}) => {
  console.log("Rendering AnalysisVisualization for:", {
    projectId,
    analysisName,
    replica,
  });

  const {
    data: analysisData,
    isPending: dataPending,
    isError: dataError,
    error,
  } = useProjectAnalysisData(projectId, analysisName, replica);

  return (
    <div className="h-full flex flex-col gap-3">
      {dataPending && <LoadingComponent />}
      {dataError && <QueryErrorComponent error={error} />}
      {analysisData && (
        <div className="h-full min-h-0">
          <AnalysisRenderer analysisName={analysisName} data={analysisData} />
        </div>
      )}

      <Separator />
      <div className="text-xs text-muted-foreground">
        Project: {projectId}
        {replica != null ? ` · Replica: ${String(replica)}` : ""} · Analysis:{" "}
        {analysisName}
      </div>
    </div>
  );
};

export default AnalysisVisualization;
