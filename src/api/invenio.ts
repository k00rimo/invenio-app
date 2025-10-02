import axios, { type AxiosInstance } from "axios";

const API_URL = "https://inveniordm.web.cern.ch/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiClient;
