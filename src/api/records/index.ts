import type {
  InvenioRecord,
  InvenioSearchResponse,
  SearchRecordsParams,
} from "@/types/types";
import type { AxiosResponse } from "axios";
import apiClient from "../invenio";

export const searchRecords = async (
  params: SearchRecordsParams
): Promise<InvenioSearchResponse<InvenioRecord>> => {
  try {
    const response: AxiosResponse<InvenioSearchResponse<InvenioRecord>> =
      await apiClient.get("/records", {
        params: params,
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const getRecordById = async (id: string): Promise<InvenioRecord> => {
  try {
    const response: AxiosResponse<InvenioRecord> = await apiClient.get(
      `records/${encodeURIComponent(id)}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching record ${id}:`, error);
    throw error;
  }
};
