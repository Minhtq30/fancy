<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="587"
    :maskClosable="false"
    :title="title || 'Xác nhận OTP'"
    @cancel="handleCancel"
  >
    <div class="confirm-otp-modal-wrapper">
      <div class="mb-1">
        <span>
          Mã OTP vừa được gửi tới số điện thoại
          <hidden-content :text="phoneNumber" :first="3" :last="4" /> của bạn.
        </span>
      </div>
      <g-form-item
        class="form-item flex t-justify-between t-items-center"
        :errorMessage="errorMessage"
      >
        <template #label>
          <span>Nhập mã OTP</span>
        </template>
        <template #content>
          <g-input-number
            :borderless="false"
            :number-only="true"
            v-model="otp"
            inputId="otp"
            placeholder="Nhập OTP"
            @input="handleChangeOTP"
          />
        </template>
      </g-form-item>
      <div class="desc-content mb-1">
        <span>
          Nếu quá {{ maxTime }} giây không nhận được mã, vui lòng bấm:
          <span
            class="medium-text primary-text resend-otp"
            :class="{
              'is-disabled': currentTimeLeft || isResending,
              pointer: !currentTimeLeft && !isResending,
            }"
            @click="handleResendOTP"
          >
            Gửi lại OTP
            <span v-if="currentTimeLeft">
              ({{ currentTimeLeft.toString().padStart(2, "0") }})
            </span>
            <a-spin
              v-if="isResending"
              :size="'small'"
              style="height: 20px; margin-left: 0.5rem"
            />
          </span>
        </span>
      </div>
      <div class="desc-content mb-1">
        <span
          >Nếu vẫn không nhận được mã, vui lòng gửi mail tới
          <a href="mailto:cskh@ghtk.vn">
            <span class="primary-text underline-text"> cskh@ghtk.vn </span>
          </a>
          hoặc
          <span
            class="primary-text underline-text pointer"
            @click="handleChatWithCSKH"
            >Chat với CSKH</span
          ></span
        >
      </div>
      <g-button
        :loading="loading"
        :disabled="!otp"
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
import { GFormItem } from "../elements";
import HiddenContent from "../HiddenContent.vue";
import { GInput as GInputNumber } from "@/components";

import services from "@/services";

// Mixins
import eventGChat from "@/plugins/mixins/eventGChat";

const MAX_TIME = 10;

export default {
  name: "ConfirmOtpModal",
  props: [
    "visible",
    "setVisible",
    "onSuccess",
    "phoneNumber",
    "onSubmit",
    "actionOTP",
  ],
  components: {
    GModal,
    GButton,
    GFormItem,
    HiddenContent,
    GInputNumber,
  },
  mixins: [eventGChat],
  data() {
    return {
      otp: "",
      loading: false,
      maxTime: MAX_TIME || this.maxTime,
      currentTimeLeft: 0,
      intervalMaxTime: null,
      isResending: false,
    };
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    async handleSubmit() {
      this.loading = true;

      const isSuccess = await this.onSubmit(Number(this.otp));

      this.loading = false;

      if (isSuccess) {
        this.onSuccess();
      }
    },
    handleChatWithCSKH() {
      this.$router.push({ name: "chat" });
      this.$mixinSendEventChatWithCSKH();
    },
    countdownMaxTime() {
      if (!this.intervalMaxTime) {
        this.currentTimeLeft = this.maxTime;
        this.intervalMaxTime = setInterval(() => {
          if (this.currentTimeLeft === 0) {
            clearInterval(this.intervalMaxTime);
            this.intervalMaxTime = null;
          } else {
            this.currentTimeLeft -= 1;
          }
        }, 1000);
      }
    },
    async handleResendOTP() {
      if (!this.currentTimeLeft) {
        this.isResending = true;

        try {
          const response = await services.$shop.resendOTP({
            action: this.actionOTP,
          });
          if (response?.data && response?.data.success) {
            this.countdownMaxTime();
            this.$message.success(response?.data?.message);
          } else {
            this.$message.error(response?.data?.message || "Lấy OTP thất bại");
          }
        } catch (error) {
          console.log(error);
          this.$message.error("Lấy OTP thất bại");
        }

        this.isResending = false;
      }
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.password = "";
        this.otp = "";
        this.countdownMaxTime();
      } else {
        if (this.intervalMaxTime) {
          clearInterval(this.intervalMaxTime);
          this.intervalMaxTime = null;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-otp-modal-wrapper {
  font-size: 1rem;
  color: #000 !important;
  .form-item {
    margin-bottom: 1rem !important;
    input {
      width: 390px;
    }
  }
  .desc-content {
    line-height: 20px;
    .underline-text {
      text-decoration: underline;
    }
  }
  .resend-otp {
    &.is-disabled {
      color: var(--grayColor) !important;
    }
  }
}
.error-message {
  color: #da4838;
  display: block;
}
</style>

<style lang="scss">
.confirm-otp-modal-wrapper {
  .form-item {
    input {
      height: 2rem !important;
      font-size: 1rem !important;
      width: 390px !important;
      padding: 0 1rem !important;
    }
  }
}
</style>
