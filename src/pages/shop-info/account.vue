<template>
  <main-content>
    <template #main>
      <div class="shop-info-account__main-slot">
        <span class="page-title medium-text"> Thông tin tài khoản </span>

        <div class="flex block-info basic-info">
          <div class="t-flex-1">
            <div class="block-info__left">
              <g-form-item
                class="form-item flex t-justify-between"
                :errorMessage="error?.shopName"
              >
                <template #label>
                  <label class="t-flex t-items-center"> Tên shop </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    v-model="shopName"
                    inputId="shopName"
                    placeholder="Nhập tên shop"
                    @input="handleChangeShopName"
                  />
                </template>
              </g-form-item>
              <g-form-item class="form-item flex t-justify-between">
                <template #label>
                  <label class="t-flex t-items-center"> Mật khẩu </label>
                </template>
                <template #content>
                  <div class="wrapper-password-input">
                    <g-input
                      :inputClass="'password-input'"
                      :valueType="'password'"
                      :borderless="false"
                      :readonly="true"
                      :modelValue="'Mật khẩu'"
                    />
                    <span
                      class="change-password-text primary-text pointer"
                      @click="openChangePasswordModal"
                    >
                      Đổi mật khẩu
                    </span>
                  </div>
                </template>
              </g-form-item>
            </div>
          </div>

          <div class="t-flex-1">
            <div class="block-info__right">
              <g-form-item
                class="form-item flex t-justify-between"
                :errorMessage="error?.shopTel"
              >
                <template #label>
                  <label class="t-flex t-items-center"> SĐT </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    :number-only="true"
                    v-model="shopTel"
                    inputId="shopName"
                    placeholder="Nhập SĐT"
                    @input="handleChangeShopTel"
                  />
                </template>
              </g-form-item>

              <g-form-item
                class="form-item flex t-justify-between"
                :errorMessage="error?.shopEmail"
              >
                <template #label>
                  <label class="t-flex t-items-center"> Email </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    v-model="shopEmail"
                    inputId="shopEmail"
                    placeholder="Nhập email"
                    @input="handleChangeShopEmail"
                  />
                </template>
              </g-form-item>
            </div>
          </div>
        </div>

        <div class="flex block-info advance-info">
          <div class="t-flex-1">
            <div class="block-info__left">
              <div>
                <span class="medium-text">Ảnh đại diện</span>

                <div class="change-media-wrapper flex mt">
                  <div class="t-flex-1 mr">
                    <change-avatar
                      :imageType="'individual'"
                      :value="shopWallpaper"
                    />
                  </div>

                  <div class="t-flex-1 ml">
                    <change-avatar :imageType="'avatar'" :value="shopAvatar" />
                  </div>
                </div>
              </div>

              <div class="cccd-wrapper">
                <span class="medium-text">Chứng minh thư</span>
                <div class="description-text mt">
                  Để thay đổi hình ảnh CMND/CCCD, bạn cần liên hệ bộ phận CSKH.
                  Để được hỗ trợ, gửi mail tới
                  <a href="mailto:cskh@ghtk.vn">
                    <span class="primary-text underline-text">
                      cskh@ghtk.vn
                    </span>
                  </a>
                  hoặc
                  <span
                    class="primary-text underline-text pointer"
                    @click="handleChatWithCSKH"
                    >Chat với CSKH</span
                  >
                </div>
                <div class="flex mt">
                  <div class="blur-item t-flex-1 mr">
                    <image-preload class="default" />
                    <div
                      class="blur-item__content"
                      :style="{ backgroundImage: `url(${identityBefore})` }"
                    />
                  </div>
                  <div class="blur-item t-flex-1 ml">
                    <image-preload class="default" />
                    <div
                      class="blur-item__content"
                      :style="{ backgroundImage: `url(${identityAfter})` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="t-flex-1">
            <div class="block-info__right">
              <div class="license-wrapper">
                <span class="medium-text">Giấy phép đăng ký kinh doanh</span>

                <div class="flex mt">
                  <div class="blur-item t-flex-1 mr">
                    <image-preload class="default" />
                    <img
                      :src="licenseFilePath"
                      class="blur-item__content w-100"
                    />
                  </div>
                  <div class="blur-item t-flex-1 ml" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <confirm-otp-modal
          :title="
            withoutPassword ? 'Đổi mật khẩu' : 'Thay đổi thông tin tài khoản'
          "
          :phoneNumber="shopInfo?.tel"
          :visible="visibleModal.confirmOtp"
          :setVisible="setVisibleModal('confirmOtp')"
          :onSuccess="onSuccessConfirmOtp"
          :onSubmit="onConfirmOTP"
          :actionOTP="actionOTP"
        />
        <change-password-modal
          :visible="visibleModal.changePassword"
          :setVisible="setVisibleModal('changePassword')"
          :onSuccess="onSuccessChangePassword"
        />
        <confirm-exit-modal
          :visible="visibleModal.confirmExit"
          :setVisible="setVisibleModal('confirmExit')"
          :onSubmit="handleExit"
        />
      </div>
    </template>
    <template #footer>
      <div class="shop-info-account__footer-slot flex t-justify-end w-100">
        <g-button
          class="primary t-rounded-[5px] t-py-[8px] t-px-[30px]"
          @click="handleSaveChange"
          :loading="loadingSendOTP"
        >
          Lưu thay đổi
        </g-button>
      </div>
    </template>
  </main-content>
