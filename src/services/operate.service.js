import moment from "moment";

import http from "../utils/http";
import { formatDateTimeRequest } from "@/utils/date";
import { formatRealtimeReport } from "@/utils/formater";

const operateService = {
  getNotifications: async () => {
    const response = await http.get(`/report/notifications?page=1`);

    return response;
  },
  getRealtimeReport: async (_params = {}) => {
    const type = _params.type || "summary";
    const isB2C = !!_params.isB2C;

    const params = { type, mode: isB2C ? "advance" : "basic" };

    const response = await http.get(`/report/realtime`, { params });

    const responseData = response?.data?.data;
    if (!responseData) return {};

    if (params.type === "summary") {
      return formatRealtimeReport(responseData, isB2C, type);
    }

    return responseData;
  },
  getImportantNotifications: async (_params = {}) => {
    const params = { ..._params };

    const response = await http.get(`/report/notifications/important`, {
      params,
    });

    return response;
  },
  getAllNotifications: async (_params = {}) => {
    const params = { ..._params };

    const response = await http.get(`/report/notifications`, {
      params,
    });

    return response;
  },
  countNotifications: async (_params = {}) => {
    const params = {
      ..._params,
      from: formatDateTimeRequest(moment().startOf("day").subtract(3, "month")),
    };

    const response = await http.get(`/report/notifications/count`, {
      params,
    });

    return response;
  },
  getSessions: async (_params = {}) => {
    const params = { ..._params };
    const response = await http.get(`/package-session/list`, { params });
    return response;
  },
  getSessionDetail: async (session_id) => {
    const response = await http.get("/package-session/list-pkgs", {
      params: { session_id },
    });

    return response;
  },
  getTicketReturning() {},
};

export default operateService;
