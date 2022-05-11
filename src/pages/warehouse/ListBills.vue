<template>
  <div class="list-bill t-h-full">
    <div class="overlay" v-if="loading && !showIndicator">
      <a-spin :spinning="loading" />
    </div>
    <div class="list-bill-tittle t-font-medium t-text-lg t-leading-5 t-pb-4">
      {{ getTypeFromRoute }}
    </div>
    <div class="list-bill__filter t-flex t-mb-6">
      <a-row :gutter="[16, 16]">
        <a-col class="top-date-picker t-w-56">
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
        <a-col class="top-dropdown">
          <g-dropdown-select
            :placeholder="'Tất cả kho'"
            :options="pickAddressList"
            :value="filter.shop_warehouse_id || [0]"
            :onChange="handleFilterByListBill"
            :is-single="true"
          />
        </a-col>
      </a-row>
      <div class="list-bill-count-total t-pl-4">
        <span>{{ total_package }} ĐH | {{ total_product }} SP</span>
      </div>
    </div>
    <list-bill-table-skeleton v-if="showIndicator" />
    <list-bill-table
      v-else
      :loading="loading"
      @scroll="handleScroll"
      :ListBill="bills"
      :handleChangePage="handleChangePage"
      :handleChangeLimit="handleChangeLimit"
      :totalPages="totalPages"
      :page="filter.page"
      :page_size="filter.page_size"
    />
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState } from "vuex";
import { GDaterangePickerSelect } from "@/components";

import GDropdownSelect from "@/components/select/DropdownSelect";
import ListBillTable from "@/components/table/table-list-bill/ListBillTable";
import warehouseService from "@/services/warehouse.service";
import moment from "moment";
import ListBillTableSkeleton from "@/components/table/table-list-bill/ListBillTableSkeleton";

const STEP = 5;

export default {
  components: {
    ListBillTable,
    GDaterangePickerSelect,
    GDropdownSelect,
    ListBillTableSkeleton,
  },
  mounted() {},
  computed: {
    ...mapState({
      warehouses: (state) => state.warehouse.warehouses || [],
    }),
    total() {
      return this.total_package || 1;
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
    getTypeFromRoute() {
      const type = this.formatTypeOrder(this.$route.query.type);
      return `Đơn ${type}`;
    },
    bills() {
      return this.ListBill.slice(0, this.indexGetDetail + STEP);
    },
  },
  data() {
    return {
      loading: false,
      filter: {
        type: "CREATED",
        page: 1,
        page_size: 25,
      },
      showIndicator: true,
      ListBill: [],
      isSelectedAll: false,
      total_package: 0,
      total_product: 0,
      dataLog: {},
      indexGetDetail: 0,
      listIds: [],
    };
  },
  methods: {
    handleFilterByCustomerCreated({ fromDate, toDate }, key) {
      if (key === "incremental") {
        this.filter.from_date = undefined;
        this.filter.to_date = new Date().getTime();
      } else {
        this.filter.from_date = fromDate;
        this.filter.to_date = toDate;
      }
      this.handleChangePage(1);
    },

    handleFilterByListBill(_value) {
      this.filter.shop_warehouse_id = _value;
      this.handleChangePage(1);
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
      this.$router.push({ query });
    },
    async getListBill(_params = {}) {
      this.scrollToTop();
      this.loading = true;
      if (this.filter.from_date && this.filter.to_date) {
        _params = {
          ..._params,
          from_date: this.filter.from_date.format("X") * 1000,
          to_date: this.filter.to_date.format("X") * 1000,
        };
      }
      let params = {
        ...this.filter,
        ..._params,
      };
      params = {
        ...params,
        page: this.filter.page - 1,
      };
      try {
        const response = await warehouseService.getListBill(params);
        if (response?.data?.success) {
          const _packages = response.data.data.packages;
          this.ListBill = _packages;
          this.total_package = response.data.data.total_package;
          this.total_product = response.data.data.total_product;
          let _ids = [];
          for (let i = 0; i < this.ListBill.length; i++) {
            if (this.ListBill[i].id) {
              _ids.push(this.ListBill[i].id);
            }
          }
          this.listIds = _ids;
          this.getOrderDetailById(0);
        }
      } catch (error) {
        console.error(error);
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau.");
      }
      if (this.showIndicator) this.showIndicator = false;
      this.loading = false;
    },
    getOrderDetailById(index) {
      const ids = this.listIds.slice(index, index + STEP);
      let arrayPromise = [];
      for (let i = 0; i < ids.length; i++) {
        arrayPromise.push(
          this.$store.dispatch("order/getOrderDetail", { id: ids[i] })
        );
      }
      Promise.all(arrayPromise);
    },
    getFilterFromUrlParams(_params) {
      let _query = {};
      const fields = ["shop_warehouse_id"];
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
        page: Number(_params.page) || 1,
        page_size: Number(_params.page_size) || 25,
        shop_warehouse_id: _query.shop_warehouse_id,
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
    returnDateMoment(date) {
      return Number(date) ? moment(new Date(Number(date))) : null;
    },
    scrollToTop() {
      if (!this.showIndicator) {
        document.querySelector(".list-bill-wrapper").scrollTo(0, 0);
      }
    },
    formatTypeOrder(type) {
      if (!type) return "";
      return {
        CREATED: "hàng đã tạo",
        DELIVERED_GHTK: "đã bàn giao GHTK",
        TRANSFER: "đang giao",
        RETURN: "hoàn hàng",
        DELIVERED_UNPAID: "đã giao & chưa CK",
        CHECKED: "đã đối soát CK",
        RETURNED: "đã trả hàng",
      }[type];
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled >= 0.85) {
        const _indexGetDetail = this.indexGetDetail + STEP;
        this.indexGetDetail = _indexGetDetail;
        this.getOrderDetailById(_indexGetDetail);
      }
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.name !== "warehouse-and-products_list-bills") {
          return;
        }
        this.filter.type = _query.type;
        this.getFilterFromUrlParams(_query);
        this.indexGetDetail = 0;
        this.getListBill();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.list-bill {
  .dropdown-overlay {
    position: absolute;
    right: 0;
    width: 100%;
    bottom: 10px;
    transform: translateY(100%);
    padding: 0 1rem;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    border-radius: 5px;
    background-color: #fff;
    @media only screen and (max-height: 915px) {
      height: 330px;
      overflow-y: auto;
    }
  }
  position: relative;
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: 97%;
    width: calc(100% - 30px);
    z-index: 1;
    right: 1%;
  }
  padding: 1rem;
  .list-bill__filter {
    height: 32px;
    .list-bill-count-total {
      color: #069255;
      line-height: 32px;
      font-size: 16px;
    }

    .top-dropdown {
      width: 216px;
    }
    .top-date-picker {
      width: 216px;
    }
    button {
      width: 184px;
      background-color: #069255;
      border-radius: 5px;
    }
  }
}
</style>
