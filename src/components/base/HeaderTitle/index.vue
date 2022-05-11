<template>
  <div class="header t-flex t-items-center">
    <left-outlined-icon
      v-if="!noAction"
      :style="{ cursor: 'pointer', height: '1rem' }"
      @click="onClickBack"
    />
    <span
      class="t-text-2xl t-font-medium t-text-black"
      :class="{ 't-ml-4': !noAction }"
      style="font-size: 18px; line-height: 22px"
    >
      {{ title }}
    </span>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Icon
import LeftOutlinedIcon from "@/components/icons/LeftOutlinedIcon.vue";

export default defineComponent({
  components: {
    LeftOutlinedIcon,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    onBack: {
      type: Function,
      default() {},
    },
    noAction: {
      type: Boolean,
      default: false,
    },
  },
  name: "HeaderTitle",
  setup(props, { emit }) {
    const onClickBack = (event) => {
      emit("onBack", event);
    };

    return {
      onClickBack,
    };
  },
});
</script>
