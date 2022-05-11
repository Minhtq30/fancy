<template>
  <a-skeleton
    class="g-skeleton-text"
    :active="!!active"
    :paragraph="{ rows: 1 }"
    :style="style"
  />
</template>

<script>
export default {
  name: "SkeletonText",
  props: ["active", "width", "height"],
  computed: {
    style() {
      let _style = {
        width: `${this.width || "100%"}`,
      };
      return _style;
    },
  },
};
</script>

<style lang="scss">
.g-skeleton-text {
  .ant-skeleton-title {
    width: 100% !important;
    margin: 0 0 8px 0 !important;
    height: 16px !important;
  }
  &.font-size-14 {
    .ant-skeleton-title {
      height: 14px !important;
    }
  }
  &.mb-16 {
    .ant-skeleton-title {
      margin: 0 0 16px 0 !important;
    }
  }
  .ant-skeleton-paragraph {
    display: none;
  }
  &.no-margin {
    .ant-skeleton-title {
      margin: 0 !important;
    }
  }
}
</style>
