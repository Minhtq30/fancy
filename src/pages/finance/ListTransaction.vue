<template>
  <div
    class="wrapper t-h-full t-relative t-px-[1rem] t-h-full"
    :class="pageType === 'total_fee' ? 'filterPage' : 'normalPage'"
  >
    <div class="overlay" v-if="loadingSpin && !showIndicator">
      <a-spin :spinning="loadingSpin" />
    </div>
    <div class="header-wrapper">
      <div class="flex t-items-center t-justify-between header-title t-pr-4">
        <div class="flex t-items-center header-title__left">
          <img
            class="arrow-icon t-cursor-pointer"
            src="@/assets/icons/arrow_right_menu_right.svg"
            @click="onBack"
          />
          <span class="t-text-lg medium-text t-mr-[16px] t-ml-[12px]">
            {{ title }}
          </span>
        </div>
        <filter-tab-time
          :key="pageType"
          :options="optionsFilterTime"
          :onChange="$route.query.type ? handleChangeFilterTime : ''"
          :fromDate="filter.paidAtFrom || null"
          :toDate="filter.paidAtTo || null"
          :removeAll="true"
          :showCancelOption="true"
        />
      </div>
      <div v-if="pageType == 'total_fee'">
        <div class="flex t-items-center header-filter">
          <filter-tabs
            :value="filter.paidStatus"
            :options="optionsFilterStatus"
            :onChange="handleChangeFilterStatus"
            :offsetLeft="offsetLeft"
            :isSingle="true"
            :customClass="'filter_type_fee'"
          />
        </div>
        <div class="split-header-filter" />
        <div class="flex t-items-center header-filter t-mb-[20px]">
          <filter-tabs
            :value="filter.paymentKeys"
            :options="optionsFilterPayment"
            :onChange="handleChangeFilterTotalFee"
            :offsetLeft="offsetLeft"
            :customClass="'filter_total_fee'"
          />
        </div>
      </div>

      <div class="flex t-flex-wrap t-items-center header-filter">
        <div id="content-left-filter" class="header-fillter__left">
          <span
            >Tổng <format-price :value="orderQuantity || 0" /> ĐH /
            <format-price :value="sumAmount || 0" /> đ</span
          >
        </div>
      </div>
    </div>
    <div class="detail-payment-table t-mt-[20px]">
      <detail-table-skeleton v-if="showIndicator" />
      <detail-table
        v-else
        :pageType="pageType"
        :listPayment="listPayment"
        :loading="loadingSpin"
        :totalPages="totalPages - 1"
        :page="filter.pageIndex"
        :page_size="filter.pageSize"
        :handleChangeLimit="handleChangeLimit"
        :handleChangePage="handleChangePage"
        :is-show-detail-package="true"
      ></detail-table>
    </div>
  </div>
  <export-excel-payment-modal
    :visible="visibleModal.exportExcel"
    :setVisible="setVisibleModal('exportExcel')"
  ></export-excel-payment-modal>
</template>

<script>
import FilterTabs from "@/components/elements/filters/tabs.vue";
import FilterTabTime from "@/components/elements/filters/tab-time.vue";
import DetailTable from "@/components/table/table-finance/DetailTable";
import DetailTableSkeleton from "@/components/table/table-finance/DetailTableSkeleton";
import financeService from "@/services/finance.service";
import { message } from "ant-design-vue";
import moment from "moment";
import ExportExcelPaymentModal from "@/components/modal/DetailPaymentModal/ExportExcelPaymentModal";
import FormatPrice from "@/components/FormatPrice.vue";
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
const optionsFilterStatus = [
  {
    key: "all",
    title: "Tất cả",
  },
  {
    key: "paid",
    title: "Đã trả",
    value: "paid",
  },
  {
    key: "not_paid",
    title: "Chưa trả",
    value: "not_paid",
  },
];

