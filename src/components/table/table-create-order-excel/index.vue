<template>
  <div :style="{ height }" class="fast-order__container" ref="fastOrder">
    <dynamic-scroller
      key-field="orderId"
      :items="listOrder"
      :min-item-size="135"
      :buffer="1080"
      class="scroller"
    >
      <template #before>
        <div class="header" :style="columnsWrapper">
          <div
            v-for="col in columns"
            :key="col.key"
            class="header__col-title"
            :class="`${col.key}`"
          >
            <div
              v-if="
                col.key !== 'products' &&
                col.key !== 'action' &&
                col.key !== 'hub' &&
                col.key !== 'vc'
              "
            >
              {{ col.title }}
            </div>
            <div v-else-if="col.key === 'hub'">
              <div
                v-once
                class="d-flex align-items-center justify-content-center flex-column"
              >
                <div>Kho &</div>
                <span>Phiên lấy hàng</span>
              </div>
            </div>
            <div v-else-if="col.key === 'vc'">
              <div
                v-once
                class="d-flex align-items-center justify-content-center flex-column"
              >
                <div>Dịch vụ &</div>
                <span>Hình thức VC</span>
              </div>
            </div>
            <div v-else-if="col.key === 'action'">
              <div
                class="header__col-title-action d-flex align-items-center justify-content-center flex-column"
              >
                <div v-once class="mx-auto" style="width: 40px">
                  Chọn tất cả
                </div>
                <g-checkbox
                  class="action-select-all"
                  v-model:checked="isSelectAll"
                  :indeterminate="indeterminate"
                  name="selectAll"
                  @change="handleSelectAll"
                />
              </div>
            </div>
            <div v-else>
              <div v-once class="header__col-title-products">
                <div v-once class="product-name">Tên sản phẩm</div>
                <div v-once class="product-quantity">Số lượng</div>
                <div v-once class="product-weight">Khối lượng (kg)</div>
                <div v-once class="product-value">Giá trị hàng</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot="{ item, index, active }">
        <dynamic-scroller-item
          :item="item"
          :active="active"
          :data-index="index"
        >
          <order-excel-item
            :orderId="item.orderId"
            :item="item"
            :debounceConfig="debounceConfig"
            :columns="columns"
            :orderIndex="index"
            :columnsWrapper="columnsWrapper"
            :expNotes="expNotes"
            :whoPays="whoPays"
            :serviceMethods="serviceMethods"
            :shipMethods="shipMethods"
            :listProduct="listProduct"
            :listWareHouse="listWareHouse"
            :excelColumns="excelColumns"
            :provincesCache="provincesCache"
            :packageLabels="packageLabels"
            :isApplyAllWarehouse="isApplyAllWarehouse"
            :isApplyAllTransport="isApplyAllTransport"
            :isApplyAllMessage="isApplyAllMessage"
            :isApplyAllPickTime="isApplyAllPickTime"
            :isApplyAllFreeShip="isApplyAllFreeShip"
            @onRemoveOrder="handleRemoveOrder"
            @onSwapOrder="handleSwapOrder"
            @onCheckCapacityPickupAll="handleCheckCapacityPickupAll"
            @onApplyAllByField="handleApplyAllByField"
            @onApplyDataFromExcel="handleApplyDataFromExcel"
          />
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import OrderExcelItem from "@/components/table/table-create-order-excel/order-excel-item.vue";
import GCheckbox from "@/components/elements/checkbox.vue";
import { forEach, map, filter, sumBy } from "lodash";

const columns = [
  {
    key: "action",
    title: "",
    minWidth: "50px",
    width: "50px",
    slot: "ColAction",
  },
  {
    key: "stt",
    title: "STT",
    minWidth: "50px",
    width: "50px",
    slot: "ColSTT",
  },
  {
    key: "pkg_code",
    title: "Mã ĐH riêng",
    minWidth: "50px",
    width: "50px",
    slot: "ColCode",
  },
  {
    key: "customer_name",
    title: "Tên khách hàng",
    minWidth: "200px",
    width: "200px",
    slot: "ColName",
  },
  {
    key: "customer_phone",
    title: "SĐT",
    minWidth: "100px",
    width: "100px",
    slot: "ColPhone",
  },
  {
    key: "customer_address",
    title: "Địa chỉ chi tiết",
    minWidth: "250px",
    width: "1fr",
    slot: "ColAddress",
  },
  {
    key: "products",
    title: "Tên sản phẩm",
    minWidth: "400px",
    width: "400px",
    slot: "ColProducts",
  },
  {
    key: "pick_money",
    title: "Tiền CoD",
    minWidth: "100px",
    width: "100px",
    slot: "ColPickMoney",
  },
  {
    key: "note",
    title: "Ghi chú",
    minWidth: "200px",
    width: "200px",
    slot: "ColNote",
  },
  {
    key: "hub",
    title: "Kho & Phiên lấy hàng",
    minWidth: "150px",
    width: "150px",
  },
  {
    key: "vc",
    title: "Dịch vụ & hình thức VC",
    minWidth: "100px",
    width: "100px",
  },
  {
    key: "pay_ship",
    title: "Trả ship",
    minWidth: "100px",
    width: "100px",
  },
];

// const EXCEL_CONFIRM_TIME = 1800;

