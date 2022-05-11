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
        @onPasteFromExcel="handlePasteFromExcel"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
      />
    </div>
    <div class="item-cell">
      <col-phone
        :dataSource="item.phone"
        :debounceConfig="debounceConfig"
        :customerDetail="item.customerDetail"
        @onPasteFromExcel="handlePasteFromExcel"
        @onUpdateItemByFieldName="handleUpdateItemByFieldName"
        @onGetCustomerInfoByPhone="handleGetCustomerInfoByPhone"
        @onUpdateDataPhoneInvalid="handleUpdateDataPhoneInvalid"
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
        :fetchingParseAllAddress="fetchingParseAllAddress"
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
        type="orderExcel"
        :messageData="item.message"
        :noteData="item.note"
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
        @onPasteFromExcel="handlePasteFromExcel"
        @onUpdateOrderMessage="handleUpdateOrderMessage"
        @onUpdateOrderTags="handleUpdateOrderTags"
        @onApplyAllByField="handleApplyAllByField"
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
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { nanoid } from "nanoid";
import { mapState } from "vuex";
import $ from "jquery";

import {
  debounce,
  find,
  findIndex,
  forEach,
  get,
  has,
  join,
  map,
  replace,
  size,
  toNumber,
  trim,
  values,
} from "lodash";

// Components
import ColAction from "@/components/table/columns-common/order-excel-col-action.vue";
import ColAddress from "@/components/table/columns-common/order-excel-col-address.vue";
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
let listFirstMount = [];

