<template>
  <div id="vat-bill-page">
    <div class="header-vat-page">
      <header-title @onBack="onBack" title="Quản lý hóa đơn VAT" />
      <div class="search-bar t-flex t-mt-5 t-z-1">
        <div class="t-mr-4">
          <a-row :gutter="[16, 16]" class="filter-vat-page">
            <a-col>
              <div class="search-input-wrapper">
                <g-input
                  placeholder="Nhập mã hóa đơn"
                  :value="filter.code_order"
                  @change="handleChangeCodeOrder"
                />
                <img src="@/assets/icons/search_active.svg" />
              </div>
            </a-col>
            <a-col>
              <g-daterange-picker-select
                :placeholder="'Thời gian đối soát'"
                :from-date="filter.from"
                :to-date="filter.to"
                :onChange="handleChangeTimeControl"
              />
            </a-col>
            <a-col>
              <g-dropdown-select
                :placeholder="'Trạng thái hóa đơn'"
                :options="vatBillStatus"
                :value="filter.status || []"
                :onChange="handleChangeBillStatus"
                :is-single="true"
              />
            </a-col>
          </a-row>
        </div>
        <g-button class="primary btn-finance-filter" @click="handleFilter">
          Tìm kiếm
        </g-button>
      </div>
    </div>

    <div class="page-content t-relative t-mt-5">
      <div class="overlay" v-if="vatBillData && loading">
        <a-spin />
      </div>
      <vat-bill-table
        :maxHeight="heightOfPageContent"
        :vat-bill-data="vatBillData"
      />
    </div>

    <div v-if="totalPages" class="t-px-3 t-py-3 finance-vat-pagination">
      <span class="description-limit mr">Số lượng bản ghi / trang</span>
      <g-select
        class="page-limit"
        :value="filter.limit"
        @change="handleChangeLimit"
      >
        <a-select-option value="25">25</a-select-option>
        <a-select-option value="50">50</a-select-option>
        <a-select-option value="100">100</a-select-option>
      </g-select>
      <span class="ml">Trang {{ filter.page }}/{{ totalPages }}</span>
      <g-button
        @click="handleChangePage(filter.page - 1)"
        :disabled="filter.page === 1"
        class="ml"
      >
        Trang trước
      </g-button>
      <g-button
        :disabled="filter.page > totalPages - 1"
        class="ml"
        @click="handleChangePage(filter.page + 1)"
      >
        Trang sau
      </g-button>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import GInput from "@/components/elements/input.vue";
import GSelect from "@/components/elements/select.vue";
import GButton from "@/components/elements/button.vue";
import VatBillTable from "@/components/table/table-finance/VatBillTable";
import { GDaterangePickerSelect } from "@/components";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import moment from "moment";
import financeService from "@/services/finance.service.js";
import { formatDateTimeRequest } from "@/utils/date.js";
import { mapState } from "vuex";

export const vatBillStatus = [
  // { key: "all", title: "Tất cả" },
  { key: "draft", title: "Chờ phát hành" },
  { key: "expired", title: "Quá hạn" },
  { key: "canceled", title: "Đã hủy" },
  { key: "released", title: "Đã phát hành" },
  { key: "failed", title: "Phát hành lỗi" },
];

