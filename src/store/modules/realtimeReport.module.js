const realtimeReport = {
  namespaced: true,
  state: {
    currentDate: "",
    currentTime: "",
    error: "",
  },
  mutations: {
    update(state, payload) {
      state[payload.field] = payload.data;
    },
    setCurrentDate(state, payload) {
      state.currentDate = payload;
    },
    setCurrentTime(state, payload) {
      state.currentTime = payload;
    },
  },
};

export default realtimeReport;
