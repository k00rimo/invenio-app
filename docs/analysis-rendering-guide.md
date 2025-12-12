# Analysis Rendering Guide

This document maps each MDposit analysis type to the appropriate chart component and indicates where 3D molecular visualization adds value.

## Quick Reference Table

| Analysis                  | Chart Component                              | 3D Viewer                | Priority |
| ------------------------- | -------------------------------------------- | ------------------------ | -------- |
| `rmsd`                    | LineChart (time series)                      | Optional                 | Low      |
| `rmsd-pairwise`           | HeatmapMatrix (frame×frame)                  | Not needed               | N/A      |
| `rmsd-pairwise-interface` | HeatmapMatrix                                | Recommended              | Medium   |
| `rmsd-perres`             | BarChart or LineChart (per-residue)          | **Strongly recommended** | High     |
| `rmsds`                   | LineChart (multi-series)                     | Optional                 | Low      |
| `rgyr`                    | LineChart (multi-series: Rg, RgX/Y/Z)        | Not needed               | N/A      |
| `fluctuation` (RMSF)      | BarChart or LineChart (per-residue)          | **Strongly recommended** | High     |
| `dist-perres`             | BarChart/LineChart or HeatmapMatrix          | Recommended              | Medium   |
| `hbonds`                  | LineChart (count) or HeatmapMatrix (pairs)   | Recommended              | Medium   |
| `interactions`            | HeatmapMatrix (contact frequency)            | Recommended              | Medium   |
| `energies`                | LineChart + StackedAreaChart                 | Not needed               | N/A      |
| `pca`                     | ScreePlot + Scatter2D                        | Optional (advanced)      | Low      |
| `pockets`                 | LineChart (volume) or BarChart               | **Strongly recommended** | High     |
| `mem-map`                 | BarChart (leaflet composition) + LabeledList | **Strongly recommended** | High     |
| `apl`                     | HeatmapMatrix (leaflet grid) + LineChart     | Recommended              | Medium   |
| `density`                 | LineChart (metric toggle, z-profile)         | Not needed               | N/A      |
| `lipid-inter`             | HeatmapMatrix (residue×lipid occupancy)      | **Strongly recommended** | High     |
| `lipid-order`             | LineChart (avg ± std envelope)               | Recommended              | Medium   |
| `thickness`               | LineChart (thickness + midplane drift)       | Recommended              | Medium   |
| `sasa`                    | LineChart (total) or BarChart (per-residue)  | Optional                 | Low      |
| `tmscores`                | LineChart or HeatmapMatrix                   | Optional                 | Low      |
| `clusters`                | BarChart (sizes) + HeatmapMatrix/Sankey      | **Strongly recommended** | High     |

## Renderer Coverage Status

**Source:** `src/components/layout/record/recordAnalyses/renderers/index.tsx`

**Implemented renderers**

- `rmsd` → `RMSDChart`
- `rmsd-pairwise` → `RMSDPairwiseHeatmap`
- `rmsd-pairwise-interface` → `RMSDPairwiseInterfacePanel`
- `rmsds` → `RMSDsChart`
- `rgyr` → `RgChart`
- `fluctuation` → `FluctuationChart`
- `rmsd-perres` → `RMSDPerResidueChart`
- `tmscores` → `TMScoresChart`
- `pca` → `PcaAnalysisPanel`
- `pockets` → `PocketsAnalysisPanel`
- `sasa` → `SasaAnalysisPanel`
- `dist-perres` (and mean/std variants) → `DistancePerResiduePanel`
- `hbonds` → `HydrogenBondsAnalysisPanel`
- `interactions` → `InteractionsAnalysisPanel`
- `mem-map` → `MembraneMapAnalysisPanel`
- `apl` → `AreaPerLipidPanel`
- `lipid-inter` → `LipidInteractionsPanel`
- `thickness` → `ThicknessAnalysisPanel`
- `density` → `DensityProfilePanel`
- `lipid-order` → `LipidOrderPanel`
- `energies` → `EnergiesPanel`
- `clusters` → `ClustersPanel`

**Pending / placeholder**

- _None_

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

**Chart:** `RMSDPairwiseInterfacePanel` (HeatmapMatrix + summary cards)

- Summary cards report the active interface, captured frame count, frame step, and raw matrix resolution so reviewers know exactly which subset is on display.
- A selector surfaces every available interaction while downsampling badges (stride + raw dims) explain how the heatmap was thinned for responsive rendering.
- The `HeatmapMatrix` inherits the downsampled axis labels so even aggregated frame windows remain traceable to concrete frame indices.

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

