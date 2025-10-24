import type { FC } from "react";
import { LineChart } from "@/components/charts";
import type { StatisticalData } from "@/types/mdpositTypes";

type RMSDChartProps = {
  data: {
    start?: number;
    step?: number;
    y?: { rmsd?: StatisticalData };
  };
  xLabel?: string;
  yLabel?: string;
};

const RMSDChart: FC<RMSDChartProps> = ({
  data,
  xLabel = "Frame",
  yLabel = "RMSD (nm)",
}) => {
  const start: number = data.start ?? 0;
  const step: number = data.step ?? 1;
  const ys: StatisticalData | undefined = data.y?.rmsd;
  if (!ys) return null;

  const series = [
    {
      name: "RMSD",
      data: ys.data.map((y: number, i: number) => [
        start + i * step,
        y,
      ]) as Array<[number, number]>,
    },
  ];

  return (
    <div className="h-full flex flex-col min-h-0 gap-2">
      <div className="text-xs text-muted-foreground flex justify-center gap-6">
        <div className="flex items-center gap-3">
          <span className="font-medium text-foreground/80">RMSD</span>
          <span>Avg: {ys.average.toFixed(3)}</span>
          <span>Std: {ys.stddev.toFixed(3)}</span>
          <span>Min: {ys.min.toFixed(3)}</span>
          <span>Max: {ys.max.toFixed(3)}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <LineChart series={series} xLabel={xLabel} yLabel={yLabel} />
      </div>
    </div>
  );
};

export default RMSDChart;
