import { useCallback, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { Loader2 } from "lucide-react";

import type { ExperimentReplicaContextValue } from "./ExperimentReplicaLayout";
import {
  useTrajectoryViewer,
  type TrajectoryRequest,
} from "./useTrajectoryViewer";
import MolstarCanvas, {
  MolstarViewerStatusOptions,
  type MolstarSource,
  type MolstarViewerStatus,
} from "@/components/molecule/MolstarCanvas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ProjectMD } from "@/types/mdpositTypes";

const ExperimentTrajectory = () => {
  const { replicaRecord, replicaInstanceId, isReplicaLoading, replicaError } =
    useOutletContext<ExperimentReplicaContextValue>();

  const [frames, setFrames] = useState<string>("");
  const [selection, setSelection] = useState<string>("");

  const [viewerStatus, setViewerStatus] = useState<MolstarViewerStatus>(
    MolstarViewerStatusOptions.IDLE
  );

  const [viewerError, setViewerError] = useState<string | null>(null);

  const instanceId = replicaInstanceId ?? replicaRecord?.accession;

  const {
    structureText,
    isStructureLoading,
    structureError,
    viewerSource,
    loadState,
    loadError,
    loadTrajectory,
  } = useTrajectoryViewer(instanceId);

  const readyStateLabel = useMemo(() => {
    if (isStructureLoading || isReplicaLoading) return "Loading structure…";
    if (loadState === MolstarViewerStatusOptions.LOADING)
      return "Downloading trajectory frames…";
    if (viewerError) return viewerError;
    if (structureError)
      return (structureError as Error).message ?? "Failed to load structure.";
    if (!viewerSource) return "Structure unavailable.";
    if (viewerStatus === MolstarViewerStatusOptions.LOADING)
      return "Preparing viewer…";
    return null;
  }, [
    isStructureLoading,
    isReplicaLoading,
    loadState,
    viewerError,
    structureError,
    viewerSource,
    viewerStatus,
  ]);

  const handleViewerStatusChange = useCallback(
    (status: MolstarViewerStatus, info?: { message?: string | null }) => {
      setViewerStatus(status);
      setViewerError(info?.message ?? null);
    },
    []
  );

  const handleLoadTrajectory = useCallback(() => {
    if (!structureText) return;
    const nextRequest: TrajectoryRequest = {
      frames: frames.trim() || undefined,
      selection: selection.trim() || undefined,
    };
    loadTrajectory(nextRequest);
  }, [structureText, frames, selection, loadTrajectory]);

  if (isReplicaLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading replica details…
      </div>
    );
  }

  if (replicaError) {
    return (
      <p className="text-destructive">
        Failed to load replica: {replicaError.message}
      </p>
    );
  }

  if (!replicaRecord || !instanceId) {
    return <p className="text-muted-foreground">Replica unavailable.</p>;
  }

  const { metadata } = replicaRecord;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 2xl:grid-cols-[1fr_2fr]">
        <TrajectoryOverviewCard metadata={metadata} />

        <TrajectoryRequestCard
          frames={frames}
          selection={selection}
          onFramesChange={setFrames}
          onSelectionChange={setSelection}
          onSubmit={handleLoadTrajectory}
          loadState={loadState}
          loadError={loadError}
          disableRequest={
            !structureText ||
            loadState === MolstarViewerStatusOptions.LOADING ||
            isStructureLoading ||
            Boolean(structureError)
          }
          showStructureHint={!structureText && !isStructureLoading}
        />
      </div>
      <TrajectoryViewerCard
        viewerSource={viewerSource}
        readyStateLabel={readyStateLabel}
        onStatusChange={handleViewerStatusChange}
      />
    </div>
  );
};

export default ExperimentTrajectory;

interface TrajectoryOverviewCardProps {
  metadata: ProjectMD["metadata"];
}

const TrajectoryOverviewCard = ({ metadata }: TrajectoryOverviewCardProps) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Trajectory overview</CardTitle>
      <CardDescription>
        Snapshot of the simulation window available for this replica
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 grid-cols-4 2xl:grid-cols-2">
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Frames</div>
        <div className="text-2xl font-semibold">
          {metadata.mdFrames?.toLocaleString() ?? "—"}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">
          Frame step
        </div>
        <div className="text-2xl font-semibold">
          {metadata.FRAMESTEP ? `${metadata.FRAMESTEP * 1000} ps` : "—"}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Atoms</div>
        <div className="text-2xl font-semibold">
          {metadata.mdAtoms?.toLocaleString() ?? metadata.SYSTATS ?? "—"}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs uppercase text-muted-foreground">Type</div>
        <Badge variant="secondary">{metadata.TYPE ?? "Trajectory"}</Badge>
      </div>
    </CardContent>
  </Card>
);

interface TrajectoryRequestCardProps {
  frames: string;
  selection: string;
  loadState: MolstarViewerStatus;
  loadError: string | null;
  disableRequest: boolean;
  showStructureHint: boolean;
  onFramesChange: (value: string) => void;
  onSelectionChange: (value: string) => void;
  onSubmit: () => void;
}

const TrajectoryRequestCard = ({
  frames,
  selection,
  loadState,
  loadError,
  disableRequest,
  showStructureHint,
  onFramesChange,
  onSelectionChange,
  onSubmit,
}: TrajectoryRequestCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Request frames</CardTitle>
      <CardDescription>
        Limit the amount of data pulled into the browser before loading.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-96 space-y-2">
          <Label htmlFor="frames">Frame window</Label>
          <Input
            id="frames"
            placeholder="e.g. 0:1000:10"
            value={frames}
            onChange={(event) => onFramesChange(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use MDposit frame syntax (<code>start:end:stride</code>). Leave
            empty to stream the whole trajectory (can be very large).
          </p>
        </div>
        <div className="flex-1 min-w-96 space-y-2">
          <Label htmlFor="selection">Selection (optional)</Label>
          <Input
            id="selection"
            placeholder="e.g. protein and chain A"
            value={selection}
            onChange={(event) => onSelectionChange(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Same syntax as MDAnalysis selections. Useful to focus on a subset
            before download.
          </p>
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Button onClick={onSubmit} disabled={disableRequest}>
          {loadState === MolstarViewerStatusOptions.LOADING && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Load trajectory
        </Button>
        {loadError && <p className="text-xs text-destructive">{loadError}</p>}
        {showStructureHint && (
          <p className="text-xs text-muted-foreground">
            Waiting for base structure before loading trajectory.
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

interface TrajectoryViewerCardProps {
  viewerSource?: MolstarSource;
  readyStateLabel: string | null;
  onStatusChange: (
    status: MolstarViewerStatus,
    info?: { message?: string | null }
  ) => void;
}

const TrajectoryViewerCard = ({
  viewerSource,
  readyStateLabel,
  onStatusChange,
}: TrajectoryViewerCardProps) => (
  <Card className="relative min-h-[800px]">
    <CardHeader>
      <CardTitle>Interactive viewer</CardTitle>
      <CardDescription>
        Start with the static structure; once frames load you can play back the
        trajectory.
      </CardDescription>
    </CardHeader>
    <CardContent className="relative">
      {viewerSource && (
        <MolstarCanvas
          source={viewerSource}
          height={700}
          onStatusChange={onStatusChange}
        />
      )}
      {readyStateLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-background/85 text-sm text-muted-foreground">
          {readyStateLabel}
        </div>
      )}
    </CardContent>
  </Card>
);
