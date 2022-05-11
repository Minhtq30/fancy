<template>
  <a-skeleton
    avatar
    :active="!!active"
    class="g-skeleton-image-circle"
    :style="style"
  />
</template>

<script>
export default {
  name: "SkeletonImage",
  props: ["active", "width", "height"],
  computed: {
    style() {
      let _style = {
        width: `${this.width || 100}px`,
        height: `${this.height || 100}px`,
      };
      return _style;
    },
  },
};
</script>

<style lang="scss">
.g-skeleton-image-circle {
  .ant-skeleton-header {
    padding: 0;
    .ant-skeleton-avatar {
      width: 100%;
      height: 100%;
    }
  }
  .ant-skeleton-content {
    display: none;
  }
}
</style>
