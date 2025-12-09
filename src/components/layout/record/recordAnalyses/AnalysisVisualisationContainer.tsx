import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import AnalysisVisualization from "./AnalysisVisualization";

type AnalysisVisualisationContainerProps = {
  recordId: string;
  selectedAnalysis?: string;
  replicaNumber?: number;
  selectedVariant?: string;
  hasVariantOptions: boolean;
};

const AnalysisVisualisationContainer = ({
  recordId,
  selectedAnalysis,
  replicaNumber,
  selectedVariant,
  hasVariantOptions,
}: AnalysisVisualisationContainerProps) => {
  const effectiveAnalysisName =
    hasVariantOptions && selectedVariant ? selectedVariant : selectedAnalysis;

  return (
    <Card className="h-full flex flex-col p-4">
      {effectiveAnalysisName ? (
        <AnalysisVisualization
          projectId={recordId}
          analysisName={effectiveAnalysisName}
          replica={replicaNumber}
        />
      ) : (
        <div className="h-full flex items-center justify-center bg-muted rounded-lg aspect-video border-2 border-dashed border-muted-foreground/25">
          <div className="text-center space-y-2">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Select an analysis to view
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AnalysisVisualisationContainer;
