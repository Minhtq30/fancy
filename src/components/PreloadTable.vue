<template>
  <div class="wrapper-preload-table">
    <div class="flex align-items-center">
      <a-spin />
      <span class="ml primary-text">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PreloadTable",
  props: ["text"],
};
</script>

<style lang="scss" scoped>
.wrapper-preload-table {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
