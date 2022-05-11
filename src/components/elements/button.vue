<template>
  <a-button class="g-button">
    <slot />
    <template #icon>
      <slot name="icon" />
    </template>
  </a-button>
</template>

<script>
export default {
  name: "GButton",
};
</script>

<style lang="scss" scoped>
.g-button {
  border-radius: 5px;
  transition: 0.15s linear;
  &:disabled,
  &.disabled {
    background-color: #fff !important;
    border-color: var(--disabledColor) !important;
    color: var(--disabledColor);
    &.primary {
      background-color: var(--disabledColor) !important;
      color: #fff;
    }
  }
  &:not(:disabled) {
    border-color: var(--primaryColor);
    color: var(--primaryColor);
    &.primary {
      color: #fff;
      background-color: var(--primaryColor);
      border-color: var(--primaryColor);
    }
    &.danger {
      color: #fff;
      background-color: var(--dangerColor);
      border-color: var(--dangerColor);
    }
  }
  &.rounded {
    border-radius: 20px;
  }
  &.default {
    color: #bdbdbd;
    border: none;
    box-shadow: none;
  }
  &.border-ranger {
    border-color: #f46b4c;
  }
}
</style>
