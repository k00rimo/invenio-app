import axios, { type AxiosInstance } from "axios";

export const API_URL = "https://mdposit.mddbr.eu/api/rest/v1";
export const MDREPO_URL = "/api";

// const defaultHeaders = {
//   "Content-Type": "application/json",
//   Accept: "application/json",
// }

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const mdrepoClient: AxiosInstance = axios.create({
  baseURL: MDREPO_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default apiClient;
