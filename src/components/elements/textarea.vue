<template>
  <a-textarea @input="changeTextArea()" class="g-textarea">
    <slot />
  </a-textarea>
</template>

<script>
export default {
  name: "GTextarea",
  methods: {
    changeTextArea() {
      this.$emit("input-change");
    },
  },
};
</script>

<style lang="scss">
.g-textarea {
  &:focus,
  &:hover {
    border-color: var(--primaryColor);
    box-shadow: none;
  }
  border-radius: 5px;
}
</style>
