<template>
  <div>
    <g-modal
      :visible="visible"
      :footer="null"
      :centered="true"
      :width="500"
      :maskClosable="!loading"
      :title="typeListImportExport === 1 ? 'Phiếu nhập' : 'Phiếu xuất'"
      @cancel="handleCancel"
      class="no-padding"
    >
      <div class="list-import-export-modal-wrapper">
        <div
          class="t-flex t-items-center t-justify-between t-h-[45px] t-px-4 header-filter"
        >
          <span class="medium-text">
            <format-price :value="total" /> phiếu |
            <format-price :value="totalProduct" /> SP
          </span>
          <div class="t-flex">
            <div class="mr">
              <g-dropdown-select
                :placeholder="'Kho hàng'"
                :isSingle="true"
                :options="warehouseOptions"
                :value="selectedWarehouse ? [selectedWarehouse] : []"
                :onChange="handleChangeWarehouse"
                :placement="'right'"
                :width="'300px'"
              />
            </div>
            <g-daterange-picker-select
              :placeholder="'Thời gian'"
              :from-date="daterangeFilter.fromDate"
              :to-date="daterangeFilter.toDate"
              :onChange="onChangeFilterDate"
              :allowClear="true"
              :iconType="'arrow'"
              :isIncremental="true"
              :showTooltip="true"
              :placement="'right'"
              :maxHeight="311"
            />
          </div>
        </div>
        <div class="t-px-4 t-pt-4 list-items" @scroll="handleScroll">
          <template v-if="!listData">
            <div
              v-for="item in [1, 2, 3]"
              :key="item"
              class="t-flex t-justify-between t-items-center t-pb-4 list-import-export-modal-wrapper__item"
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
          <div v-else>
            <div
              v-if="loading"
              class="t-fixed t-flex t-justify-center t-items-center overlay"
            >
              <a-spin />
            </div>
            <a-empty
              v-if="!listData.length"
              class="t-py-4"
              :description="'Danh sách trống'"
            />
            <div
              v-else
              v-for="item in listData"
              :key="item.id"
              class="t-flex t-justify-between t-items-center t-pb-4 pointer list-import-export-modal-wrapper__item"
              @click="handleClick(item)"
            >
              <div>
                <span class="medium-text">
                  {{ BILL_TYPES[item.type].title }} | {{ item.code }}
                </span>
                <br />
                <span class="medium-text">
                  {{ BILL_TYPES[item.type].label }} |
                  <format-price :value="item.total_products" /> SP | SL:
                  <format-price :value="item.number_products" />
                </span>
                <br />
                <span>Kho: {{ item.src_name }}</span>
                <br />
                <span>Trạng thái: {{ getStatusTitle(item) }}</span>
                <br />
                <span class="t-text-sm">
                  <i>{{ formatCreatedAt(item.created_at) }}</i>
                </span>
              </div>
              <img src="@/assets/icons/menu_right_submenu_right.svg" />
            </div>
          </div>
        </div>
      </div>
    </g-modal>

    <detail-import-export-bill-modal
      :visible="visibleDetail"
      :handleCancel="handleCancelDetail"
      :billId="selectedBillId"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

import { GDaterangePickerSelect } from "@/components";
import { GSkeletonText } from "@/components/elements/skeleton";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import FormatPrice from "@/components/FormatPrice.vue";
import wareHouseService from "@/services/warehouse.service";
import GModal from "../../elements/modal.vue";
import { getTotalPages } from "@/utils";
import { formatMomentDate } from "@/utils/date";
import { BILL_TYPES } from "@/contants/warehouse";
import DetailImportExportBillModal, {
  getImportExportStatusTitle,
} from "../DetailImportExportBillModal.vue";

