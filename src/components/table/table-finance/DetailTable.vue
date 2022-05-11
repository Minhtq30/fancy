<template>
  <div class="detail-table-wrapper" id="detail-table-wrapper">
    <div
      v-if="!!isShowLoading && loading"
      class="overlay-loading"
      :style="{ height: `${heightOfLoading}px` }"
    >
      <a-spin />
    </div>
    <table class="w-100 g-table">
      <thead class="t-sticky t-top-0 t-z-10">
        <tr>
          <th class="medium-text">Tên giao dịch</th>
          <th class="medium-text">Số tiền</th>
          <th class="medium-text">Thời gian giao dịch</th>
          <th class="medium-text">Nội dung giao dịch</th>
          <th class="medium-text">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(payment, index) in listPayment" :key="index">
          <td
            :class="
              pageType === 'total_fee' ? 't-min-w-[400px]' : 't-min-w-[250px]'
            "
          >
            {{
              extraKeys.includes(payment.paymentKey) ? `GD ${payment.id}/ ` : ""
            }}
            {{ payment.paymentName }}
            <span
              class="t-float-right t-ml-[20px] t-text-[13px] t-rounded-[3px] t-px-[7px] t-py-[1px]"
              v-if="pageType === 'total_fee'"
              :class="
                checkStatusPayment(payment.status)
                  ? 'status-paid'
                  : 'status-unpaid'
              "
            >
              {{ payment.status }}
            </span>
          </td>
          <td class="t-min-w-[200px]">
            <format-price
              :value="
                checkPaymentValue({
                  value: payment.paymentValue,
                  status: payment.status,
                })
              "
            />
            đ
          </td>
          <td class="t-min-w-[200px]">{{ payment.paidAt }}</td>
          <td class="t-min-w-[200px]">{{ payment.description }}</td>
          <td class="t-min-w-[150px] t-w-[150px]">
            <g-button
              class="rounded w-100 mb medium-text"
              @click="handleDetailPayment(payment)"
            >
              Xem chi tiết
            </g-button>
          </td>
        </tr>
        <tr v-if="listPayment.length === 0">
          <td class="t-min-w-[150px]" colspan="12">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
      </tbody>
      <slot name="tfoot" />
    </table>
    <div
      class="pagination-wrapper flex align-items-center justify-content-space-between t-px-[15px]"
      v-if="listPayment.length !== 0"
    >
      <div>
        <span class="description-limit t-mr-[5px]">Số lượng bản ghi/trang</span>
        <g-select
          class="page-limit"
          :value="page_size.toString()"
          :default-active-first-option="false"
          :disabled="loading"
          @change="onChangeLimit"
        >
          <a-select-option value="25">25</a-select-option>
          <a-select-option value="50">50</a-select-option>
          <a-select-option value="100">100</a-select-option>
        </g-select>
        Trang {{ listPayment.length === 0 ? 0 : page }}/{{ totalPages }}
        <g-button
          class="ml btn-prev-page"
          :disabled="loading || page === 1"
          @click="changePage(page - 1)"
        >
          <span>Trang trước</span>
        </g-button>
        <g-button
          class="ml btn-next-page"
          :disabled="loading || page === totalPages || listPayment.length === 0"
          @click="changePage(page + 1)"
        >
          <span>Trang sau</span>
        </g-button>
      </div>
    </div>
  </div>
  <detail-payment-modal
    :idDetailPayment="idDetailPayment"
    :visible="visibleModal.detailPayment"
    :setVisible="setVisibleModal('detailPayment')"
    :order-alias="orderAlias"
    :package-order="packageOrder"
    :paymentPriceValue="paymentPriceValue"
  ></detail-payment-modal>
</template>

<script>
import { GSelect, GButton } from "@/components/elements";
import DetailPaymentModal from "@/components/modal/DetailPaymentModal/DetailPaymentModal";
import FormatPrice from "@/components/FormatPrice";
//check các trường hợp status để css
const KEY_CHECK_STATUS = "đã trả";

export default {
  components: {
    FormatPrice,
    DetailPaymentModal,
    GButton,
    GSelect,
  },
  props: [
    "pageType",
    "listPayment",
    "loading",
    "page",
    "page_size",
    "totalPages",
    "loadData",
    "handleChangeLimit",
    "handleChangePage",
    "isShowLoading",
  ],
  data() {
    return {
      extraKeys: ["withdraw", "deposit"],
      keyCheckStatus: KEY_CHECK_STATUS,
      paymentPriceValue: "",
      idDetailPayment: null,
      packageOrder: null,
      orderAlias: null,
      visibleModal: {
        detailPayment: false,
      },
      heightOfLoading: 0,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    checkPaymentValue(data) {
      if (data.value && this.checkStatusPayment(data.status)) {
        return data.value.toString().includes("-")
          ? `-${data.value.toString().replace("-", "")}`
          : `+${data.value}`;
      }
      return data.value || "0";
    },
    checkStatusPayment(status) {
      if (status) {
        return status.toLowerCase() === this.keyCheckStatus;
      }
      return false;
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleDetailPayment(payment) {
      if (payment.id) {
        this.paymentPriceValue = this.checkPaymentValue({
          value: payment.paymentValue,
          status: payment.status,
        });
        this.idDetailPayment = payment.id;
        this.visibleModal.detailPayment = true;
        this.packageOrder = payment.packageOrder;
        this.orderAlias = payment.orderAlias;
      }
    },
    onChangeLimit(_limit) {
      this.handleChangeLimit(_limit);
    },
    changePage(page) {
      this.handleChangePage(page);
    },
    updateHeightLoading() {
      const elm = document.getElementById("detail-table-wrapper");

      if (elm) {
        this.heightOfLoading = elm.clientHeight;
      }
    },
  },
  watch: {
    loading(_loading) {
      if (_loading) {
        this.updateHeightLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-table-wrapper {
  height: calc(100vh - 240px);
  overflow-y: auto;
  .overlay-loading {
    position: absolute;
    z-index: 9999;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff9;
  }
  .status-paid {
    background-color: #e5e5e5;
  }
  .status-unpaid {
    background-color: #f2994a;
    color: #fff;
  }
  .disabled {
    border-color: #bdbdbd;
    color: #bdbdbd;
    cursor: not-allowed;
  }
  .pagination-wrapper {
    background: #fff;
    height: 60px;
    border: 1px solid var(--grayColor);
    width: calc(100% - 30px);
    position: absolute;
    bottom: 0;
    .g-select.page-limit {
      width: 70px;
    }
    .actions-wrapper {
      .button-action {
        padding: 0 40px;
        height: 38px;
      }
    }
  }
  @media only screen and (max-width: 1600px) {
    height: calc(100vh - 295px);
  }
}
</style>

<style lang="scss"></style>
