import http from "../utils/http";

const accountService = {
  getAccount: async () => {
    return await http.get("/shop/staff/get-list");
  },
  addAccount: async (params) => {
    return await http.post("/shop/staff/create", params);
  },
  editAccount: async (params, id) => {
    return await http.post(`/shop/staff/update/${id}`, params);
  },
  deleteAccount: async (id) => {
    return await http.get(`/shop/staff/delete/${id}`);
  },
  checkOtpAccount: async (params) => {
    return await http.post("/shop/confirm-otp", params);
  },
  resetOtpAccount: async (params) => {
    return await http.post("/shop/resend-confirm-otp", params);
  },
};

export default accountService;
