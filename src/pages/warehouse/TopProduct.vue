<template>
  <div id="warehouse-page__top-product" class="t-relative t-h-full">
    <div class="overlay" v-if="loading && !showIndicator">
      <a-spin :spinning="loading" />
    </div>
    <div class="t-flex t-pb-8 top-product__top t-mt-[-4px]">
      <div
        class="warehouse-page-tilte t-flex t-items-center t-text-[18px] t-cursor-pointer"
      >
        <a
          @click="handleChangeRouter('danh-sach-san-pham')"
          class="t-text-[#069255] hover:t-text-[#069255]"
          >Quản lý kho & sản phẩm
        </a>
        <span class="t-mx-[15px] t-text-[#E0E0E0]">|</span>
        <header-title
          class="t-text-[18px]"
          @onBack="onBack"
          :no-action="true"
          :title="title"
        />
      </div>
      <div class="flex t-justify-around ranking-toogle t-pt-1 t-ml-8">
        <!-- <div class="switch-toogle"></div> -->
        <div
          :class="tabActiveRight === 'top_selling' ? 'bggreen' : ''"
          v-on:click="toggleLineChart"
          tabIndex="1"
          class="top-sell-text"
        >
          Bán chạy
        </div>
        <div
          :class="tabActiveRight === 'return_rate' ? 'bgred' : ''"
          v-on:click="toggleLineChart"
          tabIndex="2"
          class="top-refund-text"
        >
          Hoàn cao
        </div>
      </div>
    </div>
    <div class="top-product__filter t-mb-6 t-h-[82px] xl:t-h-auto">
      <a-row :gutter="[16, 16]">
        <a-col class="top-input-search t-w-[448px]">
          <g-input
            placeholder="Nhập tên sản phẩm"
            :value="filter.product_name"
            @change="handleChangeFilterName"
            :on-change="handleChangeFilterName"
            @keyup.enter="handleFilter"
          />
          <img class="ml" src="@/assets/icons/search_active.svg" />
        </a-col>
        <a-col class="top-date-picker t-w-[216px]">
          <g-daterange-picker-select
            :placeholder="'Thời gian'"
            :from-date="returnDateMoment(filter.from_date)"
            :to-date="returnDateMoment(filter.to_date)"
            :onChange="handleFilterByCustomerCreated"
            :controlTime="true"
            :allowClear="true"
            :isIncremental="true"
            :showTooltip="true"
            :control-time="false"
          />
        </a-col>
        <a-col class="top-dropdown t-w-[216px]">
          <g-dropdown-select
            :placeholder="'Tất cả kho'"
            :options="pickAddressList"
            :value="filter.warehouse_id || [0]"
            :onChange="handleFilterByWarehouse"
            :is-single="true"
          />
        </a-col>
        <a-col>
          <button class="t-h-8" @click="handleSearchByFilter">
            <p
              class="t-text-white t-text-center t-font-medium t-text-base t-leading-4 t-items-center"
            >
              Tìm kiếm
            </p>
          </button>
        </a-col>
      </a-row>
    </div>
    <top-product-table-skeleton v-if="showIndicator" />
    <top-product-table
      v-else
      :loading="loading"
      :typeActive="tabActiveRight"
      :handleChangePage="handleChangePage"
      :handleChangeLimit="handleChangeLimit"
      :totalPages="totalPages"
      :page="filter.page"
      :page_size="filter.page_size"
    />
  </div>
</template>

