<template>
  <div class="top-product-wrapper">
    <table class="w-100 g-table">
      <thead>
        <tr>
          <th class="medium-text t-w-[600px]">Sản phẩm</th>
          <th class="medium-text t-text-right">Tương tác</th>
          <th class="medium-text t-text-right">Đặt mua</th>
          <th class="medium-text t-text-right">Đã bán</th>
          <th class="medium-text t-text-right">Đã hoàn</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in topProduct" :key="index">
          <td class="top-product-item t-flex t-items-center t-break-words">
            <div class="ranking t-w-[80px] t-h-[42px] t-text-center">
              <h1
                :class="
                  typeActive === 'top_selling'
                    ? 't-mb-1 rank-green'
                    : 't-mb-1 rank-red'
                "
              >
                <b class="ranking-number t-pr-2 t-pb-4">{{
                  index + 1 + page_size * (page - 1)
                }}</b>
              </h1>
            </div>
            <div class="top-product-item__img t-w-[64px] t-h-[64px] t-bg-white">
              <img
                v-if="product.images.length !== 0"
                class="t-w-full"
                :src="product.images[0]"
                :width="64"
                :height="64"
              />
              <img
                v-else
                class="t-w-full"
                :width="64"
                :height="64"
                src="@/assets/images/default_product.svg"
              />
            </div>
            <span class="top-product-item__name t-w-[400px] t-pl-4">{{
              product.product_name
            }}</span>
          </td>
          <td class="top-product-item-total_interactive t-text-right">
            <div>
              <div class="top-product-item__number">
                <info-fieldset :currentValue="product.total_interactive" />
              </div>
              <!--              <div class="top-product-item__plus">-->
              <!--                              +<format-price :value="product.total_interactive" />-->
              <!--              </div>-->
            </div>
          </td>
          <td class="top-product-item-order t-text-right">
            <div class="top-product-item__number">
              <info-fieldset :currentValue="product.total_order" />
            </div>
            <!--            <div class="top-product-item__plus">-->
            <!--              +<format-price :value="product.total_order" />-->
            <!--            </div>-->
          </td>
          <td class="top-product-item-export t-text-right">
            <div class="top-product-item__number">
              <info-fieldset :currentValue="product.total_sell" />
            </div>
            <!--            <div class="top-product-item__plus">-->
            <!--              + <format-price :value="product.total_sell" />-->
            <!--            </div>-->
          </td>
          <td class="top-product-item-order t-text-right">
            <div class="top-product-item__number">
              <info-fieldset :currentValue="product.total_refund" />
            </div>
            <!--            <div class="top-product-item__plus">-->
            <!--              +<format-price :value="product.total_refund" />-->
            <!--            </div>-->
          </td>
        </tr>
        <tr v-if="topProduct.length === 0 && !loading">
          <td colspan="5">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="pagination-wrapper flex align-items-center justify-content-space-between t-px-[15px]"
    >
      <div>
        <span class="description-limit">Số lượng bản ghi/trang</span>
        <g-select
          :disabled="loading"
          class="page-limit"
          :value="page_size.toString()"
          :default-active-first-option="false"
          @change="onChangeLimit"
        >
          <a-select-option value="25">25</a-select-option>
          <a-select-option value="50">50</a-select-option>
          <a-select-option value="100">100</a-select-option>
        </g-select>
        Trang {{ page }}/{{ totalPages }}
        <g-button
          :disabled="loading || page === 1"
          class="ml btn-prev-page"
          @click="changePage(page - 1)"
        >
          <span>Trang trước</span>
        </g-button>
        <g-button
          :disabled="loading || page === totalPages"
          class="ml btn-next-page"
          @click="changePage(page + 1)"
        >
          <span>Trang sau</span>
        </g-button>
      </div>
      <div class="actions-wrapper">
        <g-multiselect placement="topRight">
          <template #contentDropdown>
            <g-button
              id="btn-import-export-product"
              class="primary ml t-rounded-[5px] t-py-[7px] t-px-[40px] t-bg-[#00904A] t-text-[#fff] t-ml-[15px] t-font-medium"
            >
              Thao tác
            </g-button>
          </template>
          <template #contentOption>
            <div class="list-request-wrapper">
              <div
                class="request-item primary-text t-flex t-items-center"
                @click="openModal(true)"
              >
                <svg
                  class="t-mr-[5px] t-mb-[2px]"
                  width="18"
                  height="20"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5003 9.83341L8.16699 6.50008V9.00008H0.666992V10.6667H8.16699V13.1667L11.5003 9.83341ZM17.3337 9.00008H15.667V16.5001H2.33366V12.3334H4.00033V14.8334H14.0003V8.16675L9.00033 3.16675L4.83366 7.33341H2.33366L9.00033 0.666748L17.3337 9.00008Z"
                    fill="#069255"
                  />
                </svg>
                Nhập
              </div>
              <div
                class="request-item primary-text t-flex t-items-center"
                @click="openModal(false)"
              >
                <svg
                  class="t-mr-[5px] t-mb-[2px]"
                  width="20"
                  height="18"
                  viewBox="0 0 20 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 9.83342L16.6667 6.50008V9.00008H9.16667V10.6667H16.6667V13.1667L20 9.83342ZM15 12.3334V16.5001H1.66667V9.00008H0L8.33333 0.666748L15 7.33342H12.5L8.33333 3.16675L3.33333 8.16675V14.8334H13.3333V12.3334H15Z"
                    fill="#069255"
                  />
                </svg>
                Xuất
              </div>
            </div>
          </template>
        </g-multiselect>
      </div>
    </div>
    <import-export-product-warehouse-modal
      :isVisible="showModal"
      :isImport="isImport"
      :setIsVisible="setIsVisible"
    />
  </div>
