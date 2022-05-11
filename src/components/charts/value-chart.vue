<template>
  <div
    class="value-container t-text-18 t-leading-snug t-pr-2 t-text-faded t-items-center"
  >
    <div class="">
      {{ text }}
    </div>
    <div class="flex t-items-baseline">
      <div class="t-pl-2 t-text-18 t-leading-snug t-text-black">
        {{ value }}
      </div>
      <div class="t-text-primary t-pl-2 t-text-16 leading-5">
        {{ percentage }}
      </div>
      <div class="t-text-warning t-text-16 leading-5">
        {{ percentagedecrease }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "value-refund",
  props: {
    text: String,
    value: String,
    percentage: String,
    percentagedecrease: String,
  },
};
</script>

<style></style>
