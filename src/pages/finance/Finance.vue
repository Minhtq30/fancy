<template>
  <div id="finance-page">
    <div class="header-content">
      <div class="wrapper-filter flex justify-content-space-between">
        <header-title
          @onBack="onBack"
          :no-action="true"
          title="Lịch sử đối soát"
        />
        <div class="search-bar t-flex t-z-1">
          <div class="group-inputs t-gap-4 t-flex">
            <div class="search-input-wrapper">
              <g-input
                placeholder="Nhập mã hóa đơn"
                :value="filter.bill_id"
                @change="handleChangeBillId"
              />
              <img src="@/assets/icons/search_active.svg" />
            </div>
            <g-dropdown-select
              :placeholder="'Loại đối soát'"
              :options="controlOptions"
              :value="filter.type"
              :onChange="handleChangeTypeControl"
              :is-single="true"
              class="filter-by-type"
            />
            <g-daterange-picker-select
              :placeholder="'Thời gian đối soát'"
              :from-date="filter.from_date"
              :to-date="filter.to_date"
              :onChange="handleChangeTimeControl"
              :max-height="353"
              class="filter-by-time"
            />
          </div>
          <g-button
            class="ml-1 primary btn-finance-filter"
            @click="handleFilter"
            :loading="loadingGetAuditHistory"
          >
            Tìm kiếm
          </g-button>
        </div>
      </div>
      <div class="content t-mt-5 t-text-black mb-1">
        <p class="description-text t-border t-w-full mb-0">
          Tiền đối soát = (1) + (2) - (3) <br />
          (2) Tiền cộng: Khuyến mãi, Bồi hoàn, Trả trước, Phí dịch vụ hoàn lại,
          Phí dịch vụ đã thanh toán<br />
          (3) Tiền trừ: Phí giao hàng, Phí bảo hiểm, Phí hoàn hàng, Phí thay đổi
          địa chỉ giao, Phí lưu kho, Tiền Tip CoD, Phí gia cố, Phí dịch vụ cấn
          trừ, Nợ tồn, Phí chuyển khoản
        </p>
      </div>
    </div>

    <div class="table-content">
      <audit-history-table-skeleton
        v-if="loadingGetAuditHistory && !billAlls"
      />
      <template v-else>
        <audit-history-table :bills="bills" />
      </template>
    </div>
    <div v-if="totalPages" class="t-px-3 t-py-3 finance-pagination">
      <span class="description-limit">Số lượng bản ghi / trang</span>
      <g-select
        class="page-limit"
        :value="filter.limit"
        :disabled="loadingGetAuditHistory"
        @change="handleChangeLimit"
      >
        <a-select-option value="5">5</a-select-option>
        <a-select-option value="10">10</a-select-option>
        <a-select-option value="15">15</a-select-option>
      </g-select>
      Trang {{ filter.page }}/{{ totalPages }}
      <g-button
        :disabled="filter.page === 1 || loadingGetAuditHistory"
        class="ml"
        @click="handleChangePage(filter.page - 1)"
      >
        Trang trước
      </g-button>
      <g-button
        :disabled="filter.page >= totalPages || loadingGetAuditHistory"
        class="ml"
        @click="handleChangePage(filter.page + 1)"
      >
        Trang sau
      </g-button>
    </div>
  </div>
</template>
<script>
import moment from "moment";

// Component
import GButton from "@/components/elements/button.vue";
import GSelect from "@/components/elements/select.vue";
import GInput from "@/components/elements/input.vue";
import { GDaterangePickerSelect } from "@/components";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";

import {
  AuditHistoryTable,
  AuditHistoryTableSkeleton,
} from "@/components/table/table-finance";
import { formatDateTimeRequest } from "@/utils/date.js";

// const STEP = 3;