export default {
  name: "ListImportExportModal",
  props: [
    "visible",
    "title",
    "handleCancel",
    "selectedWarehouseFilter",
    "selectedDateFilter",
    "typeListImportExport",
  ],
  components: {
    GModal,
    GDropdownSelect,
    GDaterangePickerSelect,
    GSkeletonText,
    DetailImportExportBillModal,
    FormatPrice,
  },
  data() {
    return {
      listData: null,
      selectedDate: "0_0",
      selectedWarehouse: "all",
      page: 1,
      total: 0,
      totalProduct: 0,
      limit: 20,
      loading: false,
      BILL_TYPES,
      visibleDetail: false,
      selectedBillId: "",
      resetFilter: false,
    };
  },
  computed: {
    ...mapState({
      warehouses: (state) => state.warehouse.warehouses || [],
    }),
    warehouseOptions() {
      let _warehouseOptions = this.warehouses.map((w) => ({
        ...w,
        key: w.id,
        title: w.name,
      }));

      if (_warehouseOptions?.length) {
        _warehouseOptions = [
          {
            key: "all",
            title: "Tất cả",
          },
          ..._warehouseOptions,
        ];
      }

      return _warehouseOptions;
    },
    daterangeFilter() {
      const [fromDate, toDate] = this.selectedDate.split("_");

      return {
        fromDate: Number(fromDate) ? moment(new Date(Number(fromDate))) : null,
        toDate: Number(toDate) ? moment(new Date(Number(toDate))) : null,
      };
    },
    totalPages() {
      return getTotalPages(this.total, this.limit);
    },
  },
  methods: {
    formatCreatedAt(createdAt) {
      return formatMomentDate(moment(new Date(createdAt)), "H:M DD/MM/YYYY");
    },
    getStatusTitle(item) {
      return getImportExportStatusTitle(item.status, item.type);
    },
    async getData(page = 1) {
      if (this.resetFilter) return;
      this.loading = true;
      let listData = page === 1 ? [] : [...(this.listData || [])];

      try {
        const [from_date, to_date] = (this.selectedDate || "0_0").split("_");

        const params = {
          from_date: Number(from_date) ? from_date : undefined,
          to_date: Number(to_date) ? to_date : undefined,
          page: page - 1,
          types: this.typeListImportExport === 1 ? "INPUT" : "OUTPUT",
          page_size: this.limit,
          is_statistics_product: true,
        };

        if (this.selectedWarehouse && this.selectedWarehouse !== "all") {
          params.warehouse_id = this.selectedWarehouse;
        }

        const response = await wareHouseService.getProductBills(params);

        if (response?.data?.success) {
          const list = response?.data?.data?.list || [];
          listData = [...listData, ...list];

          this.total = response.data?.data?.total || 0;

          this.totalProduct = Math.abs(
            response.data?.data?.statisticsProduct?.numberProducts || 0
          );
          this.page = page;
        } else {
          this.$message.error(
            response?.data?.message ||
              `Lấy danh sách phiếu ${
                this.typeListImportExport === 1 ? "nhập" : "xuất"
              } thất bại`
          );
        }
      } catch (error) {
        console.error(error);
        this.$message.error(
          error?.response?.data?.message ||
            `Lấy danh sách phiếu ${
              this.typeListImportExport === 1 ? "nhập" : "xuất"
            } thất bại`
        );
      }
      this.listData = listData;
      this.loading = false;
    },
    handleChangeWarehouse(_value) {
      this.selectedWarehouse = _value[0] || "";
    },
    onChangeFilterDate(value, key) {
      if (key === "incremental") {
        this.selectedDate = `0_${new Date().getTime()}`;
        return;
      }

      const fromDate = new Date(value.fromDate).getTime();
      const toDate = new Date(value.toDate).getTime();
      this.selectedDate = `${fromDate}_${toDate}`;
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
    handleClick(item) {
      this.selectedBillId = item.id;
      this.visibleDetail = true;
    },
    handleCancelDetail() {
      this.selectedBillId = "";
      this.visibleDetail = false;
    },
  },
  watch: {
    selectedWarehouseFilter(_selectedWarehouseFilter) {
      this.selectedWarehouse = _selectedWarehouseFilter;
    },
    selectedDateFilter(_selectedDateFilter) {
      this.selectedDate = _selectedDateFilter;
    },
    selectedWarehouse() {
      this.getData();
    },
    selectedDate() {
      this.getData();
    },
    visible(_visible) {
      if (!_visible) {
        this.resetFilter = true;
        this.total = 0;
        this.totalProduct = 0;
        this.listData = null;
      } else {
        this.resetFilter = false;
        this.getData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .g-dropdown-select .g-input,
  .g-daterange-picker-select-wrapper .g-input {
    height: 30px;
    width: 129px;
  }
}
.list-import-export-modal-wrapper {
  color: #000;
  font-size: 1rem;
  .header-filter {
    background-color: #e0e0e0;
  }
  .list-items {
    height: 459px;
    overflow-y: auto;
    .overlay {
      width: calc(500px - 2rem);
      height: calc(459px - 1rem);
      background-color: #ffffffa6;
    }
  }
  .list-import-export-modal-wrapper__item {
    border-bottom: 1px solid #e0e0e0;
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
}
</style>
