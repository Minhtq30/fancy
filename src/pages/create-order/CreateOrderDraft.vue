<template>
  <div>
    <div v-if="loading || loadFist">
      <a-spin tip="Đang cập nhật">
        <div class="content-temp" />
      </a-spin>
    </div>
    <div v-if="!(loading || loadFist)" class="content-create-order-excel">
      <filter-order-draft
        :invalid="numberInvalidOrder"
        :total="numberOrder"
        :listHubs="listHub"
        :packageLabels="packageLabels"
        @apply="handleApplyFilter"
        @onApplyConfig="handleApplyConfig"
        @onFilterMounted="handleFilterMounted"
      />
      <a-spin :spinning="loadAll">
        <TableCreateOrder
          :height="tableHeight"
          :indeterminate="indeterminate"
          :selectAll="selectAll"
          :debounceConfig="debounceConfig"
          :listOrder="filteredListOrder"
          :expNotes="expNotes"
          :excelColumns="excelColumns"
          :provincesCache="provincesCache"
          :packageLabels="packageLabels"
          :listUpdate="listUpdate"
          :loadMore="loadMore"
          :finish="finish"
          :listError="listError"
          @onInputSelectAll="handleSelectAll"
          @onSwapOrder="handleSwapOrder"
          @onRemoveOrder="handleRemoveOrder"
          @onCheckCapacityPickupAll="handleCheckCapacityPickupAll"
          @printOrder="handlePrintOrder"
          @applyAllByField="handleApplyAllByField"
          @onLoadMore="onLoadMore"
          @onUpdateDraft="handleUpdateDraft"
          @onUpdateDraftToEcom="handleUpdateDraftToEcom"
        />
      </a-spin>
      <div class="footer-order-draft">
        <footer-order-draft
          ref="footerOrderExcel"
          :listUpdate="listUpdate"
          :loadMore="loadMore"
          :ruleCheck="ruleCheck"
          :loadingUpGHTK="loadingUpGHTK"
          :hideUploadOrder="hideUploadOrder"
          :fetchingSaveOrder="fetchingSaveOrder"
          :listOrder="filteredListOrder"
          :selectedListOrder="selectedListOrder"
          :selectedValidListOrder="selectedValidListOrder"
          :validListOrder="validListOrder"
          @updateAll="handleUpdateAll"
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
  map,
  size,
  sumBy,
  uniqBy,
  isEmpty,
} from "lodash";
import { mapState } from "vuex";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import $ from "jquery";

// Components
import FilterOrderDraft from "@/components/filter/filter-order-draft";
import TableCreateOrder from "@/components/table/table-create-order-draft";
import FooterOrderDraft from "@/components/footer-action/footer-order-draft";

// Service
import services from "@/services";

// Mixins
import commonMixin from "@/plugins/mixins/common";
import loadingMixin from "@/plugins/mixins/loading";
import productMixin from "@/plugins/mixins/product";
import warehouseMixin from "@/plugins/mixins/warehouse";
import pickTimeMixin from "@/plugins/mixins/pickTime";
import orderExcelMixin from "@/plugins/mixins/orderExcel";
import {
  TCID,
  SHOP_CUSTOM_TAGS,
  DEFAULT_BBS_MAX_WEIGHT,
  DEFAULT_BBS_MIN_WEIGHT,
  EXTRA_BBS_PROVINCES,
  DEFAULT_BBS_MAX_VALUE,
  DEFAULT_EXPRESS_MAX_VALUE,
} from "@/contants/order";
import { message } from "ant-design-vue";

// TODO NamVH: Cần xem lại chỗ này để tránh trường hợp duplicate servive worker.
const worker = new Worker("../draft-worker.js");
const workerExcel = new Worker("../excel-worker.js");

