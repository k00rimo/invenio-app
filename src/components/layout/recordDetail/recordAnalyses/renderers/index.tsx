import type { FC } from "react";
import { BarChart3 } from "lucide-react";
import RMSDPairwiseHeatmap from "./RMSDPairwiseHeatmap";
import RMSDChart from "./RMSDChart";
import RgChart from "./RgChart";
import type { Analysis, StatisticalData } from "@/types/mdpositTypes";
import { hasStatSeries, isRmsdPairwise } from "./utils";

type AnalysisRendererProps = {
  analysisName: string;
  data: Analysis;
};

const AnalysisRenderer: FC<AnalysisRendererProps> = ({
  analysisName,
  data,
}) => {
  // Pairwise RMSD heatmap
  if (analysisName.startsWith("rmsd-pairwise") || isRmsdPairwise(data)) {
    return (
      <RMSDPairwiseHeatmap
        data={
          data as {
            start?: number;
            step?: number;
            name?: string;
            rmsds: number[][];
          }
        }
      />
    );
  }

  // RMSD timeseries
  if (analysisName.startsWith("rmsd") || hasStatSeries(data, "rmsd")) {
    return (
      <RMSDChart
        data={
          data as {
            start?: number;
            step?: number;
            y?: { rmsd?: StatisticalData };
          }
        }
      />
    );
  }

  // Radius of gyration (multi-line)
  if (
    analysisName.startsWith("rgyr") ||
    hasStatSeries(data, "rgyr", "rgyrx", "rgyry", "rgyrz")
  ) {
    return (
      <RgChart
        data={
          data as {
            start?: number;
            step?: number;
            y?: {
              rgyr?: StatisticalData;
              rgyrx?: StatisticalData;
              rgyry?: StatisticalData;
              rgyrz?: StatisticalData;
            };
          }
        }
      />
    );
  }

  // Fallback placeholder
  return (
    <div className="h-full flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25">
      <div className="text-center space-y-2">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Visualization</p>
        <p className="text-xs text-muted-foreground/75">
          Data loaded for <strong>{analysisName}</strong>, but no renderer is
          implemented yet.
        </p>
      </div>
    </div>
  );
};

export default AnalysisRenderer;
