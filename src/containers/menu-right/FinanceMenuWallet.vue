<template>
  <div
    class="item"
    :class="{
      'is-selected': tabActive === 'finance',
    }"
  >
    <div class="item-title flex" @click="handleToggle()">
      <h2 class="tile-text-collap">QL dòng tiền</h2>
      <h2 class="tile-text">Quản lý dòng tiền</h2>
      <img
        class="sub-menu-arrow-icon"
        src="@/assets/icons/arrow_right_menu_right.svg"
      />
    </div>
    <div
      v-if="tabActive === 'finance'"
      class="submenu-wrapper submenu-wrapper-finance"
    >
      <div class="block-submenu">
        <div class="block-submenu__body no-header">
          <div
            class="submenu-item no-rotate-imge"
            :class="{ 'is-active': subMenuActive === 1 }"
            @click="handleChangeRoute('/vi', 1)"
            style="padding: 10px 15px; margin: 0"
          >
            <span class="submenu-item__left">
              <span class="t-text-[16px] medium-text">Ví</span>
              <span class="t-text-sm balance-title"> Số dư</span>
            </span>
            <div class="submenu-item__right">
              <span class="t-text-[16px] medium-text">
                <format-price :value="balance" /> đ
              </span>
              <img
                class="ml"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div>
          </div>
          <div
            class="submenu-item submenu-item-header-finance"
            :class="{ 'is-active': true }"
            style="margin: 0; padding: 10px 15px"
          >
            <div class="submenu-item__left">
              <div class="flex t-justify-between t-text-black">
                <p
                  class="mb-0 t-text-[16px] t-mt-[-5px]"
                  style="color: #000 !important"
                >
                  Dòng tiền
                </p>
                <g-daterange-picker-select
                  class="t-mt-[3px] t-invisible"
                  :optionDescription="optionDescription"
                  :removeOption="removeOptionKey"
                  showCancelOption="true"
                  :placeholder="'Thời gian'"
                  :from-date="fromDate"
                  :to-date="toDate"
                  :onChange="onChangeDateFilter"
                  :allowClear="true"
                  :iconType="'arrow'"
                  :isIncremental="true"
                  :showTooltip="true"
                />
              </div>
              <div class="flex align-items-center t-mt-[-17px]">
                <live-signal class="t-mt-1" />
                <span class="ml t-text-black t-text-xs t-mt-1">
                  Live - {{ currentTime }}
                </span>
              </div>
            </div>
            <!-- <div class="submenu-item__right">
              <img
                class="ml"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div> -->
          </div>
          <div class="detail-submenu">
            <div
              v-for="type in nextAuditTypes"
              :key="type.key"
              class="detail-submenu__item pointer"
              @click="handleChangeRouteDetail(type)"
            >
              <div
                class="detail-info"
                :class="{ 'primary-text': nextAuditTypeSelected === type.key }"
              >
                <span class="t-flex-1">{{ type.title }}</span>
                <div
                  class="detail-submenu__item__right t-ml-2 flex align-items-center"
                >
                  <vue3-autocounter
                    :startAmount="formatValueMoney(lastAuditData[type.key])"
                    :endAmount="formatValueMoney(nextAuditData[type.key] || 0)"
                    :suffix="' đ'"
                    :duration="1"
                  />
                  <img
                    class="ml"
                    src="@/assets/icons/menu_right_submenu_right.svg"
                  />
                </div>
              </div>
              <div class="description-info" v-if="type.des">
                {{ type.des }}
              </div>
            </div>
          </div>
          <div
            class="submenu-item no-rotate-imge"
            :class="{ 'is-active': subMenuActive === 3 }"
            @click="handleChangeRoute('/bao-cao-chi-tiet', 3)"
            style="padding: 10px 15px; margin: 0"
          >
            <span class="submenu-item__left">
              <span class="t-text-lg medium-text">Báo cáo chi tiết</span>
            </span>
            <div class="submenu-item__right">
              <img
                class="ml"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LiveSignal, GDaterangePickerSelect } from "@/components";
import { mapState } from "vuex";
import Vue3Autocounter from "vue3-autocounter";
import financeService from "@/services/finance.service";
import FormatPrice from "@/components/FormatPrice.vue";
// import { FINANCE_NEXT_AUDIT } from "@/contants";

const nextAuditTypes = [
  {
    pathName: "finance-list-order",
    key: "pendingMoney",
    title: "Tổng tiền đang luân chuyển",
  },
  {
    pathName: "finance-list-transaction",
    key: "sumPickMoneyAmount",
    title: "Tổng tiền về ví",
  },
  {
    pathName: "finance-list-transaction",
    key: "sumAllFeeAmount",
    title: "Tổng phí dịch vụ",
  },
  {
    pathName: "finance-list-transaction",
    key: "sumDiscountAmount",
    title: "Khuyến mãi",
  },
  {
    pathName: "finance-list-order",
    key: "sumNextPaymentScheduleAmount",
    title: "Phiên rút tiền tự động sắp tới",
  },
];

