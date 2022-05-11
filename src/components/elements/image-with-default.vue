<template>
  <div :style="styles" class="t-relative">
    <div
      class="t-bg-cover t-bg-center t-w-full t-h-full t-absolute"
      style="z-index: -1"
      :style="{
        backgroundImage: `url(${srcDefault})`,
      }"
    />
    <div
      class="t-bg-cover t-bg-center t-w-full t-h-full"
      :style="{
        backgroundImage: `url(${src})`,
      }"
    />
  </div>
</template>

<script>
export default {
  name: "ImageWithDefault",
  props: ["alt", "src", "srcDefault", "width", "height"],
  computed: {
    styles() {
      return {
        width: this.width || "100px",
        height: this.height || "100px",
      };
    },
  },
};
</script>
