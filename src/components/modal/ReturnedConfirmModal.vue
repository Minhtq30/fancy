<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :maskClosable="!loading"
    :title="title"
    class="returned-confirm-modal"
    @cancel="handleCancel"
  >
    <div v-if="visible" class="wrapper-returned-confirm-modal">
      <div class="search-input-wrapper">
        <g-input
          placeholder="Nhập tên, SĐT, mã đơn hàng GHTK, mã đơn hàng riêng"
          :value="filter.customer_info"
          @change="handleChangeFilterCustomerInfo"
        />
        <img src="@/assets/icons/search_active.svg" />
      </div>
      <template v-if="!packages">
        <div class="wrapper-list-packages">
          <div v-if="loadingFilter" class="overlay-filter">
            <a-spin />
          </div>
          <div class="package-item flex">
            <g-skeleton-image :width="25" :height="25" />
            <div class="package-item__info ml w-100">
              <p>
                <g-skeleton-text :width="'40%'" />
              </p>
              <p>
                <g-skeleton-text :width="'50%'" />
              </p>
              <p>
                <g-skeleton-text :width="'30%'" />
              </p>
              <p><g-skeleton-text :width="'60%'" /></p>
            </div>
          </div>
          <div class="package-item flex">
            <g-skeleton-image :width="25" :height="25" />
            <div class="package-item__info ml w-100">
              <p>
                <g-skeleton-text :width="'40%'" />
              </p>
              <p>
                <g-skeleton-text :width="'50%'" />
              </p>
              <p>
                <g-skeleton-text :width="'30%'" />
              </p>
              <p><g-skeleton-text :width="'60%'" /></p>
            </div>
          </div>
        </div>
      </template>
      <div v-else-if="packages.length === 0" class="text-empty-packages">
        <div v-if="loadingFilter" class="overlay-filter">
          <a-spin />
        </div>
        <i>Không tìm thấy thấy đơn hàng</i>
      </div>
      <template v-else>
        <div
          v-if="!filter.customer_info"
          class="check-for-all flex align-items-center"
        >
          <g-checkbox
            v-if="excludeIds.length === 0 || excludeIds.length === ids.length"
            class="action-select-all"
            :checked="
              excludeIds.length === 0 && excludeIds.length !== ids.length
            "
            @click="handleClickAll"
          />
          <g-checkbox
            v-else
            class="action-select-all"
            @click="handleClickDeterminate"
            :indeterminate="true"
            :checked="true"
          />
          <span class="ml">Chọn tất cả đơn hàng</span>
        </div>
        <div class="wrapper-list-packages" @scroll="handleScroll">
          <div v-if="loadingFilter" class="overlay-filter">
            <a-spin />
          </div>
          <div v-for="p in packages" :key="p.id" class="package-item flex">
            <g-checkbox
              class="action-select-all"
              :checked="!excludeIds.includes(p.id)"
              @change="togglePackageItem(p.id)"
            />
            <div class="package-item__info ml">
              <p>
                <span class="medium-text">{{ p.alias }}</span>
              </p>
              <p>
                <span>{{ p.customer_fullname }}</span> /
                <hidden-content :first="3" :last="4" :text="p.customer_tel" />
              </p>
              <p>
                Tiền CoD: <format-price :value="p.ship_money" /> đ
                <template v-if="getProductNames(p)">
                  / SP:
                  {{ getProductNames(p) }}
                </template>
              </p>
              <p>Trạng thái: {{ ORDER_STATUS_TITLE[p.package_status_id] }}</p>
            </div>
          </div>
          <div v-if="loadingNextPage" class="package-item flex">
            <g-skeleton-image :width="25" :height="25" />
            <div class="package-item__info ml w-100">
              <p>
                <g-skeleton-text :width="'40%'" />
              </p>
              <p>
                <g-skeleton-text :width="'50%'" />
              </p>
              <p>
                <g-skeleton-text :width="'30%'" />
              </p>
              <p><g-skeleton-text :width="'60%'" /></p>
            </div>
          </div>
        </div>
      </template>
      <div class="wrapper-lists-action">
        <div
          class="flex primary-text medium-text action-item"
          :class="{
            'is-loading': loadingConfirm,
            disabled: this.pkgsReturn.length === 0 || !packages,
          }"
          @click="handleConfirm"
        >
          <div>Xác nhận trả {{ this.pkgsReturn.length }} ĐH</div>
          <g-button :loading="loadingConfirm" class="btn-confirm-returned" />
        </div>
        <div
          class="primary-text medium-text action-item"
          :class="{ 'is-loading': loadingConfirm, disabled: !packages }"
          @click="handleChat"
        >
          Chats yêu cầu
        </div>
        <div
          class="primary-text medium-text action-item"
          :class="{ 'is-loading': loadingConfirm, disabled: !packages }"
          @click="handleOpenRateModal"
        >
          Chấm sao
        </div>
      </div>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import { GInput, GButton } from "@/components/elements";
