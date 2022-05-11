<template>
  <div>
    <div
      v-for="(type, index) in warehouseType"
      :key="type.key"
      class="submenu-item item-newValue-warehouse-menu-right"
      :class="{
        'is-active': selectedSubMenu === type.key,
        'no-border': index === warehouseType.length - 1,
      }"
      @click="handleClick(type.key)"
    >
      <span class="submenu-item__left">{{ type.title }}</span>
      <div class="submenu-item__right flex align-items-center t-text-right">
        <div>
          <template v-if="isLoading">
            <div class="first-row-skeleton">
              <g-skeleton-text
                :active="true"
                :width="type.isSingle ? '50px' : '100px'"
              />
            </div>
            <div class="flex t-justify-end">
              <g-skeleton-text
                :active="true"
                :width="type.isSingle ? '50px' : '60px'"
              />
            </div>
          </template>
          <template v-else>
            <span>
              <format-price :value="newValue[type.keys[0]] || 0" />
              {{ type.isSingle ? "SP" : "ĐH" }}
            </span>
            <span v-if="type.keys[1] || type.keys[1] === 0">
              | <format-price :value="newValue[type.keys[1]] || 0" /> SP</span
            >
            <br />
            <span class="sub-newValue primary-text">
              {{ (metricChanged[type.keys[0]] || 0) >= 0 ? "+" : "-"
              }}<format-price :value="metricChanged[type.keys[0]] || 0" />
              {{ type.isSingle ? "SP" : "ĐH" }}
              <span v-if="type.keys[1] || type.keys[1] === 0">
                | {{ (metricChanged[type.keys[1]] || 0) >= 0 ? "+" : "-"
                }}<format-price :value="metricChanged[type.keys[1]] || 0" /> SP
              </span>
            </span>
          </template>
        </div>
        <img
          class="ml sub-menu-arrow-icon"
          src="@/assets/icons/menu_right_submenu_right.svg"
        />
      </div>
    </div>
    <list-import-export-modal
      :visible="visibleModal.listImportExport"
      :typeListImportExport="typeListImportExport"
      :handleCancel="handleCloseListImportExportModal"
      :selectedWarehouseFilter="selectedWarehouse"
      :selectedDateFilter="selectedDate"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import ListImportExportModal from "@/components/modal/ListImportExportModal/index.vue";
import { GSkeletonText } from "@/components/elements/skeleton";
import warehouseService from "@/services/warehouse.service";
import { WAREHOUSE_METRIC_TYPE } from "@/contants/warehouse";
import FormatPrice from "@/components/FormatPrice.vue";

export default {
  name: "ListMetricWarehouseMenuRight",
  props: ["selectedWarehouse", "selectedDate", "selectedType"],
  components: {
    GSkeletonText,
    ListImportExportModal,
    FormatPrice,
  },
  data() {
    return {
      warehouseType: WAREHOUSE_METRIC_TYPE,
      selectedSubMenu: "",
      isLoading: false,
      newValue: {},
      oldValue: {},
      firstLoadedSuccess: false,
      visibleModal: {
        listImportExport: false,
      },
      typeListImportExport: 1, // 1 for import, 2 for export
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapState({
      currentTime: (state) => state.realtimeReport.currentTime,
    }),
    metricChanged() {
      const keys = [
        "count_number_inventory",
        "count_number_package_checked",
        "count_number_package_created",
        "count_number_package_delivered_ghtk",
        "count_number_package_refund",
        "count_number_package_returned",
        "count_number_product_delivered_and_unpaid",
        "count_number_product_draft",
        "count_number_product_export",
        "count_number_product_import",
        "count_number_product_package_checked",
        "count_number_product_package_created",
        "count_number_product_package_delivered_ghtk",
        "count_number_product_package_returned",
        "count_number_product_shipping",
        "count_number_refund",
        "count_package_delivered_and_unpaid",
        "count_package_draft",
        "normal_shop_and_dont_create_bills",
        "total_package_shipping",
      ];

      let changed = {};

      for (const k of keys) {
        const _old = this.oldValue[k];
        const _new = this.newValue[k];
        if (!_old || !_new) continue;
        if (typeof _old === "number" && typeof _new === "number") {
          changed[k] = (_new || 0) - (_old || 0);
        } else {
          changed[k] = `${_new.toString()}_${_old.toString()}`;
        }
      }

      return changed;
    },
  },
  methods: {
    async getData(isGetRealtime = false) {
      this.isLoading = true;

      try {
        const [start_date, end_date] = (this.selectedDate || "0_0").split("_");

        const params = {
          start_date: Number(start_date) ? start_date : undefined,
          end_date: Number(end_date) ? end_date : undefined,
        };

        if (this.selectedWarehouse !== "all") {
          params.shop_warehouse_id = this.selectedWarehouse;
        }

        const response = await warehouseService.getDashboard(params);

        if (response?.data?.success) {
          this.oldValue = isGetRealtime ? this.newValue : response.data?.data;
          if (!this.firstLoadedSuccess) {
            this.firstLoadedSuccess = true;
          }
          this.newValue = response.data?.data;
        }
      } catch (error) {
        console.error(error);
      }

      this.isLoading = false;
    },
    handleClick(type) {
      if (type === "import") {
        this.handleOpenListImportExportModal(1);
        return;
      }

      if (type === "export") {
        this.handleOpenListImportExportModal(2);
        return;
      }

      if (type === "remain") {
        this.$router.push({ name: "warehouse-and-products_list-products" });
        return;
      }

      const [from_date, to_date] = (this.selectedDate || "0_0").split("_");

      const query = { type };

      if (this.selectedWarehouse !== "all") {
        query.shop_warehouse_id = this.selectedWarehouse;
      }
      if (Number(from_date)) query.from_date = from_date;
      if (Number(to_date)) query.to_date = to_date;

      this.$router.push({
        name: "warehouse-and-products_list-bills",
        query,
      });
    },
    handleOpenListImportExportModal(type) {
      this.typeListImportExport = type;
      this.visibleModal.listImportExport = true;
    },
    handleCloseListImportExportModal() {
      this.visibleModal.listImportExport = false;
    },
  },
  watch: {
    selectedWarehouse() {
      this.getData();
    },
    selectedDate() {
      this.getData();
    },
    currentTime() {
      if (this.firstLoadedSuccess && this.selectedDate !== "0_0") {
        this.getData(true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.submenu-item {
  padding: 0;
  height: 53px;
}
</style>

<style lang="scss">
.item-newValue-warehouse-menu-right {
  .ant-skeleton-title {
    margin-bottom: 0 !important;
  }
  .first-row-skeleton {
    margin-bottom: 8px;
  }
  &.no-border {
    border-bottom: 0 !important;
  }
}
</style>
