<template>
  <div class="channel__item-col channel__item-stt">
    <span>
      {{ stt }}
    </span>
    <div class="stt-action">
      <span
        v-if="showSwapButton && hasSwapButton"
        title="Đẩy lên"
        class="stt-action__swap"
        @click="handleSwapOrder"
      >
        <swap-icon />
      </span>
      <span
        class="stt-action__remove"
        title="Xóa đơn"
        v-if="hasRemoveButton"
        @click="handleRemoveOrder"
      >
        <remove-icon />
      </span>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";

// Component - Icons
import RemoveIcon from "@/components/icons/RemoveIcon";
import SwapIcon from "@/components/icons/SwapIcon";

// TODO NamVH: Example for "Component API" in VueJS
export default defineComponent({
  name: "order-excel-col-stt",
  props: {
    orderIndex: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 0,
    },
    hasRemoveButton: {
      type: Boolean,
      default: true,
    },
    hasSwapButton: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    RemoveIcon,
    SwapIcon,
  },
  setup(props, { emit }) {
    const stt = computed(() => {
      return props.orderIndex + 1 + props.currentPage * props.limit;
    });

    const showSwapButton = computed(() => {
      return stt.value > 1;
    });

    const handleRemoveOrder = () => {
      emit("onRemoveOrder");
    };

    const handleSwapOrder = () => {
      emit("onSwapOrder");
    };

    return {
      stt,
      showSwapButton,
      handleRemoveOrder,
      handleSwapOrder,
    };
  },
});
</script>

<style lang="scss" scoped>
.channel__item-stt {
  text-align: center;
  display: flex;
  flex-direction: column;

  .stt-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__swap {
      display: flex;
      margin-top: 10px;
      cursor: pointer;
      color: #828282;
    }
    &__remove {
      position: absolute;
      cursor: pointer;
      color: #828282;
      bottom: 0;
    }
  }
}
</style>
