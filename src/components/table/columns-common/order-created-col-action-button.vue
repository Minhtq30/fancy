<template>
  <div class="channel__item-col channel__item-action-button">
    <g-button @click="handlePrintOrder">In</g-button>
    <br />
    <g-confirm-remove-order @onRemoveOrder="handleRemoveOrder">
      <template #content>
        <g-button>Hủy</g-button>
      </template>
    </g-confirm-remove-order>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import GButton from "@/components/elements/button";
import GConfirmRemoveOrder from "@/components/popover/ConfirmRemoveOrder.vue";

// Const
import { REDIRECT_URI } from "@/contants";

const PRINT_URL = `${REDIRECT_URI}/khach-hang/in-don-hang`;

export default defineComponent({
  name: "order-created-col-action-button",
  components: {
    GButton,
    GConfirmRemoveOrder,
  },
  props: {
    orderId: String,
    updateType: String,
    isError: Boolean,
    item: Object,
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
    handleRemoveOrder() {
      this.$emit("onRemoveOrder");
    },
    handlePrintOrder() {
      const orderIds = [this.item.id];
      let query = "";
      for (const id of orderIds) {
        query += (query ? "&" : "?") + `data[package_id][${id}]=1`;
      }
      window.open(encodeURI(PRINT_URL + query), "_blank");
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
