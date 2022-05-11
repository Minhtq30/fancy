<template>
  <main-content>
    <template #main>
      <div class="group-account">
        <div class="overlay" v-if="loading">
          <a-spin :spinning="loading" :delay="delayTime" />
        </div>
        <div class="group-account__title t-text-18 t-font-medium">
          {{ isAdmin ? "Quản lý nhóm tài khoản" : "Thông tin tài khoản" }}
        </div>
        <div
          class="list-account t-pb-[20px] t-mt-[15px]"
          v-for="(account, index) in newStaffList"
          :key="index"
        >
          <div class="account-info t-flex t-items-center t-justify-between">
            <div class="account-name t-flex t-items-center t-justify-between">
              <label class="group-account__label t-text-16 t-font-medium">
                Tài khoản {{ index + 1 }}
              </label>
              <p class="t-m-0 t-text-16">Tạo lúc {{ account?.created }}</p>
            </div>
            <div class="account-active t-flex t-items-center">
              <a
                v-if="isAdmin"
                class="active-edit t-text-14 t-flex t-items-center"
                :class="
                  account.role === 'admin'
                    ? 't-text-[#BDBDBD] hover:t-text-[#BDBDBD] t-cursor-default'
                    : 'hover:t-text-[#069255] t-text-[#069255]'
                "
                @click="
                  account.role !== 'admin' ? openEditAccountModal(account) : ''
                "
              >
                <svg
                  class="t-mr-[10px]"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 19.5H22.5V21H1.5V19.5Z"
                    :fill="account.role === 'admin' ? '#BDBDBD' : '#069255'"
                  />
                  <path
                    d="M19.05 6.75C19.65 6.15 19.65 5.25 19.05 4.65L16.35 1.95C15.75 1.35 14.85 1.35 14.25 1.95L3 13.2V18H7.8L19.05 6.75ZM15.3 3L18 5.7L15.75 7.95L13.05 5.25L15.3 3ZM4.5 16.5V13.8L12 6.3L14.7 9L7.2 16.5H4.5Z"
                    :fill="account.role === 'admin' ? '#BDBDBD' : '#069255'"
                  />
                </svg>

                Sửa tài khoản
              </a>
              <a
                v-if="isAdmin"
                class="active-delete t-flex t-items-center t-text-14 t-ml-[30px]"
                :class="
                  account.role === 'admin'
                    ? 't-text-[#BDBDBD] hover:t-text-[#BDBDBD] t-cursor-default'
                    : 'hover:t-text-[#DA4838] t-text-[#DA4838]'
                "
                @click="
                  account.role !== 'admin' ? handleDeleteAccount(account) : ``
                "
              >
                <svg
                  class="t-mr-[10px]"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.875 6.875C6.04076 6.875 6.19973 6.94085 6.31694 7.05806C6.43415 7.17527 6.5 7.33424 6.5 7.5V15C6.5 15.1658 6.43415 15.3247 6.31694 15.4419C6.19973 15.5592 6.04076 15.625 5.875 15.625C5.70924 15.625 5.55027 15.5592 5.43306 15.4419C5.31585 15.3247 5.25 15.1658 5.25 15V7.5C5.25 7.33424 5.31585 7.17527 5.43306 7.05806C5.55027 6.94085 5.70924 6.875 5.875 6.875ZM9 6.875C9.16576 6.875 9.32473 6.94085 9.44194 7.05806C9.55915 7.17527 9.625 7.33424 9.625 7.5V15C9.625 15.1658 9.55915 15.3247 9.44194 15.4419C9.32473 15.5592 9.16576 15.625 9 15.625C8.83424 15.625 8.67527 15.5592 8.55806 15.4419C8.44085 15.3247 8.375 15.1658 8.375 15V7.5C8.375 7.33424 8.44085 7.17527 8.55806 7.05806C8.67527 6.94085 8.83424 6.875 9 6.875ZM12.75 7.5C12.75 7.33424 12.6842 7.17527 12.5669 7.05806C12.4497 6.94085 12.2908 6.875 12.125 6.875C11.9592 6.875 11.8003 6.94085 11.6831 7.05806C11.5658 7.17527 11.5 7.33424 11.5 7.5V15C11.5 15.1658 11.5658 15.3247 11.6831 15.4419C11.8003 15.5592 11.9592 15.625 12.125 15.625C12.2908 15.625 12.4497 15.5592 12.5669 15.4419C12.6842 15.3247 12.75 15.1658 12.75 15V7.5Z"
                    :fill="account.role === 'admin' ? '#BDBDBD' : '#DA4838'"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.125 3.75C17.125 4.08152 16.9933 4.39946 16.7589 4.63388C16.5245 4.8683 16.2065 5 15.875 5H15.25V16.25C15.25 16.913 14.9866 17.5489 14.5178 18.0178C14.0489 18.4866 13.413 18.75 12.75 18.75H5.25C4.58696 18.75 3.95107 18.4866 3.48223 18.0178C3.01339 17.5489 2.75 16.913 2.75 16.25V5H2.125C1.79348 5 1.47554 4.8683 1.24112 4.63388C1.0067 4.39946 0.875 4.08152 0.875 3.75V2.5C0.875 2.16848 1.0067 1.85054 1.24112 1.61612C1.47554 1.3817 1.79348 1.25 2.125 1.25H6.5C6.5 0.918479 6.6317 0.600537 6.86612 0.366117C7.10054 0.131696 7.41848 0 7.75 0L10.25 0C10.5815 0 10.8995 0.131696 11.1339 0.366117C11.3683 0.600537 11.5 0.918479 11.5 1.25H15.875C16.2065 1.25 16.5245 1.3817 16.7589 1.61612C16.9933 1.85054 17.125 2.16848 17.125 2.5V3.75ZM4.1475 5L4 5.07375V16.25C4 16.5815 4.1317 16.8995 4.36612 17.1339C4.60054 17.3683 4.91848 17.5 5.25 17.5H12.75C13.0815 17.5 13.3995 17.3683 13.6339 17.1339C13.8683 16.8995 14 16.5815 14 16.25V5.07375L13.8525 5H4.1475ZM2.125 3.75V2.5H15.875V3.75H2.125Z"
                    :fill="account.role === 'admin' ? '#BDBDBD' : '#DA4838'"
                  />
                </svg>

                Xóa tài khoản
              </a>
            </div>
          </div>
          <div
            class="list-box t-mt-[15px] flex t-justify-between t-flex-col xl:t-flex-row"
          >
            <div
              class="list-left xl:t-w-1/2 t-w-full t-pr-0 xl:t-pr-[14px] t-w-full xl:t-max-w-[600px]"
            >
              <div class="list t-flex t-items-center t-justify-between">
                <label class="group-account__label">Tài khoản </label>
                <g-input
                  readonly
                  :borderless="false"
                  v-model="account.username"
                  placeholder="Nhập tài khoản"
                  class="group-account__input 2xl:t-w-[480px] t-flex-1"
                ></g-input>
              </div>
              <div class="list t-mt-4 t-flex t-items-center t-justify-between">
                <label class="group-account__label">Mật khẩu </label>
                <g-input
                  readonly
                  :borderless="false"
                  value="123456789"
                  placeholder="Nhập mật khẩu"
                  :modelValue="'Mật khẩu'"
                  :valueType="'password'"
                  class="group-account__input 2xl:t-w-[480px] t-flex-1"
                ></g-input>
              </div>
              <div class="list t-mt-4 t-flex t-items-center t-justify-start">
                <label class="group-account__label">Vai trò </label>
                <div class="list-radio t-flex t-items-center t-justify-between">
                  <a-radio-group
                    :size="'large'"
                    :value="account.role"
                    :disabled="account.role === 'admin' ? true : false"
                  >
                    <g-radio
                      :value="'admin'"
                      :disabled="true"
                      class="t-mr-[24px]"
                      v-if="account.role === 'admin'"
                    >
                      <span>
                        <span class="t-ml-2 t-text-16">Quản trị</span>
                      </span>
                    </g-radio>
                    <g-radio
                      v-if="['admin', 'operator'].includes(account.role)"
                      :value="'operator'"
                    >
                      <span>
                        <span class="t-ml-2 t-text-16">Vận hành</span>
                      </span>
                    </g-radio>
                    <g-radio
                      v-if="['admin', 'cashier'].includes(account.role)"
                      :value="'cashier'"
                    >
                      <span>
                        <span class="t-ml-2 t-text-16">Kế toán</span>
                      </span>
                    </g-radio>
                  </a-radio-group>
                </div>
              </div>
            </div>
            <div
              class="list-right xl:t-w-1/2 t-w-full t-pl-0 xl:t-pl-[14px] t-w-full xl:t-max-w-[600px] t-mt-[15px] xl:t-mt-0"
            >
              <div class="list t-flex t-items-center t-justify-between">
                <label class="group-account__label">Tên nhân viên </label>
                <g-input
                  readonly
                  :borderless="false"
                  v-model="account.fullname"
                  placeholder="Nhập tên nhân viên"
                  class="group-account__input 2xl:t-w-[480px] t-flex-1"
                ></g-input>
              </div>
              <div class="list t-mt-4 t-flex t-items-center t-justify-between">
                <label class="group-account__label">Số điện thoại </label>
                <g-input
                  readonly
                  :borderless="false"
                  :number-only="true"
                  v-model="account.tel"
                  placeholder="Nhập số điện thoại"
                  class="group-account__input 2xl:t-w-[480px] t-flex-1"
                ></g-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer v-if="isAdmin">
      <div class="button t-flex t-items-center t-justify-between t-w-full">
        <button
          class="button-add t-bg-transparent t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-py-[6px] t-px-[22px] t-text-[16px] t-font-medium t-text-[#069255]"
          @click="openAddAccountModal()"
        >
          Thêm tài khoản mới
        </button>
        <button
          class="button-save t-rounded-[5px] t-py-[8px] t-px-[30px] t-bg-[#00904A] t-text-[#fff]"
        >
          Lưu thay đổi
        </button>
      </div>
    </template>
  </main-content>
  <edit-account-modal
    :isAddModal="isAddModal"
    :visible="visibleModal.editAccount"
    :setVisible="setVisibleModal('editAccount')"
    :staffInfo="account"
    :key="account.id"
    :isSuccess="isSuccess"
    @createAccount="handleCreateAccount"
    @checkChangeTel="handleChangeTel"
  ></edit-account-modal>
  <otp-account-modal
    :isAddModal="isAddModal"
    :visible="visibleModal.otpAccount"
    :otpValueData="otpValue"
    :setVisible="setVisibleModal('otpAccount')"
    :key="account.id"
    :staffInfo="accountOtp"
    :staffList="staffList"
    @checkOtp="checkOtp"
  ></otp-account-modal>
  <a-modal
    class="delete-account-modal"
    :visible="visibleModal.deleteAccount"
    :footer="null"
    :centered="true"
    :width="500"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[20px] t-font-medium"
          style="
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          Xóa tài khoản
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
    <div
      class="delete-account-modal-content t-text-center t-text-[20px] t-mb-[25px] t-mt-[10px]"
      style="
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      "
    >
      Bạn có chắc muốn xoá tài khoản
      <span class="t-font-medium">"{{ accountDelete?.fullname }}"</span> ?
    </div>
    <div class="delete-account-modal-action t-flex t-justify-around t-m-[10px]">
      <g-button
        size=""
        type="faded"
        class="faded t-h-[40px] t-w-[150px] t-text-[16px] t-font-medium"
        @click="handleCancel"
      >
        Hủy
      </g-button>
      <g-button
        size=""
        type="primary"
        class="primary t-h-[40px] t-w-[150px] t-text-[16px] t-font-medium"
        @click="handleClickDelete"
      >
        Xóa
      </g-button>
    </div>
  </a-modal>
