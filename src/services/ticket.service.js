import http from "../utils/http";

const ticketService = {
  async changePickAddress(params) {
    const data = {
      session_id: params.session_id,
      type: 20,
      feedback: {
        fb_use_return_address:
          params.shop_pick_address === params.shop_return_address ? 1 : 0,
        shop_pick_address: params.shop_pick_address,
        shop_return_address: params.shop_return_address,
      },
    };

    if (params.packages) {
      data.packages = params.packages;
    }

    const response = await http.post(`/package-session/session-ticket`, data);

    return response;
  },
  async sendTicketSession(session_id, type, feedback, packages = []) {
    const data = {
      session_id,
      type,
      feedback,
      packages,
    };

    const response = await http.post(`/package-session/session-ticket`, data);

    return response;
  },
  async rejectReturn(session_id) {
    const response = await http.post(`/package-session/no-need-to-return`, {
      session_id,
    });
    return response;
  },
  async returnedConfirm(session_id, pkg_orders) {
    const response = await http.post(`/package-session/confirm-return`, {
      session_id,
      pkg_orders,
    });
    return response;
  },
  async sendTicketOrder(package_id, alias, feedback_type_id, content = "") {
    const data = { package_id, alias, feedback_type_id };
    if (content) {
      data.content = content;
    }
    const response = await http.post(`/ticket/add`, data);

    return response;
  },
  async getListTickets(params = {}) {
    const response = await http.get("/ticket/list", { params });

    return response;
  },
};

export default ticketService;