**Chart:** `DistancePerResiduePanel`

- Interaction selector + view toggle (mean vs std) drive the data set actually sent to the chart
- Downsampled `HeatmapMatrix` (residue×residue) keeps rendering smooth even for 1000×1000 matrices; axes relabel aggregated bins
- Sidebar calls out residue counts, min/avg/max distances, plus the top-N closest residue pairs so users can triage without reading the heatmap

**3D Viewer:** Recommended

- **Rationale:** Distance changes relate to conformational shifts
- **Features:**
  - Highlight specific residue pairs
  - Show distance measurement in 3D
  - Animate distance changes over time

---

### Hydrogen Bonds

**Analysis:** `hbonds`

**Chart:** `HydrogenBondsAnalysisPanel`

- Line chart shows bond counts per frame with numeric stats (avg/max) above the plot
- Occupancy heatmap uses bonds on the y-axis, frame windows on the x-axis (binary 0/1) and auto-downsampling for very long trajectories
- Sidebar summarizes per-interaction bond counts and lists the most persistent bonds with donor/acceptor indices

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

**Chart:** `InteractionsAnalysisPanel`

- When residue-level indices are available we visualize the declared interface residues via a categorical `HeatmapMatrix`
- Cell values encode which partner(s) are marked as interface (0=none, 1=agent2, 2=agent1, 3=both) so hotspots still pop out even without occupancy data
- If the API only returns atom-level selections (current behavior for most systems) the panel falls back to summary cards and interface snapshots while explicitly stating that the heatmap is unavailable
- Info card highlights total counts per agent plus a truncated list of interface residues/atoms for quick inspection
- Future work can swap the categorical matrix for real contact frequencies once they are part of the payload

**3D Viewer:** Recommended

- **Rationale:** Protein-protein or protein-ligand interfaces need spatial context
- **Features:**
  - Show interacting residues/atoms
  - Color by interaction strength
  - Click contact → zoom to interface

---

### Energies

**Analysis:** `energies`

**Chart:** `EnergiesPanel` (LineChart + StackedArea)

- Per-interaction selector drives both the `LineChart` and the stacked area view; users can also toggle between `agent1`/`agent2` and choose overall, initial, or final energy stages
- The multi-series line plot renders electrostatic, Van der Waals, and combined energies per residue using the trimmed label list for the X-axis so both agents stay aligned
- A synchronized `StackedAreaChart` highlights how the three components accumulate along the sequence, making it easy to spot where VdW terms dominate
- Summary cards surface residue counts, stage/agent context, and the peak absolute contribution while a side list reports the top-N residues sorted by |energy|

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

### Membrane Map

**Analysis:** `mem-map`

**Chart:** `BarChart` (per-membrane leaflet composition) + `LabeledList`

- Aggregate counts of residues/lipids assigned to the top vs bottom leaflet for every membrane entry
- Stack bars by leaflet (top/bottom) so total height conveys total lipids; tooltip should list residue indices for drill-down
- Use a companion `LabeledList`/table to surface polar atom indices and the `no_mem_lipid` bucket so nothing silently disappears
- Provide filters for individual membranes when `n_mems > 1`

**3D Viewer:** **Strongly recommended**

- Color lipids by leaflet (e.g., blue top, orange bottom) to instantly verify assignments
- Highlight polar atoms with a separate representation (spheres) to validate interface definitions
- Select the "unassigned" group to spotlight lipids that failed the leaflet heuristic

---

### Area Per Lipid

**Analysis:** `apl`

**Chart:** `HeatmapMatrix` (upper vs lower leaflet grids) + `LineChart` (global stats)

- Render two heatmaps (tabs or side-by-side) that map `grid_x × grid_y` onto color-coded Angstrom^2 values for each leaflet
- Use a synchronized color scale across both leaflets; expose `median`/`std` near the charts as a quick health check
- Allow optional contour overlays or crosshair readouts for exact area values at a grid point
- Complement the heatmaps with a `LineChart` showing median ± std over simulation time when multiple frames are available

**3D Viewer:** Recommended

- Project the heatmap onto the bilayer plane in 3D or color lipids by their instantaneous area to reveal hot/cold spots
- Offer a toggle that snaps the camera to a top-down view for easier comparison with the 2D maps

---

### Density Profile

**Analysis:** `density`

**Chart:** `DensityProfilePanel` (LineChart + stat grid)

