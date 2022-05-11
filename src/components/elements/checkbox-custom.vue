<template>
  <div
    class="wrapper pointer"
    :class="{ 'is-checked': checked }"
    @click="handleOnChange"
  >
    <div class="squared">
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 1H2.2C1.53726 1 1 1.53726 1 2.2V19.8C1 20.4627 1.53726 21 2.2 21H19.8C20.4627 21 21 20.4627 21 19.8V9"
          stroke="black"
          stroke-width="1.8"
        />
      </svg>
    </div>
    <div class="tick-icon">
      <svg
        width="18"
        height="15"
        viewBox="0 0 18 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.76172 8.49268L5.79533 12.8849L16.5516 1.9043"
          stroke="black"
          stroke-width="1.8"
          stroke-linecap="square"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckboxCustom",
  props: ["checked", "onChange"],
  methods: {
    handleOnChange() {
      if (this.onChange) {
        this.onChange(!this.checked);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  position: relative;
  height: 22px;
  &.is-checked {
    .tick-icon {
      opacity: 1;
      scale: 1;
    }
  }
  .tick-icon {
    position: absolute;
    top: 2px;
    right: 1px;
    display: flex;
    opacity: 0;
    scale: 0.8;
    transition: 0.15s ease-in-out;
    svg {
      width: 15px;
    }
  }
  .squared {
    svg {
      width: 20px;
    }
  }
}
</style>
