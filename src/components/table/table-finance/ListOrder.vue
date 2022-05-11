<template>
  <div class="wrapper">
    <div
      v-if="loading && orders"
      class="loading-wrapper"
      :style="{ height: `${heightOfContent}px` }"
    >
      <a-spin />
    </div>
    <div class="wrapper-table">
      <table
        id="finance-list-order-table"
        class="w-100 g-table"
        :class="{ 'is-next-audit': isNextAudit }"
      >
        <thead>
          <th>Đơn hàng</th>
          <th>Tiền CoD</th>
          <th>Phí dịch vụ</th>
          <th style="min-width: 123px" v-if="isNextAudit">Chuyển khoản</th>
          <th style="width: 150px">Thao tác</th>
        </thead>
        <tbody v-if="!orders">
          <tr v-for="item in [1, 2, 3]" :key="item">
            <td>
              <g-skeleton-text :active="true" />
              <g-skeleton-text :active="true" />
            </td>
            <td>
              <g-skeleton-text :active="true" />
            </td>
            <td>
              <g-skeleton-text :active="true" />
            </td>
            <td style="min-width: 123px" v-if="isNextAudit">
              <g-skeleton-text :active="true" />
            </td>
            <td style="width: 150px">
              <g-skeleton-button :active="true" class="mb" />
              <g-skeleton-button :active="true" class="mb" />
              <g-skeleton-button :active="true" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-if="!orders.length">
            <td colspan="4">
              <a-empty :description="'Danh sách trống'" />
            </td>
          </tr>
          <tr v-for="order of orders" :key="order.id" class="row-item">
            <td>
              <span class="medium-text">
                {{ isNextAudit ? `ĐH ${order.packageOrder}` : order.alias }}
              </span>
              <br />
              <span> Trạng thái: {{ order.package_status }} </span>
            </td>
            <td><format-price :value="order.cod_money" /> đ</td>
            <td><format-price :value="order.service_fee" /> đ</td>
            <td style="min-width: 123px" v-if="isNextAudit">
              <format-price :value="order.order_amount" /> đ
            </td>
            <td style="width: 150px">
              <g-button
                class="rounded w-100 mb medium-text"
                @click="openDetailPackageModal(order)"
              >
                Chi tiết ĐH
              </g-button>
              <!-- <g-button
              v-if="isNextAudit"
              class="rounded w-100 mb medium-text"
              @click="openDetailBillModal(order)"
            >
              Chi tiết GD
            </g-button> -->
              <g-button
                class="rounded w-100 mb medium-text"
                @click="openRequestChat(order.order)"
              >
                Chats yêu cầu
              </g-button>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="orders?.length" class="t-sticky t-bottom-0">
          <td>
            <g-skeleton-text :width="'200px'" :active="true" v-if="loading" />
            <span v-else class="medium-text">
              Tổng {{ metric.total_pkg }} ĐH
              <span v-if="!isNextAudit">
                / <format-price :value="metric.total_pending_money" /> đ
              </span>
            </span>
          </td>
          <td>
            <g-skeleton-text :active="true" v-if="loading" />
            <span v-else>
              <format-price :value="metric.total_cod_money" /> đ
            </span>
          </td>
          <td>
            <g-skeleton-text :width="'150px'" :active="true" v-if="loading" />
            <span v-else>
              <format-price :value="metric.total_service_fee" /> đ
            </span>
          </td>
          <td v-if="isNextAudit">
            <g-skeleton-text :width="'150px'" :active="true" v-if="loading" />
            <span v-else>
              <format-price :value="metric.total_pending_money" /> đ
            </span>
          </td>
          <td style="width: 150px"></td>
        </tfoot>
      </table>
    </div>
    <div v-if="totalPages" class="pagination-wrapper flex align-items-center">
      <span class="description-limit mr">Số lượng bản ghi/trang</span>
      <g-select
        class="page-limit"
        :disabled="loading"
        :value="limit.toString()"
        :default-active-first-option="false"
        @change="onChangeLimit"
      >
        <a-select-option value="25">25</a-select-option>
        <a-select-option value="50">50</a-select-option>
        <a-select-option value="100">100</a-select-option>
      </g-select>
      <span class="ml">Trang {{ page }}/{{ totalPages }}</span>
      <g-button
        :disabled="loading || page === 1"
        class="ml btn-prev-page"
        @click="changePage(page - 1)"
      >
        <span>Trang trước</span>
      </g-button>
      <g-button
        :disabled="loading || page === totalPages"
        class="ml btn-next-page"
        @click="changePage(page + 1)"
      >
        <span>Trang sau</span>
      </g-button>
    </div>

    <package-detail-modal
      :visible="visibleModalPackageDetail"
      :setVisible="setVisibleModalPackageDetail"
      :order="selectedOrder"
      :alias="selectedOrder?.alias"
    />

    <!-- <detail-order-wallet
      :visible="visibleModalBillDetail"
      :setVisible="setVisibleModalBillDetail"
      :order="selectedOrder"
    /> -->
  </div>
