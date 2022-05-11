<template>
  <div id="audit-page">
    <div class="wrapper-next-audit">
      <div class="flex justify-content-space-between">
        <header-title
          @onBack="onBack"
          :no-action="true"
          title="Phiên đối soát sắp tới"
        />
        <g-button @click="handleChangeRoute('/dong-tien/hoa-don-vat')">
          Quản lý hóa đơn VAT
        </g-button>
      </div>
      <div class="content t-mt-3 t-text-blacks">
        <p class="description-text t-border t-text-base">
          Tổng số tiền shop sẽ nhận được trong lần đối soát tới là:
          <format-price :value="nextAuditData.audit_mon || 0" /> đ (Số dư chốt)
          <br />
          (2) Tiền cộng: Khuyến mãi, Bồi hoàn<br />
          (3) Phí dịch vụ: Phí giao hàng, Phí DV phát sinh, Phí hoàn hàng, Nợ
          tồn, Phí chuyển khoản<br />
          (4) Số dư hiện tại là tiền về tính đến thời điểm hiện tại, sau khi trừ
          các khoản phí phát sinh dự kiến của tất cả các đơn (chưa bao gồm phí
          chuyển khoản)
          <span
            @click="() => (isExpanded = true)"
            v-if="!isExpanded"
            class="primary-text pointer"
          >
            ...Xem thêm
          </span>
          <br />
          <template v-if="isExpanded">
            (5) Số dư chốt là tiền về tính đến thời điểm hiện tại, sau khi trừ
            các khoản phí phát sinh dự kiến của tất cả các đơn đã chốt trạng
            thái
            <br />
            (6) Tiền đang luân chuyển: Số tiền đối soát dự kiến mà Shop sẽ nhận
            được của các đơn hàng GHTK đã lấy thành công nhưng chưa hoàn thành
            việc giao hàng
            <span
              @click="() => (isExpanded = false)"
              v-if="isExpanded"
              class="primary-text pointer"
            >
              Ẩn bớt
            </span>
            <br />
          </template>
        </p>
        <div class="table-content">
          <next-audit-table-skeleton v-if="isLoading && !lastAuditData" />
          <next-audit-table v-else />
        </div>
      </div>
    </div>
    <div class="wrapper-audit-history">
      <finance :is-expanded="isExpanded" />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import GButton from "@/components/elements/button.vue";
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import NextAuditTable from "@/components/table/table-finance/NextAuditTable.vue";
import FormatPrice from "@/components/FormatPrice.vue";
import Finance from "./Finance.vue";
import NextAuditTableSkeleton from "@/components/table/table-finance/NextAuditTableSkeleton.vue";

export default defineComponent({
  components: {
    HeaderTitle,
    FormatPrice,
    Finance,
    NextAuditTableSkeleton,
    NextAuditTable,
    GButton,
  },
  data() {
    return {
      isExpanded: false,
      isLoaded: false,
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.finance.loading;
    },
    nextAuditData() {
      return this.$store.state.finance.nextAuditData;
    },
    lastAuditData() {
      return this.$store.state.finance.lastAuditData;
    },
  },
  methods: {
    onBack() {
      this.$router.push("/web");
    },
    handleChangeRoute(path) {
      this.$router.push(path);
    },
  },
});
</script>

<style lang="scss" scoped>
#audit-page {
  position: relative;
  padding-bottom: 0;
  .wrapper-next-audit,
  .wrapper-audit-history {
    margin: 1rem 1rem 0 1rem;
  }
  .wrapper-audit-history {
    padding-top: 0;
    #finance-page {
      min-height: 465px;
    }
  }
  .wrapper-next-audit {
    .table-content {
      overflow-x: auto;
    }
  }
  .description-text {
    font-size: 14px;
  }
}
</style>
