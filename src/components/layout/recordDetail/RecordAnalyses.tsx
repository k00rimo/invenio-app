import { useEffect, useState } from "react";
import type { ProjectMD } from "@/types/mdpositTypes";
import { useNavigate, useSearchParams } from "react-router";
import AvailableAnalysesList from "./recordAnalyses/AvailableAnalysesList";
import { useAvailableAnalyses } from "@/hooks";
import ReplicaSelector from "./recordAnalyses/ReplicaSelector";
import { getAnalysisLabel, hasVariantOptionsForAnalysis } from "./utils";
import LoadingComponent from "@/components/shared/LoadingComponent";
import QueryErrorComponent from "@/components/shared/QueryErrorComponent";
import AnalysisVisualisationContainer from "./recordAnalyses/AnalysisVisualisationContainer";
import VariantSelector from "./recordAnalyses/VariantSelector";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface RecordAnalysesProps {
  recordData: ProjectMD;
}

const RecordAnalyses = ({ recordData }: RecordAnalysesProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const replicasCount = recordData.mdcount ?? recordData.mds?.length ?? 1;
  const [selectedReplica, setSelectedReplica] = useState<string>("1");

  const {
    data: availableAnalyses,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useAvailableAnalyses(recordData.accession, selectedReplica);

  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>("");
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();

  useEffect(() => {
    if (isSuccess && availableAnalyses.length > 0)
      setSelectedAnalysis(availableAnalyses[0]);
  }, [isSuccess, availableAnalyses]);

  // Keep replica in bounds and URL in sync
  useEffect(() => {
    if (!isSuccess) return;
    const urlReplica = searchParams.get("replica");
    const parsed = urlReplica ? Number(urlReplica) : NaN;
    const bounded = Number.isFinite(parsed)
      ? Math.min(Math.max(1, parsed), replicasCount)
      : 1;

    // Update local state if needed
    const boundedStr = String(bounded);
    if (selectedReplica !== boundedStr) {
      setSelectedReplica(boundedStr);
    }

    // Reflect bounded value back to URL if needed
    if (urlReplica !== boundedStr) {
      const next = new URLSearchParams(searchParams);
      next.set("replica", boundedStr);
      setSearchParams(next, { replace: true });
    }
  }, [
    isSuccess,
    replicasCount,
    searchParams,
    selectedReplica,
    setSearchParams,
    setSelectedReplica,
  ]);

  // Ensure selected analysis is valid for current list and sync URL
  useEffect(() => {
    if (!isSuccess) return;
    const urlAnalysis = searchParams.get("analysis");
    const hasList = availableAnalyses.length > 0;

    const nextSelection =
      urlAnalysis && hasList && availableAnalyses.includes(urlAnalysis)
        ? urlAnalysis
        : hasList
        ? availableAnalyses[0]
        : null;

    if (selectedAnalysis !== nextSelection) {
      setSelectedAnalysis(nextSelection);
    }

    const currentUrl = searchParams.get("analysis");
    if (nextSelection && currentUrl !== nextSelection) {
      const next = new URLSearchParams(searchParams);
      next.set("analysis", nextSelection);
      setSearchParams(next, { replace: true });
    } else if (!nextSelection && currentUrl) {
      const next = new URLSearchParams(searchParams);
      next.delete("analysis");
      setSearchParams(next, { replace: true });
    }
  }, [
    isSuccess,
    availableAnalyses,
    searchParams,
    selectedAnalysis,
    setSearchParams,
    setSelectedAnalysis,
  ]);

  const handleSelectAnalysis = async (name: string) => {
    setSelectedAnalysis(name);
    const next = new URLSearchParams(searchParams);
    next.set("analysis", name);
    setSearchParams(next, { replace: true });
  };

  const handleReplicaChange = (v: string) => {
    setSelectedReplica(v);
    const next = new URLSearchParams(searchParams);
    next.set("replica", v);
    setSearchParams(next, { replace: true });
  };

  // Determine if selectedAnalysis has variant options in availableAnalyses (e.g., base-00, base-01, ...)
  const hasVariantOptions = isSuccess
    ? hasVariantOptionsForAnalysis(availableAnalyses, selectedAnalysis)
    : false;

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <QueryErrorComponent error={error} />;
  }

  if (isSuccess && availableAnalyses.length === 0) {
    return (
      <div className="text-muted-foreground h-full flex items-center justify-center">
        No analyses available
      </div>
    );
  }

  if (isSuccess && selectedAnalysis) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[clamp(220px,28vw,280px)_minmax(0,1fr)] grid-rows-[auto_1fr] gap-4 p-6 h-full">
        <Button
          variant="secondary"
          size="md"
          className="justify-self-start w-auto"
          onClick={() =>
            navigate(`/records/${recordData.accession}/overview`, {
              replace: true,
            })
          }
        >
          <ChevronLeft />
          Back
        </Button>

        <div className="row-span-2 flex flex-col justify-between gap-4 h-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between py-0.5 min-w-0">
            <h2 className="text-3xl font-semibold">
              {selectedAnalysis
                ? getAnalysisLabel(selectedAnalysis)
                : "Select an analysis"}
            </h2>
            <div className="flex items-center gap-4">
              {hasVariantOptions && (
                <VariantSelector
                  recordId={recordData.accession}
                  selectedAnalysis={selectedAnalysis}
                  selectedReplica={selectedReplica}
                  selectedVariant={selectedVariant}
                  onSelectVariant={setSelectedVariant}
                />
              )}
              <ReplicaSelector
                replicasCount={replicasCount}
                selectedReplica={selectedReplica}
                onSelectReplica={handleReplicaChange}
              />
            </div>
          </div>
          <AnalysisVisualisationContainer
            recordId={recordData.accession}
            selectedAnalysis={
              hasVariantOptions && selectedVariant
                ? selectedVariant
                : selectedAnalysis
            }
            selectedReplica={selectedReplica}
            hasVariantOptions={hasVariantOptions}
          />
        </div>
        <AvailableAnalysesList
          availableAnalyses={availableAnalyses}
          selectedAnalysis={selectedAnalysis}
          onSelectAnalysis={handleSelectAnalysis}
        />
      </div>
    );
  }
};

export default RecordAnalyses;
