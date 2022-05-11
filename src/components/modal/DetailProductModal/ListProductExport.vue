<template>
  <div>
    <div class="list-exports" @scroll="handleScroll">
      <template v-if="!listExports">
        <div
          v-for="item in [1, 2, 3, 4, 5]"
          :key="item"
          class="t-flex t-justify-between t-items-center t-pb-4 list-exports__item"
        >
          <div class="w-100">
            <g-skeleton-text :active="true" :width="'50%'" />
            <g-skeleton-text :active="true" :width="'40%'" />
            <g-skeleton-text :active="true" :width="'60%'" />
            <g-skeleton-text :active="true" :width="'40%'" />
            <g-skeleton-text :active="true" :width="'30%'" />
          </div>
          <img src="@/assets/icons/menu_right_submenu_right.svg" />
        </div>
      </template>
      <template v-else>
        <a-empty v-if="!listExports.length" :description="'Danh sách trống'" />
        <div
          v-else
          v-for="item in listExports"
          :key="item.id"
          class="t-flex t-justify-between t-pb-4 pointer list-exports__item"
          @click="openModalDetail(item.id)"
        >
          <div>
            <span class="medium-text">
              {{ BILL_TYPES[item.type].title }} | {{ item.code }}
            </span>
            <br />
            <span class="medium-text">
              {{ BILL_TYPES[item.type].label }} | {{ item.total_products }} SP |
              SL:
              {{ item.number_products }}
            </span>
            <br />
            <span>Kho: {{ item.src_name }}</span>
            <br />
            <span> Trạng thái: Hoàn thành </span>
            <br />
            <span>{{ formatCreatedAt(item.created_at) }}</span>
          </div>
          <div>
            <img src="@/assets/icons/menu_right_submenu_right.svg" />
          </div>
        </div>
      </template>
    </div>

    <detail-import-export-bill-modal
      :visible="visibleDetail"
      :handleCancel="handleCancelDetail"
      :billId="selectedBillId"
    />
  </div>
</template>

<script>
import moment from "moment";

import { GSkeletonText } from "@/components/elements/skeleton";

import warehouseService from "@/services/warehouse.service";
import { getTotalPages } from "@/utils";
import { formatMomentDate } from "@/utils/date";
import { BILL_TYPES } from "@/contants/warehouse";
import DetailImportExportBillModal from "../DetailImportExportBillModal.vue";

export default {
  name: "ListProductExport",
  props: ["productId", "tab"],
  components: {
    GSkeletonText,
    DetailImportExportBillModal,
  },
  data() {
    return {
      page: 1,
      isFirst: true,
      listExports: null,
      limit: 20,
      total: 0,
      loading: false,
      BILL_TYPES,
      visibleDetail: false,
      selectedBillId: "",
    };
  },
  computed: {
    totalPages() {
      return getTotalPages(this.total, this.limit);
    },
  },
  methods: {
    openModalDetail(id) {
      this.visibleDetail = true;
      this.selectedBillId = id;
    },
    handleCancelDetail() {
      this.selectedBillId = "";
      this.visibleDetail = false;
    },
    formatCreatedAt(createdAt) {
      return formatMomentDate(moment(new Date(createdAt)), "H:M DD/MM/YYYY");
    },
    async getData(page = 1) {
      this.loading = true;
      let listExports = [...(this.listExports || [])];
      try {
        const params = {
          page: page - 1,
          types: "ALL",
          product_id: this.productId,
          status: "DONE",
          page_size: 20,
        };

        const response = await warehouseService.getProductBills(params);
        if (response?.data?.success) {
          if (this.isFirst) this.isFirst = false;
          const list = response.data?.data?.list || [];
          listExports = [...listExports, ...list];

          if (!this.total) {
            this.total = response.data?.data?.total || 0;
          }
          this.page = page;
        }
      } catch (error) {
        console.error(error);
      }
      this.listExports = listExports;
      this.loading = false;
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (
        this.page < this.totalPages &&
        !this.loading &&
        percentageScrolled >= 0.85
      ) {
        this.getData(this.page + 1);
      }
    },
  },
  watch: {
    productId() {
      this.isFirst = true;
      this.listExports = null;
      this.total = 0;
      this.page = 1;
    },
    tab(_tab) {
      if (_tab === "export" && this.isFirst) {
        this.getData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-exports {
  height: calc(85vh - 400px);
  overflow-y: auto;
  width: calc(100% + 30px);
  transform: translateX(-1rem);
  padding: 0 1rem;
  .list-exports__item {
    border-bottom: 1px solid #e0e0e0;
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
}
</style>
