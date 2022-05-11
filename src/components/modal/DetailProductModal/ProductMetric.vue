<template>
  <div class="info-metric flex t-h-[46px] mt-1 t-mb-4">
    <div
      class="info-metric-item info-metric__order flex t-flex-1 t-flex-col t-justify-between t-relative"
    >
      <span class="medium-text metric-value">
        <g-skeleton-text v-if="loading" :active="true" :width="'50%'" />
        <format-price v-else :value="product?.total_order || 0" />
      </span>
      <span class="metric-title t-text-sm"> Đặt mua </span>
    </div>
    <div
      class="info-metric-item info-metric__sold flex t-flex-1 t-flex-col t-justify-between t-relative t-pl-6"
    >
      <span class="medium-text metric-value">
        <g-skeleton-text v-if="loading" :active="true" :width="'50%'" />
        <format-price v-else :value="product?.total_sell || 0" />
      </span>
      <span class="metric-title t-text-sm"> Đã bán </span>
    </div>
    <div
      class="info-metric-item info-metric__refund flex t-flex-1 t-flex-col t-justify-between t-relative t-pl-6"
    >
      <span class="medium-text metric-value">
        <g-skeleton-text v-if="loading" :active="true" :width="'50%'" />
        <format-price v-else :value="product?.total_refund || 0" />
      </span>
      <span class="metric-title t-text-sm"> Hoàn </span>
    </div>
    <div
      class="info-metric-item info-metric__remain flex t-flex-1 t-flex-col t-justify-between t-relative t-pl-6"
    >
      <span class="medium-text metric-value">
        <g-skeleton-text v-if="loading" :active="true" :width="'50%'" />
        <format-price v-else :value="product?.total_inventory || 0" />
      </span>
      <span class="metric-title t-text-sm"> Tồn </span>
    </div>
  </div>
</template>

<script>
import FormatPrice from "@/components/FormatPrice.vue";
import { GSkeletonText } from "@/components/elements/skeleton";

export default {
  name: "ProductMetric",
  props: ["product", "loading"],
  components: { FormatPrice, GSkeletonText },
};
</script>

<style lang="scss" scoped>
.info-metric {
  &-item {
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
}
</style>