</template>

<script>
import GButton from "@/components/elements/button.vue";
import { GSelect } from "@/components/elements";
import GMultiselect from "@/components/base/Multiselect";
import { mapState } from "vuex";
import ImportExportProductWarehouseModal from "@/components/modal/ImportExportProductWarehouseModal/index.vue";
import InfoFieldset from "@/components/fieldset/Info-fieldset";

export default {
  props: [
    "loading",
    "typeActive",
    "handleChangePage",
    "handleChangeLimit",
    "totalPages",
    "page",
    "page_size",
  ],
  components: {
    InfoFieldset,
    GButton,
    GSelect,
    GMultiselect,
    ImportExportProductWarehouseModal,
  },
  mounted() {},
  computed: {
    ...mapState({
      topProduct: (state) => state.warehouse.productList.products,
      paging: (state) => state.warehouse.productList.paging,
    }),
  },
  data() {
    return {
      showModal: false,
      isImport: false,
    };
  },
  methods: {
    confirmCloseModal() {
      this.showModal = false;
    },
    openModal(isImport) {
      const btn = document.getElementById("btn-import-export-product");
      if (btn) btn.click();
      this.showModal = true;
      this.isImport = isImport;
    },
    changePage(page) {
      this.handleChangePage(page);
    },
    onChangeLimit(page_size) {
      this.handleChangeLimit(page_size);
    },
    setIsVisible(visible) {
      this.showModal = visible;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .top-product-item__number {
    .info-fieldset {
      display: grid;
      padding-top: 0px;
      span {
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
}
.top-product-wrapper {
  table {
    thead {
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 1;
    }
  }
  height: calc(100vh - 260px);
  overflow-y: auto;
  .top-product-item__number {
    font-size: 16px;
    line-height: 20px;
  }
  .top-product-item__plus {
    font-size: 14px;
    line-height: 20px;
    color: #00904a;
  }
  .top-product-item__img {
    img {
      height: 100%;
      -o-object-fit: cover;
      object-fit: cover;
      width: 100%;
    }
  }
  .rank-green {
    -webkit-text-stroke-color: #069255;
  }
  .ranking-number {
    font-family: Roboto;
    font-style: normal;
    color: #fff;
    -webkit-text-stroke-width: 2px;
    flex: none;
    order: 0;
    flex-grow: 0;
    font-size: 40px;
    line-height: 40px;
  }
  .rank-red {
    -webkit-text-stroke-color: #eb5757;
  }
  .pagination-wrapper {
    background-color: #ffffff;
    height: 60px;
    border: 1px solid var(--grayColor);
    width: calc(100% - 30px);
    position: absolute;
    bottom: 0;
    .description-limit {
      display: none;
    }
    .g-select.page-limit {
      width: 70px;
    }
    @media only screen and (min-width: 1600px) {
      .description-limit {
        display: inline-block;
        margin-right: 0.5rem !important;
      }
    }
  }
  #btn-import-export-product {
    height: 40px;
    width: 140px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
