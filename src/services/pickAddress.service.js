import http from "../utils/http";

const pickAddressService = {
  getPickAddresses: async () => {
    return await http.get("/shop/pick-addresses");
  },

  creatNewPickAddress: async (params) => {
    return await http.post("/shop/pick-address/create", params);
  },

  removePickAddress: async (params) => {
    return await http.post("/shop/pick-address/remove", params);
  },

  updatePickAddress: async (pick_address_id, params) => {
    return await http.post(
      `/shop/pick-address/update/${pick_address_id}`,
      params
    );
  },
};

export default pickAddressService;
