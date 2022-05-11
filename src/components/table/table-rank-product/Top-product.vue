<template>
  <div
    class="top-product-container t-relative"
    :class="
      showAll && topProducts[this.tabActiveLeft].length > 5 ? '' : 't-pr-4'
    "
  >
    <div
      class="top-product-title t-flex t-justify-between"
      :class="
        showAll && topProducts[this.tabActiveLeft].length > 5 ? 't-pr-4' : ''
      "
    >
      <p class="t-text-lg t-pt-6"><b>TOP sản phẩm</b></p>
      <div class="flex t-justify-around ranking-toggle t-pt-1 t-mt-6">
        <p
          :class="tabActiveLeft === 'top_selling' ? 'bggreen' : ''"
          v-on:click="toggleLineChart"
          tabIndex="1"
          class="top-sell-text"
        >
          Bán chạy
        </p>
        <p
          :class="tabActiveLeft === 'return_rate' ? 'bgred' : ''"
          v-on:click="toggleLineChart"
          tabIndex="2"
          class="top-refund-text"
        >
          Hoàn cao
        </p>
      </div>
    </div>
    <div :class="showAll ? 'h-70 t-overflow-y-scroll t-pr-4' : ''">
      <template
        v-for="(product, index) in topProducts[this.tabActiveLeft]"
        :key="product.id"
      >
        <div v-if="showAll || index < 5">
          <div v-if="loading" class="skeleton-fieldset">
            <g-skeleton-text :active="true" :width="'90%'" class="t-pl-16" />
            <g-skeleton-text
              avatar
              :active="true"
              :width="'90%'"
              class="t-pl-2"
            />
            <g-skeleton-text :active="true" :width="'90%'" class="t-pl-16" />
          </div>
          <div v-else class="top-product-list">
            <div class="">
              <Product
                :type="tabActiveLeft"
                :product="product"
                :rank="index + 1"
              />
            </div>
          </div>
          <div class="border-bottom-list"></div>
        </div>
      </template>
    </div>
    <p
      v-if="!showAll && topProducts[this.tabActiveLeft].length > 5"
      @click="showAll = !showAll"
      :class="
        showAll && topProducts[this.tabActiveLeft].length > 5 ? 't-pr-4' : ''
      "
      class="t-text-primary t-mb-0 t-pb-4 t-text-base t-self-center"
      style="display: flex; justify-content: flex-end; cursor: pointer"
    >
      <b>Xem tất cả</b>
    </p>
    <p
      v-if="showAll && topProducts[this.tabActiveLeft].length > 5"
      @click="showAll = !showAll"
      :class="
        showAll && topProducts[this.tabActiveLeft].length > 5 ? 't-pr-4' : ''
      "
      class="t-text-primary t-mb-0 t-pb-4 t-pt-4 t-text-base t-self-center"
      style="display: flex; justify-content: flex-end; cursor: pointer"
    >
      <b>Thu gọn</b>
    </p>
    <div
      v-if="topProducts[this.tabActiveLeft].length === 0"
      class="t-w-full t-m-auto t-absolute t-top-1/2 t-text-center"
    >
      <p>Đang cập nhật dữ liệu</p>
    </div>
  </div>
</template>

<script>
import Product from "@/components/table/table-rank-product/Top-product-content-sale.vue";
import GSkeletonText from "@/components/elements/skeleton/text.vue";
import { mapState } from "vuex";

// import Refund from "@/components/top-table/Top-product-content-refund.vue";

export default {
  components: {
    Product,
    // SwitchToogle,
    GSkeletonText,
    // Refund,
  },
  data() {
    return {
      tabActiveLeft: "top_selling",
      loading: true,
      showAll: false,
    };
  },
  methods: {
    toggleLineChart() {
      this.tabActiveLeft =
        this.tabActiveLeft === "return_rate" ? "top_selling" : "return_rate";
      const range = this.$store.state.overview.query.range;
      if (this.topProducts[this.tabActiveLeft].length === 0) {
        this.$store.dispatch("overview/getTopProduct", {
          type: this.tabActiveLeft,
          range: range,
        });
      }
    },
  },
  watch: {
    "$store.state.overview.query": {
      handler() {
        this.loading = true;
        this.$store.dispatch("overview/getTopProduct");
        this.loading = false;
      },
      deep: true,
    },
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch("overview/getTopProduct");
    this.loading = false;
  },
  computed: {
    ...mapState({
      topProducts: (state) => state.overview.topProducts,
    }),
  },
};
</script>

<style lang="scss" scoped>
.h-70 {
  height: 70vh !important;
}
.top-product-container {
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  flex-grow: 1;
  margin: 12px;
  min-height: 677px;
}
.change-rate-product {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -38px;
}
.border-bottom-list {
  width: 100%;
  height: 1px;
  margin-top: 16px;
  margin-bottom: 16px;
  background-color: #e0e0e0;
}
b {
  font-weight: 500;
}
.ranking-toggle {
  width: 180px;
  height: 36px;
  box-sizing: border-box;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  border-radius: 100px;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  .top-sell-text {
    width: 84px;
    height: 28px;
    box-sizing: border-box;
    text-align: center;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
    border-radius: 100px;
    display: flex;
    justify-content: center;
  }
  .top-refund-text {
    width: 84px;
    height: 28px;
    box-sizing: border-box;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
    text-align: center;
    border-radius: 100px;
    display: flex;
    justify-content: center;
  }
  .bggreen {
    width: 84px;
    height: 28px;
    background-color: #069255;
    color: #fff;
    box-sizing: border-box;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
    border-radius: 100px;
    display: flex;
    justify-content: center;
  }
  .bgred {
    width: 84px;
    height: 28px;
    background-color: #da4838;
    color: #fff;
    box-sizing: border-box;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
    border-radius: 100px;
    display: flex;
    justify-content: center;
  }

  @keyframes animation-fade-in {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
