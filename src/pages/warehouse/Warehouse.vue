<template>
  <div id="warehouse-page" class="t-h-full t-relative">
    <div class="overlay" v-if="loadingSpin && !showIndicator">
      <a-spin :spinning="loadingSpin" />
    </div>
    <div
      class="warehouse-page-title t-flex t-items-center t-justify-between t-text-[18px]"
    >
      <header-title
        class="t-text-[18px]"
        @onBack="onBack"
        :no-action="true"
        :title="title"
      />
      <div class="warehouse-page-actions t-flex t-items-center t-mr-[30px]">
        <div
          class="request-item primary-text t-flex t-items-center t-h-[40px] t-font-medium t-text-[16px] t-cursor-pointer"
          @click="openModal(false)"
        >
          <svg
            class="t-mr-[5px] t-mb-[2px]"
            width="20"
            height="17"
            viewBox="0 0 20 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 9.83342L16.6667 6.50008V9.00008H9.16667V10.6667H16.6667V13.1667L20 9.83342ZM15 12.3334V16.5001H1.66667V9.00008H0L8.33333 0.666748L15 7.33342H12.5L8.33333 3.16675L3.33333 8.16675V14.8334H13.3333V12.3334H15Z"
              fill="#069255"
            />
          </svg>
          Xuất
        </div>
        <span class="t-mx-[15px] t-text-[#E0E0E0]">|</span>
        <div
          class="request-item primary-text t-flex t-items-center t-h-[40px] t-font-medium t-text-[16px] t-cursor-pointer"
          @click="openModal(true)"
        >
          <svg
            class="t-mr-[5px] t-mb-[2px]"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5003 9.83341L8.16699 6.50008V9.00008H0.666992V10.6667H8.16699V13.1667L11.5003 9.83341ZM17.3337 9.00008H15.667V16.5001H2.33366V12.3334H4.00033V14.8334H14.0003V8.16675L9.00033 3.16675L4.83366 7.33341H2.33366L9.00033 0.666748L17.3337 9.00008Z"
              fill="#069255"
            />
          </svg>
          Nhập
        </div>
        <span class="t-mx-[15px] t-text-[#E0E0E0]">|</span>
        <div
          class="request-item primary-text t-flex t-items-center t-h-[40px] t-font-medium t-text-[16px] t-cursor-pointer"
          @click="handleClickAdd"
        >
          <svg
            class="t-mr-[5px] t-mb-[2px]"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0402 7.96025V0.666748H7.96049V7.96025H0.666992V10.0399H7.96049V17.3334H10.0402V10.0399H17.3337V7.96025H10.0402Z"
              fill="#00904A"
            />
          </svg>
          Tạo SP
        </div>
      </div>
    </div>
    <div class="warehouse-page-filter t-mt-[10px] t-mb-[20px]">
      <div class="filter-field">
        <a-row :gutter="[16, 16]">
          <a-col :span="7" :xxl="4" class="t-p-0 t-flex t-items-center">
            <div
              class="t-flex t-justify-between t-items-center t-w-full t-h-[32px] t-gap-[10px]"
            >
              <div
                class="t-rounded-full t-w-1/2 t-border-solid t-border-[#069255] t-border-[0.5px] t-h-full t-flex t-items-center t-text-[12px] xl:t-text-[16px] t-text-[#069255] t-cursor-pointer t-justify-center"
                :class="this.filter.best_sell ? 'button-active' : ''"
                @click="toggleLineChart(true)"
              >
                Bán chạy
              </div>
              <div
                class="t-rounded-full t-w-1/2 t-border-solid t-border-[#069255] t-border-[0.5px] t-h-full t-flex t-items-center t-text-[12px] xl:t-text-[16px] t-text-[#069255] t-cursor-pointer t-justify-center"
                :class="!this.filter.best_sell ? 'button-active' : ''"
                @click="toggleLineChart(false)"
              >
                Hoàn cao
              </div>
            </div>
          </a-col>
          <a-col :span="11" :xxl="5">
            <div class="search-input-wrapper">
              <g-input
                placeholder="Nhập tên sản phẩm"
                @change="handleChangeFilterName"
                :value="filter.product_name"
                @keyup.enter="handleFilter"
              />
              <img src="@/assets/icons/search_active.svg" />
            </div>
          </a-col>
          <a-col :span="6" :xxl="3">
            <g-dropdown-select
              :placeholder="'Kho hàng'"
              :options="pickAddressList"
              :value="filter.warehouse_id || [0]"
              :onChange="handleChangeStorage"
              :min-width="'200px'"
              :is-single="true"
            />
          </a-col>
          <a-col :span="6" :xxl="3">
            <g-daterange-picker-select
              :placeholder="'Thời gian'"
              :controlTime="true"
              :from-date="returnDateMoment(filter.from_date)"
              :to-date="returnDateMoment(filter.to_date)"
              :onChange="handleChangeTime"
              :allowClear="true"
              :iconType="'arrow'"
              :isIncremental="true"
              :showTooltip="true"
              :control-time="false"
            />
          </a-col>
          <a-col :span="6" :xxl="3">
            <filter-total
              :listOptionSelected="listOptionSelected.totalSell"
              :default-from-value="Number(filter.from_total_sell)"
              :default-to-value="Number(filter.to_total_sell)"
              :placeholder="'Đã bán'"
              @onChange="handleChangeTotalSell"
            />
          </a-col>
          <a-col :span="6" :xxl="3">
            <filter-total
              :listOptionSelected="listOptionSelected.totalInventory"
              :default-from-value="Number(filter.from_inventory)"
              :default-to-value="Number(filter.to_inventory)"
              :placeholder="'Tồn kho'"
              @onChange="handleChangeTotalInventory"
            />
          </a-col>
          <a-col :span="6" :xxl="3">
            <button
              class="button-save t-rounded-[5px] t-p-0 t-h-[32px] t-w-full t-bg-[#00904A] t-text-[#fff]"
              @click="handleFilter"
            >
              Tìm kiếm
            </button>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="warehouse-page-table">
      <ware-house-skeleton v-if="showIndicator" />
      <ware-house-table
        v-else
        :loading="loadingSpin"
        :productsInPage="productsInPage"
        :handleChangePage="handleChangePage"
        :handleChangeLimit="handleChangeLimit"
        :totalPages="totalPages"
        :page="filter.page"
        :page_size="filter.page_size"
        :selectedWarehouses="filter.warehouse_id"
        @loadData="loadData"
      />
    </div>
  </div>
  <add-product-modal
    :key="visibleModal.addProduct"
    :visible="visibleModal.addProduct"
    :setVisible="setVisibleModal('addProduct')"
  ></add-product-modal>
  <import-export-product-warehouse-modal
    :isVisible="showModal"
    :isImport="isImport"
    :onSuccess="onSuccess"
    :setIsVisible="setIsVisibleImportExportModal"
    :selectedProducts="selectedProducts"
    :selectedWarehouses="selectedWarehouseComputed"
  />
