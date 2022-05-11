<template>
  <div>
    <div class="product-list w-100" :style="{ flex: 1, height: `${height}px` }">
      <div class="product-name" />
      <div class="product-quantity h-100" />
      <div class="product-weight h-100" />
      <div class="product-value h-100" />
    </div>
    <div class="product-list">
      <ValidateEach
        v-for="(item, index) in productsDataLocal"
        :key="`product_${item.idLocal}`"
        :state="item"
        :rules="rules"
      >
        <template #default="{ v }">
          <!-- Tên sản phẩm -->
          <div
            class="product-name"
            :class="{
              'product-name__wrapper--hover': isHover && numberProduct > 1,
            }"
            @paste.prevent="handlePasteFromExcel('product_name', $event, index)"
          >
            <g-multiselect
              :ref="setItemRef"
              :width="400"
              class="filter-select-wrapper"
              :show-search="true"
              :max-height="300"
              @on-close-visible="handleCloseProduct(index)"
              @onSearch="debounceSearchProduct"
            >
              <template #contentDropdown>
                <div>
                  <input-in-table
                    v-model:value="item.product_name"
                    placeholder="Tên sản phẩm"
                    @change="handleChangeProductName(index, $event)"
                  />
                  <transition name="removeProduct">
                    <button
                      :title="'Xóa'"
                      v-if="
                        numberProduct > 1 &&
                        !isFetchingProduct(index) &&
                        isHover
                      "
                      class="btn p-0 btn-sm btn--delete-product"
                      @click="handleRemoveProduct($event, index)"
                    >
                      <span class="icon-wrapper">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="8" cy="8" r="8" fill="#EB5757" />
                          <g clip-path="url(#clip0)">
                            <path
                              d="M8.58639 8.00547L11.0784 5.51336C11.2406 5.35125 11.2406 5.08916 11.0784 4.92706C10.9163 4.76496 10.6542 4.76496 10.4921 4.92706L8.00002 7.41917L5.50798 4.92706C5.3458 4.76496 5.08378 4.76496 4.92168 4.92706C4.7595 5.08916 4.7595 5.35125 4.92168 5.51336L7.41372 8.00547L4.92168 10.4976C4.7595 10.6597 4.7595 10.9218 4.92168 11.0839C5.00247 11.1647 5.10869 11.2054 5.21483 11.2054C5.32098 11.2054 5.42712 11.1647 5.50798 11.0839L8.00002 8.59176L10.4921 11.0839C10.573 11.1647 10.6791 11.2054 10.7853 11.2054C10.8914 11.2054 10.9976 11.1647 11.0784 11.0839C11.2406 10.9218 11.2406 10.6597 11.0784 10.4976L8.58639 8.00547Z"
                              fill="#fff"
                            />
                          </g>
                        </svg>
                      </span>
                    </button>
                  </transition>

                  <error-message-in-table
                    :showMessage="v.product_name.$invalid"
                    message="Sản phẩm thiếu"
                  />
                </div>
              </template>
              <template #contentOption>
                <list-options
                  :showAll="false"
                  :options="isSearch ? listProductSearch : listProduct"
                  modeOption="multi-after"
                  class-content="list-option-circle-in-excel"
                  :checked-list-default="productionKeys"
                  @onSelected="handleSelectProduct(index, $event)"
                  @onUnSelected="handleUnSelectProduct(index, $event)"
                  @onSelectedMulti="handleSelectMultiProduct"
                >
                  <template #label="{ option }">
                    <div>
                      <div>
                        <b>{{ option?.full_name }}</b>
                      </div>
                      <div>
                        Có thể bán: {{ option?.total_available }} | Giá bán:
                        {{ option?.retail_prices }} đ
                      </div>
                    </div>
                  </template>
                </list-options>
              </template>
            </g-multiselect>
          </div>
          <!-- số lượng -->
          <div
            class="product-quantity"
            :key="`product-quantity-${item.id}`"
            @paste.prevent="handlePasteFromExcel('quantity', $event, index)"
          >
            <input-in-table
              type="number"
              min="0"
              v-model:value="item.quantity"
              @change="handleUpdateProductQuantity(index)"
            />
            <error-message-in-table
              :showMessage="v.quantity.$invalid"
              message="Thiếu"
            />
          </div>
          <!-- khối lượng -->
          <div
            class="product-weight"
            :key="`product-weight-${item.id}`"
            @paste.prevent="handlePasteFromExcel('weight', $event, index)"
          >
            <input-in-table
              step="0.1"
              type="number"
              :formatter="roundNumberParser"
              min="0"
              @change="handleUpdateProductWeight(index)"
              v-model:value="item.weight"
            />
            <error-message-in-table
              :showMessage="v.weight.$invalid"
              message="Thiếu"
            />
          </div>
          <!-- Giá trị -->
          <div
            class="product-value"
            :key="`product-value-${item.id}`"
            @paste.prevent="handlePasteFromExcel('money', $event, index)"
          >
            <input-in-table
              :formatter="currencyFormatter"
              v-model:value="item.money"
              :debounce="debounceConfig"
            />
            <error-message-in-table
              :showMessage="v.money.$invalid"
              message="Thiếu"
            />
          </div>
        </template>
      </ValidateEach>
    </div>
    <div
      class="product-list w-100"
      :style="{
        flex: 1,
        height:
          validateMoneyProduct ||
          validateWeightProduct ||
          validateCheckPickMoney ||
          validateMinMoneyProduct
            ? '75px'
            : '50px',
      }"
    >
      <div class="product-name">
        <g-button @click="handleAddProduct" class="add-button" size="small">
          <template #icon>
            <g-addtion-icon12 />
          </template>
        </g-button>
      </div>
      <div class="product-quantity h-100" />
      <div class="product-weight h-100">
        <i v-if="validateWeightProduct" class="product-item-value-error">
          Chưa hỗ trợ
        </i>
      </div>
      <div class="product-value h-100">
        <i v-if="validateMinMoneyProduct" class="product-item-value-error">
          Phải lớn hơn 10000 VND
        </i>
        <i v-if="validateMoneyProduct" class="product-item-value-error">
          {{
            this.transportService === "BBS"
              ? "Vượt quá 50triệu VNĐ"
              : "Vượt quá 20triệu VNĐ"
          }}
        </i>
        <i
          v-if="validateCheckPickMoney && !validateMoneyProduct"
          class="product-item-value-error"
        >
          Với đơn hàng BBS,Giá trị hàng >= tiền CoD
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import { debounce, forEach, get, size, toNumber, trim } from "lodash";
// import { isNumber } from "lodash";
// Validate
import useVuelidate from "@vuelidate/core";
import { between, required } from "@vuelidate/validators";
import { ValidateEach } from "@vuelidate/components";

