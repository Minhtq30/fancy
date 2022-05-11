<template>
  <header
    class="flex align-items-center justify-content-space-between px-1 t-z-50"
  >
    <div class="header-left flex align-items-center">
      <div class="header-logo">
        <img
          class="logo"
          :style="{ cursor: 'pointer' }"
          @click="handleChangeRouteHome()"
          src="/web/logo.svg"
        />
        <span class="version-beta">Beta</span>
      </div>
      <div class="split" />

      <g-popover
        placement="bottomLeft"
        trigger="click"
        v-model:visible="visiblePopover"
      >
        <div v-if="shop?.code" class="shop-wrapper flex align-items-center">
          <img
            @error="handleErrorLoadAvatar"
            class="logo"
            :src="shop?.avatar"
            alt=""
          />
          <div class="info">
            <div class="info-name">
              <b>{{ `${shop?.code || "code"} / ${shop?.name || "Shop"}` }}</b>
            </div>
            <span>
              {{ convertRole(shopStaff?.role) }} -
              {{ shopStaff?.username }}
            </span>
          </div>
          <img src="@/assets/icons/arrow_down.svg" />
        </div>
        <div v-else class="shop-wrapper flex align-items-center">
          <g-skeleton-image-circle :width="40" :height="40" :active="true" />
          <g-skeleton-text
            width="206px"
            :style="{ marginTop: '6px', marginLeft: '8px' }"
            :active="true"
          />
          <img src="@/assets/icons/arrow_down.svg" />
        </div>
        <template #content>
          <div class="menu-user">
            <div @click="handleShowInfo" class="menu-user-item">
              <g-user-info-icon />
              <span class="menu-user-title">Thông tin tài khoản</span>
            </div>
            <div
              :v-show="visibleRateWeek || enableRate"
              @click="openRateModal()"
              class="menu-user-item"
            >
              <RateStarBlack />
              <span class="menu-user-title"
                >Chấm sao tuần {{ textNumberWeek }}</span
              >
            </div>
            <div @click="handleShowTerm" class="menu-user-item">
              <g-info-icon />
              <span class="menu-user-title">Điều khoản và quy định</span>
            </div>
            <div @click="handleLogout" class="menu-user-item">
              <g-logout-icon />
              <span class="menu-user-title-red">Đăng xuất</span>
            </div>
          </div>
        </template>
      </g-popover>

      <div class="split" />
      <nav class="menu-wrapper">
        <ul class="flex">
          <li
            v-for="menuItem in menuItems"
            :key="menuItem.key"
            class="flex align-items-center"
            :class="{ 'is-active': tabActive === menuItem.key }"
            @click="handleChangeRoute(menuItem)"
            @mouseenter="handleHoverMenu(menuItem.key)"
            @mouseleave="handleHoverMenu('')"
          >
            <a-tooltip placement="bottom">
              <template #title>
                <span>{{ menuItem.title }}</span>
              </template>
              <div
                class="flex align-items-center"
                :style="{ width: '100%', height: '100%' }"
              >
                <img
                  :src="
                    tabActive === menuItem.key || tabHover === menuItem.key
                      ? menuItem.iconActive
                      : menuItem.icon
                  "
                />
                <span class="menu-header-item__title">
                  {{ menuItem.title }}
                </span>
              </div>
            </a-tooltip>
          </li>
        </ul>
      </nav>
    </div>
    <div v-if="isAllowCreateOrder" class="header-right">
      <button
        @click="handleChangeRouteCreateOrder()"
        type="button"
        class="flex align-items-center"
      >
        <img src="@/assets/icons/plus.svg" />
        <span class="text-lg">Tạo đơn hàng</span>
        <span class="text-sm">Tạo ĐH</span>
      </button>
    </div>
    <RateModal
      :good_notes="good_notes"
      :bad_notes="bad_notes"
      :typeSelected="typeSelected"
      :listOptionSelected="listOptionSelected"
      :optionTypes="listReviewTypes"
      :visible="visibleModal.rate"
      :time="time"
      :titleModal="titleModal"
      :setVisible="setVisibleModal('rate')"
      :handleUpdateReview="handleUpdateReview"
      @onChangeType="handleChangeType"
      @onChangeOption="handleChangeOption"
      @onChangeNote="handleChangeNote"
      @onChangeCurr="handleCurrWeek"
      @onChangeLast="handleLastWeek"
      @onClose="handleClose"
    ></RateModal>
  </header>
