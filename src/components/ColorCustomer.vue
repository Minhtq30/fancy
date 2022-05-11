<template>
  <a-tooltip
    v-if="reportType === 'trusted'"
    :title="'Khách hàng đáng tin cậy'"
    placement="bottomRight"
  >
    <div class="icon-good-customer" />
  </a-tooltip>
  <a-tooltip
    v-if="reportType === 'yellow'"
    :title="'Khách hàng bị shiper report'"
    placement="bottomRight"
  >
    <div class="icon-shipper-customer" />
  </a-tooltip>
  <a-tooltip
    v-if="reportType === 'superRed'"
    :title="'Khách hàng khó giao'"
    placement="bottomRight"
  >
    <div class="icon-khogiao-customer" />
  </a-tooltip>
  <a-tooltip
    v-if="reportType === 'red'"
    :title="'5 đơn chỉ nhận 1'"
    placement="bottomRight"
  >
    <div class="icon-5-customer" />
  </a-tooltip>
  <a-tooltip
    v-if="reportType === 'purple'"
    :title="'10 đơn chỉ nhận 1'"
    placement="bottomRight"
  >
    <div class="icon-10-customer" />
  </a-tooltip>
  <a-tooltip
    v-if="reportType === 'badReport'"
    :title="'Khách hàng shop báo xấu'"
    placement="bottomRight"
  >
    <div class="icon-shop-customer">
      <g-flag-red-icon />
    </div>
  </a-tooltip>
  <a-tooltip
    v-if="reportType === 'goodReport'"
    :title="'Khách hàng hài lòng'"
    placement="bottomRight"
  >
    <div class="icon-shop-good-customer">
      <g-flag-green-icon />
    </div>
  </a-tooltip>
</template>

<script>
// TODO NamVH: Code tạm, sau cần đưa về 1 object và dùng v-for để ngắn gọn hơn

// Components
import GFlagGreenIcon from "@/components/icons/FlagGreenIcon";
import GFlagRedIcon from "@/components/icons/FlagRedIcon";

export default {
  name: "ColorCustomer",
  props: {
    reportType: String,
  },
  components: {
    GFlagGreenIcon,
    GFlagRedIcon,
  },
};
</script>

<style scoped>
.icon-good-customer {
  display: flex;
  width: 10px;
  height: 10px;
  background-color: var(--primaryColor);
  border-radius: 22px;
}
.icon-shipper-customer {
  display: flex;
  width: 10px;
  height: 10px;
  background-color: #ffa600;
  border-radius: 22px;
}
.icon-khogiao-customer {
  display: flex;
  width: 10px;
  height: 10px;
  background-color: #da4838;
  border-radius: 22px;
}
.icon-5-customer {
  display: flex;
  width: 10px;
  height: 10px;
  background-color: #ff0d1b;
  border-radius: 22px;
}
.icon-10-customer {
  display: flex;
  width: 10px;
  height: 10px;
  background-color: #7b61ff;
  border-radius: 22px;
}
.icon-shop-customer {
  display: flex;
  width: 10px;
  height: 10px;
}
.icon-shop-good-customer {
  display: flex;
  width: 10px;
  height: 10px;
}
</style>
