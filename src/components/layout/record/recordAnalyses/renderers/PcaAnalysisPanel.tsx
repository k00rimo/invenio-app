import type { FC } from "react";
import { useMemo, useState } from "react";
import { ScreePlot, Scatter2D } from "@/components/charts";
import type { PCAAnalysis } from "@/types/mdpositTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatStatValue } from "@/components/charts";

type PcaAnalysisPanelProps = {
  data: PCAAnalysis;
};

const PcaAnalysisPanel: FC<PcaAnalysisPanelProps> = ({ data }) => {
  const componentCount = Math.max(
    data.eigenvalues.length,
    data.projections[0]?.length ?? 0
  );
  const axisOptions = useMemo(
    () => Array.from({ length: componentCount }, (_, idx) => idx + 1),
    [componentCount]
  );

  const [xComponent, setXComponent] = useState<number>(1);
  const [yComponent, setYComponent] = useState<number>(
    Math.min(2, componentCount) || 1
  );

  const variancePercents = useMemo(() => {
    const total = data.eigenvalues.reduce((sum, val) => sum + val, 0) || 1;
    return data.eigenvalues.map((val) => (val / total) * 100);
  }, [data.eigenvalues]);

  const scatterPoints = useMemo(
    () =>
      data.projections.map((projection, index) => ({
        x: projection[xComponent - 1] ?? 0,
        y: projection[yComponent - 1] ?? 0,
        c: index,
      })),
    [data.projections, xComponent, yComponent]
  );

  const xLabel = `PC${xComponent} (${formatStatValue(
    variancePercents[xComponent - 1] ?? 0,
    1
  )}%)`;
  const yLabel = `PC${yComponent} (${formatStatValue(
    variancePercents[yComponent - 1] ?? 0,
    1
  )}%)`;

  const hasScatter = componentCount >= 2;

  return (
    <div className="h-full min-h-0 flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="border border-border/60 rounded-lg p-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Explained variance</p>
              <p className="text-xs text-muted-foreground">
                Scree plot of principal component eigenvalues
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Top PC captures {formatStatValue(variancePercents[0] ?? 0, 1)}% of
              the variance
            </p>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ScreePlot eigenvalues={data.eigenvalues} />
          </div>
        </div>

        <div className="border border-border/60 rounded-lg p-4 flex flex-col min-h-0">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">X-axis:</span>
              <Select
                value={String(xComponent)}
                onValueChange={(value) => setXComponent(Number(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {axisOptions.map((option) => (
                    <SelectItem key={`x-${option}`} value={String(option)}>
                      PC {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasScatter && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Y-axis:</span>
                <Select
                  value={String(yComponent)}
                  onValueChange={(value) => setYComponent(Number(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {axisOptions.map((option) => (
                      <SelectItem key={`y-${option}`} value={String(option)}>
                        PC {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[280px]">
            {hasScatter ? (
              <Scatter2D
                points={scatterPoints.map((point) => ({
                  x: point.x,
                  y: point.y,
                  c: point.c,
                }))}
                xLabel={xLabel}
                yLabel={yLabel}
                colorBy="scalar"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm text-center">
                PCA projections need at least two components to show a scatter
                plot.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PcaAnalysisPanel;
