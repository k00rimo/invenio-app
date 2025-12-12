import { type FC, useMemo } from "react";
import { HeatmapMatrix, LineChart } from "@/components/charts";
import type { LineSeries } from "@/components/charts/LineChart";
import type { AreaPerLipidAnalysis } from "@/types/mdpositTypes";

const toNumericMatrix = (matrix: unknown): number[][] => {
  if (!Array.isArray(matrix)) return [];
  const sanitized: number[][] = [];
  matrix.forEach((row) => {
    if (!Array.isArray(row)) return;
    const sanitizedRow = row.map((value) =>
      typeof value === "number" && Number.isFinite(value) ? value : 0
    );
    sanitized.push(sanitizedRow);
  });
  return sanitized;
};

const toNumericArray = (values: unknown): number[] => {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) =>
      typeof value === "number" && Number.isFinite(value) ? value : null
    )
    .filter((value): value is number => value !== null);
};

const buildHeatmapTriples = (
  matrix: number[][]
): Array<[number, number, number]> => {
  const triples: Array<[number, number, number]> = [];
  matrix.forEach((row, yIndex) => {
    row.forEach((value, xIndex) => {
      triples.push([xIndex, yIndex, value]);
    });
  });
  return triples;
};

const buildAxisLabels = (
  values: unknown,
  fallbackLength: number,
  prefix: string
): string[] => {
  if (Array.isArray(values) && values.length) {
    return values.map((value, index) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value.toFixed(1);
      }
      if (typeof value === "string" && value.trim().length) {
        return value.trim();
      }
      return `${prefix} ${index + 1}`;
    });
  }
  return Array.from(
    { length: fallbackLength },
    (_, index) => `${prefix} ${index + 1}`
  );
};

const formatStat = (value?: number): string => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return value.toFixed(2);
};

const buildLineSeries = (
  label: string,
  values: number[]
): LineSeries | undefined => {
  if (!values.length) return undefined;
  const data: Array<[number, number]> = values.map((value, index) => [
    index + 1,
    value,
  ]);
  return data.length ? { name: label, data } : undefined;
};

const average = (values: number[]): number | undefined => {
  if (!values.length) return undefined;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
};

