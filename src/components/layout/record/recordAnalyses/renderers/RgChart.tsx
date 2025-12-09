import type { FC } from "react";
import {
  LineChart,
  formatStatValue,
  statToSeries,
  type StatSeriesResult,
} from "@/components/charts";
import type { RadiusOfGyrationAnalysis } from "@/types/mdpositTypes";

type RgChartProps = {
  data: RadiusOfGyrationAnalysis;
};

const RgChart: FC<RgChartProps> = ({ data }) => {
  const start: number = data.start ?? 0;
  const step: number = data.step ?? 1;
  const yvals = data.y ?? {};

  const statSeries = [
    statToSeries(yvals.rgyr, { name: "Rg", start, step }),
    statToSeries(yvals.rgyrx, { name: "RgX", start, step }),
    statToSeries(yvals.rgyry, { name: "RgY", start, step }),
    statToSeries(yvals.rgyrz, { name: "RgZ", start, step }),
  ].filter(Boolean) as StatSeriesResult[];

  const series = statSeries.map((entry) => ({
    name: entry.name,
    data: entry.data,
  }));

  const statsList = statSeries.map((entry) => ({
    label: entry.name,
    stats: entry.stats,
  }));

  if (series.length === 0) return null;

  return (
    <div className="h-full flex flex-col min-h-0 gap-2">
      {statsList.length > 0 && (
        <div className="text-xs text-muted-foreground grid justify-items-center items-center grid-cols-2 gap-x-6 gap-y-1">
          {statsList.map(({ label, stats }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-medium text-foreground/80">{label}</span>
              <span>Avg: {formatStatValue(stats.average)}</span>
              <span>Std: {formatStatValue(stats.stddev)}</span>
              <span>Min: {formatStatValue(stats.min)}</span>
              <span>Max: {formatStatValue(stats.max)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex-1 min-h-0">
        <LineChart
          series={series}
          xLabel="Frame"
          yLabel="Rg (nm)"
          // Focus Y-axis on data range (don’t force start at 0)
          yScale
        />
      </div>
    </div>
  );
};

export default RgChart;
