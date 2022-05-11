<template>
  <div id="operate-page">
    <div class="page-header">
      <div class="flex align-items-center" style="white-space: break-spaces">
        <header-title @onBack="onBack" :title="title" />
        <div v-if="session?.type && session?.alias">
          <span>
            {{ session.type === "1" ? " / LẤY" : " / TRẢ" }} |
            {{ session.alias }}</span
          >
        </div>
      </div>
      <div class="filter-wrapper flex">
        <div class="search-input-wrapper">
          <g-input
            placeholder="Nhập tên, SĐT, mã đơn hàng GHTK, mã đơn hàng riêng"
            :value="customer_info"
            @change="handleChangeCustomerInfo"
            @keyup.enter="handleFilter"
          />
          <img src="@/assets/icons/search_active.svg" />
        </div>
        <g-button class="primary ml-1" @click="handleFilter">
          Tìm kiếm
        </g-button>
      </div>
    </div>
    <div class="page-content" @scroll="handleScroll">
      <div class="overlay" v-if="loadingGetData">
        <a-spin />
      </div>
      <order-table-skeleton v-if="!packages" />
      <order-table
        v-else
        :loading="loadingGetData"
        :page="page"
        :totalPages="totalPages"
        :limit="limit"
        :handleChangePage="handleChangePage"
        :handleChangeLimit="handleChangeLimit"
        :orders="orders"
        :packagesInPage="packagesInPage"
        :requestOptions="requestOptions"
      />
    </div>
  </div>
</template>

<script>
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import { GButton, GInput } from "@/components/elements";
import OrderTable from "@/components/table/order-table/OrderTable.vue";
import OrderTableSkeleton from "@/components/table/order-table/OrderTableSkeleton.vue";
import { OPERATE_TYPE } from "@/contants";
import { OPERATE_TYPE_C2C } from "@/contants/operate";
import orderService from "@/services/order.service";
import operateService from "@/services/operate.service";

const STEP = 5;
const typeHasSession = [
  "incurredReportData.incurred",
  "delayNotPickReportData.delay_not_pick",
  "waitingToReturnReportData.waiting_to_return",
  "returningReportData.returning",
  "returnedReportData.returned",

  "c2c._incurredReportData.incurred",
  "c2c._delayNotPickReportData.delay_not_pick",
  "c2c.delayReportData.delay_wait_shop_cf",
  "c2c.returningReportData.returning",
  "c2c.returnedReportData.returned",
];

export const objectRequestOptions = {
  giuc_giao: {
    key: "giuc_giao",
    label: "Giục giao",
    feedback_type_id: 17,
    default_message: "SHOP GIỤC GIAO",
  },
  giuc_tra: {
    key: "giuc_tra",
    label: "Giục trả",
    feedback_type_id: 18,
    default_message: "SHOP GIỤC TRẢ",
  },
  huy_don: {
    key: "huy_don",
    label: "Hủy đơn",
    feedback_type_id: 10,
    default_message: "SHOP BÁO HỦY ĐƠN",
  },
  giao_lai: {
    key: "giao_lai", // Giao lại không thay đổi địa chỉ
    label: "Giao lại",
    feedback_type_id: 254,
    default_message: "SHOP GIỤC GIAO LẠI",
  },
  tra_shop: {
    key: "tra_shop",
    label: "Trả shop",
    feedback_type_id: 255,
    default_message: "SHOP BÁO TRẢ SHOP",
  },
  giuc_chuyen_tien_cod: {
    key: "giuc_chuyen_tien_cod",
    label: "Giục chuyển tiền COD",
    feedback_type_id: 19,
    default_message: "SHOP GIỤC CHUYỂN TIỀN COD",
  },
};

