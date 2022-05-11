<template>
  <div class="menu-right">
    <div class="shop-info-wrapper flex">
      <div
        v-for="(product, pIndex) of productsDisplay"
        :key="pIndex"
        class="wallpaper t-flex-1"
        :style="{ backgroundImage: `url(${product.image || ''})` }"
      >
        <image-preload class="default" />
      </div>
    </div>
    <div class="shop-info-detail mt">
      <div
        class="shop-info-detail__left"
        :style="{ backgroundImage: `url(${shopInfo?.avatar})` }"
      >
        <template v-if="isAdmin">
          <div v-if="uploading" class="overlay-uploading">
            <a-spin style="height: 20px" />
          </div>
          <div v-else class="overlay-camera-icon" @click="handleClickInput">
            <a-tooltip placement="right" title="Click để đổi ảnh đại diện">
              <camera-shop-info-icon class="pointer" />
            </a-tooltip>
          </div>
        </template>
      </div>
      <div class="shop-info-detail__right">
        <div class="medium-text shop-name">
          <a-tooltip
            placement="topLeft"
            :title="`${shopInfo?.code} / ${shopInfo?.name}`"
          >
            {{ shopInfo?.code }} / {{ shopInfo?.name }}
          </a-tooltip>
        </div>
        <template v-if="!achievements">
          <div class="shop-achievement flex t-items-center">
            <g-skeleton-image
              class="mr circle"
              :active="true"
              :width="20"
              :height="20"
            />
            <g-skeleton-image
              class="mr circle"
              :active="true"
              :width="20"
              :height="20"
            />
            <g-skeleton-image
              class="mr circle"
              :active="true"
              :width="20"
              :height="20"
            />
          </div>
        </template>
        <template v-else>
          <div
            v-if="achievements.length"
            class="shop-achievement flex t-items-center"
          >
            <div
              v-for="achievement in achievements"
              :key="achievement.type"
              class="pointer mr"
            >
              <a-tooltip :title="achievement.title">
                <reputation-icon v-if="achievement.type === 'REPUTATION'" />
                <charming-icon v-if="achievement.type === 'CHARMING'" />
                <friendly-icon v-if="achievement.type === 'FRIENDLY'" />
                <growing-icon v-if="achievement.type === 'GROWING'" />
                <pro-icon v-if="achievement.type === 'PRO'" />
                <s-pro-icon v-if="achievement.type === 'SPRO'" />
                <heart-icon v-if="achievement.type === 'DEVOTED'" />
              </a-tooltip>
            </div>
          </div>
        </template>
        <div
          v-if="shopInfo?.chat_infos?.share_link"
          class="shop-link flex t-items-center"
        >
          <span class="mr">{{ shopInfo.chat_infos.share_link }}</span>
          <span class="pointer" @click="handleCopyShopLink">
            <copy-shop-info-icon />
          </span>
        </div>
        <div
          v-if="isAdmin && shopInfo?.token"
          class="shop-token flex t-items-center"
        >
          <span class="mr">API Token Key: {{ shopInfo.token }}</span>
          <span class="pointer" @click="handleCopyShopToken">
            <copy-shop-info-icon />
          </span>
        </div>
      </div>
    </div>
    <template v-if="isAdmin">
      <div v-if="isGetError.statistic" class="shop-info-metrics__error">
        <div
          class="inner flex t-items-center t-justify-center pointer"
          @click="handleReloadStatistic"
        >
          <span>Click để tải lại</span>
        </div>
      </div>
      <div v-else class="shop-info-metrics">
        <div
          v-for="(metric, index) in metrics"
          :key="metric.key"
          class="metric-item"
          :class="{ mt: index > 3 }"
        >
          <template v-if="metric.key === 'feedback'">
            <span v-if="!statistic" class="metric-item__value">
              <g-skeleton-text :width="'60%'" :active="true" />
            </span>
            <div v-else class="flex t-items-center">
              <span class="metric-item__value mr">
                {{ statistic.total_satisfied || 0 }}
              </span>
              <a-tooltip :title="'Hài lòng'">
                <like-shop-info-icon />
              </a-tooltip>
              <span class="metric-item__value ml-1 mr">
                {{ statistic.total_unsatisfied || 0 }}
              </span>
              <a-tooltip :title="'Không hài lòng'">
                <unlike-shop-info-icon />
              </a-tooltip>
            </div>
          </template>
          <template v-else>
            <span v-if="!statistic" class="metric-item__value">
              <g-skeleton-text :width="'60%'" :active="true" />
            </span>
            <template v-else>
              <span class="metric-item__value">
                {{ statistic[metric.key] || "-" }}
              </span>
              <br />
            </template>
          </template>
          <span class="metric-item__title">{{ metric.title }}</span>
        </div>
      </div>
    </template>
    <div v-if="!isError" class="menu-right-content">
      <div class="menu">
        <div
          v-for="menu in menuOptions"
          :key="menu.name"
          class="menu-item pointer flex t-items-center t-justify-between"
          :class="{ 'is-active': selectedItem === menu.name }"
          @click="handleChangeRoute(menu.name)"
        >
          <g-skeleton-text
            v-if="loadingFullInfo"
            :active="true"
            :width="'50%'"
          />
          <span v-else>{{ menu.title }}</span>
          <arrow-right-slim-icon />
        </div>
      </div>
    </div>
    <input
      ref="inputMedia"
      @change="handleChangeFile"
      type="file"
      style="display: none"
      accept="image/*"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import LikeShopInfoIcon from "@/components/icons/LikeShopInfoIcon.vue";