export default {
  components: {
    HeaderTitle,
    GButton,
    VatBillTable,
    GDaterangePickerSelect,
    GDropdownSelect,
    GInput,
    GSelect,
  },
  data() {
    return {
      visibleModal: {
        vatDetail: false,
      },
      filter: {
        page: 1,
        limit: 25,
        from: moment().subtract(30, "day").startOf("day"),
        to: moment().endOf("day"),
      },
      vatBillData: null,
      totalPages: 0,
      loading: false,
      heightOfPageContent: 0,
      vatBillStatus,
    };
  },
  mounted() {
    this.updateTableHeight();
    window.addEventListener("resize", this.updateTableHeight);

    const element = document.getElementById("menu-right-container");
    this.observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        const newValue = m.target.getAttribute(m.attributeName);
        this.$nextTick(() => {
          this.onClassChange(newValue, m.oldValue);
        });
      }
    });

    this.observer.observe(element, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["class"],
    });
  },
  computed: {
    ...mapState({
      // vatBillData: (state) => state.finance.vatBillData.page_data,
      wallet: (state) => state.shop?.Wallet || {},
    }),
    isWalletActive() {
      return this.wallet && this.wallet.wallet_active === 1;
    },
  },
  methods: {
    async getData(params) {
      this.loading = true;

      let _vatBillData = [];
      let _totalPages = 1;

      try {
        const response = await financeService.getVATData(params);
        if (response.data.success) {
          _totalPages = response.data.data?.pagination?.total_page || 1;
          _vatBillData = response.data.data?.page_data || [];
        } else {
          this.$message.error(
            response.data.message || "Lấy danh sách hóa đơn VAT thất bại"
          );
        }
      } catch (error) {
        console.error(error);
        this.$message.error(
          error?.response.data.message || "Lấy danh sách hóa đơn VAT thất bại"
        );
      }

      this.vatBillData = _vatBillData;
      this.totalPages = _totalPages;

      this.loading = false;
    },
    openDetailModal() {
      this.visibleModal.vatDetail = true;
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    onBack() {
      if (this.isWalletActive) {
        this.$router.push({ name: "detail-report" });
      } else {
        this.$router.push({ name: "cash-flow_audit" });
      }
    },
    handleChangeTimeControl({ fromDate, toDate }) {
      this.filter.from = fromDate;
      this.filter.to = toDate;
    },
    handleChangeBillStatus(_value) {
      this.filter.status = _value;
    },
    handleChangeCodeOrder(event) {
      this.filter.code_order = event.target.value;
    },
    handleChangePage(page) {
      this.filter = { ...this.filter, page };
      this.handleChangeQueryUrl({ page });
    },
    handleChangeLimit(limit) {
      this.filter = { ...this.filter, limit };
      this.handleChangeQueryUrl({ limit });
    },
    handleChangeQueryUrl(_query = {}) {
      const query = { ...this.filter, ..._query };

      const fields = ["from", "to"];

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
    getFilterFromUrlParams(_params) {
      let _query = { ...this.filter };

      const page = Number(_params.page) || 1;
      const limit = Number(_params.limit) || 25;

      if (_params.from) {
        _query.from = moment(_params.from?.replace("+", " "));
      }

      if (_params.to) {
        _query.to = moment(_params.to?.replace("+", " ")).endOf("day");
      }

      const fields = ["status"];

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

      _query = { ..._query };

      return _query;
    },
    handleFilter() {
      this.filter.page = 1;
      this.handleChangeQueryUrl({ time: new Date().getTime() });
    },
    updateTableHeight() {
      const headerElm = document.querySelector(".header-vat-page");

      let heightOfHeader = 0;

      if (headerElm) {
        heightOfHeader = headerElm.clientHeight;
      }

      this.heightOfPageContent = `calc(100vh - 64px - ${heightOfHeader}px - 60px - 1.25rem - 15px + 1px)`;
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        // this.scrollToTop();
        const _filter = this.getFilterFromUrlParams(_query);
        this.filter = _filter;
        this.getData(_filter);
      },
    },
  },

  unmounted() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener("resize", this.updateTableHeight);
  },
};
</script>

<style lang="scss" scoped>
@import "./finance.scss";

#vat-bill-page {
  position: relative;
  padding: 15px;
  overflow-y: auto;
  height: calc(100vh - 64px);
  padding-bottom: 0;
  .search-input-wrapper {
    position: relative;
    .g-input {
      height: 32px;
      padding-left: 40px;
      box-shadow: none;
      @media only screen and (min-width: 1600px) {
        width: 343px;
      }
    }
    img {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff80;
  }
  .filter-vat-page {
    flex-flow: unset;
  }
  .finance-vat-pagination {
    height: 60px;
    position: absolute;
    bottom: 0;
    width: calc(100% - 30px);
    border: 1px solid var(--grayColor);
    border-bottom: 0;
  }
}
</style>
