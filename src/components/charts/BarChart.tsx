import React from "react";
import EChartsBase from "./EChartsBase";
import type { EChartsOption } from "./echarts-setup";

export interface BarSeries {
  name: string;
  data: number[];
}

export interface BarChartProps {
  categories: string[];
  series: BarSeries[]; // allow multiple series for comparisons
  horizontal?: boolean;
  showLegend?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  categories,
  series,
  horizontal = false,
  showLegend = series.length > 1,
}) => {
  const option: EChartsOption = {
    tooltip: { trigger: "axis" },
    legend: showLegend ? {} : undefined,
    grid: { left: 60, right: 20, top: 30, bottom: 40 },
    xAxis: horizontal
      ? { type: "value" }
      : { type: "category", data: categories },
    yAxis: horizontal
      ? { type: "category", data: categories }
      : { type: "value" },
    series: series.map((s) => ({
      name: s.name,
      type: "bar",
      data: s.data,
    })),
  };
  return (
    <EChartsBase option={option} style={{ width: "100%", height: "100%" }} />
  );
};

export default BarChart;
