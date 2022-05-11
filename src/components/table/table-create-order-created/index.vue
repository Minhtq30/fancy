<template>
  <div :style="{ height }" class="fast-order__container" ref="fastOrder">
    <dynamic-scroller
      key-field="orderId"
      :items="listOrder"
      :min-item-size="135"
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
            <div v-if="col.key !== 'action'">
              {{ col.title }}
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
          </div>
        </div>
      </template>
      <template v-slot="{ item, index, active }">
        <dynamic-scroller-item
          :item="item"
          :active="active"
          :data-index="index"
        >
          <order-created-item
            :orderId="item.orderId"
            :currentPage="currentPage"
            :limit="limit"
            :item="item"
            :debounceConfig="debounceConfig"
            :orderIndex="index"
            :columnsWrapper="columnsWrapper"
            :expNotes="expNotes"
            :excelColumns="excelColumns"
            :packageLabels="packageLabels"
            :listUpdate="listUpdate"
            :listError="listError"
            @onSwapOrder="handleSwapOrder"
          />
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { forEach } from "lodash";
import $ from "jquery";

// Component
import OrderCreatedItem from "@/components/table/table-create-order-created/order-created-item";
import GCheckbox from "@/components/elements/checkbox.vue";

const columns = [
  {
    key: "action",
    title: "",
    minWidth: "80px",
    width: "80px",
  },
  {
    key: "stt",
    title: "STT",
    minWidth: "60px",
    width: "60px",
  },
  {
    key: "pkg_info_ghtk",
    title: "Thông tin đơn hàng",
    minWidth: "400px",
    width: "400px",
  },
  {
    key: "pick_order_info_ghtk",
    title: "Thông tin lấy hàng",
    minWidth: "400px",
    width: "400px",
  },
  {
    key: "pay_ship_and_product",
    title: "Tiền CoD và hàng hóa",
    minWidth: "450px",
    width: "1fr",
  },
  {
    key: "note",
    title: "Ghi chú",
    minWidth: "340px",
    width: "340px",
  },
  {
    key: "button_action",
    title: "Thao tác",
    minWidth: "140px",
    width: "140px",
  },
];

export default defineComponent({
  components: {
    OrderCreatedItem,
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
    currentPage: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 25,
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
     * Swap đơn hàng.
     * */
    handleSwapOrder(orderId) {
      this.$emit("onSwapOrder", orderId);
    },
  },
});
</script>
