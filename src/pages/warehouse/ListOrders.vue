<template>
  <div class="list-orders t-h-full">
    <div class="overlay" v-if="loading && !showIndicator">
      <a-spin :spinning="loading" />
    </div>
    <div class="list-orders-top t-pb-[14px]">
      <div class="t-font-bold t-text-lg t-leading-5">
        {{ getTitleFromRoute }}
      </div>
      <div class="t-pt-[14px]">
        {{ getStatusFromRoute }} | {{ this.listIds.length }} ĐH
      </div>
    </div>
    <list-bill-table-skeleton v-if="showIndicator" />
    <list-bill-table
      v-else
      @scroll="handleScroll"
      :loading="loading"
      :ListBill="orders"
      :handleChangePage="handleChangePage"
      :handleChangeLimit="handleChangeLimit"
      :totalPages="totalPages"
      :page="filter.page"
      :page_size="filter.page_size"
      :isListOrders="true"
    />
  </div>
</template>

<script>
import { message } from "ant-design-vue";

import ListBillTable from "@/components/table/table-list-bill/ListBillTable";
import ListBillTableSkeleton from "@/components/table/table-list-bill/ListBillTableSkeleton";
import warehouseService from "@/services/warehouse.service";
import orderService from "@/services/order.service";

const STEP = 5;

export default {
  components: { ListBillTable, ListBillTableSkeleton },
  data() {
    return {
      loading: false,
      filter: {
        page: 1,
        page_size: 25,
      },
      showIndicator: true,
      ListBill: [],
      total_package: 0,
      total_product: 0,
      listIds: [],
      indexGetDetail: 0,
      idsOfList: [],
    };
  },
  computed: {
    total() {
      return this.listIds.length || 1;
    },
    totalPages() {
      const page_size = this.filter.page_size || 25;
      if (this.total % page_size === 0) return this.total / page_size;
      return Math.floor(this.total / this.filter.page_size) + 1;
    },
    getTitleFromRoute() {
      const date = this.formatDateExport(this.$route.query.date);
      const shift = this.formatShiftExport(this.$route.query.shift);
      const title = `Phiên lấy ${shift} ${date}`;
      return title;
    },
    getStatusFromRoute() {
      const type = this.formatTypeOrder(this.$route.query.type);
      return `Đơn ${type}`;
    },
    orders() {
      return this.ListBill.slice(0, this.indexGetDetail + STEP);
    },
  },
  methods: {
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
    formatTypeOrder(type) {
      if (!type) return "";
      return {
        picked: "bàn giao",
        audited: "đã đối soát ck",
        returned: "đã trả",
        delivered: "hoàn thành/ tiền về",
        delivering: "đang giao",
        returning: "đang trả",
      }[type];
    },
    handleChangePage(page) {
      this.filter = { ...this.filter, page };
      this.handleChangeQueryUrl({ page });
    },
    handleChangeLimit(page_size) {
      this.filter = { ...this.filter, page_size };
      this.filter.page = 1;
      this.handleChangeQueryUrl({ page_size });
    },
    handleChangeQueryUrl(_query = {}) {
      const query = {
        ...this.filter,
        ..._query,
      };
      this.$router.push({ query });
      this.getListOrders();
    },
    onBack() {
      this.$router.go(-1);
    },
    scrollToTop() {
      if (!this.showIndicator) {
        document.querySelector(".list-bill-wrapper").scrollTo(0, 0);
      }
    },
    async getListOrders() {
      this.scrollToTop();
      this.loading = true;
      let params = {};
      let date = this.$route.query.date;
      let shift = this.$route.query.shift;
      let type = this.$route.query.type;
      params.from_date = date;
      params.to_date = date;
      params.type = "summary";
      params.sub_type = type;
      try {
        const response = await warehouseService.getMetricExportHistory(params);
        if (response.data.success) {
          if (response.data.data[type].count === 0) {
            this.listIds = [];
          } else {
            this.listIds = response.data.data[type].packages[date][shift][type];
          }
          if (this.listIds.length !== 0) {
            this.getListPackageById(0);
          } else {
            this.ListBill = [];
            this.loading = false;
          }
        }
      } catch (error) {
        console.error(error);
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau.");
        this.loading = false;
      }
      if (this.showIndicator) this.showIndicator = false;
    },
    async getListPackageById(index) {
      try {
        const response = await orderService.getAll(
          {
            packageId: this.listIds,
            page: this.filter.page,
          },
          true
        );
        if (response.data.success) {
          this.ListBill = response.data.pkgs;
          this.idsOfList = response.data.pkgs.map((p) => p.id);
          this.getOrderDetailById(index);
        }
      } catch (error) {
        console.error(error);
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau.");
      }
      this.loading = false;
    },
    getOrderDetailById(index) {
      const ids = this.idsOfList.slice(index, index + STEP);
      let arrayPromise = [];
      for (let i = 0; i < ids.length; i++) {
        arrayPromise.push(
          this.$store.dispatch("order/getOrderDetail", { id: ids[i] })
        );
      }
      Promise.all(arrayPromise);
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled >= 0.85) {
        const _indexGetDetail = this.indexGetDetail + STEP;
        this.indexGetDetail = _indexGetDetail;
        this.getOrderDetailById(_indexGetDetail);
      }
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler() {
        if (this.$route.name !== "warehouse-and-products_list-orders") {
          return;
        }
        this.indexGetDetail = 0;
        this.getListOrders();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .list-bill-wrapper {
    height: calc(100vh - 210px);
  }
}
.list-orders {
  position: relative;
  overflow-y: auto;
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: 97%;
    width: calc(100% - 30px);
    z-index: 1;
    right: 1%;
  }
  padding: 1rem;
}
</style>
