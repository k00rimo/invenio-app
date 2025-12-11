import type {
  Analysis,
  DistancePerResidueAnalysis,
  FluctuationAnalysis,
  HydrogenBondsAnalysis,
  InteractionData,
  PCAAnalysis,
  PocketsAnalysis,
  RadiusOfGyrationAnalysis,
  RMSDAnalysis,
  RMSDPairwiseAnalysis,
  RMSDPairwiseMatrix,
  RMSDPerResidueAnalysis,
  RMSDPerResidueMatrixAnalysis,
  RMSDsAnalysis,
  SolventAccessibleSurfaceAnalysis,
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

export const isPocketsAnalysis = (obj: Analysis): obj is PocketsAnalysis => {
  if (!obj || typeof obj !== "object") return false;
  return Array.isArray((obj as PocketsAnalysis).data);
};

export const isSasaAnalysis = (
  obj: Analysis
): obj is SolventAccessibleSurfaceAnalysis => {
  if (!obj || typeof obj !== "object") return false;
  const analysis = obj as SolventAccessibleSurfaceAnalysis;
  return Array.isArray(analysis.saspf);
};

const isNumericMatrix = (matrix: unknown): matrix is number[][] =>
  Array.isArray(matrix) &&
  matrix.length > 0 &&
  matrix.every(
    (row) =>
      Array.isArray(row) &&
      row.length > 0 &&
      row.every((value) => typeof value === "number" && Number.isFinite(value))
  );

export const isDistancePerResidueAnalysis = (
  obj: Analysis
): obj is DistancePerResidueAnalysis => {
  if (!obj || typeof obj !== "object") return false;
  const dataset = (obj as DistancePerResidueAnalysis).data;
  if (!Array.isArray(dataset) || dataset.length === 0) return false;
  return dataset.every(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      typeof entry.name === "string" &&
      isNumericMatrix(entry.means) &&
      isNumericMatrix(entry.stdvs)
  );
};

const normalizeNumericMatrix = (matrix: unknown): number[][] => {
  if (!Array.isArray(matrix)) return [];
  const sanitized: number[][] = [];
  matrix.forEach((row) => {
    if (!Array.isArray(row)) return;
    const sanitizedRow = row.map((value) =>
      typeof value === "number" && Number.isFinite(value) ? value : 0
    );
    sanitized.push(sanitizedRow);
  });
  return sanitized.length ? sanitized : [];
};

const normalizeDistanceEntry = (
  entry: unknown,
  index: number
): DistancePerResidueAnalysis["data"][number] | undefined => {
  if (!entry || typeof entry !== "object") return undefined;
  const record = entry as { name?: unknown; means?: unknown; stdvs?: unknown };
  const name =
    typeof record.name === "string" && record.name.trim().length
      ? record.name.trim()
      : `Interaction ${index + 1}`;
  const means = normalizeNumericMatrix(record.means);
  const stdvs = normalizeNumericMatrix(record.stdvs);

  if (!means.length && !stdvs.length) {
    return undefined;
  }

  return {
    name,
    means,
    stdvs,
  };
};

const distancePerResidueCache = new WeakMap<
  object,
  DistancePerResidueAnalysis
>();

export const extractDistancePerResidueAnalysis = (
  obj: Analysis
): DistancePerResidueAnalysis | undefined => {
  if (isDistancePerResidueAnalysis(obj)) {
    return obj;
  }

  if (!obj || typeof obj !== "object") return undefined;

  const cached = distancePerResidueCache.get(obj as object);
  if (cached) return cached;

  const payload = obj as { data?: unknown };
  const sources: unknown[] = [];

  if (Array.isArray(payload.data) && payload.data.length) {
    sources.push(...payload.data);
  } else {
    sources.push(obj);
  }

  const normalized = sources
    .map((entry, index) => normalizeDistanceEntry(entry, index))
    .filter((entry): entry is DistancePerResidueAnalysis["data"][number] =>
      Boolean(entry)
    );

  if (!normalized.length) return undefined;

  const result: DistancePerResidueAnalysis = { data: normalized };
  distancePerResidueCache.set(obj as object, result);
  return result;
};

export const isHydrogenBondsAnalysis = (
  obj: Analysis
): obj is HydrogenBondsAnalysis => {
  if (!obj || typeof obj !== "object") return false;
  const dataset = (obj as HydrogenBondsAnalysis).data;
  if (!Array.isArray(dataset) || dataset.length === 0) return false;
  return dataset.every((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const payload = entry as HydrogenBondsAnalysis["data"][number];
    return (
      typeof payload.name === "string" &&
      Array.isArray(payload.acceptors) &&
      Array.isArray(payload.donors) &&
      Array.isArray(payload.hydrogens) &&
      Array.isArray(payload.hbonds) &&
      payload.hbonds.every(
        (row) =>
          Array.isArray(row) && row.every((value) => typeof value === "boolean")
      )
    );
  });
};

const normalizeNumberArray = (values: unknown): number[] =>
  Array.isArray(values)
    ? values.filter(
        (value): value is number =>
          typeof value === "number" && Number.isFinite(value)
      )
    : [];

const toBooleanMatrix = (matrix: unknown): boolean[][] => {
  if (!Array.isArray(matrix)) return [];
  const normalized: boolean[][] = [];
  matrix.forEach((row) => {
    if (!Array.isArray(row)) return;
    const normalizedRow = row.map((value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "number" && Number.isFinite(value)) {
        return value !== 0;
      }
      return false;
    });
    normalized.push(normalizedRow);
  });
  return normalized.length ? normalized : [];
};

