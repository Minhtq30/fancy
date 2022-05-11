<template>
  <div class="info-metric-action">
    <div class="flex t-justify-between info-metric-action__header t-pb-4">
      <span class="medium-text">Cập nhật</span>
      <div class="flex t-items-center list-tabs">
        <div class="tab-item pointer" @click="handleSetTabAction('action')">
          <span :class="{ 'primary-text medium-text': tabAction === 'action' }">
            Hoạt động
          </span>
        </div>
        <div class="tab-split t-mx-4" />
        <div class="tab-item pointer" @click="handleSetTabAction('export')">
          <span :class="{ 'primary-text medium-text': tabAction === 'export' }">
            Xuất, nhập
          </span>
        </div>
      </div>
    </div>
    <list-product-action
      v-show="tabAction === 'action'"
      :productId="product?.product_id"
    />
    <list-product-export
      v-show="tabAction === 'export'"
      :productId="product?.product_id"
      :tab="tabAction"
      :maxHeight="'max-height: calc(85vh - 400px)'"
    />
  </div>
</template>

<script>
import ListProductAction from "./ListProductAction.vue";
import ListProductExport from "./ListProductExport.vue";

export default {
  name: "ProductMetricAction",
  props: ["product", "visible", "tabAction", "setTabAction"],
  components: {
    ListProductExport,
    ListProductAction,
  },
  methods: {
    handleSetTabAction(_tabAction) {
      this.setTabAction(_tabAction);
    },
  },
  watch: {
    visible(_visible) {
      if (!_visible) {
        this.setTabAction("action");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.info-metric-action {
  width: calc(100% + 2rem);
  transform: translateX(-1rem);
  padding: 1rem 1rem 0 1rem;
  border-top: 2px solid #e0e0e0;
  &__header {
    .list-tabs {
      .tab-split {
        width: 1px;
        height: 1rem;
        background-color: #e0e0e0;
      }
    }
  }
}
</style>
