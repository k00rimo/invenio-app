import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import AnalysisVisualisationContainer from "@/components/layout/record/recordAnalyses/AnalysisVisualisationContainer";
import {
  getBaseAnalysisId,
  hasVariantOptionsForAnalysis,
} from "@/components/layout/record/utils";
import type { ExperimentReplicaContextValue } from "./ExperimentReplicaLayout";

const ExperimentAnalysisDetail = () => {
  const context = useOutletContext<ExperimentReplicaContextValue>();
  const navigate = useNavigate();
  const params = useParams<{
    id: string;
    replicaId: string;
    analysisId: string;
  }>();

  const rawAnalysisId = params.analysisId
    ? decodeURIComponent(params.analysisId)
    : undefined;
  const baseAnalysisId = rawAnalysisId
    ? getBaseAnalysisId(rawAnalysisId)
    : undefined;

  const availableAnalyses = context.replicaRecord?.analyses ?? [];
  const baseGroup = baseAnalysisId
    ? context.analysisGroups.find((group) => group.baseId === baseAnalysisId)
    : undefined;

  useEffect(() => {
    if (!params.id || !params.replicaId || !rawAnalysisId || !baseGroup) return;
    if (!baseGroup.hasVariants) return;
    if (baseGroup.variants.includes(rawAnalysisId)) return;
    const fallback = baseGroup.variants[0];
    if (!fallback) return;
    navigate(
      `/records/${encodeURIComponent(
        params.id
      )}/experiments/${encodeURIComponent(
        params.replicaId
      )}/analyses/${encodeURIComponent(fallback)}`,
      { replace: true }
    );
  }, [baseGroup, navigate, params.id, params.replicaId, rawAnalysisId]);

  if (!rawAnalysisId || !baseAnalysisId || !baseGroup) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 px-4 text-sm text-muted-foreground">
        Select an analysis to view its visualization.
      </div>
    );
  }

  if (baseGroup.hasVariants && !baseGroup.variants.includes(rawAnalysisId)) {
    return null;
  }

  const hasVariantOptions = hasVariantOptionsForAnalysis(
    availableAnalyses,
    rawAnalysisId
  );

  const replicaNumber = context.replicaNumber;

  return (
    <AnalysisVisualisationContainer
      recordId={context.parentRecord.accession}
      selectedAnalysis={baseGroup.baseId}
      replicaNumber={replicaNumber}
      selectedVariant={hasVariantOptions ? rawAnalysisId : undefined}
      hasVariantOptions={hasVariantOptions}
    />
  );
};

export default ExperimentAnalysisDetail;
