import { useOutletContext } from "react-router";
import type { ExperimentReplicaContextValue } from "./ExperimentReplicaLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Atom, Beaker, Box, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ExperimentOverview = () => {
  const { replicaRecord } = useOutletContext<ExperimentReplicaContextValue>();

  if (!replicaRecord) {
    return <p className="text-muted-foreground">No replica data available.</p>;
  }

  const { metadata } = replicaRecord;

  // Calculate simulation length (frames * framestep in ns)
  const simulationLength =
    metadata.mdFrames && metadata.FRAMESTEP
      ? metadata.mdFrames * metadata.FRAMESTEP
      : null;

  // Calculate box volume (X * Y * Z in nm³)
  const boxVolume =
    metadata.BOXSIZEX && metadata.BOXSIZEY && metadata.BOXSIZEZ
      ? metadata.BOXSIZEX * metadata.BOXSIZEY * metadata.BOXSIZEZ
      : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-3">
        {/* Force Field & Water Model Card */}
        {(metadata.FF || metadata.WAT) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Beaker className="h-4 w-4" />
                Force Field & Water Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metadata.FF && metadata.FF.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-2">
                    Force Field(s)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {metadata.FF.map((ff, idx) => (
                      <Badge key={idx} variant="secondary">
                        {ff}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {metadata.WAT && (
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">
                    Water Model
                  </div>
                  <div className="text-sm font-medium">{metadata.WAT}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Simulation Parameters Card - spans 2 columns if Force Field card is hidden */}
        {(metadata.FRAMESTEP ||
          metadata.TIMESTEP ||
          metadata.TEMP ||
          metadata.ENSEMBLE ||
          metadata.mdFrames ||
          simulationLength) && (
          <Card
            className={
              !metadata.FF && !metadata.WAT ? "md:col-span-3" : "md:col-span-2"
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Thermometer className="h-4 w-4" />
                Simulation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-[1fr_auto_1fr] lg:gap-8 md:gap-6 gap-4">
              <div className="space-y-3">
                {metadata.mdFrames && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Frames (Snapshots)
                    </span>
                    <span className="text-sm font-medium">
                      {metadata.mdFrames}
                    </span>
                  </div>
                )}
                {metadata.FRAMESTEP && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Frequency
                    </span>
                    <span className="text-sm font-medium">
                      {metadata.FRAMESTEP * 1000} ps
                    </span>
                  </div>
                )}
                {simulationLength && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Simulation Length
                    </span>
                    <span className="text-sm font-medium">
                      {simulationLength} ns
                    </span>
                  </div>
                )}
              </div>
              <Separator orientation="vertical" className="hidden sm:block" />
              <div className="space-y-3">
                {metadata.TIMESTEP && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Timestep
                    </span>
                    <span className="text-sm font-medium">
                      {metadata.TIMESTEP} fs
                    </span>
                  </div>
                )}
                {metadata.TEMP && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Temperature
                    </span>
                    <span className="text-sm font-medium">
                      {metadata.TEMP} K
                    </span>
                  </div>
                )}
                {metadata.ENSEMBLE && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Ensemble
                    </span>
                    <span className="text-sm font-medium">
                      {metadata.ENSEMBLE}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Simulation Box Card */}
      {(metadata.BOXTYPE ||
        metadata.BOXSIZEX ||
        metadata.BOXSIZEY ||
        metadata.BOXSIZEZ ||
        boxVolume) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Simulation Box
              </div>
              {metadata.BOXSIZEX && (
                <Badge variant="secondary" className="text-sm">
                  {metadata.BOXTYPE}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto_1fr] gap-4">
              <div className="col-span-3">
                <div className="text-xs text-muted-foreground uppercase mb-2">
                  Box Dimensions (nm)
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted border border-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">X</div>
                    <div className="text-lg font-semibold">
                      {metadata.BOXSIZEX ? metadata.BOXSIZEX.toFixed(3) : "N/A"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted border border-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Y</div>
                    <div className="text-lg font-semibold">
                      {metadata.BOXSIZEY ? metadata.BOXSIZEY.toFixed(3) : "N/A"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted border border-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Z</div>
                    <div className="text-lg font-semibold">
                      {metadata.BOXSIZEZ ? metadata.BOXSIZEZ.toFixed(3) : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <Separator orientation="vertical" className="hidden sm:block" />
              <div className="col-span-1 flex flex-col">
                <div className="text-xs text-muted-foreground uppercase mb-2">
                  Box Volume (nm³)
                </div>
                <div className="flex-1 flex items-center justify-center p-3 bg-primary/5 rounded-lg border border-primary/10 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {boxVolume ? boxVolume.toFixed(2) : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* System Composition Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Atom className="h-5 w-5" />
            System Composition
          </CardTitle>
          <CardDescription>
            Detailed breakdown of atoms and residues in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total System */}
            <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="text-xs font-semibold text-primary uppercase">
                Total System
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Atoms</span>
                <span className="text-sm font-medium">
                  {metadata.SYSTATS != null
                    ? metadata.SYSTATS.toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Residues</span>
                <span className="text-sm font-medium">
                  {metadata.SYSTRES != null
                    ? metadata.SYSTRES.toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-xs font-semibold text-foreground uppercase">
                Protein
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Atoms</span>
                <span className="text-sm font-medium">
                  {metadata.PROTATS != null
                    ? metadata.PROTATS.toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Residues</span>
                <span className="text-sm font-medium">
                  {metadata.PROTRES != null
                    ? metadata.PROTRES.toLocaleString()
                    : metadata.PROT != null
                    ? metadata.PROT
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Nucleic Acids */}
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-xs font-semibold text-foreground uppercase">
                Nucleic Acids
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Atoms</span>
                <span className="text-sm font-medium">
                  {metadata.NUCLATS != null
                    ? metadata.NUCLATS.toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Residues</span>
                <span className="text-sm font-medium">
                  {metadata.NUCLRES != null
                    ? metadata.NUCLRES.toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Lipids */}
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-xs font-semibold text-foreground uppercase">
                Lipids
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Atoms</span>
                <span className="text-sm font-medium">
                  {metadata.LIPIATS != null
                    ? metadata.LIPIATS.toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Residues</span>
                <span className="text-sm font-medium">
                  {metadata.LIPIRES != null
                    ? metadata.LIPIRES.toLocaleString()
                    : "N/A"}
                </span>
              </div>
              {metadata.DPPC && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">DPPC</span>
                  <span className="text-sm font-medium">{metadata.DPPC}</span>
                </div>
              )}
            </div>

            {/* Carbohydrates */}
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-xs font-semibold text-foreground uppercase">
                Carbohydrates
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Atoms</span>
                <span className="text-sm font-medium">
                  {metadata.CARBATS != null
                    ? metadata.CARBATS.toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Residues</span>
                <span className="text-sm font-medium">
                  {metadata.CARBRES != null
                    ? metadata.CARBRES.toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Solvent */}
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-xs font-semibold text-foreground uppercase">
                Solvent
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Atoms</span>
                <span className="text-sm font-medium">
                  {metadata.SOLVATS != null
                    ? metadata.SOLVATS.toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Residues</span>
                <span className="text-sm font-medium">
                  {metadata.SOLVRES != null
                    ? metadata.SOLVRES.toLocaleString()
                    : metadata.SOL != null
                    ? metadata.SOL
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Counter-Ions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Counter-Ions
          </CardTitle>
          <CardDescription>
            Ions added to neutralize the system charge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Cations (+)
              </span>
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                {metadata.COUNCAT != null
                  ? metadata.COUNCAT.toLocaleString()
                  : metadata.NA != null
                  ? metadata.NA.toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Anions (-)
              </span>
              <span className="text-sm font-semibold text-red-900 dark:text-red-300">
                {metadata.COUNANI != null
                  ? metadata.COUNANI.toLocaleString()
                  : metadata.CL != null
                  ? metadata.CL.toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                Total Ions
              </span>
              <span className="text-2xl font-bold">
                {metadata.COUNION != null
                  ? metadata.COUNION.toLocaleString()
                  : (metadata.COUNCAT != null || metadata.NA != null) &&
                    (metadata.COUNANI != null || metadata.CL != null)
                  ? (
                      (metadata.COUNCAT ?? metadata.NA ?? 0) +
                      (metadata.COUNANI ?? metadata.CL ?? 0)
                    ).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperimentOverview;
