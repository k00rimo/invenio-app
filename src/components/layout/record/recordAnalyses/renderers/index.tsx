import type { FC, ReactElement } from "react";
import { BarChart3 } from "lucide-react";
import RMSDPairwiseHeatmap from "./RMSDPairwiseHeatmap";
import RMSDChart from "./RMSDChart";
import RMSDsChart from "./RMSDsChart";
import RgChart from "./RgChart";
import FluctuationChart from "./FluctuationChart";
import RMSDPerResidueChart from "./RMSDPerResidueChart";
import TMScoresChart from "./TMScoresChart";
import PcaAnalysisPanel from "./PcaAnalysisPanel";
import type { Analysis } from "@/types/mdpositTypes";
import {
  extractPcaAnalysis,
  extractRmsdPairwiseAnalysis,
  extractRmsdPerResidueAnalysis,
  isFluctuationAnalysis,
  isRadiusOfGyrationAnalysis,
  isRmsdAnalysis,
  isRmsdsAnalysis,
  isTMScoresAnalysis,
} from "./utils";

const ANALYSES = {
  MEM_MAP: "mem-map",
  APL: "apl",
  CLUSTERS: "clusters",
  DENSITY: "density",
  DIST_PERRES: "dist-perres",
  ENERGIES: "energies",
  HBONDS: "hbonds",
  INTERACTIONS: "interactions",
  LIPID_INTER: "lipid-inter",
  LIPID_ORDER: "lipid-order",
  RMSD_PAIRWISE: "rmsd-pairwise",
  PCA: "pca",
  POCKETS: "pockets",
  RMSD_PERRES: "rmsd-perres",
  RGYR: "rgyr",
  RMSDS: "rmsds",
  FLUCTUATION: "fluctuation",
  SASA: "sasa",
  THICKNESS: "thickness",
  TMSCORES: "tmscores",
  RMSD: "rmsd",
} as const;

type AnalysisRendererProps = {
  analysisName: string;
  data: Analysis;
};

const renderPlaceholder = (analysisName: string): ReactElement => (
  <div className="h-full flex-1 flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25">
    <div className="text-center space-y-2">
      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">Visualization</p>
      <p className="text-xs text-muted-foreground/75">
        Data loaded for <strong>{analysisName}</strong>, but no renderer is
        implemented yet.
      </p>
    </div>
  </div>
);

const AnalysisRenderer: FC<AnalysisRendererProps> = ({
  analysisName,
  data,
}: AnalysisRendererProps) => {
  for (const render of analysisRenderers) {
    const result = render(analysisName, data);
    if (result) {
      return result;
    }
  }

  // Fallback placeholder
  return renderPlaceholder(analysisName);
};

type Renderer = (analysisName: string, data: Analysis) => ReactElement | null;

const analysisRenderers: Renderer[] = [
  (analysisName, data) => {
    if (analysisName === ANALYSES.RMSDS && isRmsdsAnalysis(data)) {
      return <RMSDsChart data={data} />;
    }
    return null;
  },
  (analysisName, data) => {
    if (analysisName === ANALYSES.RMSD_PAIRWISE) {
      const pairwiseData = extractRmsdPairwiseAnalysis(data);
      if (pairwiseData) {
        return <RMSDPairwiseHeatmap data={pairwiseData} />;
      }
    }
    return null;
  },
  (analysisName, data) => {
    if (analysisName === ANALYSES.RMSD && isRmsdAnalysis(data)) {
      return <RMSDChart data={data} />;
    }
    return null;
  },
  (analysisName, data) => {
    if (analysisName === ANALYSES.RGYR && isRadiusOfGyrationAnalysis(data)) {
      return <RgChart data={data} />;
    }
    return null;
  },
  (analysisName, data) => {
    if (analysisName === ANALYSES.FLUCTUATION && isFluctuationAnalysis(data)) {
      return <FluctuationChart data={data} />;
    }
    return null;
  },
  (analysisName, data) => {
    if (analysisName === ANALYSES.RMSD_PERRES) {
      const perResidueData = extractRmsdPerResidueAnalysis(data);
      if (perResidueData) {
        return <RMSDPerResidueChart data={perResidueData} />;
      }
    }
    return null;
  },
  (analysisName, data) => {
    if (analysisName === ANALYSES.TMSCORES && isTMScoresAnalysis(data)) {
      return <TMScoresChart data={data} />;
    }
    return null;
  },
  (analysisName, data) => {
    if (analysisName === ANALYSES.PCA) {
      const pcaData = extractPcaAnalysis(data);
      if (pcaData) {
        return <PcaAnalysisPanel data={pcaData} />;
      }
    }
    return null;
  },
  (analysisName) => {
    if (analysisName === ANALYSES.POCKETS) {
      return renderPlaceholder(analysisName);
    }
    return null;
  },
  (analysisName) => {
    if (analysisName === ANALYSES.SASA) {
      return renderPlaceholder(analysisName);
    }
    return null;
  },
];

export default AnalysisRenderer;
