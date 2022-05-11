<template>
  <div
    class="item-col"
    :style="columnsWrapper"
    @mouseover="debouncedHandleMouseOver"
    @mouseleave="debouncedHandleMouseLeave"
  >
    <div class="item-cell">
      <col-action
        :isSelected="isSelected"
        :orderId="orderId"
        :selectManyMode="selectManyMode"
        @handleSelectOrder="handleSelectOrder"
      />
    </div>
    <div class="item-cell">
      <col-s-t-t
        :orderIndex="orderIndex"
        @onRemoveOrder="handleRemoveOrder"
        @onSwapOrder="handleSwapOrder"
      />
    </div>
    <div class="item-cell">
      <col-code-g-h-t-k :data-source="item.alias" />
    </div>
    <div class="item-cell">
      <col-code
        :dataSource="item.client_id"
        :debounceConfig="debounceConfig"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onPasteFromExcel="handlePasteFromExcel"
      />
    </div>
    <div class="item-cell">
      <col-name
        :dataSource="item.name"
        :customerDetail="item.customerDetail"
        :debounceConfig="debounceConfig"
        :blockedMessage="blockedMessage"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onPasteFromExcel="handlePasteFromExcel"
      />
    </div>
    <div class="item-cell">
      <col-phone
        :dataSource="item.phone"
        :debounceConfig="debounceConfig"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onGetCustomerInfoByPhone="handleGetCustomerInfoByPhone"
        @onUpdateDataPhoneInvalid="handleUpdateDataPhoneInvalid"
        @onPasteFromExcel="handlePasteFromExcel"
        @handlePasteAddress="handlePasteAddress"
      />
    </div>
    <div class="item-cell">
      <col-address
        :dataSource="item.address"
        :addressObj="item.addressObj"
        :phone="item.phone"
        :orderId="orderId"
        :debounceConfig="debounceConfig"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onHardUpdateAddressObj="handleHardUpdateAddressObj"
        @onUpdateAddressObj="handleUpdateAddressObj"
        @onPasteFromExcel="handlePasteFromExcel"
      />
    </div>
    <div class="item-cell-none">
      <col-products
        :key="item.warehouse?.province_id"
        :isHover="isHover"
        :productsData="item.products"
        :fetchingProducts="products"
        :debounceConfig="debounceConfig"
        :listProduct="listProduct"
        :pickMoney="item.pick_money"
        :transportService="item.transport_service"
        :provinceId="item.warehouse?.province_id"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onRemoveProduct="handleRemoveProduct"
        @onAddProduct="handleAddProduct"
        @onChangeProductName="handleChangeProductName"
        @onSelectProduct="handleSelectProduct"
        @onCloseProduct="handleCloseProduct"
        @onUpdateProductWeight="handleUpdateProductWeight"
        @onUpdateProductQuantity="handleUpdateProductQuantity"
        @onPasteFromExcel="handlePasteFromExcel"
      />
    </div>
    <div class="item-cell">
      <col-pick-money
        :dataSource="item.pick_money"
        :debounceConfig="debounceConfig"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onPasteFromExcel="handlePasteFromExcel"
      />
    </div>
    <div class="item-cell">
      <col-note
        type="orderDraft"
        :messageData="item.message"
        :messagesData="item.messages"
        :tags="item.tags"
        :not-delivered-fee="item.not_delivered_fee"
        :not-delivered-option="item.not_delivered_option"
        :packageLabels="packageLabels"
        :serviceData="item.transport_service"
        :productsData="item.products"
        :expNotes="expNotes"
        :isApplyAllMessage="isApplyAllMessage"
        :debounceConfig="debounceConfig"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onUpdateOrderMessage="handleUpdateOrderMessage"
        @onApplyAllByField="handleApplyAllByField"
        @onPasteFromExcel="handlePasteFromExcel"
      />
    </div>
    <div class="item-cell">
      <col-warehouse
        :isApplyAllWarehouse="isApplyAllWarehouse"
        :isApplyAllPickTime="isApplyAllPickTime"
        :warehouseData="item.warehouse"
        :pickTimeData="item.pick_time"
        :deliver_option="item.deliver_option"
        :listPickTime="listPickTime"
        :listWareHouse="listWareHouse"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onUpdateOrderWarehouse="handleUpdateOrderWarehouse"
        @onUpdateOrderPickTime="handleUpdateOrderPickTime"
        @onApplyAllByField="handleApplyAllByField"
      />
    </div>
    <div class="item-cell">
      <col-v-c
        :shipData="item.transport"
        :serviceData="item.transport_service"
        :shipMethods="shipMethods"
        :serviceMethods="serviceMethods"
        :provincesCache="provincesCache"
        :warehouseData="item.warehouse"
        :addressData="item.addressObj"
        :isApplyAllTransport="isApplyAllTransport"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onUpdateOrderShipMethod="handleUpdateOrderShipMethod"
        @onApplyAllByField="handleApplyAllByField"
      />
    </div>
    <div class="item-cell">
      <col-pay
        :dataSource="item.shipPay"
        :whoPays="whoPays"
        :isApplyAllFreeShip="isApplyAllFreeShip"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onUpdateOrderShipCusPay="handleUpdateOrderShipCusPay"
        @onApplyAllByField="handleApplyAllByField"
      />
    </div>
    <div class="item-cell">
      <col-action-button
        @printOrder="printOrder"
        @onUpdate="handleUpdate"
        @onUpdateToEcom="handleUpdateToEcom"
        :orderId="orderId"
        :updateType="updateType"
        :isError="isError"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { nanoid } from "nanoid";
