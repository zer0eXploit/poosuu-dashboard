import axios from "axios";

import CONSTANTS from "../utils/constants";

export const poosuuLoginAPI = axios.create({
  baseURL: CONSTANTS.API_BASE_URL,
  method: "POST",
});

export const poosuuPasswordResetAPI = axios.create({
  baseURL: CONSTANTS.API_BASE_URL,
  method: "POST",
});

const poosuuAPI = axios.create({ baseURL: CONSTANTS.API_BASE_URL });

let token = localStorage.getItem(CONSTANTS.POOSUU_ADMIN_ACCESS_TOKEN);

poosuuAPI.interceptors.request.use(function (config) {
  if (!token) {
    token = localStorage.getItem(CONSTANTS.POOSUU_ADMIN_ACCESS_TOKEN);
  }
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  config.headers["x-api-key"] = CONSTANTS.POOSUU_PUBLIC_API_KEY;
  return config;
});

poosuuAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(CONSTANTS.POOSUU_ADMIN_DATA);
      localStorage.removeItem(CONSTANTS.POOSUU_ADMIN_ACCESS_TOKEN);
      window.location.href = "/login";
    }
    throw error;
  }
);

export default poosuuAPI;
