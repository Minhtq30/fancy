<template>
  <div class="wrapper">
    <div class="header-wrapper">
      <div class="flex title-wrapper">
        <header-title @onBack="onBack" :title="title" />
      </div>
      <div class="t-px-4 filter-wrapper">
        <a-row :gutter="[16, 16]">
          <a-col :span="5">
            <g-dropdown-select
              class="display-status-number"
              :placeholder="'Trạng thái đơn hàng'"
              :options="options.package_status_id"
              :value="filter.package_status_id"
              :onChange="handleChangeFilterStatus"
              :min-width="'300px'"
              :isDisplayStatus="true"
            />
          </a-col>
          <a-col v-if="type !== 'next_audit'" :span="5">
            <g-dropdown-select
              :placeholder="'Phiên lấy hàng'"
              :options="options.pick_session_id"
              :value="filter.pick_session_id"
              :onChange="handleChangeFilterSession"
              :min-width="'300px'"
            />
          </a-col>
          <a-col :span="5">
            <g-dropdown-select
              :placeholder="'Kho lấy hàng'"
              :options="options.pick_address_id"
              :value="filter.pick_address_id"
              :onChange="handleChangeFilterPickAddress"
              :min-width="'300px'"
            />
          </a-col>
          <a-col v-if="type !== 'next_audit'" :span="5">
            <g-dropdown-select
              :placeholder="'Giao hàng'"
              :options="options.customer_province_id"
              :value="filter.customer_province_id"
              :onChange="handleChangeFilterLocation"
              :placement="'right'"
              :min-width="'300px'"
            />
          </a-col>
          <a-col v-if="type === 'next_audit'" :span="5">
            <g-dropdown-select
              :placeholder="'Loại giao dịch'"
              :options="options.payment_keys"
              :value="filter.payment_keys"
              :onChange="handleChangeTypeBill"
              :min-width="'300px'"
            />
          </a-col>
          <a-col :span="4">
            <g-button class="primary w-100" @click="handleFilter">
              Tìm kiếm
            </g-button>
          </a-col>
        </a-row>
      </div>
      <div
        v-if="type === 'next_audit'"
        class="medium-text t-px-4 t-mt-4 t-flex t-items-center"
      >
        <span>Tổng tiền rút tự động sắp tới:</span>
        <g-skeleton-text
          v-if="loadingGetOrders"
          class="no-margin ml"
          :active="true"
          :width="'100px'"
        />
        <span v-else> <format-price class="ml" :value="sumAmount" /> đ </span>
      </div>
    </div>
    <div class="t-px-4 t-mt-4 table-wrapper">
      <finance-list-order-table
        v-if="type !== 'next_audit'"
        :orders="orders"
        :page="filter.page"
        :limit="filter.limit"
        :totalPages="totalPages"
        :loading="loadingGetOrders"
        :handleChangePage="handleChangePage"
        :handleChangeLimit="handleChangeLimit"
        :metric="metric"
        :isNextAudit="type === 'next_audit'"
      />
      <div v-else class="t-relative detail-table-next-payment">
        <detail-table-skeleton v-if="!orders" />
        <detail-table
          v-else
          :pageType="''"
          :listPayment="orders"
          :loading="loadingGetOrders"
          :totalPages="totalPages"
          :page="filter.page"
          :page_size="filter.limit"
          :handleChangeLimit="handleChangeLimit"
          :handleChangePage="handleChangePage"
          :is-show-loading="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import FinanceListOrderTable from "@/components/table/table-finance/ListOrder.vue";
import DetailTableSkeleton from "@/components/table/table-finance/DetailTableSkeleton";
import DetailTable from "@/components/table/table-finance/DetailTable";
import GButton from "@/components/elements/button.vue";
import FormatPrice from "@/components/FormatPrice.vue";
import { GSkeletonText } from "@/components/elements/skeleton";
import operateService from "@/services/operate.service";
import services from "@/services";
import financeService from "@/services/finance.service";

export const optionsStatus = [
  {
    key: "all",
    title: "Tất cả",
  },
  {
    key: "2",
    title: "Đã tiếp nhận",
  },
  {
    key: "8",
    title: "Delay lấy hàng",
  },
  {
    key: "12",
    title: "Đang lấy hàng",
  },
  {
    key: "3",
    title: "Đã lấy hàng",
  },
  {
    key: "4",
    title: "Đang giao hàng",
  },
  {
    key: "10",
    title: "Delay giao hàng",
  },
];

