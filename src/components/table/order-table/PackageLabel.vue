<template>
  <div class="flex align-items-center wrapper-package-label">
    <div
      class="order-type-package mr"
      v-if="isShowProperty(order.property)"
      :style="{
        backgroundColor: PROPERTY_COLOR[order.property.toUpperCase()],
      }"
    >
      {{ order.property.toUpperCase() }}
    </div>
    <div
      class="order-type-package mr"
      v-if="order?.is_cancel?.toString() === '1'"
      :style="{ backgroundColor: '#ff7f00' }"
    >
      Đã hủy
    </div>
    <template v-for="tag in order.tags" :key="tag">
      <div
        v-if="getTagTitle(tag)"
        class="order-type-package mr"
        :style="{
          backgroundColor: TAG_COLOR[tag],
        }"
      >
        {{ getTagTitle(tag) }}
      </div>
    </template>
    <div
      v-if="isSundayDelivery(order)"
      class="custom-tag-label"
      :style="{
        backgroundColor: LABEL_COLOR['date_to_delay_deliver'],
      }"
    >
      Giao CN
    </div>
    <div
      v-if="isNightDelivery(order)"
      class="custom-tag-label"
      :style="{
        backgroundColor: LABEL_COLOR['deliver_work_shift'],
      }"
    >
      Giao tối
    </div>
    <div
      v-if="isSundayPick(order)"
      class="custom-tag-label"
      :style="{
        backgroundColor: LABEL_COLOR['date_to_delay_pick'],
      }"
    >
      Lấy CN
    </div>
    <div
      v-if="isNightPick(order)"
      class="custom-tag-label"
      :style="{
        backgroundColor: LABEL_COLOR['pick_work_shift'],
      }"
    >
      Lấy tối
    </div>
  </div>
</template>

<script>
import { PROPERTY_COLOR, TAG_COLOR, LABEL_COLOR } from "@/contants/package";
import { ORDER_TYPE } from "@/contants";

export default {
  name: "PackageLabel",
  props: ["order"],
  data() {
    return {
      LABEL_COLOR,
      TAG_COLOR,
      PROPERTY_COLOR,
    };
  },
  methods: {
    getTagTitle(tag) {
      const orderTypes = [...ORDER_TYPE, { key: 8, title: "Lấy hàng" }];
      for (const orderType of orderTypes) {
        if (orderType.key.toString() === tag.toString()) {
          return orderType.title;
        }
      }
      return "";
    },
    isSunday(timeString) {
      if (!timeString) return false;
      const newDate = new Date(timeString);

      return newDate.getDay() === 0;
    },
    isSundayDelivery(order) {
      return this.isSunday(order?.date_to_delay_deliver);
    },
    isSundayPick(order) {
      return this.isSunday(order.date_to_delay_pick);
    },
    isNightDelivery(order) {
      return order?.deliver_work_shift?.toString() === "3";
    },
    isNightPick(order) {
      return order?.pick_work_shift?.toString() === "3";
    },
    isShowProperty(property) {
      if (!property) return false;
      return ["bbs", "xfast"].includes(property.toLowerCase());
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-package-label {
  flex-wrap: wrap;
  .custom-tag-label,
  .order-type-package {
    color: #fff;
    border-radius: 4px;
    height: 20px;
    padding: 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin: 3px 0;
    margin-right: 0.5rem;
  }

  .order-type-package {
    background-color: #f2994a;
  }
}
</style>
