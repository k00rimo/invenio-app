import type { LoginPayload, LoginResponse, LogoutResponse } from "@/types/mdpositTypes";
import { mdrepoClient } from "../client";
import type { AxiosResponse } from "axios";


export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await mdrepoClient.post(
      "/login",
      payload
    );
    console.log("resposne", response)
    return response.data;
  } catch (error) {
    console.error("Error loggin in:", error);
    throw error;
  }
};

export const logoutUser = async (
): Promise<LogoutResponse> => {
  try {
    const response: AxiosResponse<LogoutResponse> = await mdrepoClient.post(
      "/logout",
    );
    console.log("resposne logout", response)
    return response.data;
  } catch (error) {
    console.error("Error loggin out:", error);
    throw error;
  }
};
