import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import AnalysisVisualization from "./AnalysisVisualization";

type AnalysisVisualisationContainerProps = {
  recordId: string;
  selectedAnalysis: string;
  selectedReplica: string;
  selectedVariant?: string;
  hasVariantOptions: boolean;
};

const AnalysisVisualisationContainer = ({
  recordId,
  selectedAnalysis,
  selectedReplica,
  selectedVariant,
  hasVariantOptions,
}: AnalysisVisualisationContainerProps) => {
  return (
    <Card className="grid-rows-2 flex-1 p-4">
      <CardContent className="flex-1 p-0">
        {selectedAnalysis ? (
          <AnalysisVisualization
            projectId={recordId}
            analysisName={
              hasVariantOptions && selectedVariant
                ? selectedVariant
                : selectedAnalysis
            }
            replica={Number(selectedReplica)}
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
      </CardContent>
    </Card>
  );
};

export default AnalysisVisualisationContainer;
