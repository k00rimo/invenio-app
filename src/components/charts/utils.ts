import type { StatisticalData } from "@/types/mdpositTypes";

export type XYPoint = [number, number];

interface TimeSeriesOptions {
  start?: number;
  step?: number;
}

interface DownsampleOptions extends TimeSeriesOptions {
  targetPoints?: number;
}

interface StatSeriesOptions extends DownsampleOptions {
  name: string;
}

export interface StatSeriesResult {
  name: string;
  data: XYPoint[];
  stats: Omit<StatisticalData, "data">;
}

const DEFAULT_TARGET_POINTS = 1200;

function getStride(length: number, targetPoints: number): number {
  if (length <= targetPoints) return 1;
  return Math.ceil(length / targetPoints);
}

function normalizeTimeSeriesParams(
  options: TimeSeriesOptions = {}
): Required<TimeSeriesOptions> {
  const { start = 0, step = 1 } = options;
  const safeStart = Number.isFinite(start) ? start : 0;
  const safeStep = Number.isFinite(step) && step !== 0 ? step : 1;
  return { start: safeStart, step: safeStep };
}

export function buildTimeSeries(
  values: number[],
  options: TimeSeriesOptions = {}
): XYPoint[] {
  const { start, step } = normalizeTimeSeriesParams(options);
  return values.map((y, i) => [start + i * step, y]);
}

export function downsampleSeries(
  values: number[],
  options: DownsampleOptions = {}
): XYPoint[] {
  const targetPoints = options.targetPoints ?? DEFAULT_TARGET_POINTS;
  const { start, step } = normalizeTimeSeriesParams(options);

  if (values.length <= targetPoints) {
    return buildTimeSeries(values, { start, step });
  }

  const stride = getStride(values.length, targetPoints);
  const data: XYPoint[] = [];
  for (let i = 0; i < values.length; i += stride) {
    data.push([start + i * step, values[i]]);
  }
  return data;
}

export function statToSeries(
  stat: StatisticalData | undefined,
  { name, start = 0, step = 1, targetPoints }: StatSeriesOptions
): StatSeriesResult | undefined {
  if (!stat) return undefined;

  const data = targetPoints
    ? downsampleSeries(stat.data, { start, step, targetPoints })
    : buildTimeSeries(stat.data, { start, step });

  const { data: _ignored, ...stats } = stat;

  return {
    name,
    data,
    stats,
  };
}

export function formatStatValue(value: number, digits = 3): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "-";
}