import { mapState } from "vuex";
import {
  debounce,
  find,
  findIndex,
  get,
  join,
  map,
  size,
  toNumber,
} from "lodash";

// Components
import ColAction from "@/components/table/columns-common/order-excel-col-action.vue";
import ColActionButton from "@/components/table/columns-common/order-excel-col-action-button.vue";
import ColAddress from "@/components/table/columns-common/order-excel-col-address.vue";
import ColCodeGHTK from "@/components/table/columns-common/order-excel-col-code-ghtk.vue";
import ColCode from "@/components/table/columns-common/order-excel-col-code.vue";
import ColName from "@/components/table/columns-common/order-excel-col-name.vue";
import ColNote from "@/components/table/columns-common/order-excel-col-note.vue";
import ColPay from "@/components/table/columns-common/order-excel-col-pay.vue";
import ColPhone from "@/components/table/columns-common/order-excel-col-phone.vue";
import ColPickMoney from "@/components/table/columns-common/order-excel-col-pick-money.vue";
import ColProducts from "@/components/table/columns-common/order-excel-col-products.vue";
import ColSTT from "@/components/table/columns-common/order-excel-col-stt.vue";
import ColVC from "@/components/table/columns-common/order-excel-col-vc.vue";
import ColWarehouse from "@/components/table/columns-common/order-excel-col-warehouse.vue";

// Service
import services from "@/services";

