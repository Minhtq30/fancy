<template>
  <a-select dropdownClassName="g-select-v2-dropdown" class="g-select-v2">
    <slot />
  </a-select>
</template>

<script>
export default {
  name: "SelectBoxForAddress",
};
</script>

<style lang="scss">
.g-select-v2-dropdown {
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: var(--primaryColor) !important;
    color: white;
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: var(--primaryColor) !important;
    color: white;
  }
}
.g-select-v2 {
  .ant-select-selector {
    border-radius: 4px !important;
  }
  .ant-select-arrow {
    background-image: url("/web/img/images/arrow_right.png");
    background-repeat: no-repeat;
    background-position: center;
    right: 6px !important;
  }
  .ant-select-arrow .anticon {
    display: none;
  }
}
.g-select-v2.ant-select {
  color: black;
}
</style>
