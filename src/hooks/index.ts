import { getCommunities, getCommunity } from "@/api/community";
import {
  getProjectAnalysis,
  getProjectAnalysisData,
  getProjectAnalysisOptions,
  getRecordById,
  getProjects,
  getAvailableAnalyses,
} from "@/api/projects";
import { AuthContext } from "@/context";
import type {
  AnalysisName,
  AnalysisOptionsResponse,
  CommunityQueryParams,
  ProjectsQueryParams,
} from "@/types/mdpositTypes";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const useRecords = (params?: ProjectsQueryParams) => {
  return useQuery({
    queryKey: ["records", params],
    queryFn: () => getProjects(params ?? {}),
  });
};

export const useRecord = (id?: string) => {
  return useQuery({
    queryKey: ["record", id],
    queryFn: () => getRecordById(id!),
    enabled: !!id,
  });
};

export const useProjectAnalysis = (
  projectId?: string,
  analysisName?: AnalysisName
) => {
  return useQuery({
    queryKey: ["project-analysis", projectId, analysisName],
    queryFn: () => getProjectAnalysis(projectId!, analysisName!),
    enabled: !!projectId && !!analysisName,
  });
};

export const useProjectAnalysisData = (
  projectId?: string,
  analysisName?: string,
  replica?: number | string
) => {
  return useQuery({
    queryKey: ["project-analysis-data", projectId, analysisName, replica],
    queryFn: () => getProjectAnalysisData(projectId!, analysisName!, replica),
    enabled: !!projectId && !!analysisName,
  });
};

export const useProjectAnalysisOptions = (
  projectId?: string,
  baseAnalysisName?: string,
  replica?: number | string
) => {
  return useQuery<AnalysisOptionsResponse>({
    queryKey: [
      "project-analysis-options",
      projectId,
      baseAnalysisName,
      replica,
    ],
    queryFn: () =>
      getProjectAnalysisOptions(projectId!, baseAnalysisName!, replica),
    enabled: !!projectId && !!baseAnalysisName,
  });
};

export const useAvailableAnalyses = (
  projectId?: string,
  replica?: number | string
) => {
  return useQuery({
    queryKey: ["available-analyses", projectId, replica],
    queryFn: async () => getAvailableAnalyses(projectId!, replica),
    enabled: !!projectId,
  });
};

export const useCommunities = (params?: CommunityQueryParams) => {
  return useQuery({
    queryKey: ["communities", params],
    queryFn: () => getCommunities(params ?? {}),
  });
};

export const useCommunity = (id: string) => {
  return useQuery({
    queryKey: ["community", id],
    queryFn: () => getCommunity(id),
  });
};


export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
