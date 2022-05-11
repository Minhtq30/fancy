<template>
  <div class="wrapper detail-finance t-h-full t-relative t-px-[1rem]">
    <div class="overlay" v-if="loadingSpin && !showIndicator">
      <a-spin :spinning="loadingSpin" />
    </div>
    <div class="header-wrapper">
      <div class="flex t-items-center t-justify-between header-title">
        <span class="t-text-lg medium-text">Báo cáo chi tiết</span>
        <g-button
          class="t-mr-[20px]"
          @click="handleChangeRoute('/dong-tien/hoa-don-vat')"
        >
          Quản lý hóa đơn VAT
        </g-button>
      </div>
      <div class="flex t-items-center header-filter">
        <div id="content-left-filter" class="header-filter__left">
          <span class="t-mr-2">+</span>
          <span><format-price :value="sumCashInAmount" /> đ</span>
        </div>
        <div class="split"></div>
        <filter-tabs
          class="t-overflow-auto"
          :value="selectNoneSum ? '' : filter.sumType"
          :options="listFilterKeyCashIn"
          :onChange="handleChangeSumType"
          :offsetLeft="offsetLeft"
          :customClass="'filter_sum_money'"
          :extraInfoDetail="extraInfoCashIn"
          :isDetailWalletLayout="true"
        />
      </div>
      <div class="split-hor"></div>
      <div class="flex t-items-center header-filter">
        <div class="header-filter__left">
          <span class="t-mr-2">-</span>
          <span><format-price :value="sumCashOutAmount" /> đ</span>
        </div>
        <div class="split"></div>
        <filter-tabs
          class="t-overflow-auto"
          :selectNone="selectNoneSub"
          :value="selectNoneSub ? '' : filter.subType"
          :options="listFilterKeyCashOut"
          :onChange="handleChangeSubType"
          :offsetLeft="offsetLeft"
          :customClass="'filter_sub_money'"
          :extraInfoDetail="extraInfoCashOut"
          :isDetailWalletLayout="true"
        />
      </div>
      <div class="filter-field t-w-full t-mt-[20px]">
        <a-row :gutter="[16, 16]">
          <a-col :span="6" :xxl="8">
            <g-dropdown-select
              :placeholder="'Kho lấy hàng'"
              :options="pickAddressList"
              :value="filter.pickAddressId"
              :onChange="handleChangeStorage"
              :min-width="'200px'"
              :is-single="true"
            />
          </a-col>
          <a-col :span="6" :xxl="8">
            <g-daterange-picker-select
              :placeholder="'Thời gian'"
              :controlTime="true"
              :onChange="handleChangeTime"
              :from-date="returnDateMoment(filter.paidAtFrom)"
              :to-date="returnDateMoment(filter.paidAtTo)"
              :allowClear="true"
              :iconType="'arrow'"
              :showTooltip="true"
              :control-time="false"
              :isFilterTimeWalletLayout="true"
              :removeOption="removeOptionKey"
            />
          </a-col>
          <a-col :span="6" :xxl="4">
            <button
              class="button-save t-rounded-[5px] t-p-0 t-h-[32px] t-w-full t-bg-[#00904A] t-text-[#fff]"
              @click="handleFilter"
            >
              Tìm kiếm
            </button>
          </a-col>
          <a-col :span="6" :xxl="4">
            <button
              class="button-export-excel t-rounded-[5px] t-p-0 t-h-[32px] t-w-full t-bg-[#00904A] t-text-[#fff] t-flex t-justify-center t-items-center"
              @click="handleClickExportExcel"
            >
              <export-excel-icon
                class="t-mr-[10px] t-mb-[2px]"
              ></export-excel-icon>
              Xuất Excel
            </button>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="detail-payment-table t-mt-[20px]">
      <detail-table-skeleton v-if="showIndicator" />
      <detail-table
        v-else
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
import GDropdownSelect from "@/components/select/DropdownSelect";
import { GDaterangePickerSelect } from "@/components";
import ExportExcelIcon from "@/components/icons/ExportExcelIcon";
import DetailTable from "@/components/table/table-finance/DetailTable";
import DetailTableSkeleton from "@/components/table/table-finance/DetailTableSkeleton";
import financeService from "@/services/finance.service";
import { message } from "ant-design-vue";
import moment from "moment";
import ExportExcelPaymentModal from "@/components/modal/DetailPaymentModal/ExportExcelPaymentModal";
import FormatPrice from "@/components/FormatPrice";
import GButton from "@/components/elements/button.vue";
import { isEmptyObject } from "@/utils";

