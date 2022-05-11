<template>
  <div
    id="warehouse-menu-item"
    class="item"
    :class="{
      'is-selected': tabActive === 'warehouse',
    }"
  >
    <div class="item-title flex" @click="handleToggle">
      <h2 class="tile-text-collap">QL kho & SP</h2>
      <h2 class="tile-text">Quản lý kho & SP</h2>
      <img src="@/assets/icons/arrow_right_menu_right.svg" />
    </div>
    <div v-if="tabActive === 'warehouse'" class="submenu-wrapper">
      <div class="block-submenu block-menu__warehouse">
        <div v-show="selectedType === 'warehouse'">
          <div
            class="warehouse-header-menu block-submenu__header t-flex t-items-center"
          >
            <div class="t-relative w-100">
              <div class="t-flex t-items-center t-justify-between">
                <div
                  class="title-realtime__left flex t-items-center w-100 t-justify-between"
                >
                  <p class="mb-0">Tình hình kho</p>
                  <div class="flex">
                    <select-warehouse-menu-right
                      :isOpen="openDropdown.warehouse"
                      :setIsOpen="handleSetOpenWarehouse"
                      :value="selectedWarehouse"
                      :onChange="handleChangeSelectedWarehouse"
                    />
                    <g-daterange-picker-select
                      :placeholder="'Thời gian'"
                      :from-date="daterangeFilterWarehouse.fromDate"
                      :to-date="daterangeFilterWarehouse.toDate"
                      :onChange="onChangeFilterWarehouseByDate"
                      :allowClear="true"
                      :iconType="'arrow'"
                      :isIncremental="true"
                      :showTooltip="true"
                    />
                  </div>
                </div>
              </div>
              <div class="t-flex t-items-center">
                <live-signal />
                <span class="ml t-text-black t-text-xs t-mt-1">
                  Live - {{ currentTime }}
                </span>
              </div>
            </div>
          </div>
          <div class="block-submenu__body">
            <list-metric-warehouse-menu-right
              :selectedWarehouse="selectedWarehouse"
              :selectedDate="dateFilterWarehouse"
              :selectedType="selectedType"
            />
          </div>
        </div>
        <div
          v-show="selectedType !== 'warehouse'"
          class="item-default pointer flex t-justify-between t-items-center"
          @click="selectedType = 'warehouse'"
        >
          <div>
            <span class="medium-text">Tình hình kho</span>
          </div>
          <div class="submenu-item__right">
            <img
              class="ml sub-menu-arrow-icon"
              src="@/assets/icons/menu_right_submenu_right.svg"
            />
          </div>
        </div>
      </div>
      <div class="block-submenu block-menu__export">
        <div v-show="selectedType === 'export'">
          <div
            class="warehouse-header-menu block-submenu__header t-flex t-items-center"
          >
            <div class="t-relative w-100">
              <div class="t-flex t-items-center t-justify-between">
                <div
                  class="title-realtime__left flex t-items-center w-100 t-justify-between"
                >
                  <p class="mb-0">Lịch sử xuất</p>
                  <div class="flex">
                    <g-daterange-picker-select
                      :placeholder="'Thời gian'"
                      :from-date="daterangeFilterExportHistory.fromDate"
                      :to-date="daterangeFilterExportHistory.toDate"
                      :onChange="onChangeFilterExportByDate"
                      :allowClear="true"
                      :iconType="'arrow'"
                      :isIncremental="true"
                      :showTooltip="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="block-submenu__body" id="block-export-history-menu-right">
            <list-export-history-menu-right
              :selectedDate="dateFilterExportHistory"
              :selectedType="selectedType"
            />
          </div>
        </div>
        <div
          v-show="selectedType !== 'export'"
          class="item-default pointer flex t-justify-between t-items-center"
          @click="selectedType = 'export'"
        >
          <div>
            <span class="medium-text">Lịch sử xuất</span>
          </div>
          <div class="submenu-item__right">
            <img class="ml" src="@/assets/icons/menu_right_submenu_right.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

import { LiveSignal, GDaterangePickerSelect } from "@/components";
import ListExportHistoryMenuRight from "@/components/list/ListExportHistoryMenuRight";
import SelectWarehouseMenuRight from "@/components/select/SelectWarehouseMenuRight.vue";
import ListMetricWarehouseMenuRight from "@/components/list/ListMetricWarehouseMenuRight";

