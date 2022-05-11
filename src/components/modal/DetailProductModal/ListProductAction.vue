<template>
  <div class="list-product-action-wrapper">
    <div class="t-flex t-flex-1 t-h-[46px]">
      <div
        class="t-flex t-flex-1 t-flex-col t-justify-between t-relative info-metric-item"
      >
        <span class="medium-text metric-value">
          <g-skeleton-text v-if="!metric" :active="true" :width="'50%'" />
          <format-price v-else :value="metric?.total_viewer || 0" />
        </span>
        <span class="metric-title">KH đã xem</span>
      </div>
      <div
        class="t-flex t-flex-1 t-flex-col t-justify-between t-relative t-pl-4 info-metric-item"
      >
        <span class="medium-text metric-value">
          <g-skeleton-text v-if="!metric" :active="true" :width="'50%'" />
          <format-price v-else :value="metric?.total_buyer || 0" />
        </span>
        <span class="metric-title">KH đặt mua</span>
      </div>
      <div
        class="t-flex t-flex-1 t-flex-col t-justify-between t-relative t-pl-4 info-metric-item"
      >
        <span class="medium-text metric-value">
          <g-skeleton-text v-if="!metric" :active="true" :width="'50%'" />
          <format-price v-else :value="metric?.total_received_buyer || 0" />
        </span>
        <span class="metric-title">KH đã mua</span>
      </div>
      <div
        class="t-flex t-flex-1 t-flex-col t-justify-between t-relative t-pl-4 info-metric-item"
      >
        <div class="t-flex t-items-center">
          <span class="medium-text metric-value mr">
            <g-skeleton-text v-if="!metric" :active="true" :width="'20px'" />
            <format-price v-else :value="metric?.total_satisfied || 0" />
          </span>
          <a-tooltip :title="'Hài lòng'">
            <like-shop-info-icon />
          </a-tooltip>
          <span class="medium-text metric-value ml mr">
            <g-skeleton-text v-if="!metric" :active="true" :width="'20px'" />
            <format-price v-else :value="metric?.total_unsatisfied || 0" />
          </span>
          <a-tooltip :title="'Không hài lòng'">
            <unlike-shop-info-icon />
          </a-tooltip>
        </div>
        <span class="metric-title">Đánh giá</span>
      </div>
    </div>
    <div class="list-actions" @scroll="handleScroll">
      <template v-if="!events">
        <simple-product-action-skeleton />
        <simple-product-action-skeleton />
        <rate-product-action-skeleton />
        <rate-product-action-skeleton />
      </template>
      <template v-else>
        <div v-if="events.length === 0" class="t-mt-4">
          <a-empty :description="'Danh sách trống'" />
        </div>
        <div v-else v-for="(event, index) in events" :key="index">
          <simple-product-action v-if="!event.review" :event="event" />
          <rate-product-action v-else :event="event" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import FormatPrice from "@/components/FormatPrice.vue";
import { GSkeletonText } from "@/components/elements/skeleton";
import LikeShopInfoIcon from "@/components/icons/LikeShopInfoIcon.vue";
import UnlikeShopInfoIcon from "@/components/icons/UnlikeShopInfoIcon.vue";
import SimpleProductAction from "./SimpleProductAction.vue";
import RateProductAction from "./RateProductAction.vue";
import warehouseService from "@/services/warehouse.service";
import SimpleProductActionSkeleton from "./SimpleProductActionSkeleton.vue";
import RateProductActionSkeleton from "./RateProductActionSkeleton.vue";

export default {
  name: "ListProductAction",
  props: ["productId"],
  components: {
    LikeShopInfoIcon,
    UnlikeShopInfoIcon,
    SimpleProductAction,
    RateProductAction,
    FormatPrice,
    GSkeletonText,
    SimpleProductActionSkeleton,
    RateProductActionSkeleton,
  },
  data() {
    return {
      events: null,
      metric: null,
      loading: {
        getEvents: false,
      },
      before: -1,
    };
  },
  mounted() {
    if (this.productId) {
      this.getData();
    }
  },
  computed: {
    ...mapState({
      shopInfo: (state) => state.shop.Shop,
    }),
  },
  methods: {
    async getData(before = null) {
      let metric = {};
      let events = [...(this.events || [])];

      this.loading.getEvents = true;
      try {
        const params = {
          shop_code: "S" + this.shopInfo.code,
          product_id: this.productId,
        };
        if (before) params.before = before;
        const response = await warehouseService.getProductLogs(params);
        if (response?.data?.success) {
          const _events = response?.data?.data?.events || [];
          events = [...events, ..._events];
          metric = {
            total_buyer: response?.data?.data?.total_buyer || 0,
            total_received_buyer:
              response?.data?.data?.total_received_buyer || 0,
            total_satisfied: response?.data?.data?.total_satisfied || 0,
            total_unsatisfied: response?.data?.data?.total_unsatisfied || 0,
            total_viewer: response?.data?.data?.total_viewer || 0,
          };
          this.before = response?.data?.data?.before || -1;
        }
      } catch (error) {
        console.error(error);
      }
      this.metric = metric;
      this.events = events;
      this.loading.getEvents = false;
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (
        this.before !== -1 &&
        !this.loading.getEvents &&
        percentageScrolled >= 0.85
      ) {
        this.getData(this.before);
      }
    },
  },
  watch: {
    productId(_productId) {
      this.events = null;
      this.metric = null;
      this.before = -1;
      if (_productId) {
        this.getData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-product-action-wrapper {
  .info-metric-item {
    &:not(:first-child) {
      &::before {
        display: block;
        content: "";
        width: 1px;
        background-color: var(--grayColor);
        height: 1.5rem;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .metric-title {
      color: #808080;
    }
  }
  .list-actions {
    height: calc(85vh - 400px - 46px);
    overflow-y: auto;
    width: calc(100% + 30px);
    transform: translateX(-1rem);
    padding: 0 1rem;
  }
}
</style>

<style lang="scss">
.list-product-action-wrapper {
  .ant-skeleton {
    display: flex !important;
    align-items: center !important;
    height: 20px;
    .ant-skeleton-title {
      margin-bottom: 0 !important;
    }
  }
}
</style>
