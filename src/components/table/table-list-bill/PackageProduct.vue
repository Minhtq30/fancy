<template>
  <div v-if="isLoading">
    <g-skeleton-text :active="true" :width="'30%'" />
    <g-skeleton-text :active="true" />
  </div>
  <div v-else>
    <div class="bill-product">
      <div v-for="(product, index) in packageDetail.product" :key="index">
        <div class="bill-product-info t-pb-[10px]">
          <span> {{ index + 1 }}. {{ product.product_name }} </span>
          <div class="t-flex">
            <span
              >SL: {{ product.quantity }} | KL: {{ product.weight }} kg
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bill-product-total-weight t-pt-[10px]">
      Tổng KL:
      {{ calculateTotalWeight(packageDetail.product) }}
      kg
    </div>
  </div>
</template>

<script>
import { GSkeletonText } from "@/components/elements/skeleton";
export default {
  props: ["packageDetail", "isLoading"],
  components: {
    GSkeletonText,
  },
  methods: {
    calculateTotalWeight(product) {
      let totalWeight = 0;
      if (product) {
        for (let i = 0; i < product.length; i++) {
          totalWeight += product[i].quantity * product[i].weight;
        }
      }
      return totalWeight;
    },
  },
};
</script>

<style scoped>
.bill-product {
  border-bottom: 1px solid #e0e0e0;
}
</style>