export default {
  components: {
    ExportExcelPaymentModal,
    DetailTableSkeleton,
    DetailTable,
    FilterTabs,
    FilterTabTime,
    FormatPrice,
  },
  data() {
    return {
      pageType: "",
      title: "",
      optionsFilterStatus,
      optionsFilterTime,
      offsetLeft: 0,
      showIndicator: true,
      loadingSpin: false,
      listPayment: [],
      totalElements: null,
      totalPages: null,
      page: null,
      orderQuantity: 0,
      sumAmount: 0,
      titles: {
        cod: "Tổng tiền về ví",
        discount: "Khuyến mãi",
        total_fee: "Tổng phí dịch vụ",
      },
      filterTypes: {
        cod: "pickMoney",
        discount: "discount",
        total_fee: "allFee",
      },
      filter: {
        pageIndex: 1,
        pageSize: 25,
        filterType: "",
        paidStatus: ["all"],
        paymentKeys: ["all"],
      },
      options: {
        warehouse_id: [],
      },
      visibleModal: {
        exportExcel: false,
      },
      paramFilterKeys: { filterType: "allFee" },
    };
  },
  computed: {
    optionsFilterPayment() {
      const _filterKeys = this.$store.getters["finance/getFilterKeys"](
        this.paramFilterKeys
      );
      if (!_filterKeys.length) return [];
      return [
        { key: "all", title: "Tất cả" },
        ..._filterKeys.map((item) => ({
          key: item.paymentKey,
          title: item.paymentName,
        })),
      ];
    },
  },
  mounted() {
    this.getOffsetLeft();
    // this.getData();
  },
  methods: {
    onBack() {
      this.$router.push(`/dong-tien/bao-cao-chi-tiet`);
    },
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
    handleChangeFilterTotalFee(_key) {
      this.filter.paymentKeys = _key;
      this.filter.pageIndex = 1;
      this.handleChangeQueryUrl();
    },
    handleChangeFilterStatus(_key) {
      this.filter.paidStatus = _key;
      this.filter.pageIndex = 1;
      this.handleChangeQueryUrl();
    },
    handleChangeFilterTime(_value, _key) {
      if (_key === "all") {
        this.filter.paidAtFrom = null;
        this.filter.paidAtTo = null;
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
        };
      } else if (!this.filter.paidAtFrom && this.filter.paidAtTo) {
        _query = {
          ..._query,
          paidAtTo: moment(this.filter.paidAtTo).format("DD/MM/YYYY HH:mm:ss"),
        };
      }
      _query = {
        ..._query,
        type: this.$route.query.type,
      };
      const query = {
        ...this.filter,
        ..._query,
      };
      this.getData();

      this.$router.push({ query });
    },
    async getData() {
      if (this.loadingSpin) return;
      // this.scrollToTop();
      this.loadingSpin = true;
      try {
        const paymentKeys = (this.filter?.paymentKeys || []).filter(
          (item) => item !== "all"
        );
        const paidStatus = (this.filter?.paidStatus || []).filter(
          (item) => item !== "all"
        );

        const response = await financeService.getDetailPayment({
          ...this.filter,
          pageIndex: this.filter.pageIndex,
          shopCode: localStorage.getItem("shop_code"),
          paymentKeys: paymentKeys?.length ? paymentKeys : undefined,
          paidStatus: paidStatus?.length ? paidStatus[0] : undefined,
        });
        if (response.data.success) {
          this.totalPages = response.data.data?.totalPages + 1 || 0;
          this.totalElements = response.data.data?.totalElements || 0;
          this.listPayment = response.data.data?.content || [];
          this.orderQuantity =
            response.data.data?.extraInfo?.orderQuantity || 0;
          this.sumAmount =
            this.pageType == "discount"
              ? response.data.data?.extraInfo?.sumDiscountAmount || 0
              : this.pageType == "cod"
              ? response.data.data?.extraInfo?.sumPickMoneyAmount || 0
              : response.data.data?.extraInfo?.sumAllFeeAmount || 0;
          if (this.showIndicator) this.showIndicator = false;
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
      }
      this.loadingSpin = false;
    },
    getFeeOptions() {
      this.$store.dispatch("finance/getFilterKeys", this.paramFilterKeys);
    },
    getFilterFromUrlParams(_params) {
      let _query = {};
      const fields = ["paidStatus", "paymentKeys"];
      for (const field of fields) {
        if (_params[field]) {
          _query[field] =
            typeof _params[field] === "object"
              ? _params[field]
              : [_params[field]];
        }
      }

      _query = { ..._query };

      this.filter = {
        ...this.filter,
        ..._query,
        pageIndex: Number(_params.pageIndex) || 1,
        pageSize: Number(_params.pageSize) || 25,
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
        if (_query.type == "total_fee") {
          this.getFeeOptions();
        }
        this.getFilterFromUrlParams(this.$route.query);
        if (this.$route.name !== "finance-list-transaction") {
          return;
        }
        if (_query.type) {
          if (this.pageType && this.pageType != this.$route.query.type) {
            // reset filter when changing page type
            this.filter = {
              pageIndex: 1,
              pageSize: 25,
              paidStatus: ["all"],
              paymentKeys: ["all"],
            };
          }
          this.pageType = this.$route.query.type;
          this.title = this.titles[this.pageType];
          this.filter.filterType = this.filterTypes[this.pageType];
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
  .filter_total_fee {
    max-width: 100% !important;
  }
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
    .split-header-filter {
      margin-left: -15px !important;
      width: calc(100%);
      height: 1px;
      background-color: #e0e0e0;
      margin: 10px 0;
      transform: translateX(1rem);
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
<style lang="scss">
.filterPage {
  .detail-table-wrapper {
    height: calc(100vh - 338px);
  }
}
.normalPage {
  .detail-table-wrapper {
    height: calc(100vh - 233px);
  }
}
</style>
