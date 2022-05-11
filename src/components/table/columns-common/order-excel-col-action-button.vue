<template>
  <div class="channel__item-col channel__item-action-button">
    <g-confirm-print-order
      :option="option"
      :showSort="false"
      @updateOption="handleUpdateOption"
      @onPrintOrders="onPrintOrders"
    >
      <template #content>
        <g-button>In</g-button>
      </template>
    </g-confirm-print-order>
    <g-button @click="handleUpdate" :disabled="!(updateType === 'update')">
      Lưu
    </g-button>
    <g-button :disabled="isError" @click="handleUpdateToEcom">Đẩy đơn</g-button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import GButton from "@/components/elements/button";
import GConfirmPrintOrder from "@/components/popover/ConfirmPrintOrder.vue";

export default defineComponent({
  name: "order-excel-col-action-button",
  components: {
    GButton,
    GConfirmPrintOrder,
  },
  props: {
    orderId: String,
    updateType: String,
    isError: Boolean,
  },
  data() {
    return {
      option: {
        hasClientId: false,
      },
    };
  },
  methods: {
    handleUpdateOption(value) {
      this.option = value;
    },
    onPrintOrders() {
      this.$emit("printOrder", this.option);
    },
    handleUpdate() {
      this.$emit("onUpdate");
    },
    handleUpdateToEcom() {
      this.$emit("onUpdateToEcom");
    },
  },
});
</script>

<style lang="scss">
.channel__item-action {
  .ant-checkbox-inner {
    border-radius: 50px;
    width: 30px;
    height: 30px;
  }
  .ant-checkbox-inner::after {
    left: 36%;
  }
}
.channel__item-action-button {
  text-align: center;
  button {
    margin-bottom: 5px;
    width: 73px;
    border-radius: 50px !important;
    height: 26px;
    padding: unset;
    text-align: center;
  }
}
</style>
