import http from "@/utils/http";

class ThunderService {
  browseReviewCheck() {
    return http
      .get("/review/cskh/check-review")
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
  /**
   * Gửi yêu cầu check enable.
   * @returns promise - Check Enable Chấm sao.
   * */
  browseCheckEnable() {
    return http
      .get("/review/cskh/review/enable")
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  /**
   * Lấy thông tin review.
   * */
  browseGetReview(params) {
    if (localStorage.getItem("token_ecom")) {
      return http
        .get("/review/cskh/get-review", { params })
        .catch((_error) => {
          return _error;
        })
        .then((_response) => {
          return _response.data;
        });
    }
  }

  /**
   * Chấm sao
   * @returns promise - Chấm sao.
   * */
  browseReview(data) {
    return http
      .post("/review/cskh/review", data)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  /**
   * Gửi yêu cầu check enable.
   * @returns promise - Check Enable Chấm sao.
   * */
  browseGetListOption() {
    return http
      .get("/review/cskh/review/options")
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
}

export default ThunderService;
