<template>
  <a-modal
    class="edit-account-modal"
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
          <!-- Sửa thông tin | {{ accountData.role }} / {{ accountData.fullname }} -->
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
    <div class="edit-account-modal-content t-text-black t-text-[16px]">
      <div class="form-group t-flex t-items-center t-justify-between">
        <label>Tên nhân viên</label>
        <g-input
          class="group-account__input"
          v-model="accountData.fullname"
          :borderless="false"
          :innerErrorMessage="validate.account_fullname"
          placeholder="Nhập tên nhân viên"
          @on-blur="onValidateAccountBlur"
        ></g-input>
      </div>
      <div
        class="form-group t-flex t-items-center t-justify-between t-mt-[20px]"
      >
        <label>Số điện thoại</label>
        <g-input
          class="group-account__input"
          :borderless="false"
          :number-only="true"
          v-model="accountData.tel"
          :innerErrorMessage="validate.account_tel"
          placeholder="Nhập số điện thoại"
          @on-blur="onValidateAccountBlur"
          :autocomplete="'off'"
        ></g-input>
      </div>
      <div
        class="form-group t-flex t-items-center t-justify-between t-mt-[20px]"
      >
        <label>{{ isAddModal ? "Mật khẩu" : "Mật khẩu mới" }}</label>
        <g-input
          :borderless="false"
          placeholder="Nhập mật khẩu nhân viên"
          :valueType="'password'"
          type="password"
          class="group-account__input"
          :innerErrorMessage="validate.account_password"
          v-model="accountData.password"
          @on-blur="onValidateAccountBlur"
          :autocomplete="'off'"
        ></g-input>
      </div>
      <div
        class="form-group t-flex t-items-center t-justify-between t-mt-[20px]"
      >
        <label>{{
          isAddModal ? "Nhập lại mật khẩu" : "Nhập lại mật khẩu mới"
        }}</label>
        <g-input
          :borderless="false"
          placeholder="Nhập lại mật khẩu"
          :valueType="'password'"
          class="group-account__input"
          :innerErrorMessage="validate.account_repassword"
          v-model="accountData.repassword"
          @on-blur="onValidateAccountBlur"
        ></g-input>
      </div>
      <div
        class="form-group t-flex t-items-center t-justify-between t-mt-[20px]"
      >
        <label>Vị trí</label>
        <a-radio-group class="t-w-[390px]" v-model:value="accountData.role">
          <g-radio :value="'operator'">
            <span>
              <span class="t-ml-2 t-text-16">Vận hành</span>
            </span>
          </g-radio>
          <g-radio :value="'cashier'">
            <span>
              <span class="t-ml-2 t-text-16">Kế toán</span>
            </span>
          </g-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="edit-account-modal-action">
      <g-button
        size=""
        type="primary"
        class="primary t-h-[40px] t-w-full t-mt-[15px] t-text-[16px] t-font-medium"
        :disabled="isStaffInfoValue"
        @click="handleClickSubmit"
      >
        {{ isAddModal ? "Tạo tài khoản" : "Cập nhật" }}
      </g-button>
    </div>
  </a-modal>
</template>

<script>
import { GRadio } from "@/components/elements";
import GButton from "../../components/elements/button.vue";
import { GInput } from "@/components";

