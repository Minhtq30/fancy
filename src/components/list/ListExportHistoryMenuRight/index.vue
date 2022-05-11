<template>
  <div class="list-export-history-menu-right-wrapper">
    <template v-if="!listExports">
      <skeleton-list />
      <skeleton-list />
      <skeleton-list />
      <skeleton-list />
    </template>
    <template v-else>
      <div
        v-if="isLoading"
        class="overlay"
        :style="{ height: `${maxHeightOverlay}px` }"
      >
        <a-spin />
      </div>
      <div
        v-if="errorMessage"
        class="error-message-block pointer"
        @click="getData"
      >
        <span>{{ errorMessage }}</span>
        <br />
        <span>Click để tải lại</span>
      </div>
      <div v-else-if="!listExports.length" class="mb-1">
        <a-empty :description="'Danh sách trống'" />
      </div>
      <div v-else>
        <div v-for="item in listExports" :key="item.id" class="export-item">
          <div
            class="export-item__title flex t-justify-between pointer"
            @click="toggleSelectedId(item.id)"
            :class="{ 'is-selected': selectedId === item.id }"
          >
            <span>{{ item.title }}</span>
            <img class="ml" src="@/assets/icons/menu_right_submenu_right.svg" />
          </div>
          <div v-if="selectedId !== item.id" class="export-item__extra flex">
            <div class="extra-item">
              <span class="extra-label medium-text">
                {{ item?.delivered?.length || 0 }}/
                {{ item?.picked?.length || 0 }} ĐH
              </span>
              <br />
              <span class="muted-text">Hoàn thành / Bàn giao</span>
            </div>
            <div class="extra-item">
              <span class="extra-label medium-text">
                {{ item?.delivering?.length || 0 }} ĐH
              </span>
              <br />
              <span class="muted-text">Đang giao</span>
            </div>
          </div>
          <div v-else class="export-item__detail">
            <div
              class="flex t-justify-between pointer"
              @click="redirectExportHistory(item, 'picked')"
            >
              <span>Bàn giao</span>
              <div class="t-flex">
                <span>{{ item?.picked?.length || 0 }} ĐH</span>
                <img
                  class="ml sub-menu-arrow-icon"
                  src="@/assets/icons/menu_right_submenu_right.svg"
                />
              </div>
            </div>
            <div
              class="flex t-justify-between pointer"
              @click="redirectExportHistory(item, 'audited')"
            >
              <span>Đã đối soát ck</span>
              <div class="t-flex">
                <span>
                  {{ item?.audited?.length || 0 }} ĐH/
                  {{ item?.audited_income || 0 }}
                </span>
                <img
                  class="ml sub-menu-arrow-icon"
                  src="@/assets/icons/menu_right_submenu_right.svg"
                />
              </div>
            </div>
            <div
              class="flex t-justify-between pointer"
              @click="redirectExportHistory(item, 'returned')"
            >
              <span>Đã trả</span>
              <div class="t-flex">
                <span>{{ item?.returned?.length || 0 }} ĐH</span>
                <img
                  class="ml sub-menu-arrow-icon"
                  src="@/assets/icons/menu_right_submenu_right.svg"
                />
              </div>
            </div>
            <div
              class="flex t-justify-between pointer"
              @click="redirectExportHistory(item, 'delivered')"
            >
              <span>Hoàn thành/ tiền về</span>
              <div class="t-flex">
                <span>
                  {{ item?.audited?.length || 0 }} ĐH/
                  {{ item?.audited_income || 0 }}
                </span>
                <img
                  class="ml sub-menu-arrow-icon"
                  src="@/assets/icons/menu_right_submenu_right.svg"
                />
              </div>
            </div>
            <div
              class="flex t-justify-between pointer"
              @click="redirectExportHistory(item, 'delivering')"
            >
              <span>Đang giao</span>
              <div class="t-flex">
                <span>{{ item?.delivering?.length || 0 }} ĐH</span>
                <img
                  class="ml sub-menu-arrow-icon"
                  src="@/assets/icons/menu_right_submenu_right.svg"
                />
              </div>
            </div>
            <div
              class="flex t-justify-between pointer"
              @click="redirectExportHistory(item, 'returning')"
            >
              <span>Đang trả</span>
              <div class="t-flex">
                <span>{{ item?.returning?.length || 0 }} ĐH</span>
                <img
                  class="ml sub-menu-arrow-icon"
                  src="@/assets/icons/menu_right_submenu_right.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

