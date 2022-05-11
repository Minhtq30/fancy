<template>
  <div id="menu-right-container" class="menu-right-container">
    <div id="icon-collapsed" class="icon-collapsed" @click="toogleCollapsed">
      <img class="collapse-icon" src="@/assets/icons/back_active.svg" />
      <img class="expand-icon" src="@/assets/icons/next_active.svg" />
    </div>
    <div
      class="menu-right-wrapper"
      :class="{ [`total-items-${totalItems}`]: true }"
    >
      <order-menu
        :tabActive="tabActive"
        :handleToggle="handleToggle('order')"
      />
      <warehouse-menu
        v-if="isAllowShowWarehouse"
        :tabActive="tabActive"
        :handleToggle="handleToggle('warehouse')"
      />
      <finance-menu
        v-if="!isWalletActive && isAllowShowFinance"
        :tabActive="tabActive"
        :handleToggle="handleToggle('finance')"
      />
      <finance-menu-wallet
        v-if="isWalletActive && isAllowShowFinance"
        :tabActive="tabActive"
        :handleToggle="handleToggle('finance')"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import OrderMenu from "./OrderMenu.vue";
import FinanceMenu from "./FinanceMenu.vue";
import WarehouseMenu from "./WarehouseMenu.vue";
import FinanceMenuWallet from "./FinanceMenuWallet.vue";

import { ROLES } from "@/contants";

export default {
  components: {
    OrderMenu,
    FinanceMenu,
    WarehouseMenu,
    FinanceMenuWallet,
  },
  data() {
    return {
      tabActive: "",
      timer: "",
      intervalRealtime: "",
    };
  },
  computed: {
    ...mapState({
      shopStaff: (state) => state.shop.ShopStaff,
      wallet: (state) => state.shop?.Wallet || {},
    }),
    role() {
      return this.shopStaff?.role || "";
    },
    isAllowShowOperate() {
      if (!this.role) return false;
      return [ROLES.ADMIN, ROLES.OPERATOR].includes(this.role);
    },
    isAllowShowFinance() {
      if (!this.role) return false;
      return [ROLES.ADMIN, ROLES.CASHIER].includes(this.role);
    },
    isAllowShowWarehouse() {
      if (!this.role) return false;
      return [ROLES.ADMIN].includes(this.role);
    },
    isWalletActive() {
      return this.wallet && this.wallet.wallet_active === 1;
    },
    totalItems() {
      if (this.role === ROLES.ADMIN) {
        return 3;
      } else {
        return 1;
      }
    },
  },
  mounted() {
    this.updateCurrentDateTime();
    this.intervalRealtime = setInterval(() => {
      this.updateCurrentDateTime();
    }, 5 * 60 * 1000);
    const isCollapsedMenuRight = localStorage.getItem("isCollapsedMenuRight");
    if (isCollapsedMenuRight === "collapsed") {
      this.updateColapsed();
    } else {
      this.updateTabActive();
    }
    this.timer = setTimeout(() => {
      const mainRightElement = document.getElementById("main-right");
      const mainContentElement = document.getElementById("main-content");
      const iconCollapsedElement = document.getElementById("icon-collapsed");
      mainRightElement.classList.add("main-animation");
      mainContentElement.classList.add("main-animation");
      iconCollapsedElement.classList.add("main-animation");
    }, 1);
  },
  unmounted() {
    clearInterval(this.intervalRealtime);
    clearTimeout(this.timer);

    const mainRightElement = document.getElementById("main-right");
    const mainContentElement = document.getElementById("main-content");
    const iconCollapsedElement = document.getElementById("icon-collapsed");
    mainRightElement?.classList?.remove("main-animation");
    mainContentElement?.classList?.remove("main-animation");
    iconCollapsedElement?.classList?.remove("main-animation");
  },
  methods: {
    updateColapsed() {
      const mainElement = document.getElementById("main-app");
      const menuRightContainer = document.getElementById(
        "menu-right-container"
      );

      mainElement.classList.add("is-collapsed-menu-right");
      menuRightContainer.classList.add("is-collapsed");
    },
    updateTabActive() {
      const routePath = this.$route.path;
      const routeName = this.$route.name;
      const isOrdersPathName = [
        "operate-manage-page",
        "manage-order",
        "overview",
        "list-session",
        "ticket-not-processed",
      ];
      if (isOrdersPathName.includes(routeName)) {
        this.tabActive = "order";
      } else if (routePath.includes("/dong-tien")) {
        this.tabActive = "finance";
      } else if (routePath.includes("/kho-va-san-pham")) {
        this.tabActive = "warehouse";
      }
    },
    handleChangeRoute(_path) {
      this.$router.push(_path);
    },
    handleToggle(_tabActive) {
      return () => {
        // Collap Menu.
        const mainElement = document.getElementById("main-app");
        if (mainElement.classList.contains("is-collapsed-menu-right")) {
          this.toogleCollapsed();
        }

        if (_tabActive === "order") {
          this.$router.push("/don-hang");
        } else if (_tabActive === "finance") {
          this.$router.push("/dong-tien/doi-soat");
        } else if (_tabActive === "warehouse") {
          this.$router.push("/kho-va-san-pham");
        }
        this.tabActive = this.tabActive === _tabActive ? "" : _tabActive;
      };
    },
    updateCurrentDateTime() {
      const now = new Date();

      const date = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();

      const minutes = now.getMinutes().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");

      this.$store.commit(
        "realtimeReport/setCurrentDate",
        `${date}-${month}-${year}`
      );

      this.$store.commit(
        "realtimeReport/setCurrentTime",
        `${hours}:${minutes}`
      );
    },
    toogleCollapsed() {
      const mainElement = document.getElementById("main-app");
      const menuRightContainer = document.getElementById(
        "menu-right-container"
      );

      if (mainElement && menuRightContainer) {
        if (!mainElement.classList.contains("is-collapsed-menu-right")) {
          this.tabActive = "";
          this.saveStatusCollapsed("collapsed");
        } else {
          this.saveStatusCollapsed("unCollapsed");
        }
        mainElement.classList.toggle("is-collapsed-menu-right");
        menuRightContainer.classList.toggle("is-collapsed");
      }
    },
    saveStatusCollapsed(value) {
      localStorage.setItem("isCollapsedMenuRight", value);
    },
  },
};
</script>