export default defineComponent({
  components: {
    OrderExcelItem,
    GCheckbox,
  },
  props: {
    height: {
      type: String,
    },
    selectAll: {
      type: Boolean,
    },
    indeterminate: {
      type: Boolean,
    },
    listOrder: {
      type: Array,
    },
    expNotes: {
      type: Array,
    },
    excelColumns: {
      type: Array,
    },
    provincesCache: {
      type: Array,
    },
    packageLabels: {
      type: Array,
    },
    debounceConfig: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      updating: 1,
      columns,
    };
  },
  computed: {
    isSelectAll: {
      get() {
        return this.selectAll;
      },
      set(value) {
        this.$emit("onInputSelectAll", value);
      },
    },
    columnsWrapper() {
      let wrapperStyleStr = "";
      const COL_MIN_WIDTH = "100px";
      forEach(columns, (col) => {
        const minMax = `minmax(${col.minWidth || COL_MIN_WIDTH}, ${
          col.width
        }) `;
        wrapperStyleStr += minMax;
      });
      return {
        "grid-template-columns": wrapperStyleStr,
      };
    },
    whoPays() {
      return this.$store.state.constant.whoPays;
    },
    shipMethods() {
      return this.$store.state.constant.shipMethods;
    },
    serviceMethods() {
      return this.$store.state.constant.serviceMethods;
    },
    listProduct() {
      return this.$store.state.orderExcel.listProduct;
    },
    listWareHouse() {
      return this.$store.state.orderExcel.listWarehouse;
    },
    isApplyAllTransport() {
      return this.$store.state.orderExcel.isApplyAllTransport;
    },
    isApplyAllMessage() {
      return this.$store.state.orderExcel.isApplyAllMessage;
    },
    isApplyAllWarehouse() {
      return this.$store.state.orderExcel.isApplyAllWarehouse;
    },
    isApplyAllPickTime() {
      return this.$store.state.orderExcel.isApplyAllPickTime;
    },
    isApplyAllFreeShip() {
      return this.$store.state.orderExcel.isApplyAllFreeShip;
    },
  },
  methods: {
    handleSelectAll(event) {
      setTimeout(() => {
        const newSelectedOrder = {};
        forEach(this.listOrder, (order) => {
          newSelectedOrder[order.orderId] = event.target.checked;
        });
        this.$store.commit("orderExcel/selectOrder", {
          newSelectedOrder,
          isHard: true,
        });
      }, 0);
    },
    handleRemoveOrder(orderId) {
      this.$emit("onRemoveOrder", orderId);
    },
    handleApplyDataFromExcel(rowIndex, productIndex, startField, listOrder) {
      this.$emit(
        "onApplyDataFromExcel",
        rowIndex,
        productIndex,
        startField,
        listOrder
      );
    },
    handleSwapOrder(orderId) {
      this.$emit("onSwapOrder", orderId);
    },
    handleApplyAllByField(payload) {
      this.$emit("applyAllByField", payload);
    },
    handleCheckCapacityPickupAll() {
      const filterData = filter(this.listOrder, (order) => order.warehouse);
      const listOrderCheckPickTime = map(filterData, (x) => ({
        order_id: x.orderId,
        warehouse: x.warehouse,
        products: x.products,
        weight: sumBy(x.products, (product) => Number(product.weight)).toFixed(
          2
        ),
      }));
      this.$emit("onCheckCapacityPickupAll", listOrderCheckPickTime);
    },
    // async handleGetPackageDraftDetail() {
    // Do something.
    // draftId
    // const requestParam = {
    //   draft_id: draftId,
    // };
    // const draftResponse = await liveStreamService.getPackageDraftDetail(
    //   this.access_token,
    //   requestParam,
    //   (values) => values.data
    // );
    // if (draftResponse.success) {
    //   this.draftOrder = draftResponse.data;
    //   this.draftOrder.package = {
    //     draft_package: draftResponse.data.package,
    //   };
    //   this.isShowDetailDraftDuplicate = !this.isShowDetailDraftDuplicate;
    // }
    // },
    // handleShowOrderDuplicateDetail(packageOrder) {
    //   if (packageOrder.draft_id) {
    //     this.handleGetPackageDraftDetail(packageOrder.draft_id);
    //     return;
    //   }
    //   this.packageOrder = packageOrder.order;
    //   this.isShowDetailOrderDuplicate = !this.isShowDetailOrderDuplicate;
    // },
    // handleCloseOrderDuplicateDetail() {
    //   this.isShowDetailOrderDuplicate = !this.isShowDetailOrderDuplicate;
    // },
    // handleCloseDraftDuplicateDetail() {
    //   this.isShowDetailDraftDuplicate = !this.isShowDetailDraftDuplicate;
    // },
    // TODO NamVH: Ẩn tạm x fast
    // ------------------------------------------------ X FAST ----------------------------------------
    // handleUpdateSingleXfast(data, orderIndex) {
    //   this.$emit("onUpdateSingleXfast", data, orderIndex);
    // },
    // handleCheckXFastAll() {
    //   const listOrderCanCheckXFast = this.handleGetListOrderCanCheckXFast();
    //   if (size(listOrderCanCheckXFast) > 0) {
    //     this.$emit("onCheckXFastAll", listOrderCanCheckXFast);
    //   }
    // },
    // handleGetListOrderCanCheckXFast() {
    //   const filteredResult = filter(this.listOrder, (order) => {
    //     const isHasAddress =
    //       order.addressObj &&
    //       order.addressObj.customer_province_id &&
    //       order.addressObj.customer_district_id &&
    //       (order.addressObj.customer_street_id ||
    //         order.addressObj.customer_ward_id);
    //     return order.warehouse && isHasAddress;
    //   });
    //   return map(filteredResult, (x) => ({
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
    //   }));
    // },
  },
});
</script>
