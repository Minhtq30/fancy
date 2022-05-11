<template>
  <div class="channel__item-col channel__item-info-cod-product">
    <div>
      <b>Sản phẩm</b>
    </div>
    <div>
      <div
        class="order-product"
        v-for="(product, indexProduct) in item.products"
        :key="indexProduct"
      >
        <div class="product-text">
          <span>{{ indexProduct + 1 }}</span> .
          <img src="/web/img/icons/apple-touch-icon.png" />
          <span>{{ product.product_name }}</span>
        </div>
        <div class="product-input">
          <g-multiselect
            :forceHide="!item.isEdit"
            :ref="setWeightItemRef"
            :width="isExpress ? 0 : 300"
            class="filter-select-wrapper"
            :showApplyToAllChecked="false"
          >
            <template #contentDropdown>
              <div :class="{ 'disable-div': !item.isEdit }">
                KL
                <span>{{ product.weight }} kg</span>
                <div class="arrow-right" />
              </div>
            </template>
            <template #contentOption>
              <div v-if="isExpress">
                <div
                  @click="handleClickWeight(weight.value, indexProduct)"
                  class="weight-product"
                  v-for="(weight, index) in weightDataSource"
                  :key="index"
                >
                  {{ weight.label }}
                </div>
              </div>
              <div
                v-else
                :style="{ padding: '10px' }"
                :class="{ 'disable-div': !item.isEdit }"
              >
                <p>Kích thước (cm)</p>
                <div
                  class="list-size-order"
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '500',
                    alignItems: 'center',
                  }"
                >
                  <g-select
                    placeholder="Dài"
                    class="size-order"
                    :options="sizeDataSource"
                    @change="
                      handleChangeProductSize($event, 'width', indexProduct)
                    "
                  />
                  x
                  <g-select
                    placeholder="Rộng"
                    class="size-order"
                    :options="sizeDataSource"
                    @change="
                      handleChangeProductSize($event, 'height', indexProduct)
                    "
                  />
                  x
                  <g-select
                    placeholder="Cao"
                    class="size-order"
                    :options="sizeDataSource"
                    @change="
                      handleChangeProductSize($event, 'length', indexProduct)
                    "
                  />
                </div>
                <div
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '500',
                    alignItems: 'center',
                    width: '175px',
                    margin: '10px 0px',
                  }"
                >
                  <span>KL thực tế</span>
                  <g-select
                    placeholder="KL"
                    class="size-order"
                    :value="product.weightTemp || product.weight"
                    :options="weightDataSource"
                    @change="handleChangeWeightTemp($event, indexProduct)"
                  />
                </div>
                <div
                  :style="{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '500',
                    alignItems: 'center',
                    width: '175px',
                    margin: '10px 0px',
                  }"
                >
                  <span>KL tính cước</span>
                  <span>{{ product.updateWeight }} kg</span>
                </div>
                <g-button
                  @click="handleClickWeight(product.updateWeight, indexProduct)"
                  :style="{ width: '100%' }"
                  >Lưu thông tin</g-button
                >
              </div>
            </template>
          </g-multiselect>
          <g-multiselect
            :forceHide="!item.isEdit"
            :ref="setQuantityItemRef"
            class="filter-select-wrapper"
            :showApplyToAllChecked="false"
          >
            <template #contentDropdown>
              <div :class="{ 'disable-div': !item.isEdit }">
                SL
                <span>{{ product.quantity }}</span>
                <div class="arrow-right" />
              </div>
            </template>
            <template #contentOption>
              <div
                @click="handleClickQuantity(quantity.value, indexProduct)"
                class="weight-product"
                v-for="(quantity, index) in quantityDataSource"
                :key="index"
              >
                {{ quantity.label }}
              </div>
            </template>
          </g-multiselect>
        </div>
      </div>
    </div>
    <div
      v-show="isExpress"
      class="text-input"
      :style="{ marginBottom: 'unset !important' }"
    >
      <div class="text-left">Tổng khối lượng</div>
      <div class="input-right">
        <g-multiselect
          :ref="setTotalWeightItemRef"
          class="filter-select-wrapper"
          :showApplyToAllChecked="false"
          :forceHide="!item.isEdit"
        >
          <template #contentDropdown>
            <div
              class="text-total-weight"
              :class="{ 'disable-div': !item.isEdit }"
            >
              <span>{{ item.weight }} kg</span>
              <div class="arrow-right" />
            </div>
          </template>
          <template #contentOption>
            <div
              @click="handleClickTotalWeight(weight.value, index)"
              class="weight-product"
              v-for="(weight, index) in weightDataSource"
              :key="index"
            >
              {{ weight.label }}
            </div>
          </template>
        </g-multiselect>
        <!--    KICH - THUOC   -->
        <g-multiselect
          :width="300"
          v-if="item.weight >= 3"
          class="filter-select-wrapper"
          :showApplyToAllChecked="false"
          :forceHide="!item.isEdit"
        >
          <template #contentDropdown>
            <div class="text-size" :class="{ 'disable-div': !item.isEdit }">
              <span>{{ itemRDC.D }} x {{ itemRDC.R }} x {{ itemRDC.C }}</span>
              <div class="arrow-right" />
            </div>
          </template>
          <template #contentOption>
            <div :style="{ padding: '10px' }">
              <p>Kích thước (cm)</p>
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '500',
                  alignItems: 'center',
                }"
              >
                <g-select
                  placeholder="Dài"
                  class="size-order"
                  :options="sizeDataSource"
                  @change="handleChangeSize($event, 'D')"
                />
                x
                <g-select
                  placeholder="Rộng"
                  class="size-order"
                  v-model="itemRDC.R"
                  :options="sizeDataSource"
                  @change="handleChangeSize($event, 'R')"
                />
                x
                <g-select
                  placeholder="Cao"
                  class="size-order"
                  v-model="itemRDC.C"
                  :options="sizeDataSource"
                  @change="handleChangeSize($event, 'C')"
                />
              </div>
            </div>
          </template>
        </g-multiselect>
      </div>
    </div>
    <div
      v-show="item.weight >= 3 || !isExpress"
      class="text-input"
      :style="{ marginBottom: 'unset !important' }"
    >
      <div class="text-left">
        KL tính cước&nbsp;
        <a-tooltip placement="bottom">
          <template #title>
            <div>
              <span style="font-weight: 500"> Khối lượng tính cước </span>
              của đơn hàng được tính dựa trên khối lượng thực tế hoặc khối lượng
              quy đổi (tính theo khối lượng lớn hơn) <br />
              <div class="t-mt-5">
                Khối lượng quy đổi = (Dài*Rộng*Cao) / {{ numberDivisor }}
              </div>
            </div>
          </template>
          <span class="t-text-primary" style="cursor: pointer"> (?) </span>
        </a-tooltip>
      </div>
      <div class="input-right">
        {{ weightUpdate ? weightUpdate : item.weight }} kg
      </div>
    </div>
    <div class="text-input-margin">
      <div class="text-left">Tiền CoD</div>
      <div class="input-right">
        <g-input-in-table
          :class="{ 'disable-div': !item.isEdit }"
          :formatter="currencyFormatter"
          :value="item.pick_money"
          @input="handleInputChangePickMoney"
          :debounce="debounceConfig"
          @blur="handleChangePickMoney"
        />
      </div>
    </div>
    <div class="text-input">
      <div class="text-left">Giá trị hàng</div>
      <div class="input-right">
        {{ currencyFormatter(item.value) }} đ
        <a-tooltip :mouseEnterDelay="0.5" placement="bottom">
          <template #title>
            <span v-if="`${getShopType}` === `0`">
              Giá trị hàng hóa là giá trị GHTK sẽ bồi thường cho người gửi trong
              trường hợp có sự cố xảy ra.
              <p />
              Phí bảo hiểm được tính như sau:
              <p>
                {{
                  /* eslint-disable vue/no-parsing-error */
                  `- Giá trị hàng hóa < 1,000,000đ, GHTK miễn phí bảo hiểm`
                }}
              </p>
              <p>
                - Giá trị hàng hóa ≥ 1,000,000đ (tối đa 20,000,000đ), phí bảo
                hiểm bằng 0,5% giá trị hàng hóa.
              </p>
            </span>
            <span v-else>
              Giá trị hàng hóa là giá trị GHTK sẽ bồi thường cho người gửi trong
              trường hợp có sự cố xảy ra.
              <p />
              <br />
              Phí bảo hiểm được tính như sau:
              <p>
                {{ `- Giá trị hàng hóa ≤ 3,000,000đ, GHTK miễn phí bảo hiểm` }}
              </p>
              <p>
                {{
                  `- Giá trị hàng hóa > 3,000,000đ (tối đa 20,000,000đ), phí bảo hiểm bằng 0,5% giá trị hàng hóa.`
                }}
              </p>
            </span>
          </template>
          <span class="notify-free">Miễn phí BH(?)</span>
        </a-tooltip>
      </div>
    </div>
    <div class="text-input">
      <div class="text-left">Phí ship</div>
      <div class="input-right">
        {{ currencyFormatter(item.ship_money) }} đ | {{ getPayMoney }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { forEach } from "lodash";

// mixin.
import mixinErrorImage from "@/plugins/mixins/errorImage";

// Components
import { message } from "ant-design-vue";
import GSelect from "@/components/base/SelectBoxInTable";
import GButton from "@/components/elements/button";
import GMultiselect from "@/components/base/Multiselect";
import GInputInTable from "@/components/base/InputInTable";

// Mixin
import commonMixin from "@/plugins/mixins/common";

export default defineComponent({
  name: "order-created-col-info-cod-product",
  mixins: [mixinErrorImage, commonMixin],
  props: {
    orderId: String,
    debounceConfig: Number,
    item: Object,
    products: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      itemTotalWeightRefs: [],
      itemWeightRefs: [],
      itemQuantityRefs: [],
      itemRDC: {
        D: 0,
        R: 0,
        C: 0,
      },
      weightUpdate: "",
    };
  },
  components: {
    GButton,
    GSelect,
    GInputInTable,
    GMultiselect,
  },
  watch: {
    products: {
      handler(oldValue, newValue) {
        // nếu là đơn BBS => Tính toán lại. KL tính cước khi thông tin thay đổi.
        if (!this.isExpress) {
          newValue.forEach((product) => {
            const weight = product.width || 0;
            const height = product.height || 0;
            const length = product.length || 0;
            const weight_quy_doi =
              (weight * height * length) / this.numberDivisor;

            product.weightTemp = product.weightTemp
              ? product.weightTemp
              : product.weight;

            debugger;
            product.updateWeight =
              weight_quy_doi > product.weightTemp
                ? weight_quy_doi.toFixed(2)
                : product.weightTemp;
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      quantityDataSource: (state) => state.global.quantityDataSource,
      weightBBSDataSource: (state) => state.global.weightDataSource,
      weightExpressDataSource: (state) => state.global.weightExpressDataSource,
      sizeDataSource: (state) => state.global.sizeDataSource,
    }),
    weightDataSource() {
      return this.item.transport_service === "BBS"
        ? this.weightBBSDataSource
        : this.weightExpressDataSource;
    },
    isExpress() {
      return this.item.transport_service !== "BBS";
    },
    numberDivisor() {
      return this.isExpress ? 6000 : 4000;
    },
    getPayMoney() {
      return this.item.is_freeship === 1 ? "Shop trả" : "Khách trả";
    },
    getShopType() {
      const shopType = localStorage.getItem("shop_type");
      // Nếu tổng giá trị của đơn hàng.
      // 1. Shop_type = 0 shop c2c
      // 2. shop_type = 1 shop b2c
      return shopType;
    },
  },
  methods: {
    vndToNumber(x) {
      if (!x) {
        return 0;
      }
      x = x.toString();
      x = x.replace(/\D/g, "");
      return x;
    },
    handleInputChangePickMoney(value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.item.pick_money = value;
    },
    handleChangePickMoney() {
      const pickMoney = this.item.pick_money;
      const numberPickMoney = this.vndToNumber(pickMoney);
      if (numberPickMoney > 0 && numberPickMoney < 10000) {
        message.warning("Tiền CoD nhỏ hơn 10,000 đ");
        return;
      }
      const requestParam = {
        params: {
          pick_money: numberPickMoney,
        },
      };
      this.$emit("onChange", { data: requestParam, key: "pick_money" });
    },
    handleChangeProductSize(data, key, index) {
      const products = this.item.products || [];
      let product = products[index];

      const newProducts = [...products];
      let newProduct = { ...newProducts[index], [key]: data };
      newProducts.splice(index, 1, newProduct);
      if (this.checkProductValidate(newProducts)) {
        // Cập nhật
        product[key] = data;
        console.log("product", product);
      } else {
        // Lỗi quá 50Kg.
        message.error("GHTK chưa hỗ trợ ĐH có khối lượng lớn hơn 50 kg.");
      }
    },
    handleChangeSize(data, key) {
      this.itemRDC[key] = data;

      // Tính lại KL cước. nếu tổng đơn hàng thay đổi lớn hơn hoặc bằng 3.
      const newWeight =
        this.item.weight >= 3 ? this.getWeightUpdate() : this.item.weight;

      if (this.isExpress && newWeight > 20) {
        // Nếu là đơn Express mà tổng khối lượng update trên 20Kg thì báo lỗi.
        message.error(
          "GHTK chưa hỗ trợ ĐH express có khối lượng lớn hơn 20 kg."
        );
        return false;
      }

      this.weightUpdate = newWeight;
    },
    setTotalWeightItemRef(el) {
      if (el) {
        this.itemTotalWeightRefs.push(el);
      }
    },
    setWeightItemRef(el) {
      if (el) {
        this.itemWeightRefs.push(el);
      }
    },
    setQuantityItemRef(el) {
      if (el) {
        this.itemQuantityRefs.push(el);
      }
    },
    getWeightUpdate() {
      const weight_quy_doi =
        (this.itemRDC.D * this.itemRDC.R * this.itemRDC.C) / this.numberDivisor;

      return weight_quy_doi > this.item.weight
        ? weight_quy_doi.toFixed(2)
        : this.item.weight;
    },
    updateWeightTotal() {
      // Tính lại KL cước. nếu tổng đơn hàng thay đổi lớn hơn hoặc bằng 3.
      this.weightUpdate =
        this.item.weight >= 3 ? this.getWeightUpdate() : this.item.weight;
      if (this.isExpress && this.weightUpdate > 20) {
        // Nếu là đơn Express mà tổng khối lượng update trên 20Kg thì báo lỗi.
        message.error(
          "GHTK chưa hỗ trợ ĐH express có khối lượng lớn hơn 20 kg."
        );
        return false;
      } else {
        // Call API.
        const requestParam = {
          params: {
            weight: this.weightUpdate,
          },
        };
        this.$emit("onChange", { data: requestParam, key: "total_weight" });
      }
      return true;
    },
    updateProduct() {
      // Call API.
      const requestParam = {
        params: {
          products: this.item.products,
        },
      };
      this.$emit("onChange", { data: requestParam, key: "product" });
    },
    checkProductValidate(products) {
      let totalWeight = 0;
      forEach(products, (item) => {
        totalWeight += Number(item.quantity) * Number(item.weight);
      });

      if (this.isExpress) {
        return !(totalWeight > 20);
      } else {
        return !(totalWeight > 50);
      }
    },
    handleChangeWeightTemp(weight, index) {
      const products = this.item.products || [];
      let product = products[index];
      product.weightTemp = weight;
    },
    // Thay đổi tổng khối lượng.
    handleClickTotalWeight(weight) {
      this.handleCloseTotalWeight();
      // eslint-disable-next-line vue/no-mutating-props
      this.item.weight = weight;
      this.updateWeightTotal();
    },
    handleClickWeight(weight, index) {
      this.handleCloseWeight();
      const products = this.item.products || [];
      let product = products[index];

      const newProducts = [...products];
      let newProduct = { ...newProducts[index], weight };
      newProducts.splice(index, 1, newProduct);
      if (this.checkProductValidate(newProducts)) {
        product.weight = weight;
        this.handleUpdateProduct(products, "weight");
      } else {
        message.error(
          "GHTK chưa hỗ trợ ĐH express có khối lượng lớn hơn 20 kg và các đơn có khối lượng lớn hơn 50 kg"
        );
      }
    },
    handleClickQuantity(quantity, index) {
      this.handleCloseQuantity();
      const products = this.item.products || [];
      let product = products[index];

      const newProducts = [...products];
      let newProduct = { ...newProducts[index], quantity };
      newProducts.splice(index, 1, newProduct);
      if (this.checkProductValidate(newProducts)) {
        product.quantity = quantity;
        this.handleUpdateProduct(products, "quantity");
      } else {
        message.error(
          "GHTK chưa hỗ trợ ĐH express có khối lượng lớn hơn 20 kg và các đơn có khối lượng lớn hơn 50 kg"
        );
      }
    },
    // Cập nhật riêng đơn hàng và tổng riêng.
    handleUpdateProduct(products) {
      // + Nếu là đơn BBS thì tự động tính lại tổng khối lượng và không cho phép chỉnh sửa tổng khối lượng.
      // + Nếu là đơn Express.
      //  => Khối lượng đơn hàng nhỏ hơn 3kg, có thể chỉnh sửa thoải mái tổng khối lượng. (Cập nhật tổng khối lượng bằng)
      //  => Khối lượng đơn hàng lớn hơn 3kg thì yêu cầu nhập thêm kích thước để tính cước riêng.
      let totalWeight = 0;
      forEach(products, (item) => {
        totalWeight += Number(item.quantity) * Number(item.weight);
      });
      if (this.isExpress) {
        // Là đơn thường. => Tính lại tổng nếu đổi KL của từng sản phẩm.

        if (totalWeight > 20) {
          // Nếu là đơn Express mà tổng khối lượng update trên 20Kg thì báo lỗi.
          message.error(
            "GHTK chưa hỗ trợ ĐH express có khối lượng lớn hơn 20 kg."
          );
          return false;
        }

        // eslint-disable-next-line vue/no-mutating-props
        this.item.weight = totalWeight;
      } else {
        // Là đơn BBS.
        // Tỉnh lại tổng KL.
        if (totalWeight > 50) {
          message.error("GHTK chưa hỗ trợ ĐH có khối lượng lớn hơn 50 kg.");
          return false;
        }

        // eslint-disable-next-line vue/no-mutating-props
        this.item.weight = totalWeight;
      }
      // Call API cập nhật total weight.
      this.updateWeightTotal();

      // Call API cập nhật product.
      this.updateProduct();
    },
    handleCloseTotalWeight() {
      this.itemTotalWeightRefs.forEach((item) => {
        item.closeModal();
      });
    },
    handleCloseWeight() {
      this.itemWeightRefs.forEach((item) => {
        item.closeModal();
      });
    },
    handleCloseQuantity() {
      this.itemQuantityRefs.forEach((item) => {
        item.closeModal();
      });
    },
  },
});
</script>

<style lang="scss">
.channel__item-info-cod-product {
  width: 100%;
  height: 100%;
  padding: 0 10px;

  > div {
    margin: 10px 0;
  }

  .order-product {
    display: flex;
    margin-bottom: 5px;

    img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 1px solid #069255;
      margin: 0 5px;
    }
  }
  .product-text {
    width: 55%;
  }
  .product-input {
    width: 45%;
    display: flex;
    justify-content: space-between;
    > div {
      width: 46%;
      display: flex;
      justify-content: space-between;
      position: relative;
      cursor: pointer;
      > span {
        width: 70%;
        padding-left: 2px;
        border-bottom: 1px solid #e0e0e0;
      }
    }
  }
}
.arrow-right {
  background-image: url("/web/img/images/arrow_right.png");
  background-repeat: no-repeat;
  background-position: center;
  top: 5px;
  right: 0;
  width: 10px;
  height: 10px;
  position: absolute;
}
.weight-product {
  padding: 5px;
  text-align: center;
  &:hover {
    color: white;
    background-color: var(--primaryColor);
    cursor: pointer;
  }
}

.text-total-weight {
  position: relative;
  display: flex;
  padding-left: 2px;
  width: 30%;
  border-bottom: 1px solid #e0e0e0;
}

.text-size {
  position: relative;
  display: flex;
  width: 60%;
  padding-left: 2px;
  border-bottom: 1px solid #e0e0e0;
}

.text-input {
  display: flex;
  margin-bottom: 10px;
  font-weight: 500;
}

.text-input-margin {
  display: flex;
  margin: unset !important;
  font-weight: 500;
}

.text-left {
  width: 55%;
  display: flex;
  align-items: flex-end;
}

.input-right {
  width: 45%;
  position: relative;
  display: flex;
  justify-content: space-between;
  input {
    font-weight: 500;
  }
}

.size-order {
  width: 70px;
}

.notify-free {
  font-weight: normal;
  margin-left: 10px;
  text-decoration: underline;
  color: var(--primaryColor);
}
</style>
