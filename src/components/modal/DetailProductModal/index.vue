<template>
  <div>
    <g-modal
      :visible="visible"
      :footer="null"
      :centered="true"
      :width="535"
      :title="'Chi tiết sản phẩm'"
      :class="{ 'has-header-right': tabAction === 'export' }"
      @cancel="handleCancel"
    >
      <template v-if="tabAction === 'export'" #headerRight>
        <list-action-product
          :loadingGetDetail="loadingGetDetail"
          :product="productDetail"
          :handleCancel="handleCancel"
          :selectedWarehouses="selectedWarehouses"
          :setVisibleEditModal="setVisibleEditModal"
          :updateInventory="updateInventory"
        />
      </template>
      <div class="detail-product-modal-wrapper">
        <product-image-slide :images="productImages" />
        <div class="product-info mt-1">
          <div class="flex t-justify-between t-pb-4 info-title">
            <span class="info-title__name">
              {{ productDetail.product_name }}
            </span>
            <div class="pointer flex" @click="openEditModal">
              <span class="flex t-items-center ml info-title__price">
                <format-price :value="productDetail?.retail_prices || 0" /> đ
              </span>
              <img
                class="ml t-w-[7px]"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div>
          </div>
          <product-metric :product="productDetail" />
          <product-metric-action
            :tabAction="tabAction"
            :setTabAction="setTabAction"
            :visible="visible"
            :product="productDetail"
          />
        </div>
      </div>
    </g-modal>
    <edit-product-modal
      :productId="productDetail.product_id"
      :visible="visibleEditModal"
      :setVisible="setVisibleEditModal"
      :fullInfoProductDetail="fullInfoProductDetail"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import FormatPrice from "@/components/FormatPrice.vue";
import GModal from "../../elements/modal.vue";
import ProductImageSlide from "./ProductImageSlide.vue";
import ProductMetric from "./ProductMetric.vue";
import ProductMetricAction from "./ProductMetricAction.vue";
import ListActionProduct from "./ListActionProduct.vue";
import EditProductModal from "../WareHouseModal/EditProductModal.vue";
import wareHouseService from "@/services/warehouse.service";

export default {
  name: "DetailProductModal",
  props: [
    "selectedProduct",
    "visible",
    "setVisible",
    "setSelectedProduct",
    "selectedWarehouses",
  ],
  components: {
    GModal,
    ProductImageSlide,
    ProductMetric,
    ProductMetricAction,
    FormatPrice,
    ListActionProduct,
    EditProductModal,
  },
  data() {
    return {
      visibleEditModal: false,
      loadingGetDetail: false,
      tabAction: "action",
      productDetail: {},
      fullInfoProductDetail: null,
    };
  },
  computed: {
    ...mapState({
      shopInfo: (state) => state.shop.Shop,
    }),
    productImages() {
      const images = this.productDetail?.images || [];
      if (images.length === 0) return [""];
      return images;
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
      this.setSelectedProduct({});
    },
    setTabAction(_tabAction) {
      this.tabAction = _tabAction;
    },
    openEditModal() {
      this.visibleEditModal = true;
    },
    setVisibleEditModal(_visible) {
      this.visibleEditModal = _visible;
    },
    updateInventory(totalInventory = 0) {
      this.productDetail = {
        ...this.productDetail,
        total_inventory:
          (this.productDetail?.total_inventory || 0) + totalInventory,
      };
    },
    async getDetail(productId) {
      this.loadingGetDetail = true;
      try {
        const response = await wareHouseService.getProductDetailId(productId);
        if (response?.data?.success) {
          this.fullInfoProductDetail = response?.data?.data;
          this.productDetail = {
            ...this.productDetail,
            stations: response?.data?.data?.stations || [],
          };
        }
      } catch (error) {
        console.error(error);
      }
      this.loadingGetDetail = false;
    },
  },
  watch: {
    selectedProduct(_selectedProduct) {
      this.productDetail = _selectedProduct;
      if (_selectedProduct.product_id) {
        this.getDetail(_selectedProduct.product_id);
      }
    },
    visible(_visible) {
      if (!_visible) {
        this.fullInfoProductDetail = null;
        this.productDetail = {};
        this.tabAction = "action";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-product-modal-wrapper {
  max-height: 85vh;
  color: #000 !important;
  .product-info {
    .info-title {
      border-bottom: 1px solid #e0e0e0;
      &__name {
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-height: 20px;
        max-height: 40px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      &__price {
        color: #eb5757;
      }
    }
  }
}
</style>

<style lang="scss">
.detail-product-modal-wrapper {
  .ant-skeleton {
    display: flex !important;
    align-items: center !important;
    height: 20px;
  }
}
.header-right-detail-modal {
  position: absolute;
  top: 0;
  right: 1rem;
  &__title {
    height: 54px;
    line-height: 54px;
    color: #fff;
  }
  &__overlay {
    width: 259px;
    .overlay-item {
      padding: 10px;
      img {
        width: 24px;
      }
      &__description {
        color: #808080;
      }
      &:not(:last-child) {
        border-bottom: 1px solid var(--grayColor);
      }
    }
  }
}
</style>
