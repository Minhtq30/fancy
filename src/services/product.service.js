import http from "@/utils/http";

class ProductService {
  browseProductByName(term, cancelToken) {
    return http
      .get(`/product/product/search?term=${term}`, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }
}

export default ProductService;