export default {
  components: {
    GButton,
    OrderTable,
    HeaderTitle,
    GInput,
    OrderTableSkeleton,
  },
  data() {
    return {
      customer_info: "",
      isLoadingGetDetail: false,
      limit: 25,
      page: 1,
      indexGetDetail: 0,
      loadingGetData: false,
      packages: null,
      total: 0,
      session: null,
      isLoadingGetSessionDetail: false,
      idsOfSession: [],
      type: "",
    };
  },
  computed: {
    isC2C() {
      return this.type.includes("c2c.");
    },
    typeOperate() {
      return this.isC2C ? OPERATE_TYPE_C2C : OPERATE_TYPE;
    },
    isLoadingGetId() {
      return (
        this.$store.state.operate.loadingGetIds[this.$route.query.type] ||
        this.isLoadingGetSessionDetail
      );
    },
    detailById() {
      return this.$store.state.order.detailById || {};
    },
    title() {
      let _title = "";

      for (let type of this.typeOperate) {
        if (type.key === this.$route.query.type) {
          _title = type.title;
          break;
        }
      }
      return _title;
    },
    pIds() {
      return (this.packages || []).map((p) => p.id);
    },
    ids() {
      if (this.$route.query.session_id) return this.idsOfSession;
      return this.$store.getters["operate/getIdsByKey"](this.$route.query.type);
    },
    totalPages() {
      const total = this.total;
      const limit = this.limit;

      if (total % limit === 0) return total / limit;

      return Math.floor(total / this.limit) + 1;
    },
    orders() {
      return (this.packages || []).slice(0, this.indexGetDetail + STEP);
    },
    packagesInPage() {
      return (this.packages || []).map((p) => ({
        id: p.id,
        order: p.order,
        alias: p.alias,
      }));
    },
    requestOptions() {
      const type = this.$route.query.type;
      let _keys = [];

      if (type === "waitTransferReportData.wait_transfer") {
        _keys = ["giuc_giao", "huy_don", "tra_shop"];
      } else if (type === "deliveringReportData.done") {
        _keys = ["giuc_chuyen_tien_cod"];
      } else if (
        [
          "delayReportData.delay_not_contact",
          "delayReportData.delay_customer_refused",
          "delayReportData.delay_wrong_info",
          "delayReportData.delay_customer_change_date",
          "delayReportData.delay_other_reason_v2",
        ].includes(type)
      ) {
        _keys = ["giuc_giao", "huy_don", "tra_shop"];
      } else if (
        [
          "cancelByShopReportData.cancel_by_shop",
          "cancelCouldNotContactOrRefuseReportData.cancel_could_not_contact_refuse",

          "notDeliverDoneAndWaitForApprovalReportData.not_deliver_wait_for_approval",
        ].includes(type)
      ) {
        _keys = ["giuc_tra", "giao_lai", "tra_shop"];
      }

      let _options = [];

      for (const k of _keys) {
        _options.push(objectRequestOptions[k]);
      }

      return _options;
    },
  },
  methods: {
    onBack() {
      const type = this.$route.query.type;
      if (typeHasSession.includes(type)) {
        this.$router.push(`/danh-sach-phien?type=${type}`);
      } else {
        this.$router.push(`/don-hang`);
      }
    },
    handleChangeCustomerInfo(event) {
      this.customer_info = event.target.value;
    },
    async getFilterData() {
      if (this.ids.length === 0) {
        this.packages = [];
        this.total = 0;
        return;
      }

      this.loadingGetData = true;
      const query = this.$route.query;

      try {
        const response = await orderService.getAll({
          customer_info: query.customer_info,
          page: query.page || 1,
          limit: query.limit || 25,
          packageId: this.ids,
        });
        this.packages = response?.data?.pkgs || [];
        this.total = response?.data?.count || 0;
        if (!response?.data?.success) {
          this.$message.error(
            "Lấy danh sách đơn hàng thất bại, vui lòng thử lại sau"
          );
        }
      } catch (error) {
        console.error(error);
      }

      this.loadingGetData = false;
    },
    handleFilter() {
      this.handleChangeQueryUrl({
        customer_info: this.customer_info,
      });
    },
    handleChangeQueryUrl(_query = {}) {
      const query = {
        ...this.$route.query,
        ..._query,
        time: new Date().getTime(),
      };

      this.$router.push({ query });
    },
    handleChangePage(page) {
      this.page = page;
      this.handleChangeQueryUrl({ page });
    },
    handleChangeLimit(limit) {
      this.limit = limit;
      this.handleChangeQueryUrl({ limit });
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled >= 0.85) {
        const _indexGetDetail = this.indexGetDetail + STEP;
        this.indexGetDetail = _indexGetDetail;
        this.getDetail(_indexGetDetail);
      }
    },
    scrollToTop() {
      const contentScrollable = document.querySelector(".page-content");
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
      }
    },
    async getDetail(_index) {
      try {
        const ids = this.pIds.slice(0, _index + STEP);
        let arrayPromise = [];

        for (const id of ids) {
          if (!this.detailById[id]?.loaded_detail_success) {
            arrayPromise.push(
              this.$store.dispatch("order/getOrderDetail", { id })
            );
          }
        }

        await Promise.all(arrayPromise);
      } catch (error) {
        console.log(error);
      }
    },
    async getSessionDetail(session_id) {
      this.isLoadingGetSessionDetail = true;

      try {
        const response = await operateService.getSessionDetail(session_id);
        this.idsOfSession = response?.data?.data;
      } catch (error) {
        console.error(error);
      }

      this.isLoadingGetSessionDetail = false;
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.path !== "/quan-ly-van-hanh") {
          return;
        }

        this.type = _query.type;

        if (!this.$route.path.includes("/quan-ly-van-hanh")) return;
        if (!_query.type) {
          this.$router.push("/don-hang");
        } else {
          if (typeHasSession.includes(_query.type)) {
            const { session_id, session_type, session_alias } = _query;

            if (session_id && session_type && session_alias) {
              this.getSessionDetail(session_id);
              this.session = {
                id: session_id,
                alias: session_alias,
                type: session_type,
              };
            } else {
              this.$router.push("/don-hang");
            }
          } else {
            this.session = null;
          }

          this.$store.dispatch("operate/getIdsRealtimeReport", {
            key: _query.type,
            isB2C: _query.type.includes("c2c") ? false : true,
          });

          this.scrollToTop();
          this.indexGetDetail = 0;
          this.customer_info = _query.customer_info;
          this.limit = _query.limit ? Number(_query.limit) : 25;
          this.page = _query.page ? Number(_query.page) : 1;
          if (!this.isLoadingGetId) {
            this.getFilterData();
          }
        }
      },
    },
    pIds() {
      this.getDetail(0);
    },
    isLoadingGetId() {
      if (!this.isLoadingGetId) {
        this.getFilterData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#operate-page {
  position: relative;
  // padding: 15px 15px 0 15px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  .page-header {
    padding: 15px 15px 0 15px;
    &__title {
      position: relative;
      display: flex;
      img.back-icon {
        transform: translateY(-1px);
        height: 20px;
      }
      h2 {
        color: var(--primaryColor);
        cursor: pointer;
        &.page-header__title__value {
          color: #000;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    .filter-wrapper {
      margin-top: 15px;
      .search-input-wrapper {
        position: relative;
        flex: 1;
        .g-input {
          height: 32px;
          padding-left: 40px;
          box-shadow: none;
        }
        img {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      button {
        width: 180px;
        align-items: center;
      }
    }
  }
  .page-content {
    margin: 15px 15px 0 15px;
    overflow: auto;
    height: calc((100% - 75px) - 83px) !important;
    .indicator {
      &.full-height {
        height: calc((100% - 75px) - 83px) !important;
      }
      position: absolute;
      width: calc(100% - 30px);
      background-color: #ffffff80;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 47px;
      border-left: 1px solid var(--grayColor);
      border-right: 1px solid var(--grayColor);
      border-bottom: 1px solid var(--grayColor);
    }
    .overlay {
      position: absolute;
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.5);
      justify-content: space-around;
      height: calc((100% - 75px) - 27px);
      width: calc(100% - 30px);
      z-index: 1;
    }
  }
}
</style>
