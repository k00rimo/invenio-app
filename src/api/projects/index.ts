import type { AxiosResponse } from "axios";
import apiClient from "../client";
import type {
  ProjectMD,
  ProjectsQueryParams,
  ProjectsResponse,
} from "@/types/mdpositTypes";

export const getProjects = async (
  queryParams: ProjectsQueryParams
): Promise<ProjectsResponse> => {
  try {
    const response: AxiosResponse<ProjectsResponse> = await apiClient.get(
      "/projects",
      {
        params: queryParams,
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
