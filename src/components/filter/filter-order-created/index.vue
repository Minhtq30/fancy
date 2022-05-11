<template>
  <div class="filter-order-draft-wrapper">
    <div class="filter-order-draft">
      <div class="t-inline-block t-my-1">
        <a-input
          class="filter-text-search"
          placeholder="Tìm tên, SĐT, mã ĐH"
          @change="debounceUpdateFilter"
          v-model:value="filter.textSearch"
        >
          <template #prefix>
            <search-active-icon />
          </template>
        </a-input>
      </div>
      <filter-time-save
        :options="timeSaveData.timeSaveOptions"
        :checkedList="filter.timeSave"
        @onChange="handleChangeTimeSave"
        @onScrollEnd="handleTimeSaveScrollEnd"
        :loading="timeSaveData.loading"
      />
      <filter-pick-time-fix
        :checkedList="filter.pickTime"
        @onChange="handleChangePickTime"
      />
      <filter-warehouse
        :options="listHub"
        :checkedList="filter.warehouse"
        @onChange="handleChangeWarehouse"
      />
      <filter-produce
        :options="listProductSearch"
        :loading="loadingProduct"
        :checkedList="filter.products"
        @onSearch="debounceSearchProduct"
        @onChange="handleChangeProduct"
      />
      <filter-cash :checkedList="filter.cash" @onChange="handleChangeCash" />
      <filter-created-time v-if="false" @onChange="handleChangeCreatedTime" />
      <filter-print-status @onChange="handleChangePrintStatus" />
      <filter-customer
        :options="customerOptions"
        :checkedList="filter.customer"
        @onChange="handleChangeCustomer"
      />
      <div class="t-inline-block t-my-1 t-ml-4">
        <b>Khu vực giao</b>
        <a-radio-group :value="filter.location">
          <a-radio-button
            @click="handleClickRegionLocation($event, 'noi_tinh')"
            value="noi_tinh"
          >
            Nội tỉnh
          </a-radio-button>
          <a-radio-button
            @click="handleClickRegionLocation($event, 'noi_mien')"
            value="noi_mien"
          >
            Nội miền
          </a-radio-button>
          <a-radio-button
            @click="handleClickRegionLocation($event, 'lien_mien')"
            value="lien_mien"
          >
            Liên miền
          </a-radio-button>
        </a-radio-group>
        <filter-location
          :options="listProvinces"
          :checkedList="filter.locationMulti"
          @onChange="handleChangeLocation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { debounce, trim, uniqBy } from "lodash";

// Components
import { message } from "ant-design-vue";
import SearchActiveIcon from "@/components/icons/SearchActiveIcon.vue";

import FilterWarehouse from "@/components/filter/filter-common/filter-warehouse";
import FilterProduce from "@/components/filter/filter-common/filter-produce/index.search";
import FilterCash from "@/components/filter/filter-common/filter-cash";
import FilterCustomer from "@/components/filter/filter-common/filter-customer";
import FilterLocation from "@/components/filter/filter-common/filter-location";
import FilterTimeSave from "@/components/filter/filter-common/filter-time-save";
import FilterPickTimeFix from "@/components/filter/filter-common/filter-pick-time-fix";

// Util.
import services from "@/services";
import common from "@/utils/common";
import productMixin from "@/plugins/mixins/product";
import FilterCreatedTime from "@/components/filter/filter-common/filter-created-time";
import FilterPrintStatus from "@/components/filter/filter-common/filter-print-status";

