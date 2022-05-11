<template>
  <a-dropdown class="g-dropdown">
    <slot />
    <template #overlay>
      <slot name="GOverlay" />
    </template>
  </a-dropdown>
</template>

<script>
export default {
  name: "GDropdown",
};
</script>

<style scoped></style>
