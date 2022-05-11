<template>
  <div class="t-flex rate-action">
    <div class="mr">
      <g-skeleton-image
        class="circle"
        :active="true"
        :width="44"
        :height="44"
      />
    </div>
    <div class="t-flex-1">
      <div class="flex t-justify-between">
        <div class="t-flex">
          <img src="@/assets/icons/flag_active.svg" />
          <span class="medium-text ml">
            <g-skeleton-text :active="true" :width="'80px'" />
          </span>
          <span class="ml">
            <g-skeleton-text :active="true" :width="'120px'" />
          </span>
        </div>
        <span class="action-time t-text-sm">
          <g-skeleton-text :active="true" :width="'40px'" />
        </span>
      </div>
      <div>
        <span><g-skeleton-text :active="true" :width="'250px'" /></span>
      </div>
      <div class="t-flex t-mt-1 image-feedbacks">
        <div class="t-rounded t-w-[64px] t-h-[64px] mr mb">
          <image-preload />
        </div>
        <div class="t-rounded t-w-[64px] t-h-[64px] mr mb">
          <image-preload />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
import ImagePreload from "@/components/elements/image-preload.vue";

export default {
  name: "RateProductActionSkeleton",
  components: {
    GSkeletonImage,
    GSkeletonText,
    ImagePreload,
  },
};
</script>

<style lang="scss" scoped>
.rate-action {
  line-height: 20px;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}
</style>
