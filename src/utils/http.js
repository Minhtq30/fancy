import axios from "axios";
import { BASE_URL } from "@/contants";
import * as Sentry from "@sentry/vue";

const axiosApiInstance = axios.create({
  baseURL: BASE_URL + "/api/v1",
});

axiosApiInstance.defaults.timeout = 60000;

axiosApiInstance.interceptors.request.use(
  (config) => {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem("token_ecom")}`,
      "Content-Type": "application/json",
      "Shop-Code": localStorage.getItem("shop_code") || "",
    };
    return config;
  },
  (error) => Promise.reject(error)
);

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    Sentry.setUser({ shop_code: localStorage.getItem("shop_code") });
    const endPoint = error.response.config.baseURL + error.response.config.url;
    let captureMessage = "";
    if (error.response?.status === 404) {
      captureMessage = "API not found: " + endPoint;
    }
    if (error.response?.status === 500) {
      captureMessage = "API return 500 error: " + endPoint;
    }
    Sentry.captureMessage(captureMessage);
    Sentry.captureException(error);

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.replace(process.env.VUE_APP_REDIRECT_URI_LOGOUT);
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
