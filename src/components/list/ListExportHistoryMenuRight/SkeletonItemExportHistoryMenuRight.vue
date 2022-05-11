<template>
  <div class="export-item pointer">
    <div class="export-item__title flex t-justify-between">
      <span><g-skeleton-text :active="true" :width="'200px'" /></span>
      <img class="ml" src="@/assets/icons/menu_right_submenu_right.svg" />
    </div>
    <div class="export-item__extra flex">
      <div class="extra-item">
        <g-skeleton-text :active="true" :width="'100px'" />
        <g-skeleton-text :active="true" :width="'100px'" />
      </div>
      <div class="extra-item">
        <g-skeleton-text :active="true" :width="'50px'" />
        <g-skeleton-text :active="true" :width="'50px'" />
      </div>
    </div>
  </div>
</template>

<script>
import { GSkeletonText } from "@/components/elements/skeleton";

export default {
  name: "ListExportHistoryMenuRightSkeleton",
  components: {
    GSkeletonText,
  },
  data() {
    return {
      listExports: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
      ],
    };
  },
};
</script>
