<template>
  <div
    class="product-image-wrapper flex t-flex-col t-w-[400px] t-m-auto t-relative t-items-center t-justify-between"
  >
    <img
      class="image-controls prev pointer t-absolute t-left-0 t-top-1/2"
      :class="{ 'is-disabled': currentIndex === 0 }"
      src="@/assets/icons/prev_image_slide.png"
      @click="handlePrev"
    />
    <div class="list-images">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="slide-item pointer"
        :class="{
          ['left-1']: index === currentIndex - 1,
          ['right-1']: index === currentIndex + 1,
          ['current']: index === currentIndex,
        }"
        @click="handleSetCurrent(index)"
      >
        <image-preload class="default-image" />
        <div
          class="content-image"
          :style="{ backgroundImage: `url(${image})` }"
        />
      </div>
    </div>
    <div class="list-nodes flex">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="node-for-image t-rounded-full pointer"
        :class="{
          'is-active': index === currentIndex,
        }"
        @click="handleSetCurrent(index)"
      />
    </div>
    <img
      class="image-controls next pointer t-absolute t-right-0 t-top-1/2"
      :class="{ 'is-disabled': currentIndex === images.length - 1 }"
      src="@/assets/icons/next_image_slide.png"
      @click="handleNext"
    />
  </div>
</template>

<script>
import { ImagePreload } from "@/components/elements";

export default {
  name: "ProductImageSlide",
  props: ["images"],
  components: {
    ImagePreload,
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    handlePrev() {
      if (this.currentIndex === 0) return;
      this.currentIndex = this.currentIndex - 1;
    },
    handleNext() {
      if (this.currentIndex === this.images.length - 1) return;
      this.currentIndex = this.currentIndex + 1;
    },
    handleSetCurrent(_index) {
      this.currentIndex = _index;
    },
  },
  watch: {
    images() {
      this.currentIndex = this.images.length >= 3 ? 1 : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-image-wrapper {
  height: 183px;
  .list-images {
    height: 159px;
    position: relative;
    perspective: 1000px;
    display: flex;
    justify-content: center;
    .slide-item {
      position: absolute;
      width: 159px;
      height: 100%;
      transition: transform 0.4s ease;
      overflow: hidden;
      visibility: hidden;
      border-radius: 6px;
      .default-image {
        position: absolute;
        z-index: -1;
      }
      .content-image {
        width: 159px;
        height: 159px;
        background-size: cover;
        background-position: center;
      }
    }
    .left-1 {
      transform: translateX(-100px) translateZ(-250px) rotateY(35deg);
      visibility: visible;
      opacity: 0.65;
    }
    .right-1 {
      transform: translateX(100px) translateZ(-250px) rotateY(35deg);
      visibility: visible;
      opacity: 0.65;
    }
    .current {
      transform: none;
      z-index: 1;
      visibility: visible;
    }
  }
  .list-nodes {
    .node-for-image {
      width: 8px;
      height: 8px;
      background-color: #bdbdbb;
      margin: 0 4px;
      &.is-active {
        background-color: var(--primaryColor);
      }
    }
  }
  .image-controls {
    transition: 0.2s linear;
    transform: translateY(-50%);
    &.is-disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
  }
}
</style>
