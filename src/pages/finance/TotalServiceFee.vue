<template>
  <div class="wrapper t-h-full t-relative t-px-[1rem]">
    <div class="overlay" v-if="loadingSpin && !showIndicator">
      <a-spin :spinning="loadingSpin" />
    </div>
    <div class="header-wrapper">
      <div class="flex t-items-center t-justify-between header-title t-pr-4">
        <div class="flex t-items-center header-title__left">
          <img
            class="arrow-icon"
            src="@/assets/icons/arrow_right_menu_right.svg"
          />
          <span class="t-text-lg medium-text t-mr-[16px] t-ml-[12px]">
            Tổng phí dịch vụ
          </span>
        </div>
        <filter-tab-time
          :options="optionsFilterTime"
          :onChange="handleChangeFilterTime"
          :fromDate="filter.paidAtFrom || null"
          :toDate="filter.paidAtTo || null"
        />
      </div>
      <div class="flex t-flex-wrap t-items-center header-filter">
        <div id="content-left-filter" class="header-fillter__left"></div>
      </div>
    </div>
    <div class="detail-payment-table t-mt-[20px]">
      <detail-table-skeleton v-if="showIndicator" />
      <detail-table
        v-else
        :listPayment="listPayment"
        :loading="loadingSpin"
        :totalPages="totalPages"
        :page="filter.pageIndex"
        :page_size="filter.pageSize"
        :handleChangeLimit="handleChangeLimit"
        :handleChangePage="handleChangePage"
        :is-show-detail-package="true"
      ></detail-table>
    </div>
  </div>
</template>

<script>
import FilterTabTime from "@/components/elements/filters/tab-time.vue";
import DetailTable from "@/components/table/table-finance/DetailTable";
import DetailTableSkeleton from "@/components/table/table-finance/DetailTableSkeleton";
import financeService from "@/services/finance.service";
import { message } from "ant-design-vue";
import moment from "moment";
import {
  THIS_MONTH_DATE_RANGE,
  TODAY_DATE_RANGE,
  YESTERDAY_DATE_RANGE,
} from "@/contants/date";
const optionsFilterTime = [
  {
    key: "all",
    title: "Cộng dồn",
  },
  {
    key: "today",
    title: "Hôm nay",
    value: TODAY_DATE_RANGE,
  },
  {
    key: "yesterday",
    title: "Hôm qua",
    value: YESTERDAY_DATE_RANGE,
  },
  {
    key: "this_month",
    title: "Tháng này",
    value: THIS_MONTH_DATE_RANGE,
  },
];

export default {
  components: {
    DetailTableSkeleton,
    DetailTable,
    FilterTabTime,
  },
  data() {
    return {
      optionsFilterTime,
      offsetLeft: 0,
      showIndicator: true,
      loadingSpin: false,
      listPayment: [],
      totalElements: null,
      totalPages: null,
      page: null,
      filterTypes: {
        cod: "pickMoney",
        discount: "discount",
      },
      filter: {
        pageIndex: 1,
        pageSize: 25,
        filterType: "allFee",
      },
      options: {
        warehouse_id: [],
      },
      visibleModal: {
        exportExcel: false,
      },
    };
  },
  mounted() {
    this.getOffsetLeft();
    this.getData();
  },
  methods: {
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    getOffsetLeft() {
      const el = document.getElementById("content-left-filter");
      this.offsetLeft = el.offsetWidth + 21;
    },
    handleChangeLimit(pageSize) {
      this.filter = { ...this.filter, pageSize };
      this.filter.pageIndex = 1;
      this.handleChangeQueryUrl({ pageSize });
    },
    handleChangePage(pageIndex) {
      this.filter = { ...this.filter, pageIndex };
      this.handleChangeQueryUrl({ pageIndex });
    },
    handleChangeFilterTime(_value, _key) {
      if (_key === "all") {
        this.filter.paidAtFrom = undefined;
        this.filter.paidAtTo = new Date().getTime();
      } else {
        this.filter.paidAtFrom = _value.fromDate;
        this.filter.paidAtTo = _value.toDate;
      }
      this.filter.pageIndex = 1;
      this.handleChangeQueryUrl();
    },
    handleChangeQueryUrl(_query = {}) {
      if (this.filter.paidAtFrom && this.filter.paidAtTo) {
        _query = {
          ..._query,
          paidAtFrom: moment(this.filter.paidAtFrom).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
          paidAtTo: moment(this.filter.paidAtTo).format("DD/MM/YYYY HH:mm:ss"),
          type: this.$route.query.type,
        };
      } else if (!this.filter.paidAtFrom && this.filter.paidAtTo) {
        _query = {
          ..._query,
          type: this.$route.query.type,
          paidAtTo: moment(this.filter.paidAtTo).format("DD/MM/YYYY HH:mm:ss"),
        };
      }
      const query = {
        ...this.filter,
        ..._query,
      };
      this.getData();

      this.$router.push({ query });
    },
    async getData() {
      if (this.loadingSpin) return;
      this.loadingSpin = true;
      try {
        const response = await financeService.getDetailPayment(this.filter);
        if (response.data.success) {
          this.totalPages = response.data.data?.totalPages + 1 || 0;
          this.totalElements = response.data.data?.totalElements || 0;
          this.listPayment = response.data.data?.content || 0;
          if (this.showIndicator) this.showIndicator = false;
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
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
        pageIndex: Number(_params.pageIndex) || 1,
        pageSize: Number(_params.pageSize) || 10,
      };
      if (_params.paidAtTo && _params.paidAtFrom) {
        this.filter = {
          ...this.filter,
          paidAtTo: moment(
            _params.paidAtTo.replace("+", " "),
            "DD.MM.YYYY"
          ).endOf("day"),
          paidAtFrom: moment(
            _params.paidAtFrom.replace("+", " "),
            "DD.MM.YYYY"
          ),
        };
      } else if (!_params.paidAtFrom && _params.paidAtTo) {
        this.filter = {
          ...this.filter,
          paidAtFrom: null,
          paidAtTo: moment(new Date(Date.now())),
        };
      }
    },
    // scrollToTop() {
    //   document.querySelector(".detail-payment-table").scrollTo(0, 0);
    // },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        this.getFilterFromUrlParams(this.$route.query);
        if (this.$route.name !== "total-service-fee") {
          return;
        }
        if (!_query.type) {
          this.listPayment = [];
        } else {
          this.showIndicator = true;
          this.getData();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
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
  .header-wrapper {
    .header-title {
      height: 65px;
      align-items: center;
      .header-title__left {
        .arrow-icon {
          transform: rotate(180deg);
        }
        .balance-text {
          color: #808080;
        }
        .balance-value {
          margin-left: 2rem;
        }
      }
    }
    .header-filter {
      .header-title {
        height: 65px;
        line-height: 65px;
      }
      .header-fillter__left {
        white-space: nowrap;
      }
      .split {
        width: 1px;
        background-color: #e5e5e5;
        height: 22px;
        margin: 0 10px;
      }
    }
  }
}
</style>
