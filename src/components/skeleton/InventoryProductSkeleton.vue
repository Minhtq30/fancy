<template>
  <div class="flex t-items-center inventory-product-skeleton">
    <div class="t-mr-5">
      <g-skeleton-image
        class="circle"
        :active="true"
        :width="40"
        :height="40"
      />
    </div>
    <div class="t-flex t-justify-between t-items-center w-100">
      <div class="t-flex-1">
        <p>
          <g-skeleton-text :active="true" class="no-margin" :width="'300px'" />
        </p>
        <g-skeleton-text :active="true" class="no-margin" :width="'100px'" />
      </div>
      <g-skeleton-button
        :active="true"
        class="skeleton-item__button is-squared"
      />
    </div>
  </div>
</template>

<script>
import {
  GSkeletonText,
  GSkeletonImage,
  GSkeletonButton,
} from "@/components/elements/skeleton";

export default {
  name: "InventoryProductSkeleton",
  components: {
    GSkeletonText,
    GSkeletonImage,
    GSkeletonButton,
  },
};
</script>

<style lang="scss">
.inventory-product-skeleton {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 15px;
  height: 79px;
  .skeleton-item__button {
    width: 77px;
    .ant-skeleton-avatar {
      border-radius: 4px !important;
    }
  }
}
</style>
