import { useEffect, useRef, useState } from "react";
import type {
  LoadTrajectoryParams,
  Viewer as MolstarViewerInstance,
} from "molstar/lib/apps/viewer/app";
import { Viewer as MolstarViewer } from "molstar/lib/apps/viewer/app";
import type { BuiltInTrajectoryFormat } from "molstar/lib/mol-plugin-state/formats/trajectory";
import type { BuiltInCoordinatesFormat } from "molstar/lib/mol-plugin-state/formats/coordinates";
import "molstar/build/viewer/molstar.css";
import "./MolstarCanvas.css";

export const MolstarViewerStatusOptions = {
  IDLE: "idle",
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
} as const;

export type MolstarViewerStatus =
  (typeof MolstarViewerStatusOptions)[keyof typeof MolstarViewerStatusOptions];

export const MolstarSourceOptions = {
  STRUCTURE: "structure",
  TRAJECTORY: "trajectory",
} as const;

export type MolstarSourceType =
  (typeof MolstarSourceOptions)[keyof typeof MolstarSourceOptions];

export interface MolstarStructureSource {
  kind: "structure";
  data: string | ArrayBuffer;
  format?: BuiltInTrajectoryFormat;
  label?: string;
}

export interface MolstarTrajectorySource {
  kind: "trajectory";
  model: {
    data: string | ArrayBuffer;
    format: BuiltInTrajectoryFormat;
    isBinary?: boolean;
    label?: string;
  };
  coordinates: {
    data: ArrayBuffer | Uint8Array;
    format: BuiltInCoordinatesFormat;
    isBinary?: boolean;
    label?: string;
  };
  preset?: LoadTrajectoryParams["preset"];
}

export type MolstarSource = MolstarStructureSource | MolstarTrajectorySource;

export interface MolstarCanvasProps {
  source?: MolstarSource;
  height?: number;
  className?: string;
  variant?: "default" | "minimal";
  onStatusChange?: (
    status: MolstarViewerStatus,
    info?: { message?: string | null }
  ) => void;
}

const baseViewerOptions = {
  layoutShowControls: true,
  layoutShowSequence: false,
  layoutShowLeftPanel: false,
  layoutShowLog: false,
  layoutShowRemoteState: false,
  collapseLeftPanel: true,
  collapseRightPanel: true,
  layoutIsExpanded: false,
  viewportShowControls: true,
  viewportShowExpand: true,
  viewportShowSettings: true,
  viewportShowAnimation: true,
  viewportShowTrajectoryControls: true,
  viewportShowToggleFullscreen: true,
  viewportShowSelectionMode: true,
  viewportShowReset: true,
  viewportShowScreenshotControls: false,
};

const minimalViewerOptions = {
  ...baseViewerOptions,
  layoutShowControls: false,
  viewportShowControls: true,
  viewportShowExpand: false,
  viewportShowSettings: false,
  viewportShowAnimation: false,
  viewportShowTrajectoryControls: false,
  viewportShowToggleFullscreen: false,
  viewportShowSelectionMode: false,
  viewportShowScreenshotControls: false,
  viewportShowReset: true,
};

