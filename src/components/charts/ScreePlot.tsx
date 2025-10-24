import React from "react";
import EChartsBase from "./EChartsBase";
import type { EChartsOption } from "./echarts-setup";

export interface ScreePlotProps {
  eigenvalues: number[];
  labelPrefix?: string; // e.g., "PC"
}

const ScreePlot: React.FC<ScreePlotProps> = ({
  eigenvalues,
  labelPrefix = "PC",
}) => {
  const categories = eigenvalues.map((_, i) => `${labelPrefix}${i + 1}`);
  const option: EChartsOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 50, right: 20, top: 20, bottom: 50 },
    xAxis: { type: "category", data: categories },
    yAxis: { type: "value", name: "Eigenvalue" },
    series: [
      {
        type: "bar",
        data: eigenvalues,
      },
    ],
  };
  return (
    <EChartsBase option={option} style={{ width: "100%", height: "100%" }} />
  );
};

export default ScreePlot;
