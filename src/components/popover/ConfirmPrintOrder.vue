<template>
  <g-popover v-model:visible="visible" trigger="click" placement="leftTop">
    <template #content>
      <div class="t-p-3">
        <div v-if="showSort">
          <g-checkbox @change="changeOptionSort" :checked="option.hasSort"
            >In theo thứ tự như bảng Excel</g-checkbox
          >
        </div>
        <div v-if="showClientId" class="t-mt-2">
          <g-checkbox @change="changeOptionClient" :checked="option.hasClientId"
            >In kèm mã ĐH riêng</g-checkbox
          >
        </div>
        <div class="t-mt-4 t-flex t-justify-between">
          <g-button @click="handlePrintOrder" size="small"
            >Xác nhận in</g-button
          >
          <a-button @click="handleCancel" size="small">Hủy</a-button>
        </div>
      </div>
    </template>
    <slot name="content" />
  </g-popover>
</template>

<script>
import GButton from "@/components/elements/button.vue";
import GCheckbox from "@/components/elements/checkbox.vue";
import GPopover from "@/components/elements/popover";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ConfirmPrintOrder",
  components: {
    GPopover,
    GCheckbox,
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
    handlePrintOrder() {
      this.$emit("onPrintOrders");
      this.handleCancel();
    },
    changeOptionSort(event) {
      this.$emit("updateOption", {
        ...this.option,
        hasSort: event.target.checked,
      });
    },
    changeOptionClient(event) {
      this.$emit("updateOption", {
        ...this.option,
        hasClientId: event.target.checked,
      });
    },
  },
});
</script>

<style scoped></style>