</template>

<script>
import moment from "moment";
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import WareHouseTable from "@/components/table/warehouse-table/WareHouseTable";
import WareHouseSkeleton from "@/components/table/warehouse-table/WareHouseSkeleton";
import { GInput } from "@/components/elements";
import { GDaterangePickerSelect } from "@/components";
import GDropdownSelect from "@/components/select/DropdownSelect";
import FilterTotal from "@/components/filter/filter-common/filter-total";
import { FILTER_TOTAL_FROM_TO } from "@/contants";
import { get } from "lodash";
import AddProductModal from "@/components/modal/WareHouseModal/AddProductModal";
import ImportExportProductWarehouseModal from "@/components/modal/ImportExportProductWarehouseModal";
// import { ORDER_SERVICE, ORDER_STATUS, ORDER_TYPE } from "@/contants";

export default {
  components: {
    ImportExportProductWarehouseModal,
    AddProductModal,
    FilterTotal,
    GDropdownSelect,
    WareHouseSkeleton,
    WareHouseTable,
    HeaderTitle,
    GInput,
    GDaterangePickerSelect,
  },
  data() {
    return {
      title: "Quản lý kho & sản phẩm",
      showIndicator: true,
      loadingSpin: false,
      listOptionSelected: {
        totalInventory: FILTER_TOTAL_FROM_TO,
        totalSell: FILTER_TOTAL_FROM_TO,
      },
      visibleModal: {
        addProduct: false,
      },
      isImport: false,
      showModal: false,
      filter: {
        page: 1,
        page_size: 25,
        best_sell: true,
      },
      options: {
        warehouse_id: [],
      },
    };
  },
  mounted() {
    this.getFilterFromUrlParams(this.$route.query);
    this.getData();
  },
  computed: {
    packages() {
      return this.$store.state.warehouse.productList.products;
    },
    productsInPage() {
      return (this.packages || []).map((p) => ({
        id: p.product_id,
      }));
    },
    selectedWarehouseComputed() {
      if (
        this.filter.warehouse_id?.length === 1 &&
        this.filter.warehouse_id[0] === 0
      ) {
        return [];
      }
      return this.filter.warehouse_id;
    },
    pickAddressList() {
      let pickAddressList = Array.isArray(
        this.$store.state.warehouse.warehouses
      )
        ? this.$store.state.warehouse.warehouses
        : [];
      const pickAddresses = pickAddressList.map((w) => ({
        ...w,
        key: w.id,
        title: w.name,
      }));
      if (pickAddresses.length) {
        return [{ key: 0, title: "Tất cả" }, ...pickAddresses];
      }
      return [];
    },
    total() {
      return get(this.$store.state.warehouse.productList.paging, "total", 0);
    },
    totalPages() {
      const page_size = this.filter.page_size || 25;

      if (this.total % page_size === 0) return this.total / page_size;

      return Math.floor(this.total / this.filter.page_size) + 1;
    },
  },
  methods: {
    onSuccess(data) {
      if (data) {
        this.getData();
      }
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    setIsVisibleImportExportModal(_visible) {
      this.showModal = _visible;
    },
    handleClickAdd() {
      this.visibleModal.addProduct = true;
    },
    openModal(isImport) {
      this.showModal = true;
      this.isImport = isImport;
    },
    returnDateMoment(data) {
      return Number(data) ? moment(new Date(Number(data))) : null;
    },
    handleChangeRouter(path) {
      this.$router.push(`/kho-va-san-pham/${path}`);
    },
    toggleLineChart(data) {
      this.filter.best_sell = data;
      this.handleChangePage(1);
    },
    async getProduct() {
      try {
        await this.$store.dispatch("warehouse/getProduct");
      } catch (error) {
        this.$message.error(
          "Đã có lỗi xảy ra, hãy liên hệ CSKH để được hỗ trợ."
        );
      }
    },
    scrollToTop() {
      document.querySelector(".warehouse-table-wrapper").scrollTo(0, 0);
    },
    onBack() {
      this.$router.go(-1);
    },
    handleChangeQueryUrl(_query = {}) {
      if (this.filter.from_date && this.filter.to_date) {
        _query = {
          ..._query,
          from_date: this.filter.from_date.format("X") * 1000,
          to_date: this.filter.to_date.format("X") * 1000,
        };
      } else if (!this.filter.from_date && this.filter.to_date) {
        _query = {
          ..._query,
          to_date: this.filter.to_date,
        };
      }
      const query = {
        ...this.filter,
        ..._query,
      };

      if (query.to_date && !query.from_date) {
        delete query.to_date;
      }

      this.getData();
      this.$router.push({ query });
    },
    handleChangeFilterName(event) {
      this.filter.product_name = event.target.value;
    },
    handleChangeStorage(_value) {
      this.filter.warehouse_id = _value;
    },
    handleChangeTotalInventory(_value) {
      if (_value.valueRange !== {} && _value) {
        this.filter.from_inventory = _value.valueRange.from;
        this.filter.to_inventory = _value.valueRange.to;
      }
    },
    handleChangeTotalSell(_value) {
      if (_value.valueRange !== {}) {
        this.filter.from_total_sell = _value.valueRange.from;
        this.filter.to_total_sell = _value.valueRange.to;
      }
    },
    handleChangeTime({ fromDate, toDate }, key) {
      if (key === "incremental") {
        this.filter.from_date = undefined;
        this.filter.to_date = new Date().getTime();
      } else {
        this.filter.from_date = fromDate;
        this.filter.to_date = toDate;
      }
    },

    handleFilter() {
      this.filter.page = 1;
      this.handleChangeQueryUrl();
    },
    handleChangePage(page) {
      this.filter = { ...this.filter, page };
      this.handleChangeQueryUrl({ page });
    },
    handleChangeLimit(page_size) {
      this.filter = { ...this.filter, page_size };
      this.filter.page = 1;
      this.handleChangeQueryUrl({ page_size });
    },
    loadData(data) {
      if (data === true) {
        this.getData();
      }
    },
    async getData() {
      if (this.loadingSpin) return;

      this.scrollToTop();
      this.loadingSpin = true;
      try {
        const error = await this.$store.dispatch(
          "warehouse/getProduct",
          this.filter
        );
        if (error) {
          this.$message.error(error);
        }
        if (this.showIndicator) this.showIndicator = false;
      } catch (error) {
        console.error(error);
      }
      this.loadingSpin = false;
    },
    getFilterFromUrlParams(_params) {
      let _query = {};
      const fields = ["warehouse_id"];
      for (const field of fields) {
        if (_params[field]) {
          _query[field] =
            typeof _params[field] === "object"
              ? _params[field]
              : [_params[field]];

          _query[field] = _query[field].map((item) => Number(item));
        }
      }
      _query = { ..._query };
      this.filter = {
        ...this.filter,
        product_name: _params.product_name,
        page: Number(_params.page) || 1,
        page_size: Number(_params.page_size) || 25,
        warehouse_id: _query.warehouse_id,
      };
      if (_params.best_sell !== undefined) {
        this.filter = {
          ...this.filter,
          best_sell: _params.best_sell === "true",
        };
      }
      if (_params.from_date && _params.to_date) {
        _params = {
          ..._params,
          from_date: _params.from_date / 1000,
          to_date: _params.to_date / 1000,
        };
        const optionParamsFomat = {
          from_date: moment
            .unix(_params.from_date)
            .format("YYYY-MM-DD+HH:mm:ss"),
          to_date: moment.unix(_params.to_date).format("YYYY-MM-DD+HH:mm:ss"),
        };
        const customerCreatedTo = moment(
          optionParamsFomat.to_date?.replace("+", " ")
        );
        this.filter = {
          ...this.filter,
          from_date: _params.from_date
            ? moment(optionParamsFomat.from_date?.replace("+", " "))
            : moment().startOf("month").startOf("day"),
          to_date: _params.to_date
            ? optionParamsFomat.to_date.includes("23:59:59")
              ? customerCreatedTo.endOf("day")
              : customerCreatedTo
            : moment().endOf("month").endOf("day"),
        };
      } else if (!_params.from_date && _params.to_date) {
        this.filter = {
          ...this.filter,
          to_date: _params.to_date,
        };
      }
      if (_params.from_inventory && _params.to_inventory) {
        this.filter.from_inventory = _params.from_inventory;
        this.filter.to_inventory = _params.to_inventory;
      }
      if (_params.from_total_sell && _params.to_total_sell) {
        this.filter.from_total_sell = _params.from_total_sell;
        this.filter.to_total_sell = _params.to_total_sell;
      }
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        this.getFilterFromUrlParams(_query);
        if (this.$route.name !== "warehouse-and-products") {
          return;
        }
        // this.getCountPackage({
        //   from_date: _filter.from_date,
        //   to_date: _filter.to_date,
        // });
        this.getData();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
#warehouse-page {
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: 97%;
    width: calc(100% - 30px);
    z-index: 1;
  }
  padding: 1rem;
  .filter-field {
    .button-active {
      border-color: #069255;
      background-color: #069255;
      color: #ffffff;
    }
    .ant-row {
      margin: 0 !important;
      width: 100%;
      .ant-col {
        padding: 5px !important;
      }
    }
    .search-input-wrapper {
      position: relative;
      .g-input {
        height: 32px;
        padding-left: 40px;
        box-shadow: none;
      }
      img {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
