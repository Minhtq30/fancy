<template>
  <div>
    <g-modal
      :visible="visible"
      :footer="null"
      :centered="true"
      :width="1193"
      :title="'ĐH ' + order.order"
      @cancel="handleCancel"
    >
      <div class="detail-order-wallet-modal-wrapper">
        <div class="table-wrapper">
          <table class="w-100 g-table">
            <thead>
              <tr>
                <td>Tên giao dịch</td>
                <td>Số tiền</td>
                <td>Thời gian giao dịch</td>
                <td>Nội dung giao dịch</td>
                <td style="width: 162px">Thao tác</td>
              </tr>
            </thead>
            <tbody v-if="!listFees">
              <tr v-for="item in [1, 2, 3]" :key="item">
                <td>
                  <g-skeleton-text :active="true" />
                </td>
                <td>
                  <g-skeleton-text :active="true" />
                </td>
                <td>
                  <g-skeleton-text :active="true" />
                </td>
                <td>
                  <g-skeleton-text :active="true" />
                </td>
                <td style="width: 162px">
                  <g-skeleton-button :active="true" />
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-if="!listFees.length">
                <td colspan="5">
                  <a-empty :description="'Danh sách trống'" />
                </td>
              </tr>
              <tr v-for="item in listFees" :key="item.id">
                <td>{{ item.paymentName }}</td>
                <td>
                  <format-price
                    :value="
                      checkPaymentValue({
                        value: item.paymentValue,
                        status: item.status,
                      })
                    "
                  />
                  đ
                </td>
                <td>{{ item.paidAt }}</td>
                <td>{{ item.description }}</td>
                <td style="width: 162px">
                  <g-button
                    class="rounded w-100"
                    @click="openModalDetail(item)"
                  >
                    Xem chi tiết
                  </g-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </g-modal>
    <detail-payment-modal
      :idDetailPayment="selectedItem.id"
      :visible="visibleModalDetailPayment"
      :setVisible="setVisibleDetailPaymentModal"
      :order="order"
      :packageOrder="order?.packageOrder"
      :paymentPriceValue="paymentPriceValue"
    />
  </div>
</template>

<script>
import financeService from "@/services/finance.service";
import GButton from "../elements/button.vue";
import GModal from "../elements/modal.vue";
import { GSkeletonButton, GSkeletonText } from "@/components/elements/skeleton";
import DetailPaymentModal from "@/components/modal/DetailPaymentModal/DetailPaymentModal";
import FormatPrice from "../FormatPrice.vue";

export default {
  name: "DetailOrderWallet",
  props: ["visible", "setVisible", "order"],
  components: {
    GModal,
    GButton,
    GSkeletonButton,
    GSkeletonText,
    FormatPrice,
    DetailPaymentModal,
  },
  data() {
    return {
      listFees: null,
      loading: false,
      selectedItem: "",
      paymentPriceValue: "",
      visibleModalDetailPayment: false,
    };
  },
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
        return status.toLowerCase() === "đã trả";
      }
      return false;
    },
    handleCancel() {
      this.setVisible(false);
    },
    setVisibleDetailPaymentModal(visible) {
      this.visibleModalDetailPayment = visible;
    },
    openModalDetail(item) {
      this.selectedItem = item;
      this.paymentPriceValue = this.checkPaymentValue({
        value: item.paymentValue,
        status: item.status,
      });
      this.visibleModalDetailPayment = true;
    },
    async getData() {
      try {
        if (!this.order.order) return;
        const response = await financeService.getPaymentForOrder(
          this.order.order
        );

        if (response?.data?.success) {
          this.listFees = response?.data?.data || [];
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.listFees = null;
        this.getData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-order-wallet-modal-wrapper {
  font-size: 16px;
  color: #000;
  .table-wrapper {
    height: 60vh;
    overflow-y: auto;
  }
  table {
    thead {
      td {
        font-weight: 500;
        border-top: 1px solid var(--grayColor);
      }
    }
  }
}
</style>
