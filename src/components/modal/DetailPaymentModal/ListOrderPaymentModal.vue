<template>
  <a-modal
    class="list-order-payment-modal t-text-black"
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="1300"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[24px] t-font-medium t-h-[25px]"
          style="
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          Danh sách {{ orderCount }} ĐH
        </h3>
        <span class="t-flex t-cursor-pointer" @click="handleCancel">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2.01429L17.9857 0L10 7.98571L2.01429 0L0 2.01429L7.98571 10L0 17.9857L2.01429 20L10 12.0143L17.9857 20L20 17.9857L12.0143 10L20 2.01429Z"
              fill="#fff"
            />
          </svg>
        </span>
      </div>
    </template>
    <div class="t-h-[650px] t-relative">
      <div
        class="filter-field t-my-[15px] t-flex t-items-center t-justify-between t-gap-[15px] t-h-[32px]"
      >
        <div class="search-input-wrapper t-flex-1">
          <a-row :gutter="[16, 16]">
            <a-col :span="8">
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
            <a-col :span="8">
              <g-dropdown-select
                :placeholder="'Kho lấy hàng'"
                :options="options.pick_address_id"
                :value="filter.pick_address_id"
                :onChange="handleChangeFilterPickAddress"
                :min-width="'300px'"
              />
            </a-col>
            <a-col :span="8">
              <g-dropdown-select
                :placeholder="'Loại giao dịch'"
                :options="options.payment_keys"
                :value="filter.payment_keys"
                :onChange="handleChangeTypeBill"
                :min-width="'300px'"
              />
            </a-col>
          </a-row>
        </div>
        <g-button
          :loading="loading"
          class="primary t-w-[175px]"
          @click="handleFilter"
        >
          Tìm kiếm
        </g-button>
        <g-button
          :disabled="loading"
          @click="downloadFileExcel"
          class="primary t-w-[175px]"
        >
          Xuất Excel
        </g-button>
      </div>
      <div>
        <span class="t-font-medium t-black t-text-[16px]">
          Tổng tiền rút tự động: <format-price :value="sumAmount" /> đ
        </span>
      </div>
      <div class="list-order-table t-relative">
        <detail-table-skeleton v-if="!orders" />
        <detail-table
          v-else
          :pageType="''"
          :listPayment="orders"
          :loading="loading"
          :totalPages="totalPages"
          :page="filter.pageIndex"
          :page_size="filter.pageSize"
          :handleChangeLimit="handleChangeLimit"
          :handleChangePage="handleChangePage"
          :is-show-loading="true"
        />
      </div>
    </div>
  </a-modal>
</template>

<script>
import { GButton } from "@/components/elements";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import FormatPrice from "@/components/FormatPrice.vue";
import DetailTableSkeleton from "@/components/table/table-finance/DetailTableSkeleton";
import DetailTable from "@/components/table/table-finance/DetailTable";

import financeService from "@/services/finance.service";

import { STATUS_ORDER_IN_PACKAGE_WITHDRAW } from "@/contants/finance";
import {
  optionsPaymentKey,
  optionsStatusAudit,
} from "@/pages/finance/ListOrder.vue";

export default {
  components: {
    GButton,
    GDropdownSelect,
    FormatPrice,
    DetailTableSkeleton,
    DetailTable,
  },
  props: {
    visible: Boolean,
    setVisible: Boolean,
    transactionId: String,
    orderCount: Number,
  },
  data() {
    return {
      orders: null,
      loading: false,
      totalPages: 0,
      options: {
        package_status_id: optionsStatusAudit,
        pick_address_id: [],
        payment_keys: optionsPaymentKey,
      },
      filter: {
        pageIndex: 1,
        pageSize: 25,
        package_status_id: [],
        pick_address_id: [],
        payment_keys: [],
      },
      sumAmount: 0,
    };
  },
  computed: {
    pickAddresses() {
      return Array.isArray(this.$store.state.shop.PickAddress)
        ? this.$store.state.shop.PickAddress
        : [];
    },
  },
  mounted() {
    this.updatePickAddress();
  },
  methods: {
    async downloadFileExcel() {
      try {
        const response =
          await financeService.exportExcelFileTransactionWithdrawal(
            this.transactionId
          );
        if (response.data.success) {
          const file_url = response.data.data.file_url;
          window.open(file_url, "_blank");
        } else {
          this.$message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
      }
    },
    getStatusOrder(status) {
      return STATUS_ORDER_IN_PACKAGE_WITHDRAW[status]
        ? STATUS_ORDER_IN_PACKAGE_WITHDRAW[status]
        : "";
    },
    handleCancel() {
      this.setVisible(false);
    },
    async getPackageWithdraw() {
      this.loading = true;
      let _orders = [];
      let _totalPages = 0;
      let _sumAmount = 0;

      try {
        const params = {
          transId: this.transactionId,
          status: this.filter.package_status_id.join(","),
          pickAddressId: this.filter.pick_address_id,
          paymentKeys: this.filter.payment_keys.join(","),
          pageIndex: this.filter.pageIndex - 1,
          pageSize: this.filter.pageSize,
        };

        if (!params.status) delete params.status;
        if (!params.paymentKeys) delete params.paymentKeys;
        if (!params.pickAddressId?.length) delete params.pickAddressId;

        const response = await financeService.getLatestBankPayment(params);
        if (response.data.success) {
          _orders = (response.data.data.content || []).map((item) => ({
            ...item,
            paymentValue: item.amount,
          }));
          _totalPages = response.data.data.totalPages;
          _sumAmount = response?.data?.data?.extraInfo?.sumAmount || 0;
        } else {
          this.$message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
      }

      this.orders = _orders;
      this.totalPages = _totalPages;
      this.sumAmount = _sumAmount;
      this.loading = false;
    },
    handleFilter() {
      this.getPackageWithdraw();
    },
    handleChangePage(pageIndex) {
      this.filter.pageIndex = pageIndex;
      this.handleFilter(true);
    },
    handleChangeLimit(pageSize) {
      this.filter.pageSize = pageSize;
      this.handleFilter();
    },
    handleChangeFilterStatus(_value) {
      this.filter.package_status_id = _value;
    },
    handleChangeFilterPickAddress(_value) {
      this.filter.pick_address_id = _value;
    },
    handleChangeTypeBill(_value) {
      this.filter.payment_keys = _value;
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
  },
  watch: {
    visible() {
      if (this.visible) {
        this.filter = {
          pageIndex: 1,
          pageSize: 25,
          package_status_id: [],
          pick_address_id: [],
          payment_keys: [],
        };
        this.getPackageWithdraw();
      }
    },
    pickAddresses() {
      this.updatePickAddress();
    },
  },
};
</script>

<style lang="scss" scoped>
.list-order-payment-modal {
  color: #000 !important;
  font-size: 16px;
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
  .list-order-table {
    height: 565px;
    overflow: auto;
    color: #000;
    font-size: 16px;
    margin-top: 0.75rem;
  }
}
</style>

<style lang="scss">
.list-order-payment-modal {
  .ant-modal-content {
    border-radius: 13px 13px 12px 12px;
    .ant-modal-header {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .ant-modal-body {
      padding-bottom: 0 !important;
      border-radius: 13px 13px 12px 12px;
    }
  }
  .detail-table-wrapper {
    height: 506px !important;
    .overlay-loading {
      height: 506px !important;
    }
    .pagination-wrapper {
      width: 100% !important;
    }
  }
}
</style>
