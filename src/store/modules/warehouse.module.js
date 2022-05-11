import warehouseService from "@/services/warehouse.service";
import { message } from "ant-design-vue";
const warehouseModule = {
  namespaced: true,
  state: {
    total: 0,
    productCategories: [],
    productList: {
      products: [],
      paging: {
        total: 1,
      },
    },
    topProductList: [],
    productDetailById: {},
    productCharacteristics: [],
    warehouses: null,
  },
  getters: {},
  mutations: {
    setProduct(state, data) {
      state.productList.products = data.products;
      state.productList.paging = data.paging;
    },
    setProductCategories(state, productCategories) {
      state.productCategories = productCategories;
    },
    setProductDetail(state, product) {
      state.productDetailById = {
        ...state.productDetailById,
        [product.product_id]: product,
      };
    },
    setProductDetailById(state, product) {
      state.productDetailById[product.product_id] = {
        ...state.productDetailById[product.product_id],
        product_id: product.product_id,
        prices: product.retail_prices || 0,
        images: product.images.map((image) => {
          return image.ghtkPath;
        }),
        product_name: product.fullName,
        cost: product.cost || 0,
        weight: product.weight,
      };
      const indexProduct = state.productList.products.findIndex((pro) => {
        return pro.product_id === product.product_id;
      });
      // tính doanh thu sau khi sửa giá sản phẩm
      const revenue =
        parseFloat(product.retail_prices) *
        parseFloat(state.productList.products[indexProduct].total_sell || 0);
      // update lại sản phẩm theo index
      state.productList.products[indexProduct] = {
        ...state.productList.products[indexProduct],
        product_name: product.fullName,
        images: product.images.map((image) => {
          return image.ghtkPath;
        }),
        retail_prices: product.retail_prices || 0,
        revenue: revenue,
      };
    },
    setWarehouses(state, payload) {
      state.warehouses = payload;
    },
    setProductCharacteristics(state, characteristics) {
      state.productCharacteristics = characteristics;
    },
    addProductCharacteristic(state, characteristic) {
      state.productCharacteristics.push(characteristic);
    },
    updateProductCharacteristic(state, characteristic) {
      state.productCharacteristics = state.productCharacteristics.filter(
        (product) => {
          return product.id !== characteristic.id;
        }
      );
      state.productCharacteristics.unshift(characteristic);
    },
    deleteProductCharacteristic(state, data) {
      state.productCharacteristics = state.productCharacteristics.filter(
        (pro) => {
          return pro.id !== data.id;
        }
      );
    },
    deleteProducts(state, productIds) {
      state.productList.products = state.productList.products.filter(
        (p) => !productIds.includes(p.product_id)
      );
    },
    updateInventory(state, products) {
      const productObject = {};

      for (const product of products) {
        productObject[product.id] = { number: product.number };
      }

      state.productList.products = state.productList.products.map((p) => {
        if (productObject[p.product_id]) {
          return {
            ...p,
            total_inventory:
              p.total_inventory + productObject[p.product_id].number,
          };
        }
        return p;
      });
    },
  },
  actions: {
    async getProduct({ commit }, payload) {
      try {
        let result = await warehouseService.getProduct(payload);
        let products = result?.data?.data.products || [];
        let paging = result?.data?.data.paging || {};
        if (products) {
          commit("setProduct", { paging, products });
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getProductCategories({ commit }) {
      try {
        let result = await warehouseService.getProductCategories();
        let categories = result?.data?.data || [];
        if (categories) {
          commit("setProductCategories", categories);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getProductCharacteristics({ commit }) {
      try {
        let result = await warehouseService.getProductCharacteristic();
        let characteristics = result?.data?.data || [];
        if (result.data.success) {
          commit("setProductCharacteristics", characteristics);
        } else {
          message.error(
            result?.data.message || "Đã có lỗi xảy ra, vui lòng thử lại "
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    async updateProductCharacteristics({ commit }, payload) {
      try {
        let result = await warehouseService.updateProductCharacteristic(
          payload
        );
        if (result.data.success) {
          commit("updateProductCharacteristic", payload);
          message.success(result?.data.message || "Sửa thành công ");
        } else {
          message.error(
            result?.data.message || "Đã có lỗi xảy ra, vui lòng thử lại "
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    async addProductCharacteristics({ commit }, payload) {
      try {
        let result = await warehouseService.addProductCharacteristic(payload);
        let characteristics = result?.data?.data || [];
        if (result.data.success) {
          commit("addProductCharacteristic", characteristics);
          message.success(result?.data.message || "Thêm thành công ");
        } else {
          message.error(
            result?.data.message || "Đã có lỗi xảy ra, vui lòng thử lại "
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    async deleteProductCharacteristics({ commit }, payload) {
      try {
        let result = await warehouseService.deleteProductCharacteristic(
          payload
        );
        if (result.data.success) {
          commit("deleteProductCharacteristic", payload);
          message.success(result?.data.message || "Xóa thành công ");
        } else {
          message.error(
            result?.data.message || "Đã có lỗi xảy ra, vui lòng thử lại "
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getProductDetail({ commit }, payload) {
      let errorMessage = "";
      try {
        const response = await warehouseService.getProductDetail(payload);
        if (response?.data?.success) {
          commit("setProductDetail", response?.data?.data);
        } else {
          errorMessage =
            response?.data?.message ||
            "Lấy thông tin chi tiết sản phẩm thất bại";
        }
      } catch (error) {
        console.error(error);
        errorMessage =
          error?.response?.data?.message ||
          "Lấy thông tin chi tiết sản phẩm thất bại";
      }

      return errorMessage;
    },
    async getListWarehouses({ commit }) {
      let errorMessage = "";

      try {
        const response = await warehouseService.getListWarehouses();
        if (response?.data?.success && response?.data?.data) {
          commit("setWarehouses", response?.data?.data);
        } else {
          errorMessage =
            response?.data?.message || "Lấy danh sách kho thất bại";
        }
      } catch (error) {
        console.error(error);
        errorMessage =
          error?.response?.data?.message || "Lấy danh sách kho thất bại";
      }

      return errorMessage;
    },
  },
};

export default warehouseModule;