export default {
  components: {
    GInput,
    GButton,
    GRadio,
  },
  props: {
    visible: Boolean,
    setVisible: Boolean,
    isAddModal: Boolean,
    isSuccess: Boolean,
    staffInfo: {
      type: Object,
      default: null,
    },
  },
  beforeUpdate() {
    this.clearValue();
  },
  watch: {
    // "accountData.fullname": function () {
    //   this.isStaffInfoValue =
    //     this.accountData.fullname === this.staffInfo.fullname ? true : false;
    // },
    // "accountData.tel": function () {
    //   this.isStaffInfoValue =
    //     this.accountData.tel === this.staffInfo.tel ? true : false;
    // },
    // "accountData.role": function () {
    //   this.isStaffInfoValue =
    //     this.accountData.role === this.staffInfo.role ? true : false;
    // },
    // "accountData.password": function () {
    //   this.isStaffInfoValue = this.accountData.password === "" ? true : false;
    //   this.checkConfirmPassword =
    //     this.accountData.password === "" ? false : true;
    // },

    // "accountData.repassword": function () {
    //   this.isStaffInfoValue =
    // 	  this.accountData.repassword === "" ? true : false;
    // },
    accountData: {
      handler() {
        if (
          this.accountData.fullname !== "" &&
          this.accountData.tel !== "" &&
          this.accountData.password !== "" &&
          this.accountData.repassword !== "" &&
          this.isAddModal
        ) {
          this.isStaffInfoValue = false;
        }
        if (!this.isAddModal) {
          this.accountData.fullname !== this.staffInfo.fullname ||
          this.accountData.tel !== this.staffInfo.tel ||
          this.accountData.role !== this.staffInfo.role ||
          this.accountData.password !== ""
            ? (this.isStaffInfoValue = false)
            : (this.isStaffInfoValue = true);
        }
        this.accountData.tel !== this.staffInfo.tel && !this.isAddModal
          ? (this.isCheckChangeTel = true)
          : (this.isCheckChangeTel = false);
      },
      deep: true,
    },
  },
  data() {
    return {
      isStaffInfoValue: true,
      checkConfirmPassword: false,
      isCheckChangeTel: false,
      role: this.staffInfo.role === "operator" ? "Vận hành" : "Kế toán",
      accountData: {
        id: this.staffInfo.id,
        fullname: this.staffInfo.fullname,
        role: this.staffInfo.role || "operator",
        tel: this.staffInfo.tel,
        password: this.staffInfo.password || "",
        repassword: this.staffInfo.repassword || "",
      },
      validate: {
        account_tel: "",
        account_fullname: "",
        account_password: "",
        account_repassword: "",
      },
    };
  },
  methods: {
    clearValue() {
      this.accountData.id = this.staffInfo.id ? this.staffInfo.id : "";
      this.accountData.fullname = this.staffInfo.fullname
        ? this.staffInfo.fullname
        : "";
      this.accountData.tel = this.staffInfo.tel ? this.staffInfo.tel : "";
      this.accountData.password = "";
      this.accountData.repassword = "";
      this.accountData.role = this.staffInfo.role
        ? this.staffInfo.role
        : "operator";
    },
    handleCancel() {
      this.setVisible(false);
      this.isStaffInfoValue = true;
      this.clearValue();
      this.validate.account_fullname = "";
      this.validate.account_tel = "";
      this.validate.account_password = "";
      this.validate.account_repassword = "";
    },
    handleClickSubmit() {
      // this.validateAccount();
      if (this.validateAccount()) {
        this.$emit("createAccount", {
          ...this.accountData,
        });
        this.isStaffInfoValue = true;
        setTimeout(() => {
          // this.accountData.id = !this.isAddModal ? this.staffInfo.id : null;
          // this.accountData.fullname = !this.isAddModal
          //   ? this.staffInfo.fullname
          //   : "";
          // this.accountData.role = !this.isAddModal
          //   ? this.staffInfo.role
          //   : "operator";
          // this.accountData.tel = !this.isAddModal ? this.staffInfo.tel : "";
          if (!this.isAddModal) {
            this.accountData.id = this.staffInfo.id;
            this.accountData.fullname = this.staffInfo.fullname;
            this.accountData.tel = this.staffInfo.tel;
            this.accountData.password = "";
            this.accountData.repassword = "";
          } else if (this.isAddModal && this.isSuccess) {
            this.accountData.id = "";
            this.accountData.fullname = "";
            this.accountData.tel = "";
            this.accountData.password = "";
            this.accountData.repassword = "";
            this.accountData.role = "operator";
          }
        }, 500);
      }
    },
    handleChangeName() {},
    validateAccount() {
      let isValid = true;
      this.validate.account_fullname = "";
      this.validate.account_tel = "";
      this.validate.account_password = "";
      this.validate.account_repassword = "";

      if (!this.accountData.tel) {
        this.validate.account_tel = "Nhập số điện thoại";
        isValid = false;
      }
      if (!this.accountData.fullname) {
        this.validate.account_fullname = "Nhập tên nhân viên";
        isValid = false;
      }
      if (
        this.isAddModal ||
        (!this.isAddModal && this.accountData.password !== "")
      ) {
        if (!this.accountData.password) {
          this.validate.account_password = "Nhập mật khẩu ";
          isValid = false;
        }
        if (
          !this.accountData.repassword ||
          this.accountData.repassword !== this.accountData.password
        ) {
          this.accountData.repassword = "";
          this.validate.account_repassword = "Xác nhận mật khẩu không hợp lệ";
          isValid = false;
        }
      }
      return isValid;
    },
    onValidateAccountBlur() {
      this.$emit("checkChangeTel", this.isCheckChangeTel);
      if (
        this.accountData.fullname !== "" &&
        this.accountData.tel !== "" &&
        this.accountData.password !== "" &&
        this.accountData.repassword !== ""
      ) {
        this.validateAccount();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-account-modal {
  .form-group {
    .group-account__input {
      width: 390px;
    }
  }
}
</style>

<style lang="scss">
.edit-account-modal {
  .ant-radio-group {
    display: flex;
    align-items: center;
    .ant-radio-wrapper {
      margin-right: 20px;
      display: flex;
      align-items: center;
      .ant-radio-inner {
        width: 22px;
        height: 22px;
        &::after {
          width: 10px;
          height: 10px;
        }
      }
    }
  }
  .g-input {
    padding: 0 0.5rem !important;
    height: 2rem;
  }
  span.hasError.t-text-warning {
    margin-left: 8px;
    font-size: 14px;
  }
  .edit-account-modal-action {
    .ant-btn {
      height: 40px;
      font-weight: 500;
    }
  }
}
</style>