<script>
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import { GInput } from "@/components/elements";
import { GDaterangePickerSelect } from "@/components";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import TopProductTableSkeleton from "@/components/table/table-top-product/TopProductTableSkeleton";
import TopProductTable from "@/components/table/table-top-product/TopProductTable";
import { mapState } from "vuex";
import moment from "moment";
import { get } from "lodash";
export default {
  components: {
    TopProductTable,
    GInput,
    HeaderTitle,
    GDaterangePickerSelect,
    GDropdownSelect,
    TopProductTableSkeleton,
  },
  mounted() {
    this.getProductList();
  },
  computed: {
    ...mapState({
      paging: (state) => state.warehouse.productList.paging,
      warehouses: (state) => state.warehouse.warehouses || [],
    }),
    getUserName() {
      return this.$store.state.shop.ShopStaff.fullname;
    },
    getUserId() {
      return this.$store.state.shop.ShopStaff.id;
    },
    total() {
      return get(this.$store.state.warehouse.productList.paging, "total", 1);
    },
    totalPages() {
      const page_size = this.filter.page_size || 25;

      if (this.total % page_size === 0) return this.total / page_size;

      return Math.floor(this.total / this.filter.page_size) + 1;
    },
    pickAddressList() {
      const pickAddresses = this.warehouses.map((w) => ({
        ...w,
        key: w.id,
        title: w.name,
      }));
      if (pickAddresses.length) {
        return [{ key: 0, title: "Tất cả" }, ...pickAddresses];
      }
      return [];
    },
  },
  data() {
    return {
      tabActiveRight: "top_selling",
      title: "Top sản phẩm",
      loading: false,
      filter: {
        best_sell: true,
        page: 1,
        page_size: 25,
      },
      showIndicator: true,
    };
  },
  methods: {
    handleChangeRouter(path) {
      this.$router.push(`/kho-va-san-pham/${path}`);
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

      this.$router.push({ query });
      this.getProductList();
    },
    onBack() {
      this.$router.go(-1);
    },
    toggleLineChart() {
      this.tabActiveRight =
        this.tabActiveRight === "return_rate" ? "top_selling" : "return_rate";
      this.filter.best_sell = this.tabActiveRight === "top_selling";
      this.handleChangePage(1);
    },
    handleFilterByWarehouse(_value) {
      this.filter.warehouse_id = _value;
    },
    handleChangeFilterName(event) {
      this.filter.product_name = event.target.value;
    },
    handleFilter() {
      this.filter.page = 1;
      this.handleChangeQueryUrl();
    },
    handleFilterByCustomerCreated({ fromDate, toDate }, key) {
      if (key === "incremental") {
        this.filter.from_date = undefined;
        this.filter.to_date = new Date().getTime();
      } else {
        this.filter.from_date = fromDate;
        this.filter.to_date = toDate;
      }
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
      if (_params.from_date && _params.to_date) {
        _params.from_date = _params.from_date / 1000;
        _params.to_date = _params.to_date / 1000;
        const optionParamsFormat = {
          from_date: moment
            .unix(_params.from_date)
            .format("YYYY-MM-DD+HH:mm:ss"),
          to_date: moment.unix(_params.to_date).format("YYYY-MM-DD+HH:mm:ss"),
        };
        const customerCreatedTo = moment(
          optionParamsFormat.to_date?.replace("+", " ")
        );
        this.filter = {
          ...this.filter,
          from_date: _params.from_date
            ? moment(optionParamsFormat.from_date?.replace("+", " "))
            : moment().startOf("month").startOf("day"),
          to_date: _params.to_date
            ? optionParamsFormat.to_date.includes("23:59:59")
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
    },

    handleSearchByFilter() {
      // this.loading = true;
      this.filter.best_sell = this.tabActiveRight === "top_selling";
      this.handleChangePage(1);
      // this.loading = false;
    },
    scrollToTop() {
      if (!this.showIndicator) {
        document.querySelector(".top-product-wrapper").scrollTo(0, 0);
      }
    },
    async getProductList() {
      this.scrollToTop();
      this.loading = true;
      // this.filter.user_name = this.getUserName;
      // this.filter.user_id = this.getUserId;
      if (this.filter.from_date === "" && this.filter.from_date === "") {
        this.filter.from_date = "";
        this.filter.from_date = "";
      }
      try {
        const error = await this.$store.dispatch(
          "warehouse/getProduct",
          this.filter
        );
        if (error) {
          this.$message.error(error);
        }
        if (this.showIndicator) this.showIndicator = false;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    returnDateMoment(date) {
      return Number(date) ? moment(new Date(Number(date))) : null;
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
        this.getProductList();
      },
    },
    tabActiveRight(newData) {
      this.filter.best_sell = newData === "top_selling";
    },
  },
};
</script>

<style lang="scss" scoped>
#warehouse-page__top-product {
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
  .top-product__top {
    grid-template-columns: auto auto auto;
  }
  .top-product__filter {
    .top-input-search {
      .g-input {
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
    button {
      width: 184px;
      background-color: #069255;
      border-radius: 5px;
    }
  }
  .ranking-toogle {
    width: 180px;
    height: 36px;
    box-sizing: border-box;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
    border-radius: 100px;
    text-align: center;
    font-weight: 500;
    cursor: pointer;
    .top-sell-text {
      width: 84px;
      height: 28px;
      box-sizing: border-box;
      text-align: center;
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
      border-radius: 100px;
      display: flex;
      justify-content: center;
    }
    .top-refund-text {
      width: 84px;
      height: 28px;
      box-sizing: border-box;
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
      text-align: center;
      border-radius: 100px;
      display: flex;
      justify-content: center;
    }
    .bggreen {
      width: 84px;
      height: 28px;
      background-color: #069255;
      color: #fff;
      box-sizing: border-box;
      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
      border-radius: 100px;
      display: flex;
      justify-content: center;
    }
    .bgred {
      width: 84px;
      height: 28px;
      background-color: #da4838;
      color: #fff;
      box-sizing: border-box;
      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
      border-radius: 100px;
      display: flex;
      justify-content: center;
    }

    .fade-in {
      animation: animation-fade-in 0.3s ease-out 0.1s both;
    }

    .fade-in-reverse {
      animation: animation-fade-in-reverse 0.3s ease-out 0.1s both;
    }

    @keyframes animation-fade-in {
      0% {
        opacity: 1;
        transform: translateX(70px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes animation-fade-in-reverse {
      0% {
        opacity: 1;
        transform: translateX(-70px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
}
</style>
