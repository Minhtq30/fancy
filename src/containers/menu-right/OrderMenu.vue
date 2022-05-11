<template>
  <div
    class="item"
    :class="{
      'is-selected': tabActive === 'order',
    }"
  >
    <div class="item-title flex" @click="handleToggle">
      <h2 class="tile-text-collap">QL đơn hàng</h2>
      <h2 class="tile-text">Quản lý đơn hàng</h2>
      <img
        class="sub-menu-arrow-icon"
        src="@/assets/icons/arrow_right_menu_right.svg"
      />
    </div>
    <div v-if="tabActive === 'order'" class="submenu-wrapper">
      <div
        v-if="isShowOrderReport && !isShowNotification"
        class="block-submenu"
      >
        <div class="block-submenu__header t-flex-col">
          <div class="t-flex t-items-center t-justify-between">
            <div class="title-realtime__left">
              <p class="mb-0">Báo cáo vận hành {{ currentDate }}</p>
            </div>
            <div class="title-realtime__right" @click="showNotification">
              <notification-number
                :is-active="isShowNotification"
                :total="totalNotification"
              />
            </div>
          </div>
          <div class="t-flex t-items-center t-justify-between">
            <div class="flex align-items-center">
              <live-signal />
              <span class="ml t-text-black t-text-xs t-mt-1">
                Live (Cập nhật {{ currentTime }})
              </span>
            </div>
            <div class="type-customer-wrapper t-flex t-items-center">
              <span
                class="pointer"
                :class="{ active: customerType === 'c2c' }"
                @click="handleChangeCustomerType('c2c')"
                >C2C</span
              >
              <template v-if="shopInfo?.shop_type?.toString() === '1'">
                <div class="split-customer-type" />
                <span
                  class="pointer"
                  :class="{ active: customerType === 'b2c' }"
                  @click="handleChangeCustomerType('b2c')"
                  >B2C</span
                >
              </template>
            </div>
          </div>
        </div>
        <div class="block-submenu__body">
          <div
            v-for="type in operateType"
            :key="type.key"
            class="submenu-item"
            :class="{ 'is-active': selectedType === type.key }"
            @click="handleChangeRoute(type.key)"
          >
            <span class="submenu-item__left">{{ type.title }}</span>
            <div class="submenu-item__right flex align-items-center">
              <span>
                <vue3-autocounter
                  :startAmount="oldValueByType[type.key] || 0"
                  :endAmount="newValueByType[type.key] || 0"
                  :duration="1"
                />
                <span v-if="type.key === 'c2c.deliveringReportData.pickMoney'">
                  đ
                </span>
                <span
                  v-else-if="
                    type.key === 'c2c.requestReportData.ticket_not_processed'
                  "
                >
                  YC
                </span>
                <span v-else> ĐH </span>
                <template
                  v-if="
                    type.key === 'incurredReportData.incurred' ||
                    type.key === 'c2c._incurredReportData.incurred'
                  "
                >
                  <span class="split-pick-incurred">| </span>
                  <vue3-autocounter
                    :startAmount="
                      oldValueByType[
                        customerType === 'c2c'
                          ? 'c2c.pickingReportData.done'
                          : 'pickingReportData.done'
                      ] || 0
                    "
                    :endAmount="
                      newValueByType[
                        customerType === 'c2c'
                          ? 'c2c.pickingReportData.done'
                          : 'pickingReportData.done'
                      ] || 0
                    "
                    :duration="1"
                  />
                  ĐH
                </template>
              </span>
              <img
                class="ml"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="list-notifications block-submenu">
        <div class="block-submenu__header">
          <div>
            <b>Thông báo</b><br />
            <div class="notification-types flex" style="line-height: 20px">
              <span
                :class="{ 'is-active': notificationType === 'all' }"
                @click="notificationType = 'all'"
              >
                Tất cả
              </span>
              <div class="split" />
              <span
                :class="{ 'is-active': notificationType === 'important' }"
                @click="notificationType = 'important'"
              >
                Quan trọng
              </span>
            </div>
          </div>
          <div @click="closeNotification">
            <notification-number
              :is-active="isShowOrderReport"
              :total="totalNotification"
            />
          </div>
        </div>
        <div
          class="block-submenu__body wrapper-order-notifications"
          style="height: calc(100vh - 192px - 70px - 60px + 64px)"
          @scroll="handleScroll"
        >
          <template v-if="isLoadingByType && notifications.length === 0">
            <div class="body-item">
              <g-skeleton-text :active="true" />
              <g-skeleton-text :active="true" />
              <g-skeleton-text :active="true" :width="'50%'" />
              <g-skeleton-text :active="true" :width="'100px'" />
            </div>
            <div class="body-item">
              <g-skeleton-text :active="true" />
              <g-skeleton-text :active="true" />
              <g-skeleton-text :active="true" :width="'50%'" />
              <g-skeleton-text :active="true" :width="'100px'" />
            </div>
          </template>
          <template v-else>
            <div v-if="notifications.length === 0" style="padding-top: 10px">
              <a-empty :description="'Danh sách trống'" />
            </div>
            <div
              v-else
              class="body-item"
              v-for="notification in notifications"
              :key="notification.id"
            >
              <div class="body-item-title-wrapper flex">
                <b v-html="notification.subject?.replaceAll('< / ', '</')" />
                <img src="@/assets/icons/menu_right_submenu_right.svg" />
              </div>
              <div
                style="white-space: break-spaces"
                v-html="notification.content"
              />
              <template v-if="notification.note">
                <span class="primary-text text-note-order">
                  <i>{{ notification.note }}</i>
                </span>
                <br />
              </template>
              <small>{{ formatCountdownTime(notification.created) }}</small>
            </div>
            <div class="body-item" v-if="isLoadingByType && pageByType !== 1">
              <g-skeleton-text :active="true" />
              <g-skeleton-text :active="true" />
              <g-skeleton-text :active="true" :width="'50%'" />
              <g-skeleton-text :active="true" :width="'100px'" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LiveSignal, NotificationNumber } from "@/components";
