<template>
  <div class="wrapper">
    <img src="@/assets/icons/default_image.svg" />
    <img class="main-image" :src="src" />
  </div>
</template>

<script>
export default {
  name: "ImagePreload",
  props: ["src"],
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e6e8;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  img {
    max-width: 100%;
    &.main-image {
      position: absolute;
      height: 100%;
    }
  }
}
</style>
