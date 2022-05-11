<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="1300"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="modal-audit-detail">
      <div class="flex t-items-center t-justify-between">
        <p class="t-font-bold t-text-black t-text-md t-text-lg t-mb-0">
          Số tiền GHTK chuyển cho shop:
          <format-price :value="totalFinal" /> đ
        </p>
        <div class="flex">
          <div class="components-input-demo-presuffix flex">
            <div>
              <g-input
                placeholder="Nhập mã đơn hàng"
                :value="filter.billId"
                style="width: 296px"
                @change="handleChangeFilterBillId"
              >
                <template #prefix>
                  <search-active-icon />
                </template>
              </g-input>
            </div>
          </div>
          <div>
            <g-button
              :style="{ width: '140px' }"
              class="primary t-ml-3"
              @click="handleFilter"
            >
              Tìm kiếm
            </g-button>
            <g-button
              :style="{ width: '140px' }"
              :disabled="!filepathExport"
              class="primary t-ml-3"
              @click="handleExportExcel"
            >
              Xuất Excel
            </g-button>
          </div>
        </div>
      </div>
      <div class="table-content mt-1">
        <table class="g-table w-100">
          <thead :style="{ width: `calc(100% - ${widthOfScrollbar}px)` }">
            <tr>
              <th style="width: 381px; max-width: 381px">Thông tin đơn hàng</th>
              <th style="width: 145px; max-width: 145px">Tiền thu hộ (1)</th>
              <th style="width: 240px; max-width: 240px">Tiền cộng (2)</th>
              <th style="width: 266px; max-width: 266px">Phí dịch vụ (3)</th>
              <th style="width: 145px; max-width: 145px">Thanh toán</th>
            </tr>
          </thead>
          <tbody id="tbody" @scroll="handleScroll">
            <tr v-if="detailById[bill.bill_id]?.debt_money">
              <td style="width: 381px; max-width: 381px">
                <span class="medium-text">
                  {{ detailById[bill.bill_id].code }}
                  <span class="tag-debt-bill">Hóa đơn nợ</span>
                </span>
                <br />
                <span>
                  Ngày phát sinh:
                  {{ formatTime(detailById[bill.bill_id].audit_at) }}
                </span>
              </td>
              <td style="width: 145px; max-width: 145px">
                <span class="medium-text"> 0 đ </span>
              </td>
              <td style="width: 240px; max-width: 240px">
                <div class="money-value text-align-right">0 đ</div>
              </td>
              <td style="width: 266px; max-width: 266px">
                <div class="money-value text-align-right has-detail">
                  <format-price :value="detailById[bill.bill_id].debt_money" />
                  đ
                </div>
                <div class="wrapper-detail-fees">
                  <div
                    class="flex justify-content-space-between item-detail-fee"
                  >
                    <div class="item-detail-fee__label">Nợ tồn</div>
                    <div class="item-detail-fee__value">
                      <format-price
                        :value="detailById[bill.bill_id].debt_money"
                      />
                      đ
                    </div>
                  </div>
                </div>
              </td>
              <td style="width: 145px; max-width: 145px">
                <span class="medium-text">
                  -<format-price :value="detailById[bill.bill_id].debt_money" />
                  đ
                </span>
              </td>
            </tr>
            <tr v-for="p in dataSource" :key="p.id">
              <td style="width: 381px; max-width: 381px">
                <span class="medium-text">{{ p.alias }}</span>
                <br />
                <span>
                  Trạng thái đơn hàng:
                  {{ ORDER_STATUS_TITLE[p.package_status_id] }}
                </span>
                <template v-if="p.done_at">
                  <br />
                  <span> Ngày hoàn thành: {{ formatTime(p.done_at) }} </span>
                </template>
              </td>
              <td style="width: 145px; max-width: 145px">
                <span class="medium-text">
                  <format-price :value="p.pick_money" /> đ
                </span>
              </td>
              <td style="width: 240px; max-width: 240px">
                <div
                  class="money-value text-align-right"
                  :class="{
                    'has-detail': getSumValue(p),
                  }"
                >
                  <format-price :value="getSumValue(p)" /> đ
                </div>
                <div class="wrapper-detail-fees">
                  <div
                    v-for="field in sumFields"
                    :key="field.key"
                    class="flex justify-content-space-between item-detail-fee"
                    :class="{
                      'no-value': !Number(p[field.key]),
                    }"
                  >
                    <div class="item-detail-fee__label">
                      {{ field.title }}
                    </div>
                    <div class="item-detail-fee__value">
                      <format-price
                        :value="Math.abs(Number(p[field.key] || 0))"
                      />
                      đ
                    </div>
                  </div>
                </div>
              </td>
              <td style="width: 266px; max-width: 266px">
                <div
                  class="money-value text-align-right"
                  :class="{
                    'has-detail': getSubValue(p),
                  }"
                >
                  <format-price :value="getSubValue(p)" /> đ
                </div>
                <div class="wrapper-detail-fees">
                  <div
                    v-for="field in subFields"
                    :key="field.key"
                    class="flex justify-content-space-between item-detail-fee"
                    :class="{
                      'no-value': !Number(p[field.key]),
                    }"
                  >
                    <div class="item-detail-fee__label">
                      {{ field.title }}
                    </div>
                    <div class="item-detail-fee__value">
                      <format-price
                        :value="Math.abs(Number(p[field.key] || 0))"
                      />
                      đ
                    </div>
                  </div>
                </div>
              </td>
              <td style="width: 145px; max-width: 145px">
                <span class="medium-text">
                  <format-price :value="getFinalPrice(p)" /> đ
                </span>
              </td>
            </tr>
            <tr v-if="dataSource.length === 0">
              <td colspan="5">
                <a-empty :description="'Danh sách trống'" />
              </td>
            </tr>
          </tbody>
          <tfoot
            v-if="dataSource.length !== 0"
            :style="{ width: `calc(100% - ${widthOfScrollbar}px)` }"
          >
            <tr>
              <td style="width: 381px; max-width: 381px">
                Tổng: {{ packages.length }} ĐH / 1 Hóa đơn
              </td>
              <td style="width: 145px; max-width: 145px">
                <format-price :value="totalPrice.totalCoD" /> đ
              </td>
              <td style="width: 240px; max-width: 240px; text-align: right">
                <format-price :value="totalPrice.totalSum" /> đ
              </td>
              <td style="width: 266px; max-width: 266px; text-align: right">
                <format-price :value="totalPrice.totalSub" /> đ
              </td>
              <td style="width: 145px; max-width: 145px">
                <format-price :value="totalPrice.totalFinal" /> đ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import GButton from "@/components/elements/button.vue";
