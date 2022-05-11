const authModule = {
  namespaced: true,
  state: {
    isAuthentication: false,
  },
  mutations: {
    setAuthentication(state, payload) {
      state.isAuthentication = payload;
    },
  },
  actions: {},
  getters: {
    getAuthentication: (state) => state.isAuthentication,
  },
};

export default authModule;