export default defineComponent({
  name: "FilterOrderCreated",
  components: {
    FilterPrintStatus,
    FilterCreatedTime,
    FilterPickTimeFix,
    FilterTimeSave,
    FilterLocation,
    FilterCustomer,
    FilterCash,
    FilterProduce,
    FilterWarehouse,
    SearchActiveIcon,
  },
  created() {
    this.debounceUpdateFilter = debounce(this.updateTextPattern, 300);
    this.debounceSearchProduct = debounce(this.handleBrowseListProduct, 300);
    this.handleBrowseListProduct("");
  },
  data() {
    return {
      listProductSearch: [],
      loadingProduct: false,
      listPickTime: [],
      filter: {
        type: "all",
        textSearch: "",
        pickTime: [],
        warehouse: [],
        products: [],
        cash: [],
        customer: [],
        timeSave: [],
        location: "",
        cashRange: "",
        locationMulti: [],
        minDraftCreated: "",
        maxDraftCreated: "",
        isPrintedLabel: null,
      },
      customerOptions: [
        {
          key: "trusted",
          value: "trusted",
          title: "Khách hàng đáng tin cậy",
        },
        {
          key: "yellow",
          value: "yellow",
          title: "Khách hàng bị shiper report",
        },
        {
          key: "superRed",
          value: "superRed",
          title: "Khách hàng khó giao",
        },
        { key: "red", value: "red", title: "5 đơn chỉ nhận 1" },
        { key: "purple", value: "purple", title: "10 đơn chỉ nhận 1" },
        {
          key: "badReport",
          value: "badReport",
          title: "Khách hàng shop báo xấu",
        },
        {
          key: "goodReport",
          value: "goodReport",
          title: "Khách hàng hài lòng",
        },
      ],
      selectedType: "total",
      timeSaveData: {
        loading: false,
        finish: false,
        page: 0,
        timeSaveOptions: [],
      },
      pageTimeSave: 0,
    };
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
    invalid: {
      type: Number,
      default: 0,
    },
    listHubs: Array,
    packageLabels: Array,
  },
  async mounted() {
    await this.getTimeSaveOption();
  },
  mixins: [productMixin],
  methods: {
    /**
     * Tìm kiếm danh sách sản phẩm theo tên
     * @param {string} search Tên sản phẩm cần tìm
     */
    async handleBrowseListProduct(search) {
      this.loadingProduct = true;
      const response = await this.getProductByName(
        { term: trim(search) },
        { convertToWithoutPayloadLabel: true }
      );

      const listSelected = this.listProductSearch.filter((item) =>
        this.filter?.products?.includes(item.value)
      );

      this.listProductSearch = uniqBy([...listSelected, ...response], "value");
      this.loadingProduct = false;
    },
    async getTimeSaveOption() {
      this.timeSaveData.loading = true;
      const response =
        (await services.$package.getDraftSession({
          page: this.pageTimeSave,
          limit: 20,
        })) || [];
      if (response.success) {
        const times = common.convertLabelValueWithoutPayload({
          dataSource: response?.data || [],
          valueName: "batch_session_id",
          labelName: "created",
        });

        this.timeSaveData.timeSaveOptions = uniqBy(
          [...this.timeSaveData.timeSaveOptions, ...times],
          "value"
        );

        if (this.timeSaveData.timeSaveOptions?.length >= response.total) {
          this.finish = true;
        }

        this.pageTimeSave += 1;
        this.timeSaveData.loading = false;
      } else {
        message.error("Lỗi: lấy thông tin lượt đăng đơn");
      }
    },
    handleClickRegionLocation(event, data) {
      event.preventDefault();
      event.stopPropagation();
      if (data === this.filter.location) {
        this.filter.location = null;
      } else {
        this.filter.location = data;
      }
      this.updateFilter();
    },
    handleChangePickTime(data) {
      this.filter.pickTime = data;
      this.updateFilter();
    },
    handleChangeWarehouse(data) {
      this.filter.warehouse = data.checkedList;
      this.updateFilter();
    },
    handleChangeProduct(data) {
      this.filter.products = data.checkedList;
      this.updateFilter();
    },
    handleChangeCash({ data, dataRange }) {
      this.filter.cash = data;
      this.filter.cashRange = dataRange;
      this.updateFilter();
    },
    handleChangeCreatedTime(data) {
      this.filter.minDraftCreated = data.from;
      this.filter.maxDraftCreated = data.to;
      this.updateFilter();
    },
    handleChangePrintStatus(data) {
      this.filter.isPrintedLabel = data.isPrintedLabel;
      this.updateFilter();
    },
    handleChangeCustomer(data) {
      this.filter.customer = data.checkedList;
      this.updateFilter();
    },
    handleChangeTimeSave(data) {
      this.filter.timeSaveObject = data?.dataOptions?.created || {};
      this.filter.timeSave = [data.value];
      this.updateFilter();
    },
    handleChangeLocation(data) {
      this.filter.locationMulti = data.checkedList;
      this.filter.location = null;
      this.updateFilter();
    },
    updateTextPattern(event) {
      const text = event.target.value;
      this.updateFilter({ pattern: text });
    },
    updateFilter(obj) {
      if (obj) this.filter = Object.assign(this.filter, obj);
      this.$emit("apply", this.filter);
    },
    handleTimeSaveScrollEnd() {
      if (!this.timeSaveData.loading && !this.finish) {
        this.getTimeSaveOption();
      }
    },
  },
  computed: {
    listHub: function () {
      return this.listHubs.filter((hub) => `${hub.hub_code}` !== "-1");
    },
    listProvinces() {
      return this.$store.state.global.provinces;
    },
  },
  setup() {
    const visibleConfigModal = ref(false);

    const onVisibleConfigModal = (value) => {
      visibleConfigModal.value = value;
    };

    return {
      visibleConfigModal,
      onVisibleConfigModal,
    };
  },
});
</script>

<style lang="scss">
.filter-order-draft-wrapper {
  .filter-select {
    .ant-select-selector {
      border-radius: 50px !important;
      border-color: #d9d9d9 !important;
    }
  }
  .filter-select-wrapper {
    margin-left: 15px;
  }
}
.filter-order-draft-wrapper {
  .ant-table,
  .ant-input,
  .ant-select,
  .ant-btn {
    font-size: 0.875rem !important;
  }

  label.ant-radio-button-wrapper {
    margin-left: 4px !important;
    border-radius: 50px !important;
    border: 1px solid #d9d9d9;
    font-weight: 500;
    color: var(--primaryColor);
  }

  .ant-radio-button-wrapper:not(:first-child)::before {
    content: unset;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: white;
    background: #069255;
    border: 1px solid #069255;
    box-shadow: unset;
  }
}
.filter-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px !important;
  > span {
    margin-left: 5px;
    font-size: 0.875rem;
  }
}

// TODO NamVH: Cần tổ chức lại các bộ CSS global nhỏ này.
.option-item:hover {
  background: #069255;
  color: white;
  span {
    color: white;
  }
}

.option-item {
  padding: 10px;
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
}
</style>

<style lang="scss" scoped>
.filter-order-draft-wrapper {
  display: inline-block;
  width: calc(100% - 120px);
  font-size: 0.875rem;
}

.filter-order-draft {
  display: inline-block;
  align-items: center;
  padding: 5px 0;
  margin-bottom: 10px;
}

.filter-text-search {
  width: 200px;
  height: 32px;
  border-radius: 50px;
  svg {
    width: 15px;
    height: 15px;
  }
}

.w-120 {
  width: 120px;
}
</style>