</template>

<script>
import MainContent from "./main-content.vue";
import { GRadio } from "@/components/elements";
import EditAccountModal from "./EditAccountModal.vue";
import OtpAccountModal from "./OtpAccountModal.vue";
import { GInput } from "@/components";
import accountService from "@/services/account.service";
import { message } from "ant-design-vue";
import GButton from "../../components/elements/button.vue";
import { mapState } from "vuex";
import { ROLES } from "@/contants";

export default {
  components: {
    MainContent,
    GInput,
    GRadio,
    EditAccountModal,
    OtpAccountModal,
    GButton,
  },
  // created() {
  //   this.getTopProduct();
  // },
  data() {
    return {
      loading: false,
      delayTime: 200,
      checked: true,
      size: "large",
      visibleModal: {
        editAccount: false,
        otpAccount: false,
        deleteAccount: false,
      },
      isAddModal: true,
      isCheckChangeTel: false,
      isSuccess: false,
      account: {},
      accountOtp: {},
      staffList: [],
      newStaffList: [],
      otpValue: "",
      message: "",
      accountDelete: {},
      accountStaff: {},
    };
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      if (this.newStaffList.length < 1) {
        this.getAccount();
      }
    }, 300);
  },
  computed: {
    ...mapState({
      allStaffList: (state) => state.shop.allStaffList,
      getAccountStaff: (state) => state.shop.ShopStaff,
    }),
    isAdmin() {
      return this.getAccountStaff?.role === ROLES.ADMIN;
    },
  },
  // beforeMount() {
  //   this.getAccount();
  // },
  methods: {
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    setAccessPermissions() {
      this.staffList = this.allStaffList;
      this.accountStaff = this.getAccountStaff;
      if (this.accountStaff.role === "admin") {
        this.newStaffList = this.staffList;
      } else {
        this.newStaffList = this.staffList.filter((staff) => {
          return staff.id === this.accountStaff.id;
        });
      }
    },
    openEditAccountModal(data) {
      this.account = data;
      this.otpValue = "";
      this.visibleModal.editAccount = true;
      this.isAddModal = false;
    },
    openAddAccountModal() {
      this.account = {};
      this.otpValue = "";
      this.visibleModal.editAccount = true;
      this.isAddModal = true;
    },
    // handleChangeTel(checked) {
    //   console.log(checked);
    // },
    async getAccount() {
      try {
        this.loading = true;
        const response = await accountService.getAccount();
        this.loading = false;
        if (response.data.success) {
          this.staffList = response.data.data;
          this.$store.commit("shop/setFullStaffList", response.data.data);
        }
      } catch (error) {
        console.log(error);
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        this.loading = false;
      }
      this.loading = true;
      setTimeout(() => {
        this.setAccessPermissions();
        this.loading = false;
      }, 500);
    },
    async checkOtp(otp) {
      if (otp && this.isAddModal) {
        try {
          const response = await accountService.checkOtpAccount(
            JSON.stringify({
              action: "Register_Staff",
              otp,
            })
          );
          if (response.data.success) {
            this.visibleModal.otpAccount = false;
            message.success(response.data.message);
            this.getAccount();
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      } else if (otp && !this.isAddModal) {
        try {
          const response = await accountService.checkOtpAccount(
            JSON.stringify({
              action: "Update_Staff",
              otp,
            })
          );
          if (response.data.success) {
            this.visibleModal.otpAccount = false;
            message.success(response.data.message);
            this.getAccount();
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      }
    },
    async handleCreateAccount(account) {
      const accountJSON = JSON.stringify(account);
      // khi thêm mới
      if (account && this.isAddModal) {
        //Gửi lên api
        try {
          const response = await accountService.addAccount(accountJSON);
          if (response.data.success) {
            //Thành công => mở modal otp
            this.visibleModal.editAccount = false;
            message.success(response.data.message);
            this.isSuccess = true;
            if (!this.visibleModal.editAccount) {
              setTimeout(() => {
                this.visibleModal.otpAccount = true;
                this.accountOtp = account;
              }, 500);
            }
          } else {
            message.error(response.data.message);
            this.isSuccess = false;
          }
        } catch (error) {
          console.log(error);
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
        // Khi cập nhật
      } else if (account && !this.isAddModal) {
        // nếu người dùng thay đổi số điện thoại thì cần otp nếu không thì thôi
        // if(this.isCheckChangeTel){}
        try {
          const response = await accountService.editAccount(
            accountJSON,
            account.id
          );
          if (response.data.success) {
            this.message = response.data.success.message;

            //Thành công => mở modal otp
            this.visibleModal.editAccount = false;
            message.success(response.data.message);
            if (!this.visibleModal.editAccount) {
              setTimeout(() => {
                this.visibleModal.otpAccount = true;
                this.accountOtp = account;
              }, 500);
            }
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      }
    },
    handleDeleteAccount(account) {
      this.visibleModal.deleteAccount = true;
      this.accountDelete = account;
    },
    handleCancel() {
      this.visibleModal.deleteAccount = false;
    },
    async handleClickDelete() {
      // for (let i = 0; i < this.staffList.length; i++) {
      //   if (this.idDelete === this.staffList[i].id) {
      //     this.staffList.splice(i, 1);
      //     this.visibleModal.deleteAccount = false;
      //     message.success("Đã xóa thành công tài khoản");
      //   }
      // }
      if (this.accountDelete) {
        try {
          const response = await accountService.deleteAccount(
            this.accountDelete.id
          );
          if (response.data.success) {
            this.visibleModal.deleteAccount = false;
            message.success(response.data.message);
            this.getAccount();
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          this.visibleModal.deleteAccount = false;
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.group-account {
  &__label {
    width: 123px;
    flex: none;
  }
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: calc((100% - 75px) - 24px);
    width: calc(100% - 30px);
    z-index: 1;
  }
}
.list-account {
  border-bottom: 1px solid #e0e0e0;
  .list-box {
    .g-radio .ant-radio.ant-radio-checked .ant-radio-inner::after {
      width: 50px;
      height: 50px;
    }
    //.list-left,
    //.list-right {
    //  max-width: 600px;
    //}
  }
}
</style>

<style lang="scss">
.group-account {
  .g-input {
    padding: 0 0.5rem !important;
    height: 2rem;
  }
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
}
.delete-account-modal {
  .delete-account-modal-action {
    .ant-btn {
      height: 40px;
      font-weight: 500;
    }
  }
}
</style>
