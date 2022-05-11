import { get, filter, forEach, isEqual, uniqBy } from "lodash";

const DEFAULT_STATE = {
  totalOrder: 0,
  pickTimes: {},
  xFastSessions: {},
  customerInfo: {},
  selectedListOrder: {},
  fetchingParseAllAddress: {},
  fetchingCheckAllXFast: {},
  isApplyAllMessage: false,
  isApplyAllWarehouse: false,
  isApplyAllPickTime: false,
  isApplyAllTransport: false,
  isApplyAllFreeShip: false,
  showFilter: false,
  selectManyMode: false,
  confirmGHTKTrigger: false,
  showError: false,
  openEditLiveStreamModal: false,
  showQuickConfigModal: false,
  showCustomerInfoModal: false,
  typeFilter: "total",
  listWarehouse: [],
  listProduct: [],
  excelColumns: {
    1: {
      id: 1,
      name: "client_id",
    },
    2: {
      id: 2,
      name: "name",
    },
    3: {
      id: 3,
      name: "phone",
    },
    4: {
      id: 4,
      name: "address",
    },
    5: {
      id: 5,
      name: "product_name",
    },
    6: {
      id: 6,
      name: "quantity",
    },
    7: {
      id: 7,
      name: "weight",
    },
    8: {
      id: 8,
      name: "money",
    },
    9: {
      id: 9,
      name: "pick_money",
    },
    10: {
      id: 10,
      name: "message",
    },
  },
  sessions: [],
  sessionsEcom: [],
};
const state = () => DEFAULT_STATE;

const mutations = {
  showAction(state, payload) {
    if (payload.actionName) {
      state[payload.action] = payload.actionValue;
      return;
    }
    state[payload.action] = !state[payload.action];
  },
  browseWareHouses(state, payload) {
    const { listWarehouse } = payload;
    state.listWarehouse = listWarehouse;
  },
  browseListProduct(state, payload) {
    const { listProduct } = payload;
    state.listProduct = listProduct;
  },
  updateFetchingParseAllAddress(state, payload) {
    const { nextFetching, hardUpdate } = payload;
    if (hardUpdate) {
      state.fetchingParseAllAddress = nextFetching;
    } else {
      state.fetchingParseAllAddress = {
        ...state.fetchingParseAllAddress,
        ...nextFetching,
      };
    }
  },
  updateFetchingCheckAllXFast(state, payload) {
    const { nextFetching, hardUpdate } = payload;
    if (hardUpdate) {
      state.fetchingCheckAllXFast = nextFetching;
    } else {
      state.fetchingCheckAllXFast = {
        ...state.fetchingCheckAllXFast,
        ...nextFetching,
      };
    }
  },
  browseXFastSession(state, payload) {
    const { nextXFastSessions } = payload;
    state.xFastSessions = {
      ...state.xFastSessions,
      ...nextXFastSessions,
    };
  },
  browsePickTimes(state, payload) {
    const { nextPickTimes } = payload;
    state.pickTimes = {
      ...state.pickTimes,
      ...nextPickTimes,
    };
  },
  selectOrder(state, payload) {
    const { newSelectedOrder, isHard } = payload;
    if (isHard) {
      state.selectedListOrder = newSelectedOrder;
    } else {
      state.selectedListOrder = {
        ...state.selectedListOrder,
        ...newSelectedOrder,
      };
    }
  },
  checkAllPickTime(state, payload) {
    const { listPickTime, warehouse } = payload;
    const filteredlistOrder = filter(
      state.listOrder,
      (order) =>
        order.warehouse &&
        isEqual(
          {
            order_id: order.orderId,
            province_id: order.warehouse.province_id,
            district_id: order.warehouse.district_id,
          },
          warehouse
        )
    );
    forEach(filteredlistOrder, (order) => {
      const provinceId = get(order, "warehouse.province_id");
      const districtId = get(order, "warehouse.district_id");
      const orderId = get(order, "orderId");
      if (provinceId && districtId) {
        state.pickTimes = {
          ...state.pickTimes,
          [`${orderId}`]: listPickTime || [],
        };
      }
    });
  },
  applyAllByField(state, payload) {
    const { fieldName, fieldValue } = payload;
    state[fieldName] = fieldValue;
  },
  updateTotal(state, payload) {
    state.totalOrder = payload;
  },
  updateSessions(state, payload) {
    state.sessions = uniqBy([...state.sessions, ...payload], "session_id");
  },
  updateSessionsEcom(state, payload) {
    state.sessionsEcom = uniqBy(
      [...state.sessionsEcom, ...payload],
      "session_id"
    );
  },
};
const getters = {};
export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
