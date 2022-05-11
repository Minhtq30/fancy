<template>
  <div class="flex t-pt-4 t-pl-4 t-items-center info-fieldset">
    <div class="t-text-lg">
      <vue3-autocounter
        :startAmount="currentValue > 100 ? currentValue - 100 : 0"
        :endAmount="currentValue"
        :suffix="suffix"
        :duration="1"
      />
    </div>

    <span
      :class="[
        'flex',
        currentValue >= pastValue ? 't-text-primary' : 't-text-warning',
        't-pl-2',
        'align-items-center',
      ]"
    >
      {{ percentage }}</span
    >
    <span class="t-pl-4 t-text-lg">
      {{ text }}
    </span>
  </div>
</template>

<script>
import Vue3Autocounter from "vue3-autocounter";
export default {
  name: "Info-fieldset",
  props: {
    currentValue: Number,
    pastValue: Number,
    text: String,
    suffix: String,
  },
  components: {
    Vue3Autocounter,
  },

  computed: {
    percentage() {
      return this.currentValue && this.pastValue
        ? (this.currentValue >= this.pastValue ? "+" : "") +
            Math.round(
              ((this.currentValue - this.pastValue) / this.pastValue) * 100
            ) +
            " %"
        : "";
    },
  },
};
</script>
<style></style>
