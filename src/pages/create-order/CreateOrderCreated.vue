<template>
  <div>
    <div v-if="loadFist">
      <a-spin tip="Đang cập nhật">
        <div class="content-temp" />
      </a-spin>
    </div>
    <div v-if="!loadFist" class="content-create-order-excel">
      <filter-order-created
        :invalid="numberInvalidOrder"
        :total="numberOrder"
        :listHubs="listHub"
        :packageLabels="packageLabels"
        @apply="handleApplyFilter"
      />
      <a-spin :spinning="loadAll">
        <TableCreateOrder
          :currentPage="currentPage"
          :limit="limit"
          :height="tableHeight"
          :indeterminate="indeterminate"
          :selectAll="selectAll"
          :debounceConfig="debounceConfig"
          :listOrder="filteredListOrder"
          :expNotes="expNotes"
          :excelColumns="excelColumns"
          :packageLabels="packageLabels"
          :listUpdate="listUpdate"
          :loadMore="loadMore"
          :finish="finish"
          :listError="listError"
          @onInputSelectAll="handleSelectAll"
          @onSwapOrder="handleSwapOrder"
          @onLoadMore="onLoadMore"
        />
      </a-spin>
      <footer-order-created
        :limit="limit"
        :totalPages="totalPages"
        :listUpdate="listUpdate"
        :loadMore="loadMore"
        :ruleCheck="ruleCheck"
        :loadingUpGHTK="loadingUpGHTK"
        :hideUploadOrder="hideUploadOrder"
        :fetchingSaveOrder="fetchingSaveOrder"
        :listOrder="filteredListOrder"
        :selectedListOrder="selectedListOrder"
        :selectedValidListOrder="selectedValidListOrder"
        :packageLabels="packageLabels"
        :expNotes="expNotes"
        :handleUpdateOrderById="handleUpdateOrderById"
        @handleChangePage="handleChangePage"
      />
    </div>
  </div>
</template>

<script>
import {
  debounce,
  filter,
  find,
  get,
  isUndefined,
  map,
  size,
  uniqBy,
} from "lodash";
import { mapState } from "vuex";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

// Components
import FilterOrderCreated from "@/components/filter/filter-order-created";
import TableCreateOrder from "@/components/table/table-create-order-created";
import FooterOrderCreated from "@/components/footer-action/footer-order-created";

// Service
import services from "@/services";

// Mixins
import commonMixin from "@/plugins/mixins/common";
import loadingMixin from "@/plugins/mixins/loading";
import productMixin from "@/plugins/mixins/product";
import warehouseMixin from "@/plugins/mixins/warehouse";
import pickTimeMixin from "@/plugins/mixins/pickTime";
import { message } from "ant-design-vue";
import orderService from "@/services/order.service";

const TCID = 10000;

