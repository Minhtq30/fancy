<template>
  <div class="wrapper-audit-history-table">
    <table class="w-100 g-table">
      <thead>
        <th>Thông tin hóa đơn</th>
        <th>Tiền thu hộ (1)</th>
        <th>Tiền cộng (2)</th>
        <th>Phí dịch vụ (3)</th>
        <th>Tiền đối soát</th>
        <th>Thao tác</th>
      </thead>
      <tbody>
        <tr v-for="bill in bills" :key="bill.id">
          <td class="bill-info" style="max-width: 275px; width: 275px">
            <span class="medium-text alias">
              {{ bill.bill }}
            </span>
            <template v-if="isLoadingGetDetail(bill.bill_id)">
              <g-skeleton-text :width="'60%'" :active="true" />
              <g-skeleton-text :width="'50%'" :active="true" />
              <g-skeleton-text :active="true" />
              <g-skeleton-text :width="'80%'" :active="true" />
              <g-skeleton-text :width="'80%'" :active="true" />
              <div class="divider" />
              <g-skeleton-text :width="'30%'" :active="true" />
              <g-skeleton-text :width="'30%'" :active="true" />
            </template>
            <template v-else>
              <span v-if="detailById[bill.bill_id]?.account">
                Tài khoản: {{ detailById[bill.bill_id]?.account }}
              </span>
              <span v-if="detailById[bill.bill_id]?.account_number">
                Ngân hàng: {{ detailById[bill.bill_id]?.account_number }}
              </span>
              <span v-if="detailById[bill.bill_id]?.audit_at">
                <span
                  style="width: 108px; display: inline-block; margin-bottom: 0"
                >
                  Gửi đối soát:
                </span>
                {{ formatTime(detailById[bill.bill_id].audit_at) }}
              </span>
              <span v-if="detailById[bill.bill_id]?.transfer_at">
                <span
                  style="width: 108px; display: inline-block; margin-bottom: 0"
                >
                  Chuyển khoản:
                </span>
                {{ formatTime(detailById[bill.bill_id].transfer_at) }}
              </span>
              <div v-if="detailById[bill.bill_id]?.total_p" class="divider" />
              <span v-if="detailById[bill.bill_id]?.total_p">
                Số đơn hàng: {{ detailById[bill.bill_id]?.total_p }} ĐH
              </span>
              <span v-if="detailById[bill.bill_id]?.returned">
                Số đơn trả: {{ detailById[bill.bill_id].returned }} ĐH
              </span>
            </template>
          </td>
          <td style="max-width: 135px; width: 135px">
            <span class="money-value">
              <g-skeleton-text
                v-if="isLoadingGetDetail(bill.bill_id)"
                :active="true"
              />
              <template v-else>
                <format-price
                  :value="detailById[bill.bill_id]?.pick_mon || 0"
                />
                đ
              </template>
            </span>
          </td>
          <td style="max-width: 240px; width: 240px">
            <div
              class="money-value text-align-right"
              :class="{
                'has-detail':
                  isLoadingGetDetail(bill.bill_id) || getSumValue(bill.bill_id),
              }"
            >
              <g-skeleton-text v-if="isLoadingGetDetail(bill.bill_id)" />
              <template v-else>
                <format-price :value="getSumValue(bill.bill_id)" /> đ
              </template>
            </div>
            <div
              v-if="isLoadingGetDetail(bill.bill_id)"
              class="wrapper-detail-fees"
            >
              <div class="flex justify-content-space-between item-detail-fee">
                <div class="item-detail-fee__label">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
                <div class="item-detail-fee__value">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
              </div>
              <div class="flex justify-content-space-between item-detail-fee">
                <div class="item-detail-fee__label">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
                <div class="item-detail-fee__value">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
              </div>
            </div>
            <div v-else class="wrapper-detail-fees">
              <div
                v-for="field in sumFields"
                :key="field.key"
                class="flex justify-content-space-between item-detail-fee"
                :class="{
                  'no-value':
                    !detailById[bill.bill_id] ||
                    !detailById[bill.bill_id][field.key],
                }"
              >
                <template
                  v-if="
                    detailById[bill.bill_id] &&
                    detailById[bill.bill_id][field.key]
                  "
                >
                  <div class="item-detail-fee__label">
                    {{ field.title }}
                  </div>
                  <div class="item-detail-fee__value">
                    <format-price
                      :value="detailById[bill.bill_id][field.key] || 0"
                    />
                    đ
                  </div>
                </template>
              </div>
            </div>
          </td>
          <td style="max-width: 260px; width: 260px">
            <div
              class="money-value text-align-right"
              :class="{
                'has-detail':
                  isLoadingGetDetail(bill.bill_id) || getSubValue(bill.bill_id),
              }"
            >
              <g-skeleton-text v-if="isLoadingGetDetail(bill.bill_id)" />
              <template v-else>
                <format-price :value="getSubValue(bill.bill_id)" /> đ
              </template>
            </div>
            <div
              v-if="isLoadingGetDetail(bill.bill_id)"
              class="wrapper-detail-fees"
            >
              <div class="flex justify-content-space-between item-detail-fee">
                <div class="item-detail-fee__label">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
                <div class="item-detail-fee__value">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
              </div>
              <div class="flex justify-content-space-between item-detail-fee">
                <div class="item-detail-fee__label">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
                <div class="item-detail-fee__value">
                  <g-skeleton-text
                    class="font-size-14 mb-16"
                    :width="'80%'"
                    :active="true"
                  />
                </div>
              </div>
            </div>
            <div v-else class="wrapper-detail-fees">
              <div
                v-for="field in subFields"
                :key="field.key"
                class="flex justify-content-space-between item-detail-fee"
                :class="{
                  'no-value':
                    !detailById[bill.bill_id] ||
                    !detailById[bill.bill_id][field.key],
                }"
              >
                <template
                  v-if="
                    detailById[bill.bill_id] &&
                    detailById[bill.bill_id][field.key]
                  "
                >
                  <div class="item-detail-fee__label">
                    {{ field.title }}
                  </div>
                  <div class="item-detail-fee__value">
                    <format-price
                      :value="detailById[bill.bill_id][field.key] || 0"
                    />
                    đ
                  </div>
                </template>
              </div>
            </div>
          </td>
          <td style="max-width: 135px; width: 135px">
            <div class="money-value">
              <g-skeleton-text
                v-if="isLoadingGetDetail(bill.bill_id)"
                :active="true"
              />
              <template v-else>
                <format-price :value="bill?.audit_mon || 0" />
                đ
              </template>
            </div>
          </td>
          <td style="max-width: 150px; width: 150px; padding: 16px 8px">
            <g-button
              class="rounded w-100 mb medium-text"
              :disabled="!detailById[bill.bill_id]"
              @click="
                openAuditDetailModal();
                setSelectedBill(bill);
              "
            >
              Xem chi tiết
            </g-button>
            <g-button
              v-if="isAdmin"
              class="rounded w-100 mb medium-text"
              :disabled="!detailById[bill.bill_id]?.filepath"
              @click="exportExcel(detailById[bill.bill_id]?.filepath)"
            >
              Xuất Excel
            </g-button>
            <g-button
              class="rounded w-100 mb medium-text"
              @click="onChatWithCSKH(bill.bill_id)"
            >
              Chat với CSKH
            </g-button>
          </td>
        </tr>
        <tr v-if="bills.length === 0">
          <td colspan="6">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
      </tbody>
    </table>
    <audit-detail-modal
      :visible="visibleModal.auditDetail"
      :setVisible="setVisibleModal('auditDetail')"
      :bill="selectedBill"
    />
  </div>
