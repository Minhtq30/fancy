<template>
  <div class="wrapper finance-wallet-page t-h-full">
    <div class="overlay" v-if="loadingSpin && !showIndicator">
      <a-spin :spinning="loadingSpin" />
    </div>
    <div class="header-wrapper">
      <div class="flex t-items-center t-justify-between header-title t-px-4">
        <div class="flex t-items-center header-title__left">
          <img
            class="arrow-icon t-cursor-pointer"
            src="@/assets/icons/arrow_right_menu_right.svg"
            @click="onBack"
          />
          <span class="t-text-lg medium-text t-mr-[16px] t-ml-[12px]">
            Ví
          </span>
          <span class="balance-text">Số dư</span>
          <span class="t-text-lg medium-text balance-value"
            ><format-price :value="balance" /> đ
          </span>
        </div>
        <filter-tab-time
          :options="optionsFilterTime"
          :onChange="handleChangeFilterTime"
          :fromDate="filter.paidAtFrom || null"
          :toDate="filter.paidAtTo || null"
          :removeAll="true"
        />
      </div>
      <div class="flex t-items-center header-filter">
        <div
          id="content-left-filter-sum-money"
          class="header-fillter__left flex t-justify-between"
        >
          <span class="t-mr-2">+</span>
          <span><format-price :value="sumCashInAmount" /> đ</span>
        </div>
        <div class="split" />
        <filter-tabs
          class="t-overflow-auto"
          :value="selectNoneSum ? '' : filter.sumType"
          :options="listFilterKeyCashIn"
          :onChange="handleChangeSumType"
          :offsetLeft="offsetLeft"
          :customClass="'filter_sum_money'"
        />
      </div>
      <div class="split-header-filter" />
      <div class="flex t-items-center header-filter">
        <div
          id="content-left-filter-sub-money"
          class="header-fillter__left flex t-justify-between"
        >
          <span class="t-mr-2">-</span>
          <span><format-price :value="sumCashOutAmount" /> đ</span>
        </div>
        <div class="split" />
        <filter-tabs
          class="t-overflow-auto"
          :selectNone="selectNoneSub"
          :value="selectNoneSub ? '' : filter.subType"
          :options="listFilterKeyCashOut"
          :onChange="handleChangeSubType"
          :offsetLeft="offsetLeft"
          :customClass="'filter_sub_money'"
        />
      </div>
    </div>
    <div class="wallet-table t-mt-[16px] t-px-4">
      <detail-table-skeleton v-if="showIndicator" />
      <detail-table
        v-else
        class="t-pt-6"
        :listPayment="listPayment"
        :loading="loadingSpin"
        :totalPages="totalPages"
        :page="filter.pageIndex"
        :page_size="filter.pageSize"
        :handleChangeLimit="handleChangeLimit"
        :handleChangePage="handleChangePage"
      />
    </div>
  </div>
</template>

<script>
// import { message } from "ant-design-vue";

import FilterTabs from "@/components/elements/filters/tabs.vue";
import FilterTabTime from "@/components/elements/filters/tab-time.vue";
import {
  THIS_MONTH_DATE_RANGE,
  TODAY_DATE_RANGE,
  YESTERDAY_DATE_RANGE,
} from "@/contants/date";
import DetailTable from "@/components/table/table-finance/DetailTable";
import DetailTableSkeleton from "@/components/table/table-finance/DetailTableSkeleton";
import financeService from "@/services/finance.service";
import { message } from "ant-design-vue";
import moment from "moment";
import FormatPrice from "@/components/FormatPrice";
import { mapState } from "vuex";
import { isEmptyObject } from "@/utils";
// import financeService from "@/services/finance.service";

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

