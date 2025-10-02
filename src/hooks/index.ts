import { getRecordById, searchRecords } from "@/api/records";
import type { SearchRecordsParams } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const useRecords = (params?: SearchRecordsParams) => {
  return useQuery({
    queryKey: ["records", params],
    queryFn: () => searchRecords(params ?? {}),
  });
};

export const useRecord = (id: string) => {
  return useQuery({
    queryKey: ["record", id],
    queryFn: () => getRecordById(id),
    enabled: !!id,
  });
};