import UnlikeShopInfoIcon from "@/components/icons/UnlikeShopInfoIcon.vue";
import CopyShopInfoIcon from "@/components/icons/CopyShopInfoIcon.vue";
import ArrowRightSlimIcon from "@/components/icons/ArrowRightSlimIcon.vue";
import CameraShopInfoIcon from "@/components/icons/CameraShopInfoIcon.vue";
import { ImagePreload } from "@/components/elements";
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
import {
  CharmingIcon,
  FriendlyIcon,
  HeartIcon,
  GrowingIcon,
  ProIcon,
  SProIcon,
  ReputationIcon,
} from "@/components/icons/shop-award";

import { copyToClipboard } from "@/utils/copyToClipboard.js";
import services from "@/services";

import { menuRight as menuRightContant } from "./contants.js";
import { imageToBase64 } from "@/utils/index.js";
import { ROLES } from "@/contants/index.js";

export default {
  props: ["isError"],
  components: {
    LikeShopInfoIcon,
    UnlikeShopInfoIcon,
    CopyShopInfoIcon,
    ArrowRightSlimIcon,
    CameraShopInfoIcon,
    GSkeletonImage,
    GSkeletonText,
    ImagePreload,
    CharmingIcon,
    FriendlyIcon,
    HeartIcon,
    GrowingIcon,
    ProIcon,
    SProIcon,
    ReputationIcon,
  },
  data() {
    return {
      menus: menuRightContant.menus,
      metrics: menuRightContant.metrics,
      selectedItem: "shop-info-account",
      products: [{}, {}, {}, {}],
      achievements: null,
      statistic: null,
      isGetError: {},
      uploading: false,
    };
  },
  mounted() {
    this.getProducts();
    this.getAchievements();
    this.updateShopStaff();
  },
  computed: {
    ...mapState({
      shopInfo: (state) => state.shop.Shop,
      shopStaff: (state) => state.shop.ShopStaff,
    }),
    productsDisplay() {
      let _products = [];

      for (let index = 0; index < 4; index++) {
        _products[index] = this.products[index] || {};
      }

      return _products;
    },
    menuOptions() {
      if (this.shopInfo?.shop_type?.toString() === "0") {
        return menuRightContant.menus.filter(
          (m) => m.name !== "shop-info-group-account"
        );
      }
      if (!this.shopStaff?.role) return [];
      if (this.shopStaff.role === ROLES.ADMIN) {
        return menuRightContant.menus;
      }
      return [
        {
          name: "shop-info-group-account",
          title: "Thông tin tài khoản",
        },
        {
          title: "Quản lý kho hàng/ trả hàng",
          name: "shop-info-warehouse",
        },
      ];
    },
    isAdmin() {
      return this.shopStaff?.role === ROLES.ADMIN;
    },
  },
  methods: {
    handleChangeRoute(routeName) {
      if (routeName === "shop-info-rule") {
        window.open(
          "https://admin.giaohangtietkiem.vn/files/templates/Bieuphi_Giaohangtietkiem.pdf"
        );
      } else {
        this.$router.push({ name: routeName });
      }
    },
    handleClickInput() {
      if (this.uploading) return;
      this.$refs["inputMedia"].click();
    },
    async handleChangeFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      let base64Src = "";

      try {
        base64Src = await imageToBase64(file);
      } catch (error) {
        this.$message.error("Định dạng ảnh không hợp lệ");
        return;
      }

      this.uploading = true;

      const dataUpdate = new FormData();
      dataUpdate.append("image", file);
      dataUpdate.append("image_type", "avatar");

      try {
        const response = await services.$shop.updateAvatar(dataUpdate);

        if (response?.data?.success) {
          this.$message.success(response?.data?.message);
          this.$store.commit("shop/updateBasicShopInfo", {
            avatar: base64Src,
          });
        } else {
          this.$message.error(
            response?.data?.message || "Cập nhật ảnh đại diện thất bại"
          );
        }
      } catch (error) {
        console.log(error);
        this.$message.error(
          error?.response?.data?.message || "Cập nhật ảnh đại diện thất bại"
        );
      }

      this.uploading = false;
    },
    async getProducts() {
      let products = [];

      try {
        const response = await services.$shop.browserGetProducts({ limit: 10 });

        if (response?.success && response?.data && response.data?.list) {
          products = response.data.list
            .filter((p) => p?.product_images && p.product_images?.length !== 0)
            .map((p) => ({ ...p, image: p.product_images[0] }))
            .slice(0, 4);

          this.isGetError.products = false;
        } else {
          this.isGetError.products = true;
        }
      } catch (error) {
        this.isGetError.products = true;
        console.log(error);
      }

      this.products = products;
    },
    async getAchievements() {
      let achievements = [];
      try {
        const response = await services.$shop.getAchievements();
        if (response?.success && response?.data) {
          achievements = response.data
            ?.filter(
              (i) =>
                i.enable &&
                [
                  "FRIENDLY",
                  "REPUTATION",
                  "GROWING",
                  "PRO",
                  "SPRO",
                  "CHARMING",
                  "DEVOTED",
                ].includes(i.type)
            )
            ?.map((i) => ({
              type: i.type,
              title: i.title,
            }));
        }
      } catch (error) {
        console.log(error);
      }

      this.achievements = achievements;
    },
    async getStatistic() {
      let statistic = {};
      try {
        const response = await services.$shop.getProfile();
        if (response?.success && response?.data?.statistic) {
          statistic = response.data.statistic;
          this.isGetError.statistic = false;
        } else {
          this.isGetError.statistic = true;
        }
      } catch (error) {
        this.isGetError.statistic = true;
        console.log(error);
      }
      this.statistic = statistic;
    },
    handleReloadStatistic() {
      this.statistic = null;
      this.isGetError.statistic = false;
      this.getStatistic();
    },
    handleCopyShopLink() {
      copyToClipboard(this.shopInfo?.chat_infos?.share_link);
      this.$message.success("Copy link shop thành công");
    },
    handleCopyShopToken() {
      copyToClipboard(this.shopInfo?.token);
      this.$message.success("Copy token shop thành công");
    },
    updateShopStaff() {
      if (this.shopStaff?.role === ROLES.ADMIN) {
        this.getStatistic();
      }
    },
  },
  watch: {
    "$route.name": {
      immediate: true,
      handler(_name) {
        this.selectedItem = _name;
      },
    },
    shopStaff() {
      this.updateShopStaff();
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-right {
  width: 420px;
  min-width: 420px;
  border-right: 1px solid var(--grayColor);
  height: calc(100vh - 64px);
  @media only screen and (min-width: 1600px) {
    width: 523px;
    min-width: 523px;
  }
  .shop-info-wrapper {
    height: 115px;
    .wallpaper {
      width: 100%;
      background-size: cover;
      background-position: center;
      position: relative;
      &:not(:first-child) {
        border-left: 2px solid #fff;
      }
      .default {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
    }
  }
  .shop-info-detail {
    padding: 0 1rem;
    display: flex;
    position: relative;
    &__left {
      background-color: #fff;
      position: absolute;
      height: 115px;
      width: 115px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      bottom: 0;
      border: 3px solid #fff;
      box-shadow: rgba(93, 93, 93, 0.32) 0px 0px 5px;
      .overlay-camera-icon {
        opacity: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        left: 0;
        background-color: rgba(255, 255, 255, 0.65);
        align-items: flex-end;
        justify-content: center;
        display: flex;
        transition: 0.15s linear;
        svg {
          transform: translateY(-10px);
          transition: 0.15s linear;
        }
      }
      .overlay-uploading {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        background-color: #ffffffa6;
        border-radius: 40%;
      }
      &:hover {
        .overlay-camera-icon {
          opacity: 1;
          svg {
            transform: translateY(-5px);
          }
        }
      }
    }
    &__right {
      margin-left: calc(115px + 0.5rem);
      width: calc(100% - 115px - 0.5rem);
      min-height: 76px;
      .shop-name {
        font-size: 18px;
        height: 20px;
        line-height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100%;
      }
      .shop-achievement {
        height: 20px;
        line-height: 20px;
        margin-top: 0.5rem;
        svg {
          height: 20px;
          width: 20px;
        }
      }
      .shop-link,
      .shop-token {
        height: 20px;
        line-height: 20px;
        margin-top: 0.5rem;
        span {
          color: #808080;
        }
      }
      .shop-token .mr {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .shop-info-metrics {
    padding: 1rem 0;
    display: flex;
    flex-wrap: wrap;
    .metric-item {
      flex-basis: 25%;
      position: relative;
      padding-left: 0.5rem;
      &__title {
        color: #808080;
      }
      &::after {
        display: block;
        content: "";
        width: 1px;
        background-color: var(--grayColor);
        height: 1rem;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &:nth-child(4),
      &:nth-child(8) {
        &::after {
          display: none;
        }
      }
      &:nth-child(1),
      &:nth-child(5) {
        padding-left: 1rem;
      }
      @media only screen and (min-width: 1600px) {
        padding-left: 1rem;
      }
    }
  }
  .shop-info-metrics__error {
    padding: 1rem 0;
    height: 138px;
    .inner {
      height: 100%;
      background-color: #eee;
      margin: 0 1rem;
    }
  }
  .menu-right-content {
    padding: 0 1rem;
    .menu {
      .menu-item {
        line-height: 20px;
        padding: 1rem 0;
        border-bottom: 1px solid var(--grayColor);
        &.is-active,
        &:hover {
          color: var(--primaryColor);
          svg {
            fill: var(--primaryColor);
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.g-skeleton-text {
  .ant-skeleton-title {
    height: 16px !important;
    margin: 2px 0 !important;
  }
}
</style>
