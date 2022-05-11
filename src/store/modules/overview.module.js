import overviewService from "@/services/overview.service";

const orderModule = {
  namespaced: true,
  state: {
    topProducts: {
      top_selling: [],
      return_rate: [],
    },
    topAreas: {
      top_selling: [],
      return_rate: [],
    },
    query: {
      range: "7_day_before",
      type: "top_selling",
      from: "",
      to: "",
    },
    returnPackageData: {
      current: {
        total_packages: 0,
        return_rate: 0,
      },
      past: {
        total_packages: 0,
        return_rate: 0,
      },
      change: {
        return_rate: "",
        total_packages: "",
      },
    },
  },
  getters: {
    getDataForPieChart: (state) => {
      const total_packages = state.returnPackageData.current.total_packages;
      const packageData = state.returnPackageData.current;
      if (total_packages && packageData) {
        const shop_cancel = packageData.shop_cancel
          ? (
              (packageData.shop_cancel.count_packages / total_packages) *
              100
            ).toFixed(1)
          : 0;
        const cannot_contact = packageData.cannot_contact
          ? (
              (packageData.cannot_contact.count_packages / total_packages) *
              100
            ).toFixed(1)
          : 0;
        const other_reasons = packageData.other_reasons
          ? (
              (packageData.other_reasons.count_packages / total_packages) *
              100
            ).toFixed(1)
          : 1;
        const data = [
          Number(shop_cancel),
          Number(cannot_contact),
          Number(
            (
              100 -
              Number(shop_cancel) -
              Number(cannot_contact) -
              Number(other_reasons)
            ).toFixed(1)
          ),
          Number(other_reasons),
        ];
        return data;
      }
      return [0, 0, 0, 1];
    },
    getCustomerRejectData: (state) => (type) => {
      const packageData = state.returnPackageData[type];
      let rejectData = {};
      const defaultData = {
        count_packages: 0,
        count_products: 0,
        total_COD: 0,
      };
      rejectData.shop_cancel = packageData.shop_cancel
        ? packageData.shop_cancel
        : defaultData;
      rejectData.cannot_contact = packageData.cannot_contact
        ? packageData.cannot_contact
        : defaultData;
      rejectData.customer_reject = packageData.customer_reject
        ? packageData.customer_reject
        : defaultData;
      rejectData.other_reasons = packageData.other_reasons
        ? packageData.other_reasons
        : defaultData;
      rejectData.export_exchange = packageData.export_exchange
        ? packageData.export_exchange
        : defaultData;
      return rejectData;
    },
  },
  mutations: {
    setTopProduct(state, payload) {
      state.topProducts = payload;
    },
    setTopArea(state, payload) {
      state.topAreas = payload;
    },
    setReturnPackageData(state, payload) {
      state.returnPackageData = payload;
    },
    setQuery(state, { range = "", type = "", from = "", to = "" }) {
      if (type) {
        state.query.type = type;
      }
      state.query.range = range;
      state.query.from = from;
      state.query.to = to;

      if (state.query.from && state.query.to) {
        state.query.range = "custom";
      }
    },
  },
  actions: {
    async getTopProduct({ state, commit }, payload) {
      try {
        const query = payload || state.query;
        const response = await overviewService.getTopProduct(query);
        if (response.data.success) {
          let transformData = response.data.data;
          for (let key in transformData) {
            transformData[key].map((item) => {
              for (let key in item) {
                if (
                  key === "female" ||
                  key === "bad_report_public" ||
                  key === "good_report" ||
                  key === "is_blue" ||
                  key === "is_purple" ||
                  key === "male" ||
                  key === "total" ||
                  key === "total_return" ||
                  key === "total_success"
                ) {
                  let arr = Number(item[key]);
                  item[key] = arr;
                }
              }
            });
          }
          commit("setTopProduct", transformData);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getTopArea({ state, commit }, payload) {
      try {
        const query = payload || state.query;
        const response = await overviewService.getTopArea(query);
        if (response.data.success) {
          let transformData = response.data.data;
          for (let key in transformData) {
            transformData[key].map((item) => {
              for (let key in item) {
                if (
                  key === "female" ||
                  key === "bad_report_public" ||
                  key === "good_report" ||
                  key === "is_blue" ||
                  key === "is_purple" ||
                  key === "male" ||
                  key === "total" ||
                  key === "total_return" ||
                  key === "total_success"
                ) {
                  let arr = Number(item[key]);
                  item[key] = arr;
                }
              }
            });
          }
          commit("setTopArea", response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getReturnPackageData({ state, commit }, payload) {
      try {
        const query = payload || state.query;
        const response = await overviewService.getReturnPackage(query);
        if (response.data.success) {
          commit("setReturnPackageData", response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default orderModule;
