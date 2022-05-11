<template>
  <div id="shop-info-layout" class="t-flex">
    <menu-right :isError="!!errorMessage" />
    <div class="main-content t-flex-1">
      <router-view />
    </div>
  </div>
</template>

<script>
import MenuRight from "./menu-right.vue";

export default {
  components: {
    MenuRight,
  },
};
</script>

<style lang="scss" scoped>
#shop-info-layout {
  width: calc(100% + 30px);
  transform: translate(-15px, -15px);
}
</style>
