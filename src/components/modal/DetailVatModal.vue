<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="1300"
    :title="'Chi tiết hóa đơn'"
    @cancel="handleCancel"
  >
    <div class="modal-vat-detail">
      <div class="overlay" v-if="loading">
        <a-spin />
      </div>
      <span class="bill-id medium-text"> Mã hóa đơn: {{ billData.sid }} </span>
      <div class="bill-info-wrapper flex justify-content-space-between">
        <div class="wrapper-left">
          <div class="item-detail">
            <span class="medium-text">Mẫu số:</span> {{ billData.form }}
          </div>
          <div class="item-detail">
            <span class="medium-text">Loại:</span> {{ billData.type }}
          </div>
          <div class="item-detail">
            <span class="medium-text">Trạng thái:</span>
            {{ vatStatusValue(billData.status) }}
          </div>
          <div class="item-detail">
            <span class="medium-text">Ngày phát hành:</span>
            {{ $filters.timestampToDate(billData.to) }}
          </div>
        </div>
        <div class="wrapper-right">
          <div class="item-detail">
            <span class="medium-text">Họ tên người mua hàng:</span>
          </div>
          <div class="item-detail">
            <span class="medium-text">Tên đơn vị:</span>
            {{ billData.shop_name }}
          </div>
          <div class="item-detail">
            <span class="medium-text">Mã số thuế:</span>
            {{ billData.shop_tax_code }}
          </div>
        </div>
      </div>
      <div class="table-content mt-1">
        <table class="g-table w-100">
          <thead :style="{ width: `calc(100% - ${widthOfScrollbar}px)` }">
            <tr>
              <th style="width: 185px; max-width: 185px">Tên dịch vụ</th>
              <th style="width: 125px; max-width: 125px">Đơn vị</th>
              <th style="width: 125px; max-width: 125px">Số lượng</th>
              <th style="width: 165px; max-width: 165px">Phí dịch vụ</th>
              <th style="width: 165px; max-width: 165px">Thuế</th>
              <th style="width: 165px; max-width: 165px">Tiền thuế</th>
              <th style="width: 165px; max-width: 165px">Tổng tiền sau thuế</th>
            </tr>
          </thead>
          <tbody
            id="tbody"
            :style="{ width: `calc(100% - ${widthOfScrollbar}px)` }"
          >
            <tr v-for="(item, index) in billData.line_items" :key="index">
              <td style="width: 185px; max-width: 185px">{{ item.name }}</td>
              <td style="width: 125px; max-width: 125px">
                {{ billData.curr }}
              </td>
              <td style="width: 125px; max-width: 125px">
                {{ item.quantity }}
              </td>
              <td style="width: 165px; max-width: 165px">
                {{ $filters.numberFormatter(item.amount) }} đ
              </td>
              <td style="width: 165px; max-width: 165px">{{ item.vat }}%</td>
              <td style="width: 165px; max-width: 165px">
                {{ $filters.numberFormatter(item.vat_amount) }} đ
              </td>
              <td style="width: 165px; max-width: 165px">
                {{ $filters.numberFormatter(item.total) }} đ
              </td>
            </tr>
            <tr v-if="!billData.line_items">
              <td colspan="5">
                <a-empty :description="'Danh sách trống'" />
              </td>
            </tr>
          </tbody>
          <tfoot :style="{ width: `calc(100% - ${widthOfScrollbar}px)` }">
            <tr>
              <td colspan="3 " style="width: 435px; max-width: 435px">Tổng</td>
              <td style="width: 165px; max-width: 165px">
                {{ $filters.numberFormatter(billData.amount) || 0 }} đ
              </td>
              <td style="width: 165px; max-width: 165px">
                {{
                  billData.line_items ? billData.line_items[0].vat + "%" : ""
                }}
              </td>
              <td style="width: 165px; max-width: 165px">
                {{ $filters.numberFormatter(billData.vat_amount) || 0 }} đ
              </td>
              <td style="width: 165px; max-width: 165px">
                {{ $filters.numberFormatter(billData.total) || 0 }} đ
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <div class="t-inline">
                  Số tiền thanh toán bằng chữ:
                  <p class="t-inline t-font-normal">
                    {{ billData.words }}
                  </p>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </g-modal>
</template>

<script>
import { get } from "lodash";

import GModal from "@/components/elements/modal.vue";
import { downloadFileFromUrl } from "@/utils";
import financeService from "@/services/finance.service";
import { vatBillStatus } from "@/pages/finance/VatBill.vue";

export default {
  name: "DetailVatModal",
  props: ["visible", "setVisible", "bill", "billId"],
  components: {
    GModal,
  },
  methods: {
    async getDetailInvoiceData(params) {
      this.loading = true;
      try {
        const response = await financeService.getInvoiceDetail(params);
        if (response.data.success) {
          this.billData = response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    handleCancel() {
      this.setVisible(false);
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
    handleExportExcel() {
      const prefix = "https://cache.giaohangtietkiem.vn/";

      downloadFileFromUrl(prefix + this.filepathExport);
    },
    vatStatusValue(key) {
      const status = vatBillStatus.find((item) => item.key === key);
      return status ? status.title : key;
    },
  },
  data() {
    return {
      loading: false,
      widthOfScrollbar: 0,
      billData: {},
    };
  },
  computed: {
    totalServiceFee() {
      const line_items = get(this.billData, "line_items");
      const total =
        line_items !== undefined
          ? line_items.reduce(function (prev, cur) {
              const amount = cur.code === "CK" ? 0 : Number(cur.total);
              return prev + amount;
            }, 0)
          : 0;
      return total;
    },
    totalTaxAmount() {
      const line_items = get(this.billData, "line_items");

      return line_items !== undefined
        ? line_items.reduce(function (prev, cur) {
            const amount =
              cur.code === "CK"
                ? -Number(cur.vat_amount)
                : Number(cur.vat_amount);
            return prev + amount;
          }, 0)
        : 0;
    },
    totalMoney() {
      const line_items = get(this.billData, "line_items");
      return line_items !== undefined
        ? line_items.reduce(function (prev, cur) {
            const amount =
              cur.code === "CK" ? -Number(cur.total) : Number(cur.total);
            return prev + amount;
          }, 0)
        : 0;
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
  },
  unmounted() {
    this.page = 1;
  },
  mounted() {
    if (this.billId) {
      this.getDetailInvoiceData({ id: this.billId });
    }
  },
};
</script>

<style lang="scss" scoped>
.modal-vat-detail {
  font-size: 16px;
  color: #000;
  .bill-id {
    font-size: 18px;
    line-height: 22px;
  }
  .bill-info-wrapper {
    .wrapper-left,
    .wrapper-right {
      flex: 1;
    }
    .item-detail {
      line-height: 20px;
      margin-top: 14px;
    }
  }
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: calc((100% - 75px) - 24px);
    width: calc(100% - 30px);
    z-index: 1;
  }
}
.table-content {
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
    max-height: 50vh;
    overflow-y: scroll;
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
}
</style>
