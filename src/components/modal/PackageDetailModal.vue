<template>
  <div>
    <g-modal
      :visible="visible"
      :footer="null"
      :centered="true"
      :width="500"
      :maskClosable="!orderDetailData?.is_loading_get_detail"
      :title="orderData?.alias || 'Chi tiết đơn hàng'"
      @cancel="handleCancel"
      class="no-padding"
    >
      <div v-if="visible" class="t-relative package-detail-modal-wrapper">
        <div v-if="isError" class="error-message-wrapper">
          <div class="pointer t-text-center" @click="getDetail">
            <span>Lấy thông tin chi tiết thất bại.</span><br />
            <span>Click để thử lại.</span>
          </div>
        </div>
        <div
          class="t-p-4 detail-content-wrapper"
          :class="{ 'is-loading': orderDetailData?.is_loading_get_detail }"
        >
          <span class="medium-text text-lg">Khách hàng</span><br />
          <g-skeleton-text
            v-if="orderDetailData?.is_loading_get_detail"
            :active="true"
            :width="'50%'"
          />
          <div v-else>
            <span>{{ orderData.customer_fullname }}</span>
            <img
              class="t-w-[6px] t-ml-1"
              src="@/assets/icons/arrow_right_menu_right.svg"
            />
            /
            <hidden-content
              :text="orderData.customer_tel"
              :first="3"
              :last="4"
            />
          </div>
          <div>
            <g-skeleton-text
              v-if="orderDetailData?.is_loading_get_detail"
              :active="true"
              :width="'80%'"
            />
            <template v-else>
              <hidden-content
                :text="orderData.customer_first_address"
                :first="1"
                :last="1"
              />,
              {{ orderData.customer_last_address }}
            </template>
          </div>
          <div class="split" />
          <div
            v-if="
              orderDetailData?.is_loading_get_detail ||
              orderDetailData?.product?.length
            "
          >
            <span class="medium-text text-lg">Sản phẩm</span>
            <div v-if="orderDetailData?.is_loading_get_detail">
              <div class="t-flex t-my-2">
                <div>
                  <g-skeleton-image
                    class="circle"
                    :active="true"
                    :width="50"
                    :height="50"
                  />
                </div>
                <div class="t-flex t-flex-1 t-ml-4 t-flex-col t-justify-around">
                  <g-skeleton-text :active="true" :width="'50%'" />
                  <g-skeleton-text
                    class="no-margin"
                    :active="true"
                    :width="'30%'"
                  />
                </div>
              </div>
            </div>
            <div v-else>
              <div
                v-for="p in orderDetailData?.product || []"
                :key="p.product_id"
                class="t-flex t-my-2"
              >
                <div>
                  <image-preload
                    class="product-image-wrapper t-w-[50px] t-h-[50px] t-rounded-full"
                    :src="p.image_url"
                  />
                </div>
                <div class="t-ml-4">
                  <span>{{ p.product_name }}</span>
                  <br />
                  <span>
                    Khối lượng: {{ p.weight }} kg | Số lượng:
                    {{ p.quantity }}
                  </span>
                </div>
              </div>
            </div>
            <div class="split" />
          </div>
          <div v-if="orderDetailData?.is_loading_get_detail">
            <span class="medium-text text-lg">Đơn hàng</span><br />
            <p>{{ orderData?.alias }}</p>
            <p><g-skeleton-text :active="true" /></p>
            <p><g-skeleton-text :active="true" /></p>
            <p><g-skeleton-text :active="true" /></p>
            <p><g-skeleton-text :active="true" /></p>
          </div>
          <div v-else>
            <span class="medium-text text-lg">Đơn hàng</span><br />
            <p>{{ orderData?.alias }}</p>
            <p>
              Thu tiền: <format-price :value="orderData?.pick_money" /> đ | Khối
              lượng: {{ orderData?.weight }} kg
            </p>
            <p v-if="Number(orderDetail?.re_delivery_fee)">
              Phí giao lại:
              <format-price :value="orderDetail.re_delivery_fee" /> đ
            </p>
            <p v-if="Number(orderDetail?.re_return_fee)">
              Phí trả lại: <format-price :value="orderDetail.re_return_fee" /> đ
            </p>
            <p v-if="Number(orderDetail?.change_return_add_fee)">
              Phí đổi địa chỉ trả hàng:
              <format-price :value="orderDetail.change_return_add_fee" /> đ
            </p>
            <p>
              Phí dịch vụ cuối cùng:
              <format-price :value="orderData?.final_ship_fee" /> đ
            </p>
            <p v-if="orderDetail?.ship_fee_only">
              Phí ship:
              <format-price :value="orderDetail?.ship_fee_only" /> đ |
              {{ Number(orderData?.is_freeship) ? "Shop trả" : "Khách trả" }}
            </p>
            <p>
              Giá trị hàng hóa:
              <format-price :value="orderData?.value" /> đ
              <span v-if="Number(orderData?.insurance)"
                >| Phí bảo hiểm
                <format-price :value="orderData.insurance" /> đ</span
              >
            </p>
            <p v-if="pickDate">Lấy hàng dự kiến: {{ pickDate }}</p>
            <p v-if="deliverDate">Giao hàng dự kiến: {{ deliverDate }}</p>
            <p>Trạng thái đơn hàng: {{ orderData?.package_status_id_text }}</p>
          </div>
          <image-preload
            class="static-image-wrapper"
            :src="orderDetailData?.current_station_route?.ghtk_map_image_url"
          />
          <div class="mt-1">
            <package-logs
              :packageDetail="orderDetailData"
              :isExtend="true"
              :type="'normal'"
              :isLoading="orderDetailData?.is_loading_get_detail"
            />
          </div>

          <div
            v-if="!orderDetailData?.is_loading_get_detail"
            class="t-flex pointer t-justify-between btn-note-wrapper"
            @click="openOrderNoteModal"
          >
            <span class="medium-text primary-text">Ghi chú</span>
            <div>
              <img src="@/assets/icons/arrow_right_active.svg" />
            </div>
          </div>
        </div>
      </div>
    </g-modal>
    <order-note-modal
      :visible="visibleNoteModal"
      :setVisible="setVisibleNoteModal"
      :order="selectedOrder"
    />
  </div>
