<template>
  <a-select class="g-select-v3">
    <slot />
  </a-select>
</template>

<script>
export default {
  name: "SelectBoxInTable",
};
</script>

<style lang="scss">
.g-select-v3 {
  .ant-select-selector {
    padding: 0 5px !important;
    border-radius: 4px !important;
    border-color: #d9d9d9 !important;
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
.g-select-v3.ant-select {
  color: black;
}
</style>
