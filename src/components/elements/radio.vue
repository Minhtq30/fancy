<template>
  <a-radio class="g-radio">
    <slot />
  </a-radio>
</template>

<script>
export default {
  name: "GRadio",
};
</script>

<style lang="scss">
.g-radio {
  .ant-radio {
    &.ant-radio-checked {
      &::after {
        border: 1px solid var(--primaryColor);
      }
      .ant-radio-inner {
        &::after {
          background-color: var(--primaryColor);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: none;
          border-radius: 50%;
        }
      }
    }
    .ant-radio-inner {
      border-color: var(--primaryColor);
    }
  }
}
</style>