</template>

<script>
import { GButton } from "@/components/elements";
import {
  SUM_FIELDS_AUDIT as SUM_FIELDS,
  SUB_FIELDS_AUDIT as SUB_FIELDS,
} from "@/contants/finance";
import AuditDetailModal from "../../modal/AuditDetailModal.vue";
import { GSkeletonText } from "@/components/elements/skeleton";
import { downloadFileFromUrl } from "@/utils";
import FormatPrice from "@/components/FormatPrice.vue";
import { CACHE_URL, ROLES } from "@/contants";
import eventGChat from "@/plugins/mixins/eventGChat";

export default {
  name: "AuditHistoryTable",
  components: {
    GButton,
    AuditDetailModal,
    GSkeletonText,
    FormatPrice,
  },
  mixins: [eventGChat],
  props: ["bills"],
  data() {
    return {
      sumFields: SUM_FIELDS,
      visibleModal: {},
      selectedBill: {},
    };
  },
  methods: {
    formatOrderAlias(alias) {
      if (alias.length > 25) {
        return "..." + alias.slice(-23);
      }
      return alias;
    },
    openAuditDetailModal() {
      this.visibleModal.auditDetail = true;
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    onChatWithCSKH(billId) {
      this.$router.push("/chat");
      this.$mixinSendEventChatWithCSKHByBill(billId);
    },
    isLoadingGetDetail(billId) {
      const billDetail = this.detailById[billId] || {};

      return billDetail.is_loading_get_detail !== false;
    },
    formatTime(timeString) {
      const time = new Date(timeString);

      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");

      const year = time.getFullYear();
      const month = (time.getMonth() + 1).toString().padStart(2, "0");
      const day = time.getDate().toString().padStart(2, "0");

      return `${hours}:${minutes} ${day}/${month}/${year}`;
    },
    getSumValue(billId) {
      let total = 0;
      const billDetail = this.detailById[billId] || {};
      for (const field of SUM_FIELDS) {
        total += Number(billDetail[field.key]) || 0;
      }
      return total;
    },
    getSubValue(billId) {
      let total = 0;
      const billDetail = this.detailById[billId] || {};

      for (const field of SUB_FIELDS) {
        total += Number(billDetail[field.key]) || 0;
      }
      return total;
    },
    setSelectedBill(_bill) {
      this.selectedBill = _bill;
    },
    exportExcel(url) {
      downloadFileFromUrl(CACHE_URL + "/" + url);
    },
  },
  computed: {
    detailById() {
      return this.$store.state.finance.detailById;
    },
    subFields() {
      return SUB_FIELDS.sort(
        (a, b) => a.orderAuditHistory - b.orderAuditHistory
      );
    },
    shopStaff() {
      return this.$store.state?.shop?.ShopStaff || {};
    },
    isAdmin() {
      return this.shopStaff?.role === ROLES.ADMIN;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-audit-history-table {
  table {
    font-size: 14px;
    thead {
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 1;
    }
    th {
      padding: 16px;
    }
    td {
      vertical-align: top;
      word-wrap: break-word;
      padding: 16px;
      &.bill-info {
        span {
          line-height: 20px;
          display: block;
          margin-bottom: 8px;
          &.alias {
            margin-bottom: 16px;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
        .divider {
          width: 100%;
          height: 1px;
          background-color: #c4c4c4;
          margin-bottom: 8px;
        }
      }
      p {
        margin-bottom: 0;
      }
      &:first-child {
        min-width: 275px;
      }
      &:nth-child(2) {
        min-width: 135px;
      }
      &:nth-child(3) {
        min-width: 240px;
      }
      &:nth-child(4) {
        min-width: 260px;
      }
      &:nth-child(5) {
        min-width: 135px;
      }
      @media only screen and (min-width: 1920px) {
        min-width: unset !important;
      }
    }
  }
  .wrapper-detail-fees {
    font-size: 14px;
    .item-detail-fee {
      line-height: 20px;
      margin: 16px 0;
      &.no-value {
        display: none;
      }
      .item-detail-fee__label {
        max-width: 110px;
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
}
</style>
