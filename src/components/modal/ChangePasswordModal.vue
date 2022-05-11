<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="587"
    :maskClosable="!loadingSendOTP"
    :title="'Đổi mật khẩu'"
    @cancel="handleCancel"
  >
    <div class="change-password-modal-wrapper">
      <g-form-item class="form-item flex t-justify-between t-items-center">
        <template #label>
          <span>Mật khẩu mới</span>
        </template>
        <template #content>
          <g-input
            :value="newPassword"
            @input="handleChangeNewPassword"
            placeholder="Nhập mật khẩu mới"
            type="password"
          />
        </template>
      </g-form-item>
      <g-form-item
        class="form-item flex t-justify-between t-items-center"
        :errorMessage="errorMessage"
      >
        <template #label>
          <span>Nhập lại mật khẩu mới</span>
        </template>
        <template #content>
          <g-input
            :value="confirmPassword"
            @input="handleChangeConfirmPassword"
            placeholder="Xác nhận lại mật khẩu"
            type="password"
          />
        </template>
      </g-form-item>
      <g-button
        :loading="loadingSendOTP"
        :disabled="!newPassword || !confirmPassword || !!errorMessage"
        class="primary w-100"
        @click="handleSubmit"
      >
        Xác nhận
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import GButton from "../elements/button.vue";
import { GInput, GFormItem } from "../elements";
import services from "@/services";

export default {
  name: "ChangePasswordModal",
  props: ["visible", "setVisible", "onSuccess"],
  components: {
    GModal,
    GButton,
    GInput,
    GFormItem,
  },
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      loading: false,
      errorMessage: "",
      loadingSendOTP: false,
    };
  },
  methods: {
    validate() {
      if (this.newPassword !== this.confirmPassword) {
        return "Mật khẩu xác nhận không khớp";
      }
      return "";
    },
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeNewPassword(event) {
      if (this.errorMessage) this.errorMessage = "";
      this.newPassword = event.target.value;
    },
    handleChangeConfirmPassword(event) {
      if (this.errorMessage) this.errorMessage = "";
      this.confirmPassword = event.target.value;
    },
    async updateProfile() {
      this.loadingSendOTP = true;
      let isSuccess = false;

      try {
        const response = await services.$shop.updateProfile({
          password: this.newPassword,
          confirm_password: this.confirmPassword,
        });

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

    async handleSubmit() {
      const error = this.validate();

      if (error) {
        this.errorMessage = error;
        return;
      }

      const isSuccess = await this.updateProfile();

      if (isSuccess) {
        this.onSuccess();
      }
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.newPassword = "";
        this.confirmPassword = "";
        this.errorMessage = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.change-password-modal-wrapper {
  font-size: 1rem;
  color: #000 !important;
  .form-item {
    input {
      width: 390px;
    }
  }
}
.error-message {
  color: #da4838;
  display: block;
}
</style>
