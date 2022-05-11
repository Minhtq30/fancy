<template>
  <div>
    <div v-if="loading">
      <a-spin tip="Đang cập nhật">
        <div className="content-temp" />
      </a-spin>
    </div>
    <div v-if="!loading" className="content-create-order-excel">
      <filter-order-excel
        :numberReport="numberReport"
        :invalid="numberInvalidOrder"
        :total="numberOrder"
        :listHubs="listHub"
        :listProduct="listProduct"
        :listPickTime="listPickTime"
        :packageLabels="packageLabels"
        @changeFilter="handleChangeFilter"
        @apply="handleApplyFilter"
        @onApplyConfig="handleApplyConfig"
        @onFilterMounted="handleFilterMounted"
      />
      <TableCreateOrder
        :provincesCache="provincesCache"
        :height="tableHeight"
        :indeterminate="indeterminate"
        :selectAll="selectAll"
        :debounceConfig="debounceConfig"
        :listOrder="filteredListOrder"
        :expNotes="expNotes"
        :excelColumns="excelColumns"
        :packageLabels="packageLabels"
        @onInputSelectAll="handleSelectAll"
        @onSwapOrder="handleSwapOrder"
        @onRemoveOrder="handleRemoveOrder"
        @onApplyDataFromExcel="handleApplyDataFromExcel"
        @onCheckCapacityPickupAll="handleCheckCapacityPickupAll"
        @applyAllByField="handleApplyAllByField"
      />
      <div className="footer-order-excel">
        <footer-order-excel
          :ruleCheck="ruleCheck"
          :loadingUpGHTK="loadingUpGHTK"
          :hideUploadOrder="hideUploadOrder"
          :fetchingSaveOrder="fetchingSaveOrder"
          :selectedListOrder="selectedListOrder"
          :selectedValidListOrder="selectedValidListOrder"
          @addNewOrder="handleAddNewOrder"
          @updateRuleCheck="handleUpdateRuleCheck"
          @saveListOrder="handleSaveListOrder"
          @removeListOrder="handleRemoveOrders"
          @onSubmit="submitGHTK"
        />
      </div>
    </div>
  </div>
</template>

<script>
// TODO NamVH: Component hiện dang copy từ moshop sang nên một số code có thể thừa. nếu người dùng đọc code thấy thừa có thể bỏ hoặc xóa đoạn code thừa đó đi

import {
  chunk,
  debounce,
  filter,
  find,
  findIndex,
  forEach,
  get,
  has,
  includes,
  isUndefined,
  keys,
  map,
  size,
  sumBy,
  trim,
  values,
  uniqBy,
  isEmpty,
  orderBy,
} from "lodash";
import { mapState } from "vuex";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import $ from "jquery";

// Components
import { message } from "ant-design-vue";
import { TableCreateOrder } from "@/components";
import FilterOrderExcel from "@/components/filter/filter-order-excel/index.vue";
import FooterOrderExcel from "@/components/footer-action/footer-order-excel/index.vue";

// Service
import services from "@/services";

// Mixins
import commonMixin from "@/plugins/mixins/common";
import loadingMixin from "@/plugins/mixins/loading";
import productMixin from "@/plugins/mixins/product";
import warehouseMixin from "@/plugins/mixins/warehouse";
import pickTimeMixin from "@/plugins/mixins/pickTime";
import {
  DEFAULT_BBS_MAX_VALUE,
  DEFAULT_EXPRESS_MAX_VALUE,
  TCID,
} from "@/contants/order";
import orderExcel from "@/plugins/mixins/orderExcel";
import {
  DEFAULT_BBS_MAX_WEIGHT,
  DEFAULT_BBS_MIN_WEIGHT,
  EXTRA_BBS_PROVINCES,
} from "@/contants/order";
const worker = new Worker("../excel-worker.js");

// Lưu trữ provinces ra ngoài để hạn chế cho Vuejs.
let provinces = {};

