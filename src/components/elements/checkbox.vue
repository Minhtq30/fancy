<template>
  <a-checkbox class="g-checkbox" :class="{ [`size-${size}`]: true }">
    <slot />
  </a-checkbox>
</template>

<script>
export default {
  name: "GCheckbox",
  props: ["size"],
};
</script>

<style lang="scss">
.g-checkbox {
  font-size: 16px !important;
  .ant-checkbox-inner {
    &::after {
      left: 21%;
    }
  }
  &.size-medium {
    .ant-checkbox-inner {
      width: 24px;
      height: 24px;
      &::after {
        top: 45%;
        left: 28%;
        width: 6.714286px;
        height: 13.142857px;
      }
    }
  }
  .ant-checkbox-inner {
    border-color: var(--primaryColor) !important;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: var(--primaryColor);
  }
  .ant-checkbox-checked {
    &::after {
      border-color: var(--primaryColor);
    }
    .ant-checkbox-inner {
      border-color: var(--primaryColor);
      background-color: var(--primaryColor);
    }
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    height: 2px;
    background-color: #fff;
  }
  .ant-checkbox {
    transform: translateY(-1px);
  }
}
</style>