// Lưu trữ provinces ra ngoài để hạn chế cho Vuejs.
let provinces = {};
export default {
  components: {
    FilterOrderDraft,
    TableCreateOrder,
    FooterOrderDraft,
  },
  mixins: [
    commonMixin,
    loadingMixin,
    productMixin,
    warehouseMixin,
    pickTimeMixin,
    orderExcelMixin,
  ],
  data() {
    return {
      listWaitingWarehouse: [],
      parseAddressLoading: false,
      selectAll: false,
      indeterminate: false,
      sessionStorage: [],
      listAllAddress: [],
      listOrder: [],
      listError: [],
      listUpdate: {},
      filterParam: {},
      loadingUpGHTK: false,
      fetchingSaveOrder: false,
      ruleCheck: true,
      batchId: null,
      keyNotify: nanoid(8),
      provincesCache: [],
      packageLabels: [],
      timer1: null,
      loadFist: false,
      loadMore: false,
      loadAll: false,
      finish: false,
      currentPage: 0,
      isWarning: false,
      tmpListOrder: [],
      keySession: nanoid(8),
      filterHeight: 60,
    };
  },
  watch: {
    listOrder: {
      handler(newOrders) {
        // this.debouncedSaveLocal(newOrders);
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
    await this.$store.dispatch("shop/getShopConfig");
    // this.debouncedSaveLocal = debounce(this.handleSaveLocal, 500);
    // // this.debounceHandleSaveLogOrder = debounce(this.handleSaveLogOrder, 3000);
    this.debouncedValidateListOrder = debounce(
      this.handleValidateListOrder,
      500
    );

    this.loadFist = true;

    // Lấy danh sách kho hàng. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    await this.handleBrowseListHub();
    // Xét config default. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    await this.handleSetDefaultFastOrderConfig();
    // Lấy danh sách sản phẩm. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    await this.handleSearchProductByName();
    // Get Default Tag.
    // await this.getPackageLabel();

    // Đồng bộ dữ liệu: Kéo dữ liệu về.
    await this.syncDataFromDatabase();
    this.loadFist = false;

    workerExcel.onmessage = ({ data }) => {
      this.listError = data.listError;
    };
    worker.onmessage = ({ data }) => {
      this.listUpdate = data.listUpdate;
    };

    const provincesTemp =
      (await services.$address.browseProvinceListWithCache()) || [];
    provincesTemp.forEach((item) => {
      provinces[item.id] = item;
    });
    this.provincesCache = provinces;
  },
  computed: {
    ...mapState("localStorage", {
      orderConfig: (state) => state.config.global?.order,
    }),
    tagList() {
      return this.$store.state.constant.tagListExcel.filter((tag) => {
        //tagList exclude key 12 (Cho COD sửa tiền thu hộ)
        return ![12].includes(tag.key);
      });
    },
    ...mapState({
      notDeliverOptionTag() {
        return this.$store.getters["shop/notDeliverOptionTag"] != 0
          ? this.$store.getters["shop/notDeliverOptionTag"]
          : TCID;
      },
    }),
    expressWeight() {
      return get(this.orderConfig, "express.weight");
    },
    bbsWeight() {
      return get(this.orderConfig, "bbs.weight");
    },
    excelColumns() {
      return this.$store.state.orderDraft.excelColumns;
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
      return get(this.$store.state.orderDraft, "typeFilter", "total");
    },
    selected() {
      return get(this.$store.state.orderDraft, "selectedListOrder", {});
    },
    showCustomerInfoModal() {
      return get(this.$store.state.orderDraft, "showCustomerInfoModal", false);
    },
    selectManyMode() {
      return get(this.$store.state.orderDraft, "selectManyMode", false);
    },
    showQuickConfigModal() {
      return get(this.$store.state.orderDraft, "showQuickConfigModal", false);
    },
    confirmGHTKTrigger() {
      return get(this.$store.state.orderDraft, "confirmGHTKTrigger", false);
    },
    customerInfo() {
      return get(this.$store.state.orderDraft, "customerInfo", {});
    },
    totalOrder() {
      return get(this.$store.state.orderDraft, "totalOrder", 0);
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
    validListOrder() {
      const numberOrder = this.numberOrder;
      const listOrder = this.listOrder;
      const listError = this.listError;
      const result = [];
      for (let i = 0; i < numberOrder; i++) {
        const order = listOrder[i];
        if (isUndefined(listError[i])) {
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
      return this.$store.state.orderDraft.listWarehouse;
    },
    orderExcelConfig() {
      return this.$store.state.sessionStorage.order_excel_config || {};
    },
    filteredListOrder() {
      return this.listOrder;
    },
  },
  methods: {
    handleUpdateDraft(orderId) {
      this.loadingUpGHTK = true;
      try {
        this.handleSaveDraft(
          this.listOrder.filter((item) => `${item.orderId}` === `${orderId}`)
        );
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingUpGHTK = false;
      }
    },
    handleUpdateDraftToEcom(orderId) {
      this.loadingUpGHTK = true;
      try {
        this.handleSaveDraft(
          this.listOrder.filter((item) => `${item.orderId}` === `${orderId}`),
          true,
          true
        );
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingUpGHTK = false;
      }
    },
    handleUpdateAll() {
      this.loadingUpGHTK = true;
      try {
        const listOrderValidate = this.validListOrder;
        this.handleSaveDraft(listOrderValidate);
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingUpGHTK = false;
      }
    },
    // ---------------------------------- PRINT ---------------------------------
    handlePrintOrder(options = {}) {
      this.$refs.footerOrderExcel.onPrintOrders(options);
    },
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
    // ------------------------------------- SYNC DATA -----------------------------
    // TODO NamVH: API lọc đang sử dụng lọc theo s. => ko phải milliseconds
    getTimeCreate(timeString) {
      try {
        const timer = new Date(timeString);
        return parseInt(`${timer.getTime() / 1000}`);
      } catch (e) {
        console.log(e);
      }
      return undefined;
    },

    // TODO NamVH: Do data bi lệch giữa việc API lấy bị màu và API lọc đơn nháp => nên phải sinh thêm Funct này để động bộ được code ở các phần khác.
    convertReportTypes(data) {
      let _data = data.map((item) => {
        if (item === "trusted") {
          return "blue";
        }
        return item;
      });
      return _data;
    },

    // TODO NAMVH: Thiếu kịch bản call lấy thông tin khách hàng.
    async syncDataFromDatabase(reset = false) {
      if (reset) {
        this.loadAll = true;
        this.currentPage = 0;
        this.finish = false;
      }
      let payload = {
        useNewPackage: true,
        useNewApi: true,
        isEcom: false,
        page: this.currentPage,
        size: 10,
        shopCode: localStorage.getItem("shop_code"),
        pickTime: this.filterParam?.pickTime || [],
        minPickMoney: this.filterParam?.cash?.includes("range")
          ? this.vndToNumber(this.filterParam?.cashRange?.from)
          : 0,
        maxPickMoney: this.filterParam?.cash?.includes("range")
          ? this.filterParam?.cashRange?.to
            ? this.vndToNumber(this.filterParam?.cashRange?.to)
            : 1000000000000000
          : 1000000000000000,
        typeSortPickMoney: this.filterParam?.cash?.includes("increase")
          ? "asc"
          : this.filterParam?.cash?.includes("decrease")
          ? "desc"
          : "",
        area: this.filterParam.location ? [this.filterParam.location] : [],
        provinceIds: this.filterParam?.locationMulti || [],
        stationIds: this.filterParam?.warehouse || [],
        productIds: this.filterParam?.products || [],
        reportTypes: this.convertReportTypes(this.filterParam?.customer || []),
        term: this.filterParam?.textSearch || "",
        minDraftCreated: this.filterParam?.minDraftCreated
          ? parseInt(this.filterParam.minDraftCreated)
          : undefined,
        maxDraftCreated: this.filterParam?.maxDraftCreated
          ? parseInt(this.filterParam.maxDraftCreated)
          : undefined,
      };

      if (this.filterParam?.isPrintedLabel !== undefined) {
        payload.isPrintedLabel = this.filterParam?.isPrintedLabel;
      }

      const response = await services.$package.getDraftPackage(payload);
      if (response.success) {
        this.currentPage += 1;
        const listDrafts = response?.data?.results;
        const approxResultsCount = response?.data?.approxResultsCount;
        const listDraftIds = listDrafts.map((item) => item.draft_id).join(",");
        const dataDraftDetail = await services.$package.getDraftDetailPackage({
          draft_ids: listDraftIds,
        });
        let orderData = [];
        let listWarehouseId = [];
        forEach(dataDraftDetail.data, (item) => {
          try {
            const orderDetail = JSON.parse(item.package);
            const order = listDrafts.find(
              (item1) => `${item1.draft_id}` === `${item.id}`
            );
            const warehouse = this.listHub.find(
              (item2) => `${item2.id}` === `${orderDetail.pick_address_id}`
            );
            if (warehouse?.id && !listWarehouseId.includes(warehouse?.id)) {
              listWarehouseId.push(warehouse?.id);
            }
            //check tag logic
            let tags =
              order.tags && order.tags.length != 0
                ? order.tags
                : orderDetail.tags;
            if (
              tags &&
              tags.some((tag) => this.notDeliverOptionsKey.indexOf(tag) >= 0)
            ) {
              // Filter available tags
              tags = tags.filter((tag) => {
                return (
                  SHOP_CUSTOM_TAGS.map((shopTag) => shopTag.key).includes(
                    tag
                  ) ||
                  this.notDeliverOptionsKey.includes(tag) ||
                  (this.tagList
                    .map((defaultTag) => defaultTag.key)
                    .includes(tag) &&
                    tag != 19) ||
                  (tag == 19 &&
                    orderDetail.not_delivered_fee &&
                    orderDetail.not_delivered_fee != 0)
                );
              });
            } else {
              tags = [this.notDeliverOptionTag];
            }
            orderData.push({
              ...orderDetail,
              message: this.generateMessage(
                tags,
                orderDetail.not_delivered_fee || 0,
                this.tagList
              ),
              not_delivered_fee: orderDetail.not_delivered_fee || 0,
              not_delivered_option: tags.find((tag) =>
                this.notDeliverOptionsKey.includes(tag)
              ),
              tags: tags,
              draft_id: order.draft_id,
              alias: order.alias,
              warehouse: warehouse
                ? warehouse
                : {
                    id: Number(orderDetail.pick_address_id),
                    value: orderDetail.pick_address_id,
                    province_id: orderDetail.pick_province_id,
                    district_id: orderDetail.pick_district_id,
                    label: orderDetail.pick_address_name,
                    hub_type: orderDetail.hub_type,
                  },
            });
          } catch (e) {
            console.log(e);
          }
        });

        const listNewOrder = this.convertDataToObject(orderData);

        const result = [...this.listOrder, ...listNewOrder];

        // Cập nhật cache cho worker.
        worker.postMessage(
          JSON.parse(
            JSON.stringify({
              type: "orderDraft",
              action: "updateCache",
              dataUpdate: listNewOrder,
            })
          )
        );

        if (reset) {
          this.listOrder = uniqBy(listNewOrder, function (e) {
            return e.draft_id;
          });
        } else {
          this.listOrder = uniqBy(result, function (e) {
            return e.draft_id;
          });
        }

        if (reset) {
          this.loadAll = false;
        }

        // TODO NamVH: Thực tế có thể tăng lên 200 -> 500 đơn.
        // Cánh báo người dùng nếu xử lý quá 100 đơn nháp.
        if (this.listOrder.length > 100 && !this.isWarning) {
          this.$notification.warning({
            duration: 0,
            message: "Cảnh báo",
            placement: "bottomLeft",
            description:
              "Hạn chế xử lý quá 100 đơn hàng, trong cùng một phiên làm việc",
          });
          this.isWarning = true;
        }

        // Cập nhật tổng.
        this.$store.commit("orderDraft/updateTotal", approxResultsCount);

        if (this.listOrder.length >= approxResultsCount) {
          this.finish = true;
        }

        clearTimeout(this.timer1);
        this.timer1 = setTimeout(() => {
          // Cập nhật Capacity.
          this.handleGetAllCapacityPickup(listWarehouseId);

          // Cập nhật thông tin khách hàng (Bi Màu).
          this.handleGetColorByPhone(listNewOrder.filter((x) => x.phone));
        }, 200);
      } else {
        if (reset) {
          this.loadAll = false;
        }
        message.error("Lỗi tải dữ liệu");
      }
    },
    handleGetAllCapacityPickup(listWarehouseId) {
      // Duyệt danh sách các kho được tìm thấy trong danh sách và lấy pickup time tương ứng.
      forEach(listWarehouseId, (item) => {
        const filterData = filter(
          [...this.listOrder],
          (order) =>
            order.warehouse?.value &&
            order.warehouse?.province_id &&
            order.warehouse?.district_id &&
            `${item}` === `${order.warehouse.id}`
        );
        const listOrderCheckPickTime = map(filterData, (x) => ({
          order_id: x.orderId,
          warehouse: x.warehouse,
          products: x.products,
          weight: sumBy(x.products, (product) =>
            Number(product.weight)
          ).toFixed(2),
        }));

        this.handleCheckCapacityPickupAll(listOrderCheckPickTime);
      });
    },
    // ------------------------------------- CONFIG -----------------------------
    handleFilterMounted() {
      const filterDom = document.getElementById("filter-draft");
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
      const configProducts = get(orderExcelConfig, "products", []) || [];
      const configPickTime = get(orderExcelConfig, "pick_time", null);
      for (let i = 0; i < this.numberOrder; i++) {
        const order = this.listOrder[i];
        if (!(order.name || order.phone || order.address)) {
          order.message = configMessage;
          order.messages = configMessages;
          order.shipPay = configFreeShip;
          order.transport = configTransport;
          order.warehouse = configWarehouse;
          order.pick_time = configPickTime;
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
            if (size(configProducts) > 0 && order.pick_money == "0") {
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
        "order_draft_config",
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
    // ----------------------------------- FUNCTION HELP DATA ----------------------------------------
    /**
     * Convert data từ API sang dữ liệu Object sử dụng dưới client.
     */
    convertDataToObject(data) {
      let orderNew = [];
      forEach(data, (item) => {
        const order = {
          orderId: nanoid(8),
          draft_id: item.draft_id,
          not_delivered_option: item.not_delivered_option,
          not_delivered_fee: item.not_delivered_fee || 0,
          address: item.customer_first_address || "",
          addressObj: {
            customer_district: item.customer_district || "",
            customer_district_id: Number(item.customer_district_id) || 0,
            customer_hamlet: item.customer_hamlet || "",
            customer_hamlet_id: Number(item.customer_hamlet_id) || 0,
            customer_province: item.customer_province || "",
            customer_province_id: Number(item.customer_province_id) || 0,
            customer_specific: item.customer_specific || "",
            customer_specific_id: Number(item.customer_specific_id) || 0,
            customer_ward: item.customer_ward || "",
            customer_ward_id: Number(item.customer_ward_id) || 0,
            customer_street: item.customer_street || "",
            customer_street_id: Number(item.customer_street_id) || 0,
          },
          client_id: item.client_id || "",
          customerDetail: {},
          deliver_option: item.deliver_option,
          invalid: true,
          message: item.message || "",
          messages: [],
          name: item.customer_fullname || "",
          phone: item.customer_tel || "",
          pick_money: item.pick_money || "",
          pick_time: {
            id: Number(item.pick_time_slot),
            value: item.pick_time_slot,
            type: item.pick_time,
            label: item.pick_time,
          },
          alias: item.alias,
          products: item.Order || [],
          shipPay: item.is_freeship > 0 ? "shop" : "khach",
          transport: item.transport,
          transport_service:
            item.total_weight > DEFAULT_BBS_MIN_WEIGHT ? "BBS" : "Express",
          warehouse: item.warehouse,
          tags: item.tags || [TCID],
          source: 30,
        };
        orderNew.push(order);
      });

      return orderNew;
    },
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
     * Convert text VND to Number.
     */
    formatOrderToUpload(order) {
      const findedHub = find(
        this.listHub,
        (x) => x.id === get(order, "warehouse.id")
      );
      const reqObj = {
        alias: order.alias,
        pkg_draft_id: order.id || undefined,
        customer_tel: order.phone,
        customer_fullname: order.name,
        Order: [],
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
        not_delivered_fee: order.not_delivered_fee || 0,
        // messages: order.messages,
        pick_time: order.pick_time
          ? order.pick_time.type
          : this.pickTimes && this.pickTimes.length > 0
          ? this.pickTimes[0].type
          : "sang_mai",
        pick_date: order?.pick_time?.date,
        pick_work_shift: order?.pick_time?.work_shift,
        pick_time_slot: order.pick_time
          ? order.pick_time.pick_time_slot
          : this.pickTimes && this.pickTimes.length > 0
          ? this.pickTimes[0].pick_time_slot
          : "",
        pick_option: order.warehouse?.type === "ghtk" ? "post" : "cod",
        is_fragile: 0,
        deliver_time: "",
        ship_money: 0,
        source: 30,
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
    // handleShowConfirmBeforeUploadToGHTK() {
    //   this.$store.commit("orderDraft/showAction", {
    //     action: "confirmGHTKTrigger",
    //   });
    // },
    /**
     * Load more.
     */
    async onLoadMore() {
      this.loadMore = true;
      // Đồng bộ dữ liệu từ IndexDB lên VueX.
      await this.syncDataFromDatabase();
      this.loadMore = false;
    },
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
            type: "orderDraft",
            action: "verifyUpdate",
          })
        )
      );
      workerExcel.postMessage(
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
      try {
        this.handleSaveDraft(this.selectedValidListOrder, true, true);
      } catch (e) {
        console.log(e);
      } finally {
        this.loadingUpGHTK = false;
      }
    },

    handleSaveDraft(listOrderValid, hasUpdateToEcom, submitGHTKCheck) {
      try {
        const listOrder = [];
        forEach(listOrderValid, (order) => {
          if (submitGHTKCheck) {
            // Submitted tags exclude custom tags (101,100),
            // Submit key 6 only in case having both keys 6 and 1
            order.tags = [1, 6].every((elem) => order.tags.includes(elem))
              ? order.tags.filter((tag) => {
                  return ![1, 100, 101].includes(tag);
                })
              : order.tags.filter((tag) => {
                  return ![100, 101].includes(tag);
                });
          }
          const formatedOrder = this.formatOrderToUpload({ ...order });
          const jsonFormatedOrder = JSON.stringify({
            ...formatedOrder,
            pkg_draft_id: order.draft_id,
          });
          listOrder.push({
            package_draft_id: order.draft_id,
            package: jsonFormatedOrder,
            orderId: order.orderId,
          });
        });

        if (size(listOrder) === 0) {
          message.error("Không có đơn hợp lệ để đăng.");
          return;
        }

        message.loading({
          content: "Đang xử lý đơn hàng",
          key: this.keySession,
          duration: 0,
        });
        this.fetchingSaveOrder = !this.fetchingSaveOrder;
        this.tmpListOrder = chunk(listOrder, 10);
        this.handleDoSaveDraft(hasUpdateToEcom);
      } catch (error) {
        message.error("Có lỗi khi lưu thông tin đơn hàng.");
        this.handleError(error, "Có lỗi khi lưu thông tin đơn hàng.");
      } finally {
        this.fetchingSaveOrder = !this.fetchingSaveOrder;
      }
    },

    handleDoSaveDraft(hasUpdateToEcom = false) {
      const vm = this;
      const firstChunk = get(this.tmpListOrder, 0, {});
      if (size(firstChunk) === 0) {
        this.loadingUpGHTK = false;
        message.success({
          content: "Hoàn thành",
          key: this.keySession,
        });
        return true;
      } else {
        const promissAll = this.all(firstChunk, vm.handleRequestSaveDraft);
        promissAll.then((responses) => {
          vm.tmpListOrder.splice(0, 1);
          let listOrderRemove = [];
          let listPackageUpdate = [];
          // Đơn thành công.
          forEach(
            responses.filter((x) => x.success),
            (res) => {
              listOrderRemove.push(res.orderId);
              listPackageUpdate.push(res.draftId);
            }
          );

          // Đơn lỗi.
          forEach(
            responses.filter((x) => !x.success),
            (res) => {
              message.error(res.message);
            }
          );

          if (listOrderRemove.length > 0) {
            // Cập nhật cache cho các đơn đã hoàn thành việc cập nhật.
            worker.postMessage(
              JSON.parse(
                JSON.stringify({
                  type: "orderDraft",
                  action: "updateCache",
                  dataUpdate: this.listOrder.filter((item) =>
                    listOrderRemove.includes(item.orderId)
                  ),
                })
              )
            );

            // Verify lại.
            worker.postMessage(
              JSON.parse(
                JSON.stringify({
                  data: this.listOrder,
                  type: "orderDraft",
                  action: "verifyUpdate",
                })
              )
            );
          }

          if (listPackageUpdate.length > 0 && hasUpdateToEcom) {
            // Call API đẩy đơn nháp lên đơn Ecom.
            vm.handleSubmitDraftToEcom(listPackageUpdate, listOrderRemove);
          }

          // Thực thi tiếp các chunk tiếp theo.
          vm.handleDoSaveDraft(hasUpdateToEcom);
        });
      }
    },

    async handleSubmitDraftToEcom(listPackage = [], listOrderRemove) {
      try {
        const result = await services.$package.savePackageFromDraft({
          pkg_draft_ids: listPackage,
        });
        if (result.success) {
          // Xóa những đơn đẵ đăng thành công.
          this.handleRemoveOrderInView(listOrderRemove);
          // Đẩy đơn thành công.
          if (get(result, "data.session_id")) {
            this.$store.commit("orderDraft/updateSessionsEcom", [
              {
                session_id: get(result, "data.session_id"),
                numberOrder: listPackage.length,
              },
            ]);
          }
        } else {
          message.error(result.message);
          if (result?.data?.log_id) {
            message.error("Mã lỗi: " + result?.data?.log_id);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    handleRequestSaveDraft(data) {
      // Call API.
      return new Promise((resolve) => {
        if (this.listUpdate[`${data.orderId}`] === "update") {
          services.$package
            .updateDraftPackage(data)
            .then((response) => {
              resolve(response);
            })
            .catch(() => {
              resolve(data);
            });
        } else {
          // Bỏ qua việc cập nhật vs những đơn ở trạng thái "none".
          resolve({
            success: true,
            orderId: data.orderId,
            draftId: data.package_draft_id,
          });
        }
      });
    },

    handleApplyFilter(filter) {
      this.filterParam = { ...filter };
      this.syncDataFromDatabase(true);
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
    async handleRemoveOrders() {
      const orderIdsRemove = map(
        this.selectedListOrder,
        (order) => order.orderId
      );

      const packageDraftIdsRemove = map(
        this.selectedListOrder,
        (order) => `${order.draft_id}`
      );
      let keySession = nanoid(8);
      // Call API Remove.
      try {
        message.loading({
          content: "Đang xóa đơn hàng",
          key: keySession,
        });
        const response = await services.$package.removeDraftPackage({
          ids: packageDraftIdsRemove,
        });
        if (response.success) {
          message.success({
            content: `Xóa thành công ${packageDraftIdsRemove.length} đơn hàng`,
            key: keySession,
          });
        } else {
          message.success({
            content: `Lỗi: ${response.message}`,
            key: keySession,
          });
        }
      } catch (e) {
        message.error({
          content: "Gặp lỗi trong quá trình xóa",
          key: keySession,
        });
      }

      this.handleRemoveOrderInView(orderIdsRemove);
    },

    /**
     * Xóa một order
     */
    async handleRemoveOrder(orderId) {
      const orderRemove = this.listOrder.find((x) => x.orderId === orderId);
      this.listOrder = this.listOrder.filter((x) => x.orderId !== orderId);

      const params = {
        ids: [`${orderRemove.draft_id}`],
      };
      let keySession = nanoid(8);
      try {
        message.loading({
          content: "Đang xóa đơn hàng",
          key: keySession,
        });
        const response = await services.$package.removeDraftPackage(params);
        if (response.success) {
          message.success({
            content: `Xóa thành công đơn hàng: ${orderRemove.alias}`,
            key: keySession,
          });
        } else {
          message.success({
            key: keySession,
            content: `Gặp lỗi trong quá trình xóa đơn hàng: ${orderRemove.alias}`,
          });
        }
      } catch (e) {
        message.error({
          key: keySession,
          content: "Gặp lỗi trong quá trình xóa",
        });
      }
    },

    /**
     * Chuyển đổi vị trí của các order, chuyển ở local.
     */
    handleSwapOrder(orderId) {
      const orderIndex = this.listOrder.findIndex((x) => x.orderId === orderId);
      const destinationIndex = orderIndex - 1;
      const destinationData = this.listOrder[destinationIndex];
      const sourceData = this.listOrder[orderIndex];
      this.listOrder.splice(destinationIndex, 2, sourceData, destinationData);
    },

    /**
     * Update Field
     */
    handleApplyAllByField(payload) {
      const { fieldName, fieldValue, message } = payload;
      if (fieldValue) {
        // Nếu chọn áp dụng tất cả
        // 1. Set lại field chọn tất cả theo field bằng true
        // 2. Set 2 trường message, messages trong từng phần tử của listOrder theo [fieldValue] hiện tại
        forEach(this.listOrder, (order) => {
          if (fieldName === "isApplyAllMessage") {
            order.messages = fieldValue;
            order.message = message;
            order.tags = payload.tags;
            order.not_delivered_fee = payload.not_delivered_fee || 0;
            order.not_delivered_option = payload.not_delivered_option || TCID;
          } else if (fieldName === "isApplyAllWarehouse") {
            order.warehouse = fieldValue;
          } else if (fieldName === "isApplyAllTransport") {
            order.transport = fieldValue;
          } else if (fieldName === "isApplyAllFreeShip") {
            order.shipPay = fieldValue;
          } else if (fieldName === "isApplyAllPickTime") {
            const pickTimes =
              this.$store.state.orderDraft.pickTimes[`${order.orderId}`];
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
        }
        // const resultSameOrder = await customerService.checkDuplicateOrderByPhone(
        //   this.access_token,
        //   requestParam,
        //   (values) => values.data
        // )
        // if (resultSameOrder.success) {
        //   forEach(orderIds, (orderId) => {
        //     const orderIndex = findIndex(
        //       this.listOrder,
        //       (x) => x.orderId === orderId
        //     )
        //     if (orderIndex > -1) {
        //       const prevPackages = get(resultSameOrder, [
        //         'data',
        //         this.listOrder[orderIndex].phone
        //       ])
        //       if (prevPackages) {
        //         const nextOrder = this.listOrder[orderIndex]
        //         nextOrder.customerDetail = {
        //           ...nextOrder.customerDetail,
        //           packages: prevPackages
        //         }
        //         this.listOrder.splice(orderIndex, 1, nextOrder)
        //       }
        //     }
        //   })
        // } else {
        //   this.$toast.error('Có lỗi kiểm tra trùng đơn hàng.')
        // }
      } catch (error) {
        // this.$toast.error("Có lỗi khi lấy thông tin khách hàng.");
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
        this.$store.commit("orderDraft/updateFetchingParseAllAddress", {
          nextFetching: {},
          hardUpdate: true,
        });
        return true;
      } else {
        const nextFetching = {};
        firstChunk.forEach((chunkItem) => {
          nextFetching[chunkItem.orderId] = true;
        });
        this.$store.commit("orderDraft/updateFetchingParseAllAddress", {
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
          }
          const nextFetching = {};
          firstChunk.forEach((chunkItem) => {
            nextFetching[chunkItem.orderId] = false;
          });
          this.$store.commit("orderDraft/updateFetchingParseAllAddress", {
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
          (item) => Number(item.weight) <= DEFAULT_BBS_MIN_WEIGHT
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
                if (res.type.toLowerCase() === "bbs") {
                  nextPickTimes[`${orderId}`] = pickup;
                } else {
                  forEach(listOrderExpress, (item) => {
                    nextPickTimes[`${item.order_id}`] = pickup;
                  });
                }
              }
            );
            this.$store.commit("orderDraft/browsePickTimes", { nextPickTimes });
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
      //   this.$store.commit("orderDraft/browseWareHouses", {
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
        this.$store.commit("orderDraft/browseWareHouses", {
          listWarehouse: listWarehouseNew,
        });
      } catch (error) {
        this.handleError(error, "Có lỗi khi lấy danh sách kho");
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

        this.$store.commit("orderDraft/browseListProduct", {
          listProduct,
        });
      } catch (error) {
        this.handleError(error, "Có lỗi khi tìm kiếm sản phẩm");
      }
    },
  },
  async unmounted() {
    this.$store.commit("orderDraft/showAction", {
      actionName: "typeFilter",
      action: "typeFilter",
      actionValue: "total",
    });
    clearTimeout(this.timer1);
  },
};
</script>

<style lang="scss" scoped>
.footer-order-draft {
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
