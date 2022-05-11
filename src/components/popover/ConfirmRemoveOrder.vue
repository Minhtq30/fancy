<template>
  <g-popover v-model:visible="visible" trigger="click" placement="leftTop">
    <template #content>
      <div class="t-p-3 wrapper">
        <span>
          Thao tác này sẽ Hủy toàn bộ thông tin của đơn hàng trên hệ thống của
          GHTK.
        </span>
        <br />
        <i>Bạn có chắc chắn muốn gửi yêu cầu Hủy đơn hàng?</i>
        <div class="t-mt-4 t-flex t-justify-between">
          <g-button
            class="g-remove-order"
            @click="handleRemoveOrder"
            size="small"
          >
            Hủy đơn hàng
          </g-button>
          <a-button @click="handleCancel" size="small">Hủy</a-button>
        </div>
      </div>
    </template>
    <slot name="content" />
  </g-popover>
</template>

<script>
import { defineComponent, ref } from "vue";

import GButton from "@/components/elements/button.vue";
import GPopover from "@/components/elements/popover";

export default defineComponent({
  name: "ConfirmRemoveOrder",
  components: {
    GPopover,
    GButton,
  },
  props: {
    option: Object,
    showSort: {
      type: Boolean,
      default: true,
    },
    showClientId: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const visible = ref(false);
    const handleCancel = () => {
      visible.value = false;
    };

    return {
      visible,
      handleCancel,
    };
  },
  methods: {
    handleRemoveOrder() {
      this.$emit("onRemoveOrder");
      this.handleCancel();
    },
  },
});
</script>

<style scoped>
.wrapper {
  width: 260px;
}
.g-remove-order {
  color: #dc3545 !important;
  border-color: #dc3545 !important;
}
</style>
