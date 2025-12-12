import type { AxiosResponse } from "axios";
import apiClient from "../client";
import type {
  Analysis,
  AnalysisOptionsResponse,
  ProjectMD,
  ProjectReferencesResponse,
  ProjectsQueryParams,
  ProjectsResponse,
  Topology,
  TrajectoryFormat,
} from "@/types/mdpositTypes";

export const getProjects = async (
  queryParams: ProjectsQueryParams
): Promise<ProjectsResponse> => {
  try {
    // TODO: remove this, when the api works
    // just pass queryParams into the apiClient.get call
    const params = {
      sort: '{"_id":-1}',
      ...queryParams,
    };
    const response: AxiosResponse<ProjectsResponse> = await apiClient.get(
      "/projects",
      {
        params: params,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const getRecordById = async (id: string): Promise<ProjectMD> => {
  try {
    const response: AxiosResponse<ProjectMD> = await apiClient.get(
      `projects/${encodeURIComponent(id)}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
};

// Build project instance id with replica suffix if provided (e.g., MD-A00001.2)
export const formatProjectInstanceId = (
  projectId: string,
  replica?: number | string
): string => {
  if (
    replica === undefined ||
    replica === null ||
    String(replica).trim() === ""
  ) {
    return projectId;
  }
  const rep = String(replica).trim();
  // If projectId already looks like MD-XXXX.Y, don't double-append
  if (/\.\d+$/.test(projectId)) {
    return projectId;
  }
  return `${projectId}.${rep}`;
};

export const getAvailableAnalyses = async (
  projectId: string,
  replica?: number | string
): Promise<string[]> => {
  try {
    const instanceId = formatProjectInstanceId(projectId, replica);
    const response: AxiosResponse<string[]> = await apiClient.get(
      `projects/${encodeURIComponent(instanceId)}/analyses`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching available analyses for project ${projectId}$${
        replica ? `.${replica}` : ""
      }:`,
      error
    );
    throw error;
  }
};

export const getProjectAnalysis = async (
  projectId: string,
  analysisName: string
): Promise<Analysis> => {
  try {
    const response: AxiosResponse<Analysis> = await apiClient.get(
      `projects/${encodeURIComponent(projectId)}/analyses/${encodeURIComponent(
        analysisName
      )}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching analysis '${analysisName}' for project ${projectId}:`,
      error
    );
    throw error;
  }
};

// Fetch a concrete analysis variant's data with optional replica suffix handling
export const getProjectAnalysisData = async (
  projectId: string,
  analysisName: string,
  replica?: number | string
): Promise<Analysis> => {
  const instanceId = formatProjectInstanceId(projectId, replica);
  return getProjectAnalysis(instanceId, analysisName);
};

// When a base analysis is requested (e.g., "rmsd-pairwise"), API returns a list of options
export const getProjectAnalysisOptions = async (
  projectId: string,
  baseAnalysisName: string,
  replica?: number | string
): Promise<AnalysisOptionsResponse> => {
  try {
    const instanceId = formatProjectInstanceId(projectId, replica);
    const response: AxiosResponse<AnalysisOptionsResponse> =
      await apiClient.get(
        `projects/${encodeURIComponent(
          instanceId
        )}/analyses/${encodeURIComponent(baseAnalysisName)}`
      );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching analysis options for '${baseAnalysisName}' on project ${projectId}${
        replica ? "." + replica : ""
      }:`,
      error
    );
    throw error;
  }
};

export interface StructureRequestOptions {
  selection?: string;
  method?: "get" | "post";
  responseType?: "arraybuffer" | "text";
}

export const getProjectStructure = async (
  projectId: string,
  options?: StructureRequestOptions
): Promise<ArrayBuffer | string> => {
  const instanceId = encodeURIComponent(projectId);
  const url = `projects/${instanceId}/structure`;
  const params = options?.selection
    ? { selection: options.selection }
    : undefined;
  const responseType = options?.responseType ?? "arraybuffer";

  if (options?.method === "post") {
    const response: AxiosResponse<ArrayBuffer | string> = await apiClient.post(
      url,
      undefined,
      { params, responseType }
    );
    return response.data;
  }

  const response: AxiosResponse<ArrayBuffer | string> = await apiClient.get(
    url,
    {
      params,
      responseType,
    }
  );
  return response.data;
};

export interface TrajectoryRequestOptions {
  format?: TrajectoryFormat;
  frames?: string;
  selection?: string;
  method?: "get" | "post";
}

export const getProjectTrajectory = async (
  projectId: string,
  options?: TrajectoryRequestOptions
): Promise<ArrayBuffer> => {
  const instanceId = encodeURIComponent(projectId);
  const url = `projects/${instanceId}/trajectory`;
  const params: Record<string, string> = {};

  if (options?.format) {
    params.format = options.format;
  }
  if (options?.frames) {
    params.frames = options.frames;
  }
  if (options?.selection) {
    params.selection = options.selection;
  }

  const config = {
    params: Object.keys(params).length ? params : undefined,
    responseType: "arraybuffer" as const,
  };

  if (options?.method === "post") {
    const response: AxiosResponse<ArrayBuffer> = await apiClient.post(
      url,
      undefined,
      config
    );
    return response.data;
  }

  const response: AxiosResponse<ArrayBuffer> = await apiClient.get(url, config);
  return response.data;
};

export const getProjectTopology = async (
  projectId: string
): Promise<Topology> => {
  const response: AxiosResponse<Topology> = await apiClient.get(
    `projects/${encodeURIComponent(projectId)}/topology`
  );
  return response.data;
};

export const getProjectReferences = async (
  projectId: string
): Promise<ProjectReferencesResponse> => {
  const response: AxiosResponse<ProjectReferencesResponse> =
    await apiClient.get(`projects/${encodeURIComponent(projectId)}/references`);
  return response.data;
};
