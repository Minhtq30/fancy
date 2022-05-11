<template>
  <a-select class="g-select">
    <slot />
  </a-select>
</template>

<script>
export default {
  name: "GSelect",
};
</script>

<style lang="scss">
.g-select {
  .ant-select-selector {
    border-radius: 5px !important;
    border-color: var(--primaryColor) !important;
    color: var(--primaryColor);
  }
  &.ant-select-disabled {
    .ant-select-selector {
      border-color: var(--grayColor) !important;
    }
    .ant-select-arrow {
      svg {
        fill: var(--grayColor);
      }
    }
  }
  .ant-select-arrow {
    svg {
      fill: var(--primaryColor);
    }
  }
}
</style>
