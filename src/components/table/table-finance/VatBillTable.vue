<template>
  <div :style="{ maxHeight: maxHeight, overflowY: 'auto' }">
    <table class="w-100 g-table vat-table">
      <thead>
        <tr>
          <th class="medium-text">Thông tin hóa đơn</th>
          <th class="medium-text">Thời gian</th>
          <th class="product-col medium-text">Trạng thái</th>
          <th class="medium-text">Tổng tiền trước thuế</th>
          <th class="medium-text">Thuế</th>
          <th class="medium-text">Tổng tiền sau thuế</th>
          <th class="action-col medium-text t-max-w-[150px] t-w-[150px]">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody v-if="!vatBillData">
        <tr v-for="item in [1, 2, 3]" :key="item">
          <td style="max-width: 280px">
            <g-skeleton-text :active="true" />
            <g-skeleton-text :active="true" />
          </td>
          <td class="t-min-w-[124px] xl:t-w-auto xl:t-min-w-auto">
            <g-skeleton-text :active="true" />
          </td>
          <td class="t-min-w-[108px] xl:t-w-auto xl:t-min-w-auto">
            <g-skeleton-text :active="true" />
          </td>
          <td class="t-min-w-[110px] xl:t-w-auto xl:t-min-w-auto">
            <g-skeleton-text :active="true" />
          </td>
          <td class="t-min-w-[110px] xl:t-w-auto xl:t-min-w-auto">
            <g-skeleton-text :active="true" />
          </td>
          <td class="t-min-w-[110px] xl:t-w-auto xl:t-min-w-auto">
            <g-skeleton-text :active="true" />
          </td>
          <td class="t-max-w-[150px] t-w-[150px]">
            <g-skeleton-button :active="true" class="mb" />
            <g-skeleton-button :active="true" class="mb" />
            <g-skeleton-button :active="true" />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-if="vatBillData.length === 0">
          <td colspan="7">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
        <tr v-for="bill in vatBillData" :key="bill.id">
          <td style="max-width: 280px">
            <span class="t-font-bolds medium-text t-text-blacks">
              {{ bill.sid }}
            </span>
            <br />
            <span class="t-text-blacks t-leading-loose t-py-1">
              Phương thức thanh toán: {{ bill.payment_method }}
            </span>
          </td>
          <td class="t-min-w-[124px] xl:t-w-auto xl:t-min-w-auto">
            <span class="t-text-blacks t-font-bolds t-text-md">
              {{ $filters.timestampToDate(bill.from) }}<br />
              đến {{ $filters.timestampToDate(bill.to) }}
            </span>
          </td>
          <td class="t-min-w-[108px] xl:t-w-auto xl:t-min-w-auto">
            <span class="t-text-blacks t-font-bolds t-text-md t-float-left">
              {{ vatStatusValue(bill.status) }}
            </span>
          </td>
          <td class="t-min-w-[110px] xl:t-w-auto xl:t-min-w-auto">
            <span class="t-text-blacks t-font-bolds t-text-md t-float-left">
              {{ $filters.numberFormatter(bill.amount) || 0 }}
            </span>
          </td>
          <td class="t-min-w-[110px] xl:t-w-auto xl:t-min-w-auto">
            <span class="t-text-blacks t-font-bolds t-text-md t-float-left">
              {{ $filters.numberFormatter(bill.vat_amount) || 0 }}
            </span>
          </td>
          <td class="t-min-w-[110px] xl:t-w-auto xl:t-min-w-auto">
            <span class="t-text-blacks t-font-bolds t-text-md t-float-left">
              {{ $filters.numberFormatter(bill.total) || 0 }}
            </span>
          </td>
          <td class="t-max-w-[150px] t-w-[150px]">
            <g-button
              class="rounded w-100 mb"
              @click="openDetailModal(bill.id)"
            >
              <span class="medium-text">Xem chi tiết</span>
            </g-button>
            <g-button class="rounded w-100 mb" @click="exportData(bill.ar_url)">
              <span class="medium-text">Xuất bảng kê</span>
            </g-button>
            <g-button class="rounded w-100" @click="viewPdf(bill.id)">
              <span class="medium-text">Xem hóa đơn</span>
            </g-button>
          </td>
        </tr>
      </tbody>
    </table>
    <detail-vat-modal
      :visible="visibleModal"
      :setVisible="setVisibleModal"
      :bill-id="billId"
      :key="billId"
    />
  </div>
</template>

<script>
import GButton from "@/components/elements/button.vue";
import DetailVatModal from "@/components/modal/DetailVatModal.vue";
import { GSkeletonButton, GSkeletonText } from "@/components/elements/skeleton";
import { vatBillStatus } from "@/pages/finance/VatBill.vue";

export default {
  name: "VatBillTable",
  props: {
    vatBillData: Array,
    maxHeight: String,
  },
  components: {
    GButton,
    DetailVatModal,
    GSkeletonButton,
    GSkeletonText,
  },
  data() {
    return {
      visibleModal: false,
      showPdf: false,
      billId: "",
    };
  },
  methods: {
    setVisibleModal(_visible) {
      this.visibleModal = _visible;
    },
    setVisiblePdfModal(_visible) {
      this.showPdf = _visible;
    },
    openDetailModal(billId) {
      this.billId = billId;
      this.visibleModal = true;
    },
    exportData(url) {
      window.open(url, "_blank");
    },
    vatStatusValue(key) {
      const status = vatBillStatus.find((item) => item.key === key);
      return status ? status.title : key;
    },
    viewPdf(billId) {
      const routeData = this.$router.resolve({
        name: "chi-tiet-hoa-don",
        params: { id: billId },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.vat-table {
  thead {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
  }
}
</style>
