<template>
  <div
    class="item"
    :class="{
      'is-selected': tabActive === 'finance',
    }"
  >
    <div class="item-title flex" @click="handleToggle()">
      <h2 class="tile-text-collap">QL dòng tiền</h2>
      <h2 class="tile-text">Quản lý dòng tiền</h2>
      <img
        class="sub-menu-arrow-icon"
        src="@/assets/icons/arrow_right_menu_right.svg"
      />
    </div>
    <div v-if="tabActive === 'finance'" class="submenu-wrapper">
      <div class="block-submenu">
        <div class="block-submenu__body no-header">
          <div
            class="submenu-item"
            :class="{ 'is-active': true }"
            style="margin: 0; padding: 10px 15px"
          >
            <div class="submenu-item__left">
              <p class="mb-0" style="color: #000 !important">
                Phiên đối soát sắp tới
              </p>
              <div class="flex align-items-center">
                <live-signal class="t-mt-1" />
                <span class="ml t-text-black t-text-xs t-mt-1">
                  Live (Cập nhật {{ currentTime }})
                </span>
              </div>
            </div>
            <!-- <div class="submenu-item__right">
              <img
                class="ml"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div> -->
          </div>
          <div class="detail-submenu">
            <div
              v-for="type in nextAuditTypes"
              :key="type.key"
              class="detail-submenu__item"
              :class="{
                'important-item': type.isBold,
                pointer: nextAuditData[type.key] && type.key !== 'transfer_fee',
              }"
              @click="handleChangeRouteDetail(type.key)"
            >
              <div
                class="detail-info"
                :class="{ 'primary-text': nextAuditTypeSelected === type.key }"
              >
                <span class="t-flex-1">{{ type.title }}</span>
                <div
                  class="detail-submenu__item__right flex align-items-center"
                >
                  <vue3-autocounter
                    :startAmount="lastAuditData[type.key] || 0"
                    :endAmount="nextAuditData[type.key] || 0"
                    :suffix="' đ'"
                    :duration="1"
                  />
                  <img
                    :style="{
                      opacity:
                        type.key === 'transfer_fee' || !nextAuditData[type.key]
                          ? 0
                          : 1,
                    }"
                    class="ml"
                    src="@/assets/icons/detail_submenu.svg"
                  />
                </div>
              </div>
              <div class="description-info" v-if="type.des">
                {{ type.des }}
              </div>
            </div>
          </div>
          <!-- <div
            class="submenu-item no-rotate-imge"
            :class="{ 'is-active': subMenuActive === 3 }"
            @click="handleChangeRoute('/hoa-don-vat', 3)"
            style="padding: 10px 15px; margin: 0"
          >
            <span class="submenu-item__left">Quản lý hóa đơn VAT</span>
            <div class="submenu-item__right">
              <img
                class="ml"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div>
          </div>
          <div
            class="submenu-item no-rotate-imge"
            :class="{ 'is-active': subMenuActive === 2 }"
            @click="handleChangeRoute('/lich-su-doi-soat', 2)"
            style="padding: 10px 15px; margin: 0"
          >
            <span class="submenu-item__left">Lịch sử đối soát</span>
            <div class="submenu-item__right">
              <img
                class="ml"
                src="@/assets/icons/menu_right_submenu_right.svg"
              />
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LiveSignal } from "@/components";
import { mapState } from "vuex";
import Vue3Autocounter from "vue3-autocounter";
import { FINANCE_NEXT_AUDIT } from "@/contants";

export default {
  name: "OperateMenu",
  props: ["tabActive", "handleToggle", "isCollapsed"],
  components: {
    LiveSignal,
    Vue3Autocounter,
  },
  data() {
    return {
      nextAuditTypeSelected: "",
      nextAuditTypes: FINANCE_NEXT_AUDIT,
    };
  },
  computed: {
    ...mapState({
      currentTime: (state) => state.realtimeReport.currentTime,
      lastAuditData: (state) => state.finance.lastAuditData || {},
      nextAuditData: (state) => state.finance.nextAuditData,
      loading: (state) => state.realtimeReport.loading,
    }),
  },
  methods: {
    handleChangeRoute(route) {
      this.$router.push(`/dong-tien${route}`);
    },
    getNextAuditData() {
      this.$store.dispatch("finance/getNextAuditData", { type: "all" });
    },
    handleChangeRouteDetail(type) {
      if (!this.nextAuditData[type] || type === "transfer_fee") return;
      this.nextAuditTypeSelected = type;
      this.$router.push(`/dong-tien/chi-tiet-doi-soat?type=${type}`);
    },
  },
  watch: {
    currentTime() {
      this.getNextAuditData();
    },
    tabActive(_tabActive) {
      if (_tabActive === "finance") {
        this.getNextAuditData();
      }
    },
    "$route.path": {
      immediate: true,
      handler(path) {
        if (path === "/dong-tien/lich-su-doi-soat") {
          this.nextAuditTypeSelected = "";
        } else if (path === "/dong-tien/hoa-don-vat") {
          this.nextAuditTypeSelected = "";
        } else if (path === "/dong-tien/doi-soat") {
          this.nextAuditTypeSelected = "";
        } else if (path === "/dong-tien/chi-tiet-doi-soat") {
          this.nextAuditTypeSelected = this.$route.query.type;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./submenu.scss";
.submenu-item {
  align-items: flex-start !important;
  border-bottom: 1px solid var(--grayColor);
  &.is-active {
    font-size: unset !important;
    position: sticky;
    top: 0;
    z-index: 1;
    p {
      font-weight: 500;
    }
    &:not(.no-rotate-imge) {
      .submenu-item__right {
        img {
          transform: rotate(90deg) !important;
        }
      }
    }
  }
  .submenu-item__right {
    img {
      transition: 0.15s linear;
    }
  }
}
.detail-submenu {
  overflow-y: auto;
  &__item {
    padding: 10px 0;
    position: relative;
    margin: 0 10px 0 15px;
    &:not(:last-child) {
      &::after {
        width: calc(100%);
        height: 1px;
        background-color: var(--grayColor);
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
      }
    }

    .detail-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &.important-item {
      flex-direction: column;
      align-items: flex-start;
      .detail-info {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        font-weight: 500;
      }
      .description-info {
        font-size: 14px;
        margin-top: 5px;
      }
    }
    &__right {
      img {
        transition: 0.15s linear;
      }
    }
  }
}
</style>
