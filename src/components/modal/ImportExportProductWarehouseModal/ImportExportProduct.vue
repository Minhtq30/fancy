<template>
  <div class="import-export-modal">
    <div class="product_top_filter">
      <div
        v-show="!isImport"
        class="t-flex t-p-5 t-py-2 t-pt-4 font-size-custom"
      >
        <a-col :span="6">
          <p class="t-text-base t-leading-8">Kho xuất</p>
        </a-col>
        <a-col :span="18">
          <g-select-custom
            :data-source="warehousesSrc"
            v-model:selected-item="warehouseSrcSelected"
            placeholder="Kho hàng"
            @on-selection-change="handleChangeSrcWarehouse"
            :optionAlign="center"
          >
            <template v-slot:option="{ item }">
              <div class="t-flex t-flex-row t-items-center">
                <p style="flex: 1" class="t-mb-0">{{ item.name }}</p>
              </div>
            </template>
          </g-select-custom>
        </a-col>
      </div>
      <div class="t-flex t-p-5 t-py-2 font-size-custom">
        <a-col :span="6">
          <p class="t-text-base t-leading-8">Kho nhập</p>
        </a-col>
        <a-col :span="18">
          <g-select-custom
            :data-source="warehousesDes"
            v-model:selected-item="warehouseDesSelected"
            placeholder="Kho hàng"
            @on-selection-change="handleChangeDesWarehouse"
            :optionAlign="center"
          >
            <template v-slot:option="{ item }">
              <div class="t-flex t-flex-row t-items-center">
                <p style="flex: 1" class="t-mb-0">{{ item.name }}</p>
              </div>
            </template>
          </g-select-custom>
        </a-col>
      </div>
      <div class="t-flex t-p-5 t-py-2 font-size-custom">
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
      <div v-if="!products">
        <inventory-product-skeleton />
        <inventory-product-skeleton />
        <inventory-product-skeleton />
        <inventory-product-skeleton />
      </div>
      <div v-else class="product-list t-relative" @scroll="handleScroll">
        <div
          v-if="loading"
          class="overlay t-fixed t-w-[561px] t-h-[236px] flex t-items-center t-justify-center"
        >
          <a-spin />
        </div>
        <div
          v-if="!products.length"
          class="t-w-[561px] t-h-[236px] flex t-items-center t-justify-center"
        >
          <a-empty :description="'Danh sách trống'" />
        </div>
        <template v-else>
          <div
            v-for="product in productsComputed"
            :key="product.productId"
            class="product-item t-flex t-cursor-pointer t-items-center t-justify-between"
            :class="{ 't-opacity-60': notAllowToSelect(product) }"
          >
            <div
              class="t-flex t-flex-1 t-items-center"
              @click="handleToggle(product)"
            >
              <div class="t-h-[40px] t-w-[40px] t-mr-5 t-relative">
                <image-preload
                  class="t-absolute t-rounded-full default-image"
                />
                <div
                  class="product-item__image t-absolute t-bg-cover t-bg-no-repeat t-bg-center t-h-[40px] t-w-[40px]"
                  :style="{
                    'background-image': `url(${product.productImage})`,
                  }"
                  alt="Không có ảnh sản phẩm"
                />
              </div>
              <div
                class="t-absolute t-h-[40px] t-w-[40px] t-mr-5"
                v-if="product.isSelected"
              >
                <checked-icon :width="40" :height="40" />
              </div>
              <div class="product-item__info t-flex t-flex-col t-flex-1">
                <div>
                  <span class="info-name t-text-base t-leading-5 t-mr-0.5">
                    {{ product.productName }}
                  </span>
                  <br />
                  <span>
                    Tồn:
                    <format-price :value="product?.totalAvailable || 0" /> SP
                  </span>
                </div>
              </div>
            </div>
            <div
              v-if="!notAllowToSelect(product)"
              class="product-quantity t-w-[77px] t-flex t-items-center t-justify-start"
            >
              <g-select
                v-model:selectedItem="product.selectedQuanlity"
                :data-source="getRange(product?.totalAvailable || 0)"
                :numberOnly="true"
                :max="maxTotalAvailable(product)"
                :min="1"
                class="t-flex-1"
                noBorder
                showSearch
                input-justify="center"
                type="suggestion"
                optionAlign="center"
                valueType="number"
                placeholder="1"
                @update:selectedItem="(value) => onInputChange(value, product)"
              />
            </div>
            <div
              v-if="product.isSelected"
              :class="[
                'product-item__state',
                { 'product-item__state--selected': product.isSelected },
              ]"
            />
          </div>
        </template>
      </div>
      <div
        class="button t-flex t-items-center t-justify-between t-w-full t-p-5 t-space-x-2 t-pt-0"
      >
        <g-button
          @click="confirmAddProduct"
          class="t-w-full primary"
          :loading="isSubmitting"
          :disabled="!isValidImportExport"
        >
          {{ isImport ? "Xác nhận nhập " : "Xác nhận xuất" }}
          {{ totalSelectedProduct }} SP | SL
          {{ totalSelectedQuanlity }}
        </g-button>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";

