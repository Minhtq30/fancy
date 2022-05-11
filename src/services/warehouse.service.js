import { formatDateTimeRequest } from "@/utils/date";
import http from "../utils/http";

const wareHouseService = {
  getListWarehouses: async () => {
    const response = await http.get("/product/warehouses/config");
    return response;
  },
  getProduct: async (_params) => {
    let params = {
      ..._params,
    };
    if (params.warehouse_id) {
      params.warehouse_id = _params.warehouse_id[0]
        ? _params.warehouse_id[0]
        : 0;
    }
    if (params.to_date && !params.from_date) {
      delete params.to_date;
    }
    if (params.from_date && params.to_date) {
      params = {
        ..._params,
        from_date: _params.from_date.format("X") * 1000,
        to_date: _params.to_date.format("X") * 1000,
      };
    }
    params = {
      ...params,
      page: _params.page - 1,
    };
    return await http.get("/product/products/statistic", { params });
  },
  addProduct: async (params) => {
    return await http.post("/product/products/import", params);
  },
  getProductCategories: async () => {
    return await http.get("/product/products/categories");
  },
  getProductCharacteristic: async () => {
    return await http.get("/product/characteristics/list");
  },
  addProductCharacteristic: async (params) => {
    return await http.post("/product/characteristics/add", params);
  },
  updateProductCharacteristic: async (params) => {
    return await http.post(
      `/product/characteristics/update/${params.id}`,
      params
    );
  },
  deleteProductCharacteristic: async (params) => {
    return await http.post(
      `/product/characteristics/delete/${params.id}`,
      params
    );
  },
  deleteProduct: async (id) => {
    return await http.post(`/product/products/delete/${id}`);
  },
  deleteProducts: async (params) => {
    return await http.post("/product/product/delete", params);
  },
  uploadImageCs: async (params) => {
    return await http.post("/services/images/upload-gs", params);
  },
  async getDashboard(params = {}) {
    if (params.end_date && !params.start_date) {
      delete params.end_date;
    }
    const response = await http.get(`/product/dashboard`, { params });
    return response;
  },
  async getMetricExportHistory(params = {}) {
    const _params = {
      type: "summary",
      sub_type: params.sub_type || "picked",
      from_date: params.from_date
        ? formatDateTimeRequest(params.from_date, true)
        : formatDateTimeRequest(new Date("1970-01-01").getTime(), true),
      to_date: params.to_date
        ? formatDateTimeRequest(params.to_date, true)
        : formatDateTimeRequest(new Date().getTime(), true),
    };

    if (_params.to_date && !_params.from_date) {
      delete _params.to_date;
    }

    const response = await http.get(`/package/session-export-package`, {
      params: _params,
    });

    return response;
  },
  createExportWarehouse: async (params) => {
    const response = await http.post("/product/warehouses/output", params);
    return response;
  },
  createImportWarehouse: async (params) => {
    const response = await http.post("/product/warehouses/input", params);
    return response;
  },
  async getProductInventory(params = {}) {
    const response = await http.get("/product/warehouses/products/inventory", {
      params,
    });
    return response;
  },
  async getProductDetail(params = {}) {
    const response = await http.get("/product/products/detail", { params });
    return response;
  },
  async getProductDetailId(id) {
    return await http.get(`/product/products/detail/${id}`);
  },
  async updateProduct(params, id) {
    return await http.post(`/product/products/update/${id}`, params);
  },
  async getProductLogs(params = {}) {
    const response = await http.get("/product/products/events", { params });
    return response;
  },
  async getProductBills(params = {}) {
    const response = await http.get("/product/warehouses/bills", { params });
    return response;
  },
  async getDetailBill(id) {
    const response = await http.get(`/product/warehouses/bills/${id}`);
    return response;
  },
  async getListBill(params = {}) {
    if (params.shop_warehouse_id) {
      params.shop_warehouse_id = params.shop_warehouse_id[0]
        ? params.shop_warehouse_id[0]
        : 0;
    }
    if (params.to_date && !params.from_date) {
      delete params.to_date;
    }
    const response = await http.get("/product/warehouses/dashboard/detail", {
      params,
    });
    return response;
  },
  async getLogByOrder(params = {}) {
    const response = await http.post("/package/get-logs", params);
    return response;
  },
};

export default wareHouseService;
