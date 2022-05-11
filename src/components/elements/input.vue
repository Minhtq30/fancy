<template>
  <a-input class="g-input">
    <slot />
    <template #prefix>
      <slot name="prefix" />
    </template>
    <template #suffix>
      <slot name="suffix" />
      <div v-if="isDisplayStatus">
        <div
          v-if="isDisplayNumber"
          class="isDisplayStatus 2xl:t-ml-[-25px] t-ml-0"
        >
          {{ isDisplayNumber }}
        </div>
      </div>
    </template>
  </a-input>
</template>

<script>
export default {
  name: "GInput",
  props: {
    isDisplayStatus: {
      type: Boolean,
      default: false,
    },
    isDisplayNumber: {
      type: Number,
    },
  },
};
</script>

<style scoped lang="scss">
.g-input {
  border: 1px solid #c4c4c4 !important;
  border-radius: 5px !important;
  height: 32px;
  box-shadow: none !important;
  justify-content: center;
  &.is-error {
    border-color: #da4838 !important;
  }
  .isDisplayStatus {
    position: relative;
    width: 24px;
    height: 24px;
    background-color: #e13636;
    border-radius: 50%;
    color: white;
    line-height: 24px !important;
  }
}
</style>
