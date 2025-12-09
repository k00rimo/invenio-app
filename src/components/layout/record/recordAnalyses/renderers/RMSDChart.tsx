import type { FC } from "react";
import { LineChart, formatStatValue, statToSeries } from "@/components/charts";
import type { RMSDAnalysis } from "@/types/mdpositTypes";

type RMSDChartProps = {
  data: RMSDAnalysis;
  xLabel?: string;
  yLabel?: string;
};

const RMSDChart: FC<RMSDChartProps> = ({
  data,
  xLabel = "Frame",
  yLabel = "RMSD (nm)",
}) => {
  const start = 0;
  const step: number = data.step ?? 1;
  const rmsdSeries = statToSeries(data.y?.rmsd, {
    name: "RMSD",
    start,
    step,
  });

  if (!rmsdSeries) return null;

  const series = [
    {
      name: rmsdSeries.name,
      data: rmsdSeries.data,
    },
  ];

  return (
    <div className="h-full flex flex-col min-h-0 gap-2">
      <div className="text-xs text-muted-foreground flex justify-center gap-6">
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground/80">RMSD</span>
          <span>Avg: {formatStatValue(rmsdSeries.stats.average)}</span>
          <span>Std: {formatStatValue(rmsdSeries.stats.stddev)}</span>
          <span>Min: {formatStatValue(rmsdSeries.stats.min)}</span>
          <span>Max: {formatStatValue(rmsdSeries.stats.max)}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <LineChart series={series} xLabel={xLabel} yLabel={yLabel} />
      </div>
    </div>
  );
};

export default RMSDChart;