- Metric selector switches between number, mass, charge, and electron density while a secondary select flips between raw densities and the reported standard deviations
- The LineChart builds one series per component, sharing the native `z` samples across every metric so comparisons stay synchronized; dynamic axis labels update with the chosen units
- Info cards summarize sample counts, component totals, and the active metric/mode, and the component list annotates selection sizes plus the peak magnitude (with units) for quick QC

**3D Viewer:** Not needed

- Optional nicety: highlight the spatial selection of the currently hovered component

---

### Lipid Interactions

**Analysis:** `lipid-inter`

**Chart:** `HeatmapMatrix` (residue×lipid occupancy)

- Rows = residue indices from `residue_indices`; columns = lipid species (InChI keys) with cell color showing contact frequency
- For large lipid sets, group by headgroup/chain type and expose a drill-down when a user clicks a column header
- Allow sorting by max occupancy, cumulative counts, or residue number to surface dominant interactions quickly
- Tooltips should show absolute counts plus normalized percentage over the trajectory window

**3D Viewer:** **Strongly recommended**

- Clicking a heatmap cell should highlight the residue and lipid simultaneously in 3D
- Provide interface filters (lipid species, residue range) synchronized between the chart and 3D viewer to inspect hotspots

---

### Lipid Order

**Analysis:** `lipid-order`

**Chart:** `LipidOrderPanel` (LineChart + metadata chips)

- Dual selectors pick the lipid species and the requested segment/leaflet, then the chart renders the average order parameter with two companion lines (`avg ± std`) so the breathing window is visible without extra shaders
- Stat cards summarize chain length, average S, max S, and the mean standard deviation; the active segment label appears as a badge above the plot
- Atom labels are rendered as badges (index + atom name) beneath the chart which makes it easy to map line-chart positions back to the physical carbon list

**3D Viewer:** Recommended

- Color lipid tails by the currently selected series to show ordered vs disordered regions in situ
- Provide quick-select actions (clicking a series) that highlight matching lipids within the membrane patch

---

### Membrane Thickness

**Analysis:** `thickness`

**Chart:** `ThicknessAnalysisPanel` (dual `LineChart`s + stat cards)

- Primary time-series line plots mean `thickness` with a lightly shaded ±`std_thickness` band and overlays `mean_positive` / `mean_negative` so leaflet offsets are visible at a glance
- Secondary `LineChart` tracks `midplane_z` drift whenever those samples exist; otherwise the panel surfaces a friendly placeholder explaining the missing data
- Stat cards summarize overall averages, midplane drift range, and per-leaflet separation alongside the most recent frame’s readings
- Threshold badges flag excursions beyond ±0.5 Å from the running median so reviewers can quickly triage unstable segments

**3D Viewer:** Recommended

- Draw translucent surfaces for the positive/negative leaflets and animate through time for noticeable breathing modes
- Clicking a frame in the chart should update the viewer, highlighting regions exceeding a user-defined deviation threshold

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

**Chart:** `ClustersPanel` (BarChart + HeatmapMatrix + transition list)

- Summary cards call out the number of clusters, total frames, cutoff, and clustering version so analysts can confirm parameters immediately.
- The BarChart highlights up to the top 20 clusters by population, with a badge reminding users when additional clusters exist off-chart.
- A transition `HeatmapMatrix` encodes origin→destination counts, paired with a tooltip that spells out the exact cluster flow and an auxiliary list of the six most frequent transitions.

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
- ClustersChart.tsx
- MembraneMapOverview.tsx
- AreaPerLipidHeatmap.tsx
- DensityProfileChart.tsx
- LipidInteractionHeatmap.tsx
- LipidOrderChart.tsx

---

## 3D Viewer Integration

### Priority Levels

**High Priority (Must-Have):**

- rmsd-perres, fluctuation → Color-by-residue metric
- mem-map, lipid-inter → Validate leaflet assignments and lipid-contact hotspots
- pockets → Show pocket surfaces/locations
- clusters → Show representative structures

**Medium Priority (Recommended):**

- rmsd-pairwise-interface → Highlight interface residues
- dist-perres → Show residue pairs and distances
- hbonds, interactions → Draw contact networks in structural context
- apl, lipid-order, thickness → Compare leaflet shape/order and highlight deviations on the membrane

**Low Priority (Nice-to-Have):**

- pca → Play modes or show arrows along PCs
- sasa (per-residue) → Color by SASA
- tmscores/rmsds → Show alignment to reference
- density → Optional link between profile curves and spatial selections

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
