<template>
  <a-modal
    class="otp-account-modal"
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="587"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[24px] t-font-medium t-h-[25px]"
          style="
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          {{
            isAddModal
              ? "Thêm tài khoản mới"
              : ` Sửa thông tin | ${this.role} / ${this.staffInfo.fullname}`
          }}
        </h3>
        <span class="t-flex t-cursor-pointer" @click="handleCancel">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2.01429L17.9857 0L10 7.98571L2.01429 0L0 2.01429L7.98571 10L0 17.9857L2.01429 20L10 12.0143L17.9857 20L20 17.9857L12.0143 10L20 2.01429Z"
              fill="#fff"
            />
          </svg>
        </span>
      </div>
    </template>
    <div class="otp-account-modal-content t-text-black t-text-[16px]">
      <p>Mã OTP vừa được gửi tới số điện thoại {{ this.telAdmin }} .</p>
      <div class="form-group t-flex t-items-center t-justify-between">
        <label>Nhập mã OTP</label>
        <g-input
          class="group-account__input"
          :borderless="false"
          :innerErrorMessage="''"
          placeholder="Nhập mã OTP"
          v-model="this.otpValue"
        ></g-input>
      </div>
      <p class="t-mt-[15px]">
        Nếu quá 10 giây không nhận được mã, vui lòng bấm:
        <a
          class="t-text-[#088A4B] hover:t-text-[#088A4B]"
          :class="{
            'is-disabled': currentTimeLeft || isResending,
            pointer: !currentTimeLeft && !isResending,
          }"
          @click="handleResetOtp"
          >Gửi lại mã OTP
          <span v-if="currentTimeLeft">
            ({{ currentTimeLeft.toString().padStart(2, "0") }})
          </span>
          <a-spin
            v-if="isResending"
            :size="'small'"
            style="height: 20px; margin-left: 0.5rem"
          />
        </a>
      </p>
      <div class="">
        Nếu vẫn không nhận được mã, vui lòng gửi mail tới
        <a
          class="t-text-[#63BB95] hover:t-text-[#63BB95] t-underline hover:t-underline"
          href="mailto:cskh@ghtk.vn"
          >cskh@ghtk.vn</a
        >
        hoặc
        <a
          class="t-text-[#63BB95] hover:t-text-[#63BB95] t-underline hover:t-underline"
          @click="handleChatWithCSKH"
          >Chat với CSKH</a
        >
      </div>
    </div>
    <div class="otp-account-modal-action">
      <g-button
        size=""
        type="primary"
        class="primary t-h-[40px] t-w-full t-mt-[15px] t-text-[16px] t-font-medium"
        @click="handleSubmitOtp"
        :disabled="isChecked"
      >
        Xác nhận
      </g-button>
    </div>
  </a-modal>
</template>
<script>
import { GInput } from "@/components";
import GButton from "../../components/elements/button.vue";
import accountService from "@/services/account.service";
import { message } from "ant-design-vue";
const MAX_TIME = 10;
export default {
  components: {
    GInput,
    GButton,
  },
  props: {
    isAddModal: Boolean,
    visible: Boolean,
    setVisible: Boolean,
    otpValueData: String,
    staffInfo: {
      type: Object,
      default: null,
    },
    staffList: {
      type: Array,
      default: null,
    },
  },
  mounted() {
    this.setTelAdmin();
  },
  data() {
    return {
      otpValue: "",
      telAdmin: "",
      isChecked: true,
      currentTimeLeft: 0,
      isResending: false,
      intervalMaxTime: null,
      maxTime: MAX_TIME || this.maxTime,
      role: this.staffInfo.role === "operator" ? "Vận hành" : "Kế toán",
    };
  },
  watch: {
    otpValueData() {
      this.otpValue = this.otpValueData;
    },
    otpValue() {
      this.isChecked = this.otpValue === "" ? true : false;
    },
    visible(_visible) {
      if (_visible) {
        this.countdownMaxTime();
      } else {
        if (this.intervalMaxTime) {
          clearInterval(this.intervalMaxTime);
          this.intervalMaxTime = null;
        }
      }
    },
  },
  methods: {
    setTelAdmin() {
      this.staffList
        .filter((staff) => {
          return staff.role === "admin";
        })
        .map((staff) => {
          this.telAdmin = staff.tel;
        });
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
    handleCancel() {
      this.setVisible(false);
      this.otpValue = "";
    },
    handleSubmitOtp() {
      this.$emit("checkOtp", this.otpValue);
      this.otpValue = "";
      this.isChecked = true;
    },
    handleChatWithCSKH() {
      this.$router.push({ name: "chat" });
      this.$mixinSendEventChatWithCSKH();
    },
    async handleResetOtp() {
      if (!this.currentTimeLeft) {
        this.isResending = true;
        try {
          this.loading = true;
          const response = await accountService.resetOtpAccount(
            JSON.stringify({
              action: this.isAddModal ? "Register_Staff" : "Update_Staff",
            })
          );
          this.otpValue = "";
          if (response.data.success) {
            this.countdownMaxTime();
            this.loading = false;
            message.success(response.data.message);
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
        this.isResending = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.otp-account-modal {
  .form-group {
    .group-account__input {
      width: 390px;
    }
  }
  .is-disabled {
    color: var(--grayColor) !important;
    cursor: not-allowed;
  }
}
</style>
<style lang="scss">
.otp-account-modal {
  .g-input {
    padding: 0 0.5rem !important;
    height: 2rem;
  }
  span.hasError.t-text-warning {
    margin-left: 8px;
    font-size: 14px;
  }
  .otp-account-modal-action {
    .ant-btn {
      height: 40px;
      font-weight: 500;
    }
  }
}
</style>