const AreaPerLipidPanel: FC<{ data: AreaPerLipidAnalysis }> = ({ data }) => {
  const areaData = data?.data;
  const upperMatrix = useMemo(
    () => toNumericMatrix(areaData?.["upper leaflet"]),
    [areaData]
  );
  const lowerMatrix = useMemo(
    () => toNumericMatrix(areaData?.["lower leaflet"]),
    [areaData]
  );

  const hasAnyMatrix = upperMatrix.length || lowerMatrix.length;

  const gridXLabels = useMemo(() => {
    const fallbackLength =
      upperMatrix[0]?.length ?? lowerMatrix[0]?.length ?? 0;
    return buildAxisLabels(areaData?.grid_x, fallbackLength, "X");
  }, [areaData?.grid_x, lowerMatrix, upperMatrix]);

  const upperYLabels = useMemo(
    () => buildAxisLabels(areaData?.grid_y, upperMatrix.length, "Y"),
    [areaData?.grid_y, upperMatrix]
  );

  const lowerYLabels = useMemo(
    () => buildAxisLabels(areaData?.grid_y, lowerMatrix.length, "Y"),
    [areaData?.grid_y, lowerMatrix]
  );

  const upperHeatmap = useMemo(
    () => buildHeatmapTriples(upperMatrix),
    [upperMatrix]
  );
  const lowerHeatmap = useMemo(
    () => buildHeatmapTriples(lowerMatrix),
    [lowerMatrix]
  );

  const sharedRange = useMemo(() => {
    const combined = [...upperMatrix.flat(), ...lowerMatrix.flat()].filter(
      (value) => typeof value === "number" && Number.isFinite(value)
    );
    if (!combined.length) return undefined;
    return {
      min: Math.min(...combined),
      max: Math.max(...combined),
    };
  }, [lowerMatrix, upperMatrix]);

  const medianArray = useMemo(
    () => toNumericArray(areaData?.median),
    [areaData?.median]
  );
  const stdArray = useMemo(
    () => toNumericArray(areaData?.std),
    [areaData?.std]
  );

  const medianSeries = useMemo(() => {
    const series: LineSeries[] = [];
    const medianLine = buildLineSeries("Median", medianArray);
    if (medianLine) {
      series.push(medianLine);
    }
    if (
      medianArray.length &&
      stdArray.length &&
      medianArray.length === stdArray.length
    ) {
      const plusSeries = buildLineSeries(
        "Median + Std",
        medianArray.map((value, index) => value + stdArray[index])
      );
      const minusSeries = buildLineSeries(
        "Median - Std",
        medianArray.map((value, index) => value - stdArray[index])
      );
      if (plusSeries) series.push(plusSeries);
      if (minusSeries) series.push(minusSeries);
    }
    return series;
  }, [medianArray, stdArray]);

  const medianSummary = useMemo(() => {
    if (
      typeof areaData?.median === "number" &&
      Number.isFinite(areaData.median)
    ) {
      return areaData.median;
    }
    return average(medianArray);
  }, [areaData?.median, medianArray]);

  const stdSummary = useMemo(() => {
    if (typeof areaData?.std === "number" && Number.isFinite(areaData.std)) {
      return areaData.std;
    }
    return average(stdArray);
  }, [areaData?.std, stdArray]);

  const gridResolution = `${gridXLabels.length || "?"} × ${
    upperYLabels.length || lowerYLabels.length || "?"
  }`;

  if (!hasAnyMatrix) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        No area-per-lipid analysis data available.
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border/70 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
            Median area
          </p>
          <p className="text-lg font-semibold">
            {formatStat(medianSummary)} Å²
          </p>
        </div>
        <div className="rounded-md border border-border/70 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
            Std. deviation
          </p>
          <p className="text-lg font-semibold">{formatStat(stdSummary)} Å²</p>
        </div>
        <div className="rounded-md border border-border/70 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
            Grid resolution
          </p>
          <p className="text-lg font-semibold">{gridResolution}</p>
        </div>
      </div>

      {medianSeries.length ? (
        <div className="border border-border/60 rounded-lg p-4 h-64">
          <p className="text-sm font-medium mb-2">Median ± Std over frames</p>
          <LineChart
            series={medianSeries}
            xLabel="Frame"
            yLabel="Å²"
            showLegend
            yScale
          />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 flex-1 min-h-0">
        <div className="border border-border/60 rounded-lg p-4 flex flex-col gap-3 min-h-[320px]">
          <div>
            <p className="text-sm font-medium">Upper leaflet grid</p>
            <p className="text-xs text-muted-foreground">
              Per-cell area contributions for the upper leaflet
            </p>
          </div>
          <div className="flex-1 min-h-[280px]">
            {upperHeatmap.length ? (
              <HeatmapMatrix
                data={upperHeatmap}
                xLabels={gridXLabels}
                yLabels={upperYLabels}
                enableFilter
                valueRange={sharedRange}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No upper leaflet grid data provided.
              </div>
            )}
          </div>
        </div>
        <div className="border border-border/60 rounded-lg p-4 flex flex-col gap-3 min-h-[320px]">
          <div>
            <p className="text-sm font-medium">Lower leaflet grid</p>
            <p className="text-xs text-muted-foreground">
              Mirrored area map for the lower leaflet
            </p>
          </div>
          <div className="flex-1 min-h-[280px]">
            {lowerHeatmap.length ? (
              <HeatmapMatrix
                data={lowerHeatmap}
                xLabels={gridXLabels}
                yLabels={lowerYLabels}
                enableFilter
                valueRange={sharedRange}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No lower leaflet grid data provided.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaPerLipidPanel;
