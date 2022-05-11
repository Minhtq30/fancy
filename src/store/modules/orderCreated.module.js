const DEFAULT_STATE = {
  totalOrder: 0,
};

const state = () => DEFAULT_STATE;

const mutations = {
  updateTotal(state, payload) {
    state.totalOrder = payload;
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
