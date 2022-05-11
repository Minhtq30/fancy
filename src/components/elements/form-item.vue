<template>
  <div class="g-form-item w-100" :class="{ 'is-error': !!errorMessage }">
    <slot name="label" />
    <div class="content-wrapper">
      <slot name="content" />
      <div class="suffix">
        <slot name="suffix" />
      </div>
      <small
        class="message error-message"
        :class="{ 'is-show': !!errorMessage }"
      >
        {{ errorMessage || "error" }}
      </small>
      <small
        class="message note-message"
        :class="{ 'is-show': !!noteMessage && !errorMessage }"
      >
        {{ noteMessage || "note" }}
      </small>
    </div>
  </div>
</template>

<script>
export default {
  name: "GFormItem",
  props: ["errorMessage", "noteMessage"],
};
</script>

<style lang="scss" scoped>
.g-form-item {
  margin-bottom: 1.5rem;
  &.is-error {
    .g-input {
      border-color: #da4838;
    }
  }
  .content-wrapper {
    position: relative;
    .suffix {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      color: #c4c4c4;
    }
    .message {
      position: absolute;
      width: 100%;
      bottom: -15px;
      left: 0;
      visibility: hidden;
      transition: bottom 0.1s linear;
      &.is-show {
        bottom: -20px;
        visibility: visible;
      }
    }
    .error-message {
      color: #da4838;
    }
  }
}
</style>

<style lang="scss">
.g-form-item {
  &.is-error {
    .g-input {
      border-color: #da4838 !important;
    }
  }
}
</style>