const MolstarCanvas = ({
  source,
  height = 300,
  className,
  variant = "default",
  onStatusChange,
}: MolstarCanvasProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<MolstarViewerInstance | null>(null);
  const [status, setStatus] = useState<MolstarViewerStatus>(
    MolstarViewerStatusOptions.IDLE
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ensureArrayBuffer = (
    bufferLike: ArrayBuffer | ArrayBufferLike
  ): ArrayBuffer => {
    if (bufferLike instanceof ArrayBuffer) return bufferLike;
    const sourceView = new Uint8Array(bufferLike);
    const copy = new Uint8Array(sourceView.length);
    copy.set(sourceView);
    return copy.buffer;
  };

  const loadBinaryStructure = async (
    viewer: MolstarViewerInstance,
    data: ArrayBuffer,
    format: BuiltInTrajectoryFormat,
    label?: string
  ) => {
    const raw = await viewer.plugin.builders.data.rawData({
      data,
      label,
    });
    const trajectory = await viewer.plugin.builders.structure.parseTrajectory(
      raw,
      format
    );
    await viewer.plugin.builders.structure.hierarchy.applyPreset(
      trajectory,
      "default"
    );
  };

  useEffect(() => {
    const normalizeCoordinateData = (
      data: ArrayBuffer | Uint8Array
    ): ArrayBuffer | Uint8Array<ArrayBuffer> => {
      if (data instanceof Uint8Array) {
        if (data.buffer instanceof ArrayBuffer) {
          return data as Uint8Array<ArrayBuffer>;
        }
        const normalized = ensureArrayBuffer(data.buffer);
        return new Uint8Array(normalized) as Uint8Array<ArrayBuffer>;
      }
      return ensureArrayBuffer(data);
    };

    const container = containerRef.current;
    if (!container) return;

    if (!source) {
      viewerRef.current?.plugin?.dispose();
      viewerRef.current = null;
      container.innerHTML = "";
      setStatus(MolstarViewerStatusOptions.IDLE);
      setErrorMessage(null);
      onStatusChange?.(MolstarViewerStatusOptions.IDLE);
      return;
    }

    let canceled = false;

    const run = async () => {
      try {
        setStatus(MolstarViewerStatusOptions.LOADING);
        setErrorMessage(null);
        onStatusChange?.(MolstarViewerStatusOptions.LOADING);

        viewerRef.current?.plugin?.dispose();
        viewerRef.current = null;
        container.innerHTML = "";

        const viewer = await MolstarViewer.create(
          container,
          variant === "minimal"
            ? { ...minimalViewerOptions }
            : { ...baseViewerOptions }
        );
        if (canceled) {
          viewer.plugin?.dispose();
          return;
        }

        viewerRef.current = viewer;

        if (source.kind === MolstarSourceOptions.TRAJECTORY) {
          const coordinatesData = normalizeCoordinateData(
            source.coordinates.data
          );

          const coordinatePayload =
            coordinatesData instanceof Uint8Array
              ? coordinatesData
              : new Uint8Array(coordinatesData);

          await viewer.loadTrajectory({
            model: {
              kind: "model-data",
              data: source.model.data,
              format: source.model.format,
            },
            modelLabel: source.model.label,
            coordinates: {
              kind: "coordinates-data",
              data: coordinatePayload,
              format: source.coordinates.format,
            },
            coordinatesLabel: source.coordinates.label,
            preset: source.preset,
          });
        } else if (source.kind === MolstarSourceOptions.STRUCTURE) {
          if (typeof source.data === "string") {
            await viewer.loadStructureFromData(
              source.data,
              source.format ?? "pdb",
              {
                dataLabel: source.label,
              }
            );
          } else {
            const binaryData = ensureArrayBuffer(source.data);
            await loadBinaryStructure(
              viewer,
              binaryData,
              source.format ?? "pdb",
              source.label
            );
          }
        }

        if (!canceled) {
          setStatus(MolstarViewerStatusOptions.READY);
          onStatusChange?.(MolstarViewerStatusOptions.READY);
        }
      } catch (error) {
        if (canceled) return;
        console.error("Mol* viewer initialization failed", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to initialize viewer";
        setStatus(MolstarViewerStatusOptions.ERROR);
        setErrorMessage(message);
        onStatusChange?.(MolstarViewerStatusOptions.ERROR, { message });
      }
    };

    run();

    return () => {
      canceled = true;
      viewerRef.current?.plugin?.dispose();
      viewerRef.current = null;
    };
  }, [source, onStatusChange, variant]);

  const combinedClassName = ["molstar-embed", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={combinedClassName}
      style={{
        height,
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
      data-status={status}
      data-error={errorMessage ?? undefined}
    />
  );
};

export default MolstarCanvas;
