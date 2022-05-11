<template>
  <div class="flex t-pt-4 t-pl-4 t-items-center">
    <div class="">
      <g-skeleton-text :active="true" :width="'60%'" />
    </div>

    <span class="flex t-pl-2 align-items-center">
      <g-skeleton-text :active="true" :width="'80%'"
    /></span>
    <span class="t-pl-4">
      <g-skeleton-text :active="true" :width="'80%'" />
    </span>
  </div>
</template>

<script>
import GSkeletonText from "@/components/elements/skeleton/text.vue";
export default {
  components: {
    GSkeletonText,
  },
};
</script>
<style></style>
