import { getRecordById, getProjects } from "@/api/projects";
import type { ProjectsQueryParams } from "@/types/mdpositTypes";
import { useQuery } from "@tanstack/react-query";

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