export default {
  components: {
    TableCreateOrder,
    FilterOrderExcel,
    FooterOrderExcel,
  },
  mixins: [
    commonMixin,
    loadingMixin,
    productMixin,
    warehouseMixin,
    pickTimeMixin,
    orderExcel,
  ],
  created() {
    window.addEventListener("beforeunload", this.handleUnload);
  },
  data() {
    return {
      listWaitingWarehouse: [],
      parseAddressLoading: false,
      selectAll: false,
      indeterminate: false,
      // pendingStatus: {
      //   pending: 0,
      // },
      sessionInterval: null,
      sessionStorage: [],
      // listWaitingOrder: [],
      listAllAddress: [],
      // listCheckXFast: [],
      listOrder: [],
      listError: [],
      filterParam: {},
      // customerProfileModal: {
      //   customer_fullname: "",
      //   tel: null,
      //   channel: null,
      //   actionCount: 0,
      // },
      loadingUpGHTK: false,
      // fetchingPrintOrder: false,
      fetchingSaveOrder: false,
      ruleCheck: true,
      // fetchingUploadListOrder: false,
      // fetchingUploadListOrderToGhtk: false,
      batchId: null,
      keyNotify: nanoid(8),
      provincesCache: [],
      packageLabels: [],
      filterHeight: 60,
    };
  },
  watch: {
    listOrder: {
      handler(newOrders) {
        this.debouncedSaveLocal(newOrders);
        this.debouncedValidateListOrder(newOrders);
        // TODO NamVH: Bỏ tạm log.
        // this.debounceHandleSaveLogOrder(newOrders);
      },
      deep: true,
    },
    numberOrder(value) {
      if (value === 0) {
        this.batchId = uuidv4();
        this.$store.state.sessionStorage.order_excel_config.batchId =
          this.batchId;
        this.indeterminate = false;
        this.selectAll = false;
      }
    },
    selectedListOrder(newVal) {
      if (newVal.length === 0) {
        this.indeterminate = false;
        this.selectAll = false;
      } else if (newVal.length === this.numberOrder) {
        this.indeterminate = false;
        this.selectAll = true;
      } else {
        this.indeterminate = true;
        this.selectAll = true;
      }
    },
  },
  async mounted() {
    this.debouncedSaveLocal = debounce(this.handleSaveLocal, 500);
    // this.debounceHandleSaveLogOrder = debounce(this.handleSaveLogOrder, 3000);
    this.debouncedValidateListOrder = debounce(
      this.handleValidateListOrder,
      500
    );

    // Đồng bộ dữ liệu từ IndexDB lên VueX.
    await this.syncDataFromDatabase();

    // Lấy danh sách kho hàng. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    await this.handleBrowseListHub();
    await this.setUpConfig();
    // Xét config default. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    // this.handleSetDefaultFastOrderConfig();
    // Lấy danh sách order đang được lưu trong localStorage. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    this.handleBrowseListOrder();
    // Lấy danh sách sản phẩm. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    this.handleSearchProductByName();
    // Get Default Tag.
    // await this.getPackageLabel();

    //update
    worker.onmessage = ({ data }) => {
      this.listError = data.listError;
    };
    // TODO NamVH: ẩn X-fast
    // if (this.isShowXfast) {
    //   this.checkXfastAll();
    // }

    const provincesTemp =
      (await services.$address.browseProvinceListWithCache()) || [];
    provincesTemp.forEach((item) => {
      provinces[item.id] = item;
    });
    this.provincesCache = provinces;
  },
  computed: {
    ...mapState({
      notDeliverOptionTag() {
        return this.$store.getters["shop/notDeliverOptionTag"] != 0
          ? this.$store.getters["shop/notDeliverOptionTag"]
          : TCID;
      },
    }),
    ...mapState("localStorage", {
      orderConfig: (state) => state.config.global?.order,
    }),
    tagList() {
      return this.$store.state.constant.tagListExcel.filter((tag) => {
        //tagList exclude key 12 (Cho COD sửa tiền thu hộ)
        return ![12].includes(tag.key);
      });
    },
    bbsWeight() {
      return get(this.orderConfig, "bbs.weight");
    },
    excelColumns() {
      return this.$store.state.orderExcel.excelColumns;
    },
    expNotes() {
      return this.$store.state.constant.expNotes;
    },
    debounceConfig() {
      const numberItemListOrder = this.numberOrder;
      if (numberItemListOrder <= 500) {
        return 250;
      } else if (numberItemListOrder > 500 && numberItemListOrder <= 3000) {
        return 500;
      } else if (numberItemListOrder > 3000 && numberItemListOrder <= 6000) {
        return 900;
      } else {
        return 1200;
      }
    },
    typeFilter() {
      return get(this.$store.state.orderExcel, "typeFilter", "total");
    },
    selected() {
      return get(this.$store.state.orderExcel, "selectedListOrder", {});
    },
    showCustomerInfoModal() {
      return get(this.$store.state.orderExcel, "showCustomerInfoModal", false);
    },
    selectManyMode() {
      return get(this.$store.state.orderExcel, "selectManyMode", false);
    },
    showQuickConfigModal() {
      return get(this.$store.state.orderExcel, "showQuickConfigModal", false);
    },
    confirmGHTKTrigger() {
      return get(this.$store.state.orderExcel, "confirmGHTKTrigger", false);
    },
    customerInfo() {
      return get(this.$store.state.orderExcel, "customerInfo", {});
    },
    tableHeight() {
      const headerHeight = 64;
      const tableHeader = 57;
      const tableFooterHeight = 68;
      return `calc(100vh - ${
        headerHeight + tableHeader + tableFooterHeight + this.filterHeight
      }px)`;
    },
    numberOrder() {
      return size(this.listOrder);
    },
    // numberWarningOrder () {
    //   return size(this.listOrder.filter(order => (order.customerDetail && order.customerDetail.packages && order.customerDetail.packages.length > 0)))
    // },
    numberInvalidOrder() {
      const listError = this.listError;
      const result = size(filter(listError, (x) => typeof x !== "undefined"));
      return result;
    },
    selectedListOrder() {
      const result = filter(
        this.listOrder,
        (x) => this.selected[x.orderId] === true
      );
      return result;
    },
    selectedValidListOrder() {
      const numberOrder = this.numberOrder;
      const listOrder = this.listOrder;
      const listError = this.listError;
      const result = [];
      for (let i = 0; i < numberOrder; i++) {
        const order = listOrder[i];
        if (
          isUndefined(listError[i]) &&
          this.selected[order.orderId] === true
        ) {
          result.push(order);
        }
      }
      return result;
    },
    hideUploadOrder() {
      return (
        !this.ruleCheck ||
        this.fetchingSaveOrder ||
        size(this.selectedValidListOrder) === 0
      );
    },
    listHub() {
      return this.$store.state.orderExcel.listWarehouse;
    },
    listProduct() {
      const result = [];
      forEach(this.listOrder, (order) =>
        forEach(order.products, (product) => {
          if (
            trim(product.product_name) &&
            !includes(result, trim(product.product_name))
          ) {
            result.push(product.product_name);
          }
        })
      );
      return result;
    },
    listPickTime() {
      const result = [];
      forEach(this.listOrder, (order) => {
        if (order.pick_time) {
          result.push(order.pick_time);
        }
      });
      return uniqBy(result, function (e) {
        return e.id;
      });
    },
    orderExcelConfig() {
      return this.$store.state.sessionStorage.order_excel_config || {};
    },
    filteredListOrder() {
      const numberOrder = this.numberOrder;
      const listOrder = this.listOrder;
      const listError = this.listError;
      let result = [];
      const listOrderId = [];
      if (this.typeFilter === "total") {
        result = listOrder;
      } else if (this.typeFilter === "invalid") {
        for (let i = 0; i < numberOrder; i++) {
          const order = listOrder[i];
          if (listError[i] || order.invalid === true) {
            listOrderId.push(order.orderId);
          }
        }
      } else if (this.typeFilter === "valid") {
        for (let count = 0; count < numberOrder; count++) {
          const order = listOrder[count];
          const invalid = listOrder[count].invalid;
          if (isUndefined(listError[count]) || !listError[count] || !invalid) {
            listOrderId.push(order.orderId);
          }
        }
      }
      // else if (this.typeFilter === 'warning') {
      //   for (let i = 0; i < numberOrder; i++) {
      //     const order = listOrder[i]
      //     if ((order && order.customerDetail && order.customerDetail.packages && order.customerDetail.packages.length > 0)) {
      //       listOrderId.push(order.orderId)
      //     }
      //   }
      // }
      if (size(listOrderId) > 0) {
        result = filter(listOrder, (x) => listOrderId.includes(x.orderId));
      }
      if (size(result) > 0 && size(this.filterParam) > 0) {
        result = filter(result, (order) => {
          // Filter by customer
          if (
            size(this.filterParam.customer) > 0 &&
            !this.filterParam.customer.find((customer) => {
              const colors = order.customerDetail?.colors || [];
              return includes(colors, `${customer}`);
            })
          ) {
            return false;
          }

          // Filter by pickTime.
          if (
            size(this.filterParam.pickTime) > 0 &&
            !this.filterParam.pickTime.find((time) => {
              return `${time}` === `${order?.pick_time?.id}`;
            })
          ) {
            return false;
          }

          // Filter by warehouse.
          if (
            size(this.filterParam.warehouse) > 0 &&
            !this.filterParam.warehouse.find(
              (wareHouseId) => `${wareHouseId}` === `${order.warehouse?.id}`
            )
          ) {
            return false;
          }

          // Filter by product
          if (
            size(this.filterParam.products) > 0 &&
            !this.filterParam.products.find((prodName) => {
              return order.products.find(
                (oProd) => oProd.product_name === prodName
              );
            })
          ) {
            return false;
          }

          // Filter by pattern
          if (this.filterParam.pattern && this.filterParam.pattern.length) {
            const pattern = this.filterParam.pattern.trim().toLowerCase();
            if (
              !(
                (order.client_id &&
                  order.client_id.toLowerCase().includes(pattern)) ||
                (order.name && order.name.toLowerCase().includes(pattern)) ||
                (order.phone && order.phone.toLowerCase().includes(pattern))
              )
            ) {
              return false;
            }
          }

          // Filter by region.
          if (this.filterParam.location) {
            const typeLocation = this.checkRegion(
              order.warehouse,
              order.addressObj
            );
            if (
              !(this.filterParam.location === typeLocation) ||
              !typeLocation
            ) {
              return false;
            }
          }

          // Filter by province.
          if (size(this.filterParam.locationMulti) > 0) {
            if (
              !this.filterParam.locationMulti.includes(
                `${order.addressObj.customer_province_id}`
              )
            ) {
              return false;
            }
          }

          // Filter by "Tiền thu hộ"
          if (
            size(this.filterParam.cash) > 0 &&
            this?.filterParam?.cash?.includes("range")
          ) {
            const _pick_money = Number(
              `${order.pick_money}`.replaceAll(",", "")
            );
            const _from = Number(
              `${this.filterParam.cashRange.from || "0"}`.replaceAll(",", "")
            );
            const _to = Number(
              `${this.filterParam.cashRange.to || "0"}`.replaceAll(",", "")
            );

            if (!(_pick_money > _from && _pick_money < _to)) {
              return false;
            }
          }

          return true;
        });
      }

      if (
        size(this.filterParam.cash) > 0 &&
        this?.filterParam?.cash?.includes("increase")
      ) {
        // Xếp tăng dần.
        result = orderBy(
          result,
          (item) => Number(`${item.pick_money}`.replaceAll(",", "")),
          "asc"
        );
      }

      if (
        size(this.filterParam.cash) > 0 &&
        this?.filterParam?.cash?.includes("decrease")
      ) {
        // Xếp giảm.
        result = orderBy(
          result,
          (item) => Number(`${item.pick_money}`.replaceAll(",", "")),
          "desc"
        );
      }

      return result;
    },
    numberReport() {
      const result = {
        shopReport: 0,
        shipperReport: 0,
        boom5Order: 0,
        boom10Order: 0,
        boomKhogiao: 0,
      };
      forEach(this.listOrder, (order) => {
        if (order.customerDetail) {
          result.shipperReport += includes(
            order.customerDetail.colors,
            "yellow"
          );

          if (!includes(order.customerDetail.colors, "yellow")) {
            result.shipperReport +=
              order.customerDetail.reports &&
              order.customerDetail.reports.length
                ? 1
                : 0;
          }
          result.boom5Order += includes(order.customerDetail.colors, "red");
          result.boom10Order += includes(order.customerDetail.colors, "purple");
          result.boomKhogiao += includes(
            order.customerDetail.colors,
            "superRed"
          );
        }
        result.shopReport +=
          order.customerDetail &&
          order.customerDetail.flags &&
          order.customerDetail.flags.length
            ? 1
            : 0;
      });
      return result;
    },
    // TODO NamVH: ẩn X-Fast
    // isShowXfast() {
    //   return false;
    // },
  },
  methods: {
    // ---------------------------------- TAGS ---------------------------------
    async getPackageLabel() {
      let res = await services.$package.browsePackageLabel();
      if (res && res.success) {
        let converted = map(get(res, "data", []), (x) => ({
          label: x.name,
          value: x.id,
          isSelected: false,
          payload: x,
        }));
        this.packageLabels = converted;
        let tag_tieu_chuan = find(
          this.packageLabels,
          (x) => x.label === "Tiêu chuẩn"
        );
        if (tag_tieu_chuan) {
          tag_tieu_chuan.value = TCID; // TODO NamVH: Fix tạm do dữ liệu không có value.
        }
        this.packageLabels = [...map(converted, (x) => ({ ...x }))];
      }
    },
    resetListOrderTags() {},
    // ------------------------------------- SYNC DATA -----------------------------
    async handleUnload() {
      await services.$package.browserSaveToIndexDB(
        this.$store.state.sessionStorage
      );
    },
    async syncDataFromDatabase() {
      const dataCache = await services.$package.browserGetOrderExcel();
      if (dataCache) {
        this.$store.commit("sessionStorage/saveListOrder", {
          listOrder: dataCache.savedListOrder,
        });
        this.$store.commit("sessionStorage/order_excel_config", dataCache);
        this.$store.commit("sessionStorage/list_hub", dataCache);
      }
    },
    // ------------------------------------- CONFIG -----------------------------
    async setUpConfig() {
      await this.$store.dispatch("shop/getShopConfig");
      const shopConfig = this.$store.state.shop;
      const defaultTags = [
        this.notDeliverOptionTag,
        ...shopConfig.shopConfigTags.filter((item) => {
          return item != 12;
        }),
      ] || [TCID];
      const defaultNotDeliveredFee = shopConfig.policyShopInfo.deliver_package
        .not_delivered_fee.fee
        ? shopConfig.policyShopInfo.deliver_package.not_delivered_fee.fee
        : 0;
      // reset list order
      if (
        !this.$store.state.sessionStorage.order_excel_config
          .not_delivered_option
      ) {
        this.$store.state.sessionStorage.savedListOrder.forEach((order) => {
          order.tags = defaultTags;
          order.not_delivered_option = this.notDeliverOptionTag;
          order.not_delivered_fee = defaultNotDeliveredFee;
          order.messages = [];
          order.message = this.generateMessage(
            order.tags,
            order.not_delivered_fee,
            this.tagList
          );
        });
      }

      // reset config
      let defautConfig = {
        warehouse: this.listHub[0],
        transport: "road",
        shipPay: shopConfig.policyShopInfo.fee.is_freeship ? "shop" : "khach",
        tags: defaultTags,
        message: this.generateMessage(
          defaultTags,
          defaultNotDeliveredFee,
          this.tagList
        ),
        not_delivered_option: this.notDeliverOptionTag,
        not_delivered_fee: defaultNotDeliveredFee,
        bbs: {
          weight: {
            min: DEFAULT_BBS_MIN_WEIGHT,
            max: DEFAULT_BBS_MAX_WEIGHT,
          },
        },
      };
      this.$store.state.sessionStorage.order_excel_config = defautConfig;
    },
    handleFilterMounted() {
      const filterDom = document.getElementById("filter-excel");
      this.filterHeight = filterDom.offsetHeight;
    },
    /**
     * Apply config for Row in Order Excel.
     */
    handleApplyConfig(orderExcelConfig) {
      const configFreeShip = get(orderExcelConfig, "shipPay") || "khach";
      const configWarehouse = get(orderExcelConfig, "warehouse")
        ? get(orderExcelConfig, "warehouse")
        : undefined;
      const configTransport = get(orderExcelConfig, "transport") || "road";
      const configMessage = get(orderExcelConfig, "message", "") || "";
      const configMessages = get(orderExcelConfig, "messages", []) || [];
      const configTags = get(orderExcelConfig, "tags", [TCID]) || [TCID];
      const configProducts = get(orderExcelConfig, "products", []) || [];
      const configPickTime = get(orderExcelConfig, "pick_time", null);
      const configNotDeliveredFee =
        get(orderExcelConfig, "not_delivered_fee", "0") || "0";
      let configNotDeliveredOption;
      configTags.filter((item) => {
        if (this.notDeliverOptionsKey.includes(item)) {
          configNotDeliveredOption = item;
          return;
        }
      });
      for (let i = 0; i < this.numberOrder; i++) {
        const order = this.listOrder[i];
        if (!(order.name || order.phone || order.address)) {
          order.message = configMessage;
          order.messages = configMessages;
          order.tags = configTags;
          order.shipPay = configFreeShip;
          order.transport = configTransport;
          order.warehouse = configWarehouse;
          order.pick_time = configPickTime;
          order.not_delivered_option = configNotDeliveredOption;
          order.not_delivered_fee = configNotDeliveredFee;
          if (configProducts && size(configProducts) > 0) {
            order.products = map(configProducts, (pro) => ({
              ...pro,
              id: nanoid(8),
              product_name: pro.full_name || "",
              type: pro.type || 1,
              product_unit_mass: get(pro, "weight", 0),
              product_unit_price: get(pro, "money", 0),
              suggestSelectedItem: { name: pro.full_name },
              code: pro.code || "",
              quantity: 1,
              weight: pro.weight || 0.1,
              money: this.currencyFormatter(pro.money) || 0,
              retail_prices: this.currencyFormatter(pro.retail_prices) || 0,
            }));
            if (size(configProducts) > 0 && `${order.pick_money}` === "0") {
              order.pick_money = this.currencyFormatter(
                sumBy(configProducts, (product) => product.retail_prices || 0)
              );
            }
            if (!has(order, "pick_money")) {
              order.pick_money = 0;
            }
          }
        }
      }
    },
    /**
     * Xét data mặc định cho Order Excel.
     */
    handleSetDefaultFastOrderConfig() {
      const savedConfig = get(
        this.$store.state.sessionStorage,
        "order_excel_config",
        {}
      );
      if (size(savedConfig) === 0) {
        const defaultConfig = {
          warehouse: this.listHub[0],
          transport: "road",
          shipPay: "shop",
          bbs: {
            weight: {
              min: DEFAULT_BBS_MIN_WEIGHT,
              max: DEFAULT_BBS_MAX_WEIGHT,
            },
          },
        };
        this.$store.state.sessionStorage.order_excel_config = defaultConfig;
      }
    },
    // ------------------------------------- PARSE EXCEL -----------------------------
    handleApplyDataFromExcel(
      orderIndex = 0,
      copyProductIndex,
      startField,
      listOrder
    ) {
      this.parseAddressLoading = true;
      const vm = this;
      const rowIndex = orderIndex;
      const rowProductIndex = copyProductIndex || 0;
      const configFreeShip = get(this.orderExcelConfig, "shipPay") || "khach";
      const configWarehouse = get(this.orderExcelConfig, "warehouse")
        ? get(this.orderExcelConfig, "warehouse")
        : undefined;
      const configTransportService =
        get(this.orderExcelConfig, "transport_service") || "Express";
      const configTransport = get(this.orderExcelConfig, "transport") || "road";
      const configMessage = get(this.orderExcelConfig, "message", "") || "";
      const configMessages = get(this.orderExcelConfig, "messages", []) || [];
      const configTags = get(this.orderExcelConfig, "tags", [TCID]) || [TCID];
      const configProducts = get(this.orderExcelConfig, "products", []) || [];
      const configPickTime = get(this.orderExcelConfig, "pick_time", null);
      const configNotDeliveredFee = get(
        this.orderExcelConfig,
        "not_delivered_fee",
        0
      );
      const configNotDeliveredOption = get(
        this.orderExcelConfig,
        "not_delivered_option",
        TCID
      );
      const numberOfListOrder = size(listOrder);
      let newOrderIndex = 0;
      const tempListOrder = [];
      const tempListOrderHasPhone = [];
      const tempListOrderHasProduct = [];
      while (newOrderIndex < numberOfListOrder) {
        const newOrder = listOrder[newOrderIndex];
        const preOrder = vm.listOrder[rowIndex + newOrderIndex];
        // const rawData = {}
        if (preOrder) {
          const keysInOrder = keys(newOrder);
          forEach(keysInOrder, (key) => {
            const newOrderValue = newOrder[key];
            if (key !== "products") {
              preOrder[key] = newOrderValue;
              // rawData[key] = newOrderValue
            } else {
              if (newOrderValue && size(newOrderValue) > 0) {
                forEach(newOrderValue, (product, productIndex) => {
                  const tempProduct = product;
                  const prevOrderListProduct = preOrder.products;
                  if (size(prevOrderListProduct) === 0) {
                    if (!tempProduct.quantity) {
                      tempProduct.quantity = 1;
                    }
                    if (!tempProduct.weight) {
                      tempProduct.weight = 0.1;
                    }
                    if (!tempProduct.money) {
                      tempProduct.money = 0;
                    }
                    preOrder.products = [tempProduct];
                  } else {
                    let preProduct =
                      preOrder.products[rowProductIndex + productIndex];
                    if (preProduct) {
                      // TODO NamVH: Bỏ tạm việc xóa ID để sinh ra sản phẩm mới. => Thay đổi để cập nhật lại bộ verify cho product.
                      // if (preProduct.id) {
                      //   delete tempProduct.id;
                      // }
                      preProduct = { ...preProduct, ...tempProduct };
                      if (!preProduct.quantity) {
                        preProduct.quantity = 1;
                      }
                      if (!preProduct.weight) {
                        preProduct.weight = 0.1;
                      }
                      if (!preProduct.money) {
                        preProduct.money = 0;
                      }
                      // preProduct.code = "";
                      preOrder.products.splice(
                        rowProductIndex + productIndex,
                        1,
                        preProduct
                      );
                    } else {
                      if (!tempProduct.quantity) {
                        tempProduct.quantity = 1;
                      }
                      if (!tempProduct.weight) {
                        tempProduct.weight = 0.1;
                      }
                      if (!tempProduct.money) {
                        tempProduct.money = 0;
                      }
                      tempProduct.code = "";
                      preOrder.products.push({
                        ...tempProduct,
                      });
                    }
                  }
                });
              }
            }
          });
          const tempOrder = {
            ...preOrder,
          };
          if (!tempOrder.deliver_option) {
            tempOrder.deliver_option = false;
          }
          if (!tempOrder.addressObj) {
            tempOrder.addressObj = {};
          }
          if (!tempOrder.not_delivered_fee) {
            tempOrder.not_delivered_fee = configNotDeliveredFee;
          }
          if (!tempOrder.not_delivered_option) {
            tempOrder.not_delivered_option = configNotDeliveredOption;
          }
          if (!tempOrder.pick_session) {
            tempOrder.pick_session = {};
          }
          if (!tempOrder.xfastSessions) {
            tempOrder.xfastSessions = [];
          }
          // if (
          //   size(tempOrder.products) === 1 &&
          //   (!has(rawData, 'pick_money'))
          // ) {
          //   tempOrder.pick_money = tempOrder.products[0].money
          // } else {
          //   tempOrder.pick_money = tempOrder.pick_money || 0
          // }
          if (
            !has(tempOrder, "pick_money") &&
            configProducts &&
            size(configProducts) > 0
          ) {
            tempOrder.pick_money = this.currencyFormatter(
              sumBy(configProducts, (product) => product.retail_prices || 0)
            );
          }
          if (!has(tempOrder, "pick_money")) {
            tempOrder.pick_money = 0;
          }
          if (has(newOrder, "address")) {
            tempListOrder.push(tempOrder);
          }
          if (has(newOrder, "products")) {
            tempListOrderHasProduct.push(tempOrder);
          }
          if (has(newOrder, "phone")) {
            tempListOrderHasPhone.push(tempOrder);
          }
          vm.listOrder.splice(rowIndex + newOrderIndex, 1, tempOrder);
        } else {
          const tempOrder = {
            ...newOrder,
            customerDetail: {},
            pick_session: {},
            xfastSessions: [],
            deliver_option: false,
            invalid: true,
            orderId: nanoid(8),
            shipPay: configFreeShip,
            transport: configTransport,
            transport_service: configTransportService,
            warehouse: configWarehouse,
            pick_time: configPickTime,
            tags: configTags,
            not_delivered_fee: configNotDeliveredFee,
            not_delivered_option: configNotDeliveredOption,
            products:
              newOrder.products && size(newOrder.products) > 0
                ? map(newOrder.products, (product) => {
                    if (!product.quantity) {
                      product.quantity = 1;
                    }
                    if (!product.weight) {
                      product.weight = 0.1;
                    }
                    if (!product.money) {
                      product.money = 0;
                    }
                    product.code = "";
                    return product;
                  })
                : configProducts && size(configProducts) > 0
                ? map(configProducts, (pro) => ({
                    ...pro,
                    id: nanoid(8),
                    product_name: pro.full_name || "",
                    type: pro.type || 1,
                    product_unit_mass: get(pro, "weight", 0.1),
                    product_unit_price: get(pro, "money", 0),
                    suggestSelectedItem: { name: pro.full_name },
                    code: pro.code || "",
                    quantity: 1,
                    weight: pro.weight || 0.1,
                    money: this.currencyFormatter(pro.money) || 0,
                  }))
                : [
                    {
                      id: nanoid(8),
                      product_name: "",
                      suggestSelectedItem: { name: "" },
                      code: "",
                      quantity: 1,
                      weight: 0.1,
                      money: 0,
                    },
                  ],
          };
          if (!tempOrder.addressObj) {
            tempOrder.addressObj = {};
          }
          if (!has(tempOrder, "message")) {
            tempOrder.message = configMessage;
            tempOrder.messages = configMessages;
          } else {
            tempOrder.messages = [];
          }
          // if (
          //   size(tempOrder.products) === 1 &&
          //   (!has(tempOrder, 'pick_money') || tempOrder.pick_money == 0)
          // ) {
          //   tempOrder.pick_money = tempOrder.products[0].money
          // } else {
          //   tempOrder.pick_money = tempOrder.pick_money || 0
          // }
          if (
            !has(tempOrder, "pick_money") &&
            configProducts &&
            size(configProducts) > 0
          ) {
            tempOrder.pick_money = this.currencyFormatter(
              sumBy(configProducts, (product) => product.retail_prices || 0)
            );
          }
          if (!has(tempOrder, "pick_money")) {
            tempOrder.pick_money = 0;
          }
          if (has(newOrder, "address")) {
            tempListOrder.push(tempOrder);
          }
          if (has(newOrder, "products")) {
            tempListOrderHasProduct.push(tempOrder);
          }
          if (has(newOrder, "phone")) {
            tempListOrderHasPhone.push(tempOrder);
          }
          vm.listOrder.push(tempOrder);
        }
        ++newOrderIndex;
      }
      this.$nextTick(() => {
        const listAllPhone = this.listOrder
          .slice(orderIndex, orderIndex + size(tempListOrderHasPhone))
          .filter((x) => x.phone);
        vm.handleGetColorByPhone(listAllPhone);
        const listAllAddress = map(
          this.listOrder
            .slice(orderIndex, orderIndex + size(tempListOrder))
            .filter((x) => x.address && x.address.length > 2),
          (order) => ({
            tel: order.phone,
            address: order.address,
            orderId: order.orderId,
          })
        );
        vm.handlePreParseAllAddress(listAllAddress);
        const listAllCheckPickTime = map(
          this.listOrder
            .slice(orderIndex, orderIndex + size(tempListOrderHasProduct))
            .filter(
              (x) =>
                x.warehouse &&
                x.warehouse.province_id &&
                x.warehouse.district_id
            ),
          (order) => ({
            order_id: order.orderId,
            pick_address_id: order.warehouse.hub_code,
            province_id: order.warehouse.province_id,
            district_id: order.warehouse.district_id,
            ward_id: order.warehouse.ward_id,
            street_id: order.warehouse.street_id,
            hamlet_id: order.warehouse.hamlet_id,
            weight: sumBy(order.products, (product) =>
              Number(product.weight)
            ).toFixed(2),
          })
        );
        vm.handleCheckCapacityPickupAll(listAllCheckPickTime);
      });
    },
    // ----------------------------------- FUNCTION HELP DATA ----------------------------------------
    /**
     * Check cùng khu vực hay không.
     */
    checkRegion(wareHouse = {}, address = {}) {
      if (isEmpty(wareHouse) || isEmpty(address)) return null;

      if (`${wareHouse.province_id}` === `${address.customer_province_id}`) {
        return "noi_tinh";
      }

      if (
        `${provinces[wareHouse.province_id].region}` ===
        `${provinces[address.customer_province_id].region}`
      ) {
        return "noi_mien";
      } else {
        return "lien_mien";
      }
    },
    /**
     * Scroll to bottom.
     */
    handleScrollToBottom: debounce(() => {
      $("div.scroller").animate({ scrollTop: 999999999 }, 200, "swing");
    }),
    /**
     * Convert order to upload order.
     */
    formatOrderToUpload(order) {
      const findedHub = find(
        this.listHub,
        (x) => x.id === get(order, "warehouse.id")
      );
      const reqObj = {
        pkg_draft_id: order.id || undefined,
        customer_tel: order.phone,
        customer_fullname: order.name,
        Order: [],
        not_delivered_fee: order.not_delivered_fee,
        pick_address_id: order.warehouse?.id,
        pick_province_id:
          order.warehouse && order.warehouse.province_id
            ? order.warehouse.province_id
            : get(findedHub, "province_id"),
        pick_district_id:
          order.warehouse && order.warehouse.district_id
            ? order.warehouse.district_id
            : get(findedHub, "district_id"),
        pick_address_name: order.warehouse?.label,
        // TODO NamVH: Bỏ tạm type của warehouse.
        hub_type: order.warehouse?.hub_type ? order.warehouse?.hub_type : "kho",
        province_name: order.warehouse?.province,
        district_name: order.warehouse?.district,
        pick_money: parseInt(this.vndToNumber(order.pick_money)),
        transport: order.transport,
        is_freeship: order.shipPay === "shop",
        client_id: order.client_id,
        message: order.message,
        tags: order.tags,
        // messages: order.messages,
        pick_time: order.pick_time
          ? order.pick_time.type
          : this.pickTimes && this.pickTimes.length > 0
          ? this.pickTimes[0].type
          : "sang_mai",
        pick_time_slot: order.pick_time
          ? order.pick_time.pick_time_slot
          : this.pickTimes && this.pickTimes.length > 0
          ? this.pickTimes[0].pick_time_slot
          : "",
        pick_date: order?.pick_time?.date,
        pick_work_shift: order?.pick_time?.work_shift,
        pick_option: order.warehouse?.type === "ghtk" ? "post" : "cod",
        is_fragile: 0,
        deliver_time: "",
        ship_money: 0,
        source: 30,
        //Truyền lên key is_delayed_time để tránh việc bị tính delay ca lấy 2 lần
        is_delayed_time: 0,
      };
      if (reqObj.pick_option === "post") {
        reqObj.post_office = order.warehouse?.hub_code || "";
      }
      // TODO NamVH: check thêm chỗ này.
      let totalWeight = sumBy(order.products, (product) =>
        Number(product.weight)
      );
      if (!Number.isInteger(totalWeight)) totalWeight = totalWeight.toFixed(2);
      reqObj.total_weight = totalWeight;

      if (totalWeight > DEFAULT_BBS_MIN_WEIGHT) {
        reqObj.is_bigsize = 1;
      }
      // TODO NamVH: Check thêm chỗ này sau.
      // if (
      //   order.deliver_option &&
      //   order.pick_session &&
      //   totalWeight <= this.expressWeight.max
      // ) {
      //   reqObj.deliver_option = "xteam";
      //   reqObj.booking_id = get(order, "bookingId");
      // }

      let value = 0;
      order.products.forEach((product) => {
        let isFragile = 0;
        if (size(product.tags) > 0) {
          for (let j = 0; j < size(product.tags); j++) {
            if (product.tags[j].name || product.tags[j].name === "Dễ vỡ") {
              isFragile = 1;
              break;
            } else {
              isFragile = 0;
            }
          }
        }
        // TODO: Hình như là gán tag dễ vẽ cho danh sách các sản phẩm.
        if (product.type === 2) {
          const combo = {
            is_fragile: isFragile,
            combo_id: product.combo_id,
            combo_name: product.product_name,
            combo_quantity: product.quantity,
            combo_weight: product.weight,
            products: [],
          };
          combo.products = map(product.combo_products, (productInCombo) => {
            return {
              product_name: productInCombo.full_name,
              weight: productInCombo.weigh,
              quantity: productInCombo.number,
              product_code: productInCombo.sku,
            };
          });
          reqObj.Order.push(combo);
        } else {
          let productTemp = {
            is_fragile: isFragile,
            product_id: product.product_id,
            product_name: product.product_name,
            quantity: product.quantity,
            weight: product.weight,
            money: parseInt(this.vndToNumber(product.money)),
          };
          if (reqObj.is_bigsize === 1) {
            productTemp.width = 10;
            productTemp.length = 10;
            productTemp.height = 10;
          }
          reqObj.Order.push(productTemp);
        }

        value += parseInt(this.vndToNumber(product.money));
      });
      reqObj.value = value;
      forEach(order.addressObj, (value, name) => {
        if (!reqObj[name] && value) {
          reqObj[name] = value;
        }
      });
      // Check trường hợp customer_specific_id không sẽ lấy thông tin từ customer_hamlet_id
      if (
        `${reqObj.customer_specific_id}` === "-1" &&
        !!reqObj.customer_hamlet_id &&
        `${reqObj.customer_hamlet_id}` !== "-1"
      ) {
        reqObj.customer_specific_id = reqObj.customer_hamlet_id;
        reqObj.customer_specific = reqObj.customer_hamlet;
      }
      reqObj.customer_first_address = order.address;
      return reqObj;
    },
    /**
     * Convert text VND to Number.
     */
    vndToNumber(x) {
      if (!x) {
        return 0;
      }
      x = x.toString();
      x = x.replace(/\D/g, "");
      x = parseInt(x);
      return x;
    },
    /**
     * kiểm trả đã quá thời gian hay chưa.
     */
    checkOverTime(time) {
      let timeNow = moment(Date.now()).format("H:mm");
      time = time.split(":");
      timeNow = timeNow.split(":");
      const timeSeconds = parseInt(time[0] * 3600 + time[1] * 60);
      const timeNowSeconds = parseInt(timeNow[0] * 3600 + timeNow[1] * 60);
      if (timeSeconds < timeNowSeconds) {
        return true;
      }
      return false;
    },

    /**
     * Convert Time
     */
    getTimeAvailable(time) {
      if (!time) {
        return [];
      }
      const hourTime = moment(time).format("H");
      const minuteTime = moment(time).format("mm");
      time = moment(time).format("H:mm");
      const hours = [];

      for (let hour = hourTime; hour <= 21; hour++) {
        hours.push(moment({ hour }).format("H:mm"));
        hours.push(
          moment({
            hour,
            minute: 30,
          }).format("H:mm")
        );
      }
      hours.splice(-1);
      if (minuteTime < 30) {
        hours.splice(0, 1);
      } else {
        hours.splice(0, 2);
      }
      hours.unshift(time);
      return hours;
    },

    // /**
    //  * Lọc danh sách kho.
    //  */
    // getListHub(data) {
    //   return map(data, (hub) => {
    //     if (hub.hub_type === "kho") {
    //       hub.addressDetail = `${hub.address}, ${hub.province_name}, ${hub.district_name}`;
    //     } else {
    //       hub.addressDetail = hub.address;
    //     }
    //     return hub;
    //   });
    // },

    // ----------------------------------- FOOTER --------------------------------
    /**
     * Check box - Accept Rule.
     */
    handleUpdateRuleCheck(checked) {
      this.ruleCheck = checked;
    },

    // ----------------------------------- ORDER --------------------------------
    /**
     * Chọn tất cả đơn hàng.
     */
    handleSelectAll(isSelectAll) {
      this.selectAll = isSelectAll;
    },
    /**
     * Validate Order.
     */
    handleValidateListOrder(listOrder) {
      if (this.parseAddressLoading) {
        return false;
      }
      worker.postMessage(
        JSON.parse(
          JSON.stringify({
            data: listOrder,
            type: "orderExcel",
            bbsExtraProvinces: EXTRA_BBS_PROVINCES,
            bbsDefaultMaxWeight: DEFAULT_BBS_MAX_WEIGHT,
            bbsDefaultMaxValue: DEFAULT_BBS_MAX_VALUE,
            expressDefaultMaxValue: DEFAULT_EXPRESS_MAX_VALUE,
          })
        )
      );
    },
    /**
     * Lưu orders vào Vuex
     */
    handleSaveLocal(newOrders) {
      this.$store.state.sessionStorage.savedListOrder = newOrders;
    },
    /**
     * Đẩy đơn hàng.
     */
    async submitGHTK() {
      this.loadingUpGHTK = true;
      const listRemove = [];
      const listDraftTempOrders = [];
      this.selectedValidListOrder.forEach((order) => {
        const formatedOrder = this.formatOrderToUpload({ ...order });
        // Submitted tags exclude custom tags (101,100),
        // Submit key 6 only in case having both keys 6 and 1
        formatedOrder.tags = [1, 6].every((elem) =>
          formatedOrder.tags.includes(elem)
        )
          ? formatedOrder.tags.filter((tag) => {
              return ![1, 100, 101].includes(tag);
            })
          : formatedOrder.tags.filter((tag) => {
              return ![100, 101].includes(tag);
            });
        listRemove.push(order.orderId);
        listDraftTempOrders.push(JSON.stringify(formatedOrder));
      });
      if (!listDraftTempOrders.length && !listDraftTempOrders.length) {
        message.error("Không có đơn hợp lệ để đăng");
        this.loadingUpGHTK = false;
        return;
      }
      try {
        await this.uploadToGhtkDraftTempOrders(listDraftTempOrders, listRemove);
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingUpGHTK = false;
      }
    },

    /**
     * Call API đẩy đơn hàng.
     */
    async uploadToGhtkDraftTempOrders(orders = [], listRemove) {
      if (size(orders) === 0) {
        return;
      }
      try {
        const requestData = {
          packages: orders,
        };
        const result = await services.$package.savePackages(requestData);
        if (result.success) {
          this.handleRemoveOrderInView(listRemove);
          message.success(`${size(orders)} đơn hàng đang được xử lý`);

          // Nhận và đẩy session vào để xử lý.
          if (get(result, "data.session_id")) {
            this.$store.commit("orderExcel/updateSessionsEcom", [
              {
                session_id: get(result, "data.session_id"),
                numberOrder: orders.length,
                listOrder: orders,
              },
            ]);
          }
        } else {
          this.handleError(result.message, "Có lỗi khi đẩy đơn hàng sang GHTK");
          let errorMessage = "Có lỗi khi đăng đơn";
          if (result.log_id) {
            errorMessage = "Có lỗi khi đăng đơn, mã lỗi: " + result.log_id;
          }
          message.error(errorMessage);
          message.error(`${result.message}`);

          // // pkg_draft_index => TODO NamVH: đơn hàng sẽ xử lý lần lượt. lỗi đơn nào thì sẽ trả về vị trí của đơn đó. bắt đầu từ 0 -> n
          // const listRemoveNew = listRemove.slice(
          //   0,
          //   result.pkg_draft_index || 0
          // );
          // this.handleRemoveOrderInView(listRemoveNew);
        }
      } catch (e) {
        let errorMessage = "Có lỗi khi đăng đơn";
        if (e.response?.data?.log_id && e.response.status !== 200) {
          errorMessage =
            "Có lỗi khi đăng đơn, mã lỗi: " + e.response?.data?.log_id;
        }
        if (e.response && e.response.status !== 200) {
          this.handleError("Có lỗi khi đẩy đơn hàng sang GHTK");
          message.error(errorMessage);
        } else {
          // this.handleRemoveOrderInView(listRemove);
          message.error(errorMessage);
          // TODO Thông báo lỗi khi đăng đơn gặp lỗi hệ thống.
          // const successAlert = Swal.mixin({
          //   text: "Đơn hàng của bạn đang được gửi sang GHTK, vui lòng kiểm tra trong màn Đơn hàng",
          //   icon: "success",
          //   showConfirmButton: true,
          //   confirmButtonText: '<a class="text-white">Đi đến màn Đơn hàng</a>',
          //   confirmButtonColor: "#069255",
          //   focusConfirm: false,
          //
          //   showCancelButton: true,
          //   cancelButtonText: "Đóng",
          //
          //   customClass: {
          //     actions: "justify-content-end",
          //   },
          // });
          // successAlert.fire().then((result) => {
          //   if (result.value) {
          //     this.$router.push("/orders/v2");
          //   }
          // });
          this.handleError(e, "Có lỗi khi đẩy đơn hàng sang GHTK");
        }
      }
    },

    /**
     * Update Filter
     */
    handleChangeFilter() {
      let orderIndex = 0;
      while (orderIndex < this.numberOrder) {
        const validateOrder = this.listError[orderIndex];
        this.listOrder[orderIndex].invalid =
          typeof validateOrder !== "undefined";
        ++orderIndex;
      }
    },
    handleApplyFilter(filter) {
      this.filterParam = { ...filter };
    },

    /**
     * Lấy danh sách order từ localstorage
     * @param {any} param Filter của danh sách order
     * @returns Danh sách order
     */
    async handleBrowseListOrder() {
      try {
        const listOrderFromLocalStorage = get(
          this.$store.state.sessionStorage,
          "savedListOrder",
          []
        );
        this.handleSetListOrder(listOrderFromLocalStorage);
      } catch (error) {
        this.handleError(
          error,
          "Có lỗi khi lấy danh sách order từ localstoage"
        );
      }
    },

    /**
     * Xóa order khỏi view.
     */
    handleRemoveOrderInView(orders) {
      this.listOrder = filter(
        this.listOrder,
        (order) => !includes(orders, order.orderId)
      );
    },

    /**
     * Xóa nhiều order.
     */
    handleRemoveOrders() {
      const orderIdsRemove = map(
        this.selectedListOrder,
        (order) => order.orderId
      );
      if (orderIdsRemove.length === this.listOrder.length) {
        // TH xóa tất cả.
        let totalNew = orderIdsRemove.length > 50 ? 50 : orderIdsRemove.length;
        // TH tổng đơn hàng > 50. => Xóa bớt để lại 50 cái để giữ ổn định hiệu năng.
        // TH tổng đơn hàng < 50. => Chỉ xóa dữ liệu.
        for (let i = 0; i < totalNew; i++) {
          this.listOrder.push(this.getNewOrder());
        }
      }
      this.handleRemoveOrderInView(orderIdsRemove);
    },
    getNewOrder() {
      const configFreeShip = get(this.orderExcelConfig, "shipPay") || false;
      const configWarehouse = get(this.orderExcelConfig, "warehouse")
        ? get(this.orderExcelConfig, "warehouse")
        : undefined;
      const configTransportService =
        get(this.orderExcelConfig, "transport_service") || "Express";
      const configTransport = get(this.orderExcelConfig, "transport") || "road";
      const configMessage = get(this.orderExcelConfig, "message", "") || "";
      const configMessages = get(this.orderExcelConfig, "messages", []) || [];
      const configTags = get(this.orderExcelConfig, "tags", [TCID]) || [TCID];
      const configProducts = get(this.orderExcelConfig, "products", []) || [];
      const configPickTime = get(this.orderExcelConfig, "pick_time", null);
      const configNotDeliveredFee =
        get(this.orderExcelConfig, "not_delivered_fee", "0") || "0";
      let configNotDeliveredOption;
      configTags.filter((item) => {
        if (this.notDeliverOptionsKey.includes(item)) {
          configNotDeliveredOption = item;
          return;
        }
      });
      const newOrder = {
        invalid: this.typeFilter === "invalid" || this.typeFilter === "total",
        customerDetail: {},
        orderId: nanoid(8),
        addressObj: {},
        address: "",
        name: "",
        message: configMessage,
        phone: "",
        not_delivered_option: configNotDeliveredOption,
        not_delivered_fee: configNotDeliveredFee,
        shipPay: configFreeShip,
        transport: configTransport,
        transport_service: configTransportService,
        warehouse: configWarehouse,
        client_id: "",
        pick_time: configPickTime,
        messages: configMessages,
        tags: configTags,
        products: map(configProducts, (pro) => ({
          ...pro,
          id: nanoid(8),
          product_name: pro.full_name || "",
          type: pro.type || 1,
          suggestSelectedItem: { name: pro.full_name },
          code: pro.code || "",
          product_unit_mass: get(pro, "weight", 0),
          product_unit_price: get(pro, "money", 0),
          quantity: 1,
          weight: pro.weight || 0.1,
          money: this.currencyFormatter(pro.money || 0),
        })),
        pick_money: 0,
      };
      if (size(newOrder.products) === 0) {
        newOrder.products = [
          {
            id: nanoid(8),
            product_name: "",
            type: 1,
            suggestSelectedItem: { name: "" },
            code: "",
            quantity: 1,
            weight: 0.1,
            money: 0,
            retail_prices: 0,
          },
        ];
      }
      if (size(configProducts) > 0) {
        newOrder.pick_money = this.currencyFormatter(
          sumBy(configProducts, (product) => product.retail_prices || 0)
        );
      }
      if (!has(newOrder, "pick_money")) {
        newOrder.pick_money = 0;
      }

      return newOrder;
    },
    /**
     * Thêm 1 order mới vào danh sách
     */
    handleAddNewOrder() {
      this.listOrder.push(this.getNewOrder());
      this.handleScrollToBottom();
    },

    /**
     * Xóa một order
     */
    handleRemoveOrder(orderId) {
      // TODO NamVH: bỏ tạm kịch bản XFast
      // const order = find(this.listOrder, (x) => x.orderId === orderId);
      // if (order && order.deliver_option && order.bookingId) {
      //   this.deleteBookingXfast(order.bookingId);
      // }
      this.listOrder = this.listOrder.filter((x) => x.orderId !== orderId);
    },
    /**
     * Chuyển đổi vị trí của các order.
     */
    handleSwapOrder(orderId) {
      const orderIndex = this.listOrder.findIndex((x) => x.orderId === orderId);
      const destinationIndex = orderIndex - 1;
      const destinationData = this.listOrder[destinationIndex];
      const sourceData = this.listOrder[orderIndex];
      this.listOrder.splice(destinationIndex, 2, sourceData, destinationData);
    },

    /**
     * Lưu đơn nháp
     */
    async handleSaveListOrder() {
      const listOrderRemove = [];
      try {
        const listOrder = [];
        forEach(this.selectedValidListOrder, (order) => {
          const formatedOrder = this.formatOrderToUpload({ ...order });
          const jsonFormatedOrder = JSON.stringify(formatedOrder);
          listOrder.push(jsonFormatedOrder);
          listOrderRemove.push(order.orderId);
        });
        if (size(listOrder) === 0) {
          message.error("Không có đơn hợp lệ để đăng.");
          return;
        }
        this.fetchingSaveOrder = !this.fetchingSaveOrder;
        // Lưu danh sách đơn
        const requestParam = {
          packages: listOrder,
        };
        const result = await services.$package.saveDraftPackage(requestParam);
        if (result.success) {
          this.handleRemoveOrderInView(listOrderRemove);
          if (get(result, "data.session_id")) {
            this.$store.commit("orderExcel/updateSessions", [
              {
                session_id: get(result, "data.session_id"),
                numberOrder: listOrder.length,
              },
            ]);
          }
          message.success("Lưu đơn hàng thành công.");
        } else {
          message.error("Có lỗi khi lưu thông tin đơn hàng.");
          if (result.msg) {
            message.error(`${result.msg}`);
          }
          this.handleError(
            result.message,
            "Có lỗi khi lưu thông tin đơn hàng."
          );
        }
      } catch (error) {
        // this.handleRemoveOrderInView(listOrderRemove);
        message.error("Có lỗi khi lưu thông tin đơn hàng.");
        this.handleError(error, "Có lỗi khi lưu thông tin đơn hàng.");
      } finally {
        this.fetchingSaveOrder = !this.fetchingSaveOrder;
      }
    },

    /**
     * Update Field
     */
    handleApplyAllByField(payload) {
      const {
        fieldName,
        fieldValue,
        message,
        tags,
        not_delivered_fee,
        not_delivered_option,
      } = payload;
      if (fieldValue) {
        // Nếu chọn áp dụng tất cả
        // 1. Set lại field chọn tất cả theo field bằng true
        // 2. Set 2 trường message, messages trong từng phần tử của listOrder theo [fieldValue] hiện tại

        forEach(this.listOrder, (order) => {
          if (fieldName === "isApplyAllMessage") {
            order.message = message;
            order.tags = tags;
            order.not_delivered_fee = not_delivered_fee;
            order.not_delivered_option = not_delivered_option;
          } else if (fieldName === "isApplyAllWarehouse") {
            order.warehouse = fieldValue;
          } else if (fieldName === "isApplyAllTransport") {
            order.transport = fieldValue;
          } else if (fieldName === "isApplyAllFreeShip") {
            order.shipPay = fieldValue;
          } else if (fieldName === "isApplyAllPickTime") {
            const pickTimes =
              this.$store.state.orderExcel.pickTimes[`${order.orderId}`];
            const pickTimeFinded = findIndex(
              pickTimes,
              (item) =>
                item.id === fieldValue.id && item.type === fieldValue.type
            );
            if (pickTimeFinded > -1) {
              order.pick_time = fieldValue;
            }
          }
        });
      }
    },

    // ------------------------------------- PHONE -----------------------------
    /**
     * Call API lấy color của khách hàng, theo số điện thoại.
     */
    async handleGetColorByPhone(listAllPhone) {
      const testIsPhone = new RegExp(
        /^((01[2689]|08|09|03|07|05|04|02[0123456789]|06)|(([+]{0,1}84)(1[2689]|8|9|3|7|5|4|2[0123456789]|6)))[0-9]{8}$/
      );
      const ordersSlice = [];
      const listOrder = [...listAllPhone];
      while (size(listOrder)) {
        ordersSlice.push(listOrder.splice(0, 10));
      }
      for (let i = 0; i < ordersSlice.length; i++) {
        const tels = [];
        const orderIds = [];
        forEach(ordersSlice[i], (each) => {
          if (each.phone) {
            const isPhone = testIsPhone.test(each.phone);
            if (isPhone) {
              tels.push(each.phone);
              orderIds.push(each.orderId);
            }
          }
        });
        await this.handleGetCustomerInfoByPhone(tels, orderIds);
      }
    },
    /**
     * Call API lấy thông tin của khách hàng, theo số điện thoại.
     */
    async handleGetCustomerInfoByPhone(tels, orderIds) {
      if (size(tels) === 0) {
        return;
      }
      try {
        const requestParam = {
          customer_tels: tels,
        };
        const result = await services.$customer.getCustomerColorByPhone(
          requestParam
        );
        if (result.success) {
          forEach(orderIds, (orderId) => {
            const orderIndex = findIndex(
              this.listOrder,
              (x) => x.orderId === orderId
            );
            if (orderIndex > -1) {
              const customerInfo = find(
                get(result, "data"),
                (item) =>
                  `${item.customer_tel}` ===
                  `${this.listOrder[orderIndex].phone}`
              );
              if (customerInfo) {
                const customerDetail = {
                  tel: customerInfo.customer_tel,
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
                const nextOrder = this.listOrder[orderIndex];
                nextOrder.customerDetail = customerDetail;
                this.listOrder.splice(orderIndex, 1, nextOrder);
              }
            }
          });
          return true;
        } else {
          // this.$toast.error("Có lỗi khi lấy thông tin khách hàng.");
          message.error("Có lỗi khi lấy thông tin khách hàng.");
        }
      } catch (error) {
        // this.$toast.error("Có lỗi khi lấy thông tin khách hàng.");
        message.error("Có lỗi khi lấy thông tin khách hàng.");
      }
    },
    // ------------------------------------- ADDRESS -----------------------------
    /**
     * Phân lô để gửi request.
     */
    handlePreParseAllAddress(listAllAddress) {
      const chunks = chunk(listAllAddress, 20);
      this.listAllAddress = chunks;
      this.handleDoParseAllAddress();
    },
    /**
     * Gửi Request lấy địa chỉ chi tiết.
     */
    handleDoParseAllAddress() {
      if (size(this.listAllAddress) === 0) {
        this.parseAddressLoading = false;
        return true;
      }
      const vm = this;
      const firstChunk = get(this.listAllAddress, 0, {});
      if (size(firstChunk) === 0) {
        this.parseAddressLoading = false;
        this.$store.commit("orderExcel/updateFetchingParseAllAddress", {
          nextFetching: {},
          hardUpdate: true,
        });
        return true;
      } else {
        const nextFetching = {};
        firstChunk.forEach((chunkItem) => {
          nextFetching[chunkItem.orderId] = true;
        });
        this.$store.commit("orderExcel/updateFetchingParseAllAddress", {
          nextFetching: nextFetching,
          hardUpdate: false,
        });
        const listPromies = this.all(firstChunk, vm.handleParseAddressAsync);
        listPromies.then((response) => {
          vm.listAllAddress.splice(0, 1);
          if (size(response) > 0) {
            const listSuccessResponse = response.filter(
              (x) => x.status === 200
            );
            const listOrder = [];
            forEach(listSuccessResponse, (res) => {
              const orderId = get(res, "config.params.orderId", null);
              const address = get(res, "data", {});
              const order = vm.handleUpdateAddressObj(orderId, address);
              if (order) {
                listOrder.push(order);
              }
            });
            // const filteredResult = map(
            //   filter(listOrder, (order) => {
            //     const isHasAddress =
            //       order.address &&
            //       order.addressObj &&
            //       order.addressObj.customer_province_id &&
            //       order.addressObj.customer_district_id &&
            //       (order.addressObj.customer_street_id ||
            //         order.addressObj.customer_ward_id);
            //     return order.warehouse && isHasAddress;
            //   }),
            //   (x) => ({
            //     orderId: get(x, "orderId"),
            //     pick_province_id: get(x, "warehouse.province_id"),
            //     pick_district_id: get(x, "warehouse.district_id"),
            //     pick_ward_id: get(x, "warehouse.ward_id"),
            //     pick_street_id: get(x, "warehouse.street_id"),
            //     pick_hamlet_id: get(x, "warehouse.hamlet_id"),
            //     pick_first_address:
            //       get(x, "warehouse.address") ||
            //       get(x, "warehouse.addressDetail"),
            //     customer_first_address: get(x, "address"),
            //     customer_province_id: get(x, "addressObj.customer_province_id"),
            //     customer_district_id: get(x, "addressObj.customer_district_id"),
            //     customer_ward_id: get(x, "addressObj.customer_ward_id"),
            //     customer_street_id: get(x, "addressObj.customer_street_id"),
            //     customer_hamlet_id:
            //       get(x, "addressObj.customer_hamlet_id") ||
            //       get(x, "addressObj.customer_specific_id"),
            //     booking_id: get(x, "bookingId", ""),
            //     date_to_delay_pick: "",
            //     cus_tel: get(x, "phone"),
            //     is_tmp_booking: 0,
            //     excel_moshop: 1,
            //     excel_confirm_time: EXCEL_CONFIRM_TIME,
            //   })
            // );
            // Ẩn XFAST
            // if (this.isShowXfast) {
            //   this.handlePreCheckXFastAll(filteredResult);
            // }
          }
          const nextFetching = {};
          firstChunk.forEach((chunkItem) => {
            nextFetching[chunkItem.orderId] = false;
          });
          this.$store.commit("orderExcel/updateFetchingParseAllAddress", {
            nextFetching: nextFetching,
            hardUpdate: false,
          });
          vm.handleDoParseAllAddress();
        });
      }
    },
    /**
     * Gửi Request lấy nhiều địa chỉ chi tiết.
     */
    handleParseAddressAsync(adrressParam) {
      return new Promise((resolve) => {
        services.$address
          .browseParseAddress(adrressParam)
          .then((response) => {
            resolve(response);
          })
          .catch(() => {
            resolve(adrressParam);
          });
      });
    },
    /**
     * Cập nhật AddressObject.
     */
    handleUpdateAddressObj(orderId, addressObj) {
      if (size(addressObj) === 0) {
        return false;
      }
      const findedOrderIndex = this.listOrder.findIndex(
        (order) => order.orderId === orderId
      );
      if (findedOrderIndex > -1) {
        const order = this.listOrder[findedOrderIndex];
        order.addressObj = addressObj;
        if (!order.addressObj.customer_specific_id) {
          order.addressObj.customer_specific_id =
            get(addressObj, "customer_specific_id") ||
            get(addressObj, "customer_hamlet_id");
          order.addressObj.customer_specific =
            get(addressObj, "customer_specific") ||
            get(addressObj, "customer_hamlet");
        }
        return order;
      }
    },

    // ------------------------------------ WAREHOUSE -------------------------------------------
    /**
     * Update Pick Time.
     */
    handleBrowseAllPickTime() {
      const vm = this;
      let listOrderExpress = [];
      let firstChunk = get(Array.from(vm.listWaitingWarehouse), 0, {});
      if (size(firstChunk) > 0) {
        listOrderExpress = filter(
          firstChunk,
          (item) => Number(item.weight) < DEFAULT_BBS_MIN_WEIGHT
        );
      }
      firstChunk = filter(
        firstChunk,
        (item) =>
          Number(item.weight) <= DEFAULT_BBS_MAX_WEIGHT ||
          item.order_id === listOrderExpress[0]?.order_id
      );
      if (size(firstChunk) === 0) {
        return true;
      } else {
        const listPromies = this.all(firstChunk, this.handleBrowsePickTimes);
        const nextPickTimes = {};
        listPromies.then((response) => {
          vm.listWaitingWarehouse.splice(0, 1);
          if (size(response) > 0) {
            forEach(
              response.filter((x) => x.pickup.length > 0),
              (res) => {
                let orderId = res.order_id || null;
                let pickup = res.pickup;

                const orderFindedIndex = findIndex(
                  this.listOrder,
                  (order) => order.orderId === orderId
                );
                if (
                  orderFindedIndex > -1 &&
                  this.listOrder[orderFindedIndex].pick_time
                ) {
                  const pickTime = this.listOrder[orderFindedIndex].pick_time;
                  const capacityFindedIndex = findIndex(
                    pickup,
                    (item) =>
                      item.type === pickTime.type && item.id === pickTime.id
                  );
                  if (capacityFindedIndex > -1) {
                    this.listOrder[orderFindedIndex].pick_time =
                      pickup[capacityFindedIndex];
                  } else {
                    this.listOrder[orderFindedIndex].pick_time = pickup[0];
                  }
                }
                if (res.type === "bbs") {
                  nextPickTimes[`${orderId}`] = pickup;
                } else {
                  forEach(listOrderExpress, (item) => {
                    nextPickTimes[`${item.order_id}`] = pickup;
                  });
                }
              }
            );
            this.$store.commit("orderExcel/browsePickTimes", { nextPickTimes });
          }
          vm.handleBrowseAllPickTime();
        });
      }
    },

    /**
     * Check capacity pick time All
     */
    async handleCheckCapacityPickupAll(listOrderCheckPickTime) {
      const chunks = chunk(listOrderCheckPickTime, 20);
      if (size(this.listWaitingWarehouse) > 0) {
        this.listWaitingWarehouse = this.listWaitingWarehouse.concat(chunks);
      } else {
        this.listWaitingWarehouse = chunks;
      }
      this.handleBrowseAllPickTime();
    },

    /**
     * Lấy danh sách kho hàng từ api
     */
    async handleBrowseListHub() {
      // Cập nhật danh sách kho, nếu trong cache đang có dữ liệu.
      // TODO NamVH: Bỏ tạm kịch bản này do có hiện tượng lẫn lồn các kho của các shop.
      // if (
      //   this.$store.state.sessionStorage &&
      //   size(this.$store.state.sessionStorage.list_hub) > 0
      // ) {
      //   this.$store.commit("orderExcel/browseWareHouses", {
      //     listWarehouse: this.getListHub(
      //       this.$store.state.sessionStorage.list_hub
      //     ),
      //   });
      //   return;
      // }

      // Call API.
      try {
        const listWarehouseNew = await this.getListPickAddress({
          convertToWithoutPayloadLabel: true,
        });
        this.$store.commit("orderExcel/browseWareHouses", {
          listWarehouse: listWarehouseNew,
        });
      } catch (error) {
        this.handleError(error, "Có lỗi khi lấy danh sách kho");
      }
    },

    /**
     * Set dữ liệu danh sách channel từ localstorage
     * @param {Array} orders Danh sách channel
     */
    handleSetListOrder(orders = []) {
      let listOrder = [];
      const listWaitingWarehouse = {};
      const configFreeShip = get(this.orderExcelConfig, "shipPay") || "khach";
      const configWarehouse = get(this.orderExcelConfig, "warehouse")
        ? get(this.orderExcelConfig, "warehouse")
        : undefined;
      const configTransport = get(this.orderExcelConfig, "transport") || "road";
      const configTransportService =
        get(this.orderExcelConfig, "transport_service") || "Express";
      const configMessage = get(this.orderExcelConfig, "message", "") || "";
      const configMessages = get(this.orderExcelConfig, "messages", []) || [];
      const configTags = get(this.orderExcelConfig, "tags", [TCID]) || [TCID];
      const configProducts = get(this.orderExcelConfig, "products", []) || [];
      const configPickTime = get(this.orderExcelConfig, "pick_time", null);
      const configNotDeliveredFee =
        get(this.orderExcelConfig, "not_delivered_fee", "0") || "0";
      let configNotDeliveredOption;
      configTags.filter((item) => {
        if (this.notDeliverOptionsKey.includes(item)) {
          configNotDeliveredOption = item;
          return;
        }
      });
      if (size(orders) === 0) {
        this.batchId = uuidv4();
        this.$store.state.sessionStorage.order_excel_config.batchId =
          this.batchId;
        for (let i = 0; i < 10; i++) {
          const newOrder = {
            customerDetail: {},
            orderId: nanoid(8),
            invalid: true,
            addressObj: {},
            address: "",
            name: "",
            message: configMessage,
            phone: "",
            shipPay: configFreeShip,
            transport: configTransport,
            transport_service: configTransportService,
            warehouse: configWarehouse,
            not_delivered_option: configNotDeliveredOption,
            not_delivered_fee: configNotDeliveredFee,
            client_id: "",
            deliver_option: false,
            pick_time: configPickTime,
            messages: configMessages,
            tags: configTags,
            pick_money: 0,
            products: map(configProducts, (pro) => ({
              ...pro,
              id: nanoid(8),
              product_name: pro.full_name || "",
              type: pro.type || 1,
              suggestSelectedItem: { name: pro.full_name },
              product_unit_mass: get(pro, "weight", 0.1),
              product_unit_price: get(pro, "money", 0),
              code: pro.code || "",
              quantity: 1,
              weight: pro.weight || 0.1,
              money: this.currencyFormatter(pro.money),
            })),
          };
          const nunberProducts = size(newOrder.products);
          if (nunberProducts === 0) {
            newOrder.products = [
              {
                id: nanoid(8),
                product_name: "",
                suggestSelectedItem: { name: "" },
                code: "",
                quantity: 1,
                weight: 0.1,
                money: 0,
              },
            ];
          } else if (size(configProducts) > 0) {
            newOrder.pick_money = this.currencyFormatter(
              sumBy(configProducts, (product) => product.retail_prices || 0)
            );
          }
          if (!has(newOrder, "pick_money")) {
            newOrder.pick_money = 0;
          }
          if (
            !has(this.$store.state.orderExcel.pickTimes, newOrder.orderId) &&
            newOrder.warehouse &&
            newOrder.warehouse.province_id &&
            newOrder.warehouse.district_id
          ) {
            const totalWeight = sumBy(newOrder.products, (product) =>
              Number(product.weight)
            ).toFixed(2);
            listWaitingWarehouse[`${newOrder.orderId}`] = {
              order_id: newOrder.orderId,
              warehouse: newOrder.warehouse,
              products: newOrder.products,
              weight: totalWeight,
            };
          }
          listOrder.push(newOrder);
        }
        this.$store.commit("sessionStorage/saveListOrder", { listOrder });
      } else {
        if (this.$store.state.sessionStorage.order_excel_config.batchId) {
          this.batchId =
            this.$store.state.sessionStorage.order_excel_config.batchId;
        } else {
          this.batchId =
            this.$store.state.sessionStorage.order_excel_config.batchId =
              uuidv4();
        }
        listOrder = map(orders, (newOrder) => {
          newOrder.products = map(newOrder.products, (product) => {
            if (!product.id) {
              product.id = nanoid(8);
            }
            return product;
          });
          if (
            !has(this.$store.state.orderExcel.pickTimes, newOrder.orderId) &&
            newOrder.warehouse &&
            newOrder.warehouse.province_id &&
            newOrder.warehouse.district_id
          ) {
            const totalWeight = sumBy(newOrder.products, (product) =>
              Number(product.weight)
            ).toFixed(2);
            listWaitingWarehouse[`${newOrder.orderId}`] = {
              order_id: newOrder.orderId,
              warehouse: newOrder.warehouse,
              products: newOrder.products,
              weight: totalWeight,
            };
          }
          newOrder.pick_money = newOrder.pick_money ? newOrder.pick_money : 0;
          return newOrder;
        });
      }

      this.listOrder = listOrder;
      if (size(listWaitingWarehouse) > 0) {
        const chunks = this.splitToChunks(values(listWaitingWarehouse), 20);
        this.listWaitingWarehouse = chunks;
        // this.handleBrowseAllPickTime();
      }
    },

    // -------------------------------- PRODUCT ------------------------
    /**
     * Tìm kiếm danh sách sản phẩm theo tên
     * @param {string} search Tên sản phẩm cần tìm
     */
    async handleSearchProductByName(search = "") {
      try {
        let listProduct = await this.getProductByName(
          { search },
          { convertToWithoutPayloadLabel: true }
        );

        this.$store.commit("orderExcel/browseListProduct", {
          listProduct,
        });
      } catch (error) {
        this.handleError(error, "Có lỗi khi tìm kiếm sản phẩm");
      }
    },
    // -------------------------------- X-FAST ------------------------
    // handleShowConfirmBeforeUploadToGHTK() {
    //   this.$store.commit("orderExcel/showAction", {
    //     action: "confirmGHTKTrigger",
    //   });
    // },
    // handlePreCheckXFastAll(listCheckXFast) {
    //   const chunks = chunk(listCheckXFast, 20);
    //   if (size(this.listCheckXFast) > 0) {
    //     this.listCheckXFast = this.listCheckXFast.concat(chunks);
    //   } else {
    //     this.listCheckXFast = chunks;
    //   }
    //   this.handleDoCheckXFastAll();
    // },
    // async handleDoCheckXFastAll() {
    //   const vm = this;
    //   const firstChunk = get(this.listCheckXFast, 0, []);
    //   vm.listCheckXFast.splice(0, 1);
    //   if (size(firstChunk) === 0) {
    //     this.$store.commit("orderExcel/updateFetchingCheckAllXFast", {
    //       nextFetching: {},
    //       hardUpdate: true,
    //     });
    //     return true;
    //   } else {
    //     const nextFetching = {};
    //     firstChunk.forEach((chunkItem) => {
    //       nextFetching[chunkItem.orderId] = true;
    //     });
    //     this.$store.commit("orderExcel/updateFetchingCheckAllXFast", {
    //       nextFetching: nextFetching,
    //       hardUpdate: false,
    //     });
    //     const listPromies = [];
    //     for (const chunk of firstChunk) {
    //       const orderFinded = find(
    //         this.listOrder,
    //         (item) => item.orderId === chunk.orderId
    //       );
    //       const totalWeight =
    //         orderFinded && size(orderFinded.products) > 0
    //           ? sumBy(orderFinded.products, (product) =>
    //               Number(product.weight)
    //             ).toFixed(2) || 0
    //           : 0;
    //       if (
    //         totalWeight < 20 &&
    //         chunk.pick_province_id &&
    //         chunk.pick_district_id &&
    //         (chunk.pick_ward_id || chunk.pick_street_id) &&
    //         chunk.customer_first_address &&
    //         chunk.customer_province_id &&
    //         chunk.customer_district_id &&
    //         (chunk.customer_ward_id || chunk.customer_street_id)
    //       ) {
    //         const result = await this.handleCheckAllXFastAsync(chunk);
    //         listPromies.push(result);
    //       }
    //     }
    //     Promise.all(listPromies).then(async (response) => {
    //       if (size(response) > 0) {
    //         const listSuccessResponse = response.filter(
    //           (x) => x.success === true || x.success === false
    //         );
    //         forEach(listSuccessResponse, (res) => {
    //           const requestData = JSON.parse(res.config.data);
    //           const orderId = requestData?.orderId || null;
    //           const bookingData = get(res, "data", {});
    //           vm.handleUpdateXFast(orderId, bookingData);
    //         });
    //       }
    //       const nextFetching = {};
    //       firstChunk.forEach((chunkItem) => {
    //         nextFetching[chunkItem.orderId] = false;
    //       });
    //       this.$store.commit("orderExcel/updateFetchingCheckAllXFast", {
    //         nextFetching: nextFetching,
    //         hardUpdate: false,
    //       });
    //       setTimeout(() => {
    //         vm.handleDoCheckXFastAll();
    //       }, 0);
    //     });
    //   }
    // },
    // handleShowQuickConfigModal() {
    //   this.$store.commit("orderExcel/showAction", {
    //     action: "showQuickConfigModal",
    //   });
    // },
    // async handleCheckAllXFastAsync(xFastParam) {
    //   return new Promise((resolve) => {
    //     customerService
    //       .getBookingXfast(
    //         this.access_token,
    //         xFastParam,
    //         (values) => values.data
    //       )
    //       .then((response) => {
    //         resolve(response);
    //       })
    //       .catch(() => {
    //         resolve(xFastParam);
    //       });
    //   });
    // },
    // async getBookingXfast(dateToDelay, order, bookingId) {
    //   const requestParam = {
    //     pick_province_id: get(order, "warehouse.province_id"),
    //     pick_district_id: get(order, "warehouse.district_id"),
    //     pick_ward_id: get(order, "warehouse.ward_id"),
    //     pick_street_id: get(order, "warehouse.street_id"),
    //     pick_hamlet_id: get(order, "warehouse.hamlet_id"),
    //     pick_first_address:
    //       get(order, "warehouse.address") ||
    //       get(order, "warehouse.addressDetail"),
    //     customer_first_address: get(order, "address"),
    //     customer_province_id: get(order, "addressObj.customer_province_id"),
    //     customer_district_id: get(order, "addressObj.customer_district_id"),
    //     customer_ward_id: get(order, "addressObj.customer_ward_id"),
    //     customer_hamlet_id:
    //       get(order, "addressObj.customer_hamlet_id") ||
    //       get(order, "addressObj.customer_specific_id"),
    //     customer_street_id: get(order, "addressObj.customer_street_id"),
    //     date_to_delay_pick: dateToDelay || "",
    //     cus_tel: get(order, "phone"),
    //     booking_id: bookingId,
    //     is_tmp_booking: 0,
    //     excel_moshop: 1,
    //     excel_confirm_time: EXCEL_CONFIRM_TIME,
    //   };
    //   if (
    //     !(
    //       requestParam.pick_province_id &&
    //       requestParam.pick_district_id &&
    //       (requestParam.pick_ward_id || requestParam.pick_street_id) &&
    //       requestParam.customer_first_address &&
    //       requestParam.customer_province_id &&
    //       requestParam.customer_district_id &&
    //       (requestParam.customer_ward_id || requestParam.customer_street_id)
    //     )
    //   ) {
    //     return false;
    //   }
    //   try {
    //     const result = await customerService.getBookingXfast(
    //       this.access_token,
    //       requestParam,
    //       (values) => values.data
    //     );
    //     return result.data;
    //   } catch (error) {
    //     return false;
    //   }
    // },
    // handleUpdateSingleXfast(data) {
    //   const orders = cloneDeep(this.listOrder);
    //   orders[data.orderIndex].pick_session = data.pickSession;
    //   orders[data.orderIndex].bookingId = data.bookingId;
    //   orders[data.orderIndex].xfastTime = data.xfastTime;
    //   this.listOrder = orders;
    // },
    // openProfileModal(customer) {
    //   this.customerProfileModal.customer_fullname = customer.customer_fullname;
    //   this.customerProfileModal.channel = customer.channel;
    //   this.customerProfileModal.tel = customer.customer_tel;
    //   this.customerProfileModal.actionCount++;
    //   // Phải để static và ép click vào nút X để bắt đc sự kiện close
    //   // $("#cm-modal-profile").modal({ backdrop: "static", keyboard: false });
    // },
    // TODO NamVH: Bỏ tạm kịch bản XFast.
    // async handleUpdateXFast(orderId, bookingData) {
    //   const findedOrderIndex = this.listOrder.findIndex(
    //     (order) => order.orderId === orderId
    //   );
    //   if (findedOrderIndex > -1) {
    //     const order = this.listOrder[findedOrderIndex];
    //     if (bookingData.success) {
    //       const xfastSessions = this.getTimeAvailable(
    //         bookingData.data.date_to_delay_pick
    //       );
    //       if (size(xfastSessions) > 0) {
    //         order.deliver_option = true;
    //         order.pick_session = get(xfastSessions, 0, null);
    //         order.xfastSessions = xfastSessions;
    //         order.bookingId = bookingData.data.booking_id;
    //         order.xfastTime = Date.now();
    //       } else {
    //         order.deliver_option = false;
    //         order.bookingId = "";
    //       }
    //     } else {
    //       order.deliver_option = false;
    //       order.bookingId = "";
    //     }
    //   }
    // },
    // async deleteBookingXfast(bookingId) {
    //   const requestParam = {
    //     booking_id: bookingId,
    //   };
    //   if (!bookingId) {
    //     return false;
    //   }
    //   try {
    //     const result = await customerService.deleteBookingXfast(
    //       this.access_token,
    //       requestParam,
    //       (values) => values.data
    //     );
    //     return result.data;
    //   } catch (error) {
    //     return false;
    //   }
    // },
    // checkXfastAll() {
    // const filteredResult = map(
    //   filter(this.listOrder, (order) => {
    //     const isHasAddress =
    //       order.address &&
    //       order.addressObj &&
    //       order.addressObj.customer_province_id &&
    //       order.addressObj.customer_district_id &&
    //       (order.addressObj.customer_street_id ||
    //         order.addressObj.customer_ward_id);
    //     return order.warehouse && isHasAddress;
    //   }),
    //   (x) => ({
    //     orderId: get(x, "orderId"),
    //     pick_province_id: get(x, "warehouse.province_id"),
    //     pick_district_id: get(x, "warehouse.district_id"),
    //     pick_ward_id: get(x, "warehouse.ward_id"),
    //     pick_street_id: get(x, "warehouse.street_id"),
    //     pick_hamlet_id: get(x, "warehouse.hamlet_id"),
    //     pick_first_address:
    //       get(x, "warehouse.address") || get(x, "warehouse.addressDetail"),
    //     customer_first_address: get(x, "address"),
    //     customer_province_id: get(x, "addressObj.customer_province_id"),
    //     customer_district_id: get(x, "addressObj.customer_district_id"),
    //     customer_ward_id: get(x, "addressObj.customer_ward_id"),
    //     customer_street_id: get(x, "addressObj.customer_street_id"),
    //     customer_hamlet_id:
    //       get(x, "addressObj.customer_hamlet_id") ||
    //       get(x, "addressObj.customer_specific_id"),
    //     booking_id: get(x, "bookingId", ""),
    //     date_to_delay_pick: "",
    //     cus_tel: get(x, "phone"),
    //     is_tmp_booking: 0,
    //     excel_moshop: 1,
    //     excel_confirm_time: EXCEL_CONFIRM_TIME,
    //   })
    // );
    // if (this.isShowXfast) {
    //   this.handlePreCheckXFastAll(filteredResult);
    // }
    // },
    // TODO NamVH: Bỏ tạm check XFast.
    // async handlePreSaveListOrder() {
    //   let countNumberOrderXfast = 0;
    //   forEach(this.selectedValidListOrder, (order) => {
    //     if (order.deliver_option) {
    //       ++countNumberOrderXfast;
    //     }
    //   });
    //   if (countNumberOrderXfast > 0) {
    //     // this.$toast.error(
    //     //   `Có ${countNumberOrderXfast} đơn XFAST. Với đơn XFAST, hãy chọn Đẩy đơn sang GHTK.`
    //     // );
    //     return;
    //   }
    //   this.handleSaveListOrder();
    // },
    // TODO NamVH: bỏ tạm phần Save Log.
    // async handleSaveLogOrder(orders) {
    //   const listDraftTempOrders = [];
    //   orders.forEach((order) => {
    //     const formatedOrder = this.formatOrderToUpload({ ...order });
    //     listDraftTempOrders.push(formatedOrder);
    //   });
    //   const requestParam = {
    //     packages: JSON.stringify(listDraftTempOrders),
    //     config: JSON.stringify(this.orderExcelConfig),
    //     batch_id: this.batchId,
    //   };
    //   await customerService.saveLogOrder(
    //     // this.$auth.user.access_token,
    //     "",
    //     requestParam,
    //     (values) => values.data
    //   );
    // },
  },
  async unmounted() {
    this.$store.commit("orderExcel/showAction", {
      actionName: "typeFilter",
      action: "typeFilter",
      actionValue: "total",
    });
    clearInterval(this.sessionInterval);
    // TODO NamVH: Bỏ tạm X-fast.
    // forEach(this.listOrder, (item) => {
    //   if (item.deliver_option && item.bookingId) {
    //     this.deleteBookingXfast(item.bookingId);
    //     item.deliver_option = false;
    //     item.bookingId = "";
    //   }
    // });
    // Call API lưu trữ data vào trong indexBD.
    // Cần lưu vào trong này: do có trường hợp dữ liệu lớn.
    await this.handleUnload();
  },
};
</script>

<style lang="scss" scoped>
.footer-order-excel {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 18px 0 7px;
  z-index: 200;
  width: 100%;
  border-top: 1px solid #d9d9d9;
}

.content-temp {
  width: 100%;
  height: calc(100vh - 135px);
}

.content-create-order-excel {
  animation: 0.6s fadeIn;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
