/* eslint-disable */
import BaseService from "./base.service";
import http from "@/utils/http";
import axios from "axios";
import { THUNDER_URL } from "@/contants";
class ThunderService extends BaseService {
  instance = axios.create();
  baseUrl = THUNDER_URL;

  constructor(instance) {
    super();
    this.instance = instance ? instance : axios.create();
    this.baseUrl = this.baseUrl ? this.baseUrl : this.getBaseUrl("");
  }

  /**
   * Gửi yêu cầu hủy.
   * @returns promise - Hủy đơn hàng.
   * */
  browseCancelOrder(orderId) {
    let url_ = this.baseUrl + `/api/v1/package/cancel/${orderId}`;
    let data = JSON.stringify({});
    const options = {
      method: "POST",
      url: url_,
      headers: {
        Accept: "application/json",
        token: localStorage.getItem("shop_token"),
      },
      data,
    };

    return this.instance
      .request(options)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
  browseXFastArea(params) {
    let url_ = this.baseUrl + `/services/xfast/check-area-v2`;
    const options = {
      method: "GET",
      url: url_,
      headers: {
        Accept: "application/json",
        token: localStorage.getItem("shop_token"),
      },
      params,
    };

    return this.instance
      .request(options)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
  browseXFastBooking(data) {
    let url_ = this.baseUrl + `/services/xfast/booking/create`;
    const options = {
      method: "POST",
      url: url_,
      headers: {
        Accept: "application/json",
        token: localStorage.getItem("shop_token"),
      },
      data,
    };

    return this.instance
      .request(options)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
  deleteBookingIds(data) {
    let url_ = this.baseUrl + `/services/xfast/booking/delete`;
    const options = {
      method: "POST",
      url: url_,
      headers: {
        Accept: "application/json",
        token: localStorage.getItem("shop_token"),
      },
      data,
    };

    return this.instance
      .request(options)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
}

export default ThunderService;
