import http from "../utils/http";

const notificationService = {
  receiveSms: async (params) => {
    return await http.post("/shop/receive-sms-cod", params);
  },
  receiveEmail: async (params) => {
    return await http.post("/shop/receive-email-report", params);
  },
};

export default notificationService;
