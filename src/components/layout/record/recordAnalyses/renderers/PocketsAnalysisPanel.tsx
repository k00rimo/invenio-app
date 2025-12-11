import { type FC, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  LineChart,
  buildTimeSeries,
  formatStatValue,
} from "@/components/charts";
import type { PocketsAnalysis } from "@/types/mdpositTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_BAR_POCKETS = 15;

type PocketEntry = {
  id: string;
  label: string;
  volumes: number[];
  atomCount: number;
};

const sanitizeName = (name: unknown, index: number): string => {
  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim();
  }
  return `Pocket ${index + 1}`;
};

const computeBasicStats = (
  values: number[]
):
  | {
      average: number;
      min: number;
      max: number;
    }
  | undefined => {
  const numericValues = values.filter((value) => Number.isFinite(value));
  if (!numericValues.length) {
    return undefined;
  }

  const total = numericValues.reduce((sum, value) => sum + value, 0);
  return {
    average: total / numericValues.length,
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
  };
};

const PocketsAnalysisPanel: FC<{ data: PocketsAnalysis }> = ({ data }) => {
  const pockets = useMemo<PocketEntry[]>(() => {
    const rawEntries = Array.isArray(data.data) ? data.data : [];
    return rawEntries.map((entry, index) => {
      const label = sanitizeName(entry?.name, index);
      const volumes = Array.isArray(entry?.volumes)
        ? entry.volumes.map((value) =>
            typeof value === "number" && Number.isFinite(value) ? value : NaN
          )
        : [];
      const atomCount = Array.isArray(entry?.atoms) ? entry.atoms.length : 0;
      return {
        id: `${index}-${label}`,
        label,
        volumes,
        atomCount,
      };
    });
  }, [data]);

  const [selectedPocket, setSelectedPocket] = useState<string>("");

  useEffect(() => {
    if (!pockets.length) return;
    const fallback = pockets[0]?.id ?? "";
    if (
      !selectedPocket ||
      !pockets.some((pocket) => pocket.id === selectedPocket)
    ) {
      setSelectedPocket(fallback);
    }
  }, [pockets, selectedPocket]);

  const activePocket = pockets.find((pocket) => pocket.id === selectedPocket);

  const pocketSeries = useMemo(
    () =>
      activePocket
        ? [
            {
              name: `${activePocket.label} volume`,
              data: buildTimeSeries(activePocket.volumes, {
                start: 0,
                step: 1,
              }),
            },
          ]
        : [],
    [activePocket]
  );

  const pocketStats = useMemo(
    () => (activePocket ? computeBasicStats(activePocket.volumes) : undefined),
    [activePocket]
  );

  const topPocketAverages = useMemo(() => {
    return pockets
      .map((pocket) => {
        const stats = computeBasicStats(pocket.volumes);
        return stats
          ? {
              label: pocket.label,
              average: stats.average,
            }
          : undefined;
      })
      .filter((entry): entry is { label: string; average: number } =>
        Boolean(entry)
      )
      .sort((a, b) => b.average - a.average)
      .slice(0, MAX_BAR_POCKETS);
  }, [pockets]);

  const barCategories = topPocketAverages.map((entry) => entry.label);
  const barSeries = [
    {
      name: "Avg volume",
      data: topPocketAverages.map((entry) => entry.average),
    },
  ];

  return pockets.length ? (
    <div className="h-full min-h-0 flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="border border-border/60 rounded-lg p-4 flex flex-col min-h-[280px]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-medium">Pocket volume over time</p>
              <p className="text-xs text-muted-foreground">
                Frame-wise pocket volume (A^3)
              </p>
            </div>
            {pockets.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Pocket</span>
                <Select
                  value={selectedPocket}
                  onValueChange={setSelectedPocket}
                >
                  <SelectTrigger className="w-48 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pockets.map((pocket) => (
                      <SelectItem key={pocket.id} value={pocket.id}>
                        {pocket.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {pocketStats && (
            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 mb-2">
              <span>Avg: {formatStatValue(pocketStats.average)}</span>
              <span>Min: {formatStatValue(pocketStats.min)}</span>
              <span>Max: {formatStatValue(pocketStats.max)}</span>
              {typeof activePocket?.atomCount === "number" && (
                <span>Atoms: {activePocket.atomCount}</span>
              )}
            </div>
          )}

          <div className="flex-1 min-h-[220px]">
            {pocketSeries.length ? (
              <LineChart
                series={pocketSeries}
                xLabel="Frame index"
                yLabel="Pocket volume (A^3)"
                showLegend={false}
                yScale
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No pocket time-series data available.
              </div>
            )}
          </div>
        </div>

        <div className="border border-border/60 rounded-lg p-4 flex flex-col min-h-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Average pocket volumes</p>
              <p className="text-xs text-muted-foreground">
                Top {barCategories.length} pockets by average volume
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Total pockets: {pockets.length}
            </p>
          </div>
          <div className="flex-1 min-h-[220px]">
            {barCategories.length ? (
              <BarChart
                categories={barCategories}
                series={barSeries}
                horizontal
                showLegend={false}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Not enough pocket data for bar chart.
              </div>
            )}
          </div>
          {pockets.length > MAX_BAR_POCKETS && (
            <p className="text-[11px] text-muted-foreground mt-2">
              Showing top {MAX_BAR_POCKETS} pockets. Filter in 3D to inspect all
              pockets.
            </p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      No pocket analysis data available.
    </div>
  );
};

export default PocketsAnalysisPanel;