import GCheckbox from "@/components/elements/checkbox.vue";
import HiddenContent from "@/components/HiddenContent.vue";
import FormatPrice from "@/components/FormatPrice.vue";
import orderService from "@/services/order.service";
import operateService from "@/services/operate.service";
import { ORDER_STATUS_TITLE } from "@/contants";
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
import ticketService from "@/services/ticket.service";

let timeout;

export default {
  name: "ReturnedConfirmModal",
  props: ["visible", "session", "handleCancel", "openRateModal"],
  components: {
    FormatPrice,
    GCheckbox,
    HiddenContent,
    GModal,
    GInput,
    GSkeletonImage,
    GSkeletonText,
    GButton,
  },
  data() {
    return {
      excludeIds: [],
      ORDER_STATUS_TITLE,
      filter: {
        customer_info: "",
      },
      ids: [],
      packagesOfSession: {},
      loadingGetIds: true,
      page: 1,
      loadingNextPage: false,
      loadingFilter: false,
      loadingConfirm: false,
      orderById: {},
    };
  },
  methods: {
    handleChangeFilterCustomerInfo(event) {
      this.filter.customer_info = event.target.value;
    },
    getProductNames(_package) {
      let _productNames = [];

      for (const p of _package.product) {
        _productNames.push(p.product_name);
      }

      return _productNames.join(", ");
    },
    togglePackageItem(pId) {
      this.excludeIds = this.excludeIds.includes(pId)
        ? this.excludeIds.filter((id) => id !== pId)
        : this.excludeIds.concat(pId);
    },
    handleClickAll() {
      if (this.excludeIds.length === 0) {
        this.excludeIds = this.ids;
      } else {
        this.excludeIds = [];
      }
    },
    handleClickDeterminate() {
      if (this.excludeIds.length) {
        this.excludeIds = this.ids;
      }
    },
    handleOpenRateModal() {
      if (this.loadingConfirm || !this.packages) {
        return;
      }

      const session = this.session;

      this.openRateModal(
        session.cod_name,
        session.cod_phone,
        session.pick_address_name,
        session.id,
        session.alias
      );
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled >= 0.85) {
        this.handleNextPage();
      }
    },
    async handleNextPage() {
      const page = this.page + 1;

      if (this.loadingNextPage || page > this.totalPages) return;

      this.loadingNextPage = true;

      this.page = page;
      try {
        await this.getPackagesOfSession(this.session.id, page);
      } catch (error) {
        console.log(error);
      }
      this.loadingNextPage = false;
    },
    async getIds() {
      this.loadingGetIds = true;

      try {
        const response = await operateService.getSessionDetail(this.session.id);
        const ids = response?.data?.data || [];
        const pkgs = response?.data?.packages || [];

        let orderById = {};

        for (const pkg of pkgs) {
          orderById[pkg.id] = pkg.order;
        }

        this.ids = ids;
        this.orderById = orderById;
      } catch (error) {
        console.error(error);
      }

      this.loadingGetIds = false;
    },
    async getPackagesOfSession(sessionId, page = 1, isFilter = false) {
      if (isFilter) this.loadingFilter = true;

      const currentSession = this.packagesOfSession[sessionId] || {};
      const oldPackages = currentSession?.packages || [];

      this.packagesOfSession[sessionId] = {
        ...currentSession,
        loading: true,
      };

      let packages = [...oldPackages];

      try {
        const packageId = this.ids;
        const response = await orderService.getAll({
          packageId,
          limit: 25,
          customer_info: this.filter.customer_info || undefined,
          is_full: true,
          page,
        });
        const pkgs = response?.data?.pkgs || [];
        if (isFilter) {
          packages = pkgs;
        } else {
          packages = [...packages, ...pkgs];
        }
      } catch (error) {
        console.error(error);
      }

      this.packagesOfSession[sessionId] = {
        ...currentSession,
        packages,
        loading: false,
      };

      if (isFilter) this.loadingFilter = false;
    },
    async handleConfirm() {
      if (this.loadingConfirm || this.pkgsReturn.length === 0) {
        return;
      }

      this.loadingConfirm = true;

      try {
        const pkgIds =
          this.pkgsReturn.length === this.ids.length ? [] : this.pkgsReturn;

        // Xu ly khi xac nhan tra 1 hoac vai don hang
        if (this.pkgsReturn.length < this.ids.length) {
          const response = await orderService.returnedConfirm(
            pkgIds.map((id) => this.orderById[id])
          );
          if (response.data.success) {
            this.handleCancel();
            this.$message.success(response.data.message);
          } else {
            this.$message.error(
              response.data.message ||
                "Oops! Something went wrong when call api."
            );
          }
          this.loadingConfirm = false;
          return;
        }

        // Xu ly khi xac nhan tra tat ca don hang trong phien
        const response = await ticketService.returnedConfirm(
          this.session.id,
          pkgIds.map((id) => this.orderById[id])
        );
        if (response.data.success) {
          this.handleCancel();
          this.$message.success(response.data.message);
        } else {
          this.$message.error(
            response.data.message || "Oops! Something went wrong when call api."
          );
        }
      } catch (error) {
        this.$message.error("Oops! Something went wrong when call api.");
      }

      this.loadingConfirm = false;
    },
    handleChat() {
      if (this.loadingConfirm || !this.packages) {
        return;
      }
      this.$router.push("/chat");
      // TODO send message event
    },
  },
  computed: {
    packages() {
      if (!this.packagesOfSession[this.session.id]?.packages) return null;
      return this.packagesOfSession[this.session.id]?.packages;
    },
    totalPages() {
      const total = this.ids.length;
      const limit = 25;

      if (total % limit === 0) return total / limit;

      return Math.floor(total / limit) + 1;
    },
    pkgsReturn() {
      return this.ids.filter((id) => !this.excludeIds.includes(id));
    },
  },
  watch: {
    loadingGetIds(_loadingGetIds) {
      if (!_loadingGetIds) {
        this.getPackagesOfSession(this.session.id);
      }
    },
    "filter.customer_info"() {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.getPackagesOfSession(this.session.id, 1, true);
      }, 800);
    },
    visible(_visible) {
      if (!_visible) {
        this.page = 1;
        this.excludeIds = [];
        this.filter.customer_info = "";
        this.packagesOfSession[this.session.id] = {};
        clearTimeout(timeout);
      } else {
        if (this.session.id) {
          this.getIds();
        }
      }
    },
  },
};
</script>

