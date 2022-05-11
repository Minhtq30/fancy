<template>
  <div
    class="main-content-shop-info-page"
    :class="{ 'has-footer': hasFooterSlot }"
  >
    <div class="main">
      <slot name="main" />
    </div>
    <div class="footer t-flex t-items-center">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    hasFooterSlot() {
      return !!this.$slots.footer;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-content-shop-info-page {
  height: calc(100vh - 64px);
  overflow-y: auto;
  position: relative;
  .main {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
  }
  &.has-footer {
    .main {
      height: calc(100% - 72px);
    }
    .footer {
      position: absolute;
      padding: 1rem;
      width: 100%;
      bottom: 0;
      height: 72px;
      border-top: 1px solid var(--grayColor);
    }
  }
}
</style>
