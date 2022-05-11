<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="561"
    :title="title"
    @cancel="handleCancel"
    class="no-padding"
  >
    <div class="wrapper">
      <div class="block-title">
        <span class="medium-text">
          Chi tiết phiếu
          {{
            detailData?.bill_type
              ? BILL_TYPES[detailData?.bill_type]?.label
              : ""
          }}
          {{
            BILL_CREATE_TYPE[this.detailData?.create_type]
              ? ` (${BILL_CREATE_TYPE[this.detailData?.create_type]})`
              : ""
          }}
        </span>
      </div>
      <div class="t-p-4">
        <div class="t-flex t-items-center">
          <span class="t-w-[100px] t-inline-block">Người tạo:</span>
          <g-skeleton-text
            class="no-margin"
            v-if="loading"
            :active="true"
            :width="'200px'"
          />
          <span v-else class="t-flex-1">{{ detailData.created_by }}</span>
        </div>
        <div class="t-flex t-items-center">
          <span class="t-w-[100px] t-inline-block">Thời gian:</span>
          <g-skeleton-text
            class="no-margin"
            v-if="loading"
            :active="true"
            :width="'100px'"
          />
          <span v-else class="t-flex-1">
            {{ formatCreatedAt(detailData?.created_at) }}
          </span>
        </div>
        <div class="t-flex t-items-center">
          <span class="t-w-[100px] t-inline-block">Số lượng:</span>
          <g-skeleton-text
            class="no-margin"
            v-if="loading"
            :active="true"
            :width="'50px'"
          />
          <span v-else class="t-flex-1">{{ totalNumber }}</span>
        </div>
        <div class="t-flex t-items-center">
          <span class="t-w-[100px] t-inline-block">HTVC:</span>
          <g-skeleton-text
            class="no-margin"
            v-if="loading"
            :active="true"
            :width="'100px'"
          />
          <span v-else class="t-flex-1">
            {{
              detailData?.transport_type === 2
                ? "Shop chuyển hàng"
                : "GHTK đến lấy hàng"
            }}
          </span>
        </div>
        <div v-if="detailData?.src_station" class="t-flex t-items-center">
          <span class="t-w-[100px] t-inline-block">Kho nguồn:</span>
          <g-skeleton-text
            class="no-margin"
            v-if="loading"
            :active="true"
            :width="'150px'"
          />
          <span v-else class="t-flex-1">{{ detailData?.src_station }}</span>
        </div>
        <div class="t-flex t-items-center">
          <span class="t-w-[100px] t-inline-block">Kho đích:</span>
          <g-skeleton-text
            class="no-margin"
            v-if="loading"
            :active="true"
            :width="'150px'"
          />
          <span v-else class="t-flex-1">{{ detailData?.dst_station }}</span>
        </div>
        <div v-if="statusTitle" class="t-flex t-items-center">
          <span class="t-w-[100px] t-inline-block">Trạng thái:</span>
          <g-skeleton-text
            class="no-margin"
            v-if="loading"
            :active="true"
            :width="'100px'"
          />
          <span v-else class="t-flex-1">{{ statusTitle }}</span>
        </div>
      </div>
      <div class="block-title t-flex t-justify-between">
        <span class="medium-text">Danh sách sản phẩm</span>
        <span class="medium-text">
          {{ (detailData?.products || []).length }} SP | SL: {{ totalNumber }}
        </span>
      </div>
      <div class="list-products">
        <div v-if="loading">
          <div
            v-for="item in [1, 2, 3]"
            :key="item"
            class="t-flex t-justify-between t-py-4 t-mx-4 list-products__item"
          >
            <g-skeleton-text
              class="no-margin"
              :active="true"
              :width="'250px'"
            />
            <g-skeleton-text
              class="no-margin"
              :active="true"
              :width="'100px'"
            />
          </div>
        </div>
        <template v-else>
          <div v-if="!detailData?.products?.length" class="t-py-4">
            <a-empty :description="'Danh sách trống'" />
          </div>
          <div
            v-for="product in detailData?.products"
            :key="product.product_id"
            class="t-flex t-justify-between t-py-4 t-mx-4 list-products__item"
          >
            <span class="t-flex-1">{{ product.name }}</span>
            <span>SL: {{ product.number }}</span>
          </div>
        </template>
      </div>
    </div>
  </g-modal>
</template>

<script>
import moment from "moment";

import GModal from "@/components/elements/modal.vue";
import { GSkeletonText } from "@/components/elements/skeleton";
import wareHouseService from "@/services/warehouse.service";
import { formatMomentDate } from "@/utils/date";
import { BILL_TYPES, BILL_CREATE_TYPE } from "@/contants/warehouse";

export const getImportExportStatusTitle = (status, billType) => {
  if (!status || !billType) return "";
  if (status === 1 || status === 100) return "Hoàn thành";
  if (status === 101) return "Đã xóa";
  if (status === 2) return "Deactive";
  if (status === 3) return "Đã nhận";
  if (status === 4) return "Từ chối";
  if (status === 6) return "Thất bại";

  if ([0, 5, 7, 8].includes(status)) {
    if ([1, 2, 3, 21].includes(billType)) {
      return "Chờ nhập";
    }
    if ([11, 12, 13, 14, 15, 16, 17, 18, 19].includes(billType)) {
      return "Chờ xuất";
    }
  }

  return status;
};

export default {
  name: "DetailImportExportBillModal",
  props: ["visible", "handleCancel", "billId"],
  components: {
    GModal,
    GSkeletonText,
  },
  data() {
    return {
      detailData: {},
      loading: false,
      BILL_TYPES,
      BILL_CREATE_TYPE,
    };
  },
  computed: {
    title() {
      if (!this.detailData?.bill_type) return "Chi tiết phiếu";
      return `${BILL_TYPES[this.detailData?.bill_type]?.title} | ${
        this.detailData.code
      }`;
    },
    totalNumber() {
      if (!this.detailData?.products) return 0;
      let _totalNumber = 0;
      for (const p of this.detailData?.products) {
        _totalNumber += p.number;
      }
      return _totalNumber;
    },
    statusTitle() {
      return getImportExportStatusTitle(
        this.detailData?.status,
        this.detailData?.bill_type
      );
    },
  },
  methods: {
    async getData() {
      this.loading = true;
      try {
        const response = await wareHouseService.getDetailBill(this.billId);

        if (response?.data?.success) {
          this.detailData = response?.data?.data || {};
        } else {
          this.$message.error(
            response?.data?.message || "Lấy thông tin chi tiết phiếu thất bại"
          );
        }
      } catch (error) {
        console.error(error);
        this.$message.error(
          error?.response?.data?.message ||
            "Lấy thông tin chi tiết phiếu thất bại"
        );
      }
      this.loading = false;
    },
    formatCreatedAt(createdAt) {
      return formatMomentDate(moment(new Date(createdAt)), "H:M DD/MM/YYYY");
    },
    getImportExportStatusTitle,
  },
  watch: {
    billId(_billId) {
      if (_billId) {
        this.getData();
      }
    },
    visible(_visible) {
      if (!_visible) {
        this.detailData = {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  color: #000;
  font-size: 16px;
  .block-title {
    background-color: #e0e0e0;
    padding: 0 1rem;
    height: 40px;
    line-height: 40px;
  }
  .list-products__item {
    &:not(:last-child) {
      border-bottom: 1px solid #e0e0e0;
    }
  }
}
</style>
