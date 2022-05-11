import http from "@/utils/http";

class MyShopService {
  browseGetRouter(data) {
    return http
      .post(`/services/gmap/route`, data)
      .catch((error) => error)
      .then((response) => response?.data || {});
  }
}

export default MyShopService;