</template>

<script>
import moment from "moment";

import GModal from "../elements/modal.vue";
import { HiddenContent } from "@/components";
import FormatPrice from "../FormatPrice.vue";
import ImagePreload from "../elements/image-preload.vue";
import { formatMomentDate } from "@/utils/date";
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
import PackageLogs from "../table/order-table/PackageLogs.vue";
import OrderNoteModal from "./OrderNoteModal.vue";
import orderService from "../../services/order.service";
import { formatResponseOrderDetail } from "@/store/modules/order.module";

export const WORK_SHIFT = {
  1: "Sáng",
  2: "Chiều",
  3: "Tối",
};

export default {
  name: "PackageDetailModal",
  props: ["visible", "setVisible", "order", "orderDetail", "alias"],
  components: {
    GModal,
    HiddenContent,
    FormatPrice,
    ImagePreload,
    GSkeletonImage,
    GSkeletonText,
    PackageLogs,
    OrderNoteModal,
  },
  data() {
    return {
      orderData: {},
      orderDetailData: {},
      loadingGetDetail: false,
      isError: false,
      visibleNoteModal: false,
    };
  },
  computed: {
    pickDate() {
      if (!this.orderDetailData?.date_to_delay_deliver) return "";
      const _date = formatMomentDate(
        moment(new Date(this.orderDetailData.date_to_delay_deliver)),
        "DD/MM"
      );
      if (this.orderDetailData?.deliver_work_shift) {
        return `${
          WORK_SHIFT[this.orderDetailData?.deliver_work_shift]
        } ${_date}`;
      }
      return _date;
    },
    deliverDate() {
      if (!this.orderDetailData?.date_to_delay_pick) return "";
      const _date = formatMomentDate(
        moment(new Date(this.orderDetailData.date_to_delay_pick)),
        "DD/MM"
      );
      if (this.orderDetailData?.pick_work_shift) {
        return `${WORK_SHIFT[this.orderDetailData?.pick_work_shift]} ${_date}`;
      }
      return _date;
    },
    selectedOrder() {
      return {
        id: this.orderDetailData?.id,
        alias: this.orderDetailData?.alias,
      };
    },
  },
  methods: {
    setVisibleNoteModal(visible) {
      this.visibleNoteModal = visible;
    },
    handleCancel() {
      this.setVisible(false);
    },
    openOrderNoteModal() {
      this.visibleNoteModal = true;
    },
    async getDetail() {
      this.isError = false;
      this.orderDetailData = {
        ...this.orderDetail,
        is_loading_get_detail: true,
      };

      try {
        const response = await orderService.getOrderDetail(null, this.alias);
        if (response?.data?.success && response?.data?.data?.Package) {
          const responseData = response?.data?.data || {};
          const _orderDetail = formatResponseOrderDetail(responseData);
          this.orderDetailData = {
            ...responseData,
            ...responseData.Package,
            ..._orderDetail,
          };
          this.orderData = {
            ...responseData,
            ...responseData.Package,
            ..._orderDetail,
          };
        } else {
          this.isError = true;
        }
      } catch (error) {
        console.error(error);
        this.isError = true;
      }
      this.orderDetailData = {
        ...this.orderDetailData,
        is_loading_get_detail: false,
      };
    },
  },
  watch: {
    order(_order) {
      if (_order) {
        this.orderData = _order;
      }
    },
    orderDetail(_orderDetail) {
      if (_orderDetail) {
        this.orderDetailData = _orderDetail;
      }
    },
    visible(_visible) {
      if (_visible && this.alias) {
        this.getDetail();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .static-image-wrapper {
    height: 265px;
    margin-top: 4px;
  }
  .product-image-wrapper {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    img {
      &:first-child {
        width: 20px;
      }
    }
  }
}
.package-detail-modal-wrapper {
  color: #000;
  font-size: 16px;
  height: 80vh;
  .split {
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
    margin: 4px 0;
  }
  p {
    margin-bottom: 0;
  }
  .detail-content-wrapper {
    max-height: calc(100% - 40px);
    overflow-y: auto;
    &.is-loading {
      max-height: 100%;
    }
  }
  .btn-note-wrapper {
    padding: 0 1rem;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #e0e0e0;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .error-message-wrapper {
    height: 100%;
    position: absolute;
    background-color: #fff;
    top: 0;
    width: 100%;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
  }
}
</style>

<style lang="scss">
.g-modal {
  &.no-padding {
    .ant-modal-body {
      padding: 0;
    }
  }
}
</style>
