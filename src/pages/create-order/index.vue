<template>
  <div class="create-order-header">
    <span class="create-order-title">Tạo đơn hàng</span>
    <span
      :class="{
        'create-order-item': true,
        'item-active': activeKey === 'create-order-one',
      }"
      @click="handleChangeRouter('don-le')"
    >
      <span> Đăng đơn lẻ </span>
    </span>
    <span
      :class="{
        'create-order-item': true,
        'item-active': activeKey === 'create-order-excel',
      }"
      @click="handleChangeRouter('don-excel')"
    >
      <span> Đăng đơn Excel </span>
    </span>
    <span
      :class="{
        'create-order-item': true,
        'create-order-item-none': false,
        'item-active': activeKey === 'create-order-draft',
      }"
      @click="handleChangeRouter('don-nhap')"
    >
      <span>
        Nháp
        <span>
          <vue3-autocounter
            :startAmount="numberOrderDraft > 100 ? numberOrderDraft - 100 : 0"
            :endAmount="numberOrderDraft"
            :duration="1"
          />
        </span>
      </span>
    </span>
    <span
      v-if="true"
      :class="{
        'create-order-item-none': true,
        'item-active': activeKey === 'create-order-created',
      }"
      @click="handleChangeRouter('don-da-tao')"
    >
      <span>
        Đã tạo
        <span>
          <vue3-autocounter
            :startAmount="
              numberOrderCreated > 100 ? numberOrderCreated - 100 : 0
            "
            :endAmount="numberOrderCreated"
            :duration="1"
          />
        </span>
      </span>
    </span>
  </div>
  <router-view></router-view>
</template>

<script>
import { get } from "lodash";
import Vue3Autocounter from "vue3-autocounter";

// Service
import services from "@/services";

export default {
  name: "CreateOrder",
  components: {
    Vue3Autocounter,
  },
  computed: {
    activeKey() {
      return this.$route.name;
    },
    numberOrderDraft() {
      return get(this.$store.state.orderDraft, "totalOrder", 0);
    },
    numberOrderCreated() {
      return get(this.$store.state.orderCreated, "totalOrder", 0);
    },
  },
  async mounted() {
    // await this.handleUpdateOrderDraft();
    // await this.handleUpdateOrderCreated();
  },
  methods: {
    handleChangeRouter(path) {
      this.$router.push(`/tao-don-hang/${path}`);
    },

    getSecondTime(timer = new Date()) {
      return parseInt(`${timer.getTime() / 1000}}`) + 1;
    },

    async handleUpdateOrderDraft() {
      const response = await services.$package.getDraftPackage({
        useNewPackage: true,
        useNewApi: true,
        isEcom: false,
        page: 0,
        size: 1,
        shopCode: localStorage.getItem("shop_code"),
      });

      if (response.success) {
        const approxResultsCount = response?.data?.approxResultsCount || 0;
        // Cập nhật tổng.
        this.$store.commit("orderDraft/updateTotal", approxResultsCount);
      }
    },

    async handleUpdateOrderCreated() {
      const response = await services.$package.getDraftPackage({
        useNewPackage: true,
        useNewApi: true,
        isEcom: true,
        page: 0,
        size: 1,
        isCancel: 0,
        minDraftCreated: this.getSecondTime() - 2 * 7 * 24 * 60 * 60, // 2 Tuần.
        maxDraftCreated: this.getSecondTime(),
        packageStatusIds: [1, 2, 8, 12],
        shopCode: localStorage.getItem("shop_code"),
      });

      if (response.success) {
        const approxResultsCount = response?.data?.approxResultsCount || 0;
        // Cập nhật tổng.
        this.$store.commit("orderCreated/updateTotal", approxResultsCount);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.create-order-header {
  height: 30px;
  display: flex;
  align-content: center;
  line-height: 30px;
  margin-bottom: 10px;
}
.create-order-title {
  font-weight: 500;
  font-size: 1.625rem;
  border-right: 2px solid #e0e0e0;
  padding-right: 30px;
  color: black;
}
.create-order-item {
  font-weight: 500;
  font-size: 1.125rem;
  border-right: 2px solid #e0e0e0;
  padding: 0 10px;
  color: rgba(189, 189, 189, 1);
  cursor: pointer;

  > span {
    padding: 0 6px;
  }
}

.create-order-item-none {
  font-weight: 500;
  font-size: 1.125rem;
  padding: 0 10px;
  color: rgba(189, 189, 189, 1);
  cursor: pointer;

  > span {
    padding: 0 6px;
  }
}

.item-active {
  color: var(--primaryColor);
  > span {
    border-bottom: 2px solid var(--primaryColor);
    padding-bottom: 3px;
  }
}
</style>
