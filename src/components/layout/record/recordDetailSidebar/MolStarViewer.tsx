import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MolstarCanvas, {
  MolstarSourceOptions,
  MolstarViewerStatusOptions,
  type MolstarStructureSource,
  type MolstarViewerStatus,
} from "@/components/molecule/MolstarCanvas";

import { getProjectStructure } from "@/api/projects";

const decodeStructurePayload = (payload: ArrayBuffer | string): string => {
  if (typeof payload === "string") {
    return payload;
  }
  try {
    return new TextDecoder().decode(payload);
  } catch (error) {
    console.error("Failed to decode structure payload", error);
    return "";
  }
};

interface MolStarViewerProps {
  projectId?: string;
  selection?: string;
  height?: number;
}

const MolStarViewer = ({
  projectId,
  selection,
  height = 300,
}: MolStarViewerProps) => {
  const [viewerStatus, setViewerStatus] = useState<MolstarViewerStatus>(
    MolstarViewerStatusOptions.IDLE
  );
  const [viewerError, setViewerError] = useState<string | null>(null);

  const {
    data: structure,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project-structure", projectId, selection ?? "full"],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Missing project id");
      }
      const payload = await getProjectStructure(projectId, {
        selection,
        responseType: "text",
      });
      return decodeStructurePayload(payload);
    },
    enabled: Boolean(projectId),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

  const source = useMemo<MolstarStructureSource | undefined>(() => {
    if (!structure || !projectId) {
      return undefined;
    }
    return {
      kind: MolstarSourceOptions.STRUCTURE,
      data: structure,
      format: "pdb",
      label: `${projectId}.pdb`,
    };
  }, [projectId, structure]);

  const handleViewerStatusChange = useCallback(
    (
      status: MolstarViewerStatus,
      info?: {
        message?: string | null;
      }
    ) => {
      setViewerStatus(status);
      setViewerError(info?.message ?? null);
    },
    []
  );

  const renderState = () => {
    if (!projectId) {
      return "No project selected.";
    }
    if (isLoading) {
      return "Loading structure…";
    }
    if (isError) {
      return error.message;
    }
    if (!structure || !source) {
      return "Structure unavailable for this record.";
    }
    if (viewerStatus === MolstarViewerStatusOptions.LOADING) {
      return "Preparing viewer…";
    }
    if (viewerStatus === MolstarViewerStatusOptions.ERROR && viewerError) {
      return viewerError;
    }
    return null;
  };

  const stateMessage = renderState();

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-border/60 bg-background"
      style={{ minHeight: height }}
    >
      {stateMessage && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/80 text-xs text-muted-foreground">
          {stateMessage}
        </div>
      )}
      <MolstarCanvas
        source={source}
        height={height}
        className={stateMessage ? "opacity-0" : "opacity-100"}
        variant="minimal"
        onStatusChange={handleViewerStatusChange}
      />
    </div>
  );
};

export default MolStarViewer;