// Components
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import InputInTable from "@/components/base/InputInTable";
import ErrorMessageInTable from "@/components/base/ErrorMessageInTable";
import GButton from "@/components/elements/button.vue";
import GAddtionIcon12 from "@/components/icons/AddtionIcon12.vue";

// const moneyValidate = (value) =>
//   (Number.parseInt(value) && Number.parseInt(value) > 0) || value?.length > 3;
// Plugin
import commonMixin from "@/plugins/mixins/common";
import productMixin from "@/plugins/mixins/product";
import { nanoid } from "nanoid";
import { useStore } from "vuex";
import {
  DEFAULT_BBS_MAX_VALUE,
  DEFAULT_EXPRESS_MAX_VALUE,
} from "@/contants/order";
export default defineComponent({
  name: "order-excel-col-products",
  props: {
    productsData: {
      type: Array,
      default() {
        return [];
      },
    },
    listProduct: {
      type: Array,
      default() {
        return [];
      },
    },
    debounceConfig: {
      type: Number,
      default: 0,
    },
    fetchingProducts: {
      type: Object,
    },
    isHover: {
      type: Boolean,
    },
    pickMoney: {
      type: String,
      default: "0",
    },
    transportService: {
      type: String,
      default: "",
    },
    provinceId: {
      type: Number,
    },
  },
  mixins: [commonMixin, productMixin],
  components: {
    GButton,
    ValidateEach,
    InputInTable,
    ErrorMessageInTable,
    GAddtionIcon12,
    GMultiselect,
    ListOptions,
  },
  data() {
    return {
      convertPickMoney: null,
      orderSelected: "",
      products: [],
      listProductSearch: [],
      isSearch: false,
      itemRefs: [],
      validateMinMoneyProduct: false,
      validateMoneyProduct: false,
      validateWeightProduct: false,
      validateCheckPickMoney: false,
    };
  },
  created() {
    this.debounceSearchProduct = debounce(this.handleSearchProduct, 300);
    this.debounceCheckValidate = debounce(this.handleCheckValidate, 500);
    this.debounceCheckValidate(this.productsData);
    this.handleCheckWeightValidate(this.productsData);
  },
  beforeUpdate() {
    this.itemRefs = [];
  },
  computed: {
    productsDataLocal() {
      return this.productsData.map((item) => {
        if (!item.idLocal) {
          item.idLocal = nanoid(8);
        }
        item.money = this.vndToNumber(item.money);
        return item;
      });
    },
  },
  watch: {
    productsData: {
      handler(oldValue, newValue) {
        this.debounceCheckValidate(newValue);
        this.handleCheckWeightValidate(newValue);
      },
      deep: true,
    },
    transportService: {
      handler() {
        this.handleCheckValidate(this.products);
      },
      deep: true,
    },
    provinceId: {
      handler() {
        this.handleCheckValidate(this.products);
      },
      deep: true,
    },
    pickMoney: {
      handler() {
        this.handleCheckValidate(this.products);
      },
      deep: true,
    },
  },
  setup(props, { emit }) {
    const v = useVuelidate();
    const rules = computed(() => ({
      product_name: {
        required,
      },
      quantity: {
        required,
        between: between(1, 1000),
      },
      weight: {
        required,
        between: between(0.01, bbsMaxWeight),
      },
      money: {
        required,
        between: between(1, maxMoney),
      },
    }));
    const height = computed(() => {
      return size(props.productsData) > 1 ? 10 : 51;
    });
    const bbsMaxWeight = computed(() => {
      const store = useStore();
      return store.getters["global/getBbsMaxWeight"](props.provinceId);
    });

    const numberProduct = computed(() => {
      return size(props.productsData);
    });
    const maxMoney = computed(() => {
      return props.transportService === "BBS"
        ? DEFAULT_BBS_MAX_VALUE
        : DEFAULT_EXPRESS_MAX_VALUE;
    });
    const productionKeys = computed(() => {
      let keys = props.productsData.map((item) => {
        if (item.product_id) {
          return item.product_id;
        }
      });
      keys = keys.filter((item) => item);
      return keys;
    });

    const handlePasteFromExcel = (name, event, productIndex) => {
      emit("onPasteFromExcel", name, event, toNumber(productIndex));
    };

    const handleAddProduct = () => {
      emit("onAddProduct");
    };

    const handleRemoveProduct = (event, productIndex) => {
      event.preventDefault();
      event.stopPropagation();
      emit("onRemoveProduct", productIndex);
    };

    const handleUpdateProductQuantity = (productIndex) => {
      emit("onUpdateProductQuantity", productIndex);
    };

    const handleUpdateProductWeight = (productIndex) => {
      emit("onUpdateProductWeight", productIndex);
    };

    const handleSelectProduct = (productIndex, selectedObj) => {
      emit("onSelectProduct", productIndex, selectedObj?.dataOptions);
    };

    const handleUnSelectProduct = (productIndex, selectedObj) => {
      emit("onSelectProduct", productIndex, selectedObj?.dataOptions);
    };

    const handleCloseProduct = (productIndex) => {
      emit("onCloseProduct", productIndex);
    };

    const handleChangeProductName = (productIndex, event) => {
      emit("onChangeProductName", productIndex, event.target.value);
    };

    return {
      v,
      rules,
      numberProduct,
      height,
      maxMoney,
      productionKeys,
      handlePasteFromExcel,
      handleAddProduct,
      handleRemoveProduct,
      handleUpdateProductQuantity,
      handleUpdateProductWeight,
      handleSelectProduct,
      handleUnSelectProduct,
      handleCloseProduct,
      handleChangeProductName,
      bbsMaxWeight,
    };
  },
  methods: {
    handleCheckValidate(products) {
      this.products = products;
      let total = 0;
      forEach(this.products, (item) => {
        total += this.vndToNumber(item.money);
      });
      if (total > this.maxMoney) {
        this.validateMoneyProduct = true;
      } else {
        this.validateMoneyProduct = false;
      }
      if (
        total < this.vndToNumber(this.pickMoney) &&
        this.transportService === "BBS"
      ) {
        this.validateCheckPickMoney = true;
      } else {
        this.validateCheckPickMoney = false;
      }
      // TODO Bỏ tạm kịch bản đơn lớn hơn 10k.
      // if (total > 0 && total <= 10000) {
      //   this.validateMinMoneyProduct = true;
      // } else {
      //   this.validateMinMoneyProduct = false;
      // }
    },
    handleCheckWeightValidate(products) {
      let total = 0;
      forEach(products, (item) => {
        total += parseFloat(item.weight);
      });

      if (total > this.bbsMaxWeight) {
        this.validateWeightProduct = true;
      } else {
        this.validateWeightProduct = false;
      }
    },
    vndToNumber(x) {
      if (!x) {
        return 0;
      }
      x = x.toString();
      x = x.replace(/\D/g, "");
      x = parseInt(x);
      return x;
    },
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el);
      }
    },
    /**
     * Tìm kiếm danh sách sản phẩm theo tên
     * @param {string} search Tên sản phẩm cần tìm
     */
    async handleBrowseListProduct(search) {
      this.listProductSearch = await this.getProductByName(
        { term: trim(search) },
        { convertToWithoutPayloadLabel: true }
      );
    },
    handleChangeProduct(data) {
      this.orderSelected = data.value;
    },
    handleSearchProduct(text) {
      if (!text) {
        this.isSearch = false;
      } else {
        this.isSearch = true;
        this.handleBrowseListProduct(text);
      }
    },
    /**
     * Hiển thị loading khi tìm kiếm từng sản phẩm
     * @param {any} productIndex Index của product
     */
    isFetchingProduct(productIndex) {
      return get(this.fetchingProducts, `${productIndex}.fetching`, false);
    },
    handleSelectMultiProduct() {
      this.itemRefs.forEach((item) => {
        item.closeModal();
      });
    },
  },
});
</script>

