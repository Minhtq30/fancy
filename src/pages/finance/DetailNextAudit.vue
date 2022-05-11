<template>
  <div id="detail-audit-page">
    <div class="page-header">
      <div style="padding: 14px 15px">
        <header-title @onBack="onBack" :title="title" />
      </div>
      <div
        class="filter-wrapper"
        :class="{ 'is-collapsed': isCollapsedFilter }"
      >
        <div class="filter-field">
          <a-row :gutter="[16, 16]">
            <a-col :span="9">
              <div class="search-input-wrapper">
                <g-input
                  placeholder="Nhập tên, SĐT, mã đơn hàng GHTK, mã đơn hàng riêng"
                  :value="filter.customer_info"
                  @change="handleChangeCustomerInfo"
                />
                <img src="@/assets/icons/search_active.svg" />
              </div>
            </a-col>
            <a-col :span="5" v-if="!isTotal">
              <g-dropdown-select
                :placeholder="'Trạng thái'"
                :options="options.order_type_charge"
                :value="filter.order_type_charge"
                :onChange="handleChangeTypeCharge"
              />
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
            <a-col :span="5" v-if="isTotal">
              <g-dropdown-select
                :placeholder="'Trả ship'"
                :options="options.is_freeship"
                :value="filter.is_freeship"
                :onChange="handleChangeTypeShip"
              />
            </a-col>
          </a-row>

          <a-row class="data-collapsed" :gutter="[16, 16]">
            <a-col :span="9">
              <a-row :gutter="[16, 16]">
                <a-col :span="12">
                  <g-dropdown-select
                    :placeholder="'Kho hàng'"
                    :options="options.pick_address_id"
                    :value="filter.pick_address_id"
                    :onChange="handleChangeStoreage"
                    :width="'350px'"
                  />
                </a-col>
                <a-col :span="12">
                  <g-dropdown-select
                    :placeholder="'Dịch vụ'"
                    :options="options.package_properties"
                    :value="filter.package_properties"
                    :onChange="handleChangeService"
                  />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="5">
              <g-dropdown-select
                :placeholder="'Loại đơn'"
                :options="options.package_label"
                :value="filter.package_label"
                :onChange="handleChangeTypeOrder"
              />
            </a-col>
            <a-col :span="5" v-if="!isTotal">
              <g-dropdown-select
                :placeholder="'Trả ship'"
                :options="options.is_freeship"
                :value="filter.is_freeship"
                :onChange="handleChangeTypeShip"
              />
            </a-col>
          </a-row>
        </div>
        <div class="breadcrumb" v-if="!isTotal">
          <span
            class="breadcrumb-item"
            :class="{
              'is-active':
                filter.order_type_charge?.length == 1 &&
                filter.order_type_charge[0] === '2',
            }"
            @click="handleQuickFilter('2')"
          >
            Chưa trả phí / 3 ĐH / 50.000 đ
          </span>
          <img src="@/assets/icons/arrow_right_active.svg" />
          <span
            class="breadcrumb-item"
            :class="{
              'is-active':
                filter.order_type_charge?.length == 1 &&
                filter.order_type_charge[0] === '1',
            }"
            @click="handleQuickFilter('1')"
          >
            Đã trả phí / 3 ĐH / 50.000 đ
          </span>
        </div>
        <div class="filter-action">
          <g-button
            class="default"
            @click="handleResetFilter"
            :class="{ 'danger-text': !isEmptyFilter }"
          >
            Xóa bộ lọc
          </g-button>
          <g-button @click="isCollapsedFilter = !isCollapsedFilter">
            {{ isCollapsedFilter ? "Mở rộng bộ lọc" : "Thu gọn bộ lọc" }}
          </g-button>
          <g-button class="primary" @click="handleFilter">Tìm kiếm</g-button>
        </div>
      </div>
    </div>
    <div
      class="page-content"
      :style="{ height: `calc(100% - ${maxHeightOfPageContent}px)` }"
      @scroll="handleScroll"
    >
      <div
        v-if="loadingGetData"
        class="indicator"
        :style="{
          height: `calc(100% - ${maxHeightOfPageContent + 15 - 59}px)`,
        }"
      >
        <a-spin />
      </div>
      <order-table-skeleton v-if="!packages" />
      <order-table
        v-else
        :loading="loadingGetData"
        :page="filter.page"
        :totalPages="totalPages"
        :limit="filter.limit"
        :handleChangePage="handleChangePage"
        :handleChangeLimit="handleChangeLimit"
        :orders="orders || []"
        :is-audit="true"
        :packagesInPage="packagesInPage"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import GButton from "@/components/elements/button.vue";
