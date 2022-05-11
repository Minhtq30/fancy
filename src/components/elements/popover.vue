<template>
  <a-popover>
    <slot />
    <template #content>
      <slot name="content" />
    </template>
  </a-popover>
</template>

<script>
export default {
  name: "GPopover",
};
</script>

<style scoped></style>