export default {
  components: {
    FooterOrderCreated,
    FilterOrderCreated,
    TableCreateOrder,
  },
  mixins: [
    commonMixin,
    loadingMixin,
    productMixin,
    warehouseMixin,
    pickTimeMixin,
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
      isWarning: false,
      tmpListOrder: [],
      keySession: nanoid(8),
      currentPageLoading: 0,
      limit: 25,
      currentPage: 0,
    };
  },
  watch: {
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
    limit() {
      // TODO: Thay đổi limit hiện tại.
      this.currentPageLoading = 0;
      // Nếu đổi limit về sau thì ko cần call API để cập nhật.
      if (this.currentPage === 0) {
        this.syncDataFromDatabase(true);
      }
    },
    currentPage(newValue) {
      // TODO: Thay đổi page hiện tại.
      this.currentPageLoading = (this.limit * newValue) / 5;
      this.syncDataFromDatabase(true);
    },
  },
  async mounted() {
    this.loadFist = true;

    // Lấy danh sách kho hàng. => Sau đóng gói phần này riêng nên ko dùng chung ở trong Global
    await this.handleBrowseListHub();

    // Get Default Tag.
    // await this.getPackageLabel();

    // Đồng bộ dữ liệu: kéo dữ liệu từ server về.
    await this.syncDataFromDatabase(true);
    this.loadFist = false;
  },
  computed: {
    ...mapState("localStorage", {
      orderConfig: (state) => state.config.global?.order,
    }),
    totalPages() {
      const totalOrder = get(this.$store.state.orderCreated, "totalOrder", 0);
      const numberPage = parseInt(totalOrder / this.limit);
      const numberPageMore = totalOrder / this.limit - numberPage;
      return numberPageMore > 0 ? numberPage + 1 : numberPage;
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
      const tableHeader = 77;
      const filter = 40;
      const tableFooterHeight = 68;
      return `calc(100vh - ${
        headerHeight + tableHeader + tableFooterHeight + filter
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
    handleChangePage(data) {
      this.handleScrollToTop();
      if (data.limit !== this.limit) {
        this.limit = data.limit;
      }
      if (data.page !== this.currentPage) {
        this.currentPage = data.page;
      }
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
    getTimeCreate(timeString) {
      try {
        const timer = new Date(timeString);
        return timer.getTime();
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
    async getDetailPackage(listCreated) {
      const {
        listAlias = [],
        listOrderId = [],
        listClientIds = [],
        listPackageStatusId = [],
        listTMPPackingStatus = [],
      } = listCreated;
      let result = [];
      let listWarehouseId = [];

      try {
        const responsePackageDetail = await this.all(
          listAlias,
          this.handleGetPackageDetail
        );
        const responseSessionDetail = await this.getSessionDetail(listOrderId);

        if (responseSessionDetail.success) {
          // Duyệt danh sách. => Lấy các packageDetail và SessionDetail.
          for (let i = 0; i < listOrderId?.length; i++) {
            const packageDetail = responsePackageDetail[i];
            const sessionDetail = responseSessionDetail?.data[listOrderId[i]];
            const _package = packageDetail.success
              ? packageDetail.data?.Package
              : {};

            const warehouse = this.listHub.find(
              (item2) => `${item2.id}` === `${_package.pick_address_id}`
            );

            if (warehouse?.id && !listWarehouseId.includes(warehouse?.id)) {
              listWarehouseId.push(warehouse?.id);
            }

            const listTMPPIgnore = ["1", "4"];

            const isEdit = !(
              `${listPackageStatusId[i]}` === "12" &&
              listTMPPIgnore.includes(`${listTMPPackingStatus[i]}`)
            );

            result.push({
              ..._package,
              success: packageDetail.success,
              session: sessionDetail,
              orderId: listOrderId[i],
              isEdit,
              packageStatusId: listPackageStatusId[i],
              tMPPackingStatus: listTMPPackingStatus[i],
              client_id: listClientIds[i],
              products: _package?.product,
              tags: _package?.tags?.map((x) => x.tag_id) || [TCID],
              transport_service: _package?.property?.includes("bbs")
                ? "BBS"
                : "Express",
              warehouse: warehouse
                ? warehouse
                : {
                    id: Number(_package?.pick_address_id),
                    value: _package?.pick_address_id,
                    province_id: _package?.pick_province_id,
                    district_id: _package?.pick_district_id,
                    label: `${_package?.pick_first_address}, ${_package?.pick_last_address}`,
                    hub_type:
                      _package?.pick_option === "post" ? "buu-cuc" : "kho",
                  },
            });
          }
        } else {
          // Do Something.
        }
      } catch (e) {
        console.log(e);
      }

      return {
        result,
        listWarehouseId,
      };
    },
    getSessionDetail(listOrderId) {
      return new Promise((resolve) => {
        orderService
          .getSessionsByListOrderId(listOrderId)
          .then((response) => {
            resolve(response.data);
          })
          .catch(() => {
            resolve({
              data: {},
              // TODO test tạm.
              success: true,
            });
          });
      });
    },
    handleGetPackageDetail(alias) {
      return new Promise((resolve) => {
        orderService
          .getOrderDetailByAlias(alias)
          .then((response) => {
            resolve(response.data);
          })
          .catch(() => {
            resolve({
              data: {
                success: false,
              },
            });
          });
      });
    },

    async syncDataFromDatabase(reset = false) {
      if (reset) {
        this.loadAll = true;
        this.finish = false;
      }

      let payload = {
        useNewPackage: true,
        useNewApi: true,
        isEcom: true,
        page: this.currentPageLoading,
        size: 5,
        shopCode: localStorage.getItem("shop_code"),
        pickTime: this.filterParam?.pickTime || [],
        minPickMoney: this.filterParam?.cash?.includes("range")
          ? this.filterParam?.cashRange?.from
          : 0,
        maxPickMoney: this.filterParam?.cash?.includes("range")
          ? this.filterParam?.cashRange?.to
            ? this.filterParam?.cashRange?.to
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
        isCancel: 0,
        minDraftCreated: this.filterParam?.minDraftCreated
          ? parseInt(this.filterParam.minDraftCreated)
          : this.getSecondTime() - 2 * 7 * 24 * 60 * 60, // 2 Tuần.
        maxDraftCreated: this.filterParam?.maxDraftCreated
          ? parseInt(this.filterParam.maxDraftCreated)
          : this.getSecondTime(),
        packageStatusIds: [1, 2, 8, 12],
      };
      if (this.filterParam?.isPrintedLabel !== undefined) {
        payload.isPrintedLabel = this.filterParam?.isPrintedLabel;
      }

      // Do something, => convert data to expect.
      const response = await services.$package.getDraftPackage(payload);
      if (response.success) {
        this.currentPageLoading += 1;
        const listCreated = response?.data?.results;
        const approxResultsCount = response?.data?.approxResultsCount;

        const listCreatedIds = listCreated.map((item) => item.pkg_id);
        const listClientIds = listCreated.map((item) => item.client_id);
        const listPackageStatusId = listCreated.map(
          (item) => item.package_status_id
        );
        const listTMPPackingStatus = listCreated.map(
          (item) => item.tmp_picking_status
        );
        const listCreatedAliass = listCreated.map((item) => item.alias);

        const { result: listNewOrder } = await this.getDetailPackage({
          listOrderId: listCreatedIds,
          listAlias: listCreatedAliass,
          listClientIds: listClientIds,
          listPackageStatusId: listPackageStatusId,
          listTMPPackingStatus: listTMPPackingStatus,
        });

        const result = [...this.listOrder, ...listNewOrder];

        if (reset) {
          this.listOrder = uniqBy(listNewOrder, function (e) {
            return e.orderId;
          });
        } else {
          this.listOrder = uniqBy(result, function (e) {
            return e.orderId;
          });
        }

        if (reset) {
          this.loadAll = false;
        }

        // Cập nhật tổng.
        this.$store.commit("orderCreated/updateTotal", approxResultsCount);

        // Nếu tổng số đơn lớn hơn hoặc bằng số lượng limit hiện tại thì dừng lại.
        // Nếu currentPageLoading lớn hơn tổng hiện tại / 5 thì cũng dừng lại.
        if (
          this.listOrder.length >= this.limit ||
          this.currentPageLoading >= ((this.currentPage + 1) * this.limit) / 5
        ) {
          this.finish = true;
        }
      } else {
        if (reset) {
          this.loadAll = false;
        }
        message.error("Lỗi tải dữ liệu");
      }
    },
    // ----------------------------------- FUNCTION HELP DATA ----------------------------------------
    getSecondTime(timer = new Date()) {
      return parseInt(`${timer.getTime() / 1000}}`) + 1;
    },
    /**
     * Scroll to top.
     */
    handleScrollToTop: debounce(() => {
      const contentScrollable = document.querySelector("div.scroller");
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
      }
    }, 1),
    // ----------------------------------- ORDER --------------------------------
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

    handleApplyFilter(filter) {
      this.filterParam = { ...filter };
      this.currentPageLoading = 0;
      this.currentPage = 0;
      this.syncDataFromDatabase(true);
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

    // -------------------------------- PRODUCT ------------------------
    handleUpdateOrderById(id, tags, messages, isReplaceMessage = false) {
      this.listOrder = this.listOrder.map((order) => {
        if (order.id === id) {
          let message = messages.join("; ");

          return {
            ...order,
            tags,
            message: isReplaceMessage ? message : order.message + message,
          };
        }
        return order;
      });
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