export default {
  components: {
    HeaderTitle,
    AuditHistoryTable,
    GButton,
    GSelect,
    GInput,
    GDropdownSelect,
    GDaterangePickerSelect,
    AuditHistoryTableSkeleton,
  },
  props: ["isExpanded"],
  data() {
    return {
      // indexGetDetail: 0,
      loadingGetDetail: false,
      filter: {
        bill_id: "",
        type: [],
        from_date: "",
        to_date: "",
        limit: 5,
        page: 1,
      },
      controlOptions: [
        { key: "refund", title: "Bồi hoàn" },
        { key: "debt", title: "Đối soát âm" },
        { key: "audit", title: "Đối soát chuyển khoản" },
      ],
      loadingGetAuditHistory: false,
    };
  },
  methods: {
    onBack() {
      this.$router.push("/");
    },
    handleChangeTypeControl(value) {
      this.filter.type = value;
    },
    handleChangeTimeControl({ fromDate, toDate }) {
      this.filter.from_date = fromDate;
      this.filter.to_date = toDate;
    },
    getFilterFromUrlParams(_params) {
      let _query = { ...this.filter };

      const page = Number(_params.page) || 1;
      const limit = Number(_params.limit) || 5;
      const bill_id = _params.bill_id;

      _query.from_date = _params.from_date
        ? moment(_params.from_date?.replace("+", " "))
        : moment().startOf("month").startOf("day");

      _query.to_date = _params.to_date
        ? moment(_params.to_date?.replace("+", " ")).endOf("day")
        : moment().endOf("month").endOf("day");

      const fields = ["type"];

      for (const field of fields) {
        if (_params[field]) {
          _query[field] =
            typeof _params[field] === "object"
              ? _params[field]
              : [_params[field]];
        }
      }

      _query.page = page;
      _query.limit = limit;

      _query = { ..._query, bill_id };

      return _query;
    },
    async getData() {
      this.loadingGetAuditHistory = true;
      try {
        await this.$store.dispatch("finance/getAuditHistory", {
          ...this.filter,
          type: this.filter.type[0],
          page: undefined,
          limit: undefined,
        });
      } catch (error) {
        console.log(error);
      }
      this.loadingGetAuditHistory = false;
    },
    handleChangeQueryUrl(_query = {}) {
      const query = { ...this.filter, ..._query };

      const fields = ["from_date", "to_date"];

      for (const field of fields) {
        if (query[field]) {
          query[field] = formatDateTimeRequest(query[field]);
        }
      }

      for (const key in query) {
        if (!query[key]) delete query[key];
      }

      this.$router.push({ query });
    },
    handleChangeBillId(event) {
      this.filter.bill_id = event.target.value;
    },
    handleChangeLimit(limit) {
      this.filter = { ...this.filter, limit };
      this.handleChangeQueryUrl({ limit });
    },
    handleChangePage(page) {
      this.filter = { ...this.filter, page };
      this.handleChangeQueryUrl({ page });
    },
    handleFilter() {
      this.handleChangeQueryUrl({ time: new Date().getTime() });
    },
    scrollToTop() {
      const contentScrollable = document.querySelector(
        ".wrapper-audit-history .table-content"
      );
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
      }
    },
    async getDetail() {
      const detailById = this.$store.state.finance.detailById;
      try {
        for (const bill of this.bills) {
          if (!detailById[bill.bill_id]?.loaded_detail_success) {
            await this.$store.dispatch("finance/getBillDetail", {
              id: bill.bill_id,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    billAlls() {
      return this.$store.state.finance.auditBills;
    },
    lastAuditData() {
      return this.$store.state.finance.lastAuditData;
    },
    isLoading() {
      return this.$store.state.finance.loading;
    },
    bills() {
      const _page = this.filter.page - 1;
      if (!this.billAlls) return [];
      return this.billAlls.slice(
        _page * this.filter.limit,
        (_page + 1) * this.filter.limit
      );
    },
    totalPages() {
      const total = (this.billAlls || []).length;
      const limit = this.filter.limit || 5;

      if (total % limit === 0) return total / limit;

      return Math.floor(total / this.filter.limit) + 1;
    },
    isEmptyFilter() {
      const fields = [];
      for (const key in this.filter) {
        if (key === "page" || key === "limit") continue;
        else if (key === "type") {
          if (["refund", "debt", "audit"].includes(this.filter[key])) {
            fields.push(key);
          }
        } else if (this.filter[key]) {
          fields.push(key);
        }
      }

      return fields.length === 0;
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.path !== "/dong-tien/doi-soat") {
          return;
        }
        const _filter = this.getFilterFromUrlParams(_query);
        this.filter = _filter;
        this.getData();
        this.scrollToTop();
      },
    },
    bills() {
      this.getDetail();
    },
  },
  unmounted() {
    this.$store.commit("finance/setAuditBills", null);
  },
};
</script>

<style lang="scss" scoped>
@import "./finance.scss";

#finance-page {
  position: relative;
  overflow-y: auto;
  padding-bottom: 0;
  padding-top: 1.25rem;
  height: 100%;
  .header-content {
    .wrapper-filter {
      flex-direction: column;
      .search-bar {
        margin-top: 1rem;
        justify-content: space-between;
        .search-input-wrapper,
        .filter-by-type,
        .filter-by-time {
          width: 30%;
        }
        @media only screen and (min-width: 1920px) {
          .group-inputs {
            justify-content: flex-end;
          }
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
      @media only screen and (min-width: 1920px) {
        flex-direction: row;
        .search-bar {
          margin-top: 0;
        }
      }
    }
    .description-text {
      font-size: 14px;
    }
  }

  .finance-pagination {
    left: 0;
    right: 0;
    background-color: #fff;
    border-top: 0;
    border-bottom: 1px solid var(--grayColor);
    .description-limit {
      display: none;
    }
    @media only screen and (min-width: 1600px) {
      .description-limit {
        display: inline-block;
      }
    }
  }
  .table-content {
    position: relative;
    overflow-x: auto;
    .overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff80;
    }
  }
}
</style>