// import { message } from "ant-design-vue";
export default {
  components: {
    FormatPrice,
    DetailTableSkeleton,
    DetailTable,
    FilterTabs,
    FilterTabTime,
  },
  data() {
    return {
      selectAllSum: false,
      selectAllSub: false,
      selectNoneSum: false,
      selectNoneSub: false,
      optionsFilterTime,
      offsetLeft: 0,
      showIndicator: true,
      loadingSpin: false,
      listPayment: [],
      totalPages: null,
      filter: {
        sumType: ["all"],
        subType: ["all"],
        pageIndex: 1,
        pageSize: 20,
        filterType: "cashInOut",
      },
      sumCashInAmount: 0,
      sumCashOutAmount: 0,
    };
  },
  computed: {
    filterKeyCashInOut() {
      return this.$store.state.finance.filterKeyCashInOut || {};
    },
    listFilterKeyCashIn() {
      const filterKeyCashIn = this.filterKeyCashInOut.cashInGroup || [];
      if (filterKeyCashIn.length) {
        return [{ key: "all", title: "Tất cả" }, ...filterKeyCashIn];
      }
      return [];
    },
    listFilterKeyCashOut() {
      const filterKeyCashOut = this.filterKeyCashInOut.cashOutGroup || [];
      if (filterKeyCashOut.length) {
        return [{ key: "all", title: "Tất cả" }, ...filterKeyCashOut];
      }
      return [];
    },
    ...mapState({
      balance: (state) => state.finance.balance,
    }),
  },
  mounted() {
    this.getOffsetLeft();
  },
  methods: {
    onBack() {
      this.$router.push(`/dong-tien/bao-cao-chi-tiet`);
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
    returnDateMoment(data) {
      return Number(data) ? moment(new Date(Number(data))) : null;
    },
    getOffsetLeft() {
      const elSum = document.getElementById("content-left-filter-sum-money");
      const elSub = document.getElementById("content-left-filter-sub-money");

      if (elSum && elSub) {
        const maxOffset =
          elSum.offsetWidth > elSub.offsetWidth
            ? elSum.offsetWidth
            : elSub.offsetWidth;

        elSum.style.width = `${maxOffset}px`;
        elSub.style.width = `${maxOffset}px`;

        this.offsetLeft = maxOffset + 21;
      }
    },
    handleChangeSumType(_type) {
      this.selectAllSum = false;
      this.selectAllSub = false;
      this.filter.sumType = _type;
      this.filter.pageIndex = 1;
      if (this.filter.sumType == "all" && this.filter.subType != "all") {
        this.selectAllSum = true;
      }
      if (this.filter.sumType != "all" && this.filter.subType == "all") {
        this.selectAllSub = true;
      }

      this.handleChangeQueryUrl();
    },
    handleChangeSubType(_type) {
      this.selectAllSum = false;
      this.selectAllSub = false;
      this.filter.subType = _type;
      this.filter.pageIndex = 1;
      if (this.filter.subType == "all" && this.filter.sumType != "all") {
        this.selectAllSub = true;
      }
      if (this.filter.sumType == "all" && this.filter.subType != "all") {
        this.selectAllSum = true;
      }
      this.handleChangeQueryUrl();
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
      if (this.selectAllSub) {
        _query = {
          ..._query,
          selectAllSub: true,
        };
      }
      if (this.selectAllSum) {
        _query = {
          ..._query,
          selectAllSum: true,
        };
      }
      const query = {
        ...this.filter,
        ..._query,
      };
      this.$router.push({ query });
    },
    async getFilterFromUrlParams(_params) {
      let _query = {};
      const fields = ["sumType", "subType"];
      for (const field of fields) {
        if (_params[field]) {
          _query[field] =
            typeof _params[field] === "object"
              ? _params[field]
              : [_params[field]];
        }
      }
      this.selectAllSum = _params.selectAllSum ? true : false;
      this.selectAllSub = _params.selectAllSub ? true : false;
      this.filter = {
        ...this.filter,
        ..._query,
        pageIndex: Number(_params.pageIndex) || 1,
        pageSize: Number(_params.pageSize) || 20,
        shopCode: _params.shopCode,
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
    async getData() {
      if (isEmptyObject(this.filterKeyCashInOut)) {
        await this.$store.dispatch("finance/getFilterKeyCashInOut");
      }

      if (this.loadingSpin) return;
      this.scrollToTop();
      this.loadingSpin = true;
      try {
        const _filter = { ...this.filter };
        const subType = (
          this.selectAllSub
            ? this.listFilterKeyCashOut.map((item) => item.key)
            : this.filter?.subType || []
        ).filter((item) => item !== "all");
        const sumType = (
          this.selectAllSum
            ? this.listFilterKeyCashIn.map((item) => item.key)
            : this.filter?.sumType || []
        ).filter((item) => item !== "all");

        const paymentKeys = [...subType, ...sumType];

        _filter.paymentKeys = paymentKeys?.length ? paymentKeys : undefined;

        delete _filter.subType;
        delete _filter.sumType;

        const response = await financeService.getDetailPayment({
          ..._filter,
          shopCode: localStorage.getItem("shop_code"),
        });
        if (response.data.success) {
          this.totalPages = response.data.data?.totalPages || 0;
          this.totalElements = response.data.data?.totalElements || 0;
          this.listPayment = response.data.data?.content || [];
          this.sumCashInAmount =
            response.data.data?.extraInfo.sumCashInAmount || "0";
          this.sumCashOutAmount =
            response.data.data?.extraInfo.sumCashOutAmount * -1 || "0";
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
    scrollToTop() {
      document
        .querySelector(".detail-table-wrapper")
        ?.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.name !== "wallet") {
          return;
        }
        this.getFilterFromUrlParams(_query);
        this.getData();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .wallet-table {
    .detail-table-wrapper {
      height: calc(100vh - 289px);
    }
  }
}
.wrapper {
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: 97%;
    width: 100%;
    z-index: 1;
  }
  .header-fillter__left {
    width: auto !important;
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
      width: calc(100% - 2rem);
      height: 1px;
      background-color: #e0e0e0;
      margin: 10px 0;
      transform: translateX(1rem);
    }
    .header-filter {
      height: 32px;
      padding: 0 1rem;
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
.finance-wallet-page {
  .custom-list-options-wrapper {
    right: 10px;
  }
  position: relative;
}
</style>
