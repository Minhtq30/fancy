// Chứa các dữ liệu từ localStorage.
const localStorageModule = {
  namespaced: true,
  state: {
    // Lưu trữ các config giao diện, config user cần dùng trong localStorage.
    config: {},
  },
  mutations: {
    logout(state) {
      state.shop_config = {};
    },
  },
  actions: {},
};

export default localStorageModule;
