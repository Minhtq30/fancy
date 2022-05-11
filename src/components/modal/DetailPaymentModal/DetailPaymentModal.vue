<template>
  <a-modal
    class="detail-payment-modal"
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="587"
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
          Chi tiết GD {{ detailPayment?.id }}
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
    <div class="t-relative">
      <div class="overlayLoading" v-if="loadingSpin">
        <a-spin :spinning="loadingSpin" />
      </div>
      <ul
        :class="{
          'border-bottom': detailPayment.paymentKey === 'deposit',
          'is-has-border-radius-bottom': loadingSpin || isHidden,
        }"
      >
        <li>
          <div class="detail-payment-title">Mã giao dịch</div>
          <div class="detail-payment-content">GD {{ detailPayment?.id }}</div>
        </li>
        <li>
          <div class="detail-payment-title">Số tiền</div>
          <div class="detail-payment-content">
            <format-price :value="paymentPriceValue" /> đ
          </div>
        </li>
        <li>
          <div class="detail-payment-title">Từ</div>
          <div class="detail-payment-content">
            {{ detailPaymentLabel.from }}
          </div>
        </li>
        <li>
          <div class="detail-payment-title">Đến</div>
          <div class="detail-payment-content">
            {{ detailPaymentLabel.to }}
          </div>
        </li>
        <li>
          <div class="detail-payment-title">Nội dung</div>
          <div class="detail-payment-content">
            {{ detailPayment.description }}
          </div>
        </li>
        <li>
          <div class="detail-payment-title">Thời gian thực hiện</div>
          <div class="detail-payment-content">{{ detailPayment.paidAt }}</div>
        </li>
      </ul>
      <div
        class="detail-payment-action t-flex t-items-center t-justify-between t-cursor-pointer t-p-[16px] t-bg-white"
        v-if="!isHidden"
        @click="handleListOrderPayment"
      >
        <div v-if="isShowOrderCount" class="t-text-[#069255] t-text-[16px]">
          Xem chi tiết {{ detailPayment.orderCount || 0 }} ĐH
        </div>
        <div v-else class="t-text-[#069255] t-text-[16px]">
          Xem chi tiết ĐH {{ detailPayment.packageOrder }}
        </div>
        <arrow-right-icon :width="10" :height="10" :color="'#069255'" />
      </div>
    </div>
  </a-modal>
  <list-order-payment-modal
    v-if="isShowOrderCount"
    :visible="visibleModal.orderPayment"
    :setVisible="setVisibleModal('orderPayment')"
    :withdraw-id="detailPayment.withdrawId"
    :transactionId="detailPayment.id"
    :orderCount="detailPayment.orderCount || 0"
  />
  <package-detail-modal
    v-else
    :visible="visibleModal.packageDetail"
    :setVisible="setVisibleModal('packageDetail')"
    :alias="orderAlias"
  />
</template>

<script>
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import ListOrderPaymentModal from "@/components/modal/DetailPaymentModal/ListOrderPaymentModal";
import financeService from "@/services/finance.service";
import { message } from "ant-design-vue";
import FormatPrice from "@/components/FormatPrice";
import PackageDetailModal from "../PackageDetailModal.vue";
import { getDetailPaymentLabel } from "./utils";

export default {
  components: {
    FormatPrice,
    ListOrderPaymentModal,
    ArrowRightIcon,
    PackageDetailModal,
  },
  props: {
    visible: Boolean,
    setVisible: Boolean,
    idDetailPayment: Number,
    order: Object,
    packageOrder: Number,
    paymentPriceValue: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      visibleModal: {
        orderPayment: false,
        packageDetail: false,
      },
      loadingSpin: false,
      detailPayment: {},
      orderAlias: "",
    };
  },
  computed: {
    shopInfo() {
      return this.$store.state.shop?.Shop || {};
    },
    detailPaymentLabel() {
      return getDetailPaymentLabel(
        this.detailPayment?.paymentKey,
        this.shopInfo
      );
    },
    isHidden() {
      if (!this.detailPayment?.paymentKey) return true;
      return (
        this.detailPayment.paymentKey === "deposit" ||
        this.detailPayment.paymentName === "Rút tiền"
      );
    },
    isShowOrderCount() {
      return this.detailPayment?.paymentName === "Rút tiền tự động";
    },
  },
  methods: {
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleListOrderPayment() {
      if (!this.isShowOrderCount) {
        this.visibleModal.packageDetail = true;
      } else {
        this.visibleModal.orderPayment = true;
      }
    },
    handleCancel() {
      this.setVisible(false);
    },
    async getDetailPaymentId() {
      if (this.idDetailPayment) {
        this.loadingSpin = true;
        try {
          const response = await financeService.getDetailPaymentId(
            this.idDetailPayment
          );
          if (response.data.success) {
            this.detailPayment = response.data.data;
            this.orderAlias = response.data.data.orderAlias;
            this.loadingSpin = false;
          } else {
            message.error(response.data.message);
            this.setVisible(false);
          }
        } catch (error) {
          console.log(error);
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
          this.setVisible(false);
        }
      }
    },
    openModalDetailPackage() {
      this.visibleModal.packageDetail = true;
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.detailPayment = {};
        this.getDetailPaymentId();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-payment-modal {
  .detail-payment-content {
    text-align: right;
    padding-left: 1rem;
  }
  .overlayLoading {
    position: absolute;
    display: flex;
    align-items: center;
    //background-color: rgb(255 255 255 / 84%);
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    transform: translate(-50%, -50%);
    height: 99%;
    border-radius: 10px;
    width: 99%;
    top: 50%;
    z-index: 1;
    left: 50%;
    border-bottom-left-radius: 13px;
    border-bottom-right-radius: 13px;
  }
  .border-bottom {
    border-radius: 0 0 10px 10px;
  }
  .is-has-border-radius-bottom {
    border-bottom-left-radius: 13px;
    border-bottom-right-radius: 13px;
  }
  ul {
    background-color: #fff;
    font-size: 16px;
    padding: 0 16px;
    li {
      color: #000;
      padding: 16px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    li + li {
      border-top: 1px solid #e0e0e0;
    }
  }
  .detail-payment-action {
    border-radius: 0 0 12px 12px;
  }
}
</style>

<style lang="scss">
.detail-payment-modal {
  .ant-modal-content {
    border-radius: 13px 13px 12px 12px;
    .ant-modal-header {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .ant-modal-body {
      padding: 0;
      background-color: #f0eff4;
      border-radius: 13px 13px 12px 12px;
    }
  }
}
</style>
