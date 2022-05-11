import financeService from "@/services/finance.service";
import { SUM_FIELDS, SUB_FIELDS } from "@/contants/finance";

import { SUM_FIELDS_AUDIT, SUB_FIELDS_AUDIT } from "@/contants/finance";
import { safeJSONParse } from "@/utils";
import { KEY_CACHE_NEXT_AUDIT } from "@/contants";

const financeModule = {
  namespaced: true,
  state: {
    balance: 0,
    lastAuditData: null,
    nextAuditData: {},
    listPkgs: null,
    auditBills: null,
    detailById: {},
    loading: true,
    vatBillData: {
      page_data: [],
      pagination: {},
      count_status: {},
    },
    filterKeyCashInOut: null,
    filterKeys: {},
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setNextAuditData(state, payload) {
      state.lastAuditData = state.nextAuditData;
      state.nextAuditData = payload;
      if (!state.listPkgs) {
        let _listPkgs = payload.list_pkgs || {};
        _listPkgs.store_fee = _listPkgs.store || 0;
        _listPkgs.insurance_fee = _listPkgs.insurance || 0;
        _listPkgs.change_address_fee = _listPkgs.change_address || 0;
        _listPkgs.return_fee = _listPkgs.return || 0;
        _listPkgs.sale_off = _listPkgs.discount_ids || 0;
        state.listPkgs = _listPkgs;
      }
    },
    setAuditBills(state, payload) {
      state.auditBills = payload;
    },
    setVatBillData(state, payload) {
      state.vatBillData = payload;
    },
    updateDetail(state, payload) {
      const id = String(payload.id);

      state.detailById[id] = {
        ...(state.detailById[id] || {}),
        ...payload,
      };
    },
    setFilterKeyCashInOut(state, payload) {
      let cashInGroup = Object.keys(payload.cashInGroup).map((key) => {
        return {
          key: key,
          title: payload.cashInGroup[key],
        };
      });
      let cashOutGroup = Object.keys(payload.cashOutGroup).map((key) => {
        return {
          key: key,
          title: payload.cashOutGroup[key],
        };
      });
      state.filterKeyCashInOut = {
        cashInGroup,
        cashOutGroup,
      };
    },
    setFilterKeys(state, payload) {
      state.filterKeys = {
        ...state.filterKeys,
        [payload.key]: payload.value,
      };
    },
    setBalance(state, payload) {
      state.balance = payload;
    },
  },
  actions: {
    async getNextAuditData({ commit }, payload) {
      commit("setLoading", true);

      try {
        const metricNextAudit = safeJSONParse(
          localStorage.getItem(KEY_CACHE_NEXT_AUDIT)
        );

        let nextAuditData = {};

        if (
          !metricNextAudit.ttl ||
          metricNextAudit.ttl < new Date().getTime()
        ) {
          const response = await financeService.getNextAuditData(payload);

          nextAuditData = response?.data?.data?.next || {};

          localStorage.setItem(
            KEY_CACHE_NEXT_AUDIT,
            JSON.stringify({
              ttl: new Date().getTime() + 5 * 60 * 1000 - 1000,
              data: nextAuditData,
            })
          );
        } else {
          nextAuditData = metricNextAudit?.data || {};
        }

        const fields = [
          "sale_off",
          "refund_money",
          "deliver_fee",
          "return_fee",
          "extra_fee",
          "deb_bill",
          "transfer_fee",
        ];

        for (const field of fields) {
          nextAuditData[field] = Math.abs(nextAuditData[field] || 0);
        }

        nextAuditData.sale_off = Math.abs(nextAuditData.sale_off || 0);

        nextAuditData.pick_money = Math.abs(
          nextAuditData.pick_money || nextAuditData.pick_mon || 0
        );

        let total_sum = 0;
        let total_sub = 0;

        for (const field of SUM_FIELDS) {
          total_sum += Math.abs(nextAuditData[field.key] || 0);
        }

        for (const field of SUB_FIELDS) {
          total_sub += Math.abs(nextAuditData[field.key] || 0);
        }

        nextAuditData.total_sum = total_sum;
        nextAuditData.total_sub = total_sub;

        commit("setNextAuditData", nextAuditData);
      } catch (error) {
        console.log(error);
      }
      commit("setLoading", false);
    },
    async getBillDetail({ commit }, payload) {
      commit("updateDetail", { id: payload.id, is_loading_get_detail: true });
      let detailInfo = { id: payload.id };
      let loaded_detail_success = false;

      try {
        const response = await financeService.getBillDetail({
          id: payload.id,
        });

        let packages = [];

        const responseData = response?.data?.data;

        if (responseData) {
          const listPackgages = responseData?.packages || [];
          for (const p of listPackgages) {
            if (p.Package) {
              const packageItem = p.Package;
              packages.push(packageItem);
              for (const sumField of SUM_FIELDS_AUDIT) {
                if (!detailInfo[sumField.key]) {
                  detailInfo[sumField.key] = 0;
                }
                detailInfo[sumField.key] += packageItem[sumField.key]
                  ? Math.abs(Number(packageItem[sumField.key]))
                  : 0;
              }
              for (const subField of SUB_FIELDS_AUDIT) {
                // get debt_money, transfer_fee from outside
                if (
                  subField.key === "debt_money" ||
                  subField.key === "transfer_fee"
                ) {
                  continue;
                }
                if (!detailInfo[subField.key]) {
                  detailInfo[subField.key] = 0;
                }
                detailInfo[subField.key] += packageItem[subField.key]
                  ? Math.abs(Number(packageItem[subField.key]))
                  : 0;
              }
            }

            if (responseData.debt_money) {
              detailInfo.debt_money = Math.abs(responseData.debt_money);
            }

            if (responseData.transfer_fee) {
              detailInfo.transfer_fee = Math.abs(responseData.transfer_fee);
            }
          }

          detailInfo = {
            ...detailInfo,
            ...responseData,
          };
        }

        detailInfo.packages = packages;

        loaded_detail_success = true;
      } catch (error) {
        console.log(error);
      }

      commit("updateDetail", {
        ...detailInfo,
        is_loading_get_detail: false,
        loaded_detail_success,
      });
    },
    async getAuditHistory({ commit }, payload) {
      try {
        const response = await financeService.getAuditHistory(payload);

        let bills = [];

        if (!payload.type || payload.type === "all") {
          bills = response?.data?.data?.list_all_bill || [];
        } else if (payload.type === "refund") {
          bills = response?.data?.data?.his_audit_refund?.list || [];
        } else if (payload.type === "debt") {
          bills = response?.data?.data?.his_audit_debt?.list || [];
        } else if (payload.type === "audit") {
          bills = response?.data?.data?.his?.list || [];
        }

        if (!bills[0]) bills = [];

        commit("setAuditBills", bills);
      } catch (error) {
        console.log(error);
      }
    },
    async getFilterKeyCashInOut({ state, commit }) {
      if (state.filterKeyCashInOut) return;
      try {
        const response = await financeService.getFilterKeyCashInOut();

        let filterKey = [];
        if (response.data.success) {
          filterKey = response.data.data;
          commit("setFilterKeyCashInOut", filterKey);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getFilterKeys({ state, commit }, params = {}) {
      const key = JSON.stringify(params);

      if (state.filterKeys[key]) return;

      try {
        const response = await financeService.getFilterKey(params);

        if (response.data.success) {
          commit("setFilterKeys", { key, value: response.data.data });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  getters: {
    getFilterKeys:
      (state) =>
      (params = {}) => {
        const key = JSON.stringify(params);
        return state.filterKeys[key] || [];
      },
  },
};

export default financeModule;
