<template>
  <table id="next-audit-table" class="w-100 g-table">
    <thead>
      <th>Tiền thu hộ (1)</th>
      <th>Tiền cộng (2)</th>
      <th>Phí dịch vụ (3)</th>
      <th>Số dư<br />hiện tại (4)</th>
      <th>Số dư chốt (5)</th>
      <th>Tiền đang<br />luân chuyển (6)</th>
      <th>Thao tác</th>
    </thead>
    <tbody>
      <tr>
        <td style="max-width: 126px; width: 126px">
          <format-price :value="nextAuditData?.pick_money || 0" /> đ
          <template v-if="listPkgs?.pick_money?.length">
            <br />
            <span
              class="primary-text pointer"
              @click="goToDetail('pick_money')"
            >
              {{ listPkgs.pick_money.length }} ĐH
            </span>
          </template>
        </td>
        <td style="max-width: 258px; width: 258px" class="td-sub-fee">
          <div
            class="money-value text-align-right"
            :class="{ 'has-detail': sumFields.length !== 0 }"
          >
            <format-price :value="nextAuditData?.total_sum || 0" /> đ
          </div>
          <div class="wrapper-detail-fees">
            <div
              v-for="field in sumFields"
              :key="field.key"
              class="flex justify-content-space-between item-detail-fee"
            >
              <div class="item-detail-fee__label">
                <span class="label-title">{{ field.title }}</span>
              </div>
              <div class="item-detail-fee__value" style="width: 155px">
                <span v-if="listPkgs?.[field.key]?.length">
                  <span
                    class="primary-text pointer"
                    @click="goToDetail(field.key)"
                  >
                    {{ listPkgs[field.key].length }} ĐH
                  </span>
                  {{ " " }}|{{ " " }}
                </span>
                <format-price :value="nextAuditData[field.key]" /> đ
              </div>
            </div>
          </div>
        </td>
        <td style="max-width: 301px; width: 301px">
          <div
            class="money-value text-align-right"
            :class="{ 'has-detail': subFields.length !== 0 }"
          >
            <format-price :value="nextAuditData?.total_sub || 0" /> đ
          </div>
          <div class="wrapper-detail-fees">
            <div
              v-for="field in subFields"
              :key="field.key"
              class="flex justify-content-space-between item-detail-fee"
            >
              <div class="item-detail-fee__label">
                <span class="label-title">
                  {{ field.title }}
                </span>
              </div>
              <div
                class="item-detail-fee__value"
                :class="{ 'is-transfer-fee': field.key === 'transfer_fee' }"
              >
                <span
                  v-if="
                    field.key !== 'transfer_fee' &&
                    listPkgs?.[field.key]?.length
                  "
                >
                  <span
                    class="primary-text pointer"
                    @click="goToDetail(field.key)"
                  >
                    {{ listPkgs[field.key].length }} ĐH
                  </span>
                  {{ " " }}|{{ " " }}
                </span>
                <format-price :value="nextAuditData[field.key]" /> đ
              </div>
            </div>
          </div>
        </td>
        <td style="max-width: 126px; width: 126px">
          <div style="line-height: 20px">
            <format-price :value="nextAuditData.available_cash || 0" /> đ
          </div>
          <span v-if="listPkgs?.available_cash?.length">
            <span
              class="primary-text pointer"
              @click="goToDetail('available_cash')"
            >
              {{ listPkgs.available_cash.length }} ĐH
            </span>
          </span>
        </td>
        <td style="max-width: 126px; width: 126px">
          <div style="line-height: 20px">
            <format-price :value="nextAuditData.audit_mon || 0" /> đ
          </div>
          <span v-if="listPkgs?.audit_mon?.length">
            <span class="primary-text pointer" @click="goToDetail('audit_mon')">
              {{ listPkgs.audit_mon.length }} ĐH
            </span>
          </span>
        </td>
        <td style="max-width: 126px; width: 126px">
          <div style="line-height: 20px">
            <format-price :value="nextAuditData.cash_transfer || 0" /> đ
          </div>
          <span v-if="listPkgs?.cash_transfer?.length">
            <span
              class="primary-text pointer"
              @click="goToDetail('cash_transfer')"
            >
              {{ listPkgs.cash_transfer.length }} ĐH
            </span>
          </span>
        </td>
        <td style="max-width: 150px; width: 150px; padding: 16px 8px">
          <g-button @click="onChatWithCSKH" class="rounded w-100 medium-text">
            Chat với CSKH
          </g-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
