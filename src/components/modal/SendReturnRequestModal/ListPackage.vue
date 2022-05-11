<template>
  <div class="return-request-detail_list-package-to-action">
    <div>
      <div v-if="!packages">
        <div class="wrapper-list-packages">
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
      </div>
      <template v-else-if="packages.length">
        <span class="description-pick">
          Vui lòng chọn ĐH trong phiên để gửi yêu cầu
        </span>
        <div class="wrapper-list-packages" @scroll="handleScroll">
          <div v-for="p in packages" :key="p.id" class="package-item flex">
            <g-checkbox
              class="action-select-all"
              :checked="includeIds.includes(p.id)"
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
      <div v-else class="text-empty-packages">
        <i>Không tìm thấy thấy đơn hàng</i>
      </div>
      <g-button :loading="loading" class="primary w-100" @click="handleSubmit">
        Xác nhận
      </g-button>
    </div>
  </div>
</template>

<script>
import GButton from "@/components/elements/button.vue";
import GCheckbox from "@/components/elements/checkbox.vue";
import HiddenContent from "@/components/HiddenContent.vue";
import FormatPrice from "@/components/FormatPrice.vue";
import { ORDER_STATUS_TITLE } from "@/contants";
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
import ticketService from "@/services/ticket.service";

const TYPE_REQUEST = {
  report_lost_package: 29,
  report_delay: 24,
  report_wrong_info: 23,
  report_employee: 31,
  report_break: 28,
  report_receive_yet: 30,
};

const CONTENT_REQUEST = {
  report_lost_package: "Khiếu nại hàng thất lạc",
  report_delay: "Khiếu nại cập nhật sai lý do Delay",
  report_wrong_info: "Khiếu nại cập nhật sai trạng thái ĐH",
  report_employee: "Khiếu nại thái độ nhân viên GHTK",
  report_break: "Khiếu nại hàng hỏng, vỡ",
  report_receive_yet: "Khiếu nại chưa nhận được hàng",
};

export default {
  name: "ListPackageToAction",
  props: [
    "session",
    "packages",
    "requestKey",
    "handleNextPage",
    "loadingNextPage",
    "loading",
    "setLoading",
    "handleCancel",
    "ids",
  ],
  components: {
    GCheckbox,
    GButton,
    HiddenContent,
    FormatPrice,
    GSkeletonImage,
    GSkeletonText,
  },
  data() {
    return {
      ORDER_STATUS_TITLE,
      includeIds: [],
    };
  },
  methods: {
    getProductNames(_package) {
      let _productNames = [];

      for (const p of _package.product) {
        _productNames.push(p.product_name);
      }

      return _productNames.join(", ");
    },
    togglePackageItem(pId) {
      this.includeIds = this.includeIds.includes(pId)
        ? this.includeIds.filter((id) => id !== pId)
        : this.includeIds.concat(pId);
    },
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled >= 0.85) {
        this.handleNextPage();
      }
    },
    async handleSubmit() {
      this.setLoading(true);
      const type = TYPE_REQUEST[this.requestKey];
      const packages = this.includeIds;
      try {
        const response = await ticketService.sendTicketSession(
          this.session.id,
          type,
          {
            content: CONTENT_REQUEST[this.requestKey],
          },
          packages
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
        console.error(error);
        this.$message.error("Oops! Something went wrong when call api.");
      }
      this.setLoading(false);
    },
  },
  watch: {
    requestKey() {
      this.includeIds = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.return-request-detail_list-package-to-action {
  .text-empty-packages {
    color: #808080;
    text-align: center;
    margin: 2rem 0 2.75rem 0;
  }
  .description-pick {
    display: block;
    margin-bottom: 0.875rem;
  }
  .wrapper-list-packages {
    max-height: 60vh;
    overflow-y: auto;
    margin-bottom: 0.875rem;
    .package-item {
      margin-top: 0.875rem;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 1rem;
      &:first-child {
        margin-top: 1px;
      }
      &:last-child {
        padding-bottom: 0;
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
}
</style>
