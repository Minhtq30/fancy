<template>
  <div class="import-export-modal">
    <div class="product_top_filter">
      <div class="t-flex t-p-5 t-py-2 t-pt-4">
        <a-col :span="6">
          <p class="t-text-base t-leading-8">
            {{ isImport ? "Kho nhập" : "Kho xuất" }}
          </p>
        </a-col>
        <a-col :span="18">
          <g-dropdown-select
            :placeholder="'Kho hàng'"
            :options="options.pick_address_id"
            :value="filter.pick_address_id"
            :onChange="handleChangeStoreage"
          />
        </a-col>
      </div>
      <div v-if="!isImport" class="t-flex t-p-5 t-py-2">
        <a-col :span="6">
          <p class="t-text-base t-leading-8">Kho nhập</p>
        </a-col>
        <a-col :span="18">
          <g-dropdown-select
            :placeholder="'Kho hàng'"
            :options="options.pick_address_id"
            :value="filter.pick_address_id"
            :onChange="handleChangeStoreage"
          />
        </a-col>
      </div>
      <div class="t-flex t-p-5 t-py-2">
        <a-col :span="6">
          <p class="t-text-base t-leading-8">Sản phẩm</p>
        </a-col>
        <a-col :span="18" class="top-input-search">
          <g-input
            :borderless="false"
            placeholder="Nhập tên sản phẩm để tìm kiếm"
            v-model:model-value="productTerm"
            @input-change="debounceSearchProductByName"
            class="input-search"
          />
          <img src="@/assets/icons/search_active.svg" />
        </a-col>
      </div>
    </div>
    <p
      class="t-p-5 t-text-base t-leading-5 t-font-medium t-pb-0 product_mid_text"
    >
      Bấm để chọn sản phẩm cần nhập
    </p>
    <div class="t-flex t-flex-col t-p-0 product_mid__item">
      <div class="product-list">
        <div
          v-for="product in listExistedProduct"
          :key="product.product_id"
          class="product-item t-flex t-cursor-pointer t-items-center t-flex-row"
          @click="(e) => onClickExistedProduct(e, product)"
        >
          <div
            v-if="!product.isSelected"
            @click="onClickExistedProduct(product)"
            class="product-item__image t-h-[40px] t-w-[40px] t-bg-cover t-bg-no-repeat t-bg-center t-mr-5"
            :style="{
              'background-image':
                'url(https://cache.giaohangtietkiem.vn/image/show/94d1140c-1e8b-48d0-9b3a-0fccdb0074c3/92d0703e-085f-4e60-95ba-fec8b357d282.jpg)',
            }"
            alt="Không có ảnh sản phẩm"
          />
          <div
            class="product-item__image t-h-[40px] t-w-[40px] t-bg-cover t-bg-no-repeat t-bg-center t-mr-5"
            v-if="product.isSelected"
          >
            <checked-icon
              @click="onClickExistedProduct(product)"
              :width="40"
              :height="40"
            ></checked-icon>
          </div>
          <div class="product-item__info t-flex t-flex-col t-flex-1">
            <p class="info-name t-text-base t-leading-5 t-mr-0.5">
              {{ product.full_name }}
            </p>
            <div
              class="info-extra t-flex t-place-content-between t-items-center t-flex-row"
            >
              <span> Tồn: 0 SP </span>
              <div
                class="product-quantity t-mt-[-30px] t-w-[77px] t-h-[32px] t-flex t-items-center t-justify-start"
              >
                <span>SL</span>
                <g-select
                  v-model:selectedItem="product.product_quantity"
                  :data-source="quantityDataSource"
                  class="t-flex-1"
                  noBorder
                  :max="30"
                  showSearch
                  input-justify="center"
                  type="suggestion"
                  optionAlign="center"
                  valueType="number"
                  placeholder="0"
                ></g-select>
              </div>
            </div>
          </div>
          <div
            v-if="product.isSelected"
            :class="[
              'product-item__state',
              { 'product-item__state--selected': product.isSelected },
            ]"
          ></div>
        </div>
      </div>
      <div
        class="button t-flex t-items-center t-justify-between t-w-full t-p-5 t-space-x-2 t-pt-0"
      >
        <button
          class=""
          @click="confirmAddProduct"
          :class="
            checkConfirmAddProduct
              ? 'product_bottom_btn t-w-full t-font-medium'
              : 'product_bottom_btn t-w-full t-font-medium disable'
          "
        >
          <p>
            {{ isImport ? "Xác nhận nhập " : "Xác nhận xuất" }}
            {{ numberSelectedExistProduct }} SP | SL {{ countAllQuantity }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import GInput from "@/components/common/GInput";
import GSelect from "@/components/common/GSelect";
import services from "@/services";
import { debounce, filter, forEach, get, map, size } from "lodash";
import { mapState } from "vuex";
import CheckedIcon from "@/components/icons/CheckedIcon";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
export default {
  name: "ProductList",
  components: {
    CheckedIcon,
    GInput,
    GDropdownSelect,
    GSelect,
  },
  props: {
    isImport: {
      type: Boolean,
      default: true,
    },
    orderType: {
      type: String,
      default: "express",
    },
    selectedProductIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      listSelectedProduct: [
        {
          selectedProduct: { label: "", value: "", product_url: "" },
          product_size: {
            height: {},
            width: {},
            length: {},
          },
          product_size_text: "",
          product_weight_ex: 0,

          product_weight: {
            label: "0.1",
            value: 0.1,
          },
          product_quantity: {
            label: "1",
            value: 1,
          },
          isShowPickSizeBbsModal: false,
          validate: {
            product_name: {
              innerError: "",
              outerError: "",
            },
          },
        },
      ],
      listProductDataSource: [],
      listExistedProduct: [],
      debounceSearchProductByName: null,
      productTerm: "",
      value: 0,
      filter: {},
      options: {
        pick_address_id: [],
      },
      countAllQuantity: 0,
      checkConfirmAddProduct: false,
    };
  },
  computed: {
    ...mapState({
      quantityDataSource: (state) => state.global.quantityDataSource,
      weightDataSource: (state) => state.global.weightDataSource,
      weightExpressDataSource: (state) => state.global.weightExpressDataSource,
    }),
    numberSelectedExistProduct() {
      let result = size(filter(this.listExistedProduct, (x) => x.isSelected));
      return result;
    },
    pickAddresses() {
      return Array.isArray(this.$store.state.shop.PickAddress)
        ? this.$store.state.shop.PickAddress
        : [];
    },
  },
  mounted() {
    this.updatePickAddress();
  },
  created() {
    this.debounceSearchProductByName = debounce(this.searchProductByName, 300);
    this.searchProductByName("");
  },

  methods: {
    onClickExistedProduct(product) {
      product.isSelected = !product.isSelected;
      this.numberCountQuantityProduct();
      this.test += 1;
    },

    onSubmitSelectedExistedProduct() {
      let selectedProducts = filter(
        this.listExistedProduct,
        (x) => x.isSelected
      );
      forEach(selectedProducts, (product) => {
        this.listSelectedProduct.push({
          selectedProduct: product,
          product_id: product.product_id,
          product_name: product.full_name,
          product_weight: product.product_weight,
          product_quantity: product.product_quantity,
          isShowPickSizeBbsModal: false,
          validate: {
            product_name: {
              innerError: "",
              outerError: "",
            },
          },
        });
      });
      this.listExistedProduct = map(this.listExistedProduct, (x) => ({
        ...x,
        isSelected: false,
      }));
    },

    async searchProductByName(term) {
      let result = await services.$product.browseProductByName(term.trim());
      if (result && result.success) {
        this.listExistedProduct = map(get(result, "data", []), (x) => {
          const product_url = get(x, "images.0.image", "");
          let product_weight = {};
          if (x.weight === 0) {
            product_weight = {
              label: 0.1,
              value: 0.1,
            };
          } else if (x.weight >= 0) {
            product_weight = {
              label: x.weight,
              value: x.weight,
            };
          }
          return {
            product_url: product_url,
            full_name: x.full_name,
            product_weight: product_weight,
            product_quantity: {
              label: 1,
              value: 1,
            },
            isSelected: false,
            label: x.full_name,
            value: x.product_id,
            payload: x,
          };
        });
        this.listProductDataSource = map(get(result, "data", []), (x) => {
          const product_url = get(x, "images.0.image", "");
          x.product_url = product_url;
          return {
            label: x.full_name,
            value: x.product_id,
            payload: x,
          };
        });
      }
    },

    handleChangeStoreage(_value) {
      this.filter.pick_address_id = _value;
    },

    handleFilter() {
      this.filter.page = 1;
      this.handleChangeQueryUrl({ time: new Date().getTime() });
    },
    numberCountQuantityProduct() {
      this.countAllQuantity = 0;
      for (let i = 0; i < this.listExistedProduct.length; i++) {
        if (this.listExistedProduct[i].isSelected === true) {
          this.countAllQuantity +=
            this.listExistedProduct[i].product_quantity.value;
        }
      }
      if (this.countAllQuantity === 0) {
        this.checkConfirmAddProduct = false;
      } else {
        this.checkConfirmAddProduct = true;
      }
    },
    confirmAddProduct() {
      for (let i = 0; i < this.listExistedProduct.length; i++) {
        this.listExistedProduct[i].isSelected = false;
      }
      this.countAllQuantity = 0;
      this.productTerm = "";
      for (let i = 0; i < this.listExistedProduct.length; i++) {
        this.listExistedProduct[i].product_quantity.value = 1;
        this.listExistedProduct[i].product_quantity.label = "1";
      }
      if (this.checkConfirmAddProduct != 0) {
        this.$emit("update:product", this.isImport);
      }
    },
    updatePickAddress() {
      const pickAddresses = this.pickAddresses?.map((pickAddress) => ({
        ...pickAddress,
        key: pickAddress.id,
        title: pickAddress.first_address + ", " + pickAddress.last_address,
      }));
      if (pickAddresses.length) {
        this.options.pick_address_id = [
          { key: "all", title: "Tất cả" },
          ...pickAddresses,
        ];
      }
    },
  },
  watch: {
    listExistedProduct: {
      handler() {
        this.numberCountQuantityProduct();
      },
      deep: true,
    },
    pickAddresses() {
      this.updatePickAddress();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/create_order.scss";
::v-deep {
  .top-input-search {
    .g-input__wrapper {
      input {
        padding-left: 40px !important;
      }
    }
  }
}
.import-export-modal {
  .product_top_filter {
    p {
      margin-bottom: 0px;
    }
    .top-input-search {
      height: 32px;
      width: 400px;
      position: relative;
      img {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .product_mid_text {
    margin-bottom: 0px;
  }
  .product_mid__item {
    .product-list {
      margin: 15px 0;
      height: 250px;

      overflow-y: auto;
      .product-item {
        border-bottom: 1px solid #e0e0e0;
        padding: 10px 15px;
        &:last-child {
          border-bottom: 1px solid #e0e0e0;
        }
        &__image {
          border-radius: 50%;
        }
        &__info {
          .info-extra {
            .product-quantity {
              border: 1px solid $border-default;
              border-radius: 4px;
              padding: 0 5px;
            }
          }
        }
        &__state {
          display: none;
          &--selected {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
.product_bottom_btn {
  background-color: #00904a;
  border: 1.5px solid #00904a;
  height: 40px;
  border-radius: 5px;
  p {
    font-size: 16px;
    line-height: 20px;
    color: #fff;
  }
}
.disable {
  background-color: #bdbdbd;
  cursor: not-allowed;
  border-color: #bdbdbd;
}
</style>
