// Chứa các dữ liệu từ sessionStorage.
const sessionStorageModule = {
  namespaced: true,
  state: {
    savedListOrder: [],
    order_excel_config: {},
    list_hub: [],
  },
  mutations: {
    saveListOrder(state, payload) {
      state.savedListOrder = payload.listOrder;
    },
    order_excel_config(state, payload) {
      state.order_excel_config = payload.order_excel_config;
    },
    list_hub(state, payload) {
      state.list_hub = payload.list_hub;
    },
    logout(state) {
      state.savedListOrder = [];
      state.order_excel_config = {};
      state.list_hub = [];
    },
    syncData(state, payload) {
      state.savedListOrder = payload.listOrder;
      state.order_excel_config = payload.order_excel_config;
      state.list_hub = payload.list_hub;
    },
  },
  actions: {},
};

export default sessionStorageModule;
