<template>
  <div
    class="top-area-container t-relative"
    :class="showAll && topAreas[this.tabActiveRight].length > 5 ? '' : 't-pr-4'"
  >
    <div
      class="top-area-title t-flex t-justify-between"
      :class="
        showAll && topAreas[this.tabActiveRight].length > 5 ? '' : 't-pr-4'
      "
    >
      <p class="t-text-lg t-pt-6"><b>TOP khu vực</b></p>
      <div class="flex t-justify-around ranking-toogle t-pt-1 t-mt-6">
        <!-- <div class="switch-toogle"></div> -->
        <div
          :class="tabActiveRight === 'top_selling' ? 'bggreen' : ''"
          v-on:click="toggleLineChart"
          tabIndex="1"
          class="top-sell-text"
        >
          Bán chạy
        </div>
        <div
          :class="tabActiveRight === 'return_rate' ? 'bgred' : ''"
          v-on:click="toggleLineChart"
          tabIndex="2"
          class="top-refund-text"
        >
          Hoàn cao
        </div>
      </div>
    </div>
    <div :class="showAll ? 'h-70 t-overflow-y-scroll t-pr-4' : ''">
      <template
        v-for="(area, index) in topAreas[this.tabActiveRight]"
        :key="area.text"
      >
        <div v-if="showAll || index < 5">
          <div v-if="loading" class="skeleton-fieldset">
            <g-skeleton-text :active="true" :width="'90%'" class="t-pl-4" />
            <g-skeleton-text :active="true" :width="'90%'" class="t-pl-4" />
            <g-skeleton-text :active="true" :width="'90%'" class="t-pl-4" />
          </div>
          <div v-else class="top-product-list">
            <div class="">
              <Area :type="tabActiveRight" :area="area" :rank="index + 1" />
            </div>
          </div>
          <div class="border-bottom-list"></div>
        </div>
      </template>
    </div>
    <p
      v-if="!showAll && topAreas[this.tabActiveRight].length > 5"
      @click="showAll = !showAll"
      class="t-text-primary t-mb-0 t-pb-4 t-text-base"
      style="display: flex; justify-content: flex-end; cursor: pointer"
    >
      <b>Xem tất cả</b>
    </p>
    <p
      v-if="showAll && topAreas[this.tabActiveRight].length > 5"
      @click="showAll = !showAll"
      :class="
        showAll && topAreas[this.tabActiveRight].length > 5 ? 't-pr-4' : ''
      "
      class="t-text-primary t-mb-0 t-pb-4 t-pt-4 t-text-base t-self-center"
      style="display: flex; justify-content: flex-end; cursor: pointer"
    >
      <b>Thu gọn</b>
    </p>
    <div
      v-if="topAreas[this.tabActiveRight].length === 0"
      class="t-w-full t-m-auto t-absolute t-top-1/2 t-text-center"
    >
      <p>Đang cập nhật dữ liệu</p>
    </div>
  </div>
</template>

<script>
import Area from "@/components/table/table-rank-area/Top-area-content-sale.vue";
import GSkeletonText from "@/components/elements/skeleton/text.vue";
import { mapState } from "vuex";

// import SwitchToogle from "@/components/table/table-rank-product/switch-toogle-ranking.vue";
// import RefundArea from "@/components/top-table/Top-area-content-refund.vue";

export default {
  components: {
    Area,
    GSkeletonText,
    // SwitchToogle,
    // RefundArea,
  },
  data() {
    return {
      tabActiveRight: "top_selling",
      loading: true,
      showAll: false,
    };
  },
  methods: {
    toggleLineChart() {
      this.tabActiveRight =
        this.tabActiveRight === "return_rate" ? "top_selling" : "return_rate";
      const range = this.$store.state.overview.query.range;
      if (this.topAreas[this.tabActiveRight].length === 0) {
        this.$store.dispatch("overview/getTopArea", {
          type: this.tabActiveRight,
          range: range,
        });
      }
    },
  },
  watch: {
    "$store.state.overview.query": {
      handler() {
        this.loading = true;
        this.$store.dispatch("overview/getTopArea");
        this.loading = false;
      },
      deep: true,
    },
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch("overview/getTopArea");
    this.loading = false;
  },
  computed: {
    ...mapState({
      topAreas: (state) => state.overview.topAreas,
    }),
  },
};
</script>
<style lang="scss" scoped>
.h-70 {
  height: 70vh !important;
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
.top-area-container {
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  flex-grow: 1;
  margin: 12px;
  padding-right: 16px;
  min-height: 677px;
}
.ranking-toogle {
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

  .fade-in {
    animation: animation-fade-in 0.3s ease-out 0.1s both;
  }

  .fade-in-reverse {
    animation: animation-fade-in-reverse 0.3s ease-out 0.1s both;
  }

  @keyframes animation-fade-in {
    0% {
      opacity: 1;
      transform: translateX(70px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes animation-fade-in-reverse {
    0% {
      opacity: 1;
      transform: translateX(-70px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
</style>
