import type { FC } from "react";
import { HeatmapMatrix } from "@/components/charts";

type RMSDPairwiseHeatmapProps = {
  data: {
    start?: number;
    step?: number;
    name?: string;
    rmsds: number[][];
  };
};

const RMSDPairwiseHeatmap: FC<RMSDPairwiseHeatmapProps> = ({ data }) => {
  console.log(data);
  const matrix: number[][] = data.rmsds ?? [];
  const triples: Array<[number, number, number]> = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      triples.push([i, j, matrix[i][j] ?? 0]);
    }
  }
  const n = matrix.length;
  const start = data.start;
  const step = data.step;
  const labels = Array.from({ length: n }, (_, i) =>
    start != null && step != null ? String(start + i * step) : String(i)
  );

  if (n === 0) return null;

  return (
    <HeatmapMatrix
      data={triples}
      xLabels={labels}
      yLabels={labels}
      title="RMSD pairwise"
    />
  );
};

export default RMSDPairwiseHeatmap;