import GInput from "@/components/common/GInput";
import GSelect from "@/components/common/GSelect";
import GButton from "@/components/elements/button.vue";
import CheckedIcon from "@/components/icons/CheckedIcon";
import warehouseService from "@/services/warehouse.service";
import FormatPrice from "@/components/FormatPrice.vue";
import InventoryProductSkeleton from "@/components/skeleton/InventoryProductSkeleton.vue";
import ImagePreload from "@/components/elements/image-preload.vue";
import { getTotalPages } from "@/utils";
import { GSelect as GSelectCustom } from "@/components";

export default {
  name: "ProductList",
  components: {
    CheckedIcon,
    GInput,
    GSelect,
    GButton,
    FormatPrice,
    InventoryProductSkeleton,
    ImagePreload,
    GSelectCustom,
  },
  props: {
    timestamp: {
      type: Number,
    },
    visible: {
      type: Boolean,
    },
    onSuccess: {
      type: Function,
    },
    isImport: {
      type: Boolean,
      default: true,
    },
    selectedProducts: {
      type: Array,
    },
    selectedWarehouses: {
      type: Array,
    },
    stations: {
      type: Array,
    },
  },
  data() {
    return {
      debounceSearchProductByName: null,
      productTerm: "",
      warehouseSrcSelected: {},
      warehouseDesSelected: {},
      filter: {
        scr_id: [],
        des_id: [],
      },
      products: null,
      loading: false,
      page: 1,
      total: 0,
      limit: 10,
      isReset: false,
      isSubmitting: false,
      changedAddress: false,
      initWarehouseId: [],
      selectedQuanlity: {},
    };
  },
  computed: {
    listStations() {
      if (!this.stations) return [];
      return this.stations.map((s) => ({
        id: s.id,
        name: s.stationName,
        key: s.id,
        title: s.name,
      }));
    },
    warehouses() {
      return (this.$store.state.warehouse.warehouses || []).map((w) => ({
        ...w,
        key: w.id,
        title: w.name,
      }));
    },
    pickAddressList() {
      if (!this.isImport && this.stations) {
        return this.listStations;
      }
      return this.warehouses;
    },
    warehousesDes() {
      const _warehousesDes = this.warehouses
        .filter((p) => p.id !== this.warehouseSrcSelected?.value)
        .map((p) => ({ ...p, value: p.id, label: p.name }));
      return _warehousesDes;
    },
    warehousesSrc() {
      const _warehousesSrc = this.pickAddressList
        .filter((p) => p.id !== this.warehouseDesSelected?.value)
        .map((p) => ({ ...p, value: p.id, label: p.name }));
      return _warehousesSrc;
    },
    selectedProductsArray() {
      return (this.products || []).filter((p) => p.isSelected);
    },
    totalSelectedProduct() {
      let totalSelectedProduct = 0;
      for (const p of this.selectedProductsArray) {
        totalSelectedProduct += p.isSelected ? 1 : 0;
      }
      return totalSelectedProduct;
    },
    totalSelectedQuanlity() {
      let totalSelectedQuanlity = 0;
      for (const p of this.selectedProductsArray) {
        totalSelectedQuanlity += p.selectedQuanlity?.value || 0;
      }
      return totalSelectedQuanlity;
    },
    isValidImportExport() {
      const requiredQuanlity =
        this.totalSelectedProduct && this.totalSelectedQuanlity;

      if (this.isImport) {
        return this.warehouseDesSelected?.value && requiredQuanlity;
      }

      return (
        this.warehouseSrcSelected?.value &&
        this.warehouseDesSelected?.value &&
        requiredQuanlity
      );
    },
    totalPages() {
      return getTotalPages(this.total, this.limit);
    },
    restrictCallApi() {
      if (
        (!this.changedAddress &&
          this.selectedProducts?.length &&
          !this.productTerm) ||
        (this.isImport && this.selectedProducts?.length && !this.productTerm)
      ) {
        return true;
      }
      return false;
    },
    productsComputed() {
      if (this.stations) {
        const selectedWarehouseId = this.isImport
          ? this.warehouseDesSelected?.value
          : this.warehouseSrcSelected?.value;
        const productIds = this.selectedProducts?.map((p) => p.productId);
        const stationObject = {};

        for (const s of this.stations) {
          stationObject[s.id] = s;
        }

        const _products = this.products?.map((p) => {
          if (productIds.includes(p.productId)) {
            return {
              ...p,
              totalAvailable: stationObject[selectedWarehouseId]?.number || 0,
            };
          }
          return p;
        });

        return _products;
      }

      return this.products || [];
    },
  },
  created() {
    this.handleWatchWarehouse();
    if (!this.debounceSearchProductByName) {
      this.debounceSearchProductByName = debounce(() => this.getData(), 800);
    }
    if (this.selectedProducts?.length) {
      this.products = this.selectedProducts;
    }
  },
  methods: {
    notAllowToSelect(product) {
      return !this.isImport && !product?.totalAvailable;
    },
    maxTotalAvailable(product) {
      return this.isImport ? 9999 : product?.totalAvailable || 0;
    },
    getRange(number) {
      const maxTotal = this.isImport ? 9999 : number;
      let _result = [];
      for (let index = 0; index < maxTotal; index++) {
        _result.push({
          label: index + 1,
          value: index + 1,
        });
      }
      return _result;
    },
    handleToggle(product) {
      if (this.notAllowToSelect(product)) return;
      this.products = this.products.map((p) => {
        if (p.productId === product.productId) {
          return {
            ...p,
            isSelected: !p.isSelected,
          };
        }
        return p;
      });
    },
    scrollToTop() {
      const contentScrollable = document.querySelector(".product-list");
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
      }
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (
        this.page < this.totalPages &&
        !this.loading &&
        percentageScrolled >= 0.85
      ) {
        this.getData(this.page + 1);
      }
    },
    async getData(page = 1) {
      if (this.restrictCallApi) {
        this.products = this.selectedProducts;
        return;
      }
      if (this.isReset) return;

      if (page === 1) {
        this.scrollToTop();
      }

      this.loading = true;
      let products = page === 1 ? [] : [...(this.products || [])];
      let errorMessage = "";

      try {
        const params = { page: page - 1, priority_type: "TOTAL_AVAILABLE" };
        if (this.productTerm) {
          params.product_name = this.productTerm;
        }

        params.shop_warehouse_id = this.isImport
          ? this.warehouseDesSelected.value
          : this.warehouseSrcSelected.value;

        const response = await warehouseService.getProductInventory(params);
        if (response?.data?.success) {
          const _list = (response?.data?.data?.list || []).map((l) => ({
            ...l,
            productImage:
              l.productImages && l.productImages[0] ? l.productImages[0] : "1",
            isSelected: false,
            selectedQuanlity: {
              value: 1,
              label: 1,
            },
          }));

          products = [...products, ..._list];

          this.total = response?.data?.data?.total;
          this.page = page;
        } else {
          errorMessage =
            response?.data?.message || "Lấy danh sách sản phẩm thất bại";
        }
      } catch (error) {
        console.error(error);
        errorMessage =
          error?.response?.data?.message || "Lấy danh sách sản phẩm thất bại";
      }
      if (errorMessage) {
        this.$message.error(errorMessage);
      }
      this.products = products;
      this.loading = false;
    },

    handleChangeDesWarehouse(_value) {
      if (this.isImport) {
        this.changedAddress = !this.initWarehouseId.includes(_value.value);
      }
      this.warehouseDesSelected = _value;
    },
    handleChangeSrcWarehouse(_value) {
      if (!this.isImport) {
        this.changedAddress = !this.initWarehouseId.includes(_value.value);
      }
      this.warehouseSrcSelected = _value;
    },
    async confirmAddProduct() {
      this.isSubmitting = true;
      let errorMessage = "";

      try {
        let response = {};
        const products = this.selectedProductsArray.map((p) => ({
          id: p.productId,
          number: p.selectedQuanlity?.value,
        }));

        const dataPost = {
          products,
          src_id: this.warehouseSrcSelected.value,
          des_id: this.warehouseDesSelected.value,
          trans_type: 1,
        };

        if (this.isImport) {
          response = await warehouseService.createImportWarehouse(dataPost);
        } else {
          dataPost.type_bill = 12;
          response = await warehouseService.createExportWarehouse(dataPost);
        }

        if (response?.data?.success) {
          this.onSuccess(products);
          this.$message.success(response?.data?.message);
        } else {
          errorMessage =
            response?.data?.message ||
            `Tạo phiếu ${this.isImport ? "nhập" : "xuất"} thất bại`;
        }
      } catch (error) {
        console.error(error);
        errorMessage =
          error?.response?.data?.message ||
          `Tạo phiếu ${this.isImport ? "nhập" : "xuất"} thất bại`;
      }

      if (errorMessage) {
        this.$message.error(errorMessage);
      }
      this.isSubmitting = false;
    },
    getWarehouseNameById(wId) {
      let _name = "";
      for (const w of this.warehouses) {
        if (w.id === wId) {
          _name = w.name;
          break;
        }
      }
      return _name;
    },
    handleWatchWarehouse() {
      let _selectedWarehouse;

      if (this.warehouses.length) {
        if (!this.selectedWarehouses?.length) {
          _selectedWarehouse = {
            value: this.warehouses[0].id,
            label: this.warehouses[0].name,
          };
          this.initWarehouseId = [_selectedWarehouse.value];
        } else {
          _selectedWarehouse = {
            value: this.selectedWarehouses[0],
            label: this.getWarehouseNameById(this.selectedWarehouses[0]),
          };
          this.initWarehouseId = this.selectedWarehouses;
        }
      }
      if (_selectedWarehouse) {
        if (this.isImport) {
          this.warehouseDesSelected = _selectedWarehouse;
        } else {
          this.warehouseSrcSelected = _selectedWarehouse;
        }
      }
    },
    onInputChange(value, product) {
      this.products = this.products.map((p) => {
        if (p.productId === product.productId) {
          return {
            ...p,
            selectedQuanlity: value,
          };
        }
        return p;
      });
    },
  },
  watch: {
    "warehouseDesSelected.value"(_value) {
      if (_value && this.isImport) {
        this.getData();
      }
    },
    "warehouseSrcSelected.value"(_value) {
      if (_value && !this.isImport) {
        this.getData();
      }
    },
    warehouses() {
      this.handleWatchWarehouse();
    },
    timestamp() {
      this.handleWatchWarehouse();
    },
    visible(_visible) {
      if (!_visible) {
        this.isReset = true;
        setTimeout(() => {
          this.products = null;
          this.selectedObject = {};
          this.page = 1;
          this.total = 0;
          this.productTerm = "";
          this.warehouseDesSelected = {};
          this.warehouseSrcSelected = {};
        }, 0);
      } else {
        this.isReset = false;
        this.changedAddress = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
$border-default: #c4c4c4;
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
      height: 236px;
      overflow-y: auto;
      .overlay {
        background-color: #ffffffa6;
        z-index: 1;
      }
      .product-item {
        padding: 10px 15px;
        &:not(:last-child) {
          border-bottom: 1px solid #e0e0e0;
        }
        &__image {
          border-radius: 50%;
        }
        .default-image {
          border-radius: 50% !important;
          position: absolute;
          img {
            width: 20px !important;
          }
        }
        .product-quantity {
          border: 1px solid $border-default;
          border-radius: 4px;
          padding: 0 5px;
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
.font-size-custom ::v-deep(.g-input) {
  font-size: 16px;
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
</style>

<style lang="scss">
.import-export-modal {
  .product_top_filter {
    .g-input {
      padding-left: 0.5rem;
      padding-right: 2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .product-item {
    .default-image {
      border-radius: 50% !important;
      position: absolute;
      img {
        &:first-child {
          width: 20px !important;
        }
      }
    }
  }
  .product-quantity {
    .g-input {
      padding-right: unset !important;
    }
    .arrow__annotation,
    .list__wrapper {
      display: none !important;
    }
  }
}
</style>
