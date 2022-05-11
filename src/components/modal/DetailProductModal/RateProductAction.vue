<template>
  <div class="t-flex rate-action">
    <div class="mr">
      <like-shop-info-icon
        v-if="event.review?.is_good_review"
        :width="44"
        :height="44"
      />
      <unlike-shop-info-icon v-else :width="44" :height="44" />
    </div>
    <div class="t-flex-1">
      <div class="flex t-justify-between">
        <div>
          <flag-icon
            :fill="event.review?.is_good_review ? '#069255' : '#DA4838'"
          />
          <span class="medium-text ml">{{ event?.customer?.full_name }}</span>
          <span>
            {{
              event.review?.is_good_review
                ? " hài lòng shop"
                : " không hài lòng shop"
            }}:
          </span>
        </div>
        <span class="action-time t-text-sm">
          <i>{{ createdAt }}</i>
        </span>
      </div>
      <div>
        <span>{{ event.review?.reason }}</span>
      </div>
      <div class="t-flex t-mt-1 image-feedbacks t-flex-wrap">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="t-relative t-rounded t-w-[64px] t-h-[64px] mr mb image-feedbacks-item"
        >
          <image-preload class="default-review-image" />
          <div
            class="t-bg-cover t-bg-center t-w-[64px] t-h-[64px]"
            :style="{ backgroundImage: `url(${image})` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikeShopInfoIcon from "@/components/icons/LikeShopInfoIcon.vue";
import UnlikeShopInfoIcon from "@/components/icons/UnlikeShopInfoIcon.vue";
import ImagePreload from "@/components/elements/image-preload.vue";
import { formatCreatedEventProduct } from "@/utils/date";
import { FlagIcon } from "@/components/icons";

export default {
  name: "RateProductAction",
  props: ["event"],
  components: {
    LikeShopInfoIcon,
    UnlikeShopInfoIcon,
    FlagIcon,
    ImagePreload,
  },
  computed: {
    images() {
      return this.event.review?.images || [];
    },
    createdAt() {
      return formatCreatedEventProduct(this.event?.created_ts);
    },
  },
};
</script>

<style lang="scss" scoped>
.rate-action {
  line-height: 20px;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  .action-time {
    color: #808080;
  }
  .default-review-image {
    z-index: -1;
    position: absolute !important;
  }
}
</style>
