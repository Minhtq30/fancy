<template>
  <div id="filter-excel" class="filter-order-excel-wrapper">
    <div class="filter-order-excel">
      <div class="t-inline-block t-my-1">
        <a-radio-group
          name="radioGroup"
          v-model:value="selectedType"
          @change="handleChangeFilter"
        >
          <g-radio value="total">Tất cả / {{ total }} ĐH</g-radio>
          <g-radio value="valid">Hợp lệ / {{ total - invalid }} ĐH</g-radio>
          <g-radio value="invalid">Lỗi / {{ invalid }} ĐH</g-radio>
        </a-radio-group>
      </div>
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
      <filter-pick-time
        :options="listPickTime"
        :checkedList="filter.pickTime"
        @onChange="handleChangePickTime"
      />
      <filter-warehouse
        :options="listHub"
        :checkedList="filter.warehouse"
        @onChange="handleChangeWarehouse"
      />
      <filter-produce
        :options="productOptions"
        :checkedList="filter.products"
        @onChange="handleChangeProduct"
      />
      <filter-cash :checkedList="filter.cash" @onChange="handleChangeCash" />
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
  <div class="w-120 t-inline-block t-text-right">
    <g-button @click="onVisibleConfigModal(true)" class="filter-button">
      <template #icon>
        <g-setting-icon />
      </template>
      <span>Thiết lập</span>
    </g-button>
  </div>
  <g-create-order-script-modal
    :visible="visibleConfigModal"
    :setVisible="onVisibleConfigModal"
    :packageLabels="packageLabels"
    @onApplyConfig="handleApplyConfig"
  />
</template>

<script>
import { defineComponent, ref } from "vue";
import { debounce, uniqBy } from "lodash";

// Components
import GRadio from "@/components/elements/radio.vue";
import GButton from "@/components/elements/button.vue";
import SearchActiveIcon from "@/components/icons/SearchActiveIcon.vue";
// import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import GSettingIcon from "@/components/icons/SettingIcon.vue";

import GCreateOrderScriptModal from "@/components/modal/CreateOrderScriptModal.vue";
import FilterPickTime from "@/components/filter/filter-common/filter-pick-time";
import FilterWarehouse from "@/components/filter/filter-common/filter-warehouse";
import FilterProduce from "@/components/filter/filter-common/filter-produce";
import FilterCash from "@/components/filter/filter-common/filter-cash";
import FilterCustomer from "@/components/filter/filter-common/filter-customer";
import FilterLocation from "@/components/filter/filter-common/filter-location";

export default defineComponent({
  name: "FilterOrderExcel",
  components: {
    FilterLocation,
    FilterCustomer,
    FilterCash,
    FilterProduce,
    FilterWarehouse,
    FilterPickTime,
    SearchActiveIcon,
    GRadio,
    GButton,
    // GInput,
    // GDropdownSelect,
    GSettingIcon,
    GCreateOrderScriptModal,
  },
  created() {
    this.debounceUpdateFilter = debounce(this.updateTextPattern, 300);
  },
  mounted() {
    this.$emit("onFilterMounted");
  },
  data() {
    return {
      filter: {
        type: "all",
        textSearch: "",
        pickTime: [],
        warehouse: [],
        products: [],
        cash: [],
        customer: [],
        location: "",
        locationMulti: [],
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
    listProduct: Array,
    listPickTime: Array,
    packageLabels: Array,
  },
  methods: {
    handleApplyConfig(config) {
      this.$emit("onApplyConfig", config);
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
      this.filter.pickTime = data.checkedList;
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
    handleChangeCustomer(data) {
      this.filter.customer = data.checkedList;
      this.updateFilter();
    },
    handleChangeLocation(data) {
      this.filter.locationMulti = data.checkedList;
      this.filter.location = null;
      this.updateFilter();
    },
    handleChangeFilter() {
      setTimeout(() => {
        this.$store.commit("orderExcel/showAction", {
          actionName: "typeFilter",
          action: "typeFilter",
          actionValue: this.selectedType,
        });
        setTimeout(() => {
          this.$emit("changeFilter");
        }, 50);
      }, 50);
    },
    updateTextPattern(event) {
      const text = event.target.value;
      this.updateFilter({ pattern: text });
    },
    updateFilter(obj) {
      if (obj) this.filter = Object.assign(this.filter, obj);
      this.$emit("apply", this.filter);
    },
  },
  computed: {
    productOptions() {
      const listProduct = uniqBy(this.listProduct, function (e) {
        return e;
      });
      const products = [];
      listProduct.forEach((item, index) => {
        products.push({ key: index, value: item, label: item });
      });

      return products;
    },
    listHub: function () {
      return this.listHubs.filter((hub) => hub.hub_code != -1);
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
.filter-order-excel-wrapper {
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
.filter-order-excel-wrapper {
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
.filter-order-excel-wrapper {
  display: inline-block;
  width: calc(100% - 120px);
  font-size: 0.875rem;
}

.filter-order-excel {
  display: inline-block;
  align-items: center;
  padding: 5px 0px;
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
