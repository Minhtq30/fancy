<template>
  <Header v-show="listLayout.includes('header')" />
  <main id="main-app" v-show="listLayout.includes('main')" class="flex">
    <div
      v-show="
        listLayout.includes('main-left') ||
        listLayout.includes('main-left-extend')
      "
      v-if="isAuthentication"
      :class="layout === 'chat' ? 'main-left-extend' : 'main-left'"
    >
      <ChatContainer v-if="!isHiddenChatIFrame" />
    </div>
    <div
      v-show="
        listLayout.includes('main-content') ||
        listLayout.includes('main-content-full')
      "
      id="main-content"
      :class="
        listLayout.includes('main-content-full')
          ? 'main-content-full'
          : 'main-content'
      "
    >
      <router-view />
    </div>
    <div
      v-if="listLayout.includes('main-right')"
      id="main-right"
      class="main-right"
    >
      <MenuRightContainer />
    </div>
  </main>
  <!-- Global -->
  <order-excel-status-draft />
  <order-excel-status-ecom />
  <order-excel-status-ecom-from-draft />
  <messages-system />
</template>

<script>
import { get, isEmpty, map } from "lodash";

// Components
import { Header } from "@/components";
import { ChatContainer, MenuRightContainer } from "@/containers";
import OrderExcelStatusDraft from "@/components/notify/OrderExcelStatusDraft";
import OrderExcelStatusEcom from "@/components/notify/OrderExcelStatusEcom";
import OrderExcelStatusEcomFromDraft from "@/components/notify/OrderExcelStatusEcomFromDraft";
import MessagesSystem from "@/components/notify/MessagesSystem.vue";

// Util
import services from "@/services";
import common from "@/utils/common";
import { message } from "ant-design-vue";

message.config({
  top: "88px",
  duration: 4,
  maxCount: 3,
});

const LAYOUTS = {
  main: ["header", "main", "main-left", "main-right", "main-content"],
  header: ["header", "main", "main-content-full"],
  blank: ["main", "main-content-full"],
  chat: ["header", "main", "main-left-extend", "main-right"],
};

let active = false;

export default {
  components: {
    OrderExcelStatusDraft,
    OrderExcelStatusEcom,
    OrderExcelStatusEcomFromDraft,
    Header,
    ChatContainer,
    MenuRightContainer,
    MessagesSystem,
  },
  props: {
    layout: {
      type: String,
      default: "blank",
    },
  },
  computed: {
    listLayout() {
      return LAYOUTS[this.layout];
    },
    isAuthentication() {
      return this.$store.getters["auth/getAuthentication"];
    },
    isHiddenChatIFrame() {
      if (isEmpty(this.$route.meta) || this.$route.meta.isHiddenChatIFrame) {
        return true;
      }
      return false;
    },
  },
  watch: {
    async isAuthentication(newValue) {
      if (newValue && !active) {
        await this.getProvince();
        // TODO:
        // this.getPackageNote();
        active = true;
      }
    },
  },
  methods: {
    async getProvince() {
      let data = await services.$address.browseProvinceListWithCache();
      if (data && data.length > 0) {
        let convertedProvinces = common.convertLabelValueDataSource({
          dataSource: data,
          labelName: "name",
          valueName: "id",
          toStringValue: true,
        });
        this.$store.commit("global/setProvinces", convertedProvinces);
      }
    },
    async getPickAddress() {
      let res = await services.$shop.browsePickAddress();
      if (res && res.success) {
        let converted = common.convertLabelValueDataSource({
          dataSource: get(res, "data", []),
          labelName: "fullname",
          valueName: "id",
          labelConvert: (item) => {
            let result = "";
            if (item.first_address) {
              result += item.first_address;
            }
            if (item.hamlet || item.street) {
              result += `,${item.street || item.hamlet}`;
            }
            if (item.ward) {
              result += `,${item.ward}`;
            }
            if (item.district) {
              result += `,${item.district}`;
            }
            if (item.province) {
              result += `,${item.province}`;
            }
            return result;
          },
        });
        this.$store.commit("global/setPickAddress", converted);
      }
    },
    async getPackageLabel() {
      let res = await services.$package.browsePackageLabel();
      if (res && res.success) {
        let converted = common.convertLabelValueDataSource({
          dataSource: get(res, "data", []),
          labelName: "name",
          valueName: "id",
        });
        this.$store.commit("global/setPackageLabel", converted);
      }
    },
    async getPackageNote() {
      let res = await services.$package.browsePackageNote();
      if (res && res.success) {
        let converted = map(get(res, "data", []), (x) => ({
          label: x,
          value: x,
        }));
        this.$store.commit("global/setPackageNote", converted);
      }
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        const vm = this;
        navigator.geolocation.getCurrentPosition(
          () => vm.$store.commit("global/setAllowLocation", true),
          () => vm.$store.commit("global/setAllowLocation", false)
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  font-size: 1rem;
  height: calc(100vh - 64px);
  overflow-y: auto;

  .main-left {
    width: 300px;
    border-right: 1px solid var(--grayColor);
    position: sticky;
    left: 0;
    height: calc(100vh - 64px);
    overflow: hidden;
  }

  .main-left-extend {
    width: calc(100% - 300px);
    position: sticky;
    left: 0;
    height: calc(100vh - 64px);
    overflow: hidden;
  }

  .main-content {
    width: calc(100% - 600px);
    height: calc(100vh - 64px);
    overflow: auto;
  }

  .main-content-full {
    width: 100%;
    padding: 15px 15px 0 15px;
  }

  .main-animation {
    transition: width 0.1s linear;
  }

  .main-right {
    width: 300px;
    border-left: 1px solid var(--grayColor);
    position: sticky;
    height: calc(100vh - 64px);
    overflow-y: hidden;
  }
  &.is-collapsed-menu-right {
    .main-right {
      width: 125px;
    }
    .main-content {
      width: calc(100% - 300px - 125px);
    }
    .main-left-extend {
      width: calc(100% - 125px);
    }
  }
}
</style>
