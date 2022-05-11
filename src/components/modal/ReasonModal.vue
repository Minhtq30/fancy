<template>
  <g-modal
    :visible="visible"
    :width="1200"
    :footer="null"
    :centered="true"
    :title="`Từ chối nhận hàng: ${text}`"
    @cancel="handleCancel"
    style="height: 800px"
  >
    <div id="detail-audit-page" style="height: 750px">
      <div class="page-header">
        <div
          class="filter-wrapper"
          style="padding-left: 0"
          :class="{ 'is-collapsed': isCollapsedFilter }"
        >
          <div class="filter-field">
            <a-row :gutter="[16, 16]">
              <a-col :span="11">
                <div class="search-input-wrapper">
                  <g-input
                    placeholder="Nhập tên, SĐT, mã đơn hàng GHTK, mã đơn hàng riêng"
                    :value="filter.customer_info"
                    @change="handleChangeCustomerInfo"
                  />
                  <img src="@/assets/icons/search_active.svg" />
                </div>
              </a-col>
              <a-col :span="5">
                <g-daterange-picker-select
                  :placeholder="'Thời gian đăng đơn'"
                  :from-date="filter.customer_created_from"
                  :to-date="filter.customer_created_to"
                  :onChange="handleChangeCustomerCreated"
                  :allow-clear="true"
                />
              </a-col>
              <a-col :span="5">
                <g-dropdown-select
                  :placeholder="'Trạng thái đơn hàng'"
                  :options="options.package_status_id"
                  :value="filter.package_status_id"
                  :onChange="handleChangePackageStatusId"
                  :placement="'right'"
                />
              </a-col>
              <a-col :span="3">
                <div class="filter-action" style="margin-top: 0">
                  <g-button
                    class="primary"
                    style="width: 142px"
                    @click="handleFilter"
                    >Tìm kiếm</g-button
                  >
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <div
        class="page-content"
        :style="{ height: `90%` }"
        @scroll="handleScroll"
      >
        <div v-if="loadingGetData" class="indicator" :style="{ height: `90%` }">
          <a-spin />
        </div>
        <order-table-skeleton v-if="!packages" />
        <order-table
          v-else
          :loading="loading"
          :page="filter.page"
          :limit="filter.limit"
          :totalPages="totalPages"
          :isNotSticky="true"
          :handleChangePage="handleChangePage"
          :handleChangeLimit="handleChangeLimit"
          :orders="orders || []"
          :is-audit="true"
          :packagesInPage="packagesInPage"
        />
      </div>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import GButton from "@/components/elements/button.vue";