import SkeletonList from "./SkeletonItemExportHistoryMenuRight.vue";
import warehouseService from "@/services/warehouse.service";
import { nFormatter } from "@/utils";

export default {
  name: "ListExportHistoryMenuRight",
  props: ["selectedDate", "selectedType"],
  components: {
    SkeletonList,
  },
  data() {
    return {
      listExports: null,
      selectedId: "1",
      isLoading: false,
      maxHeightOverlay: 0,
      firstLoadedSuccess: false,
      errorMessage: "",
    };
  },
  computed: {
    ...mapState({
      currentTime: (state) => state.realtimeReport.currentTime,
    }),
  },
  methods: {
    redirectExportHistory(listExports, _typeOrder) {
      let query = {};
      query.date = listExports.date;
      query.shift = listExports.shift;
      query.type = _typeOrder;
      this.$router.push({
        name: "warehouse-and-products_list-orders",
        query,
      });
    },
    formatDateExport(dateString) {
      if (!dateString) return "";
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    },
    formatShiftExport(shift) {
      if (!shift) return "";
      return {
        MORNING: "sáng",
        AFTERNOON: "chiều",
        NIGHT: "tối",
      }[shift];
    },
    convertDataPackages(packages = {}) {
      let _listExports = [];

      for (let dateKey in packages) {
        for (let shiftKey in packages[dateKey]) {
          const item = packages[dateKey][shiftKey];
          if (!item) continue;

          const shift = this.formatShiftExport(shiftKey);
          const date = this.formatDateExport(dateKey);

          const title = `Phiên lấy ${shift} ${date}`;

          _listExports.push({
            ...packages[dateKey][shiftKey],
            id: `${dateKey}_${shiftKey}`,
            title,
            date: dateKey,
            shift: shiftKey,
            audited_income: nFormatter(item?.audited_income || 0),
            delivered_income: nFormatter(item?.delivered_income || 0),
          });
        }
      }

      return _listExports;
    },
    async getData() {
      let listExports = [];
      let errorMessage = "";

      this.isLoading = true;
      this.getHeight();

      try {
        const [from_date, to_date] = (this.selectedDate || "0_0").split("_");
        const params = {
          from_date: Number(from_date) ? Number(from_date) : undefined,
          to_date: Number(to_date) ? Number(to_date) : undefined,
        };
        const response = await warehouseService.getMetricExportHistory(params);
        if (response?.data?.success) {
          if (!this.firstLoadedSuccess) {
            this.firstLoadedSuccess = true;
          }
          listExports = this.convertDataPackages(
            response?.data?.data?.picked?.packages
          );
        } else {
          errorMessage = response?.data?.message || "Lấy lịch sử xuất thất bại";
        }
      } catch (error) {
        console.error(error);
        errorMessage =
          error?.response?.data?.message || "Lấy lịch sử xuất thất bại";
      }

      this.listExports = listExports;
      this.errorMessage = errorMessage;
      this.isLoading = false;
    },
    getHeight() {
      const elm = document.getElementById("block-export-history-menu-right");
      if (elm) {
        this.maxHeightOverlay = elm.clientHeight;
      }
    },
    toggleSelectedId(id) {
      this.selectedId = this.selectedId === id ? "" : id;
    },
  },
  watch: {
    selectedDate() {
      this.getData();
    },
    selectedType(_selectedType) {
      if (_selectedType === "export" && !this.firstLoadedSuccess) {
        this.getData();
      }
    },
    currentTime() {
      if (this.firstLoadedSuccess && this.selectedDate !== "0_0") {
        this.getData();
      }
    },
  },
};
</script>

<style lang="scss">
.list-export-history-menu-right-wrapper {
  .export-item {
    padding: 10px 0;
    margin: 0 15px;
    &:not(:last-child) {
      border-bottom: 1px solid var(--grayColor);
    }
    &.is-selected {
      .export-item__title {
        img {
          transform: rotate(90deg);
        }
      }
    }
    .export-item__title {
      img {
        transform: rotate(0);
        transition: 0.15s linear;
        z-index: -1;
      }
    }
    .export-item__extra {
      .extra-item {
        &:first-child {
          margin-right: 30px;
        }
        .muted-text {
          font-size: 14px;
          color: #808080;
        }
      }
    }
  }
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.65);
  }
  .error-message-block {
    padding: 1rem;
    text-align: center;
    background-color: #eee;
    border-radius: 3px;
    align-items: center;
    justify-content: center;
    margin: 0 1rem 1rem 1rem;
  }
}
</style>