export default defineComponent({
  name: "order-excel-item",
  components: {
    ColAction,
    ColAddress,
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
  },
  async beforeMount() {
    this.debouncedHandleMouseOver = debounce(this.handleMouseOver, 200);
    this.debouncedHandleMouseLeave = debounce(this.handleMouseLeave, 200);
    this.handleCallCheckFirst();
    this.checkBlockedAddress();
  },
  mixins: [commonMixin, pickTimeMixin, addressMixin],
  data() {
    return {
      fetchingCustomerInfo: false,
      isHover: false,
      products: {},
      oldValue: {},
      // TODO NamVH: Giữ lại kịch bản check Xfast.
      isShowXfast: false,
      selectedAddressBlock: {
        address_ids: [],
      },
      blockedMessage: "",
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
    // TODO NamVH: Bỏ tạm XFast
    // fetchingCheckAllXFast() {
    //   return (
    //     this.$store.state.orderExcel.fetchingCheckAllXFast[this.orderId] ||
    //     false
    //   );
    // },
    ...mapState({
      shopType: (state) => Number(state.shop?.Shop?.shop_type),
    }),
    listPickTime() {
      const warehouse = get(this.item, "warehouse");
      const orderId = get(this.item, "orderId");
      if (!warehouse) {
        return [];
      }
      return this.$store.state.orderExcel.pickTimes[`${orderId}`] || [];
    },
    isSelected() {
      return (
        this.$store.state.orderExcel.selectedListOrder[this.orderId] || false
      );
    },
    fetchingParseAllAddress() {
      return (
        this.$store.state.orderExcel.fetchingParseAllAddress[this.orderId] ||
        false
      );
    },
  },
  watch: {
    item() {
      this.handleCallCheckFirst();
    },
  },
  methods: {
    handleCallCheckFirst() {
      const _firstMount = listFirstMount[`${this.orderId}`];
      if (!_firstMount) {
        // Do something.
        this.checkCapacityOrderPickup();
        listFirstMount[`${this.orderId}`] = true;
      }
    },
    // ----------------------------------------------- ORDER --------------------------------------------------
    handleSelectOrder(event) {
      this.$store.commit("orderExcel/selectOrder", {
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
      // console.log(this.item[`${data.name}`]);
    },

    handlePasteFromExcel(
      fieldName,
      event,
      fieldIndex,
      selectionStartIndex,
      selectionEndIndex
    ) {
      const vm = this;
      const pastedHtmlText = event.clipboardData.getData("text/html");
      const pastedText = event.clipboardData.getData("Text");
      if (pastedHtmlText && pastedHtmlText.includes("</table>")) {
        const startField = find(
          values(vm.excelColumns),
          (x) => x.name === fieldName
        );
        if (startField) {
          const startFieldIndex = startField.id;
          var el = document.createElement("html");
          el.innerHTML = pastedHtmlText;
          el.style.display = "none";
          el.setAttribute("id", "copyPasteExcel");
          $("body").append(el);
          setTimeout(() => {
            const data = [];
            const testIsPhone = new RegExp(
              // eslint-disable-next-line no-useless-escape
              /^((01[2689]|08|09|03|07|05|04|02[0123456789]|06)|(([\+]{0,1}84)(1[2689]|8|9|3|7|5|4|2[0123456789]|6)))[0-9]{8}$/
            );
            let phoneFieldName = null;
            let rowspan = 0;
            let tdOffset = 0;
            let isInOffset = false;
            $("#copyPasteExcel table tr").map(function () {
              // Dữ liệu dòng
              if (rowspan > 0) {
                isInOffset = true;
                --rowspan;
              }
              if (rowspan === 0 || !rowspan) {
                rowspan = 0;
                tdOffset = 0;
                isInOffset = false;
              }
              const order = {};
              $("td", this).each(function (cellIndex) {
                // Dữ liệu cột
                const orderFieldIndex =
                  startFieldIndex + cellIndex + (isInOffset ? tdOffset : 0);
                const orderField = vm.excelColumns[orderFieldIndex];
                if (orderField) {
                  const orderFieldName = orderField.name;
                  if (
                    startField !== "product_name" &&
                    startField !== "quantity" &&
                    startField !== "weight" &&
                    startField !== "money" &&
                    (rowspan === 0 || !rowspan)
                  ) {
                    rowspan = toNumber($(this).attr("rowspan"));
                  }
                  const productNameIndex = vm.excelColumns[5].id;
                  if (startFieldIndex < productNameIndex) {
                    tdOffset = productNameIndex - startFieldIndex;
                  }
                  const orderFieldData = replace(
                    trim($(this).val() || $(this).text()),
                    /\r?\n|\r|\n/g,
                    ""
                  ).replace(/\s\s+/g, " ");
                  if (!phoneFieldName) {
                    const isPhone = testIsPhone.test(orderFieldData);
                    if (orderFieldData && isPhone) {
                      phoneFieldName = orderFieldName;
                    }
                  }

                  if (orderFieldName === "phone") {
                    order[orderFieldName] = vm.numberParser(orderFieldData);
                  } else {
                    order[orderFieldName] = orderFieldData;
                  }
                }
              });
              if (
                isInOffset &&
                !has(order, "product_name") &&
                !has(order, "quantity") &&
                !has(order, "weight") &&
                !has(order, "money")
              ) {
                order.isMerge = true;
              }
              data.push(order);
            });
            const listOrder = [];
            forEach(data, (tempOrder) => {
              const newOrder = {
                products: [],
              };
              const tempProduct = {
                idLocal: nanoid(8),
              };
              forEach(tempOrder, (value, key) => {
                if (
                  key !== "product_name" &&
                  key !== "quantity" &&
                  key !== "weight" &&
                  key !== "money"
                ) {
                  if (key === "pick_money") {
                    newOrder[key] = value
                      ? this.currencyFormatter(
                          toNumber(replace(value, /,|\./g, "")) || 0
                        )
                      : 0;
                  } else {
                    newOrder[key] = value;
                  }
                } else {
                  if (key === "product_name") {
                    tempProduct.suggestSelectedItem = { name: value };
                    tempProduct.product_name = value;
                    tempProduct.tags = [];
                  } else {
                    if (key === "money") {
                      tempProduct[key] = value
                        ? this.currencyFormatter(
                            toNumber(replace(value, /,|\./g, "")) || 0
                          )
                        : 0;
                    } else {
                      tempProduct[key] = value
                        ? toNumber(replace(value, /,|\./g, "."))
                        : 0;
                    }
                  }
                }
              });
              if (size(tempProduct) > 0 && !newOrder.isMerge) {
                tempProduct.id = nanoid(8);
                // tempProduct.type = 1;
                if (
                  size(listOrder) > 0 &&
                  (fieldName === "name" || fieldName === "client_id") &&
                  !(
                    newOrder.name ||
                    newOrder.phone ||
                    newOrder.address ||
                    newOrder.client_id
                  )
                ) {
                  // Gộp sản phẩm hiện tại vào order trước đó
                  listOrder[size(listOrder) - 1].products.push(tempProduct);
                } else {
                  newOrder.products.push(tempProduct);
                  listOrder.push(newOrder);
                }
              } else if (newOrder.isMerge) {
                // do nothing
              } else {
                listOrder.push(newOrder);
              }
            });
            $("#copyPasteExcel").remove();
            this.$emit(
              "onApplyDataFromExcel",
              this.orderIndex,
              fieldIndex,
              startField,
              listOrder
            );
          }, 0);
        }
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
        } else if (fieldName === "phone") {
          // eslint-disable-next-line vue/no-mutating-props
          this.item[fieldName] = this.numberParser(pastedText);
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
            // TODO NamVH: ẩn tạm Xfast
            // if (this.isShowXfast) {
            //   this.$emit("onCheckXFastAll");
            // }
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
            if (this.item.warehouse?.value) {
              const pickup = await this.handleBrowsePickTimes({
                warehouse: this.item.warehouse,
                products: this.item.products,
              });
              listPickTime = pickup;
            } else {
              listPickTime = [];
            }
          }
          this.$store.commit("orderExcel/checkAllPickTime", {
            listPickTime,
            warehouse: {
              province_id: this.item.warehouse?.province_id,
              district_id: this.item.warehouse?.district_id,
            },
          });
        }, 0);
      }
      this.$store.commit("orderExcel/applyAllByField", {
        fieldName,
        fieldValue: checked,
      });
      // console.log(payload);
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
          message.error("Có lỗi khi lấy thông tin khách hàng.");
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

      // console.log("this.item.addressObj", this.item.addressObj);
      // console.log("addressObj", addressObj);

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
      // TODO NamVH: Ẩn XFAST
      // if (this.isShowXfast) {
      //   this.$nextTick(() => {
      //     this.handleCheckXFastSessions();
      //   });
      // }
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
      // TODO NamVH: Ẩn XFAST
      // if (this.isShowXfast) {
      //   this.handleCheckXFastSessions();
      // }
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
      if (this.item.products.length === 0) {
        this.handleAddProduct();
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
      if (this.item.products.length === 0) {
        this.handleAddProduct();
      }
      this.checkCapacityOrderPickup();
    },
    /**
     * Cập nhật Khối lượng của sản phẩm.
     */
    handleUpdateProductWeight() {
      // TODO NamVH: Bỏ tạm đoạn logic này.
      // const products = this.item.products;
      // const totalWeight = sumBy(products, (product) =>
      //   Number(product.weight)
      // ).toFixed(2);
      // if (totalWeight >= 20) {
      //   if (this.item.deliver_option) {
      //     // eslint-disable-next-line vue/no-mutating-props
      //     this.item.deliver_option = false;
      //     this.deleteBookingXfast(this.item.bookingId);
      //     // eslint-disable-next-line vue/no-mutating-props
      //     this.item.bookingId = "";
      //     // this.$toast.error(
      //     //   "GHTK không hỗ trợ XFAST với đơn hàng BBS (đơn hàng từ 20kg trở lên)"
      //     // );
      //   }
      // }
      this.checkCapacityOrderPickup();
      this.checkBlockedAddress();
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

    handleUpdateOrderTags() {
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
        message.error("Chưa chọn kho lấy");
      } else if (
        !this.item.addressObj ||
        !this.item.addressObj.customer_province_id ||
        !this.item.addressObj.customer_district_id ||
        (!this.item.addressObj.customer_street_id &&
          !this.item.addressObj.customer_ward_id)
      ) {
        // Chưa có địa chỉ khách hàng
        // this.$toast.error("Chưa có địa chỉ khách hàng");
        message.error("Chưa có địa chỉ khách hàng");
      } else {
        // TODO NamVH: Ẩn XFAST
        // if (this.isShowXfast) {
        //   // Call api để lấy thông tin XFast
        //   this.handleCheckXFastSessions();
        // }
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
          this.$store.commit("orderExcel/browsePickTimes", {
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
      // this.item.transport = get(transportObj, "value", "");
      if (this.isApplyAllTransport) {
        this.handleApplyAllByField("isApplyAllTransport", true);
      }
    },

    // ----------------------------------------------- PHÍ SHIP --------------------------------------------------

    handleUpdateOrderShipCusPay() {
      // eslint-disable-next-line vue/no-mutating-props
      // this.item.is_freeship = get(isFreeshipObj, "value", "");
      if (this.isApplyAllFreeShip) {
        this.handleApplyAllByField("isApplyAllFreeShip", true);
      }
    },

    // ----------------------------------------------- X-FAST --------------------------------------------------

    // TODO NamVH: Ẩn XFAST
    // async handleCheckXFastSessions() {
    //   try {
    //     this.isXfastLoading = !this.isXfastLoading;
    //     const booking = await this.getBookingXfast();
    //     if (booking && booking.success) {
    //       const xfastSessions = this.getTimeAvailable(
    //         booking.data.date_to_delay_pick
    //       );
    //       // eslint-disable-next-line vue/no-mutating-props
    //       this.item.deliver_option = true;
    //       // eslint-disable-next-line vue/no-mutating-props
    //       this.item.pick_session = get(xfastSessions, 0, null);
    //       // eslint-disable-next-line vue/no-mutating-props
    //       this.item.xfastSessions = xfastSessions;
    //       // eslint-disable-next-line vue/no-mutating-props
    //       this.item.bookingId = booking.data.booking_id;
    //       // eslint-disable-next-line vue/no-mutating-props
    //       this.item.xfastTime = Date.now();
    //       this.isXfastLoading = false;
    //     } else {
    //       if (this.item.deliver_option) {
    //         // this.$toast.error(
    //         //   "Không có ca lấy XFAST nào phù hợp cho đơn hàng này"
    //         // );
    //         console.log("Không có ca lấy XFAST nào phù hợp cho đơn hàng này");
    //       }
    //       // eslint-disable-next-line vue/no-mutating-props
    //       this.item.deliver_option = false;
    //       // eslint-disable-next-line vue/no-mutating-props
    //       this.item.bookingId = "";
    //       this.isXfastLoading = false;
    //     }
    //   } catch (error) {
    //     if (this.item.deliver_option) {
    //       // this.$toast.error(
    //       //   "Không có ca lấy XFAST nào phù hợp cho đơn hàng này"
    //       // );
    //       console.log("Không có ca lấy XFAST nào phù hợp cho đơn hàng này");
    //     }
    //     // eslint-disable-next-line vue/no-mutating-props
    //     this.item.deliver_option = false;
    //     // eslint-disable-next-line vue/no-mutating-props
    //     this.item.bookingId = "";
    //     this.isXfastLoading = false;
    //   }
    // },
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