export const optionsStatusAudit = [
  {
    key: "all",
    title: "Tất cả",
  },
  {
    key: "completed",
    title: "Đã giao hàng",
  },
  {
    key: "deliver_failed",
    title: "Không giao được hàng",
  },
  {
    key: "not_completed",
    title: "Đang giao hàng",
  },
];

export const optionsPaymentKey = [
  {
    key: "all",
    title: "Tất cả",
  },
  {
    key: "deposit",
    title: "Tiền nạp",
  },
  {
    key: "withdraw",
    title: "Tiền rút",
  },
  {
    key: "pick_money",
    title: "Tiền CoD",
  },
  {
    key: "ship_money",
    title: "Phí giao hàng",
  },
  {
    key: "return_fee",
    title: "Phí hoàn hàng",
  },
  {
    key: "insurance",
    title: "Phí bảo hiểm",
  },
  {
    key: "change_address_fee",
    title: "Phí đổi địa chỉ giao",
  },
  {
    key: "store_fee",
    title: "Phí lưu kho",
  },
  {
    key: "fragile_fee",
    title: "Phí dễ vỡ",
  },
  {
    key: "reinforced_fee",
    title: "Phí gia cố",
  },
  {
    key: "food_fee",
    title: "Phí thực phẩm khô",
  },
  {
    key: "materials_fee",
    title: "Phí nguyên vật liệu",
  },
  {
    key: "re_delivery_fee",
    title: "Phí giao lại",
  },
  {
    key: "change_return_add_fee",
    title: "Phí đổi địa chỉ trả",
  },
  {
    key: "refund",
    title: "Bồi hoàn",
  },
  {
    key: "discount",
    title: "Khuyến mãi",
  },
  {
    key: "tip_cod",
    title: "Tip COD",
  },
];