const normalizeLegacyHydrogenEntry = (
  entry: unknown,
  index: number
): HydrogenBondsAnalysis["data"][number] | undefined => {
  if (!entry || typeof entry !== "object") return undefined;
  const record = entry as {
    name?: unknown;
    acceptors?: unknown;
    donors?: unknown;
    hydrogens?: unknown;
    hbonds?: unknown;
    hbonds_timed?: unknown;
  };

  const name =
    typeof record.name === "string" && record.name.trim().length
      ? record.name.trim()
      : `Interaction ${index + 1}`;

  const hbondsMatrix = (() => {
    const directMatrix = toBooleanMatrix(record.hbonds);
    if (directMatrix.length) return directMatrix;
    return toBooleanMatrix(record.hbonds_timed);
  })();

  const acceptors = normalizeNumberArray(record.acceptors);
  const donors = normalizeNumberArray(record.donors);
  const hydrogens = normalizeNumberArray(record.hydrogens);

  if (
    !acceptors.length &&
    !donors.length &&
    !hydrogens.length &&
    !hbondsMatrix.length
  ) {
    return undefined;
  }

  return {
    name,
    acceptors,
    donors,
    hydrogens,
    hbonds: hbondsMatrix,
  };
};

export const extractHydrogenBondsAnalysis = (
  obj: Analysis
): HydrogenBondsAnalysis | undefined => {
  if (isHydrogenBondsAnalysis(obj)) {
    return obj;
  }

  if (!obj || typeof obj !== "object") return undefined;

  const payload = obj as { data?: unknown };
  const sources: unknown[] = [];

  if (Array.isArray(payload.data) && payload.data.length) {
    sources.push(...payload.data);
  } else {
    sources.push(obj);
  }

  const normalized = sources
    .map((entry, index) => normalizeLegacyHydrogenEntry(entry, index))
    .filter((entry): entry is HydrogenBondsAnalysis["data"][number] =>
      Boolean(entry)
    );

  if (!normalized.length) return undefined;

  return { data: normalized };
};

const isInteractionEntry = (entry: unknown): entry is InteractionData => {
  if (!entry || typeof entry !== "object") return false;
  const payload = entry as InteractionData;
  return (
    typeof payload.name === "string" ||
    typeof payload.agent_1 === "string" ||
    typeof payload.agent_2 === "string"
  );
};

export const isInteractionsAnalysis = (
  obj: Analysis | InteractionData[]
): obj is InteractionData | InteractionData[] => {
  if (Array.isArray(obj)) {
    return obj.every(isInteractionEntry);
  }
  return isInteractionEntry(obj);
};
