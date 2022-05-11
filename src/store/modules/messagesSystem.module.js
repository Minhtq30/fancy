const globalModule = {
  namespaced: true,
  state: {
    messages: {},
  },
  mutations: {
    addMessage(state, payload) {
      state.messages[payload.id] = payload;
    },
    addMultiMesssages(state, payload) {
      state.messages = {
        ...state.messages,
        ...payload,
      };
    },
    updateMessage(state, payload) {
      state.messages[payload.id] = {
        ...state.messages[payload.id],
        ...payload.dataUpdate,
      };
    },
    removeMessage(state, payload) {
      state.messages[payload.id] = null;
    },
    clearAllMessages(state) {
      state.messages = {};
    },
  },
  getters: {
    getMessagesSystem: (state) => {
      const _messages = [];

      for (const id in state.messages) {
        if (state.messages[id]) {
          _messages.push(state.messages[id]);
        }
      }
      return _messages;
    },
  },
};

export default globalModule;
