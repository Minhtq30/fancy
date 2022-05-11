import orderService from "@/services/order.service";
import nomalizeStoreData from "@/utils/nomalizeStoreData";

export const formatResponseOrderDetail = (responseData) => {
  const detailInfo = {};
  detailInfo.current_station_route =
    responseData?.Package?.current_station_route || {};
  detailInfo.ship_fee_only = responseData?.Package?.ship_fee_only || 0;
  detailInfo.final_ship_fee = responseData?.Package?.final_ship_fee || 0;
  detailInfo.message = responseData?.Package?.message || "";
  detailInfo.logs = responseData?.Package?.logs || [];
  detailInfo.product = responseData?.Package?.product || [];

  return detailInfo;
};

const orderModule = {
  namespaced: true,
  state: {
    byId: {},
    detailById: {},
    ids: [],
    total: 0,
    pushReview: {
      session_id: "",
      notes: "",
      rate_id: "",
      rate_detail: [],
    },
  },
  mutations: {
    update(state, payload) {
      const { byId, ids } = nomalizeStoreData(payload?.pkgs || []);
      state.byId = byId;
      state.ids = ids;
      state.total = payload?.count || 0;
    },
    updateNote(state, payload) {
      const id = String(payload.id);
      if (!state.detailById[id]) return;

      let message = state.detailById[id]?.message || "";

      if (message) message += "<br />";
      message += payload.message;

      state.detailById[id] = {
        ...(state.detailById[id] || {}),
        message,
      };
    },
    updateDetail(state, payload) {
      const id = String(payload.id);

      state.detailById[id] = {
        ...(state.detailById[id] || {}),
        ...payload,
      };
    },
  },
  actions: {
    async getOrders({ commit }, payload) {
      let pkgs = [];
      let count = 0;
      let errorMessage = null;

      try {
        const response = await orderService.getAll(payload.params);
        const responseData = response?.data || {};

        pkgs = responseData?.pkgs || [];
        count = responseData?.count || 0;

        if (!responseData.success) {
          errorMessage =
            "Lấy danh sách đơn hàng thất bại, vui lòng thử lại sau.";
        }
      } catch (error) {
        errorMessage = "Lấy danh sách đơn hàng thất bại, vui lòng thử lại sau.";
      }

      commit("update", { pkgs, count, path: payload.path });
      return errorMessage;
    },
    async updateNote({ commit }, payload) {
      try {
        const response = await orderService.updateNote(
          payload.id,
          payload.note
        );

        const success = response?.data?.success;
        const message =
          response?.data?.message ||
          "Oops! Something went wrong when call api.";

        if (success) {
          commit("updateNote", { id: payload.id, message: payload.note });
        }

        return { success, message };
      } catch (error) {
        console.log(error, error.response);
      }
    },
    async updateRate({ state, commit }, payload) {
      const pushReview = payload || state.pushReview;
      try {
        const response = await orderService.updateRate(pushReview);

        commit("updateRate", response?.data?.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getOrderDetail({ commit }, payload) {
      commit("updateDetail", { id: payload.id, is_loading_get_detail: true });
      let detailInfo = { id: payload.id };
      let loaded_detail_success = false;
      let loaded_detail_error = "";

      try {
        const response = await orderService.getOrderDetail(payload.id);
        if (response?.data?.success) {
          const responseData = response?.data?.data;
          detailInfo = {
            ...detailInfo,
            ...responseData,
            ...formatResponseOrderDetail(responseData),
          };
          loaded_detail_success = true;
        } else {
          loaded_detail_error =
            response?.data?.message || "Lấy chi tiết đơn hàng thất bại";
        }
      } catch (error) {
        console.log(error);
        loaded_detail_error =
          error?.response?.data?.message || "Lấy chi tiết đơn hàng thất bại";
      }

      commit("updateDetail", {
        ...detailInfo,
        is_loading_get_detail: false,
        loaded_detail_success,
        loaded_detail_error,
      });
    },
  },
  getters: {
    getOrdersByPath: (state) => {
      const ids = state.ids;
      const byId = state.byId;
      return ids.filter((id) => !!byId[id]).map((id) => byId[id]);
    },
  },
};

export default orderModule;
