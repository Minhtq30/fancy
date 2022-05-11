<template>
  <div class="t-text-black t-text-[16px] t-p-[24px] t-pb-0 t-overflow-y-auto">
    <div class="t-h-[643px]">
      <div
        v-for="(child, index) in localChildren"
        :key="index"
        class="t-text-black t-h-[138px] t-border-b t-mb-[24px] add-product-modal-property"
      >
        <div class="t-text-[18px] t-font[500] t-mb-[10px]">
          SKU #{{ index + 1 }}
        </div>
        <div class="t-flex t-mb-[24px]">
          <div class="t-flex-none t-w-[80px] t-h-[80px]">
            <img
              class="t-w-full"
              :width="80"
              :height="80"
              :src="
                child.images_file[0]
                  ? child.images_file[0]
                  : productDefaultImage
              "
            />
          </div>
          <div
            class="t-text-[16px] t-flex-auto t-h-[80px] t-pl-[26px] t-grid t-grid-rows-3"
          >
            <div>
              {{ child.full_name }}
            </div>
            <div>Khối Lượng : {{ child.weigh.label }} Kg</div>
            <div>
              Giá bán : {{ $filters.numberFormatter(child.retail_prices) }} đ |
              Giá gốc : {{ $filters.numberFormatter(child.cost) }} đ
            </div>
          </div>
          <div class="t-flex t-cursor-pointer">
            <svg
              @click="
                localChildren[0].characteristics.length != 0
                  ? $emit('getChildDetail', child)
                  : $emit('back')
              "
              width="10"
              height="17"
              viewBox="0 0 10 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.791834 16.7062C0.698707 16.6133 0.624821 16.503 0.574409 16.3815C0.523996 16.26 0.498047 16.1297 0.498047 15.9982C0.498047 15.8667 0.523996 15.7364 0.574408 15.6149C0.624821 15.4935 0.698707 15.3831 0.791834 15.2902L7.08584 8.99821L0.791833 2.70621C0.60406 2.51844 0.49857 2.26376 0.49857 1.99821C0.49857 1.73266 0.60406 1.47799 0.791833 1.29021C0.979607 1.10244 1.23428 0.99695 1.49983 0.99695C1.76539 0.99695 2.02006 1.10244 2.20783 1.29021L9.20784 8.29021C9.30096 8.3831 9.37485 8.49345 9.42526 8.61494C9.47567 8.73643 9.50162 8.86668 9.50162 8.99821C9.50162 9.12975 9.47567 9.25999 9.42526 9.38148C9.37485 9.50297 9.30096 9.61332 9.20784 9.70621L2.20783 16.7062C2.11494 16.7993 2.00459 16.8732 1.8831 16.9236C1.76161 16.9741 1.63137 17 1.49983 17C1.3683 17 1.23806 16.9741 1.11657 16.9236C0.995077 16.8732 0.884725 16.7993 0.791834 16.7062Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="add-product-modal-action t-flex t-justify-between t-items-center t-p-[24px]"
  >
    <button
      @click="this.$emit('addProduct')"
      class="t-bg-[#00904A] t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-h-[40px] t-p-0 t-w-full t-text-[16px] t-font-medium t-text-[#fff]"
    >
      Tạo {{ localChildren.length }} sản phẩm
    </button>
  </div>
</template>

<script>
import productDefaultImage from "@/assets/images/default_product.svg";
export default {
  props: {
    children: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    for (let i = 0; i < this.children.length; i++) {
      this.localChildren[i].images = [];
      for (let j = 0; j < this.children[i].images.length; j++) {
        this.localChildren[i].images.push(this.children[i].images[j]);
      }
    }
  },
  data() {
    return {
      localChildren: JSON.parse(JSON.stringify(this.children)),
      productDefaultImage,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-product-modal {
  .add-product-modal-property {
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>
