import http from "@/utils/http";

class CustomerService {
  async getCustomerColorByPhone(params) {
    return http
      .get("/customer/tel-report", { params })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        let results = _response?.data?.data || [];

        results = results.map((item) => {
          item.colors = {
            badReportPublic: item.badReportPublic,
            isBadReport: item.isBadReport,
            isBlue: item.isBlue,
            isGoodReport: item.isGoodReport,
            isPurple: item.isPurple,
            isRed: item.isRed,
            isSuperred: item.isSuperred,
            isYellow: item.isYellow,
          };

          delete item.isBadReport;
          delete item.badReportPublic;
          delete item.isBlue;
          delete item.isGoodReport;
          delete item.isPurple;
          delete item.isRed;
          delete item.isSuperred;
          delete item.isYellow;

          return item;
        });

        _response.data.data = results;

        return _response.data;
      });
  }

  // TODO NamVH: move server to package.
  async checkDuplicateOrderByPhone(data) {
    return http
      .post("/package/check-duplicate", data)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  browseCustomerByPhone(customerTel, cancelToken) {
    const params = { term: customerTel };

    return http
      .get("/address/get-customer-address", { params, cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
}

export default CustomerService;