<style lang="scss">
.menu-right-container {
  width: 100%;
  height: 100vh;
  .icon-collapsed {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: rgba(6, 146, 85, 0.05);
    background-image: linear-gradient(90deg, transparent 50%, white 50%);
    position: fixed;
    right: 267px;
    z-index: -1;
    img {
      height: 16px;
      padding-left: 13px;
    }
    .collapse-icon {
      display: none;
    }
    .expand-icon {
      display: block;
    }
  }
  .menu-right-wrapper {
    &.total-items-1 {
      .block-submenu__body {
        max-height: calc(100vh - 64px - 65px - 71px);
        &.no-header {
          max-height: calc(100vh - 64px - 65px);
          .detail-submenu {
            max-height: calc(100vh - 64px - 65px - 66px);
          }
        }
      }
    }
    &.total-items-2 {
      .block-submenu__body {
        max-height: calc(100vh - 64px - 65px - 65px - 71px);
        &.no-header {
          max-height: calc(100vh - 64px - 65px - 65px);
          .detail-submenu {
            max-height: calc(100vh - 64px - 65px - 65px - 66px);
          }
        }
      }
    }
    &.total-items-3 {
      .block-submenu__body {
        max-height: calc(100vh - 64px - 65px - 65px - 65px - 71px);
        &.no-header {
          max-height: calc(100vh - 64px - 65px - 65px - 65px);
          .detail-submenu {
            max-height: calc(100vh - 64px - 65px - 65px - 65px - 66px);
          }
        }
      }
    }
    .item {
      height: 64px;
      box-sizing: content-box;
      transition: 0.15s linear;
      overflow-y: hidden;
      transition: background-color 0.15s linear;
      border-bottom: 1px solid var(--grayColor);
      &:last-child {
        &.is-selected {
          border-bottom: none;
        }
      }
      &.is-selected {
        &:not(.is-empty) {
          height: 100%;
          .item-title {
            img {
              transform: rotate(90deg);
            }
          }
        }
        .item-title {
          background-color: #efefef;
        }
      }
      .item-title {
        height: 64px;
        box-sizing: content-box;
        padding: 0 16px;
        border-bottom: 1px solid var(--grayColor);
        cursor: pointer;
        justify-content: space-between;
        align-items: center;
        h2 {
          transition: 0.15s linear;
          font-size: 18px;
          margin-bottom: 0;
        }
        img {
          transform: rotate(0);
          transition: 0.15s linear;
        }
      }
      .submenu-wrapper {
        overflow-y: auto;
        .block-submenu {
          // border-bottom: 1px solid var(--grayColor);
          .block-submenu__header {
            background-color: #fff;
            position: sticky;
            top: 0;
          }
          .block-submenu__body {
            overflow-y: auto;
          }
        }
        .submenu-item {
          cursor: pointer;
          padding: 10px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: 0.15s linear;
          margin: 0 10px 0 15px;
          &:not(:last-child) {
            border-bottom: 1px solid var(--grayColor);
          }
          .submenu-item__left {
            flex: 1;
            padding-right: 10px;
          }
          &.is-active {
            color: var(--primaryColor);
          }
          .submenu-item__right {
            img {
              transform: translateY(-1px);
            }
          }
        }
      }
    }
  }
  &.is-collapsed {
    .collapse-icon {
      display: block;
    }
    .expand-icon {
      display: none;
    }
    .icon-collapsed {
      right: 92px;
    }
    .menu-right-wrapper {
      .item {
        .item-title {
          padding: 0 8px;
          img {
            display: none;
          }
        }
      }
    }
  }
}
</style>
