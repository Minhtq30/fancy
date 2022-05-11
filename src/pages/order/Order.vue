<template>
  <div id="order-page">
    <div class="page-header" id="page-header-order-page">
      <div class="page-header__title">
        <h2 class="mb-0"><b class="medium-text">Quản lý đơn hàng</b></h2>
        <div class="breadcrumb flex t-flex-1 ml-1">
          <div v-for="(option, index) in quickTypeOptions" :key="option.key">
            <span
              class="breadcrumb-item"
              :class="{ 'is-active': filter.quick_type === option.key }"
              @click="handleQuickFilter(option.key)"
            >
              <span>{{ option.title }}</span>
              <span v-if="countPackageType[option.key]?.count">
                {{ ` ${countPackageType[option.key].count}` }}
              </span>
            </span>
            <img
              v-if="index !== quickTypeOptions.length - 1"
              src="@/assets/icons/arrow_right_active.svg"
            />
          </div>
        </div>
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
                  @change="handleChangeFilterName"
                  @keyup.enter="handleFilter"
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
                :controlTime="true"
              />
            </a-col>
            <a-col :span="5">
              <g-daterange-picker-select
                :placeholder="'Thời gian đối soát'"
                :from-date="filter.audited_from"
                :to-date="filter.audited_to"
                :onChange="handleChangeAudit"
              />
            </a-col>
            <a-col :span="5">
              <g-dropdown-select
                :placeholder="'Trạng thái đơn hàng'"
                :options="options.package_status_id"
                :value="filter.package_status_id"
                :onChange="handleChangePackageStatusId"
                :placement="'right'"
                :min-width="'300px'"
              />
            </a-col>
          </a-row>

          <a-row class="data-collapsed" :gutter="[16, 16]">
            <a-col :span="9">
              <a-row :gutter="[16, 16]">
                <a-col :span="12">
                  <g-dropdown-select
                    :placeholder="'Dịch vụ'"
                    :options="options.package_properties"
                    :value="filter.package_properties"
                    :onChange="handleChangeService"
                    :min-width="'150px'"
                  />
                </a-col>
                <a-col :span="12">
                  <g-dropdown-select
                    :placeholder="'Kho hàng'"
                    :options="options.pick_address_id"
                    :value="filter.pick_address_id"
                    :onChange="handleChangeStoreage"
                    :width="'350px'"
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
                :min-width="'200px'"
              />
            </a-col>
            <a-col :span="5">
              <g-dropdown-select
                :placeholder="'Trạng thái in'"
                :options="options.wait_print"
                :value="filter.wait_print"
                :onChange="handleChangeTypePrint"
              />
            </a-col>
            <a-col :span="5">
              <g-dropdown-select
                :placeholder="'Trả ship'"
                :options="options.is_freeship"
                :value="filter.is_freeship"
                :onChange="handleChangeTypeShip"
              />
            </a-col>
          </a-row>
        </div>
        <div class="filter-action t-flex t-justify-between t-items-center">
          <div class="t-flex t-items-center">
            <span>Đang lọc</span>
            <g-skeleton-text
              v-if="loading"
              class="no-margin"
              style="padding: 0 4px"
              :width="'40px'"
            />
            <span v-else style="padding: 0 4px">{{ total }}</span>
            <span>ĐH</span>
          </div>
          <div class="group-buttons">
            <g-button
              class="default"
              @click="handleResetFilter"
              :class="{ 'danger-text': !isEmptyFilter }"
            >
              Xóa bộ lọc
            </g-button>
            <g-button @click="toogleCollapsedFilter">
              {{ isCollapsedFilter ? "Mở rộng" : "Thu gọn" }}
            </g-button>
            <g-button class="primary" @click="handleFilter">Tìm kiếm</g-button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="page-content"
      :style="{ height: maxHeightOfPageContent }"
      @scroll="handleScroll"
      @resize="handleResize"
    >
      <div
        v-if="loading && !showIndicator"
        class="indicator"
        :style="{
          height: maxHeightOfPageContent,
        }"
      >
        <a-spin />
      </div>
      <order-table-skeleton v-if="showIndicator" />
      <order-table
        v-else
        :loading="loading"
        :page="filter.page"
        :totalPages="totalPages"
        :limit="filter.limit"
        :handleChangePage="handleChangePage"
        :handleChangeLimit="handleChangeLimit"
        :orders="orders"
        :packagesInPage="packagesInPage"
        :exportFilter="filter"
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
import { ORDER_STATUS, ORDER_TYPE, ORDER_SERVICE } from "@/contants";
import { GInput } from "@/components/elements";
import orderService from "@/services/order.service";
import { GSkeletonText } from "@/components/elements/skeleton";

