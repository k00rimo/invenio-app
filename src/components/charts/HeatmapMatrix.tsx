import React from "react";
import EChartsBase from "./EChartsBase";
import type { EChartsOption } from "./echarts-setup";

export interface HeatmapMatrixProps {
  // Data as [xIndex, yIndex, value]
  data: Array<[number, number, number]>;
  xLabels?: string[];
  yLabels?: string[];
  title?: string;
  enableFilter?: boolean;
}

const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  data,
  xLabels,
  yLabels,
  title,
  enableFilter = true,
}) => {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 px-4 text-sm text-muted-foreground">
        No heatmap data available.
      </div>
    );
  }

  const values = data.map((d) => d[2]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const option: EChartsOption = {
    title: title ? { text: title } : undefined,
    tooltip: {
      position: "top",
      // Keep tooltip within chart bounds to avoid page overflow
      confine: true,
    },
    grid: { height: "85%", width: "90%", left: "5%", top: "5%" },
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
      min: minValue,
      max: maxValue,
      calculable: enableFilter,
      // Avoid continuous re-render while dragging handles
      realtime: false,
      // Hovering the slider was triggering full heatmap highlights
      hoverLink: false,
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
        progressive: 8000,
        progressiveThreshold: 20000,
        animation: false,
      },
    ],
  };
  return (
    <EChartsBase
      option={option}
      style={{ width: "100%", height: "100%" }}
      opts={{ renderer: "canvas" }}
    />
  );
};

export default HeatmapMatrix;