</template>

<script>
import { mapState } from "vuex";

// Component
import GPopover from "@/components/elements/popover";
import GInfoIcon from "@/components/icons/InfoIcon";
import GLogoutIcon from "@/components/icons/LogoutIcon";
import GUserInfoIcon from "@/components/icons/UserInfoIcon";
import {
  GSkeletonImageCircle,
  GSkeletonText,
} from "@/components/elements/skeleton";
import RateModal from "@/components/modal/RateModalV2.vue";
import RateStarBlack from "@/components/icons/RateStarBlack.vue";

// Mixins
import mixinErrorImage from "@/plugins/mixins/errorImage";
import mixinLogout from "@/plugins/mixins/logout";

// Util
import { configHeader, menuItems } from "./configHeader";
import services from "@/services";
import { ROLES } from "@/contants";
import { formatMomentDate } from "@/utils/date";
const date = new Date();
if (!localStorage.getItem("timeReview")) {
  let timeReview = {
    show: true,
    startDate: date.setHours(0),
    endDate: date.setHours(24),
    count: 0,
    called: false,
  };
  localStorage.setItem("timeReview", JSON.stringify(timeReview));
}
export default {
  name: "Header",
  data() {
    return {
      tabHover: "",
      visibleModal: {
        rate: false,
      },
      visibleRateWeek: false,
      listReviewTypes: [],
      good_notes: "",
      bad_notes: "",
      typeSelected: [],
      listOptionSelected: [],
      textNumberWeek: `${this.getNumberWeek()}/${this.getCurrentYear()}`,
      time: `${this.handleCurrWeek()}`,
      titleModal: `${this.getWeek()}`,
      visiblePopover: false,
    };
  },
  components: {
    GPopover,
    GInfoIcon,
    GUserInfoIcon,
    GLogoutIcon,
    GSkeletonImageCircle,
    GSkeletonText,
    RateStarBlack,
    RateModal,
  },
  mixins: [mixinErrorImage, mixinLogout],
  mounted() {
    if (localStorage.getItem("token_ecom")) {
      this.getCheckEnableReview();
      this.getCheckReviewOrNot();
    }
  },
  computed: {
    ...mapState({
      currentScreen: (state) => state.global.screen,
      shop: (state) => state.shop.Shop,
      shopStaff: (state) => state.shop.ShopStaff,
      wallet: (state) => state.shop?.Wallet || {},
    }),
    enableRate() {
      return localStorage.getItem("enable_rate");
    },
    tabActive() {
      const currentRouteName = this.$route.name;
      if (configHeader.isSummary.includes(currentRouteName)) {
        return "summary";
      } else if (configHeader.isOrder.includes(currentRouteName)) {
        return "order";
      } else if (configHeader.isStore.includes(currentRouteName)) {
        return "store";
      } else if (configHeader.isFinance.includes(currentRouteName)) {
        return "finance";
      }
      return null;
    },
    menuItems() {
      if (!this.shopStaff?.role) return [];
      return menuItems.filter((m) => m.roles.includes(this.shopStaff.role));
    },
    isAllowCreateOrder() {
      return [ROLES.ADMIN, ROLES.OPERATOR].includes(this.shopStaff?.role);
    },
    isActiveWallet() {
      return this.wallet && this.wallet.wallet_active === 1;
    },
  },
  methods: {
    async openLog(time = "") {
      const response = await services.$review.browseGetReview({
        time: time || this.time,
      });
      const listAllOptions = Object.assign(
        response.data.satisfied ? response.data.satisfied.review_details : {},
        response?.data?.noSatisfied?.review_details
      );
      if (response.success) {
        if (response?.data?.satisfied?.review && !response?.data?.noSatisfied) {
          this.typeSelected = ["1"];
          this.good_notes = response?.data?.satisfied?.message || "";
          this.listOptionSelected =
            Object.keys(response?.data?.satisfied?.review_details) || [];
        } else if (
          response?.data?.noSatisfied?.review &&
          !response?.data?.satisfied
        ) {
          this.typeSelected = ["3"];
          this.bad_notes = response?.data?.noSatisfied?.message || "";
          this.listOptionSelected =
            Object.keys(response?.data?.noSatisfied?.review_details) || [];
        } else if (
          response?.data?.satisfied?.review &&
          response?.data?.noSatisfied?.review
        ) {
          this.typeSelected = ["1"];
          this.good_notes = response?.data?.satisfied?.message || "";
          this.bad_notes = response?.data?.noSatisfied?.message || "";
          this.listOptionSelected = Object.keys(listAllOptions);
          this.good_notes = response?.data?.satisfied?.message || "";
          this.listOptionSelected =
            Object.keys(response?.data?.satisfied?.review_details) || [];
        } else {
          this.typeSelected = ["1"];
          this.good_notes = "";
          this.bad_notes = "";
          this.listOptionSelected = [];
        }
      }
    },
    getTitleReview() {
      const { textFirstDay, textLastDay } = this.getStartEndDayWeek();
      return `${textFirstDay} - ${textLastDay}`;
    },
    getWeek() {
      return `${this.getNumberWeek()}/${this.getCurrentYear()}`;
    },
    getLastWeek() {
      return `${this.getNumberWeek() - 1}/${this.getCurrentYear()}`;
    },
    getLastTitleReview() {
      const { textFirstDay, textLastDay } = this.getStartEndDayLastWeek();
      return `${textFirstDay} - ${textLastDay}`;
    },
    handleCurrWeek(week) {
      this.time = week;
      this.titleModal = `${this.getWeek()}`;
      this.openLog(week);
    },
    handleLastWeek(lastweek) {
      this.time = lastweek;
      this.titleModal = `${this.getLastWeek()}`;
      this.openLog(lastweek);
    },
    getStartEndDayLastWeek() {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay() - 6; // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstday = new Date(curr.setDate(first));
      const lastday = new Date(curr.setDate(last));

      return {
        textFirstDay: formatMomentDate({ _d: firstday }, "DD/MM"),
        textLastDay: formatMomentDate({ _d: lastday }, "DD/MM"),
      };
    },
    getStartEndDayWeek() {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstday = new Date(curr.setDate(first));
      const lastday = new Date(curr.setDate(last));

      return {
        textFirstDay: formatMomentDate({ _d: firstday }, "DD/MM"),
        textLastDay: formatMomentDate({ _d: lastday }, "DD/MM"),
      };
    },
    async handleClose() {
      // Cập nhật lại cache.
      const response = await services.$review.browseGetReview({
        time: this.time,
      });
      if (response.success) {
        this.good_notes = response?.data?.good_message || "";
        this.bad_notes = response?.data?.bad_message || "";
        this.listOptionSelected = Object.keys(
          response?.data?.review_details || {}
        );
      } else {
        this.$message.warning("Lỗi: Lấy thông tin đánh giá sao tuần");
      }
    },
    getCurrentYear() {
      const currentDate = new Date();
      return currentDate.getFullYear();
    },
    getNumberWeek() {
      const currentDate = new Date();
      const d = new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    },
    async handleUpdateReview(good_notes, bad_notes, type, options, time) {
      return new Promise((resolve) => {
        try {
          type = [];
          this.listOptionSelected.map((item) => {
            if (Number(item) >= 100 && Number(item) < 200) {
              type.push("1");
            }
            if (Number(item) >= 300 && Number(item) < 400) {
              type.push("3");
            }
          });
          type = [...new Set(type)];
          services.$review
            .browseReview({
              good_message: good_notes,
              bad_message: bad_notes,
              rate_id: type,
              rate_details: options,
              time: time,
            })
            .then((response) => {
              if (response.success) {
                this.cacheRate = {
                  note: this.note,
                  listOptionSelected: this.listOptionSelected,
                  typeSelected: this.typeSelected,
                };
                this.$message.success(
                  "Cám ơn shop đã gửi đánh giá giúp chúng tôi nâng cao chất lượng dịch vụ !"
                );
                resolve({ success: true });
              } else {
                this.$message.error("Đánh giá thất bại, xin thử lại!");
                resolve({ success: false });
              }
            });
        } catch (error) {
          this.$message.error("Đánh giá thất bại, xin thử lại!");
          resolve({ success: false });
        }
      });
    },
    handleChangeType(value) {
      this.typeSelected = value;
      const response = services.$review.browseGetReview({
        time: this.time,
      });
      if (response?.data?.satisfied?.review == 1) {
        this.good_notes = response?.data?.good_message;
      }
      if (response?.data?.noSatisfied?.review == 3) {
        this.bad_notes = response?.data?.bad_message;
      }
      if (
        response?.data?.satisfied?.review == 1 &&
        response?.data?.noSatisfied?.review == 3
      ) {
        this.good_notes = response?.data?.good_message;
        this.bad_notes = response?.data?.bad_message;
      }
      if (response.success) {
        this.listOptionSelected = Object.keys(
          response?.data?.review_details || {}
        );
      }
    },
    handleChangeOption(value) {
      this.listOptionSelected = value;
    },
    handleChangeNote(value) {
      if (this.typeSelected == "1") {
        this.good_notes = value;
      }
      if (this.typeSelected == "3") {
        this.bad_notes = value;
      }
    },
    async getOptionReview() {
      try {
        const response = await services.$review.browseGetListOption();
        if (response.success) {
          const detail = response?.data?.detail || {};
          const root = response?.data?.root || {};
          const sort = response?.data?.sort || {};

          const types = [];
          Object.keys(root).map((key) => {
            const listOptions = sort[key].map((item) => {
              return {
                key: item,
                value: detail[key][item],
              };
            });
            // TODO NamVH: Bỏ tạm trường hợp bình thường. + hard code quy định key == 1 là hòi lòng, 3. Bức xúc.
            if (`${key}` !== "2") {
              types.push({
                key: key,
                text: root[key],
                listOptions: listOptions,
                keyComponent: `${key}` === "1" ? "Satisfied" : "Unsatisfied",
              });
            }
          });

          this.listReviewTypes = types;
        } else {
          // Lỗi API thì ẩn.
          this.visibleRateWeek = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getCheckEnableReview() {
      try {
        const response = await services.$review.browseCheckEnable();
        this.visibleRateWeek = response?.data;
        if (response.sucess) {
          await this.getCheckReviewOrNot();
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getCheckReviewOrNot() {
      const lastReview = JSON.parse(localStorage.getItem("timeReview"));
      const currentMoment = Date.now();
      if (currentMoment > lastReview.endDate) {
        localStorage.setItem(
          "timeReview",
          JSON.stringify({
            show: true,
            startDate: date.setHours(0),
            endDate: date.setHours(24),
            count: lastReview.count,
            called: true,
          })
        );
      }
      try {
        if (lastReview.count <= 3 && !lastReview.called && lastReview.show) {
          const response = await services.$review.browseReviewCheck();
          if (response.success) {
            localStorage.setItem(
              "timeReview",
              JSON.stringify({
                show: false,
                startDate: date.setHours(0),
                endDate: date.setHours(24),
                count: lastReview.count + 1,
                called: true,
              })
            );
            await this.openRateModal();
          } else {
            localStorage.setItem(
              "timeReview",
              JSON.stringify({
                show: true,
                startDate: date.setHours(0),
                endDate: date.setHours(24),
                count: lastReview.count + 1,
                called: true,
              })
            );
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    getReview() {
      try {
        const response = services.$review.browseGetReview({
          time: this.time,
        });
        if (response.success) {
          this.good_notes = response?.data?.good_message;
          this.bad_notes = response?.data?.bad_message;
          this.listOptionSelected = Object.keys(
            response?.data?.review_details || {}
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    async openRateModal() {
      this.visibleModal.rate = true;
      this.visiblePopover = false;
      await this.handleCurrWeek();
      await this.getOptionReview();
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleChangeRoute(route) {
      if (route.key === "finance") {
        this.$router.push({
          name: this.isActiveWallet ? "detail-report" : "cash-flow",
        });
      } else {
        this.$router.push(route.path);
      }
      // this.$store.dispatch("global/setScreen", { screen: route.key });
      this.$store.commit("global/setScreen", { screen: route.key });
    },
    handleChangeRouteCreateOrder() {
      this.$router.push(`/tao-don-hang/don-le`);
    },
    handleChangeRouteHome() {
      this.$router.push(`/`);
    },
    handleHoverMenu(value) {
      this.tabHover = value;
    },
    async handleLogout() {
      await this.onLogout();
    },
    handleShowInfo() {
      const elm = document.querySelector(".shop-wrapper");
      if (elm) {
        document.querySelector(".shop-wrapper").click();
      }
      this.$router.push({
        name:
          this.shopStaff?.role === ROLES.ADMIN
            ? "shop-info-account"
            : "shop-info-group-account",
      });
    },
    handleShowTerm() {
      window.open(
        "https://admin.giaohangtietkiem.vn/files/templates/Bieuphi_Giaohangtietkiem.pdf"
      );
    },
    convertRole(role) {
      if (role === ROLES.ADMIN) return "Quản trị";
      if (role === ROLES.OPERATOR) return "Vận hành";
      if (role === ROLES.CASHIER) return "Kế toán";
      return role;
    },
  },
};
</script>

<style lang="scss">
.menu-user {
  width: 288px;
  .menu-user-item {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid var(--grayColor);
    cursor: pointer;
  }
  .menu-user-item:hover {
    background: var(--grayColor);
  }
  .menu-user-title {
    font-size: 1rem;
    padding-left: 10px;
    color: black;
  }
  .menu-user-title-red {
    font-size: 1rem;
    color: #da4838;
    padding-left: 10px;
  }
}
</style>

<style lang="scss" scoped>
header {
  //position: fixed;
  //left: 0;
  //right: 0;
  height: 64px;
  flex: 0 1 64px;
  background-color: var(--primaryColor);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  font-size: 1rem;
  .header-logo {
    position: relative;
    padding: 0 25px;
  }
  .version-beta {
    opacity: 0;
    position: absolute;
    font-size: small;
    background-color: #ffc934;
    color: white;
    padding: 0 5px;
    top: 12px;
    border-radius: 2px;
    right: 1px;
  }
  .split {
    width: 2px;
    margin: 0 15px;
    height: 35px;
    background-color: #82c8aa;
  }
  .header-left {
    height: 100%;
    .shop-wrapper {
      cursor: pointer;
      visibility: visible;
      opacity: 1;
      transition: visibility 0s linear 0s, opacity 300ms;
      .logo {
        width: 40px;
        height: 40px;
        border: 2px solid #fff;
        border-radius: 50%;
      }
      .info {
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
        line-height: 20px;
        margin: 0 8px;
        .info-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    nav.menu-wrapper {
      height: 100%;
      ul {
        height: 100%;
        list-style: none;
        li {
          cursor: pointer;
          color: #fff;
          padding: 0 25px;
          font-weight: 500;
          font-size: 1.125rem;
          &.is-active {
            background-color: #fff;
            color: var(--primaryColor);
          }
          .menu-header-item__title {
            display: none;
            @media only screen and (min-width: 1376px) {
              display: block;
              margin-left: 8px;
              line-height: 20px;
            }
          }
          &:hover {
            background-color: #fff;
            color: var(--primaryColor);
          }
        }
      }
    }
  }
  .header-right {
    height: 100%;
    padding-top: 8px;
    button {
      height: 44px;
      background-color: #da4838;
      border-radius: 20px;
      box-shadow: 0px 4px 0px #79271e;
      padding: 10px 33.5px;
      transition: 0.15s linear;
      &:active {
        box-shadow: 0px 0px 0px #79271e;
        transform: translateY(4px);
      }
      img {
        margin-right: 10px;
      }
      span {
        color: #fff;
        font-size: 1.25rem;
        font-weight: bold;
        line-height: 20px;
        text-align: left;
      }
      .text-lg {
        display: none;
      }
      .text-sm {
        width: 70px;
      }
      @media only screen and (min-width: 1600px) {
        .text-lg {
          width: unset;
          display: block;
        }
        .text-sm {
          display: none;
        }
      }
    }
  }
}
</style>
