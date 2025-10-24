import type { StatisticalData } from "@/types/mdpositTypes";

// Type guard
// Requires ALL provided keys to be present under `y` and each to have a StatisticalData-like shape (i.e., `.data` is an array).
// Examples:
// - hasStatSeries(obj, "rgyr")
// - hasStatSeries(obj, "rgyr", "rgyrx", "rgyry", "rgyrz") - all must exist
export function hasStatSeries(
  obj: unknown,
  ...keys: string[]
): obj is {
  start?: number;
  step?: number;
  y: Record<string, StatisticalData>;
} {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as { y?: unknown };
  if (!o.y || typeof o.y !== "object") return false;
  const y = o.y as Record<string, unknown>;
  if (keys.length === 0) return false;
  return keys.every((key) => {
    const stat = y[key] as { data?: unknown } | undefined;
    return !!stat && Array.isArray(stat.data);
  });
}

export function isRmsdPairwise(obj: unknown): obj is {
  start?: number;
  step?: number;
  name?: string;
  rmsds: number[][];
} {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as { rmsds?: unknown };
  return (
    Array.isArray(o.rmsds) && o.rmsds.length > 0 && Array.isArray(o.rmsds[0])
  );
}
