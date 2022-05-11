<template>
  <div class="list-bill-wrapper">
    <table class="w-100 g-table">
      <thead>
        <tr>
          <th class="medium-text t-w-[330px]">Đơn hàng</th>
          <th class="medium-text t-w-[320px]">Sản phẩm</th>
          <th class="medium-text">Cập nhật</th>
          <th class="medium-text t-w-[155px]">Thao tác</th>
        </tr>
      </thead>
      <tbody class="t-align-top">
        <tr v-for="(bill, index) in ListBill" :key="index">
          <td>
            <div class="bill">
              <div class="t-flex bill-item-top">
                <div>
                  <p
                    class="bill-item-alias t-font-bold t-text-base t-leading-5 t-pr-4"
                  >
                    {{ bill.package_alias || bill.alias }}
                  </p>
                </div>
                <div
                  v-if="!isListOrders && isShowProperty(bill.property)"
                  class="bill-item-tag t-w-auto t-h-[20px] t-mt-[-1px]"
                >
                  <p
                    class="t-text-white t-text-sm t-items-center t-text-center t-leading-5 t-uppercase"
                  >
                    {{ bill.package_type }}
                  </p>
                </div>
                <div v-else>
                  <div
                    v-if="isShowProperty(bill.property)"
                    class="bill-item-tag t-w-auto t-h-[20px] t-mt-[-1px]"
                  >
                    <p
                      class="t-text-white t-text-sm t-items-center t-text-center t-leading-5 t-uppercase"
                    >
                      {{ bill.property }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="bill-item-middle t-text-base t-leading-5 t-pb-[10px] t-mt-[-7px]"
              >
                Trạng thái:
                {{ bill.package_status_text || bill.package_status_id_text }}
              </div>
              <div class="bill-item-bot t-pt-[10px]">
                Kho lấy hàng:
                {{ bill.pick_address || bill.pick_last_address }}
              </div>
            </div>
          </td>
          <td>
            <div class="bill t-min-w-[150px]">
              <div v-if="!isListOrders">
                <div class="bill-product">
                  <div v-for="(product, index) in bill.products" :key="index">
                    <div class="bill-product-info t-pb-[10px]">
                      <span> {{ index + 1 }}. {{ product.product_name }} </span>
                      <div class="t-flex">
                        <span
                          >SL: {{ product.quantity }} | KL:
                          {{ product.weight }} kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bill-product-total-weight t-pt-[10px]">
                  Tổng KL:
                  {{ calculateTotalWeight(bill.products) }}
                  kg
                </div>
              </div>
              <div v-else>
                <package-product
                  :packageDetail="packageProduct(bill)"
                  :isLoading="loadingDetail(bill.id)"
                />
              </div>
            </div>
          </td>
          <td>
            <div class="bill t-min-w-[300px]">
              <package-logs
                :packageDetail="packageLogs(bill)"
                :isLoading="loadingDetail(bill.id)"
                :max="5"
              />
            </div>
          </td>
          <td>
            <div class="bill-btn">
              <g-button
                class="rounded w-100 mb medium-text"
                @click="setSelectedOrder(bill)"
              >
                Chi tiết ĐH
              </g-button>
              <g-button
                class="rounded w-100 mb medium-text"
                @click="openRequestChat(bill.order)"
              >
                Chats yêu cầu
              </g-button>
            </div>
          </td>
        </tr>
        <tr v-if="ListBill.length === 0 && !loading">
          <td colspan="5">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="ListBill.length !== 0"
      class="pagination-wrapper flex align-items-center justify-content-space-between t-px-[15px]"
    >
      <div>
        <span class="description-limit">Số lượng bản ghi/trang</span>
        <g-select
          :disabled="loading"
          class="page-limit"
          :value="page_size.toString()"
          :default-active-first-option="false"
          @change="onChangeLimit"
        >
          <a-select-option value="25">25</a-select-option>
          <a-select-option value="50">50</a-select-option>
          <a-select-option value="100">100</a-select-option>
        </g-select>
        Trang {{ page }}/{{ totalPages }}
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
    </div>

    <package-detail-modal
      :visible="visibleModalPackageDetail"
      :setVisible="setVisibleModalPackageDetail"
      :order="orderComputed"
      :orderDetail="detailById[selectedOrder?.id] || {}"
    />
  </div>
</template>

<script>
import { GSelect } from "@/components/elements";
import { get } from "lodash";

import GButton from "@/components/elements/button.vue";
import PackageDetailModal from "@/components/modal/PackageDetailModal.vue";
import eventGChat from "@/plugins/mixins/eventGChat";
import PackageProduct from "@/components/table/table-list-bill/PackageProduct.vue";
export default {
  props: [
    "loading",
    "handleChangePage",
    "handleChangeLimit",
    "totalPages",
    "page",
    "page_size",
    "ListBill",
    "dataLog",
    "loadingGetLogs",
    "isListOrders",
  ],
  mixins: [eventGChat],
  components: {
    PackageProduct,
    GButton,
    GSelect,
    PackageDetailModal,
  },
  computed: {
    detailById() {
      return this.$store.state.order.detailById;
    },
    orderComputed() {
      const _detail = this.detailById[this.selectedOrder?.id] || {};

      return {
        ..._detail,
        ...(_detail.Package || {}),
      };
    },
  },
  data() {
    return {
      showModal: false,
      isImport: false,
      selectedOrder: {},
      visibleModalPackageDetail: false,
    };
  },
  methods: {
    loadingDetail(id) {
      return get(
        this.$store.state.order.detailById[id],
        "is_loading_get_detail",
        true
      );
    },
    calculateTotalWeight(product) {
      let totalWeight = 0;
      if (product !== null) {
        for (let i = 0; i < product.length; i++) {
          totalWeight += product[i].quantity * product[i].weight;
        }
      } else {
        totalWeight = 0;
      }
      return totalWeight;
    },
    changePage(page) {
      this.handleChangePage(page);
    },
    onChangeLimit(page_size) {
      this.handleChangeLimit(page_size);
    },
    setVisibleModalPackageDetail(visible) {
      this.visibleModalPackageDetail = visible;
    },
    setSelectedOrder(order) {
      this.visibleModalPackageDetail = true;
      this.selectedOrder = order;
    },
    openRequestChat(orderId) {
      this.$router.push("/chat");
      this.$mixinSendEventGroupChatByPackage(orderId);
    },
    packageLogs(bill) {
      return {
        ...(this.detailById[bill.id] || {}),
      };
    },
    packageProduct(bill) {
      return {
        ...(this.detailById[bill.id] || {}),
      };
    },
    isShowProperty(property) {
      if (!property) return false;
      return ["bbs", "xfast"].includes(property.toLowerCase());
    },
  },
};
</script>

<style lang="scss" scoped>
.list-bill-wrapper {
  .bill {
    min-height: calc((100vh - 220px) / 5);
  }
  height: calc(100vh - 230px);
  overflow-y: auto;
  table {
    thead {
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 1;
    }
  }
  .bill-item-top {
    .bill-item-tag {
      padding: 0px 8px;
      background-color: #f2994a;
      border-radius: 4px;
    }
  }
  .bill-item-middle {
    border-bottom: 1px solid #e0e0e0;
  }

  .bill-product {
    border-bottom: 1px solid #e0e0e0;
  }

  .bill-btn {
    margin: 10px;
    .bill-detail-btn {
      border: 1.5px solid #069255;
      border-radius: 30px;
      padding: 7px 0px;
      span {
        color: #069255;
        font-size: 16px;
      }
    }
    .bill-chat-btn {
      border: 1.5px solid #069255;
      border-radius: 30px;
      padding: 0px;
      span {
        color: #069255;
        font-size: 16px;
      }
    }
  }
  .update-timeline {
    .ant-timeline-item-content {
      font-size: 16px;
    }
  }
  .pagination-wrapper {
    background-color: #ffffff;
    height: 60px;
    border: 1px solid var(--grayColor);
    width: calc(100% - 30px);
    position: absolute;
    bottom: 0;
    .description-limit {
      display: none;
    }
    .g-select.page-limit {
      width: 70px;
      margin-right: 0.5rem;
    }
    @media only screen and (min-width: 1600px) {
      .description-limit {
        display: inline-block;
        margin-right: 0.5rem !important;
      }
    }
  }
}
</style>
