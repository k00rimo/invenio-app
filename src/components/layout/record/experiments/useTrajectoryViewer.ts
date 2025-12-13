import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getProjectStructure, getProjectTrajectory } from "@/api/projects";
import {
  MolstarViewerStatusOptions,
  type MolstarSource,
  type MolstarTrajectorySource,
  type MolstarViewerStatus,
} from "@/components/molecule/MolstarCanvas";
import type { BuiltInCoordinatesFormat } from "molstar/lib/mol-plugin-state/formats/coordinates";
import type { BuiltInTrajectoryFormat } from "molstar/lib/mol-plugin-state/formats/trajectory";

const decodeStructurePayload = (payload: ArrayBuffer | string): string => {
  if (typeof payload === "string") return payload;
  try {
    return new TextDecoder().decode(payload);
  } catch (error) {
    console.error("Failed to decode structure payload", error);
    return "";
  }
};

const MODEL_FORMAT: BuiltInTrajectoryFormat = "pdb";
const COORDINATE_FORMAT: BuiltInCoordinatesFormat = "xtc";

export interface TrajectoryRequest {
  frames?: string;
  selection?: string;
}

export interface UseTrajectoryViewerResult {
  structureText?: string;
  structureSource?: MolstarSource;
  isStructureLoading: boolean;
  structureError: unknown;
  viewerSource?: MolstarSource;
  loadState: MolstarViewerStatus;
  loadError: string | null;
  loadTrajectory: (request: TrajectoryRequest) => void;
}

export const useTrajectoryViewer = (
  instanceId?: string
): UseTrajectoryViewerResult => {
  const queryClient = useQueryClient();
  const [trajectoryRequest, setTrajectoryRequest] =
    useState<TrajectoryRequest | null>(null);

  const {
    data: structureText,
    isLoading: isStructureLoading,
    error: structureError,
  } = useQuery({
    queryKey: ["trajectory-structure", instanceId],
    enabled: Boolean(instanceId),
    queryFn: async () => {
      if (!instanceId) throw new Error("Missing project id");
      const payload = await getProjectStructure(instanceId, {
        responseType: "text",
      });
      return decodeStructurePayload(payload);
    },
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (!instanceId) {
      setTrajectoryRequest(null);
      return;
    }
    const cached = queryClient.getQueryData<TrajectoryRequest | null>([
      "trajectory-request",
      instanceId,
    ]);
    setTrajectoryRequest(cached ?? null);
  }, [instanceId, queryClient]);

  const trajectoryQueryKey = [
    "trajectory-data",
    instanceId,
    trajectoryRequest?.frames ?? "",
    trajectoryRequest?.selection ?? "",
  ] as const;

  const {
    data: trajectoryPayload,
    error: trajectoryError,
    isFetching,
  } = useQuery({
    queryKey: trajectoryQueryKey,
    enabled: Boolean(instanceId && trajectoryRequest),
    queryFn: async ({ queryKey }) => {
      const [, currentInstanceId, framesKey, selectionKey] = queryKey;
      if (!currentInstanceId) throw new Error("Missing project id");
      return getProjectTrajectory(currentInstanceId, {
        format: COORDINATE_FORMAT,
        frames: framesKey || undefined,
        selection: selectionKey || undefined,
      });
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  const structureSource = useMemo<MolstarSource | undefined>(() => {
    if (!structureText || !instanceId) return undefined;
    return {
      kind: "structure",
      data: structureText,
      format: MODEL_FORMAT,
      label: `${instanceId}.pdb`,
    };
  }, [structureText, instanceId]);

  const trajectorySource = useMemo<MolstarTrajectorySource | undefined>(() => {
    if (!trajectoryPayload || !structureText || !instanceId) return undefined;
    return {
      kind: "trajectory",
      model: {
        data: structureText,
        format: MODEL_FORMAT,
        label: `${instanceId}.pdb`,
      },
      coordinates: {
        data: trajectoryPayload,
        format: COORDINATE_FORMAT,
        label: `${instanceId}.${COORDINATE_FORMAT}`,
      },
    };
  }, [trajectoryPayload, structureText, instanceId]);

  const viewerSource: MolstarSource | undefined =
    trajectorySource ?? structureSource;

  const loadError = trajectoryError
    ? trajectoryError instanceof Error
      ? trajectoryError.message
      : "Failed to load trajectory."
    : null;

  const loadState = trajectoryRequest
    ? isFetching
      ? MolstarViewerStatusOptions.LOADING
      : loadError
      ? MolstarViewerStatusOptions.ERROR
      : MolstarViewerStatusOptions.IDLE
    : MolstarViewerStatusOptions.IDLE;

  const loadTrajectory = useCallback(
    (request: TrajectoryRequest) => {
      if (!instanceId) return;
      setTrajectoryRequest(request);
      queryClient.setQueryData(["trajectory-request", instanceId], request);
    },
    [instanceId, queryClient]
  );

  return {
    structureText,
    structureSource,
    isStructureLoading,
    structureError,
    viewerSource,
    loadState,
    loadError,
    loadTrajectory,
  };
};
