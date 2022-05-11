<template>
  <a-input-number class="g-input-number-in-table">
    <slot />
  </a-input-number>
</template>

<script>
export default {
  name: "GInputNumberInTable",
};
</script>

<style lang="scss">
.g-input-number-in-table {
  padding: unset !important;
  border: unset !important;
  border-radius: 0 !important;
  border-bottom: 1px solid #d9d9d9 !important;
}
.g-input-number-in-table.ant-input-number-input:focus {
  border-color: #069255 !important;
  border-right-width: unset !important;
  box-shadow: unset !important;
}
</style>
