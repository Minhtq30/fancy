<template>
  <div class="t-flex t-justify-between simple-action-skeleton">
    <div class="t-flex t-items-center">
      <span
        class="status-icon t-inline-block t-rounded-full t-w-[12px] t-h-[12px]"
      />
      <span class="ml medium-text">
        <g-skeleton-text :active="true" :width="'100px'" />
      </span>
      <span class="ml">
        <g-skeleton-text :active="true" :width="'200px'" />
      </span>
    </div>
    <span>
      <g-skeleton-text :active="true" :width="'40px'" />
    </span>
  </div>
</template>

<script>
import { GSkeletonText } from "@/components/elements/skeleton";

export default {
  name: "SimpleProductActionSkeleton",
  components: {
    GSkeletonText,
  },
};
</script>

<style lang="scss" scoped>
.simple-action-skeleton {
  line-height: 20px;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  .status-icon {
    background-color: var(--grayColor);
  }
}
</style>
