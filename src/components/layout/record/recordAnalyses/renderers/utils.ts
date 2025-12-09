import type {
  Analysis,
  FluctuationAnalysis,
  PCAAnalysis,
  RadiusOfGyrationAnalysis,
  RMSDAnalysis,
  RMSDPairwiseAnalysis,
  RMSDPairwiseMatrix,
  RMSDPerResidueAnalysis,
  RMSDPerResidueMatrixAnalysis,
  RMSDsAnalysis,
  StatisticalData,
  TMScoresAnalysis,
} from "@/types/mdpositTypes";

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

const isRmsdPairwiseMatrix = (obj: unknown): obj is RMSDPairwiseMatrix => {
  if (!obj || typeof obj !== "object") return false;
  const matrix = obj as { name?: unknown; rmsds?: unknown };
  return (
    typeof matrix.name === "string" &&
    Array.isArray(matrix.rmsds) &&
    matrix.rmsds.length > 0 &&
    Array.isArray(matrix.rmsds[0])
  );
};

const isLegacyRmsdPairwise = (
  obj: unknown
): obj is {
  start?: number;
  step?: number;
  name?: string;
  rmsds: number[][];
} => {
  if (!obj || typeof obj !== "object") return false;
  const legacy = obj as { name?: unknown; rmsds?: unknown };
  return (
    typeof legacy.name === "string" &&
    Array.isArray(legacy.rmsds) &&
    legacy.rmsds.length > 0 &&
    Array.isArray(legacy.rmsds[0])
  );
};

export function isRmsdPairwise(obj: unknown): obj is RMSDPairwiseAnalysis {
  if (!obj || typeof obj !== "object") return false;
  const payload = obj as RMSDPairwiseAnalysis;
  return (
    typeof payload.start === "number" &&
    typeof payload.step === "number" &&
    Array.isArray(payload.data) &&
    payload.data.length > 0 &&
    payload.data.every(isRmsdPairwiseMatrix)
  );
}

export function isRmsdsAnalysis(obj: unknown): obj is RMSDsAnalysis {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as { data?: unknown };
  if (!Array.isArray(o.data) || o.data.length === 0) return false;
  const first = o.data[0] as {
    reference?: unknown;
    group?: unknown;
    values?: unknown;
  };
  return (
    typeof first.reference === "string" &&
    typeof first.group === "string" &&
    Array.isArray(first.values)
  );
}

export const isRmsdAnalysis = (obj: Analysis): obj is RMSDAnalysis =>
  hasStatSeries(obj, "rmsd");

export const isRadiusOfGyrationAnalysis = (
  obj: Analysis
): obj is RadiusOfGyrationAnalysis =>
  hasStatSeries(obj, "rgyr", "rgyrx", "rgyry", "rgyrz");

export const isRmsdPairwiseAnalysis = isRmsdPairwise;

export const extractRmsdPairwiseAnalysis = (
  obj: Analysis
): RMSDPairwiseAnalysis | undefined => {
  if (isRmsdPairwise(obj)) {
    return obj;
  }

  if (
    obj &&
    typeof obj === "object" &&
    Array.isArray((obj as { data?: unknown }).data)
  ) {
    const container = obj as {
      data: unknown[];
      start?: number;
      step?: number;
    };
    const matrices = container.data.filter(isRmsdPairwiseMatrix);
    if (matrices.length > 0) {
      return {
        start: typeof container.start === "number" ? container.start : 0,
        step: typeof container.step === "number" ? container.step : 1,
        data: matrices,
      };
    }
  }

  if (isLegacyRmsdPairwise(obj)) {
    const legacy = obj as {
      start?: number;
      step?: number;
      name?: string;
      rmsds: number[][];
    };
    return {
      start: typeof legacy.start === "number" ? legacy.start : 0,
      step: typeof legacy.step === "number" ? legacy.step : 1,
      data: [
        {
          name: typeof legacy.name === "string" ? legacy.name : "Overall",
          rmsds: legacy.rmsds,
        },
      ],
    };
  }

  return undefined;
};

export const isFluctuationAnalysis = (
  obj: Analysis
): obj is FluctuationAnalysis => hasStatSeries(obj, "rmsf");

const isRmsdPerResidueSeries = (
  obj: unknown
): obj is { name: string; rmsds: number[] } => {
  if (!obj || typeof obj !== "object") return false;
  const series = obj as { name?: unknown; rmsds?: unknown };
  return (
    typeof series.name === "string" &&
    Array.isArray(series.rmsds) &&
    series.rmsds.length > 0 &&
    series.rmsds.every((value) => typeof value === "number")
  );
};

const isRmsdPerResidueMatrix = (
  obj: unknown
): obj is RMSDPerResidueMatrixAnalysis => {
  if (!obj || typeof obj !== "object") return false;
  const matrix = obj as { rmsdpr?: unknown };
  return (
    Array.isArray(matrix.rmsdpr) &&
    matrix.rmsdpr.length > 0 &&
    matrix.rmsdpr.every(
      (row) =>
        Array.isArray(row) && row.every((value) => typeof value === "number")
    )
  );
};

export function isRmsdPerResidueAnalysis(
  obj: Analysis
): obj is RMSDPerResidueAnalysis {
  if (!obj || typeof obj !== "object") return false;
  const data = (obj as RMSDPerResidueAnalysis).data;
  if (!Array.isArray(data) || data.length === 0) return false;
  return data.every(isRmsdPerResidueSeries);
}

export const extractRmsdPerResidueAnalysis = (
  obj: Analysis
): RMSDPerResidueAnalysis | undefined => {
  if (isRmsdPerResidueAnalysis(obj)) {
    return obj;
  }

  if (isRmsdPerResidueMatrix(obj)) {
    const matrix = obj as RMSDPerResidueMatrixAnalysis;
    const data = matrix.rmsdpr.map((row, index) => ({
      name: `Residue ${index + 1}`,
      rmsds: row,
    }));
    return {
      step: matrix.step,
      data,
    };
  }

  return undefined;
};

export function isTMScoresAnalysis(obj: Analysis): obj is TMScoresAnalysis {
  if (!obj || typeof obj !== "object") return false;
  const data = (obj as TMScoresAnalysis).data;
  if (!Array.isArray(data) || data.length === 0) return false;
  const first = data[0];
  return (
    typeof first?.reference === "string" &&
    typeof first?.group === "string" &&
    Array.isArray(first?.values) &&
    first.values.length > 0
  );
}

const isPcaShape = (obj: unknown): obj is PCAAnalysis => {
  if (!obj || typeof obj !== "object") return false;
  const data = obj as PCAAnalysis;
  return (
    Array.isArray(data.eigenvalues) &&
    data.eigenvalues.length > 0 &&
    Array.isArray(data.projections) &&
    data.projections.length > 0 &&
    Array.isArray(data.projections[0]) &&
    data.projections[0].length >= 2
  );
};

export const isPcaAnalysis = (obj: unknown): obj is PCAAnalysis =>
  isPcaShape(obj);

export const extractPcaAnalysis = (obj: Analysis): PCAAnalysis | undefined => {
  if (isPcaShape(obj)) {
    return obj;
  }

  if (
    obj &&
    typeof obj === "object" &&
    isPcaShape((obj as { data?: unknown }).data)
  ) {
    return (obj as unknown as { data: PCAAnalysis }).data;
  }

  return undefined;
};
