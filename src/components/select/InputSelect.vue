<template>
  <div
    class="wrapper pointer"
    :style="style"
    :class="{ 'is-active': isActive }"
    v-click-outside="handleClose"
  >
    <div class="content" @click="handleOpen">
      <slot name="content" />
    </div>
    <img
      @click="handleOpen"
      src="@/assets/icons/arrow_down_select.svg"
      width="12"
      height="12"
    />
    <slot name="dropdown" />
  </div>
</template>

<script>
export default {
  name: "InputSelect",
  props: ["width", "setOpen", "isActive"],
  computed: {
    style() {
      return {
        width: this.width || "50px",
      };
    },
  },
  methods: {
    handleOpen() {
      this.setOpen(true);
    },
    handleClose() {
      this.setOpen(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  border: 1px solid #c4c4c4 !important;
  border-radius: 5px !important;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  &.is-active {
    border-color: var(--primaryColor) !important;
  }
  .content {
    height: 100%;
  }
}
</style>
