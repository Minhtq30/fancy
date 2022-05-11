import operateService from "@/services/operate.service";
import {
  KEY_CACHE_REALTIME_REPORT_B2C,
  KEY_CACHE_REALTIME_REPORT_C2C,
  OPERATE_TYPE,
} from "@/contants";
import { OPERATE_TYPE_C2C } from "@/contants/operate";

const getTypeByKey = (key) => {
  const operateType = key.includes("c2c.") ? OPERATE_TYPE_C2C : OPERATE_TYPE;
  let _type = "";

  for (const ot of operateType) {
    if (ot.key === key) {
      _type = ot.type;
      break;
    }
  }

  return _type;
};

const operateModule = {
  namespaced: true,
  state: {
    byId: {},
    types: {},
    typesC2C: {},
    errors: {},
    loadingGetIds: {},
    loadingGetDetail: {},
  },
  mutations: {
    update(state, payload) {
      if (payload.isB2C) {
        state.types[payload.type] = payload.data;
      } else {
        state.typesC2C[payload.type] = payload.data;
      }
    },
    setLoadingGetIds(state, payload) {
      state.loadingGetIds[payload.key] = payload.value;
    },
    setMetricC2C(state, payload) {
      localStorage.setItem(
        KEY_CACHE_REALTIME_REPORT_C2C,
        JSON.stringify({
          ttl: new Date().getTime() + 5 * 60 * 1000 - 1000,
          data: payload,
        })
      );
    },
    setMetricB2C(state, payload) {
      localStorage.setItem(
        KEY_CACHE_REALTIME_REPORT_B2C,
        JSON.stringify({
          ttl: new Date().getTime() + 5 * 60 * 1000 - 1000,
          data: payload,
        })
      );
    },
  },
  actions: {
    async getIdsRealtimeReport({ commit }, payload) {
      commit("setLoadingGetIds", { key: payload.key, value: true });

      try {
        const isB2C = payload.key.includes("c2c.") ? false : true;
        const type = getTypeByKey(payload.key);

        const response = await operateService.getRealtimeReport({
          type,
          isB2C,
        });

        commit("update", { data: response, type, isB2C });
      } catch (error) {
        console.log(error);
      }

      commit("setLoadingGetIds", { key: payload.key, value: false });
    },
  },
  getters: {
    getIdsByKey: (state) => (key) => {
      const types = key.includes("c2c.") ? state.typesC2C : state.types;
      const _key = key.replace("c2c._", "").replace("c2c.", "");

      if (_key === "incurredReportData.incurred") {
        if (!types.pick) return [];

        const pickingReportDataIds = types.pick?.pickingReportData?.done || [];
        const incurredReportData = types.pick?.incurredReportData?.data || [];
        return [...pickingReportDataIds, ...incurredReportData];
      }

      if (_key === "delayNotPickReportData.delay_not_pick") {
        if (!types.delay) return [];

        const delayNotPickReportDataIds =
          types.delay?.delayNotPickReportData?.data || [];
        return [...delayNotPickReportDataIds];
      }

      if (_key === "waitTransferReportData.wait_transfer") {
        if (!types.deliver) return [];

        const waitTransferReportDataIds =
          types.deliver?.waitTransferReportData?.data || [];
        return [...waitTransferReportDataIds];
      }

      if (_key === "deliveringReportData.done") {
        if (!types.deliver) return [];

        const deliveringReportDataIds =
          types.deliver?.deliveringReportData?.done || [];
        return [...deliveringReportDataIds];
      }

      if (_key === "delayReportData.delay_not_contact") {
        if (!types.delay) return [];

        const delayReportDataIds =
          types.delay?.delayReportData?.delay_not_contact || [];
        return [...delayReportDataIds];
      }

      if (_key === "delayReportData.delay_customer_refused") {
        if (!types.delay) return [];

        const delayReportDataIds =
          types.delay?.delayReportData?.delay_customer_refused || [];
        return [...delayReportDataIds];
      }

      if (_key === "delayReportData.delay_wrong_info") {
        if (!types.delay) return [];

        const delayReportDataIds =
          types.delay?.delayReportData?.delay_wrong_info || [];
        return [...delayReportDataIds];
      }

      // Chỉ C2C có delay_by_shop
      if (_key === "delayReportData.delay_by_shop") {
        if (!types.delay) return [];

        const delayReportDataIds =
          types.delay?.delayReportData?.delay_by_shop || [];
        return [...delayReportDataIds];
      }

      if (_key === "delayReportData.delay_customer_change_date") {
        if (!types.delay) return [];

        const delayReportDataIds =
          types.delay?.delayReportData?.delay_customer_change_date || [];
        return [...delayReportDataIds];
      }

      if (_key === "cancelByShopReportData.cancel_by_shop") {
        if (!types.cancel) return [];

        const ids =
          types.cancel?.cancelByShopReportData?.cancelByShop ||
          types.cancel?.cancelByShopReportData?.cancel_by_shop ||
          [];

        return [...ids];
      }

      if (
        _key ===
        "cancelCouldNotContactOrRefuseReportData.cancel_could_not_contact_refuse"
      ) {
        if (!types.cancel) return [];

        const cancelCouldNotContactOrRefuseReportDataIds =
          types.cancel?.cancelCouldNotContactOrRefuseReportData
            ?.cancelPkgsCouldNotContactOrRefuse || [];
        return [...cancelCouldNotContactOrRefuseReportDataIds];
      }

      if (_key === "delayReportData.delay_other_reason_v2") {
        if (!types.delay) return [];

        const delayReportDataIds =
          types.delay?.delayReportData?.delay_other_reason_v2 || [];
        return [...delayReportDataIds];
      }

      if (_key === "waitingToReturnReportData.waiting_to_return") {
        if (!types.returning) return [];

        const waitingToReturnReportDataIds =
          types.returning?.waitingToReturnReportData?.waitingToReturn || [];

        return [...waitingToReturnReportDataIds];
      }

      if (_key === "returningReportData.returning") {
        if (!types.returning) return [];

        const returningReportDataIds =
          types.returning?.returningReportData?.returning || [];
        return [...returningReportDataIds];
      }

      if (_key === "waitToConfirmReturnReportData.wait_to_confirm_return") {
        if (!types.wait_to_confirm_return) return [];

        const ids =
          types.wait_to_confirm_return?.waitToConfirmReturnReportData
            ?.waitingToConfirmReturn || [];
        return [...ids];
      }

      if (
        _key ===
        "notDeliverDoneAndWaitForApprovalReportData.not_deliver_wait_for_approval"
      ) {
        if (!types.not_deliver_wait_approval) return [];

        const notDeliverWaitForApprovalIds =
          types.not_deliver_wait_approval?.notDeliverWaitForApproval
            ?.notDeliverDoneAndWaitForApprovalPackages || [];
        return [...notDeliverWaitForApprovalIds];
      }

      if (_key === "returnedReportData.returned") {
        if (!types.returning) return [];

        const returnedReportDataIds =
          types.returning?.returnedReportData?.returnedPackages || [];
        return [...returnedReportDataIds];
      }

      if (_key === "ticketReportData.ticket") {
        if (!types.ticket) return [];

        const exportReportDataIds =
          types.ticket?.exportReportData?.exportPackages || [];
        const breakReportDataIds =
          types.ticket?.breakReportData?.breakPackages || [];
        const changeReportDataIds =
          types.ticket?.changeReportData?.changePackages || [];

        return [
          ...exportReportDataIds,
          ...breakReportDataIds,
          ...changeReportDataIds,
        ];
      }

      if (_key === "deliveringReportData.notProcessed") {
        if (!types.deliver) return [];

        const ids = types.deliver?.deliveringReportData?.notProcessed || [];
        return [...ids];
      }

      if (_key === "packageExport") {
        if (!types.package_export) return [];

        const ids = types.package_export?.packageExport || [];
        return [...ids];
      }

      if (_key === "packageExchange") {
        return []; // Hieupt confirm auto trả 0
      }

      if (_key === "deliveringReportData.pickMoney") {
        if (!types.deliver) return [];

        const deliveringReportDataIds =
          types.deliver?.deliveringReportData?.done || [];
        return [...deliveringReportDataIds];
      }

      if (_key === "inventoryReportData.inventory") {
        if (!types.inventory) return [];

        const ids = types.inventory?.inventoryReportData?.inventory || [];
        return [...ids];
      }

      return [];
    },
  },
};

export default operateModule;
