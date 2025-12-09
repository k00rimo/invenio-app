# Analysis Rendering Guide

This document maps each MDposit analysis type to the appropriate chart component and indicates where 3D molecular visualization adds value.

## Quick Reference Table

| Analysis                  | Chart Component                             | 3D Viewer                | Priority |
| ------------------------- | ------------------------------------------- | ------------------------ | -------- |
| `rmsd`                    | LineChart (time series)                     | Optional                 | Low      |
| `rmsd-pairwise`           | HeatmapMatrix (frame×frame)                 | Not needed               | N/A      |
| `rmsd-pairwise-interface` | HeatmapMatrix                               | Recommended              | Medium   |
| `rmsd-perres`             | BarChart or LineChart (per-residue)         | **Strongly recommended** | High     |
| `rmsds`                   | LineChart (multi-series)                    | Optional                 | Low      |
| `rgyr`                    | LineChart (multi-series: Rg, RgX/Y/Z)       | Not needed               | N/A      |
| `fluctuation` (RMSF)      | BarChart or LineChart (per-residue)         | **Strongly recommended** | High     |
| `dist-perres`             | BarChart/LineChart or HeatmapMatrix         | Recommended              | Medium   |
| `hbonds`                  | LineChart (count) or HeatmapMatrix (pairs)  | Recommended              | Medium   |
| `interactions`            | HeatmapMatrix (contact frequency)           | Recommended              | Medium   |
| `energies`                | LineChart or StackedAreaChart               | Not needed               | N/A      |
| `pca`                     | ScreePlot + Scatter2D                       | Optional (advanced)      | Low      |
| `pockets`                 | LineChart (volume) or BarChart              | **Strongly recommended** | High     |
| `sasa`                    | LineChart (total) or BarChart (per-residue) | Optional                 | Low      |
| `tmscores`                | LineChart or HeatmapMatrix                  | Optional                 | Low      |
| `clusters`                | BarChart (sizes) + HeatmapMatrix/Sankey     | **Strongly recommended** | High     |

---

## Detailed Mappings

### RMSD (Root Mean Square Deviation)

**Analysis:** `rmsd`

**Chart:** `LineChart` (time series)