export default {
  components: {
    HeaderTitle,
    GDropdownSelect,
    GButton,
    FinanceListOrderTable,
    DetailTable,
    DetailTableSkeleton,
    FormatPrice,
    GSkeletonText,
  },
  data() {
    return {
      type: "",
      options: {
        package_status_id: [],
        pick_session_id: [],
        pick_address_id: [],
        customer_province_id: [],
        payment_keys: optionsPaymentKey,
      },
      filter: {
        page: 1,
        limit: 25,
        package_status_id: [],
        pick_session_id: [],
        pick_address_id: [],
        customer_province_id: [],
        payment_keys: [],
      },
      total: 0,
      orders: null,
      metric: {},
      loadingGetOrders: false,
      loadingGetPayment: false,
      listPayment: null,
      sumAmount: 0,
      paramFilterKeys: {},
    };
  },
  computed: {
    title() {
      if (this.type === "pending_money") {
        return "Tổng tiền đang luân chuyển";
      }
      if (this.type === "next_audit") {
        return "Phiên rút tiền tự động sắp tới";
      }
      return "";
    },
    pickAddresses() {
      return Array.isArray(this.$store.state.shop.PickAddress)
        ? this.$store.state.shop.PickAddress
        : [];
    },
    totalPages() {
      const limit = this.filter.limit || 25;

      if (this.total % limit === 0) return this.total / limit;

      return Math.floor(this.total / this.filter.limit) + 1;
    },
  },
  mounted() {
    this.updatePickAddress();
    this.getProvinces();
    this.getSession();
  },
  methods: {
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
    async getProvinces() {
      try {
        const response = await services.$address.browseProvinceListWithCache();

        let _location = response.map((item) => ({
          key: item.id,
          title: item.name,
        }));
        if (_location.length) {
          _location = [
            {
              key: "all",
              title: "Tất cả",
            },
            ..._location,
          ];
        }

        this.options.customer_province_id = _location;
      } catch (error) {
        console.error(error);
      }
    },
    async getSession() {
      let _pick_session_id = [];
      try {
        const response = await operateService.getSessions({
          type: 1,
          sub_type: "pickedIncurred",
        });
        if (response?.data?.success) {
          _pick_session_id = (response?.data?.data || []).map((item) => ({
            key: item.id,
            title: item.alias,
          }));
          if (_pick_session_id.length) {
            _pick_session_id = [
              {
                key: "all",
                title: "Tất cả",
              },
              ..._pick_session_id?.slice(0, 10),
            ];
          }
        }
      } catch (error) {
        console.error(error);
      }

      this.options.pick_session_id = _pick_session_id;
    },
    async getData(_filter = {}) {
      this.loadingGetOrders = true;
      try {
        let params = { ..._filter };

        const fields = [
          "package_status_id",
          "pick_session_id",
          "pick_address_id",
          "customer_province_id",
          "payment_keys",
        ];

        for (const field of fields) {
          if (params[field]) {
            if (field === "package_status_id" && this.type === "next_audit") {
              params.package_status_id = params.package_status_id.join(",");
            } else if (field === "payment_keys" && this.type === "next_audit") {
              params.payment_keys = params.payment_keys.join(",");
            } else {
              params[field] = (params[field] || []).filter(
                (item) => item !== "all"
              );
            }
            if (!params[field].length) {
              delete params[field];
            }
          }
        }

        let response = {};

        if (this.type === "pending_money") {
          response = await financeService.getDetailPending(params);
          if (response?.data?.success) {
            this.total = response?.data?.data?.total_pkg || 0;
            this.orders = response?.data?.data?.list_pkgs || [];
            this.metric = {
              total_cod_money: response?.data?.data?.total_cod_money || 0,
              total_pending_money:
                response?.data?.data?.total_pending_money || 0,
              total_pkg: response?.data?.data?.total_pkg || 0,
              total_service_fee: response?.data?.data?.total_service_fee || 0,
            };
          } else {
            this.orders = [];
            this.$message.error(response?.data?.message);
          }
        }

        if (this.type === "next_audit") {
          response = await financeService.getDetailNextPayment(params);
          if (response?.data?.success) {
            this.total = response?.data?.data?.totalElements || 0;
            this.orders = (response?.data?.data?.content || []).map((item) => ({
              ...item,
              paymentValue: item.amount,
            }));
            this.sumAmount = response?.data?.data?.extraInfo?.sumAmount || 0;
          } else {
            this.orders = [];
            this.$message.error(response?.data?.message);
          }
        }
      } catch (error) {
        console.error(error);
        this.orders = [];
        this.$message.error(
          error?.response?.data?.message ||
            "Tải dữ liệu thất bại, vui lòng thử lại sau."
        );
      }
      this.loadingGetOrders = false;
    },
    getFilterFromUrlParams(_params) {
      let _query = {
        ...this.filter,
        page: Number(_params.page) || 1,
        limit: Number(_params.limit) || 25,
      };

      const fields = [
        "package_status_id",
        "pick_session_id",
        "pick_address_id",
        "customer_province_id",
        "payment_keys",
      ];

      for (const field of fields) {
        if (_params[field]) {
          const value =
            typeof _params[field] === "object"
              ? _params[field]
              : [_params[field]];

          _query[field] = ["payment_keys", "package_status_id"].includes(field)
            ? value
            : value.map((item) => Number(item));
        }
      }

      return _query;
    },
    onBack() {
      this.$router.push(`/dong-tien/bao-cao-chi-tiet`);
    },
    handleChangeFilterStatus(_value) {
      this.filter.package_status_id = _value;
    },
    handleChangeFilterSession(_value) {
      this.filter.pick_session_id = _value;
    },
    handleChangeFilterPickAddress(_value) {
      this.filter.pick_address_id = _value;
    },
    handleChangeFilterLocation(_value) {
      this.filter.customer_province_id = _value;
    },
    handleChangeTypeBill(_value) {
      this.filter.payment_keys = _value;
    },
    handleChangeQueryUrl(_query = {}) {
      const query = {
        ...this.filter,
        ..._query,
        type: this.type,
      };

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
    handleFilter() {
      this.filter.page = 1;
      this.handleChangeQueryUrl({ time: new Date().getTime() });
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.name !== "finance-list-order") {
          return;
        }
        const _type = this.$route.query.type;
        this.type = _type;
        if (_type === "next_audit") {
          this.options.package_status_id = optionsStatusAudit;
        }
        if (_type === "pending_money") {
          this.options.package_status_id = optionsStatus;
        }
        setTimeout(() => {
          const _filter = this.getFilterFromUrlParams(_query);
          this.filter = _filter;
          this.getData(_filter);
        }, 0);
      },
    },
    type() {
      this.orders = null;
      this.total = 0;
      this.filter = {
        page: 1,
        limit: 25,
        package_status_id: [],
        pick_session_id: [],
        pick_address_id: [],
        customer_province_id: [],
      };
    },
    pickAddresses() {
      this.updatePickAddress();
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  .title-wrapper {
    padding: 0 1rem;
    height: 65px;
  }
}
</style>
<style lang="scss">
.display-status-number {
  .g-input {
    input {
      max-width: 145px !important;
      text-overflow: ellipsis;
    }
  }
}
.detail-table-next-payment {
  height: calc(100vh - 278px + 60px);
  .detail-table-wrapper {
    height: calc(100vh - 276px) !important;
    .pagination-wrapper {
      width: 100% !important;
    }
  }
}
</style>
