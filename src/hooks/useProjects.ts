import { getProjects } from "@/api/projects";
import type { ProjectsQueryParams } from "@/types/mdpositTypes";
import { useQuery } from "@tanstack/react-query";

export const projectKeys = {
  all: ["projects"] as const,
  list: (params: ProjectsQueryParams) => [...projectKeys.all, "list", params] as const,
};

export const useProjects = (params: ProjectsQueryParams) => {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => getProjects(params),
    retry: 1,
    staleTime: 1000 * 60,  // 1 minute
  });
};
