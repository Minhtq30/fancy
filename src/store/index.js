import { createStore } from "vuex";
import globalModule from "./modules/global.module";
import orderExcelModule from "./modules/orderExcel.module";
import orderDraftModule from "./modules/orderDraft.module";
import orderCreatedModule from "./modules/orderCreated.module";
import localStorageModule from "./modules/localStorage.module";
import sessionStorageModule from "./modules/sessionStorage.module";
import configModule from "./modules/config.module";
import constantModule from "./modules/constant.module";
import shopModule from "./modules/shop.module";
import orderModule from "./modules/order.module";
import realtimeReportModule from "./modules/realtimeReport.module";
import operateModule from "./modules/operate.module";
import financeModule from "./modules/finance.module";
import overviewModule from "./modules/overview.module";
import authModule from "./modules/auth.module";
import messagesSystemModule from "./modules/messagesSystem.module";
import warehouseModule from "@/store/modules/warehouse.module";

export default createStore({
  modules: {
    global: globalModule,
    orderExcel: orderExcelModule,
    orderDraft: orderDraftModule,
    orderCreated: orderCreatedModule,
    localStorage: localStorageModule,
    sessionStorage: sessionStorageModule,
    config: configModule,
    constant: constantModule,
    shop: shopModule,
    order: orderModule,
    realtimeReport: realtimeReportModule,
    operate: operateModule,
    finance: financeModule,
    overview: overviewModule,
    auth: authModule,
    messagesSystem: messagesSystemModule,
    warehouse: warehouseModule,
  },
});
