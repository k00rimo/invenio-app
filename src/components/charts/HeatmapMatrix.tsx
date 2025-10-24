import React from "react";
import EChartsBase from "./EChartsBase";
import type { EChartsOption } from "./echarts-setup";

export interface HeatmapMatrixProps {
  // Data as [xIndex, yIndex, value]
  data: Array<[number, number, number]>;
  xLabels?: string[];
  yLabels?: string[];
  title?: string;
}

const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  data,
  xLabels,
  yLabels,
  title,
}) => {
  const option: EChartsOption = {
    title: title ? { text: title } : undefined,
    tooltip: { position: "top" },
    grid: { height: "80%", top: "10%" },
    xAxis: {
      type: "category",
      data: xLabels ?? [],
      splitArea: { show: true },
      axisLabel: { show: !!xLabels },
    },
    yAxis: {
      type: "category",
      data: yLabels ?? [],
      splitArea: { show: true },
      axisLabel: { show: !!yLabels },
    },
    visualMap: {
      min: Math.min(...data.map((d) => d[2])),
      max: Math.max(...data.map((d) => d[2])),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 0,
    },
    series: [
      {
        name: "matrix",
        type: "heatmap",
        data,
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0, 0, 0, 0.5)" },
        },
        progressive: 5000,
        animation: false,
      },
    ],
  };
  return (
    <EChartsBase option={option} style={{ width: "100%", height: "100%" }} />
  );
};

export default HeatmapMatrix;
