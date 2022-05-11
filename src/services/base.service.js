import { BASE_URL } from "@/contants";

export default class BaseService {
  getBaseUrl(defaultBaseUrl) {
    return defaultBaseUrl || BASE_URL;
  }
  transformResult(url, res, action) {
    return action(res);
  }
  getAccessToken() {
    return `Bearer ${localStorage.getItem("token_ecom")}`;
  }
  getShopCode() {
    return localStorage.getItem("shop_code") || "";
  }
}