// Util
import commonMixin from "@/plugins/mixins/common";
import pickTimeMixin from "@/plugins/mixins/pickTime";
import addressMixin from "@/plugins/mixins/searchAddress";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "order-draft-item",
  components: {
    ColAction,
    ColAddress,
    ColCodeGHTK,
    ColCode,
    ColName,
    ColNote,
    ColPay,
    ColPhone,
    ColPickMoney,
    ColProducts,
    ColSTT,
    ColVC,
    ColWarehouse,
    ColActionButton,
  },
  async beforeMount() {
    this.debouncedHandleMouseOver = debounce(this.handleMouseOver, 200);
    this.debouncedHandleMouseLeave = debounce(this.handleMouseLeave, 200);
    this.checkBlockedAddress();
  },
  mixins: [commonMixin, pickTimeMixin, addressMixin],
  data() {
    return {
      fetchingCustomerInfo: false,
      isHover: false,
      products: {},
      oldValue: {},
    };
  },
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    item: {
      type: Object,
    },
    columnsWrapper: {
      type: Object,
    },
    orderId: {
      type: String,
    },
    orderIndex: {
      type: Number,
    },
    selectManyMode: {
      type: Function,
    },
    debounceConfig: {
      type: Number,
      default: 1,
    },
    // List data
    excelColumns: {
      type: Array,
    },
    listProduct: {
      type: Array,
    },
    listWareHouse: {
      type: Array,
    },
    shipMethods: {
      type: Array,
    },
    serviceMethods: {
      type: Array,
    },
    whoPays: {
      type: Array,
    },
    expNotes: {
      type: Array,
    },
    provincesCache: {
      type: Array,
    },
    packageLabels: {
      type: Array,
    },
    listUpdate: {
      type: Object,
    },
    listError: {
      type: Object,
    },
    // Apply for All
    isApplyAllWarehouse: {
      type: Boolean,
      default: false,
    },
    isApplyAllFreeShip: {
      type: Boolean,
      default: false,
    },
    isApplyAllPickTime: {
      type: Boolean,
      default: false,
    },
    isApplyAllMessage: {
      type: Boolean,
      default: false,
    },
    isApplyAllTransport: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      shopType: (state) => Number(state.shop?.Shop?.shop_type),
    }),
    listPickTime() {
      const warehouse = get(this.item, "warehouse");
      const orderId = get(this.item, "orderId");
      if (!warehouse) {
        return [];
      }
      return this.$store.state.orderDraft.pickTimes[`${orderId}`] || [];
    },
    isSelected() {
      return (
        this.$store.state.orderDraft.selectedListOrder[this.orderId] || false
      );
    },
    updateType() {
      return this.listUpdate[this.orderId];
    },
    isError() {
      return this.listError[this.orderIndex];
    },
  },
  methods: {
    // ----------------------------------------------- ORDER --------------------------------------------------
    handleUpdate() {
      this.$emit("onUpdateDraft", this.orderId);
    },
    handleUpdateToEcom() {
      this.$emit("onUpdateDraftToEcom", this.orderId);
    },

    handleSelectOrder(event) {
      this.$store.commit("orderDraft/selectOrder", {
        newSelectedOrder: {
          [this.orderId]: event.target.checked,
        },
      });
    },

    handleMouseOver() {
      this.isHover = true;
    },
    handleMouseLeave() {
      this.isHover = false;
    },

    handleRemoveOrder() {
      this.$emit("onRemoveOrder", this.orderId);
    },
    handleSwapOrder() {
      this.$emit("onSwapOrder", this.orderId);
    },

    handleUpdateItemByFieldName(data) {
      // eslint-disable-next-line vue/no-mutating-props
      this.item[`${data.name}`] = data.value;
    },

    handlePasteFromExcel(
      fieldName,
      event,
      fieldIndex,
      selectionStartIndex,
      selectionEndIndex
    ) {
      const pastedHtmlText = event.clipboardData.getData("text/html");
      const pastedText = event.clipboardData.getData("Text");
      if (pastedHtmlText && pastedHtmlText.includes("</table>")) {
        // Do Something.
      } else {
        if (fieldName === "address") {
          const output = [
            this.item[fieldName].slice(0, selectionStartIndex),
            pastedText,
            this.item[fieldName].slice(selectionEndIndex),
          ].join("");
          // eslint-disable-next-line vue/no-mutating-props
          this.item[fieldName] = output;
          // eslint-disable-next-line vue/no-mutating-props
          this.item.addressObj = {};
          this.handlePasteAddress(output);
        } else if (
          fieldName === "product_name" ||
          fieldName === "quantity" ||
          fieldName === "weight" ||
          fieldName === "money"
        ) {
          const newProduct = this.item.products[fieldIndex];
          newProduct[fieldName] = pastedText;
          newProduct.tags = [];
          if (fieldName === "product_name") {
            newProduct.suggestSelectedItem = { name: pastedText };
          }
          // eslint-disable-next-line vue/no-mutating-props
          this.item.products.splice(fieldIndex, 1, newProduct);
          this.checkCapacityOrderPickup();
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          this.item[fieldName] = pastedText;
        }
      }
    },
    // ----------------------------------------------- APPLY ALL FIELD --------------------------------------------------

    handleApplyAllByField(fieldName, checked) {
      let payload = {};
      if (fieldName === "isApplyAllMessage" && checked) {
        payload = {
          fieldName,
          fieldValue: this.item.message,
          message: this.item.message,
          tags: this.item.tags,
          not_delivered_fee: this.item.not_delivered_fee || 0,
          not_delivered_option: this.item.not_delivered_option,
        };
      } else if (fieldName === "isApplyAllWarehouse") {
        if (checked) {
          setTimeout(() => {
            this.$emit("onCheckCapacityPickupAll");
          }, 200);
        }
        payload = {
          fieldName,
          fieldValue: checked ? this.item.warehouse : null,
        };
      } else if (fieldName === "isApplyAllTransport") {
        payload = {
          fieldName,
          fieldValue: checked ? this.item.transport : null,
        };
      } else if (fieldName === "isApplyAllFreeShip") {
        payload = {
          fieldName,
          fieldValue: checked ? this.item.shipPay : null,
        };
      } else if (fieldName === "isApplyAllPickTime") {
        payload = {
          fieldName,
          fieldValue: checked ? this.item.pick_time : null,
        };
        setTimeout(async () => {
          let listPickTime = [];
          if (size(this.listPickTime) > 0) {
            listPickTime = this.listPickTime;
          } else {
            if (this.item.warehouse) {
              const pickup = await this.handleBrowsePickTimes({
                warehouse: this.item.warehouse,
                products: this.item.products,
              });
              listPickTime = pickup;
            } else {
              listPickTime = [];
            }
          }
          this.$store.commit("orderDraft/checkAllPickTime", {
            listPickTime,
            warehouse: {
              province_id: this.item.warehouse?.province_id,
              district_id: this.item.warehouse?.district_id,
            },
          });
        }, 0);
      }
      this.$store.commit("orderDraft/applyAllByField", {
        fieldName,
        fieldValue: checked,
      });
      setTimeout(() => {
        this.$emit("onApplyAllByField", payload);
      }, 0);
    },

    // ----------------------------------------------- PHONE --------------------------------------------------
    async handleUpdateDataPhoneInvalid() {
      // eslint-disable-next-line vue/no-mutating-props
      this.item.customerDetail = {
        ...this.item.customerDetail,
        packages: null,
        colors: null,
      };
    },

    async handleGetCustomerInfoByPhone() {
      this.fetchingCustomerInfo = true;
      try {
        const requestParam = {
          customer_tels: [this.item.phone],
        };
        const result = await services.$customer.getCustomerColorByPhone(
          requestParam
        );
        if (result.success) {
          const customerInfo = find(
            get(result, "data"),
            (item) => item.customer_tel === this.item.phone
          );
          if (customerInfo) {
            const customerDetail = {
              tel: customerInfo.tel,
              reports: customerInfo.shipper_reports,
              flags: customerInfo.report,
            };
            const colors = [];
            if (customerInfo.colors.isBadReport) {
              colors.push("badReport");
            }
            if (customerInfo.colors.isGoodReport) {
              colors.push("goodReport");
            }
            if (customerInfo.colors.isBlue) {
              colors.push("trusted");
            }
            if (customerInfo.colors.isPurple) {
              colors.push("purple");
            }
            if (customerInfo.colors.isRed) {
              colors.push("red");
            }
            if (customerInfo.colors.isSuperred) {
              colors.push("superRed");
            }
            if (customerInfo.colors.isYellow) {
              colors.push("yellow");
            }
            customerDetail.colors = colors;
            // eslint-disable-next-line vue/no-mutating-props
            this.item.customerDetail = {
              ...this.item.customerDetail,
              ...customerDetail,
            };
          }
        } else {
          // this.$toast.error("Có lỗi khi lấy thông tin khách hàng.");
          console.log("Có lỗi khi lấy thông tin khách hàng.");
        }
        const requestParamCheck = {
          customer_tels: [this.item.phone],
        };
        const sameOrderResult =
          await services.$customer.checkDuplicateOrderByPhone(
            requestParamCheck
          );
        if (sameOrderResult.success) {
          const prevPackages = find(
            sameOrderResult?.data,
            (item) => item.customer_tel === this.item.phone
          );
          if (prevPackages) {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.customerDetail = {
              ...this.item.customerDetail,
              packages: prevPackages,
            };
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.customerDetail = {
              ...this.item.customerDetail,
              packages: {},
            };
          }
        } else {
          // this.$toast.error("Có lỗi kiểm tra trùng đơn hàng.");
          console.log("Có lỗi kiểm tra trùng đơn hàng.");
        }
      } catch (error) {
        // this.$toast.error("Có lỗi khi lấy thông tin khách hàng.");
        console.log("Có lỗi khi lấy thông tin khách hàng.");
      } finally {
        this.fetchingCustomerInfo = false;
      }
    },

    // ----------------------------------------------- ADDRESS --------------------------------------------------
    async handlePasteAddress(pastedAddress) {
      if (pastedAddress && size(pastedAddress) > 2) {
        const parseAddressParam = {
          address: pastedAddress,
          tel: this.item.phone,
        };
        const addressObj = await this.handleParseAddress(parseAddressParam);
        this.handleUpdateAddressObj(addressObj);
      }
    },

    /**
     * Chọn địa chỉ cho đơn hàng
     * @param {any} addressObj Object chứa địa chỉ
     */
    handleUpdateAddressObj(addressObj) {
      if (size(addressObj) === 0) {
        return;
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.item.addressObj = { ...this.item.addressObj, ...addressObj };
      if (!this.item.addressObj.customer_specific_id) {
        // eslint-disable-next-line vue/no-mutating-props
        this.item.addressObj.customer_specific_id = get(
          addressObj,
          "customer_hamlet_id"
        );
        // eslint-disable-next-line vue/no-mutating-props
        this.item.addressObj.customer_specific = get(
          addressObj,
          "customer_hamlet"
        );
      }
      this.checkBlockedAddress();
    },

    /**
     * Chọn địa chỉ cho đơn hàng
     * @param {any} addressObj Object chứa địa chỉ
     */
    handleHardUpdateAddressObj(addressObj) {
      addressObj = addressObj || {};
      // eslint-disable-next-line vue/no-mutating-props
      this.item.addressObj = addressObj;
      if (!this.item.addressObj.customer_specific_id) {
        // eslint-disable-next-line vue/no-mutating-props
        this.item.addressObj.customer_specific_id = get(
          addressObj,
          "customer_hamlet_id"
        );
        // eslint-disable-next-line vue/no-mutating-props
        this.item.addressObj.customer_specific = get(
          addressObj,
          "customer_hamlet"
        );
      }
      this.checkBlockedAddress();
    },

    /**
     * Kiểm tra địa chỉ có bị khóa hay không
     */
    async checkBlockedAddress() {
      const params = [
        this.item.addressObj.customer_province_id,
        this.item.addressObj.customer_district_id,
        this.item.addressObj.customer_ward_id,
        this.item.addressObj.customer_hamlet_id,
      ];
      if (params.every((element) => !element)) return;
      let listAddressBlocked = {};
      try {
        const result = await services.$address.getListAddressBlocked({
          address_ids: params,
        });
        if (result.success) {
          listAddressBlocked = result.data.block_address;
          const is_bbs = this.item.transport_service.toLowerCase() == "bbs";
          const blockedAddress = listAddressBlocked.find(
            (item) =>
              ["", -1, this.shopType].includes(item.shop_type) &&
              (is_bbs ? item.bigsize.is_block : item.is_block)
          );
          this.blockedMessage = blockedAddress
            ? (is_bbs && blockedAddress?.bigsize?.type != "pick") ||
              (!is_bbs && blockedAddress?.type != "pick")
              ? blockedAddress.deliver_message
              : ""
            : "";
          if (this.blockedMessage != "") {
            message.error(this.blockedMessage);
            // eslint-disable-next-line vue/no-mutating-props
            this.item.is_blocked_address = true;
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.is_blocked_address = false;
          }
        } else {
          console.log("Có lỗi khi phân tích địa chỉ.");
        }
      } catch (error) {
        console.log(error);
      }
    },
    // ----------------------------------------------- PRODUCT --------------------------------------------------

    /**
     * Thêm sản phẩm vào order
     */
    handleAddProduct() {
      const newProduct = {
        id: nanoid(8),
        product_name: "",
        money: 0,
        weight: 0.1,
        quantity: 1,
      };
      // eslint-disable-next-line vue/no-mutating-props
      this.item.products.push(newProduct);
      // TODO NamVH: Cân nhắc xem có cần thiết phải thêm việc check ở này hay không.
      this.checkCapacityOrderPickup();
    },
    /**
     * Xóa sản phẩm trong order
     * @param {any} productIndex Index của product cần xóa
     */
    handleRemoveProduct(productIndex) {
      // eslint-disable-next-line vue/no-mutating-props
      this.item.products.splice(productIndex, 1);
      this.checkCapacityOrderPickup();
    },
    /**
     * Cập nhật tên cho sản phẩm.
     * @param {any} productIndex Index của product cần sửa
     * * @param {any} productName Tên của sản phẩm cần sửa.
     */
    handleChangeProductName(productIndex, productName) {
      const product = this.item.products[productIndex];
      product.product_name = productName;
      product.name = productName;
      product.code = productName;
      product.type = 1;
      product.suggestSelectedItem = { name: productName };
      // eslint-disable-next-line vue/no-mutating-props
      this.item.products.splice(productIndex, 1, product);
    },
    /**
     * Chọn sản phẩm trong kho
     * @param {any} productIndex Index trong danh sách sản phẩm
     * @param {any} selectedObj Sản phẩm được chọn
     */
    handleSelectProduct(productIndex, selectedObj) {
      // const product = this.item.products[productIndex]
      const product = {};
      product.id = nanoid(8);
      product.product_id = get(selectedObj, "product_id");
      product.product_name = get(selectedObj, "full_name");
      product.full_name = get(selectedObj, "full_name");
      product.name = get(selectedObj, "full_name");
      product.type = get(selectedObj, "type");
      product.combo_products = get(selectedObj, "combo_products");
      product.weight = get(selectedObj, "weight", 0.1) || 0.1;
      product.product_unit_mass = get(selectedObj, "weight");
      product.product_unit_price = get(selectedObj, "money");
      product.money = this.currencyFormatter(get(selectedObj, "money"));
      product.retail_prices =
        this.currencyFormatter(get(selectedObj, "retail_prices") || 0) || 0;
      product.quantity = 1;
      product.code = get(selectedObj, "code", product.product_name);
      product.suggestSelectedItem = { name: product.product_name };
      product.product_name_flag = get(selectedObj, "name");
      if (product.type === 2) {
        product.combo_id = selectedObj.id;
      }
      product.tags = get(selectedObj, "tags");
      if (size(this.item.products) === 1 && `${this.item.pick_money}` === "0") {
        // eslint-disable-next-line vue/no-mutating-props
        this.item.pick_money = product.retail_prices;
      }
      const findedItemIndex = findIndex(
        this.item.products,
        (x) => `${x.product_id}` === `${selectedObj.product_id}`
      );
      const productRow = this.item.products[productIndex];
      if (findedItemIndex > -1) {
        // eslint-disable-next-line vue/no-mutating-props
        this.item.products.splice(findedItemIndex, 1);
      } else {
        if (!productRow?.product_name) {
          // eslint-disable-next-line vue/no-mutating-props
          this.item.products.splice(productIndex, 0, product);
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          this.item.products.push(product);
        }
      }
      this.checkCapacityOrderPickup();
    },
    /**
     * Check lại sản phẩm đang chọn đóng mở popup.
     */
    handleCloseProduct(productIndex) {
      if (
        !this.item.products[productIndex].product_name &&
        this.item.products.length > 1
      ) {
        // eslint-disable-next-line vue/no-mutating-props
        this.item.products.splice(productIndex, 1);
      }
      this.checkCapacityOrderPickup();
    },
    /**
     * Cập nhật Khối lượng của sản phẩm.
     */
    handleUpdateProductWeight() {
      this.checkBlockedAddress();
      this.checkCapacityOrderPickup();
    },
    /**
     * Cập nhật số lượng sản phẩm
     * */
    handleUpdateProductQuantity(productIndex) {
      const product = this.item.products[productIndex];
      if (product.code) {
        product.money = this.currencyFormatter(
          toNumber(product.quantity) *
            (toNumber(product.product_unit_price) || 0) || 0
        );
        product.weight =
          (
            toNumber(product.quantity) *
            (toNumber(product.product_unit_mass) || 0)
          ).toFixed(1) || 0.1;
        // eslint-disable-next-line vue/no-mutating-props
        this.item.products.splice(productIndex, 1, product);
        this.handleUpdateProductWeight();
      }
    },

    // ----------------------------------------------- MESSAGE --------------------------------------------------

    handleUpdateOrderMessage(messages) {
      // eslint-disable-next-line vue/no-mutating-props
      this.item.message = join(
        map(messages, (message) => message),
        ", "
      );
      if (this.isApplyAllMessage) {
        this.handleApplyAllByField("isApplyAllMessage", true);
      }
    },

    // ----------------------------------------------- WARE HOUSE --------------------------------------------------

    handleUpdateOrderPickTime() {
      if (this.isApplyAllPickTime) {
        this.handleApplyAllByField("isApplyAllPickTime", true);
      }
    },

    async handleUpdateOrderWarehouse() {
      if (this.isApplyAllWarehouse) {
        this.handleApplyAllByField("isApplyAllWarehouse", true);
      } else {
        this.checkCapacityOrderPickup();
      }
      if (!this.item.warehouse) {
        // Chưa có thông tin kho
        // this.$toast.error("Chưa chọn kho lấy");
        console.log("Chưa chọn kho lấy");
      } else if (
        !this.item.addressObj ||
        !this.item.addressObj.customer_province_id ||
        !this.item.addressObj.customer_district_id ||
        (!this.item.addressObj.customer_street_id &&
          !this.item.addressObj.customer_ward_id)
      ) {
        // Chưa có địa chỉ khách hàng
        // this.$toast.error("Chưa có địa chỉ khách hàng");
        console.log("Chưa có địa chỉ khách hàng");
      }
    },

    checkCapacityOrderPickup() {
      const orderId = this.item.orderId;
      if (this.item?.warehouse?.value) {
        this.handleBrowsePickTimes({
          warehouse: this.item.warehouse,
          products: this.item.products,
        }).then(({ pickup, type }) => {
          // eslint-disable-next-line vue/no-mutating-props
          this.item.transport_service = type;
          const nextPickTimes = {};
          nextPickTimes[`${orderId}`] = pickup;
          this.$store.commit("orderDraft/browsePickTimes", {
            nextPickTimes,
          });

          const capacityFindedIndex = findIndex(
            pickup,
            (item) => item.value === this.item.pick_time?.value
          );
          if (capacityFindedIndex > -1) {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.pick_time = pickup[capacityFindedIndex];
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.pick_time = pickup[0];
          }
        });
      }
    },

    // ----------------------------------------------- DỊCH VỤ VÀ HÌNH THỨC VẬN CHUYỂN --------------------------------------------------

    handleUpdateOrderShipMethod() {
      // eslint-disable-next-line vue/no-mutating-props
      if (this.isApplyAllTransport) {
        this.handleApplyAllByField("isApplyAllTransport", true);
      }
    },

    // ----------------------------------------------- PHÍ SHIP --------------------------------------------------

    handleUpdateOrderShipCusPay() {
      // eslint-disable-next-line vue/no-mutating-props
      if (this.isApplyAllFreeShip) {
        this.handleApplyAllByField("isApplyAllFreeShip", true);
      }
    },

    // ----------------------------------------------- PRINT --------------------------------------------------

    printOrder() {
      // this.$emit("printOrder", { orderId: this.item.orderId, option: option });
      let ids = this.item.draft_id;
      let routeData = this.$router.resolve({
        name: "in-don-nhap",
        params: {
          listIds: ids,
        },
      });
      window.open(routeData.href, "_blank");
      // window.open(`/web/in-don-nhap/${this.item.draft_id}`);
    },
  },
});
</script>

<style scoped>
.item-col {
  width: -moz-fit-content;
  width: fit-content;
  display: grid;
  min-width: 100%;
  border-bottom: 1px solid #dbdbdb;
}
.item-cell {
  padding: 0.25rem;
  border-right: 1px solid #dbdbdb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-cell-none {
  border-right: 1px solid #dbdbdb;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
