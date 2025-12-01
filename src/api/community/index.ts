import type { CommunityHit, CommunityQueryParams, CommunitySearchResponse, CreateCommunityPayload, RenameCommunityPayload, UpdateCommunityMetadataPayload } from "@/types/mdpositTypes";
import apiClient from "../client";
import type { AxiosResponse } from "axios";


export const getCommunities = async (
  queryParams: CommunityQueryParams
): Promise<CommunitySearchResponse> => {
  try {
    const response: AxiosResponse<CommunitySearchResponse> = await apiClient.get(
      "/communities",
      {
        params: queryParams,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

export const getCommunity = async (id: string): Promise<CommunityHit> => {
  try {
    const response: AxiosResponse<CommunityHit> = await apiClient.get(
      `/communities/${encodeURIComponent(id)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
};

export const createCommunity = async (
  payload: CreateCommunityPayload
): Promise<CommunityHit> => {
  try {
    const response: AxiosResponse<CommunityHit> = await apiClient.post(
      "/communities",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
};

export const updateCommunity = async (
  id:string,
  payload: UpdateCommunityMetadataPayload
): Promise<CommunityHit> => {
  try {
    const response: AxiosResponse<CommunityHit> = await apiClient.put(
      `/communities/${encodeURIComponent(id)}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating community:", error);
    throw error;
  }
};

export const deleteCommunity = async (
  id:string,
): Promise<CommunityHit> => {
  try {
    const response: AxiosResponse<CommunityHit> = await apiClient.delete(
      `/communities/${encodeURIComponent(id)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting community:", error);
    throw error;
  }
};

export const uploadCommunityLogo = async (
  id: string,
  logo: File
): Promise<CommunityHit> => {
  const formData = new FormData();
  formData.append("logo", logo);

  try {
    const response: AxiosResponse<CommunityHit> = await apiClient.post(
      `/communities/${encodeURIComponent(id)}/logo`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading community logo:", error);
    throw error;
  }
};

export const renameCommunity = async (
  id: string,
  payload: RenameCommunityPayload
): Promise<CommunityHit> => {
  try {
    const response: AxiosResponse<CommunityHit> = await apiClient.post(
      `/communities/${encodeURIComponent(id)}/rename`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error renaming community:", error);
    throw error;
  }
};
