import type { AnalysisName } from "@/types/mdpositTypes";

// Human-friendly labels for base analysis identifiers
const BASE_ANALYSIS_LABELS: Record<string, string> = {
  // Time series / per-residue
  rmsd: "RMSD",
  rmsds: "RMSD (Multiple)",
  rgyr: "Radius of Gyration",
  fluctuation: "RMSF (Fluctuation)",
  "rmsd-perres": "RMSD per Residue",
  "dist-perres": "Distance per Residue",
  "dist-perres-mean": "Distance per Residue (Mean)",
  "dist-perres-stdv": "Distance per Residue (Std Dev)",

  // Energetics
  energies: "Energies",

  // Interactions / structure
  hbonds: "Hydrogen Bonds",
  interactions: "Interactions",
  pca: "PCA",
  pockets: "Pockets",
  "mem-map": "Membrane Map",
  apl: "Area per Lipid",
  density: "Density Profile",
  "lipid-inter": "Lipid Interactions",
  "lipid-order": "Lipid Order",
  thickness: "Membrane Thickness",

  // Matrices / pairwise
  "rmsd-pairwise": "RMSD Pairwise",
  "rmsd-pairwise-interface": "RMSD Pairwise (Interface)",

  // Other
  sasa: "SASA",
  tmscores: "TM-scores",
  clusters: "Clusters",
};

/**
 * Returns a human-readable label for an analysis name.
 * - If the name has a numeric suffix (e.g., "rmsd-pairwise-00"), it will format as
 *   "<Base Label> - 00" using the base label when known.
 * - Falls back to a simple title-cased version of the identifier when unknown.
 */
export function getAnalysisLabel(name: string): string {
  // Special-case that shouldn't be split
  if (name === "rmsd-pairwise-interface")
    return BASE_ANALYSIS_LABELS[name] ?? name;

  const variantMatch = name.match(/^(.*?)-(\d+)$/);
  if (variantMatch) {
    const base = variantMatch[1];
    const idx = variantMatch[2];
    const baseLabel = BASE_ANALYSIS_LABELS[base] ?? toTitleCase(base);
    return `${baseLabel} - ${idx}`;
  }

  return BASE_ANALYSIS_LABELS[name] ?? toTitleCase(name);
}

/** Extracts the base identifier by removing a trailing -NN suffix if present. */
export function getBaseAnalysisId(name: string): string {
  const m = name.match(/^(.*?)-(\d+)$/);
  return m ? m[1] : name;
}

export type AnalysisGroup = {
  baseId: string;
  label: string;
  variants: string[];
  hasVariants: boolean;
};

/**
 * Groups analyses so that base identifiers (without numeric suffix) act as
 * primary entries and their suffixed variants are folded underneath.
 */
export function groupAnalysesByBase(analyses?: string[]): AnalysisGroup[] {
  if (!analyses || analyses.length === 0) {
    return [];
  }

  type InternalGroup = AnalysisGroup & { baseSeen: boolean };

  const groups = new Map<string, InternalGroup>();
  const order: string[] = [];

  for (const slug of analyses) {
    const baseId = getBaseAnalysisId(slug);
    let entry = groups.get(baseId);

    if (!entry) {
      entry = {
        baseId,
        label: getAnalysisLabel(baseId),
        variants: [],
        hasVariants: false,
        baseSeen: false,
      };
      groups.set(baseId, entry);
      order.push(baseId);
    }

    if (slug === baseId) {
      entry.baseSeen = true;
    } else {
      entry.hasVariants = true;
      entry.variants.push(slug);
    }
  }

  return order.map((baseId) => {
    const entry = groups.get(baseId)!;

    if (entry.variants.length === 0) {
      // No suffixed variants means the base analysis itself holds the data
      entry.variants.push(entry.baseId);
    }

    return {
      baseId: entry.baseId,
      label: entry.label,
      variants: entry.variants,
      hasVariants: entry.hasVariants,
    } satisfies AnalysisGroup;
  });
}

/** Simple Title Case for fallback labels: "rmsd-perres" -> "Rmsd Perres" */
function toTitleCase(id: string): string {
  return id
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Optional typed helper when you already have a typed AnalysisName
export const ANALYSIS_LABELS: Record<AnalysisName, string> = new Proxy(
  {} as Record<AnalysisName, string>,
  {
    get: (_target, prop: string) => getAnalysisLabel(prop),
  }
);

// Internal: escape regex special characters in a string
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Returns true when the given analysis name has variant options available
 * in the provided analyses list (e.g., base-00, base-01, ...).
 */
export function hasVariantOptionsForAnalysis(
  availableAnalyses: string[],
  analysisName?: string | null
): boolean {
  if (!analysisName) return false;
  const base = getBaseAnalysisId(analysisName);
  const re = new RegExp(`^${escapeRegExp(base)}-\\d{2}$`);
  return availableAnalyses.some((a) => re.test(a));
}
