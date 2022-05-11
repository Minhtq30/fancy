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
          <order-draft-item
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
            :listUpdate="listUpdate"
            :listError="listError"
            :isApplyAllWarehouse="isApplyAllWarehouse"
            :isApplyAllTransport="isApplyAllTransport"
            :isApplyAllMessage="isApplyAllMessage"
            :isApplyAllPickTime="isApplyAllPickTime"
            :isApplyAllFreeShip="isApplyAllFreeShip"
            @onRemoveOrder="handleRemoveOrder"
            @onSwapOrder="handleSwapOrder"
            @onCheckCapacityPickupAll="handleCheckCapacityPickupAll"
            @onApplyAllByField="handleApplyAllByField"
            @printOrder="printOrder"
            @onUpdateDraft="handleUpdateDraft"
            @onUpdateDraftToEcom="handleUpdateDraftToEcom"
          />
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import OrderDraftItem from "@/components/table/table-create-order-draft/order-draft-item";
import GCheckbox from "@/components/elements/checkbox.vue";
import { forEach, map, filter, sumBy } from "lodash";

import $ from "jquery";

const columns = [
  {
    key: "action",
    title: "",
    minWidth: "50px",
    width: "50px",
  },
  {
    key: "stt",
    title: "STT",
    minWidth: "40px",
    width: "40px",
  },
  {
    key: "pkg_code_ghtk",
    title: "Mã ĐH GHTK",
    minWidth: "90px",
    width: "90px",
  },
  {
    key: "pkg_code",
    title: "Mã ĐH riêng",
    minWidth: "50px",
    width: "50px",
  },
  {
    key: "customer_name",
    title: "Tên khách hàng",
    minWidth: "130px",
    width: "130px",
  },
  {
    key: "customer_phone",
    title: "SĐT",
    minWidth: "90px",
    width: "90px",
  },
  {
    key: "customer_address",
    title: "Địa chỉ chi tiết",
    minWidth: "250px",
    width: "1fr",
  },
  {
    key: "products",
    title: "Tên sản phẩm",
    minWidth: "400px",
    width: "400px",
  },
  {
    key: "pick_money",
    title: "Tiền CoD",
    minWidth: "85px",
    width: "85px",
  },
  {
    key: "note",
    title: "Ghi chú",
    minWidth: "180px",
    width: "180px",
  },
  {
    key: "hub",
    title: "Kho & Phiên lấy hàng",
    minWidth: "170px",
    width: "170px",
  },
  {
    key: "vc",
    title: "Dịch vụ & hình thức VC",
    minWidth: "90px",
    width: "90px",
  },
  {
    key: "pay_ship",
    title: "Phí ship",
    minWidth: "100px",
    width: "100px",
  },
  {
    key: "button_action",
    title: "Thao tác",
    minWidth: "100px",
    width: "100px",
  },
];

export default defineComponent({
  components: {
    OrderDraftItem,
    GCheckbox,
  },
  props: {
    height: {
      type: String,
    },
    loadMore: {
      type: Boolean,
    },
    finish: {
      type: Boolean,
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
    listUpdate: {
      type: Object,
    },
    listError: {
      type: Object,
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
  mounted() {
    $(".scroller").on("scroll", this.handleScroll);
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
      return this.$store.state.orderDraft.listProduct;
    },
    listWareHouse() {
      return this.$store.state.orderDraft.listWarehouse;
    },
    isApplyAllTransport() {
      return this.$store.state.orderDraft.isApplyAllTransport;
    },
    isApplyAllMessage() {
      return this.$store.state.orderDraft.isApplyAllMessage;
    },
    isApplyAllWarehouse() {
      return this.$store.state.orderDraft.isApplyAllWarehouse;
    },
    isApplyAllPickTime() {
      return this.$store.state.orderDraft.isApplyAllPickTime;
    },
    isApplyAllFreeShip() {
      return this.$store.state.orderDraft.isApplyAllFreeShip;
    },
  },
  methods: {
    handleScroll(el) {
      const percentageScrolled =
        (el.currentTarget.offsetHeight + el.currentTarget.scrollTop) /
        el.currentTarget.scrollHeight;

      if (percentageScrolled >= 0.85 && !this.loadMore && !this.finish) {
        this.$emit("onLoadMore");
      }
    },
    /**
     * Chọn tất cả.
     * */
    handleSelectAll(event) {
      setTimeout(() => {
        const newSelectedOrder = {};
        forEach(this.listOrder, (order) => {
          newSelectedOrder[order.orderId] = event.target.checked;
        });
        this.$store.commit("orderDraft/selectOrder", {
          newSelectedOrder,
          isHard: true,
        });
      }, 0);
    },
    /**
     * Xóa đơn hàng.
     * */
    handleRemoveOrder(orderId) {
      this.$emit("onRemoveOrder", orderId);
    },
    /**
     * Cập nhật đơn hàng.
     * */
    handleUpdateDraft(orderId) {
      this.$emit("onUpdateDraft", orderId);
    },
    /**
     * Đẩy đơn hàng.
     * */
    handleUpdateDraftToEcom(orderId) {
      this.$emit("onUpdateDraftToEcom", orderId);
    },
    /**
     * Swap đơn hàng.
     * */
    handleSwapOrder(orderId) {
      this.$emit("onSwapOrder", orderId);
    },
    /**
     * Áp dụng cho tất cả đơn hàng.
     * */
    handleApplyAllByField(payload) {
      this.$emit("applyAllByField", payload);
    },
    /**
     * Check capacity pickup.
     * */
    handleCheckCapacityPickupAll() {
      const filterData = filter(
        this.listOrder,
        (order) => order.warehouse?.value
      );
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
    printOrder(data) {
      this.$emit("printOrder", data);
    },
  },
});
</script>