</template>

<script>
import { mapState } from "vuex";
import MainContent from "./main-content.vue";
import { GButton, GFormItem, ImagePreload } from "@/components/elements";
import { GInput } from "@/components";
import ChangeAvatar from "./change-avatar.vue";
import ChangePasswordModal from "@/components/modal/ChangePasswordModal.vue";
import ConfirmOtpModal from "@/components/modal/ConfirmOtpModal.vue";
import ConfirmExitModal from "./confirm-exit-modal.vue";

import { isEmptyObject, isValidEmail, isValidPhone } from "@/utils";

// Mixins
import eventGChat from "@/plugins/mixins/eventGChat";
import mixinLogout from "@/plugins/mixins/logout";

import services from "@/services";

export default {
  components: {
    MainContent,
    GInput,
    ChangeAvatar,
    GButton,
    ChangePasswordModal,
    ConfirmOtpModal,
    GFormItem,
    ImagePreload,
    ConfirmExitModal,
  },
  mixins: [eventGChat, mixinLogout],
  mounted() {
    this.initData();
    this.initIdentityInfo();
    this.initLicenseInfo();
  },
  data() {
    return {
      shopName: "",
      shopTel: "",
      shopEmail: "",
      shopAvatar: "",
      shopWallpaper: "",
      identityBefore: "",
      identityAfter: "",
      licenseFilePath: "",
      visibleModal: {
        changePassword: false,
        confirmOtp: false,
        confirmExit: false,
      },
      withoutPassword: true,
      error: {},
      loadingSendOTP: false,
      changeRouteTo: "",
      allowExit: false,
      actionOTP: "Update_Profile_Shop",
    };
  },
  computed: {
    ...mapState({
      shopInfo: (state) => state.shop.Shop,
      identityInfo: (state) => state.shop.IdentityCard,
      licenseInfo: (state) => state.shop.RegistrationLicense,
    }),
    notChange() {
      return (
        this.shopName === this.shopInfo?.name &&
        this.shopTel === this.shopInfo?.tel &&
        this.shopEmail === this.shopInfo?.email &&
        this.shopAvatar === this.shopInfo?.avatar &&
        this.shopWallpaper === this.shopInfo?.individual_photo
      );
    },
  },
  methods: {
    initData() {
      this.shopName = this.shopInfo?.name;
      this.shopTel = this.shopInfo?.tel;
      this.shopEmail = this.shopInfo?.email;
      this.shopAvatar = this.shopInfo?.avatar;
      this.shopWallpaper = this.shopInfo?.individual_photo;
    },
    initIdentityInfo() {
      this.identityBefore = this.identityInfo?.identity_card_before;
      this.identityAfter = this.identityInfo?.identity_card_after;
    },
    initLicenseInfo() {
      this.licenseFilePath = this.licenseInfo?.file_path;
    },
    handleChatWithCSKH() {
      this.$router.push({ name: "chat" });
      this.$mixinSendEventChatWithCSKH();
    },
    setVisibleModal(modalName) {
      const _this = this;
      return (value) => {
        _this.visibleModal[modalName] = value;
      };
    },
    openChangePasswordModal() {
      this.withoutPassword = true;
      this.visibleModal.changePassword = true;
    },
    onSuccessChangePassword() {
      this.visibleModal.confirmOtp = true;
    },
    onSuccessConfirmOtp() {
      this.visibleModal.confirmOtp = false;
      this.visibleModal.changePassword = false;
      if (this.withoutPassword) {
        this.onLogout();
      }
    },
    getDataUpdate() {
      const dataUpdate = {};

      if (this.shopName !== this.shopInfo.name) {
        dataUpdate.name = this.shopName;
      }
      if (this.shopTel !== this.shopInfo.tel) {
        dataUpdate.tel = this.shopTel;
      }
      if (this.shopEmail !== this.shopInfo.email) {
        dataUpdate.email = this.shopEmail;
      }

      return dataUpdate;
    },
    async onConfirmOTP(otp, password) {
      let isSuccess = false;

      try {
        const response = await services.$shop.confirmOtp({
          action: this.actionOTP,
          otp,
          password,
        });

        if (response?.data && response?.data.success) {
          isSuccess = true;
          this.$message.success(response?.data?.message);
          const dataUpdate = this.getDataUpdate();
          this.$store.commit("shop/updateBasicShopInfo", dataUpdate);
        } else {
          this.$message.error(
            response?.data?.message || "Xác nhận OTP thất bại"
          );
        }
      } catch (error) {
        console.log(error);
        this.$message.error(
          error?.response?.data?.message || "Xác nhận OTP thất bại"
        );
      }

      return isSuccess;
    },
    handleChangeShopEmail(event) {
      if (this.error.shopEmail) this.error.shopEmail = "";
      this.shopEmail = event.target.value;
    },
    handleChangeShopTel(event) {
      if (this.error.shopTel) this.error.shopTel = "";
      this.shopTel = event.target.value;
    },
    handleChangeShopName(event) {
      if (this.error.shopName) this.error.shopName = "";
      this.shopName = event.target.value;
    },
    validate() {
      let error = {};

      if (!this.shopName) {
        error.shopName = "Chưa nhập tên shop";
      }

      if (!this.shopTel) {
        error.shopTel = "Chưa nhập SDT";
      } else {
        if (!isValidPhone(this.shopTel)) {
          error.shopTel = "SDT không hợp lệ";
        }
      }

      if (!this.shopEmail) {
        error.shopEmail = "Chưa nhập email";
      } else {
        if (!isValidEmail(this.shopEmail)) {
          error.shopEmail = "Email không hợp lệ";
        }
      }

      return error;
    },
    async updateProfile() {
      this.loadingSendOTP = true;
      let isSuccess = false;

      try {
        const dataUpdate = this.getDataUpdate();

        if (isEmptyObject(dataUpdate)) {
          this.loadingSendOTP = false;
          this.$message.warning("Dữ liệu không thay đổi");
          return;
        }

        const response = await services.$shop.updateProfile(dataUpdate);
        if (response?.data && response?.data.success) {
          isSuccess = true;
          this.$message.success(response?.data?.message);
        } else {
          this.$message.error(response?.data?.message || "Lấy OTP thất bại");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("Lấy OTP thất bại");
      }

      this.loadingSendOTP = false;

      return isSuccess;
    },
    async handleSaveChange() {
      const error = this.validate();
      this.error = error;

      if (!isEmptyObject(error)) {
        return;
      }

      const isUpdateSuccess = await this.updateProfile();

      if (isUpdateSuccess) {
        this.withoutPassword = false;
        this.visibleModal.confirmOtp = true;
      }
    },
    handleExit() {
      this.allowExit = true;
      this.visibleModal.confirmExit = false;
      this.$router.push(this.changeRouteTo);
    },
  },
  watch: {
    shopInfo() {
      this.initData();
    },
    identityInfo() {
      this.initIdentityInfo();
    },
    licenseInfo() {
      this.initLicenseInfo();
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.allowExit || this.notChange) {
      next();
    } else {
      this.allowExit = false;
      this.changeRouteTo = to.path;
      this.visibleModal.confirmExit = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.underline-text {
  text-decoration: underline;
}
.shop-info-account__main-slot {
  .page-title {
    font-size: 18px;
  }
  .form-item {
    margin-bottom: 1.5rem;
  }
  .block-info {
    &__left,
    &__right {
      max-width: 472px;
    }
    &.basic-info {
      margin-top: 1.5rem;
    }
    &.advance-info {
      margin-top: 1rem;
    }
    &__left {
      margin-right: 0.5rem;
    }
    &__right {
      margin-left: 0.5rem;
    }
  }
  .wrapper-password-input {
    position: relative;
    .change-password-text {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .cccd-wrapper {
    margin-top: 1.5rem;
    .description-text {
      color: #808080;
      line-height: 20px;
    }
    .blur-item__content {
      height: 128px;
    }
  }
  .license-wrapper {
    .blur-item__content {
      min-height: 128px;
    }
  }
  .blur-item {
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    &__content {
      background-size: cover;
      background-position: center;
      transition: 0.2s linear;
      filter: blur(10px);
      -webkit-filter: blur(10px);
      -moz-filter: blur(10px);
      -o-filter: blur(10px);
      -ms-filter: blur(10px);
    }
    .default {
      border-radius: 5px;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    &:hover {
      .blur-item__content {
        filter: blur(0px) !important;
        -webkit-filter: blur(0px) !important;
        -moz-filter: blur(0px) !important;
        -o-filter: blur(0px) !important;
        -ms-filter: blur(0px) !important;
      }
    }
  }
}
</style>

<style lang="scss">
.shop-info-account__main-slot {
  .basic-info {
    .password-input {
      color: #bdbdbd;
    }
  }
  .g-input {
    padding: 0 0.5rem !important;
    height: 2rem;
  }
  .form-item {
    label {
      width: 80px;
    }
    .content-wrapper {
      flex: 1;
      max-width: 390px;
    }
  }
}
.shop-info-account__footer-slot {
  .ant-btn {
    padding: 7px 30px;
    height: 100%;
  }
}
</style>
