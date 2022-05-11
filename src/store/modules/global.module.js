import common from "@/utils/common";
import {
  DEFAULT_BBS_MAX_WEIGHT,
  EXTRA_BBS_PROVINCES,
  DEFAULT_BBS_MAX_VALUE,
  DEFAULT_EXPRESS_MAX_VALUE,
} from "@/contants/order";
const globalModule = {
  namespaced: true,
  state: {
    screen: "summary",
    weightExpressDataSource: common.generateExpressWeightDataSource(),
    daysReturnDataSource: common.generateDaysReturnDataSource(),
    weightDataSource: common.generateWeightDataSource(),
    quantityDataSource: common.generateQuantityDataSource(),
    sizeDataSource: common.generateSizeDataSource(),
    packageLabels: [],
    packageNotes: [],
    pickDateDataSource: [
      {
        label: "13h - 14h",
        value: "13h-14h",
      },
      {
        label: "14h - 15h",
        value: "13h-14h",
      },
      {
        label: "15h - 16h",
        value: "13h-14h",
      },
      {
        label: "16h - 17h",
        value: "13h-14h",
      },
      {
        label: "17h - 18h",
        value: "13h-14h",
      },
      {
        label: "18h - 19h",
        value: "13h-14h",
      },
      {
        label: "19h - 20h",
        value: "13h-14h",
      },
      {
        label: "20h - 21h",
        value: "13h-14h",
      },
      {
        label: "21h - 22h",
        value: "13h-14h",
      },
      {
        label: "7h - 8h sáng mai",
        value: "13h-14h",
      },
      {
        label: "8h - 9h sáng mai",
        value: "13h-14h",
      },
    ],
    deliverDateDataSource: [
      {
        label: "Tối hôm nay",
        value: "tonight",
      },
      {
        label: "Sáng ngày mai",
        value: "tomorow",
      },
      {
        label: "Chiều ngày mai",
        value: "afternoon",
      },
    ],
    shipFeeTypeDataSource: [
      {
        label: "Shop trả ship",
        value: "1",
      },
      {
        label: "Khách trả ship",
        value: "0",
      },
    ],
    provinces: [],
    pickAddresses: [],
    nearOffices: [],
    allowLocation: false,
    visibleMessagesSystemModal: false,
  },
  mutations: {
    setScreen(state, payload) {
      state.screen = payload.screen;
    },
    setProvinces(state, payload) {
      state.provinces = payload;
    },
    setPickAddress(state, payload) {
      state.pickAddresses = payload;
    },
    setPackageLabel(state, payload) {
      state.packageLabels = payload;
    },
    setPackageNote(state, payload) {
      state.packageNotes = payload;
    },
    setNearOffices(state, payload) {
      state.nearOffices = payload;
    },
    setAllowLocation(state, payload) {
      state.allowLocation = payload;
    },
    setVisibleMessagesSystemModal(state, payload) {
      state.visibleMessagesSystemModal = payload;
    },
  },
  actions: {
    // Có thể bỏ gọi thẳng mutations bỏ qua actions
    setScreen({ commit }, payload) {
      commit("setScreen", payload);
    },
  },
  getters: {
    getProvinces: (state) => state.provinces,
    getPickAddresses: (state) => state.pickAddresses,
    getNearOffices: (state) => state.nearOffices,
    getAllowLocation: (state) => state.allowLocation,
    getBbsMaxWeight: () => (provinceId) => {
      let bbsMaxWeight =
        EXTRA_BBS_PROVINCES.find((e) => e.provinceId == provinceId)
          ?.bbsMaxWeight || DEFAULT_BBS_MAX_WEIGHT;
      return bbsMaxWeight;
    },
    getBbsMaxValue: () => (orderType) => {
      return orderType.toLowerCase() == "bbs"
        ? DEFAULT_BBS_MAX_VALUE
        : DEFAULT_EXPRESS_MAX_VALUE;
    },
  },
};

export default globalModule;
