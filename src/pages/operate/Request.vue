<template>
  <div id="request-page">
    <div class="page-header flex t-items-center">
      <header-title @onBack="onBack" :title="title" />
    </div>
    <div class="filter-wrapper flex t-items-center">
      <span class="mr-1">Đang có {{ total }} yêu cầu</span>
      <g-select
        v-model:selected-item="selectedType"
        optionAlign="center"
        inputJustify="center"
        style="flex: 0 1 216px"
        :show-search="false"
        :data-source="options"
        @on-selection-change="handleChangeType"
      />
    </div>
    <div class="page-content">
      <table-c-2-c-request-skeleton v-if="!dataSource" />
      <template v-else>
        <div v-if="loading" class="overlay">
          <a-spin />
        </div>
        <table-c-2-c-request
          :dataSource="dataSource"
          :type="selectedType.value"
        />
      </template>
      <div v-if="totalPages" class="pagination-wrapper">
        Trang {{ page }}/{{ totalPages }}
        <g-button
          :disabled="loading || page === 1"
          class="ml"
          @click="handleChangePage(page - 1)"
        >
          Trang trước
        </g-button>
        <g-button
          :disabled="loading || page === totalPages"
          class="ml"
          @click="handleChangePage(page + 1)"
        >
          Trang sau
        </g-button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import { GSelect } from "@/components";
import {
  TableC2CRequest,
  TableC2CRequestSkeleton,
} from "@/components/table/table-c2c-request";
import { GButton } from "@/components/elements";
import ticketService from "@/services/ticket.service";

export default {
  components: {
    HeaderTitle,
    GSelect,
    TableC2CRequest,
    TableC2CRequestSkeleton,
    GButton,
  },
  data() {
    return {
      title: "Yêu cầu",
      selectedType: {
        label: "Chưa xử lý",
        value: 0,
      },
      options: [
        {
          label: "Chưa xử lý",
          value: 0,
        },
        {
          label: "Đã xử lý",
          value: 1,
        },
      ],
      dataSource: null,
      page: 1,
      total: 0,
      loading: false,
    };
  },
  computed: {
    totalPages() {
      if (!this.total) return 0;

      const limit = 10;

      if (this.total % limit === 0) return this.total / limit;

      return Math.floor(this.total / limit) + 1;
    },
  },
  methods: {
    onBack() {
      this.$router.push("/don-hang");
    },
    handleChangeType(_type) {
      this.selectedType = _type;
      this.handleChangeQueryUrl();
    },
    handleChangePage(_page) {
      this.page = _page;
      this.handleChangeQueryUrl();
    },
    handleChangeQueryUrl() {
      const query = { type: this.selectedType.value, page: this.page };

      this.$router.push({ query });
    },
    scrollToTop() {
      const contentScrollable = document.querySelector(".page-content");
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
      }
    },
    async getData(page = 1) {
      let dataSource = [];
      let total = 0;
      let errorMessage = "";

      this.loading = true;
      try {
        const response = await ticketService.getListTickets({
          type: this.selectedType.value,
          page,
        });

        if (!response?.data?.success) {
          errorMessage =
            response?.data?.message || "Oops! Something went when call api.";
        }
        dataSource = response?.data?.data || [];
        total = response?.data?.count || 0;
      } catch (error) {
        console.log(error);
        errorMessage =
          error?.response?.data?.message ||
          "Oops! Something went when call api.";
      }

      if (errorMessage) {
        this.$message.error(errorMessage);
      }

      this.dataSource = dataSource;
      this.total = total;
      this.loading = false;
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.path !== "/yeu-cau-chua-thuc-hien") {
          return;
        }
        this.scrollToTop();
        this.page = Number(_query.page) || 1;
        this.getData(_query.page);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
#request-page {
  position: relative;
  height: calc(100vh - 64px);
  overflow-y: auto;
  .page-header {
    height: 64px;
    padding: 0 15px;
  }
  .filter-wrapper {
    padding: 0 15px;
  }
  .page-content {
    padding: 0 15px;
    margin-top: 1rem;
    height: calc(100vh - 64px - 64px - 32px - 1rem);
    position: relative;
    .overlay {
      position: absolute;
      width: calc(100% - 30px);
      height: calc(100vh - 64px - 64px - 32px - 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.65);
      z-index: 2;
    }
    .pagination-wrapper {
      height: 60px;
      display: flex;
      align-items: center;
      border: 1px solid var(--grayColor);
      padding: 0 1rem;
      position: absolute;
      bottom: 0;
      left: 15px;
      right: 15px;
    }
  }
}
</style>
