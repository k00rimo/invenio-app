import { type FC, useState } from "react";
import { HeatmapMatrix } from "@/components/charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RMSDPairwiseAnalysis } from "@/types/mdpositTypes";

type RMSDPairwiseHeatmapProps = {
  data: RMSDPairwiseAnalysis;
};

const RMSDPairwiseHeatmap: FC<RMSDPairwiseHeatmapProps> = ({ data }) => {
  const entries = data.data ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (entries.length === 0) return null;

  const clampedIndex = Math.min(activeIndex, entries.length - 1);
  const activeEntry = entries[clampedIndex];
  const matrix: number[][] = activeEntry?.rmsds ?? [];
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
    <div className="flex h-full flex-col gap-3">
      {entries.length > 1 && (
        <div className="flex justify-end">
          <Select
            value={String(clampedIndex)}
            onValueChange={(value) => {
              const nextIndex = Number.parseInt(value, 10);
              if (!Number.isNaN(nextIndex)) {
                setActiveIndex(nextIndex);
              }
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select interaction" />
            </SelectTrigger>
            <SelectContent>
              {entries.map((entry, idx) => (
                <SelectItem key={`${entry.name}-${idx}`} value={String(idx)}>
                  {entry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="min-h-0 flex-1">
        <HeatmapMatrix
          data={triples}
          xLabels={labels}
          yLabels={labels}
          title={`RMSD pairwise${
            activeEntry?.name ? ` · ${activeEntry.name}` : ""
          }`}
        />
      </div>
    </div>
  );
};

export default RMSDPairwiseHeatmap;