<style lang="scss">
.list-option-circle-in-excel {
  .ant-checkbox-group-item {
    height: 60px !important;
  }
  .ant-checkbox-inner {
    border-radius: 50px;
    width: 22px;
    height: 22px;
  }
  .ant-checkbox-inner::after {
    left: 30%;
  }
}
</style>
<style lang="scss" scoped>
.product-item-value-error {
  color: var(--dangerColor);
  font-size: small;
}
.product-item:hover {
  background: #069255;
  color: white;
}
.product-item {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  cursor: pointer;
  > div {
    margin-right: 10px;
  }
}
.product-list {
  display: grid;
  grid-template-columns:
    minmax(200px, 200px) minmax(50px, 50px)
    minmax(50px, 50px) minmax(100px, 100px);
  width: 100%;
  .product-name {
    padding: 0;
    position: relative;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
    border-right: 1px solid #dbdbdb;
    .btn--delete-product {
      width: 21px;
      flex: 0 1 21px;
      color: rgb(235, 87, 87);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      position: absolute;
      right: 0;
      top: 10px;
      padding: unset;
      background: transparent;
      .icon-wrapper {
        transition: all 0.2s linear;
        &:hover {
          color: #ca5c55;
          transform: scale(1.15);
        }
      }
    }
    .add-button {
      margin-top: 5px;
      float: right;
      width: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .product-quantity,
  .product-weight {
    padding: 0 0.25rem 0 0.25rem;
    border-right: 1px solid #dbdbdb;
    height: 100%;
  }
  .product-value {
    height: fit-content;
    padding: 0 0.25rem 0 0.25rem;
    input {
      text-align: right;
      font-weight: bold;
    }
  }
}
.product-name >>> .vue-suggestion .vs__input {
  height: 2rem !important;
  padding: 12px 0px 0 0;
  color: #000;
}
.removeProduct-enter-active,
.removeProduct-leave-active {
  right: 0;
  transition: all 0.2s ease;
}
.removeProduct-enter, .removeProduct-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(5px);
  opacity: 0;
}
.product-name__wrapper--hover >>> input {
  padding-right: 18px;
}
</style>
