import type { FC } from "react";
import { LineChart, formatStatValue, statToSeries } from "@/components/charts";
import type { FluctuationAnalysis } from "@/types/mdpositTypes";

type FluctuationChartProps = {
  data: FluctuationAnalysis;
};

const FluctuationChart: FC<FluctuationChartProps> = ({ data }) => {
  const start: number = data.start ?? 0;
  const step: number = data.step ?? 1;
  const rmsfSeries = statToSeries(data.y?.rmsf, {
    name: "RMSF",
    start,
    step,
  });

  if (!rmsfSeries) return null;

  return (
    <div className="h-full min-h-0 flex flex-col gap-2">
      <div className="text-xs text-muted-foreground flex justify-center gap-6">
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground/80">RMSF</span>
          <span>Avg: {formatStatValue(rmsfSeries.stats.average)}</span>
          <span>Std: {formatStatValue(rmsfSeries.stats.stddev)}</span>
          <span>Min: {formatStatValue(rmsfSeries.stats.min)}</span>
          <span>Max: {formatStatValue(rmsfSeries.stats.max)}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <LineChart
          series={[{ name: rmsfSeries.name, data: rmsfSeries.data }]}
          xLabel="Residue index"
          yLabel="RMSF (nm)"
          yScale
        />
      </div>
    </div>
  );
};

export default FluctuationChart;
