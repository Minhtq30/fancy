import axios from "axios";
import http from "@/utils/http";
import { BASE_URL } from "@/contants";

class MyShopService {
  /**
   * Lấy thông tin của shop
   * @returns promise - Thông tin chi tiết của shop.
   * */
  browseInfoShop(access_token) {
    access_token = access_token || localStorage.getItem("token_ecom");
    return axios
      .get(BASE_URL + "/api/v1/shop/info", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
          chatToken: localStorage.getItem("token_gchat"),
          "Shop-Code": localStorage.getItem("shop_code") || "",
        },
      })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  /**
   * Tìm kiếm sản phẩm theo tên.
   * @param {any} requestParam term => tên mong muốn tìm kiếm
   * @returns promise - Danh sách product
   * */
  browseListProduct(requestParam) {
    return http
      .get("/product/product/search", { params: requestParam })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  // TODO NamVH: Cần xem xét lại việc cần thiết callAPI này không ? do thông tin này đã có trong API lấy thông tin của shop.
  /**
   * Lấy danh sách ca giao tính từ thời điểm hiện tại call API.
   * @returns promise - Danh sách PickAddress
   * */
  browsePickAddress(cancelToken) {
    return http
      .get("/shop/pick-addresses", { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  /**
   * Lấy danh sách ca giao tính từ thời điểm hiện tại call API.
   * @returns promise - Danh sách PickAddress
   * */
  browsePickTimes(params) {
    return http
      .get("/package/pick-time", { params })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  // TODO NamVH: Cập nhật mô tả.
  /**
   * ?.
   * */
  browseHamletAddress(parentId, cancelToken) {
    let url_ = `/address/hamlet`;

    if (parentId) {
      url_ += `?parentId=${parentId}`;
    }

    return http
      .get(url_, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  /**
   * CheckCapacityBBS và Lấy danh sách pickTime
   * @param {any} params
   * @returns promise - Danh sách pickTime
   * */
  browseCheckCapacityBBS(data) {
    return http
      .post("/package/bbs/capacity", data)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  async browserGetProducts(params = {}) {
    const response = await http.get("/product/products/list", { params });

    return response?.data || {};
  }

  async getAchievements(params = {}) {
    const response = await http.get("/shop/award/get", { params });

    return response?.data || {};
  }

  async getProfile(params = {}) {
    const response = await http.get("/shop/statistic", { params });

    return response?.data || {};
  }

  async updateProfile(data = {}) {
    const response = await http.post("/shop/update-profile", data);

    return response;
  }

  async resendOTP(data = {}) {
    const response = await http.post("/shop/resend-confirm-otp", data);

    return response;
  }

  async confirmOtp(data = {}) {
    const response = await http.post("/shop/confirm-otp", data);

    return response;
  }

  async updateAvatar(data) {
    const response = await http.post("/shop/update-avatar", data);

    return response;
  }

  getShopConfig() {
    return http
      .get("/shop/config")
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  setShopConfig(data) {
    return http
      .post("/shop/config", data)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  async getBankList(params = {}) {
    const response = await http.get("/shop/list-banks", { params });

    return response;
  }

  async updateVatInfo(data = {}) {
    const response = await http.post("/shop/update-vat", data);

    return response;
  }

  async updateConfigInfo(data = {}) {
    const response = await http.post("/shop/save-config", data);

    return response;
  }
}

export default MyShopService;