- **Data:** x = frame/time, y = RMSD value
- **Features:**
  - Display stats (avg, std, min, max) above chart
  - Enable `yScale` to focus on data range (don't force zero)
  - Single series showing overall RMSD

**3D Viewer:** Optional

- **Rationale:** RMSD is a global metric; alignment visualization isn't essential for quick trend analysis
- **If implemented:** Show reference structure alignment

---

### RMSD Pairwise

**Analysis:** `rmsd-pairwise`

**Chart:** `HeatmapMatrix` (frame×frame similarity)

- **Data:** Symmetric matrix where cell [i,j] = RMSD between frame i and frame j
- **Features:**
  - Use downsampling for large matrices (>512×512)
  - Set `visualMap.realtime = false` to prevent lag
  - Label axes with frame numbers (computed from start/step)

**3D Viewer:** Not needed

- **Rationale:** This is a diagnostic matrix showing frame-to-frame distances, not spatial information

**Performance Notes:**

- For matrices >20,000×20,000, implement stride-based downsampling
- Target ~512×512 visual resolution for smooth interaction

---

### RMSD Pairwise Interface

**Analysis:** `rmsd-pairwise-interface`

**Chart:** `HeatmapMatrix` (same as rmsd-pairwise)

**3D Viewer:** Recommended

- **Rationale:** Interface-specific RMSD benefits from visual context of which residues define the interface
- **Features:**
  - Highlight interface residues on structure
  - Click heatmap cell → show corresponding frames aligned

---

### RMSD Per Residue

**Analysis:** `rmsd-perres`

**Chart:** `BarChart` or `LineChart` (per-residue)

- **Data:** x = residue index/number, y = RMSD value
- **Features:**
  - Option to smooth curve for LineChart
  - Hover shows residue name/number

**3D Viewer:** **Strongly recommended** (High Priority)

- **Rationale:** Spatial distribution of flexibility is key insight
- **Features:**
  - Color residues on structure by RMSD value (B-factor style)
  - Hover residue in chart → highlight in 3D
  - Click residue in 3D → highlight in chart
  - Gradient: blue (rigid) → red (flexible)

---

### RMSDs (Multiple RMSD Curves)

**Analysis:** `rmsds`

**Chart:** `LineChart` (multi-series)

- **Data:** Multiple RMSD curves vs different references or groups
- **Features:**
  - Legend enabled
  - Each series labeled by reference/group name
  - Optional: stats per series

**3D Viewer:** Optional

- **If implemented:** Show alignment to selected reference structure

---

### Radius of Gyration

**Analysis:** `rgyr`

**Chart:** `LineChart` (multi-series)

- **Data:** 4 series: Rg (overall), RgX, RgY, RgZ
- **Features:**
  - Display stats (avg, std, min, max) for each series
  - Two-column grid layout for stats
  - Enable `yScale` to focus on data range
  - Consider small y-axis padding (±5%)

**3D Viewer:** Not needed

- **Rationale:** Rg is a global scalar; doesn't map to specific structural features

---

### Fluctuation (RMSF - Root Mean Square Fluctuation)

**Analysis:** `fluctuation`

**Chart:** `BarChart` or `LineChart` (per-residue)

- **Data:** x = residue index/number, y = RMSF value
- **Features:**
  - Similar to rmsd-perres
  - Optional smoothing for LineChart

**3D Viewer:** **Strongly recommended** (High Priority)

- **Rationale:** RMSF is essentially per-residue B-factors; standard structural biology visualization
- **Features:**
  - Color residues by RMSF (putty representation)
  - Tube thickness can scale with RMSF
  - Gradient: blue (stable) → red (flexible)

---

### Distance Per Residue

**Analysis:** `dist-perres`, `dist-perres-mean`, `dist-perres-stdv`

**Chart:** Depends on data structure

- **Per-residue scalar:** `BarChart` or `LineChart` (x = residue)
- **Pairwise residue–residue distances:** `HeatmapMatrix` (residue×residue)

**3D Viewer:** Recommended

- **Rationale:** Distance changes relate to conformational shifts
- **Features:**
  - Highlight specific residue pairs
  - Show distance measurement in 3D
  - Animate distance changes over time

---

### Hydrogen Bonds

**Analysis:** `hbonds`

**Chart:**

- **Count over time:** `LineChart` (x = frame, y = # bonds)
- **Pair presence matrix:** `HeatmapMatrix` (donor×acceptor, showing occupancy)

**3D Viewer:** Recommended

- **Rationale:** Visualizing H-bond networks in context is valuable
- **Features:**
  - Draw H-bonds as dashed lines
  - Filter by time or occupancy threshold
  - Highlight donor/acceptor residues
  - Click bond in chart → show in 3D

---

### Interactions

**Analysis:** `interactions`

**Chart:**

- **Contact frequency matrix:** `HeatmapMatrix` (agent1×agent2)
- **Future:** Network view for clusters of contacts

**3D Viewer:** Recommended

- **Rationale:** Protein-protein or protein-ligand interfaces need spatial context
- **Features:**
  - Show interacting residues/atoms
  - Color by interaction strength
  - Click contact → zoom to interface

---

### Energies

**Analysis:** `energies`

**Chart:**

- **Components over time:** `LineChart` (multi-series)
- **Component comparison:** Grouped `BarChart` or `StackedAreaChart`

**Data:** Multiple energy terms (electrostatic, VdW, etc.) per agent

**3D Viewer:** Not needed

- **Rationale:** Energies are not inherently spatial unless decomposed per-residue

---

### PCA (Principal Component Analysis)

**Analysis:** `pca`

**Chart:**

- **Variance explained:** `ScreePlot` (eigenvalues)
- **Projection:** `Scatter2D` (PC1 vs PC2)
  - Each point = one frame
  - Optional color by time or cluster

**3D Viewer:** Optional (Advanced feature)

- **Rationale:** Nice-to-have for advanced users
- **Features:**
  - Animate structure along principal components
  - Show displacement arrows for PC modes
  - Interpolate between frames in PC space

---

### Pockets

**Analysis:** `pockets`

**Chart:**

- **Volume over time:** `LineChart` (multi-series if multiple pockets)
- **Per-pocket comparison:** `BarChart` (avg volume or occupancy)

**3D Viewer:** **Strongly recommended** (High Priority)

- **Rationale:** Pocket location and shape are spatial features
- **Features:**
  - Show pocket surfaces (alpha shapes or grid)
  - Color pockets by volume or druggability score
  - Toggle pocket visibility
  - Click pocket in chart → zoom to pocket in 3D

---

### Solvent Accessible Surface Area

**Analysis:** `sasa`

**Chart:**

- **Total SASA over time:** `LineChart`
- **Per-residue SASA:** `BarChart` or `LineChart` (if data available)

**3D Viewer:** Optional

- **Rationale:** Only valuable if per-residue SASA is available
- **If implemented:** Color residues by SASA (buried vs exposed)

---

### TM Scores

**Analysis:** `tmscores`

**Chart:**

- **Over time vs reference:** `LineChart`
- **Pairwise TM-scores:** `HeatmapMatrix` (frame×frame or structure×structure)

**3D Viewer:** Optional

- **If implemented:** Show structural alignment to reference

---

### Clusters

**Analysis:** `clusters`

**Chart:**

- **Cluster sizes:** `BarChart` (x = cluster ID, y = # frames)
- **Transitions:** `HeatmapMatrix` (cluster×cluster) or Sankey diagram (future)
- **Within-cluster similarity:** `HeatmapMatrix` (frames within cluster)

**3D Viewer:** **Strongly recommended** (High Priority)

- **Rationale:** Clustering is all about structural similarity; representative structures are essential
- **Features:**
  - Show representative (centroid) structure per cluster
  - Click cluster in chart → load representative in 3D
  - Overlay multiple cluster representatives
  - Animate transitions between clusters

---

## Component Library

### Existing Chart Components

Location: `src/components/charts/`

- **LineChart.tsx**

  - Use for: RMSD, Rg, Energies (time), SASA, TMScores (time), H-bond count
  - Props: `series`, `xLabel`, `yLabel`, `xScale`, `yScale`, `xMin/xMax/yMin/yMax`
  - Features: zoom slider, axis scaling, multi-series support

- **HeatmapMatrix.tsx**

  - Use for: RMSD pairwise, interaction matrices, distance matrices
  - Props: `data` (triples), `xLabels`, `yLabels`, `title`
  - Features: visualMap slider, progressive rendering
  - Performance: Set `realtime: false` for large matrices

- **BarChart.tsx**

  - Use for: RMSD-perres, RMSF, per-pocket comparisons
  - Props: TBD (implement as needed)

- **ScreePlot.tsx**

  - Use for: PCA eigenvalues
  - Props: TBD (implement as needed)

- **Scatter2D.tsx**

  - Use for: PCA projections (PC1 vs PC2)
  - Props: TBD (implement as needed)

- **StackedAreaChart.tsx**
  - Use for: Energies over time (stacked components)
  - Props: TBD (implement as needed)

### Renderer Architecture

Location: `src/components/layout/recordDetail/recordAnalyses/renderers/`

- **index.tsx** - `AnalysisRenderer` router

  - Routes analysis name/data to specific renderer
  - Uses type guards (`hasStatSeries`, `isRmsdPairwise`)

- **RMSDChart.tsx** - RMSD time series
- **RMSDPairwiseHeatmap.tsx** - RMSD pairwise matrix
- **RgChart.tsx** - Radius of gyration multi-series

**Future renderers to add:**

- RMSDPerResChart.tsx
- FluctuationChart.tsx
- HBondsChart.tsx
- EnergyChart.tsx
- PCAScreePlot.tsx
- PCAScatter.tsx
- PocketsChart.tsx
- ClustersChart.tsx

---

## 3D Viewer Integration

### Priority Levels

**High Priority (Must-Have):**

- rmsd-perres, fluctuation → Color-by-residue metric
- interactions, hbonds → Show contacts/bonds in 3D
- pockets → Show pocket surfaces/locations
- clusters → Show representative structures

**Medium Priority (Recommended):**

- rmsd-pairwise-interface → Highlight interface residues
- dist-perres → Show residue pairs and distances
- hbonds → Draw H-bond networks

**Low Priority (Nice-to-Have):**

- pca → Play modes or show arrows along PCs
- sasa (per-residue) → Color by SASA
- tmscores/rmsds → Show alignment to reference

**Not Needed:**

- rmsd (global time series)
- rgyr
- energies (unless per-residue decomposition available)
- rmsd-pairwise (diagnostic matrix)

### 3D Integration Contract

**Inputs:**

- Structure source (topology + frame/selection)
- Per-residue or per-atom scalar map (optional)
- Residue/atom subset for highlighting (optional)

**Actions:**

```typescript
interface Viewer3DActions {
  loadStructure(topology: Topology, frame?: number): void;
  colorByMetric(metricMap: Map<number, number>): void; // residueId → value
  highlight(selection: number[]): void; // residueIds
  showSurface(surfaceId: string, options?: SurfaceOptions): void;
  clearHighlights(): void;
}
```

**Sync Events:**

- Chart hover → 3D highlight
- Chart click → 3D focus/zoom
- 3D hover → Chart highlight
- 3D click → Chart focus

### Recommended Libraries

- **NGL Viewer** - WebGL-based, excellent performance, rich API
- **Mol\* (molstar)** - Modern, PDB archive's official viewer
- **3Dmol.js** - Lightweight, good for simple use cases

---

## Performance Considerations

### Large Heatmaps (>10,000×10,000)

**Problem:** 20,000×20,000 matrix = 400M cells; browser can't render smoothly

**Solutions:**

1. **Downsampling (stride-based)**

   ```typescript
   const MAX_DIM = 512;
   const stride = Math.max(1, Math.ceil(n / MAX_DIM));
   // Sample every stride-th row and column
   ```

2. **Progressive rendering**

   ```typescript
   series: [
     {
       type: "heatmap",
       progressive: 8000,
       progressiveThreshold: 20000,
       animation: false,
     },
   ];
   ```

3. **Non-realtime visualMap**

   ```typescript
   visualMap: {
     realtime: false; // Only update on slider release
   }
   ```

4. **Hide axis labels for huge grids**
   ```typescript
   axisLabel: {
     show: (labels?.length ?? 0) <= 100;
   }
   ```

### Large Time Series (>100,000 points)

**Solutions:**

- Use progressive rendering
- Disable animation
- Consider time-based aggregation (binning)

---

## Implementation Checklist

### Phase 1: Core Charts (Completed)

- [x] LineChart (RMSD, Rg)
- [x] HeatmapMatrix (RMSD pairwise)
- [x] Stats display (avg/std/min/max)

### Phase 2: Per-Residue Visualizations (High Priority)

- [ ] RMSD-perres renderer
- [ ] Fluctuation (RMSF) renderer
- [ ] 3D viewer integration (NGL/Mol\*)
- [ ] Color-by-metric in 3D

### Phase 3: Interaction & Contacts (Medium Priority)

- [ ] H-bonds renderer (count + matrix)
- [ ] Interactions renderer (contact matrix)
- [ ] Distance per-residue renderer
- [ ] 3D H-bond display

### Phase 4: Advanced Analytics (Lower Priority)

- [ ] PCA ScreePlot + Scatter
- [ ] Pockets renderer + 3D surfaces
- [ ] Clusters visualization + representative structures
- [ ] Energy charts (line + stacked)

### Phase 5: Polish & Optimization

- [ ] Downsampling UI toggle for heatmaps
- [ ] Chart-3D hover/click synchronization
- [ ] Export/screenshot functionality
- [ ] Responsive layouts for mobile

---

## Code Examples

### Adding a New Renderer

1. **Create renderer component** (`renderers/NewAnalysisChart.tsx`)

```typescript
import type { FC } from "react";
import { LineChart } from "@/components/charts";
import type { NewAnalysisData } from "@/types/mdpositTypes";

type NewAnalysisChartProps = {
  data: NewAnalysisData;
};

const NewAnalysisChart: FC<NewAnalysisChartProps> = ({ data }) => {
  // Transform data for chart
  const series = transformData(data);

  return <LineChart series={series} xLabel="X" yLabel="Y" />;
};

export default NewAnalysisChart;
```

2. **Add type guard** (`renderers/utils.ts`)

```typescript
export function isNewAnalysis(obj: unknown): obj is NewAnalysisData {
  // Type checking logic
  return /* ... */;
}
```

3. **Update router** (`renderers/index.tsx`)

```typescript
if (analysisName.startsWith("new-analysis") || isNewAnalysis(data)) {
  return <NewAnalysisChart data={data as NewAnalysisData} />;
}
```

### Implementing 3D Color-by-Metric

```typescript
function colorResiduesByMetric(
  viewer: NGL.Stage,
  component: NGL.Component,
  metricMap: Map<number, number>
) {
  const scheme = NGL.ColormakerRegistry.addScheme((params) => {
    return {
      atomColor: (atom: NGL.AtomProxy) => {
        const value = metricMap.get(atom.residueIndex) ?? 0;
        return valueToColor(value, min, max); // blue → red gradient
      },
    };
  });

  component.addRepresentation("cartoon", { color: scheme });
}
```

---

## Resources

- [ECharts Documentation](https://echarts.apache.org/en/index.html)
- [NGL Viewer](http://nglviewer.org/)
- [Mol\* Viewer](https://molstar.org/)
- [MDAnalysis](https://www.mdanalysis.org/) - For understanding trajectory analysis
- [MDTraj](https://www.mdtraj.org/) - Reference for analysis definitions

---

## Maintenance Notes

**Last Updated:** October 30, 2025

**Current Implementation Status:**

- RMSD, RMSD-pairwise, Rg charts fully functional
- 3D viewer integration pending
- Performance optimizations applied for large heatmaps

**Known Issues:**

- visualMap slider can lag on matrices >10k×10k without downsampling
- Axis labels disappear on very large heatmaps (by design for performance)

**Future Considerations:**

- WebAssembly for heavy matrix operations
- Server-side downsampling/aggregation for extreme datasets
- GPU-accelerated 3D rendering for large structures
