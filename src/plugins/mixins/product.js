import { get, map, uniqBy } from "lodash";

// Service
import services from "@/services";

// Common
import common from "@/utils/common";

export default {
  methods: {
    showError(error, clgMsg = "Có lỗi xảy ra") {
      console.log("------------Thông báo lỗi------------");
      console.log(error);
      console.log(clgMsg);
      console.log("-------------------------------------");
    },
    /**
     * Tìm kiếm sản phẩm theo tên.
     * @params
     *  1. requestParams: request lấy sản phẩm.
     *  2. options : option thêm.
     * */
    async getProductByName(
      requestParams,
      options = { convertToLabel: false, convertToWithoutPayloadLabel: false }
    ) {
      let listProduct = [];

      try {
        const result = await services.$shop.browseListProduct(requestParams);
        if (result.success) {
          listProduct = uniqBy(get(result, "data", []), "code");
          listProduct = map(listProduct, (product) => {
            if (`${product.type}` === "product") {
              product.combo_id = product.product_id;
            }
            return product;
          });
          if (options.convertToLabel) {
            listProduct = common.convertLabelValueDataSource({
              dataSource: listProduct,
              valueName: "product_id",
            });
          }
          if (options.convertToWithoutPayloadLabel) {
            listProduct = common.convertLabelValueWithoutPayload({
              dataSource: listProduct,
              valueName: "product_id",
            });
          }
        } else {
          this.showError(result.message);
        }
      } catch (error) {
        this.showError(error, "Có lỗi khi tìm kiếm sản phẩm");
      }

      return listProduct;
    },
  },
};