import { OrderTable, OrderTableSkeleton } from "@/components/table/order-table";
import { GDaterangePickerSelect } from "@/components";
import { formatDateTimeRequest } from "@/utils/date.js";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import {
  ORDER_STATUS,
  ORDER_TYPE,
  ORDER_SERVICE,
  FINANCE_NEXT_AUDIT,
} from "@/contants";
import { GInput } from "@/components/elements";
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import orderService from "@/services/order.service";

const STEP = 5;

export default {
  components: {
    GButton,
    OrderTable,
    GDaterangePickerSelect,
    OrderTableSkeleton,
    GDropdownSelect,
    GInput,
    HeaderTitle,
  },
  data() {
    return {
      isCollapsedFilter: false,
      filter: {},
      loading: false,
      open: {},
      options: {
        package_status_id: ORDER_STATUS,
        package_label: ORDER_TYPE,
        package_properties: ORDER_SERVICE,
        pick_address_id: [],
        is_freeship: [
          { key: "all", title: "Tất cả" },
          { key: 1, title: "Shop trả ship" },
          { key: 0, title: "Khách trả ship" },
        ],
        order_type_charge: [
          { key: "all", title: "Tất cả" },
          { key: 1, title: "Đã trả phí" },
          { key: 0, title: "Chưa trả phí" },
        ],
      },
      indexGetDetail: STEP,
      total: 0,
      packages: null,
    };
  },
  mounted() {
    try {
      const pickAddresses = this.$store.state.shop.PickAddress.map(
        (pickAddress) => ({
          ...pickAddress,
          key: pickAddress.id,
          title: pickAddress.first_address,
        })
      );

      this.options.pick_address_id = [
        { key: "all", title: "Tất cả" },
        ...pickAddresses,
      ];
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    isLoadingGetId() {
      return this.$store.state.finance.loading;
    },
    pIds() {
      return (this.packages || []).map((p) => p.id);
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
    isTotal() {
      // if (
      //   this.$route.query.type === "available_cash" ||
      //   this.$route.query.type === "audit_mon"
      // ) {
      //   return true;
      // }
      // return false;
      return true;
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
    isEmptyFilter() {
      const fields = [];

      for (let key in this.filter) {
        if (!["page", "limit", "time", "type"].includes(key)) {
          if (["customer_created_from", "customer_created_to"].includes(key)) {
            if (typeof this.filter[key] === "object") {
              fields.push(key);
            }
          } else {
            if (this.filter[key] && this.filter[key].length) {
              fields.push(key);
            }
          }
        }
      }

      return fields.length === 0;
    },
    packagesInPage() {
      return (this.packages || []).map((p) => ({
        id: p.id,
        order: p.order,
        alias: p.alias,
      }));
    },
  },
  methods: {
    async getFilterData() {
      this.loadingGetData = true;
      try {
        const response = await orderService.getAll({
          ...this.filter,
          packageId: this.idsGetted,
        });
        this.packages = response?.data?.pkgs || [];
        this.total = response?.data?.count || 0;
        if (!response?.data?.success) {
          this.$message.error(
            "Lấy danh sách đơn hàng thất bại, vui lòng thử lại sau"
          );
        }
      } catch (error) {
        console.error(error);
      }

      this.loadingGetData = false;
    },
    handleChangeQueryUrl(_query = {}) {
      const query = { ...this.filter, type: this.$route.query.type, ..._query };

      const fields = [
        "customer_created_from",
        "customer_created_to",
        "audit_from",
        "audit_to",
      ];

      for (const field of fields) {
        if (query[field]) {
          query[field] = formatDateTimeRequest(query[field]);
        }
      }

      this.$router.push({ query });
    },
    handleChangePage(page) {
      this.filter = { ...this.filter, page };
      this.handleChangeQueryUrl({ page });
    },
    handleChangeLimit(limit) {
      this.filter = { ...this.filter, limit };
      this.handleChangeQueryUrl({ limit });
    },
    getFilterFromUrlParams(_params) {
      let _query = { ...this.filter };

      const page = Number(_params.page) || 1;
      const limit = Number(_params.limit) || 25;
      const customer_info = _params.customer_info;

      if (_params.customer_created_from) {
        _query.customer_created_from = moment(
          _params.customer_created_from?.replace("+", " ")
        );
      }

      if (_params.customer_created_to) {
        _query.customer_created_to = moment(
          _params.customer_created_to?.replace("+", " ")
        ).endOf("day");
      }

      const fields = [
        "package_status_id",
        "pick_address_id",
        "package_properties",
        "package_label",
        "order_type_charge",
        "is_freeship",
        "type",
      ];

      for (const field of fields) {
        if (_params[field]) {
          _query[field] =
            typeof _params[field] === "object"
              ? _params[field]
              : [_params[field]];

          _query[field] = _query[field].map((item) => Number(item));
        }
      }

      _query.page = page;
      _query.limit = limit;

      _query = { ..._query, customer_info };

      return _query;
    },
    handleChangeCustomerInfo(event) {
      this.filter.customer_info = event.target.value;
    },
    handleChangeCustomerCreated({ fromDate, toDate }) {
      this.filter.customer_created_from = fromDate;
      this.filter.customer_created_to = toDate;
    },
    handleChangeAudit({ fromDate, toDate }) {
      this.filter.audit_from = fromDate;
      this.filter.audit_to = toDate;
    },
    handleChangePackageStatusId(_value) {
      this.filter.package_status_id = _value;
    },
    handleChangeStoreage(_value) {
      this.filter.pick_address_id = _value;
    },
    handleChangeService(_value) {
      this.filter.package_properties = _value;
    },
    handleChangeTypeOrder(_value) {
      this.filter.package_label = _value;
    },
    handleChangeTypeShip(_value) {
      this.filter.is_freeship = _value;
    },
    handleChangeTypeCharge(_value) {
      this.filter.order_type_charge = _value;
    },
    handleFilter() {
      this.filter.page = 1;
      this.handleChangeQueryUrl({ time: new Date().getTime() });
    },
    handleResetFilter() {
      this.filter = {
        package_status_id: [],
        pick_address_id: [],
        package_properties: [],
        package_label: [],
        order_type_charge: [],
        is_freeship: [],
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
    handleQuickFilter(_quickType) {
      this.filter.order_type_charge = [_quickType];
      this.handleChangeQueryUrl({ time: new Date().getTime() });
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled >= 0.85) {
        const _indexGetDetail = this.indexGetDetail + STEP;
        this.indexGetDetail = _indexGetDetail;
        this.getDetail(_indexGetDetail);
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
      try {
        const ids = this.pIds.slice(_index, _index + STEP);
        let arrayPromise = [];

        for (const id of ids) {
          if (!id) continue;
          if (!this.detailById[id]) {
            arrayPromise.push(
              this.$store.dispatch("order/getOrderDetail", { id })
            );
          }
        }

        await Promise.all(arrayPromise);
      } catch (error) {
        console.error(error);
      }
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        this.indexGetDetail = 0;
        this.scrollToTop();
        const _filter = this.getFilterFromUrlParams(_query);
        this.filter = _filter;
        if (!this.isLoadingGetId) {
          this.getFilterData();
        }
      },
    },
    pIds() {
      this.getDetail(0);
    },
    isLoadingGetId(_isLoadingNextAudit) {
      if (!_isLoadingNextAudit) {
        this.getFilterData();
      }
    },
    isTotal() {
      if (this.isTotal) {
        this.filter.order_type_charge = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

  .page-content {
    overflow-y: auto;
    margin-top: 24px;
    margin-left: 15px;
    margin-right: 15px;
    .indicator {
      position: absolute;
      width: calc(100% - 30px);
      background-color: #ffffff80;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
