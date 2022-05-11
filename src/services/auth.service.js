/**
 * Copyright 2021-present, TIENDUC.
 * All rights reserved.
 * @author ductt24@ghtk.co on 20/09/2021.
 * @description Auth Service
 */
import BaseService from "./base.service.js";
import axios from "axios";
import orderExcelDatabase from "@/database/orderExcel.database";

class AuthService extends BaseService {
  instance;
  baseUrl;

  constructor(baseUrl, instance) {
    super();
    this.instance = instance ? instance : axios.create();
    this.baseUrl = baseUrl ? baseUrl : this.getBaseUrl("");
  }

  logout(access_token = "") {
    const url_ = this.baseUrl + "/api/v1/auth/logout";

    const options = {
      method: "POST",
      url: url_,
      headers: {
        Accept: "application/json",
        "Shop-Code": this.getShopCode(),
        Authorization: `Bearer ${
          access_token ? access_token : this.getAccessToken()
        }`,
      },
    };

    return this.instance
      .request(options)
      .catch((_error) => {
        throw _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  async logoutIndexDBLocal() {
    await orderExcelDatabase.clear();
  }
}
export default AuthService;