<style lang="scss">
.returned-confirm-modal {
  .ant-modal-body {
    padding-bottom: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.wrapper-returned-confirm-modal {
  color: #000;
  font-size: 16px;
  position: relative;
  .search-input-wrapper {
    position: relative;
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
  .check-for-all {
    padding: 1rem 0;
    border-bottom: 1px solid var(--grayColor);
  }
  .wrapper-list-packages,
  .text-empty-packages {
    .overlay-filter {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      top: 0;
      background-color: #ffffff80;
      z-index: 1;
    }
  }
  .wrapper-list-packages {
    max-height: 60vh;
    overflow-y: auto;
    .package-item {
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 1rem;
      margin-top: 0.875rem;
      &:last-child {
        padding-bottom: 0.875rem;
        border-bottom: 0;
      }
      &__info {
        p {
          line-height: 20px;
          margin-bottom: 0.5rem;
          &:first-child {
            line-height: 25px;
          }
        }
      }
    }
  }
  .text-empty-packages {
    color: #808080;
    text-align: center;
    margin: 2.75rem 0;
    position: relative;
  }
  .wrapper-lists-action {
    width: calc(100% + 2rem);
    transform: translateX(-1rem);
    .action-item {
      cursor: pointer;
      padding: 0.75rem 1rem;
      border-top: 1px solid var(--grayColor);
      .btn-confirm-returned {
        border: 0;
        height: 20px;
      }
      &.is-loading,
      &.disabled {
        opacity: 0.65;
      }
    }
  }
}
</style>