export default {
  components: {
    FormatPrice,
    ExportExcelPaymentModal,
    DetailTableSkeleton,
    DetailTable,
    ExportExcelIcon,
    GDropdownSelect,
    FilterTabs,
    GDaterangePickerSelect,
    GButton,
  },
  data() {
    return {
      removeOptionKey: [
        "today",
        "yesterday",
        "7_days_ago",
        "this_week",
        "last_week",
        "all",
      ],
      offsetLeft: 0,
      showIndicator: true,
      loadingSpin: false,
      listPayment: [],
      totalElements: null,
      totalPages: null,
      page: null,
      selectAllSum: false,
      selectAllSub: false,
      selectNoneSum: false,
      selectNoneSub: false,
      filter: {
        sumType: ["all"],
        subType: ["all"],
        pageIndex: 1,
        pageSize: 25,
        paidAtFrom: moment().subtract(30, "day").startOf("day"),
        paidAtTo: moment().endOf("day"),
      },
      options: {
        pickAddressId: [],
      },
      visibleModal: {
        exportExcel: false,
      },
      extraInfoCashIn: {},
      extraInfoCashOut: {},
      sumCashInAmount: 0,
      sumCashOutAmount: 0,
    };
  },
  mounted() {
    this.getOffsetLeft();
    this.getData();
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
    pickAddressList() {
      let pickAddressList = Array.isArray(this.$store.state.shop.PickAddress)
        ? this.$store.state.shop.PickAddress
        : [];
      const pickAddresses = pickAddressList.map((w) => ({
        ...w,
        key: w.id,
        title: w.first_address + ", " + w.last_address,
      }));
      if (pickAddresses.length) {
        return [{ key: 0, title: "Tất cả" }, ...pickAddresses];
      }
      return [];
    },
  },
  methods: {
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
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleClickExportExcel() {
      this.visibleModal.exportExcel = true;
    },
    getOffsetLeft() {
      const el = document.getElementById("content-left-filter");
      this.offsetLeft = el.offsetWidth + 21;
    },
    handleFilter() {
      this.filter.pageIndex = 1;
      this.handleChangeQueryUrl();
    },
    handleChangeTime({ fromDate, toDate }, key) {
      if (key === "incremental") {
        this.filter.paidAtFrom = undefined;
        this.filter.paidAtTo = new Date().getTime();
      } else {
        this.filter.paidAtFrom = fromDate;
        this.filter.paidAtTo = toDate;
      }
    },
    handleChangeStorage(_value) {
      this.filter.pickAddressId = _value;
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
      if (this.filter.pickAddressId && this.filter.pickAddressId[0] === 0) {
        delete this.filter.pickAddressId;
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
      this.getData();
      this.$router.push({ query });
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
          paymentKeys: paymentKeys.length ? paymentKeys : undefined,
        });
        if (response.data.success) {
          this.totalPages = response.data.data?.totalPages + 1 || 0;
          this.totalElements = response.data.data?.totalElements || 0;
          this.listPayment = response.data.data?.content || [];
          this.sumCashInAmount =
            response.data.data?.extraInfo.sumCashInAmount || "0";
          this.sumCashOutAmount =
            response.data.data?.extraInfo.sumCashOutAmount * -1 || "0";

          this.extraInfoCashIn = {
            all: response.data.data?.extraInfo?.cashInOrderQuantity || 0,
            ...response.data.data?.extraInfo?.cashInPaymentOrder,
          };
          this.extraInfoCashOut = {
            all: response.data.data?.extraInfo?.cashOutOrderQuantity || 0,
            ...response.data.data?.extraInfo?.cashOutPaymentOrder,
          };
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
    returnDateMoment(data) {
      return Number(data) ? moment(new Date(Number(data))) : null;
    },
    scrollToTop() {
      if (!this.showIndicator) {
        document
          .querySelector(".detail-table-wrapper")
          ?.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    getFilterFromUrlParams(_params) {
      let _query = {};

      const fields = ["pickAddressId", "sumType", "subType"];
      for (const field of fields) {
        if (_params[field]) {
          _query[field] =
            typeof _params[field] === "object"
              ? _params[field]
              : [_params[field]];
          if (field === "pickAddressId") {
            _query["pickAddressId"] = _query["pickAddressId"].map((item) =>
              Number(item)
            );
          }
        }
      }
      this.filter = {
        ...this.filter,
        pageIndex: Number(_params.pageIndex) || 1,
        pageSize: Number(_params.pageSize) || 25,
        pickAddressId: _query.pickAddressId,
        sumType: _query.sumType || ["all"],
        subType: _query.subType || ["all"],
      };
      this.selectAllSum = _params.selectAllSum ? true : false;
      this.selectAllSub = _params.selectAllSub ? true : false;
      if (_params.paidAtFrom && _params.paidAtTo) {
        const customerCreatedTo = moment(
          _params.paidAtTo?.replace("+", " "),
          "DD/MM/YYYY HH:mm:ss"
        );
        this.filter = {
          ...this.filter,
          paidAtFrom: _params.paidAtFrom
            ? moment(
                _params.paidAtFrom?.replace("+", " "),
                "DD/MM/YYYY HH:mm:ss"
              )
            : moment().startOf("month").startOf("day"),
          paidAtTo: _params.paidAtTo
            ? _params.paidAtTo.includes("23:59:59")
              ? customerCreatedTo.endOf("day")
              : customerCreatedTo
            : moment().endOf("month").endOf("day"),
        };
      } else if (!_params.paidAtFrom && _params.paidAtTo) {
        this.filter = {
          ...this.filter,
          paidAtFrom: null,
          paidAtTo: Date.now(),
        };
      }
    },
    handleChangeRoute(path) {
      this.$router.push(path);
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.name !== "detail-report") {
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
.wrapper {
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: calc(100vh - 120px);
    width: calc(100% - 30px);
    z-index: 999;
  }
  .header-wrapper {
    .header-title {
      height: 65px;
      line-height: 65px;
    }
    .header-filter {
      .header-filter__left {
        white-space: nowrap;
      }
      .split {
        width: 1px;
        background-color: #e5e5e5;
        height: 22px;
        margin: 0 10px;
      }
    }
    .split-hor {
      width: 100%;
      background-color: #e5e5e5;
      height: 1px;
      margin: 10px 0;
    }
  }
}
</style>
<style lang="scss">
.detail-finance {
  .detail-table-wrapper {
    height: calc(100vh - 345px);
  }
}
</style>
