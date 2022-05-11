import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import VueVirtualScroller from "vue-virtual-scroller";
import vClickOutside from "@/directives/vClickOutside";
import OrderTable from "@/components/table/order-table/OrderTable.vue";
import PackageLogs from "@/components/table/order-table/PackageLogs.vue";
import DetailTable from "@/components/table/table-finance/DetailTable";
import filters from "@/filters";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import "@/utils/browserUnSupport";
import "ant-design-vue/dist/antd.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import "maplibre-gl/dist/maplibre-gl.css";

import VueApexCharts from "vue3-apexcharts";

const app = createApp(App)
  .use(store)
  .use(Antd)
  .use(router)
  .use(VueVirtualScroller)
  .use(VueApexCharts)
  .directive("click-outside", vClickOutside);

app.component("order-table", OrderTable);
app.component("package-logs", PackageLogs);
app.component("detail-table", DetailTable);

Sentry.init({
  app,
  dsn: process.env.VUE_APP_DSN_SENTRY_URL,
  normalizeDepth: 3,
  environment:
    process.env.VUE_APP_ENV === "production" ? "production" : "development",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: [process.env.VUE_APP_BASE_URL, /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === "xhr") {
      const data = {
        requestBody: hint.xhr.__sentry_xhr__.body,
        response: hint.xhr.response,
        responseUrl: hint.xhr.responseURL,
      };
      return { ...breadcrumb, data };
    }
    return breadcrumb;
  },
});

app.config.globalProperties.$filters = filters;
app.mount("#app");