import { OrderTable, OrderTableSkeleton } from "@/components/table/order-table";
import { GDaterangePickerSelect } from "@/components";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import { ORDER_STATUS, FINANCE_NEXT_AUDIT } from "@/contants";
import { GInput } from "@/components/elements";
// import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import orderService from "@/services/order.service";
import { get } from "lodash";
const STEP = 5;
export default {
  components: {
    GModal,
    GButton,
    OrderTable,
    GDaterangePickerSelect,
    OrderTableSkeleton,
    GDropdownSelect,
    GInput,
    // HeaderTitle,
  },
  props: ["visible", "setVisible", "packageIds", "text"],

  data() {
    return {
      isCollapsedFilter: false,
      isNotSticky: false,
      filter: {
        limit: 25,
        page: 1,
        customer_info: "",
        customer_created_from: "",
        customer_created_to: "",
      },
      loading: false,
      open: {},
      options: {
        package_status_id: ORDER_STATUS,
      },
      indexGetDetail: STEP,
      loadingGetDetail: false,
      total: 0,
      packages: null,
    };
  },
  computed: {
    filterFromDate() {
      return this.$store.state.overview.from;
    },
    filterToDate() {
      return this.$store.state.overview.to;
    },
    isLoadingGetId() {
      return this.$store.state.finance.loading;
    },
    pIds() {
      return get(this.packageIds, "package_ids", []);
    },
    listPkgs() {
      return this.$store.state.finance.listPkgs;
    },
    detailById() {
      return this.$store.state.order.detailById || {};
    },
    idsGetted() {
      if (!this.listPkgs) return [];
      let type = this.$route.query.type;
      const typeMap = {
        store_fee: "store",
        insurance_fee: "insurance",
        change_address_fee: "change_address",
        return_fee: "return",
      };
      const _type = typeMap[type] || type;
      return this.listPkgs[_type] || [];
    },
    title() {
      let _title = "";

      for (let type of FINANCE_NEXT_AUDIT) {
        if (type.key === this.$route.query.type) {
          _title = type.title;
          break;
        }
      }
      return _title;
    },
    pickAddressesByShopId() {
      let _pickAddresses = {};

      for (const pickAddress of this.$store.state.shop.PickAddress) {
        _pickAddresses[pickAddress.shop_id] = pickAddress;
      }

      return _pickAddresses;
    },
    maxHeightOfPageContent() {
      let heightOfPageHeader = this.isCollapsedFilter ? 154 : 202;
      heightOfPageHeader = heightOfPageHeader + 59 + 24; // 59 for footer, 24 for margin top 1.5rem
      return heightOfPageHeader;
    },
    orders() {
      return (this.packages || []).slice(0, this.indexGetDetail + STEP);
    },
    totalPages() {
      const total = this.total;
      const limit = this.filter.limit || 25;

      if (total % limit === 0) return total / limit;

      return Math.floor(total / this.filter.limit) + 1;
    },
    packagesInPage() {
      return (this.packages || []).map((p) => ({ id: p.id, order: p.order }));
    },
    Pages() {
      const total = this.total;
      const limit = this.filter.limit || 25;

      if (total % limit === 0) return total / limit;

      return Math.floor(total / this.filter.limit) + 1;
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    async getFilterData() {
      if (this.pIds.length === 0) {
        this.packages = [];
        this.total = 0;
        return;
      }
      this.loadingGetData = true;
      const query = this.filter;
      try {
        const response = await orderService.getAll({
          customer_info: query.customer_info,
          page: query.page || 1,
          limit: query.limit || 25,
          packageId: this.packageIds.package_ids || [],
          package_status_id: query.package_status_id || ["all"],
          customer_created_from: query.customer_created_from,
          customer_created_to: query.customer_created_to,
        });
        this.packages = response.data.pkgs;
        this.total = response.data.count;
      } catch (error) {
        console.error(error);
      }

      this.loadingGetData = false;
    },
    handleChangePage(page) {
      this.filter = { ...this.filter, page };
      this.getFilterData();
    },
    handleChangeLimit(limit) {
      this.filter = { ...this.filter, limit };
      this.getFilterData();
    },
    // getFilterFromUrlParams(_params) {
    //   let _query = { ...this.filter };
    //
    //   const page = Number(_params.page) || 1;
    //   const limit = Number(_params.limit) || 25;
    //   const customer_info = _params.customer_info;
    //
    //   if (_params.customer_created_from) {
    //     _query.customer_created_from = moment(
    //       _params.customer_created_from?.replace("+", " ")
    //     );
    //   }
    //
    //   if (_params.customer_created_to) {
    //     _query.customer_created_to = moment(
    //       _params.customer_created_to?.replace("+", " ")
    //     ).endOf("day");
    //   }
    //
    //   const fields = ["package_status_id", "type"];
    //
    //   for (const field of fields) {
    //     if (_params[field]) {
    //       _query[field] =
    //         typeof _params[field] === "object"
    //           ? _params[field]
    //           : [_params[field]];
    //
    //       _query[field] = _query[field].map((item) => Number(item));
    //     }
    //   }
    //
    //   _query.page = page;
    //   _query.limit = limit;
    //
    //   _query = { ..._query, customer_info };
    //
    //   return _query;
    // },
    handleChangeCustomerInfo(event) {
      this.filter.customer_info = event.target.value;
    },
    handleChangeCustomerCreated({ fromDate, toDate }) {
      this.filter.customer_created_from = fromDate;
      this.filter.customer_created_to = toDate;
    },
    /*   handleChangeAudit({ fromDate, toDate }) {
      this.filter.audit_from = fromDate;
      this.filter.audit_to = toDate;
    },*/
    handleChangePackageStatusId(_value) {
      this.filter.package_status_id = _value;
    },
    handleFilter() {
      this.filter.page = 1;
      this.getFilterData();
    },
    handleResetFilter() {
      this.filter = {
        package_status_id: [],
        limit: this.filter.limit,
        page: this.filter.page,
      };
    },
    getShopInfo(shopId) {
      let _shop = {};
      for (const shop of this.$store.state.shop.PickAddress) {
        if (shop.shop_id === shopId) {
          _shop = shop;
          break;
        }
      }
      return _shop;
    },

    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (!this.loadingGetDetail && percentageScrolled >= 0.85) {
        const _indexGetDetail = this.indexGetDetail + STEP;
        this.indexGetDetail = _indexGetDetail;
        if (this.visible) {
          this.getDetail(_indexGetDetail);
        }
      }
    },
    scrollToTop() {
      const contentScrollable = document.querySelector(".page-content");
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
      }
    },
    onBack() {
      this.$router.push("/dong-tien/doi-soat");
    },
    async getDetail(_index) {
      this.loadingGetDetail = true;
      try {
        const ids = this.pIds.slice(0, _index + STEP);
        let arrayPromise = [];

        for (const id of ids) {
          if (!this.detailById[id]?.loaded_detail_success) {
            arrayPromise.push(
              this.$store.dispatch("order/getOrderDetail", { id })
            );
          }
        }

        await Promise.all(arrayPromise);
      } catch (error) {
        console.log(error);
      }
      this.loadingGetDetail = false;
    },
  },
  watch: {
    pIds() {
      if (this.visible) {
        this.getDetail();
      }
    },
    visible(newVal) {
      this.filter.customer_created_from = this.filterFromDate;
      this.filter.customer_created_to = this.filterToDate;
      if (newVal && this.packageIds.package_ids) {
        this.loadingGetData = true;
        this.getFilterData();
        this.getDetail();
      } else {
        this.packages = [];
        this.loadingGetData = false;
      }
    },
    isLoadingGetId(_isLoadingNextAudit) {
      if (!_isLoadingNextAudit) {
        this.getFilterData();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.order-table-wrapper {
  .pagination-wrapper {
    border: none;
    width: 100%;
    position: unset;
    padding: 0;
  }
}
#detail-audit-page {
  position: relative;
  height: calc(100vh - 64px);
  overflow-y: auto;
  .page-header {
    &__title {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 15px;
    }
  }
  .filter-wrapper {
    padding: 0 15px;
    .filter-field {
      transition: height 0.15s linear;
      > .ant-row {
        margin: 0 -8px !important;
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
    &.is-collapsed {
      .filter-field {
        height: 48px;
      }
      .data-collapsed {
        display: none;
      }
    }
    .ant-calendar-picker {
      width: 100%;
    }
    .anticon-search {
      svg {
        fill: var(--primaryColor);
      }
    }
    .breadcrumb {
      margin-top: 8px;
      line-height: 20px;
      span {
        cursor: pointer;
        color: var(--primaryColor);
        &.is-active {
          color: #000;
          font-weight: 500;
        }
      }
      img {
        padding: 0 5px;
        transform: translateY(-2px);
      }
    }
    .filter-action {
      margin-top: 24px;
      text-align: right;
      button {
        &:not(:first-child) {
          width: 150px;
        }
        &:not(:last-child) {
          margin-right: 24px;
        }
        &.no-border {
          color: #bdbdbd;
          border: none;
          box-shadow: none !important;
        }
      }
    }
  }
}
.page-content {
  overflow-y: auto;
  margin-top: 24px;
  margin-left: 15px;
  margin-right: 15px;
  .indicator {
    position: absolute;
    width: 100%;
    background-color: #ffffff80;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
