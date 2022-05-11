import http from "../utils/http";

const policyInfoService = {
  getPolicy: async () => {
    return await http.get("/shop/config");
  },
  savePolicy: async (params) => {
    return await http.post("/shop/config", params);
  },
};

export default policyInfoService;
