import { type FC, useMemo } from "react";
import { LineChart } from "@/components/charts";
import type { LineSeries } from "@/components/charts/LineChart";
import type { ThicknessAnalysis } from "@/types/mdpositTypes";

const sanitizeNumericArray = (values: unknown): number[] => {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) =>
      typeof value === "number" && Number.isFinite(value) ? value : null
    )
    .filter((value): value is number => value !== null);
};

const buildSeries = (
  label: string,
  frames: number[],
  values: number[]
): LineSeries | undefined => {
  if (!frames.length || !values.length) return undefined;
  const limit = Math.min(frames.length, values.length);
  const data: Array<[number, number]> = [];
  for (let i = 0; i < limit; i += 1) {
    const x = frames[i];
    const y = values[i];
    if (Number.isFinite(x) && Number.isFinite(y)) {
      data.push([x, y]);
    }
  }
  return data.length ? { name: label, data } : undefined;
};

const computeStats = (values: number[]) => {
  if (!values.length) return undefined;
  const filtered = values.filter((value) => Number.isFinite(value));
  if (!filtered.length) return undefined;
  const sum = filtered.reduce((acc, value) => acc + value, 0);
  return {
    average: sum / filtered.length,
    min: Math.min(...filtered),
    max: Math.max(...filtered),
  };
};

const average = (values: number[]) => {
  if (!values.length) return undefined;
  const filtered = values.filter((value) => Number.isFinite(value));
  if (!filtered.length) return undefined;
  const sum = filtered.reduce((acc, value) => acc + value, 0);
  return sum / filtered.length;
};

const formatStat = (value?: number, precision = 2) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(precision)
    : "—";

const ThicknessAnalysisPanel: FC<{ data: ThicknessAnalysis }> = ({ data }) => {
  const dataset = data?.data;
  const rawFrames = Array.isArray(dataset?.frame) ? dataset?.frame : [];
  const thicknessValues = useMemo(
    () => sanitizeNumericArray(dataset?.thickness),
    [dataset?.thickness]
  );

  const fallbackLength = thicknessValues.length;
  const frameStep =
    typeof data?.step === "number" && Number.isFinite(data.step) && data.step
      ? data.step
      : 1;

  const frames = useMemo(() => {
    if (rawFrames.length) {
      return rawFrames.map((value, index) =>
        typeof value === "number" && Number.isFinite(value)
          ? value
          : index * frameStep
      );
    }
    return Array.from(
      { length: fallbackLength },
      (_, index) => index * frameStep
    );
  }, [fallbackLength, frameStep, rawFrames]);

  const meanPositive = useMemo(
    () => sanitizeNumericArray(dataset?.mean_positive),
    [dataset?.mean_positive]
  );
  const meanNegative = useMemo(
    () => sanitizeNumericArray(dataset?.mean_negative),
    [dataset?.mean_negative]
  );
  const stdThickness = useMemo(
    () => sanitizeNumericArray(dataset?.std_thickness),
    [dataset?.std_thickness]
  );
  const stdPositive = useMemo(
    () => sanitizeNumericArray(dataset?.std_positive),
    [dataset?.std_positive]
  );
  const stdNegative = useMemo(
    () => sanitizeNumericArray(dataset?.std_negative),
    [dataset?.std_negative]
  );
  const midplaneValues = useMemo(
    () => sanitizeNumericArray(dataset?.midplane_z),
    [dataset?.midplane_z]
  );

  const thicknessSeries = useMemo(
    () => buildSeries("Thickness", frames, thicknessValues),
    [frames, thicknessValues]
  );
  const positiveSeries = useMemo(
    () => buildSeries("Mean positive", frames, meanPositive),
    [frames, meanPositive]
  );
  const negativeSeries = useMemo(
    () => buildSeries("Mean negative", frames, meanNegative),
    [frames, meanNegative]
  );

  const mainSeries = useMemo(() => {
    const collection: LineSeries[] = [];
    if (thicknessSeries) collection.push(thicknessSeries);
    if (positiveSeries) collection.push(positiveSeries);
    if (negativeSeries) collection.push(negativeSeries);
    return collection;
  }, [negativeSeries, positiveSeries, thicknessSeries]);

  const midplaneSeries = useMemo(
    () => buildSeries("Midplane Z", frames, midplaneValues),
    [frames, midplaneValues]
  );

  const stats = useMemo(() => computeStats(thicknessValues), [thicknessValues]);
  const avgStd = useMemo(() => average(stdThickness), [stdThickness]);
  const avgLeafletGap = useMemo(() => {
    if (!meanPositive.length || !meanNegative.length) return undefined;
    const limit = Math.min(meanPositive.length, meanNegative.length);
    if (!limit) return undefined;
    let sum = 0;
    let count = 0;
    for (let i = 0; i < limit; i += 1) {
      const pos = meanPositive[i];
      const neg = meanNegative[i];
      if (Number.isFinite(pos) && Number.isFinite(neg)) {
        sum += pos - neg;
        count += 1;
      }
    }
    return count ? sum / count : undefined;
  }, [meanNegative, meanPositive]);

  const infoCards = [
    {
      label: "Average thickness",
      value: `${formatStat(stats?.average)} Å`,
    },
    {
      label: "Thickness range",
      value:
        stats && typeof stats.min === "number" && typeof stats.max === "number"
          ? `${stats.min.toFixed(2)}–${stats.max.toFixed(2)} Å`
          : "—",
    },
    {
      label: "Avg thickness σ",
      value: `${formatStat(avgStd)} Å`,
    },
    {
      label: "Frames analyzed",
      value: frames.length ? frames.length.toString() : "—",
    },
  ];

  if (!mainSeries.length) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        No membrane thickness analysis data available.
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {infoCards.map((card) => (
          <div
            key={card.label}
            className="rounded-md border border-border/70 p-3"
          >
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
              {card.label}
            </p>
            <p className="text-lg font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-border/60 rounded-lg p-4 flex flex-col gap-3 min-h-[340px]">
        <div>
          <p className="text-sm font-medium">Leaflet separation over time</p>
          <p className="text-xs text-muted-foreground">
            Overall thickness with positive/negative leaflet centroids
          </p>
        </div>
        <div className="flex-1 min-h-[260px]">
          <LineChart
            series={mainSeries}
            xLabel="Frame"
            yLabel="Å"
            showLegend
            yScale
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border border-border/60 rounded-lg p-4 flex flex-col gap-3 min-h-[240px]">
          <div>
            <p className="text-sm font-medium">Midplane drift</p>
            <p className="text-xs text-muted-foreground">
              Z-position of the bilayer midplane per frame
            </p>
          </div>
          <div className="flex-1 min-h-[180px]">
            {midplaneSeries ? (
              <LineChart
                series={[midplaneSeries]}
                xLabel="Frame"
                yLabel="Z (Å)"
                showLegend={false}
                yScale
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No midplane data provided.
              </div>
            )}
          </div>
        </div>
        <div className="border border-border/60 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-sm font-medium">Stability snapshot</p>
            <p className="text-xs text-muted-foreground">
              Average standard deviations for each leaflet and the combined
              thickness
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Leaflet gap (avg)</span>
              <span className="font-medium">{`${formatStat(
                avgLeafletGap
              )} Å`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                σ (positive leaflet)
              </span>
              <span className="font-medium">{`${formatStat(
                average(stdPositive)
              )} Å`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                σ (negative leaflet)
              </span>
              <span className="font-medium">{`${formatStat(
                average(stdNegative)
              )} Å`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThicknessAnalysisPanel;