export default {
  name: "OperateMenu",
  props: ["tabActive", "handleToggle", "isCollapsed"],
  components: {
    LiveSignal,
    Vue3Autocounter,
    GDaterangePickerSelect,
    FormatPrice,
  },
  data() {
    return {
      optionDescription: {
        key: "incremental",
        description: "Các đơn đang giao, chưa đối soát",
      },
      removeOptionKey: ["30_days_ago", "7_days_ago"],
      nextAuditTypeSelected: "",
      nextAuditTypes,
      fromDate: null,
      toDate: null,
      lastAuditData: {},
      nextAuditData: {},
    };
  },
  computed: {
    ...mapState({
      currentTime: (state) => state.realtimeReport.currentTime,
      balance: (state) => state.finance.balance,
    }),
  },
  methods: {
    handleChangeRoute(route) {
      this.$router.push(`/dong-tien${route}`);
    },
    getNextAuditData() {
      if (this.tabActive !== "finance") return;
      this.getPendingMoney();
      this.getData();
      this.getWalletBalance();
    },
    handleChangeRouteDetail(type) {
      let query = {};
      switch (type.key) {
        case "pendingMoney":
          query.type = "pending_money";
          query.package_status_id = ["3", "4", "10"];
          break;
        case "sumNextPaymentScheduleAmount":
          query.type = "next_audit";
          break;
        case "sumPickMoneyAmount":
          query.type = "cod";
          break;
        case "sumDiscountAmount":
          query.type = "discount";
          break;
        case "sumAllFeeAmount":
          query.type = "total_fee";
      }
      this.$router.push({ name: type.pathName, query });
    },
    onChangeDateFilter({ fromDate, toDate }, key) {
      this.fromDate = key === "incremental" ? null : fromDate;
      this.toDate = key === "incremental" ? null : toDate;
      this.getData({ fromDate: this.fromDate, toDate: this.toDate });
    },
    async getPendingMoney() {
      try {
        const response = await financeService.getPendingMoney();

        if (response?.data?.success) {
          this.lastAuditData.pendingMoney =
            this.nextAuditData.pendingMoney || 0;
          this.nextAuditData.pendingMoney =
            response?.data?.data?.sum_money?.pending_money || 0;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getWalletBalance() {
      try {
        const response = await financeService.getWalletBalance();

        if (response?.data?.success) {
          this.$store.commit(
            "finance/setBalance",
            response?.data?.data?.balance || 0
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getData() {
      try {
        const response = await financeService.getDataWallet({
          fromDate: this.fromDate,
          toDate: this.toDate,
        });

        if (response?.data?.success) {
          this.lastAuditData = this.nextAuditData;
          this.nextAuditData = {
            pendingMoney: this.nextAuditData?.pendingMoney || 0,
            ...response?.data?.data,
          };
        }
      } catch (error) {
        console.error(error);
      }
    },
    formatValueMoney(value) {
      if (!value || value < 0) return 0;
      return value;
    },
  },
  watch: {
    currentTime() {
      this.getNextAuditData();
    },
    tabActive() {
      this.getNextAuditData();
    },
    "$route.path": {
      immediate: true,
      handler(path) {
        if (path === "/dong-tien/lich-su-doi-soat") {
          this.nextAuditTypeSelected = "";
        } else if (path === "/dong-tien/hoa-don-vat") {
          this.nextAuditTypeSelected = "";
        } else if (path === "/dong-tien/doi-soat") {
          this.nextAuditTypeSelected = "";
        } else if (path === "/dong-tien/chi-tiet-doi-soat") {
          this.nextAuditTypeSelected = this.$route.query.type;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./submenu.scss";

.submenu-wrapper-finance {
  .balance-title {
    color: #808080;
  }
}

.submenu-item {
  align-items: flex-start !important;
  border-bottom: 1px solid var(--grayColor);
  &.is-active {
    font-size: unset !important;
    position: sticky;
    top: 0;
    z-index: 1;
    p {
      font-weight: 500;
    }
    &:not(.no-rotate-imge) {
      .submenu-item__right {
        img {
          transform: rotate(90deg) !important;
        }
      }
    }
  }
  .submenu-item__left {
    padding-right: 0 !important;
  }
  .submenu-item__right {
    img {
      transition: 0.15s linear;
    }
  }
}
.detail-submenu {
  overflow-y: auto;
  border-bottom: 1px solid var(--grayColor);
  &__item {
    padding: 10px 0;
    position: relative;
    margin: 0 10px 0 15px;
    &:not(:last-child) {
      &::after {
        width: calc(100%);
        height: 1px;
        background-color: var(--grayColor);
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
      }
    }

    .detail-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &.important-item {
      flex-direction: column;
      align-items: flex-start;
      .detail-info {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        font-weight: 500;
      }
      .description-info {
        font-size: 14px;
        margin-top: 5px;
      }
    }
    &__right {
      img {
        transition: 0.15s linear;
      }
    }
  }
}
</style>

<style lang="scss">
.submenu-item-header-finance {
  background-color: #fff;
  .g-daterange-picker-select-wrapper {
    width: 120px;
  }
  .list-options-wrapper {
    position: fixed !important;
    overflow: auto !important;
    right: 15px !important;
    width: 270px !important;
    transform: translateY(10px) !important;
    bottom: unset !important;
    @media only screen and (max-height: 915px) {
      height: 350px !important;
    }
  }
}
</style>