</template>

<script>
import { GButton, GSelect } from "@/components/elements";
import FormatPrice from "@/components/FormatPrice.vue";
import { GSkeletonButton, GSkeletonText } from "@/components/elements/skeleton";
import PackageDetailModal from "@/components/modal/PackageDetailModal.vue";
// import DetailOrderWallet from "@/components/modal/DetailOrderWallet.vue";

// Mixins
import eventGChat from "@/plugins/mixins/eventGChat";

export default {
  name: "FinanceListOrderTable",
  props: [
    "orders",
    "loading",
    "totalPages",
    "page",
    "limit",
    "handleChangePage",
    "handleChangeLimit",
    "metric",
    "isNextAudit",
  ],
  mixins: [eventGChat],
  components: {
    GButton,
    GSelect,
    FormatPrice,
    GSkeletonText,
    GSkeletonButton,
    PackageDetailModal,
    // DetailOrderWallet,
  },
  data() {
    return {
      heightOfContent: 0,
      visibleModalPackageDetail: false,
      selectedOrder: {},
      // visibleModalBillDetail: false,
    };
  },
  methods: {
    changePage(page) {
      this.handleChangePage(page);
    },
    onChangeLimit(_limit) {
      this.handleChangePage(1);
      this.handleChangeLimit(_limit);
    },
    openDetailPackageModal(_order) {
      this.selectedOrder = _order;
      this.visibleModalPackageDetail = true;
    },
    // openDetailBillModal(_order) {
    //   this.selectedOrder = _order;
    //   this.visibleModalBillDetail = true;
    // },
    setVisibleModalPackageDetail(visible) {
      this.visibleModalPackageDetail = visible;
    },
    setVisibleModalBillDetail(visible) {
      this.visibleModalBillDetail = visible;
    },
    openRequestChat(packageOrder) {
      this.$router.push("/chat");
      this.$mixinSendEventGroupChatByPackage(packageOrder);
    },
  },
  watch: {
    loading() {
      const el = document.querySelector(".wrapper-table");

      if (el) {
        this.heightOfContent = el.clientHeight;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: calc(100vh - 97px - 15px - 65px);
  position: relative;
  .wrapper-table {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
  .row-item {
    &:last-child {
      td {
        border-bottom: 0;
      }
    }
  }
}
tbody {
  tr {
    &:last-child {
      border-bottom: 0;
    }
  }
}
td {
  vertical-align: top;
  word-break: break-word;
}
table {
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    th {
      &:first-child {
        width: 300px;
        @media only screen and (min-width: 1600px) {
          width: 400px;
        }
        @media only screen and (min-width: 1920px) {
          width: 600px;
        }
      }
    }
  }
  tbody,
  tfoot {
    td {
      &:first-child {
        width: 300px;
        @media only screen and (min-width: 1600px) {
          width: 400px;
        }
        @media only screen and (min-width: 1920px) {
          width: 600px;
        }
      }
    }
  }
  &.is-next-audit {
    thead {
      th {
        &:first-child {
          width: 180px;
          @media only screen and (min-width: 1400px) {
            width: 210px;
          }
          @media only screen and (min-width: 1600px) {
            width: 350px;
          }
        }
      }
    }
    tbody,
    tfoot {
      td {
        &:first-child {
          width: 180px;
          @media only screen and (min-width: 1400px) {
            width: 210px;
          }
          @media only screen and (min-width: 1600px) {
            width: 350px;
          }
        }
      }
    }
  }
}
.loading-wrapper {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff80;
}
.pagination-wrapper {
  height: 60px;
  border: 1px solid #e0e0e0;
  border-bottom: 0;
  bottom: 1px;
  width: 100%;
  padding: 0 1rem;
  position: absolute;
}
</style>
