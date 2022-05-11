<template>
  <div class="t-flex t-justify-between t-items-center">
    <h3 class="t-mb-0 t-font-bold" style="font-size: 18px">Sản phẩm</h3>
    <g-button
      size="large"
      style="
        width: 200px;
        padding: 0.25em 0.25em;
        border-radius: 20px;
        font-size: 16px;
      "
      type="outlined"
      @on-click="onShowSelectProductModal()"
    >
      <plus-icon :width="14" :height="15"></plus-icon>
      Sản phẩm có sẵn
    </g-button>
  </div>
  <div class="list-product">
    <div
      v-for="(product, productIndex) in listSelectedProduct"
      :key="product.id"
      class="product-item"
    >
      <div class="product-item__info">
        <div class="product-image">
          <img
            v-if="product.selectedProduct.product_url"
            height="70"
            width="70"
            :src="product.selectedProduct.product_url"
            alt="Không có ảnh"
          />
          <span class="t-flex t-flex-col" v-else>
            <add-image-icon></add-image-icon>
          </span>
        </div>
        <div class="product-name">
          <span class="product-name__index">{{ productIndex + 1 }}.</span>
          <g-select
            v-model:selectedItem="product.selectedProduct"
            :noBorder="true"
            :required="true"
            :innerErrorMessage="product.validate.product_name.innerError"
            :outerErrorMessage="product.validate.product_name.outerError"
            :data-source="listProductDataSource"
            :loading="isFetchingProduct"
            inputId="productName"
            class="t-flex-grow"
            placeholder="Nhập tên sản phẩm"
            type="suggestion"
            @on-selection-change="
              (item) => onProductSelectionChange(item, product)
            "
            @on-input-blur="onProductInputBlur(product)"
            @on-input-change="(value) => onProductInputChange(value, product)"
          >
            <template v-slot:option="{ item }">
              <div class="t-flex t-flex-row t-items-center t-w-full">
                <div
                  class="t-mr-2 t-flex"
                  style="width: 50px; flex: 0 1 50px; margin-right: 45px"
                >
                  <img
                    v-if="item.payload.product_url"
                    height="50"
                    width="50"
                    :src="item.payload.product_url"
                    alt="Không có ảnh"
                  />
                  <add-image-icon
                    :height="50"
                    :width="50"
                    v-else
                  ></add-image-icon>
                </div>
                <div style="flex: 1" class="t-mb-0 t-flex t-flex-col">
                  <span>{{ item.payload.full_name }}</span>
                  <div>
                    <span
                      >Giá
                      {{ $filters.numberFormatter(item.payload.retail_prices) }}
                      đ</span
                    >
                    <span class="t-mx-2">|</span>
                    <span
                      >Tồn:
                      {{
                        $filters.numberFormatter(item.payload.total_available)
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </g-select>
        </div>

        <div class="product-extra__info">
          <div
            class="product-weight__bbs"
            v-if="orderType === 'bbs'"
            @click="handleClickProductSizeBbs($event, product, productIndex)"
            v-click-outside="() => onClickOutsidePickSizeBbsModal(product)"
          >
            <div style="flex: 2" class="t-flex t-flex-row t-items-center">
              <span>KT (cm)</span>
              <g-input
                v-model="product.product_size_text"
                :readonly="true"
                noBorder
                placeholder="D x R x C"
                inputClass="t-text-center"
                style="flex: 1; font-size: 14px !important"
              ></g-input>
            </div>
            <span class="t-mx-2">|</span>
            <div style="flex: 1" class="t-flex t-flex-row t-items-center">
              <span>KL (kg)</span>
              <g-input
                v-model="product.product_weight.value"
                :readonly="true"
                noBorder
                placeholder="0"
                inputClass="t-text-center"
                style="flex: 1"
              ></g-input>
            </div>
            <div
              v-if="product.isShowPickSizeBbsModal"
              class="edit-product-popup"
            >
              <div
                class="t-flex t-flex-row t-items-center t-w-full popup-title"
              >
                <h3
                  class="t-text-center t-text-white t-mb-0"
                  style="flex: 1; font-size: 16px; font-weight: 500"
                >
                  Thêm thông tin sản phẩm
                </h3>
                <span
                  class="t-flex t-items-center t-justify-center t-text-white"
                  style="flex: 0 1 50px; width: 50px; cursor: pointer"
                  @click="onCancelBbsPickSizeModal($event)"
                >
                  <times-icon :width="16" :height="16"></times-icon>
                </span>
              </div>
              <div class="popup-content">
                <div class="t-text-black t-mb-2">Kích thước (cm)</div>
                <div class="t-flex t-flex-row t-items-center t-justify-between">
                  <g-select
                    v-model:selectedItem="bbsPickSize.length"
                    :data-source="sizeDataSource"
                    showSearch
                    optionAlign="center"
                    placeholder="Dài"
                    inputJustify="center"
                    type="suggestion"
                    valueType="number"
                    :number-only="true"
                    :max="maxSize"
                    style="flex: 3"
                  ></g-select>
                  <b style="flex: 1; text-align: center">x</b>
                  <g-select
                    v-model:selectedItem="bbsPickSize.width"
                    :data-source="sizeDataSource"
                    :showSearch="false"
                    optionAlign="center"
                    placeholder="Rộng"
                    inputJustify="center"
                    type="suggestion"
                    valueType="number"
                    :number-only="true"
                    :max="maxSize"
                    style="flex: 3"
                  ></g-select>
                  <b style="flex: 1; text-align: center">x</b>
                  <g-select
                    v-model:selectedItem="bbsPickSize.height"
                    :data-source="sizeDataSource"
                    showSearch
                    optionAlign="center"
                    placeholder="Cao"
                    inputJustify="center"
                    type="suggestion"
                    valueType="number"
                    :number-only="true"
                    :max="maxSize"
                    style="flex: 3"
                  ></g-select>
                </div>
                <div class="t-flex t-flex-row t-items-center t-my-2">
                  <span style="flex: 4">KL thực tế</span>
                  <g-select
                    v-model:selectedItem="bbsRealWeight"
                    :data-source="weightDataSource"
                    showSearch
                    optionAlign="center"
                    placeholder="KL"
                    inputJustify="center"
                    type="suggestion"
                    valueType="number"
                    :number-only="true"
                    style="flex: 3"
                  ></g-select>
                  <span style="flex: 4"></span>
                </div>
                <div class="t-flex t-flex-row t-items-center t-my-2">
                  <span style="flex: 4">KL tính cước</span>
                  <span style="flex: 3">
                    {{ tinhKlTinhCuoc() }}
                    kg
                  </span>
                  <span style="flex: 4"></span>
                </div>
                <div class="popup-action">
                  <g-button
                    type="primary"
                    @on-click="onSubmitPickSizeBbs($event)"
                  >
                    Lưu thông tin
                  </g-button>
                </div>
              </div>
            </div>
          </div>
          <div class="product-weight" v-else>
            <span style="width: 109px">Khối lượng (kg)</span>
            <g-select
              v-model:selectedItem="product.product_weight"
              :data-source="weightExpressDataSource"
              class="t-flex-1"
              noBorder
              inputJustify="center"
              type="suggestion"
              valueType="number"
              :number-only="true"
              :max="20"
              :min="0.1"
              showSearch
              optionAlign="center"
              placeholder="0"
              @on-input-blur="onProductInputBlur(product)"
              @on-selection-change="calculateListSelectedProduct()"
              @update:selectedItem="calculateListSelectedProduct()"
            ></g-select>
          </div>
          <div class="product-quantity">
            <span style="width: 64px">Số lượng</span>
            <g-select
              v-model:selectedItem="product.product_quantity"
              :data-source="quantityDataSource"
              class="t-flex-1"
              :max="30"
              noBorder
              showSearch
              type="suggestion"
              valueType="number"
              :number-only="true"
              inputJustify="center"
              optionAlign="center"
              placeholder="0"
              :is-format-integer="true"
              @on-selection-change="calculateListSelectedProduct()"
              @update:selectedItem="calculateListSelectedProduct()"
            ></g-select>
          </div>
        </div>
      </div>
      <div class="product-item__action">
        <g-button
          v-if="listSelectedProduct.length - 1 === productIndex"
          type="outlined"
          @onClick="onAddNewProduct()"
        >
          <plus-icon :width="20" :height="20"></plus-icon>
        </g-button>
        <g-button
          v-else
          type="outlined-danger"
          @onClick="() => onRemoveProduct(productIndex)"
        >
          <span
            class="t-flex t-align-center t-justify-center"
            style="color: #da4838"
          >
            <times-icon :width="20" :height="20"></times-icon>
          </span>
        </g-button>
      </div>
    </div>
  </div>

  <a-modal
    :visible="isShowSelectProductModal"
    :footer="null"
    :closable="false"
    :width="650"
    class="addExistedProductModal"
    @cancel="isShowSelectProductModal = false"
  >
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <h3 class="t-text-center t-text-white t-mb-0" style="flex: 1">
          Thêm sản phẩm có sẵn
        </h3>
        <span
          class="t-flex t-items-center t-justify-center t-text-white"
          style="flex: 0 1 50px; width: 50px; cursor: pointer"
          @click="isShowSelectProductModal = false"
        >
          <times-icon :width="16" :height="16"></times-icon>
        </span>
      </div>
    </template>
    <div class="t-flex t-flex-col">
      <div class="product__extra">
        <div class="t-flex t-flex-row t-items-center t-justify-between">
          <b>Vui lòng bấm để chọn sản phẩm</b>
          <g-button
            size="large"
            style="width: 125px; padding: 0 0.125em; border-radius: 20px"
            type="outlined"
            @on-click="onShowAddProductModal"
          >
            <plus-icon :width="14" :height="15"></plus-icon>
            SP mới
          </g-button>
        </div>
        <div class="t-flex t-flex-row t-items-center">
          <span class="t-mr-5 t-flex t-items-center">
            <search-icon></search-icon>
          </span>
          <g-input
            style="flex: 1"
            :noBorder="true"
            placeholder="Tìm và chọn sản phẩm để tạo đơn"
            v-model:model-value="productTerm"
            @input-change="debounceSearchProductByName"
          ></g-input>
        </div>
      </div>
      <div class="product-list">
        <div
          v-for="product in listExistedProduct"
          :key="product.product_id"
          class="product-item"
          @click="(e) => onClickExistedProduct(e, product)"
        >
          <div
            v-if="!product.isSelected"
            @click="onClickExistedProduct(product)"
            class="product-item__image"
            :style="{
              'background-image':
                'url(https://cache.giaohangtietkiem.vn/image/show/94d1140c-1e8b-48d0-9b3a-0fccdb0074c3/92d0703e-085f-4e60-95ba-fec8b357d282.jpg)',
            }"
            alt="Không có ảnh sản phẩm"
          />
          <div class="product-item__image" v-if="product.isSelected">
            <checked-icon
              @click="onClickExistedProduct(product)"
              :width="75"
              :height="75"
            ></checked-icon>
          </div>
          <div class="product-item__info">
            <span class="info-name">{{ product.full_name }}</span>
            <div class="info-extra">
              <div class="product-weight">
                <span>KL (kg)</span>
                <g-select
                  v-model:selectedItem="product.product_weight"
                  :data-source="
                    orderType === 'express'
                      ? weightExpressDataSource
                      : weightDataSource
                  "
                  class="t-flex-1"
                  noBorder
                  type="suggestion"
                  valueType="number"
                  number-only
                  :max="orderType === 'express' ? 20 : 1000"
                  showSearch
                  input-justify="center"
                  optionAlign="center"
                  placeholder="0"
                ></g-select>
              </div>
              <div class="product-quantity">
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
      <div class="product-action">
        <g-button type="primary" @on-click="onSubmitSelectedExistedProduct">
          {{ numberSelectedExistProduct }}
        </g-button>
      </div>
    </div>
  </a-modal>
  <add-product-modal
    :changeParams="false"
    :visible="visibleModal.addProduct"
    :setVisible="setVisibleModal('addProduct')"
  ></add-product-modal>
</template>

<script>
import GButton from "@/components/common/GButton";
import GInput from "@/components/common/GInput";
import PlusIcon from "@/components/icons/PlusIcon";
import GSelect from "@/components/common/GSelect";
import TimesIcon from "@/components/icons/TimesIcon";
import AddImageIcon from "@/components/icons/AddImageIcon";
import services from "@/services";
import {
  debounce,
  filter,
  forEach,
  get,
  last,
  map,
  round,
  size,
  trim,
} from "lodash";
import { message } from "ant-design-vue";
import common from "@/utils/common";
import { mapState } from "vuex";
import CheckedIcon from "@/components/icons/CheckedIcon";
import AddProductModal from "@/components/modal/WareHouseModal/AddProductModal";
import { MAX_SIZE_CONFIG } from "@/contants/order";

export default {
  name: "ProductList",
  components: {
    AddProductModal,
    CheckedIcon,
    GInput,
    AddImageIcon,
    TimesIcon,
    GSelect,
    PlusIcon,
    GButton,
  },
  props: {
    orderType: {
      type: String,
      default: "express",
    },
  },
  data() {
    return {
      pickSize: {
        height: {},
        width: {},
        length: {},
      },
      bbsProductIndex: null,
      bbsPickSize: {
        height: {},
        width: {},
        length: {},
      },
      bbsRealWeight: {
        label: 0.1,
        value: 0.1,
      },
      isFetchingProduct: false,
      isShowSelectProductModal: false,
      visibleModal: {
        addProduct: false,
      },
      total_weight: 0,
      total_weight_ex: 0,
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
      maxSize: MAX_SIZE_CONFIG,
    };
  },
  computed: {
    ...mapState({
      quantityDataSource: (state) => state.global.quantityDataSource,
      weightDataSource: (state) => state.global.weightDataSource,
      weightExpressDataSource: (state) => state.global.weightExpressDataSource,
      sizeDataSource: (state) => state.global.sizeDataSource,
    }),
    numberSelectedExistProduct() {
      let result = size(filter(this.listExistedProduct, (x) => x.isSelected));
      return result > 0 ? `Chọn ${result} sản phẩm` : "Thêm sản phẩm";
    },
  },
  created() {
    this.debounceSearchProductByName = debounce(this.searchProductByName, 300);
    this.searchProductByName("");
  },

  methods: {
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    bbs_weight_ex() {
      // Logic tính khối lượng tính cước = (Dài*Rộng*Cao)/4000 so sánh với khối lượng thực tế, cái nào cao hơn thì lấy cái đó
      const length = this.bbsPickSize?.length?.value;
      const width = this.bbsPickSize?.width?.value;
      const height = this.bbsPickSize?.height?.value;
      const quyDoi_Weight = round((length * width * height) / 4000, 1);
      return quyDoi_Weight;
    },
    calculateListSelectedProduct() {
      let total_weight = 0;
      let total_weight_ex = 0;
      let value = 0;
      forEach(this.listSelectedProduct, (product) => {
        let tmp_weight =
          get(product, "product_weight.value", 0) *
          get(product, "product_quantity.value", 1);
        let tmp_weight_ex =
          get(product, "product_weight_ex", 0) *
          get(product, "product_quantity.value", 1);
        value += get(product, "retail_prices", 0);
        total_weight += tmp_weight;
        total_weight_ex +=
          tmp_weight_ex > tmp_weight ? tmp_weight_ex : tmp_weight;

        value += get(product, "retail_prices", 0);
      });
      this.total_weight = round(total_weight, 2);
      this.total_weight_ex = round(total_weight_ex, 2);
      this.value = value;
      this.updateProductList();
    },

    handleClickProductSizeBbs(e, product, productIndex) {
      if (product.isShowPickSizeBbsModal) return;
      this.bbsProductIndex = productIndex;
      let bbsProduct = product;
      if (bbsProduct) {
        this.bbsPickSize = { ...bbsProduct.product_size };
        this.bbsRealWeight = { ...bbsProduct.product_weight };
      }
      product.isShowPickSizeBbsModal = true;
    },

    onAddNewProduct() {
      if (this.listSelectedProduct.length > 0) {
        let productName = get(
          last(this.listSelectedProduct),
          "selectedProduct.label",
          null
        );
        if (!productName) {
          this.validateListProduct();
          return;
        }
      }
      this.listSelectedProduct.push({
        selectedProduct: { label: "", value: "" },
        product_size: {
          height: {},
          width: {},
          length: {},
        },
        product_weight_ex: 0.1,
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
      });
      this.calculateListSelectedProduct();
    },

    onCancelBbsPickSizeModal(e) {
      e.stopImmediatePropagation();
      let bbsProduct = this.listSelectedProduct[this.bbsProductIndex];
      bbsProduct.isShowPickSizeBbsModal = false;
    },

    onClickExistedProduct(product) {
      product.isSelected = !product.isSelected;
    },
    onClickOutsidePickSizeBbsModal(product) {
      if (product.isShowPickSizeBbsModal) {
        product.isShowPickSizeBbsModal = false;
      }
    },

    onProductInputBlur() {},
    // Product
    onProductInputChange(search, product) {
      product.selectedProduct = {
        ...product.selectedProduct,
        label: search,
        value: search,
      };
      if (size(trim(search)) > 0) {
        product.validate.product_name.innerError = "";
      }
      this.debounceSearchProductByName(search);
      this.calculateListSelectedProduct();
    },
    onProductSelectionChange(item, product) {
      let product_name = get(item, "payload.full_name");
      let product_url = get(item, "payload.images.0.image", "");
      product.selectedProduct.product_url = product_url;
      if (size(product_name) > 0) {
        product.validate.product_name.innerError = "";
      }
      this.calculateListSelectedProduct();
    },

    onRemoveProduct(productIndex) {
      this.listSelectedProduct.splice(productIndex, 1);
      this.calculateListSelectedProduct();
    },

    onShowSelectProductModal() {
      this.isShowSelectProductModal = true;
    },
    onShowAddProductModal() {
      this.visibleModal.addProduct = true;
    },
    onSubmitPickSizeBbs(e) {
      e.stopImmediatePropagation();
      let bbsProduct = get(this.listSelectedProduct, this.bbsProductIndex);
      if (
        !this.bbsPickSize?.length?.value ||
        !this.bbsPickSize?.width?.value ||
        !this.bbsPickSize?.height?.value
      ) {
        message.error("Vui lòng nhập kích thước.");
        return;
      }
      if (bbsProduct) {
        const length = common.numberFormatter(this.bbsPickSize?.length?.value);
        const width = common.numberFormatter(this.bbsPickSize?.width?.value);
        const height = common.numberFormatter(this.bbsPickSize?.height?.value);
        bbsProduct.product_size = { ...this.bbsPickSize };
        bbsProduct.product_size_text = `${length}cm x ${width}cm x ${height}cm`;
        bbsProduct.product_weight = { ...this.bbsRealWeight };
        bbsProduct.product_weight_ex = this.bbs_weight_ex();
        this.calculateListSelectedProduct();
      }
      this.onCancelBbsPickSizeModal(e);
      this.bbsProductIndex = null;
    },

    onSubmitSelectedExistedProduct() {
      let selectedProducts = filter(
        this.listExistedProduct,
        (x) => x.isSelected
      );
      forEach(selectedProducts, (product) => {
        this.listSelectedProduct = this.listSelectedProduct.filter(
          (p) => p.selectedProduct?.label
        );
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
      this.isShowSelectProductModal = false;
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

    tinhKlTinhCuoc() {
      let realWeightNumber = parseFloat(this.bbsRealWeight.value) || 0;
      let quyDoiWeightNumber = parseFloat(this.bbs_weight_ex()) || 0;
      return realWeightNumber > quyDoiWeightNumber
        ? realWeightNumber
        : quyDoiWeightNumber;
    },

    updateProductList(isWeightChanged = true) {
      let isProductListValid = this.validateListProduct();
      let totalWeightOnCharge = this.tinhKlTinhCuoc();
      let productInfo = {
        listSelectedProduct: this.listSelectedProduct,
        isProductListValid: isProductListValid,
        isWeightChanged: isWeightChanged,
        bbsPickSize: this.bbsPickSize,
        bbsRealWeight: this.bbsRealWeight,
        total_weight: this.total_weight,
        total_weight_ex: this.total_weight_ex,
        total_weight_on_charge: totalWeightOnCharge,
        value: this.value,
      };
      this.$emit("update:productList", productInfo);
    },

    /**
     * Validate danh sách đơn hàng
     * @returns {boolean} True nếu danh sách đơn hàng hợp lệ
     */
    validateListProduct() {
      let isValid = true;
      for (let i = 0; i < size(this.listSelectedProduct); i++) {
        let product = this.listSelectedProduct[i];
        let product_name = get(product, "selectedProduct.label");
        let product_weight = parseFloat(get(product, "product_weight.value"));
        let product_quantity = parseInt(get(product, "product_quantity.value"));
        if (size(trim(product_name)) === 0) {
          product.validate.product_name.innerError = "Chọn sản phẩm";
          isValid = false;
        }
        if (product_weight <= 0) {
          isValid = false;
        }
        if (product_quantity <= 0) {
          isValid = false;
        }
      }
      return isValid;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/create_order.scss";
</style>