// Component
import GButton from "@/components/elements/button.vue";
import FormatPrice from "@/components/FormatPrice.vue";

// Mixins
import eventGChat from "@/plugins/mixins/eventGChat";

// Const
import { SUM_FIELDS, SUB_FIELDS } from "@/contants/finance";

export default {
  name: "AuditHistoryTableSkeleton",
  components: {
    GButton,
    FormatPrice,
  },
  mixins: [eventGChat],
  computed: {
    nextAuditData() {
      return this.$store.state.finance.nextAuditData || {};
    },
    listPkgs() {
      const _listPkgs = this.nextAuditData?.list_pkgs;
      if (_listPkgs) {
        _listPkgs.store_fee = _listPkgs.store;
        _listPkgs.insurance_fee = _listPkgs.insurance;
        _listPkgs.change_address_fee = _listPkgs.change_address;
        _listPkgs.return_fee = _listPkgs.return;
        _listPkgs.sale_off = _listPkgs.discount_ids;
      }

      return _listPkgs || {};
    },
    sumFields() {
      let _sumFields = [];

      for (const field of SUM_FIELDS) {
        if (this.nextAuditData[field.key]) {
          _sumFields.push(field);
        }
      }

      return _sumFields;
    },
    subFields() {
      let _subFields = [];

      for (const field of SUB_FIELDS) {
        if (field.key !== "transfer_fee" && this.nextAuditData[field.key]) {
          _subFields.push(field);
        }
      }

      if (this.nextAuditData["transfer_fee"]) {
        _subFields.push({ key: "transfer_fee", title: "Phí chuyển khoản" });
      }

      return _subFields;
    },
  },
  methods: {
    onChatWithCSKH() {
      this.$router.push("/chat");
      this.$mixinSendEventChatWithCSKH();
    },
    goToDetail(type) {
      // TODO NamVH: Cần push theo Name của router path.
      this.$router.push(`/dong-tien/chi-tiet-doi-soat?type=${type}`);
    },
  },
};
</script>

<style lang="scss" scoped>
#next-audit-table {
  font-size: 14px;
  th {
    padding: 16px 12px;
  }
  td {
    vertical-align: top;
    word-wrap: break-word;
    padding: 16px 12px;
    p {
      margin-bottom: 0;
    }
    &:first-child {
      min-width: 126px;
    }
    &:nth-child(2) {
      min-width: 258px;
    }
    &:nth-child(3) {
      min-width: 301px;
    }
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
      min-width: 126px;
    }
  }
  @media only screen and (min-width: 1920px) {
    td {
      min-width: unset !important;
    }
  }
}

.wrapper-detail-fees {
  .item-detail-fee {
    line-height: 20px;
    &:not(:last-child) {
      margin: 16px 0;
    }
    &:first-child {
      margin: 16px 0;
    }
    .item-detail-fee__label {
      display: flex;
      flex: 1;
      .label-title {
        display: inline-block;
      }
    }
    .item-detail-fee__value {
      width: 165px;
      text-align: right;
      &.is-transfer-fee {
        width: unset;
      }
    }
    &.no-value {
      display: none;
    }
  }
}
.money-value {
  line-height: 20px;
  padding-bottom: 16px;
  &.text-align-right {
    text-align: right;
  }
  &.has-detail {
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>