import { mapState } from "vuex";
import operateService from "@/services/operate.service.js";
import {
  KEY_CACHE_REALTIME_REPORT_B2C,
  KEY_CACHE_REALTIME_REPORT_C2C,
  OPERATE_TYPE,
  ROLES,
} from "@/contants";
import { OPERATE_TYPE_C2C } from "@/contants/operate";
import Vue3Autocounter from "vue3-autocounter";
import nomalizeStoreData from "@/utils/nomalizeStoreData";
import { formatCountdownTime } from "@/utils/date";
import { GSkeletonText } from "@/components/elements/skeleton";
import { safeJSONParse } from "@/utils";

const TAB_NAME = "order";

let isFetchedAllNotification = false;
let isFetchedImportantNotification = false;

export default {
  name: "OperateMenu",
  props: ["tabActive", "handleToggle"],
  components: {
    LiveSignal,
    NotificationNumber,
    Vue3Autocounter,
    GSkeletonText,
  },
  data() {
    return {
      isShowNotification: false,
      notificationType: "",
      selectedType: "",
      totalNotification: 0,
      oldValue: {},
      newValue: {},
      oldValueC2C: {},
      newValueC2C: {},
      notificationById: {},
      importantNotificationIds: [],
      allNotificationIds: [],
      isLoading: {
        getAlls: false,
        getImportant: false,
      },
      page: {
        getAlls: 1,
        getImportant: 1,
      },
      hasNext: {
        getAlls: true,
        getImportant: true,
      },
      allowUpdate: {
        getAlls: false,
        getImportant: false,
      },
      customerType: "",
    };
  },
  mounted() {
    this.updateCustomerType();
  },
  computed: {
    ...mapState({
      currentDate: (state) => state.realtimeReport.currentDate,
      currentTime: (state) => state.realtimeReport.currentTime,
      operateReportData: (state) => state.realtimeReport.order,
      shopInfo: (state) => state.shop?.Shop || {},
      shopStaff: (state) => state.shop?.ShopStaff || {},
    }),
    notifications() {
      const ids =
        this.notificationType === "all"
          ? this.allNotificationIds
          : this.importantNotificationIds;

      return ids
        .filter((id) => this.notificationById[id])
        .map((id) => {
          const contentSplit = this.notificationById[id].content.split("\n");

          let note = "";
          let content = this.notificationById[id].content;

          if (contentSplit.length > 2) {
            content = contentSplit.slice(0, contentSplit.length - 1).join("\n");
            note = contentSplit[contentSplit.length - 1];
          }

          return {
            ...this.notificationById[id],
            subject: this.notificationById[id].subject.replaceAll("/", " / "),
            note,
            content,
          };
        });
    },
    isLoadingByType() {
      return this.notificationType === "all"
        ? this.isLoading.getAlls
        : this.isLoading.getImportant;
    },
    pageByType() {
      return this.notificationType === "all"
        ? this.page.getAlls
        : this.page.getImportant;
    },
    hasNextByType() {
      return this.notificationType === "all"
        ? this.hasNext.getAlls
        : this.hasNext.getImportant;
    },
    operateType() {
      return this.customerType === "c2c" ? OPERATE_TYPE_C2C : OPERATE_TYPE;
    },
    oldValueByType() {
      return this.customerType === "c2c" ? this.oldValueC2C : this.oldValue;
    },
    newValueByType() {
      return this.customerType === "c2c" ? this.newValueC2C : this.newValue;
    },
    isShowOrderReport() {
      return [ROLES.ADMIN, ROLES.OPERATOR].includes(this.shopStaff?.role);
    },
  },
  methods: {
    showNotification() {
      this.isShowNotification = true;
    },
    closeNotification() {
      if (this.isShowOrderReport) {
        this.isShowNotification = false;
      }
    },
    handleChangeRoute(type) {
      this.selectedType = type;

      const sessionFields = [
        "incurredReportData.incurred",
        "delayNotPickReportData.delay_not_pick",
        "waitingToReturnReportData.waiting_to_return",
        "returningReportData.returning",
        "returnedReportData.returned",

        "c2c._incurredReportData.incurred",
        "c2c._delayNotPickReportData.delay_not_pick",
        "c2c.delayReportData.delay_wait_shop_cf",
        "c2c.returningReportData.returning",
        "c2c.returnedReportData.returned",
      ];

      if (sessionFields.includes(type)) {
        this.$router.push(`/danh-sach-phien?type=${type}`);
      } else if (type === "c2c.requestReportData.ticket_not_processed") {
        this.$router.push(`/yeu-cau-chua-thuc-hien`);
      } else {
        this.$router.push(`/quan-ly-van-hanh?type=${type}`);
      }
    },
    formatCountdownTime(timeString) {
      return formatCountdownTime(timeString);
    },
    async getRealtimeB2C() {
      try {
        const metric = safeJSONParse(
          localStorage.getItem(KEY_CACHE_REALTIME_REPORT_B2C)
        );

        let newValue = {};
        let needRefresh = false;

        if (!metric.ttl || metric.ttl < new Date().getTime()) {
          newValue = await operateService.getRealtimeReport({ isB2C: true });
          needRefresh = true;
        } else {
          newValue = metric.data;
        }

        this.oldValue = this.newValue;
        this.newValue = newValue;
        if (needRefresh) {
          this.$store.commit("operate/setMetricB2C", newValue);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getRealtimeC2C() {
      try {
        const metric = safeJSONParse(
          localStorage.getItem(KEY_CACHE_REALTIME_REPORT_C2C)
        );

        let newValue = {};
        let needRefresh = false;

        if (!metric.ttl || metric.ttl < new Date().getTime()) {
          newValue = await operateService.getRealtimeReport();
          needRefresh = true;
        } else {
          newValue = metric.data;
        }

        this.oldValueC2C = this.newValueC2C;
        this.newValueC2C = newValue;
        if (needRefresh) {
          this.$store.commit("operate/setMetricC2C", newValue);
        }
      } catch (error) {
        console.error(error);
      }
    },
    getRealtimeReport() {
      if (this.tabActive !== "order" || !this.isShowOrderReport) return;

      if (this.customerType === "c2c") {
        this.getRealtimeC2C();
      }
      if (this.customerType === "b2c") {
        this.getRealtimeB2C();
      }
    },
    async getImportantNotifications(page = 1) {
      if (this.tabActive !== TAB_NAME) return;
      this.isLoading.getImportant = true;
      try {
        const response = await operateService.getImportantNotifications({
          page,
        });

        if (response?.data?.success) {
          if (!isFetchedImportantNotification) {
            isFetchedImportantNotification = true;
          }
          const { byId, ids } = nomalizeStoreData(response.data.data);

          if (
            this.hasNext.getImportant &&
            ids.length < 10 &&
            response.data.success
          ) {
            this.hasNext.getImportant = false;
          }

          this.notificationById = {
            ...this.notificationById,
            ...byId,
          };
          this.importantNotificationIds = this.importantNotificationIds.concat(
            ...ids
          );
          this.page.getImportant = page;
          this.allowUpdate.getImportant = true;
        }
      } catch (error) {
        console.log(error);
      }
      this.isLoading.getImportant = false;
    },
    async getAllNotifications(page = 1) {
      if (this.tabActive !== TAB_NAME) return;
      this.isLoading.getAlls = true;
      try {
        const response = await operateService.getAllNotifications({ page });

        if (response?.data?.data) {
          if (!isFetchedAllNotification) {
            isFetchedAllNotification = true;
          }
          const { byId, ids } = nomalizeStoreData(response.data.data);

          if (
            this.hasNext.getAlls &&
            ids.length < 10 &&
            response.data.success
          ) {
            this.hasNext.getAlls = false;
          }

          // page = 1 is first call
          if (page === 1) {
            this.totalNotification = response.data.count;
          }

          this.notificationById = {
            ...this.notificationById,
            ...byId,
          };
          this.allNotificationIds = this.allNotificationIds.concat(...ids);
          this.page.getAlls = page;
          this.allowUpdate.getAlls = true;
        }
      } catch (error) {
        console.log(error);
      }
      this.isLoading.getAlls = false;
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (
        this.hasNextByType &&
        !this.isLoadingByType &&
        percentageScrolled >= 0.85
      ) {
        if (this.notificationType === "all") {
          this.getAllNotifications(this.pageByType + 1);
        } else {
          this.getImportantNotifications(this.pageByType + 1);
        }
      }
    },
    async appendAllNotifications() {
      try {
        const response = await operateService.getAllNotifications({
          page: 1,
        });

        if (!response?.data?.data) return;
        const { byId, ids } = nomalizeStoreData(response.data.data);
        let byIdFilter = {};
        let idsFilter = [];

        for (const id of ids) {
          if (!this.notificationById[id]) {
            idsFilter.push(id);
            byIdFilter[id] = byId[id];
          }
        }
        if (idsFilter.length) {
          this.totalNotification += idsFilter.length;
          this.notificationById = {
            ...this.notificationById,
            ...byIdFilter,
          };
          this.allNotificationIds = [...idsFilter, this.allNotificationIds];
        }
      } catch (error) {
        console.log(error);
      }
    },
    async appendImportantNotifications() {
      try {
        const response = await operateService.getImportantNotifications({
          page: 1,
        });

        if (!response?.data?.data) return;
        const { byId, ids } = nomalizeStoreData(response.data.data);
        let byIdFilter = {};
        let idsFilter = [];

        for (const id of ids) {
          if (!this.notificationById[id]) {
            idsFilter.push(id);
            byIdFilter[id] = byId[id];
          }
        }
        if (idsFilter.length) {
          this.notificationById = {
            ...this.notificationById,
            ...byIdFilter,
          };
          this.importantNotificationIds = [
            ...idsFilter,
            this.importantNotificationIds,
          ];
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleChangeCustomerType(_customerType) {
      this.customerType = _customerType;
    },
    updateCustomerType() {
      setTimeout(() => {
        if (
          this.$route?.query?.type?.includes("c2c.") ||
          this.$route.path === "/yeu-cau-chua-thuc-hien"
        ) {
          this.customerType = "c2c";
        } else {
          const isB2C = this.shopInfo?.shop_type?.toString() === "1";
          this.customerType = isB2C ? "b2c" : "c2c";
        }
      }, 0);
    },
    scrollToTop() {
      const contentScrollable = document.querySelector(
        ".wrapper-order-notifications"
      );
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
      }
    },
  },
  watch: {
    shopInfo() {
      this.updateCustomerType();
    },
    tabActive(_tabActive) {
      if (_tabActive !== "order") {
        this.selectedType = "";
        this.notificationType = "";
        this.isShowNotification = false;
      } else {
        this.notificationType = "all";
      }
    },
    notificationType(_notificationType) {
      this.scrollToTop();
      if (
        _notificationType === "important" &&
        !isFetchedImportantNotification
      ) {
        this.getImportantNotifications();
      }
      if (_notificationType === "all" && !isFetchedAllNotification) {
        this.getAllNotifications();
      }
    },
    customerType() {
      this.getRealtimeReport();
    },
    currentTime() {
      this.getRealtimeReport();
      if (this.allowUpdate.getImportant) {
        this.appendImportantNotifications();
      }
      if (this.allowUpdate.getAlls) {
        this.appendAllNotifications();
      }
    },
    "$route.query": {
      immediate: true,
      handler(query) {
        this.selectedType = query.type;
      },
    },
    "$route.path": {
      immediate: true,
      handler(_path) {
        if (_path === "/yeu-cau-chua-thuc-hien") {
          this.selectedType = "c2c.requestReportData.ticket_not_processed";
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./submenu.scss";

.text-note-order {
  font-size: 13px;
}
.title-realtime__left {
  p {
    font-weight: 500;
  }
}
.split-pick-incurred {
  transform: translateY(-1px);
  display: inline-block;
  margin-right: 4px;
}
.type-customer-wrapper {
  span {
    font-weight: 500;
    &.active {
      color: var(--primaryColor);
    }
  }
  .split-customer-type {
    width: 1px;
    height: 12px;
    background-color: var(--grayColor);
    margin: 0 0.5rem;
  }
}
</style>

<style lang="scss">
.is-collapsed-menu-right {
  .tile-text-collap {
    display: block;
  }
  .tile-text {
    display: none;
  }
}

.tile-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.tile-text-collap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: none;
}

.list-notifications {
  .block-submenu__header {
    height: 71px;
  }
  .wrapper-order-notifications {
    word-break: break-all;
    p {
      margin-bottom: 0;
    }
    .body-item {
      .body-item-title-wrapper {
        b {
          max-width: 295px;
        }
      }
    }
  }
}

.sub-menu-arrow-icon {
  z-index: -1;
}
</style>