import GInput from "@/components/elements/input.vue";
import SearchActiveIcon from "@/components/icons/SearchActiveIcon.vue";
import { ORDER_STATUS_TITLE } from "@/contants";
import {
  SUM_FIELDS_AUDIT as SUM_FIELDS,
  SUB_FIELDS_AUDIT as SUB_FIELDS,
} from "@/contants/finance";
import FormatPrice from "../FormatPrice.vue";
import { downloadFileFromUrl } from "@/utils";

const limit = 25;

export default {
  name: "ChatRequestModal",
  props: ["visible", "setVisible", "bill"],
  components: {
    GModal,
    GButton,
    GInput,
    SearchActiveIcon,
    FormatPrice,
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleOk() {
      console.log("ok");
    },
    handleChangeTypeShip(value) {
      this.filter.typeShip = value;
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
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled > 0.8) {
        let _indexPagination = this.indexPagination + limit;
        this.indexPagination =
          _indexPagination > this.total ? this.total : _indexPagination;
      }
    },
    getSumValue(p) {
      let total = 0;
      for (const field of SUM_FIELDS) {
        total += Math.abs(Number(p[field.key] || 0));
      }
      return total;
    },
    getSubValue(p) {
      let total = 0;

      for (const field of SUB_FIELDS) {
        total += Math.abs(Number(p[field.key] || 0));
      }
      return total;
    },
    getFinalPrice(p) {
      return p.money_received_by_shop || 0;
    },
    handleFilter() {
      this.filterByBillId = this.filter.billId;
    },
    handleChangeFilterBillId(event) {
      this.filter.billId = event.target.value;
    },
    handleExportExcel() {
      const prefix = "https://cache.giaohangtietkiem.vn/";

      downloadFileFromUrl(prefix + this.filepathExport);
    },
  },
  data() {
    return {
      payTypeOptions: [
        { key: "all", title: "Tất cả" },
        { key: "refund", title: "Bồi hoàn" },
        { key: "debt", title: "Đối soát âm" },
        { key: "audit", title: "Đối soát chuyển khoản" },
      ],
      filter: {
        typeShip: ["refund", "debt", "audit"],
        billId: "",
      },
      filterByBillId: "",
      ORDER_STATUS_TITLE,
      indexPagination: limit,
      widthOfScrollbar: 0,
      sumFields: SUM_FIELDS,
      subFields: SUB_FIELDS,
    };
  },
  computed: {
    detailById() {
      return this.$store.state.finance.detailById;
    },
    billDetail() {
      return this.detailById[this.bill?.bill_id] || {};
    },
    filepathExport() {
      const detailBill = this.detailById[this.bill?.bill_id];
      return detailBill?.filepath;
    },
    title() {
      if (!this.bill?.bill_id) return "Biên bản đối soát";
      const audit_at = this.detailById[this.bill?.bill_id]?.audit_at;

      const auditTime = new Date(audit_at);
      const month = (auditTime.getMonth() + 1).toString().padStart(2, "0");
      const date = auditTime.getDate().toString().padStart(2, "0");

      return `Biên bản đối soát ngày ${date} - ${month}`;
    },
    packages() {
      if (!this.bill?.bill_id) return [];
      const _packages = this.detailById[this.bill?.bill_id]?.packages || [];

      if (this.filterByBillId) {
        return _packages.filter((p) => {
          const alias = p.alias.toString().toLowerCase();
          const _billId = this.filterByBillId;

          return alias.includes(_billId);
        });
      }

      return _packages.map((p) => ({
        ...p,
        delivery_money: p.ship_money,
        insurance_fee: p.insurance,
      }));
    },
    dataSource() {
      return this.packages.slice(0, this.indexPagination);
    },
    totalPrice() {
      let totalCoD = 0;
      let totalSum = 0;
      let totalSub = this.billDetail.debt_money || 0;
      let totalFinal = this.billDetail.debt_money
        ? -1 * this.billDetail.debt_money
        : 0;

      for (const p of this.packages) {
        totalCoD += Number(p.pick_money);
        totalSum += this.getSumValue(p);
        totalSub += this.getSubValue(p);
        totalFinal += this.getFinalPrice(p);
      }

      return {
        totalCoD,
        totalSum,
        totalSub,
        totalFinal,
      };
    },
    totalFinal() {
      const transferFee = this.billDetail?.transfer_fee
        ? Number(this.billDetail.transfer_fee)
        : 0;

      return this.totalPrice.totalFinal - transferFee;
    },
  },
  watch: {
    visible() {
      this.$nextTick(() => {
        const tbodyElement = document.getElementById("tbody");
        if (tbodyElement) {
          this.widthOfScrollbar =
            tbodyElement.offsetWidth - tbodyElement.clientWidth;
        }
      });
    },
    bill(_bill) {
      console.log(_bill);
    },
  },
  unmounted() {
    this.page = 1;
  },
};
</script>

<style lang="scss" scoped>
.table-content {
  font-size: 16px;
  color: #000;
  th,
  td {
    padding: 16px;
  }
  td {
    vertical-align: top;
    word-wrap: break-word;
  }
  table tbody {
    display: block;
    max-height: 50vh;
    overflow-y: scroll;
    tr {
      &:last-child {
        td {
          border-bottom: 0;
        }
      }
    }
  }
  table thead,
  table tbody tr,
  table tfoot {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  table tfoot {
    border-top: 1px solid var(--grayColor);
    font-weight: 500;
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
    font-weight: 500;
    &.text-align-right {
      text-align: right;
    }
    &.has-detail {
      border-bottom: 1px solid #e0e0e0;
    }
  }
  .tag-debt-bill {
    background-color: #f2994a;
    padding: 1px 5px;
    color: #fff;
    border-radius: 4px;
    font-weight: normal !important;
    font-size: 14px;
  }
}
</style>