const quickTypeOptions = [
  {
    key: "not_approved",
    title: "Chưa tiếp nhận",
  },
  {
    key: "approved",
    title: "Đã tiếp nhận",
  },
  {
    key: "picking",
    title: "Đang lấy",
  },
  {
    key: "picked",
    title: "Đã lấy",
  },
  {
    key: "delivering",
    title: "Đang giao hàng",
  },
  {
    key: "delivered",
    title: "Đã giao hàng",
  },
  {
    key: "not_delivered",
    title: "Trả hàng",
  },
  {
    key: "audited",
    title: "Đã đối soát",
  },
];

const STEP = 5;

export default {
  components: {
    GButton,
    OrderTable,
    GDaterangePickerSelect,
    OrderTableSkeleton,
    GDropdownSelect,
    GInput,
    GSkeletonText,
  },
  data() {
    return {
      isCollapsedFilter: false,
      filter: {},
      quickType: null,
      loading: false,
      showIndicator: true,
      open: {},
      options: {
        package_status_id: ORDER_STATUS,
        package_label: ORDER_TYPE,
        package_properties: ORDER_SERVICE,
        pick_address_id: [],
        wait_print: [
          { key: "all", title: "Tất cả" },
          { key: 1, title: "Đã in" },
          { key: 0, title: "Chưa in" },
        ],
        is_freeship: [
          { key: "all", title: "Tất cả" },
          { key: 1, title: "Shop trả ship" },
          { key: 0, title: "Khách trả ship" },
        ],
      },
      quickTypeOptions,
      countPackageType: {},
      indexGetDetail: 0,
      maxHeightOfPageContent: 300,
      observer: null,
    };
  },
  mounted() {
    this.updatePickAddress();
    window.addEventListener("resize", this.updateHeightOfPageHeader);

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
  methods: {
    async getCountPackage(params) {
      try {
        const response = await orderService.getCountPackage(params);
        if (!response?.data?.data) {
          this.$message.error(
            "Lấy số lượng đơn hàng thất bại, vui lòng thử lại sau."
          );
        }
        this.countPackageType = response?.data?.data || {};
        this.updateHeightOfPageHeader();
      } catch (error) {
        console.log(error);
      }
    },
    async getData(_filter = {}) {
      this.loading = true;

      try {
        const { fullPath } = this.$route;
        const error = await this.$store.dispatch("order/getOrders", {
          params: _filter,
          path: fullPath,
        });

        if (error) {
          this.$message.error(error);
        }

        this.loading = false;
        if (this.showIndicator) this.showIndicator = false;
      } catch (error) {
        console.error(error);
      }
    },
    handleChangeQueryUrl(_query = {}) {
      const query = { ...this.filter, ..._query };

      const fields = [
        "customer_created_from",
        "customer_created_to",
        "audited_from",
        "audited_to",
      ];

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

      _query.customer_created_from = _params.customer_created_from
        ? moment(_params.customer_created_from?.replace("+", " "))
        : moment().subtract(30, "day").startOf("day");

      const customerCreatedTo = moment(
        _params.customer_created_to?.replace("+", " ")
      );

      _query.customer_created_to = _params.customer_created_to
        ? _params.customer_created_to.includes("23:59:59")
          ? customerCreatedTo.endOf("day")
          : customerCreatedTo
        : moment().endOf("day");

      if (_params.audited_from) {
        _query.audited_from = moment(_params.audited_from.replace("+", " "));
      }

      if (_params.audited_to) {
        _query.audited_to = moment(_params.audited_to.replace("+", " ")).endOf(
          "day"
        );
      }

      const fields = [
        "package_status_id",
        "pick_address_id",
        "package_properties",
        "package_label",
        "wait_print",
        "is_freeship",
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
      _query.quick_type = _params.quick_type;

      _query = { ..._query, customer_info };

      return _query;
    },
    handleChangeFilterName(event) {
      this.filter.customer_info = event.target.value;
    },
    handleChangeCustomerCreated({ fromDate, toDate }) {
      this.filter.customer_created_from = fromDate;
      this.filter.customer_created_to = toDate;
    },
    handleChangeAudit({ fromDate, toDate }) {
      this.filter.audited_from = fromDate;
      this.filter.audited_to = toDate;
    },
    handleChangePackageStatusId(_value) {
      delete this.filter.quick_type;

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
    handleChangeTypePrint(_value) {
      this.filter.wait_print = _value;
    },
    handleChangeTypeShip(_value) {
      this.filter.is_freeship = _value;
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
        wait_print: [],
        is_freeship: [],
        quick_type: "",
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
      this.filter.quick_type =
        this.filter.quick_type === _quickType ? "" : _quickType;
      this.filter.package_status_id = [];
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
    async getDetail(_index) {
      try {
        const orders = this.orders.slice(_index, _index + STEP);
        let arrayPromise = [];

        for (const order of orders) {
          if (!order?.id) continue;
          if (!this.detailById[order.id]) {
            arrayPromise.push(
              this.$store.dispatch("order/getOrderDetail", { id: order?.id })
            );
          }
        }

        await Promise.all(arrayPromise);
      } catch (error) {
        console.error(error);
      }
    },
    updatePickAddress() {
      const pickAddresses = this.pickAddresses?.map((pickAddress) => ({
        ...pickAddress,
        key: pickAddress.id,
        title: pickAddress.first_address + ", " + pickAddress.last_address,
      }));
      if (pickAddresses.length) {
        this.options.pick_address_id = [
          { key: "all", title: "Tất cả" },
          ...pickAddresses,
        ];
      }
    },
    updateHeightOfPageHeader() {
      this.$nextTick(() => {
        const pageHeader = document.getElementById("page-header-order-page");
        if (pageHeader) {
          const heightOfPageHeader = pageHeader.clientHeight;
          const heightOfHeader = 64;
          const heightOfFooter = 60;
          const marginTop = 16;
          const heightOfBorder = -1;

          this.maxHeightOfPageContent = `calc(100vh - ${
            heightOfHeader +
            heightOfPageHeader +
            marginTop +
            heightOfFooter +
            heightOfBorder
          }px)`;
        }
      });
    },
    toogleCollapsedFilter() {
      this.isCollapsedFilter = !this.isCollapsedFilter;
      this.updateHeightOfPageHeader();
    },
    onClassChange() {
      setTimeout(() => {
        this.updateHeightOfPageHeader();
      }, 100);
    },
  },
  computed: {
    pickAddresses() {
      return Array.isArray(this.$store.state.shop.PickAddress)
        ? this.$store.state.shop.PickAddress
        : [];
    },
    detailById() {
      return this.$store.state.order.detailById || {};
    },
    pickAddressesByShopId() {
      let _pickAddresses = {};

      for (const pickAddress of this.pickAddresses) {
        _pickAddresses[pickAddress.shop_id] = pickAddress;
      }

      return _pickAddresses;
    },
    packages() {
      return this.$store.getters["order/getOrdersByPath"].map((order) => {
        return {
          ...order,
          shop_detail: this.pickAddressesByShopId[order.shop_id] || {},
        };
      });
    },
    orders() {
      return this.packages.slice(0, this.indexGetDetail + STEP);
    },
    total() {
      return this.$store.state.order.total || 0;
    },
    totalPages() {
      const limit = this.filter.limit || 25;

      if (this.total % limit === 0) return this.total / limit;

      return Math.floor(this.total / this.filter.limit) + 1;
    },
    isEmptyFilter() {
      const fields = [];

      for (let key in this.filter) {
        if (!["page", "limit", "time"].includes(key)) {
          if (
            [
              "customer_created_from",
              "customer_created_to",
              "audited_from",
              "audited_to",
            ].includes(key)
          ) {
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
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.path !== "/don-hang") {
          return;
        }
        this.indexGetDetail = 0;
        this.scrollToTop();
        const _filter = this.getFilterFromUrlParams(_query);
        this.getCountPackage({
          customer_created_from: _filter.customer_created_from,
          customer_created_to: _filter.customer_created_to,
        });
        this.filter = _filter;
        this.getData(_filter);
      },
    },
    packages() {
      this.getDetail(0);
    },
    pickAddresses() {
      this.updatePickAddress();
    },
  },

  unmounted() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener("resize", this.updateHeightOfPageHeader);
  },
};
</script>

<style lang="scss" scoped>
#order-page {
  position: relative;
  height: calc(100vh - 64px);
  overflow-y: auto;
  .page-header {
    &__title {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      margin-bottom: -8px;
      h2 {
        font-size: 18px;
      }
      .breadcrumb {
        line-height: 20px;
        flex-wrap: wrap;
        font-size: 14px;
        @media only screen and (min-width: 1600px) {
          font-size: 16px;
        }
        span {
          cursor: pointer;
          color: var(--primaryColor);
          &.is-active {
            span {
              color: #000;
              font-weight: 500;
            }
          }
        }
        img {
          padding: 0 0.5rem;
          transform: translateY(-2px);
        }
      }
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
    .filter-action {
      margin-top: 0.5rem;
      text-align: right;
      button {
        width: 90px;
        height: 30px;
        padding: 0;
        &:not(:last-child) {
          margin-right: 1rem;
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
    margin-top: 16px;
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
