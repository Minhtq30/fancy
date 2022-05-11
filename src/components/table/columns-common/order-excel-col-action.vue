<template>
  <div class="channel__item-col channel__item-action">
    <g-checkbox :checked="isSelected" @change="handleSelectOrder" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import GCheckbox from "@/components/elements/checkbox.vue";

export default defineComponent({
  name: "order-excel-col-action",
  components: {
    GCheckbox,
  },
  props: {
    orderId: String,
    isSelected: Boolean,
  },
  setup(props, { emit }) {
    const handleSelectOrder = (event) => {
      emit("handleSelectOrder", event);
    };

    return {
      handleSelectOrder,
    };
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
</style>
