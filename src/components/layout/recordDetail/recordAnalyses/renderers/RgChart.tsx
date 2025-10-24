import type { FC } from "react";
import { LineChart } from "@/components/charts";
import type { StatisticalData } from "@/types/mdpositTypes";

type RgChartProps = {
  data: {
    start?: number;
    step?: number;
    y?: {
      rgyr?: StatisticalData;
      rgyrx?: StatisticalData;
      rgyry?: StatisticalData;
      rgyrz?: StatisticalData;
    };
  };
};

const RgChart: FC<RgChartProps> = ({ data }) => {
  const start: number = data.start ?? 0;
  const step: number = data.step ?? 1;
  const yvals = (data.y ?? {}) as {
    rgyr?: StatisticalData;
    rgyrx?: StatisticalData;
    rgyry?: StatisticalData;
    rgyrz?: StatisticalData;
  };

  const series = [
    yvals.rgyr && {
      name: "Rg",
      data: yvals.rgyr.data.map((y: number, i: number) => [
        start + i * step,
        y,
      ]) as Array<[number, number]>,
    },
    yvals.rgyrx && {
      name: "RgX",
      data: yvals.rgyrx.data.map((y: number, i: number) => [
        start + i * step,
        y,
      ]) as Array<[number, number]>,
    },
    yvals.rgyry && {
      name: "RgY",
      data: yvals.rgyry.data.map((y: number, i: number) => [
        start + i * step,
        y,
      ]) as Array<[number, number]>,
    },
    yvals.rgyrz && {
      name: "RgZ",
      data: yvals.rgyrz.data.map((y: number, i: number) => [
        start + i * step,
        y,
      ]) as Array<[number, number]>,
    },
  ].filter(Boolean) as { name: string; data: Array<[number, number]> }[];

  const statsList: Array<{
    label: string;
    stats: Omit<StatisticalData, "data">;
  }> = [];
  if (yvals.rgyr) statsList.push({ label: "Rg", stats: yvals.rgyr });
  if (yvals.rgyrx) statsList.push({ label: "RgX", stats: yvals.rgyrx });
  if (yvals.rgyry) statsList.push({ label: "RgY", stats: yvals.rgyry });
  if (yvals.rgyrz) statsList.push({ label: "RgZ", stats: yvals.rgyrz });

  if (series.length === 0) return null;

  return (
    <div className="h-full flex flex-col min-h-0 gap-2">
      {statsList.length > 0 && (
        <div className="text-xs text-muted-foreground grid justify-items-center items-center grid-cols-2 gap-x-6 gap-y-1">
          {statsList.map(({ label, stats }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-medium text-foreground/80">{label}</span>
              <span>Avg: {stats.average.toFixed(3)}</span>
              <span>Std: {stats.stddev.toFixed(3)}</span>
              <span>Min: {stats.min.toFixed(3)}</span>
              <span>Max: {stats.max.toFixed(3)}</span>
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