export default {
  name: "WarehouseMenu",
  props: ["tabActive", "handleToggle", "isCollapsed"],
  components: {
    LiveSignal,
    ListExportHistoryMenuRight,
    SelectWarehouseMenuRight,
    GDaterangePickerSelect,
    ListMetricWarehouseMenuRight,
  },
  data() {
    return {
      oldValue: {},
      newValue: {},
      selectedType: "warehouse",
      openDropdown: {
        warehouse: false,
        date: false,
      },
      selectedWarehouse: "all",
      fromDateExport: null,
      toDateExport: null,
      fromDateHistory: null,
      toDateHistory: null,
      dateFilterWarehouse: "0_0",
      dateFilterExportHistory: "0_0",
    };
  },
  computed: {
    ...mapState({
      currentTime: (state) => state.realtimeReport.currentTime,
    }),
    daterangeFilterWarehouse() {
      const [fromDate, toDate] = this.dateFilterWarehouse.split("_");

      return {
        fromDate: Number(fromDate) ? moment(new Date(Number(fromDate))) : null,
        toDate: Number(toDate) ? moment(new Date(Number(toDate))) : null,
      };
    },
    daterangeFilterExportHistory() {
      const [fromDate, toDate] = this.dateFilterExportHistory.split("_");

      return {
        fromDate: Number(fromDate) ? moment(new Date(Number(fromDate))) : null,
        toDate: Number(toDate) ? moment(new Date(Number(toDate))) : null,
      };
    },
  },
  methods: {
    handleSetOpenDate(value) {
      if (value === true) {
        this.openDropdown.warehouse = false;
      }
      this.openDropdown.date = value;
    },
    handleSetOpenWarehouse(value) {
      if (value === true) {
        this.openDropdown.date = false;
      }
      this.openDropdown.warehouse = value;
    },
    handleChangeSelectedWarehouse(value) {
      this.selectedWarehouse = this.selectedWarehouse === value ? "" : value;
      this.openDropdown.warehouse = false;
    },
    onChangeFilterWarehouseByDate(value, key) {
      if (key === "incremental") {
        this.dateFilterWarehouse = `0_${new Date().getTime()}`;
        return;
      }

      const fromDate = new Date(value.fromDate).getTime();
      const toDate = new Date(value.toDate).getTime();
      this.dateFilterWarehouse = `${fromDate}_${toDate}`;
    },
    onChangeFilterExportByDate(value, key) {
      if (key === "incremental") {
        this.dateFilterExportHistory = `0_${new Date().getTime()}`;
        return;
      }

      const fromDate = new Date(value.fromDate).getTime();
      const toDate = new Date(value.toDate).getTime();
      this.dateFilterExportHistory = `${fromDate}_${toDate}`;
    },
  },
  watch: {
    tabActive(_tabActive) {
      if (_tabActive === "warehouse") {
        this.selectedType = "warehouse";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#warehouse-menu-item {
  .warehouse-header-menu {
    height: 71px;
    padding: 0 15px;
  }
  .dropdown-overlay {
    position: absolute;
    right: 0;
    width: 100%;
    bottom: -30px;
    padding: 0.5rem 1rem;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    border-radius: 5px;
    background-color: #fff;
  }
  .block-submenu {
    &:nth-child(2) {
      border-top: 1px solid var(--grayColor);
    }
    .item-default {
      height: 53px;
      padding: 0 15px;
    }
  }
  .block-submenu__body {
    max-height: calc(100vh - 64px - 65px - 65px - 65px - 53px - 71px);
  }
  .sub-metric {
    font-size: 14px;
  }
}
</style>

<style lang="scss">
#warehouse-menu-item {
  .dropdown-overlay {
    position: absolute;
    right: 0;
    width: 100%;
    bottom: 10px;
    transform: translateY(100%);
    padding: 0 1rem;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    border-radius: 5px;
    background-color: #fff;
    @media only screen and (max-height: 915px) {
      height: 330px;
      overflow-y: auto;
    }
  }
  .g-daterange-picker-select-wrapper {
    width: 103px;
    .g-input {
      padding-right: 28px;
      padding-left: 8px;
    }
    .action-icon {
      right: 8px;
    }
  }
  .list-options-wrapper {
    position: fixed;
    overflow: auto;
    right: 15px;
    width: 270px;
    transform: translateY(10px);
    bottom: unset;
    @media only screen and (max-height: 915px) {
      height: 350px;
    }
  }
}
</style>
