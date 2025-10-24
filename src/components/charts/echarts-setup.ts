import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  TitleComponent,
  ToolboxComponent,
} from "echarts/components";
import {
  LineChart,
  BarChart,
  ScatterChart,
  HeatmapChart,
} from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

// Register only the components we need
echarts.use([
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  TitleComponent,
  ToolboxComponent,
  LineChart,
  BarChart,
  ScatterChart,
  HeatmapChart,
  CanvasRenderer,
]);

export type { EChartsOption } from "echarts";
export { echarts };
export default ReactEChartsCore;
