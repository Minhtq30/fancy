<template>
  <main-content>
    <template #main>
      <div class="shop-info-finance__main-slot">
        <div class="mb-1">
          <span class="medium-text t-text-lg t-leading-5">
            Quản lý tiền & đối soát
          </span>
        </div>
        <div class="block-info t-flex t-flex-col xl:t-flex-row">
          <div class="t-flex-1">
            <div class="block-info-wrapper">
              <div class="block-info__left xl:t-max-w-[614px] t-w-full">
                <div class="medium-text mb-1">Tài khoản đối soát</div>
                <g-form-item
                  class="form-item flex t-justify-between"
                  :errorMessage="errorAccount?.against_bank_own"
                >
                  <template #label>
                    <label class="t-flex t-items-center"> Chủ tài khoản </label>
                  </template>
                  <template #content>
                    <g-input
                      :borderless="false"
                      v-model="against_bank_own"
                      placeholder="Nhập chủ tài khoản"
                      @input="
                        (event) => handleChangeField('against_bank_own', event)
                      "
                    />
                  </template>
                </g-form-item>
                <g-form-item
                  class="form-item flex t-justify-between"
                  :errorMessage="errorAccount?.against_bank_account"
                >
                  <template #label>
                    <label class="t-flex t-items-center"> Số tài khoản </label>
                  </template>
                  <template #content>
                    <g-input
                      :borderless="false"
                      :number-only="true"
                      v-model="against_bank_account"
                      placeholder="Nhập số tài khoản"
                      @input="
                        (event) =>
                          handleChangeField('against_bank_account', event)
                      "
                    />
                  </template>
                </g-form-item>
                <g-form-item
                  class="form-item flex t-justify-between"
                  :errorMessage="errorAccount?.bank"
                >
                  <template #label>
                    <label class="t-flex t-items-center"> Tên ngân hàng </label>
                  </template>
                  <template #content>
                    <g-select
                      :data-source="bankOptions"
                      v-model:selected-item="selectedBank"
                      placeholder="Chọn ngân hàng"
                      @on-selection-change="onChangeBank"
                    >
                      <template v-slot:option="{ item }">
                        <div class="t-flex t-flex-row t-items-center">
                          <p style="flex: 1" class="t-mb-0">{{ item.name }}</p>
                        </div>
                      </template>
                    </g-select>
                  </template>
                </g-form-item>
                <g-form-item class="form-item flex t-justify-between">
                  <template #label>
                    <label class="t-flex t-items-center"> Chi nhánh </label>
                  </template>
                  <template #content>
                    <g-select
                      :data-source="brandOfBankOptions"
                      :disabled="!selectedBank.value"
                      v-model:selected-item="selectedBranOfBank"
                      placeholder="Chọn chi nhánh ngân hàng"
                      @on-selection-change="onChangeBrandOfBank"
                    >
                      <template v-slot:option="{ item }">
                        <div class="t-flex t-flex-row t-items-center">
                          <p style="flex: 1" class="t-mb-0">{{ item.name }}</p>
                        </div>
                      </template>
                    </g-select>
                  </template>
                </g-form-item>
                <div class="flex t-justify-end w-100">
                  <g-button
                    :loading="loadingSendOTP"
                    @click="handleChangeAccount"
                    class="primary"
                  >
                    Lưu thay đổi
                  </g-button>
                </div>
              </div>
            </div>
            <div class="block-info-wrapper t-flex-1 mt-1">
              <div class="block-info__left xl:t-max-w-[614px] t-w-full">
                <g-form-item
                  class="form-item flex t-justify-between"
                  :errorMessage="errorAudit?.auditTime"
                  :noteMessage="textAuditOnePerWeek"
                >
                  <template #label>
                    <label class="t-flex t-items-center"> Lịch đối soát </label>
                  </template>
                  <template #content>
                    <g-select
                      :data-source="auditTimeOptions"
                      v-model:selected-item="selectedAuditTime"
                      placeholder="Chọn lịch đối soát"
                      @on-selection-change="onChangeAuditTime"
                      :showSearch="false"
                    >
                      <template v-slot:option="{ item }">
                        <div class="t-flex t-flex-row t-items-center">
                          <p style="flex: 1" class="t-mb-0">{{ item.name }}</p>
                        </div>
                      </template>
                    </g-select>
                  </template>
                </g-form-item>
                <g-form-item
                  v-if="selectedAuditTime.value === 'payment_by_amount_money'"
                  class="form-item flex t-justify-between"
                  :errorMessage="errorAudit?.auditMoney"
                >
                  <template #label>
                    <label class="t-flex t-items-center"> Số tiền </label>
                  </template>
                  <template #content>
                    <g-input
                      :borderless="false"
                      :number-only="true"
                      :formatter="$filters.integerFormatter"
                      :parser="$filters.numberCommaParser"
                      v-model="payment_amount_money"
                      placeholder="0"
                    />
                  </template>
                  <template #suffix><span>VND</span></template>
                </g-form-item>
                <div class="flex t-justify-end w-100">
                  <g-button
                    :disabled="!selectedAuditTime.value"
                    :loading="loadingSaveConfig"
                    @click="handleChangeAudit"
                    class="primary"
                  >
                    Lưu thay đổi
                  </g-button>
                </div>
              </div>
            </div>
          </div>
          <div class="block-info-wrapper t-flex-1 t-mt-[20px] xl:t-mt-0">
            <div
              class="block-info__right xl:t-max-w-[614px] t-w-full xl:t-ml-[0.5rem]"
              :class="{ 'is-approved': !isAllowEditVat }"
            >
              <div class="medium-text mb-1">Thông tin xuất hóa đơn VAT</div>
              <g-form-item
                class="form-item flex t-justify-between"
                :errorMessage="errorVat?.v_name"
              >
                <template #label>
                  <label class="t-flex t-items-center"> Tên đơn vị </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    :readonly="!isAllowEditVat"
                    v-model="v_name"
                    placeholder="Nhập tên đơn vị"
                    @input="(event) => handleChangeField('v_name', event)"
                  />
                </template>
              </g-form-item>
              <g-form-item class="form-item flex t-justify-between">
                <template #label>
                  <label class="t-flex t-items-center"> Mã số thuế </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    :readonly="!isAllowEditVat"
                    v-model="v_tax"
                    placeholder="Nhập mã số thuế"
                    @input="(event) => handleChangeField('v_tax', event)"
                  />
                </template>
              </g-form-item>
              <g-form-item
                class="form-item flex t-justify-between"
                :errorMessage="errorVat?.v_email"
              >
                <template #label>
                  <label class="t-flex t-items-center">
                    Email nhận hóa đơn
                  </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    :readonly="!isAllowEditVat"
                    v-model="v_email"
                    placeholder="Nhập email nhận hóa đơn"
                    @input="(event) => handleChangeField('v_email', event)"
                  />
                </template>
              </g-form-item>
              <g-form-item
                class="form-item flex t-justify-between"
                :errorMessage="errorVat?.v_add"
              >
                <template #label>
                  <label class="t-flex t-items-center"> Địa chỉ </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    :readonly="!isAllowEditVat"
                    v-model="v_add"
                    placeholder="Nhập địa chỉ"
                    @input="(event) => handleChangeField('v_add', event)"
                  />
                </template>
              </g-form-item>
              <g-form-item class="form-item flex t-justify-between">
                <template #label>
                  <label class="t-flex t-items-center"> Số điện thoại </label>
                </template>
                <template #content>
                  <g-input
                    :borderless="false"
                    :readonly="!isAllowEditVat"
                    :number-only="true"
                    v-model="v_phone"
                    placeholder="Nhập số điện thoại"
                    @input="(event) => handleChangeField('v_phone', event)"
                  />
                </template>
              </g-form-item>
              <g-form-item class="form-item flex t-justify-between">
                <template #label>
                  <label class="t-flex t-justify-center t-items-center" />
                </template>
                <template #content>
                  <g-checkbox
                    @change="is_active = !is_active"
                    :checked="is_active"
                    :size="'medium'"
                  >
                    Đăng ký nhận hóa đơn điện tử hàng tháng
                  </g-checkbox>
                </template>
              </g-form-item>
              <div class="flex t-justify-end w-100">
                <g-button
                  :loading="loadingUpdateVat"
                  @click="handleChangeVat"
                  class="primary"
                >
                  Lưu thay đổi
                </g-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main-content>
  <confirm-otp-modal
    :title="'Thay đổi thông tin tài khoản'"
    :phoneNumber="shopInfo?.tel"
    :visible="visibleModal.confirmOtp"
    :setVisible="setVisibleModal('confirmOtp')"
    :onSuccess="onSuccessConfirmOtp"
    :onSubmit="onConfirmOTP"
    :actionOTP="actionOTP"
  />
  <confirm-exit-modal
    :visible="visibleModal.confirmExit"
    :setVisible="setVisibleModal('confirmExit')"
    :onSubmit="handleExit"
  />
</template>

<script>
import { mapState } from "vuex";

import MainContent from "./main-content.vue";
import { GFormItem, GCheckbox, GButton } from "@/components/elements";
import ConfirmOtpModal from "@/components/modal/ConfirmOtpModal.vue";
import ConfirmExitModal from "./confirm-exit-modal.vue";
import { GInput, GSelect } from "@/components";
import services from "@/services";
import { isEmptyObject, isValidEmail, isValidPhone } from "@/utils";
import {
  MIN_AUDIT_MONEY,
  OPTION_AUDIT_ONE_TIME_PER_WEEK,
} from "@/contants/finance";

const KEY_1_TIME_WEEK = "1_time_week";

export default {
  components: {
    ConfirmOtpModal,
    MainContent,
    GCheckbox,
    GButton,
    GInput,
    GFormItem,
    GSelect,
    ConfirmExitModal,
  },
  data() {
    return {
      actionOTP: "Update_Profile_Shop",

      against_bank_own: "",
      against_bank_account: "",

      payment_amount_money: "",

      v_name: "",
      v_tax: "",
      v_email: "",
      v_phone: "",
      v_add: "",
      is_active: false,

      bankOptions: [],
      brandOfBankOptions: [],
      auditTimeOptions: [],

      selectedBank: { value: "", label: "" },
      selectedBranOfBank: { value: "", label: "" },
      selectedAuditTime: { value: "", label: "" },

      errorAccount: {},
      errorAudit: {},
      errorVat: {},

      loadingSendOTP: false,
      loadingUpdateVat: false,
      loadingSaveConfig: false,

      visibleModal: {
        confirmOtp: false,
        confirmExit: false,
      },

      allowExit: false,
      changeRouteTo: "",

      isAllowEditVat: false,
    };
  },
  methods: {
    updateShopInfo() {
      const shopInfo = this.shopInfo || {};

      const fields = ["against_bank_own", "against_bank_account"];

      this.selectedBank.value = shopInfo.against_bank_name;
      this.selectedBranOfBank.value = shopInfo.against_bank_brand;

      for (const field of fields) {
        this[field] = shopInfo[field];
      }
    },
    updateVatInfo() {
      const vatInfo = this.vatInfo || {};

      const fields = [
        "v_name",
        "v_tax",
        "v_email",
        "v_phone",
        "v_add",
        "is_active",
      ];

      for (const field of fields) {
        this[field] = vatInfo[field];
      }

      this.isAllowEditVat = vatInfo.status !== "approved";
    },
    updateConfigInfo() {
      let value = this.configInfo.value;

      if (OPTION_AUDIT_ONE_TIME_PER_WEEK.includes(value)) {
        value = KEY_1_TIME_WEEK;
      }

      this.selectedAuditTime.value = value;
      this.payment_amount_money = this.configInfo.condition;
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleChangeField(field, event) {
      this[field] = event.target.value;
      if (this.errorAccount[field]) {
        delete this.errorAccount[field];
      }
      if (this.errorAudit[field]) {
        delete this.errorAudit[field];
      }
      if (this.errorVat[field]) {
        delete this.errorVat[field];
      }
    },
    onChangeBank(bank) {
      this.selectedBank = bank;
      this.selectedBranOfBank = { value: "", label: "" };
      if (this.errorAccount.bank) {
        delete this.errorAccount.bank;
      }
    },
    onChangeBrandOfBank(brandOfBank) {
      this.selectedBranOfBank = brandOfBank;
      if (this.errorAccount.brandOfBank) {
        delete this.errorAccount.brandOfBank;
      }
    },
    onChangeAuditTime(auditTime) {
      this.selectedAuditTime = auditTime;
      this.payment_amount_money = this.configInfo.condition || "";
      if (this.errorAudit.auditTime) {
        delete this.errorAudit.auditTime;
      }
    },
    validateAccount() {
      let error = {};

      if (!this.against_bank_own) {
        error.against_bank_own = "Chưa nhập chủ tài khoản";
      }

      if (!this.against_bank_account) {
        error.against_bank_account = "Chưa nhập số tài khoản";
      }

      if (!this.selectedBank.value) {
        error.bank = "Chưa chọn ngân hàng";
      }

      return error;
    },
    validateVat() {
      let error = {};

      if (!this.v_name) {
        error.v_name = "Chưa nhập tên đơn vị";
      }

      if (!this.v_email) {
        error.v_email = "Chưa nhập email";
      } else {
        if (!isValidEmail(this.v_email)) {
          error.v_email = "Email không hợp lệ";
        }
      }

      if (!this.v_add) {
        error.v_add = "Chưa nhập địa chỉ";
      }

      if (this.v_phone && !isValidPhone(this.v_phone)) {
        error.v_phone = "SDT không hợp lệ";
      }

      return error;
    },
    getDataAcountUpdate() {
      const dataUpdate = {};

      if (this.against_bank_own !== this.shopInfo.against_bank_own) {
        dataUpdate.against_bank_own = this.against_bank_own;
      }
      if (this.against_bank_account !== this.shopInfo.against_bank_account) {
        dataUpdate.against_bank_account = this.against_bank_account;
      }
      if (this.selectedBank.value !== this.shopInfo.against_bank_name) {
        dataUpdate.against_bank_name = this.selectedBank.value;
      }
      if (
        this.selectedBranOfBank.value &&
        this.selectedBranOfBank.value !== this.shopInfo.against_bank_brand
      ) {
        dataUpdate.against_bank_brand = this.selectedBranOfBank.value;
      }

      return dataUpdate;
    },
    getDataVatUpdate() {
      const dataUpdate = {};

      if (this.v_name !== this.vatInfo.v_name) {
        dataUpdate.v_name = this.v_name;
      }
      if (this.v_tax && this.v_tax !== this.vatInfo.v_tax) {
        dataUpdate.v_tax = this.v_tax;
      }
      if (this.v_email !== this.vatInfo.v_email) {
        dataUpdate.v_email = this.v_email;
      }
      if (this.v_phone && this.v_phone !== this.vatInfo.v_phone) {
        dataUpdate.v_phone = this.v_phone;
      }
      if (this.v_add !== this.vatInfo.v_add) {
        dataUpdate.v_add = this.v_add;
      }
      if (this.is_active !== this.vatInfo.is_active) {
        dataUpdate.is_active = this.is_active ? 1 : 0;
      }

      return dataUpdate;
    },
    onSuccessConfirmOtp() {
      this.visibleModal.confirmOtp = false;
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
          const dataUpdate = this.getDataAcountUpdate();
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
    async updateProfile() {
      this.loadingSendOTP = true;
      let isSuccess = false;

      try {
        const dataUpdate = this.getDataAcountUpdate();

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
    async handleChangeAccount() {
      const error = this.validateAccount();

      this.errorAccount = error;

      if (!isEmptyObject(error)) {
        return;
      }

      const isUpdateSuccess = await this.updateProfile();

      if (isUpdateSuccess) {
        this.visibleModal.confirmOtp = true;
      }
    },
    async handleChangeAudit() {
      let error = {};
      if (!this.selectedAuditTime.value) {
        error.auditTime = "Chưa chọn thời gian đối soát";
      }

      this.errorAudit = error;

      if (!isEmptyObject(error)) {
        return;
      }

      let value = this.configInfo.value;

      if (OPTION_AUDIT_ONE_TIME_PER_WEEK.includes(this.configInfo.value)) {
        value = KEY_1_TIME_WEEK;
      }

      if (
        this.selectedAuditTime.value === value &&
        this.payment_amount_money === this.configInfo.condition
      ) {
        this.$message.warning("Dữ liệu không thay đổi");
        return;
      }

      this.loadingSaveConfig = true;

      try {
        const dataUpdate = {
          payment_period: this.selectedAuditTime.value,
        };

        if (this.selectedAuditTime.value === "payment_by_amount_money") {
          dataUpdate.payment_amount_money = Number(
            this.payment_amount_money || 0
          );

          if (dataUpdate.payment_amount_money < MIN_AUDIT_MONEY.value) {
            this.errorAudit = {
              auditMoney: `Số tiền tối thiểu là ${MIN_AUDIT_MONEY.format}`,
            };
            this.loadingSaveConfig = false;
            return;
          }
        }

        const response = await services.$shop.updateConfigInfo(dataUpdate);

        if (response?.data && response?.data.success) {
          const isValidDataUpdate =
            typeof response.data.data?.data === "string";
          const dataUpdateStore = {
            value: isValidDataUpdate
              ? response.data.data?.data
              : this.selectedAuditTime.value,
          };
          if (this.selectedAuditTime.value === "payment_by_amount_money") {
            dataUpdateStore.condition = Number(this.payment_amount_money || 0);
          }
          this.$store.commit("shop/updateConfigShopInfo", dataUpdateStore);
          this.$message.success(
            response?.data?.message || "Cập nhật lịch đối soát thành công"
          );
        } else {
          this.$message.error(
            response?.data?.message || "Cập nhật lịch đối soát thất bại"
          );
        }
      } catch (error) {
        console.log(error);
        this.$message.error(
          error?.response?.data?.message || "Cập nhật lịch đối soát thất bại"
        );
      }

      this.loadingSaveConfig = false;
    },
    async handleChangeVat() {
      if (this.isAllowEditVat) {
        const error = this.validateVat();

        this.errorVat = error;

        if (!isEmptyObject(error)) {
          return;
        }
      }

      this.loadingUpdateVat = true;

      try {
        const dataUpdate = this.getDataVatUpdate();

        if (isEmptyObject(dataUpdate)) {
          this.$message.warning("Dữ liệu không thay đổi");
          this.loadingUpdateVat = false;
          return;
        }

        const response = await services.$shop.updateVatInfo({
          ...dataUpdate,
          v_name: dataUpdate.v_name || this.v_name,
          v_email: dataUpdate.v_email || this.v_email,
          v_add: dataUpdate.v_add || this.v_add,
        });
        if (response?.data && response?.data.success) {
          this.$store.commit("shop/updateVatShopInfo", dataUpdate);
          this.$message.success(response?.data?.message);
        } else {
          this.$message.error(
            response?.data?.message ||
              "Cập nhật thông tin xuất hóa đơn VAT thất bại"
          );
        }
      } catch (error) {
        console.log(error);
        this.$message.error(
          error?.response?.data?.message ||
            "Cập nhật thông tin xuất hóa đơn VAT thất bại"
        );
      }

      this.loadingUpdateVat = false;
    },
    async getListBank() {
      try {
        const response = await services.$shop.getBankList({ type: 1 });

        if (response?.data?.success) {
          this.bankOptions = (response?.data?.data?.bank || []).map((o) => ({
            ...o,
            label: o.name,
            value: o.code,
          }));
          this.auditTimeOptions = (response?.data?.data?.audit_time || []).map(
            (o) => ({
              ...o,
              label: o.name,
            })
          );
        } else {
          this.$message.error(
            response?.data?.message || "Lấy danh sách ngân hàng thất bại"
          );
        }
      } catch (error) {
        console.log(error);
        this.$message.error(
          error?.response?.data?.message || "Lấy danh sách ngân hàng thất bại"
        );
      }
    },
    async getListBrandOfBank(pcode) {
      try {
        const response = await services.$shop.getBankList({
          type: 2,
          pcode,
        });
        if (response?.data?.success) {
          this.brandOfBankOptions = (response?.data?.data?.bank || []).map(
            (o) => ({
              ...o,
              label: o.name,
              value: o.code,
            })
          );
        } else {
          this.$message.error(
            response?.data?.message ||
              "Lấy danh sách chi nhánh ngân hàng thất bại"
          );
        }
      } catch (error) {
        console.log(error);
        this.$message.error(
          error?.response?.data?.message ||
            "Lấy danh sách chi nhánh ngân hàng thất bại"
        );
      }
    },
    handleExit() {
      this.allowExit = true;
      this.visibleModal.confirmExit = false;
      this.$router.push(this.changeRouteTo);
    },
    updateBankSelected() {
      let label = "";

      for (const item of this.bankOptions) {
        if (item.code === this.selectedBank.value) {
          label = item.name;
        }
      }

      this.selectedBank.label = label;
    },
    updateBrandOfBankSelected() {
      let label = "";

      for (const item of this.brandOfBankOptions) {
        if (
          item?.code?.toString() === this.selectedBranOfBank.value.toString()
        ) {
          label = item.name;
        }
      }

      this.selectedBranOfBank.label = label;
    },
    updateAuditTimeSelected() {
      let label = "";

      for (const item of this.auditTimeOptions) {
        if (item.value === this.selectedAuditTime.value) {
          label = item.name;
        }
      }

      this.selectedAuditTime.label = label;
    },
  },
  mounted() {
    this.updateShopInfo();
    this.updateVatInfo();
    this.updateConfigInfo();

    this.getListBank({ type: 1 });
  },
  computed: {
    ...mapState({
      shopInfo: (state) => {
        const _shop = state.shop?.Shop || {};
        return {
          against_bank_own: _shop.against_bank_own || "",
          against_bank_account: _shop.against_bank_account || "",
          against_bank_name: _shop.against_bank_name || "",
          against_bank_brand: _shop.against_bank_brand || "",
          tel: _shop.tel || "",
        };
      },
      vatInfo: (state) => {
        const _vat = state.shop?.VAT || {};
        return {
          v_name: _vat.v_name || "",
          v_tax: _vat.v_tax || "",
          v_email: _vat.v_email || "",
          v_phone: _vat.v_phone || "",
          v_add: _vat.v_add || "",
          is_active: _vat.is_active === 1 ? true : false,
          status: _vat.status || "",
        };
      },
      configInfo: (state) => {
        const _config = state.shop?.Config || {};
        let condition = "";
        if (Number(_config.condition) * 1 === Number(_config.condition)) {
          condition = _config.condition;
        }
        return {
          value: _config.value || "",
          condition,
        };
      },
      textAuditOnePerWeek() {
        const value = this.configInfo.value;

        if (this.selectedAuditTime.value === KEY_1_TIME_WEEK) {
          if (value === "payment_once_per_week_monday") {
            return "Đối soát 1 lần/tuần vào thứ 2";
          }
          if (value === "payment_once_per_week_tuesday") {
            return "Đối soát 1 lần/tuần vào thứ 3";
          }
          if (value === "payment_once_per_week_wednesday") {
            return "Đối soát 1 lần/tuần vào thứ 4";
          }
          if (value === "payment_once_per_week_thursday") {
            return "Đối soát 1 lần/tuần vào thứ 5";
          }
        } else {
          return "";
        }
      },
    }),
    notChange() {
      let auditKey = this.configInfo.value;
      if (OPTION_AUDIT_ONE_TIME_PER_WEEK.includes(auditKey)) {
        auditKey = KEY_1_TIME_WEEK;
      }
      return (
        this.against_bank_own === this.shopInfo.against_bank_own &&
        this.against_bank_account === this.shopInfo.against_bank_account &&
        this.payment_amount_money === this.configInfo.condition &&
        this.v_name === this.vatInfo.v_name &&
        this.v_tax === this.vatInfo.v_tax &&
        this.v_email === this.vatInfo.v_email &&
        this.v_phone === this.vatInfo.v_phone &&
        this.v_add === this.vatInfo.v_add &&
        this.is_active === this.vatInfo.is_active &&
        this.selectedBank.value === this.shopInfo.against_bank_name &&
        this.selectedBranOfBank.value === this.shopInfo.against_bank_brand &&
        this.selectedAuditTime.value === auditKey
      );
    },
  },
  watch: {
    shopInfo() {
      this.updateShopInfo();
    },
    vatInfo() {
      this.updateVatInfo();
    },
    configInfo() {
      this.updateConfigInfo();
    },
    "selectedBank.value"(event) {
      if (event) {
        this.getListBrandOfBank(event);
      } else {
        this.brandOfBankOptions = [];
      }
      this.updateBankSelected();
    },
    "selectedBranOfBank.value"() {
      this.updateBrandOfBankSelected();
    },
    "selectedAuditTime.value"() {
      this.updateAuditTimeSelected();
    },
    bankOptions() {
      this.updateBankSelected();
    },
    brandOfBankOptions() {
      this.updateBrandOfBankSelected();
    },
    auditTimeOptions() {
      this.updateAuditTimeSelected();
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
.shop-info-finance__main-slot {
  .block-info {
    &__left,
    &__right {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
    }
    &__left {
      margin-right: 0.5rem;
    }
    //&__right {
    //  margin-left: 0.5rem;
    //}
  }
}
</style>

<style lang="scss">
.shop-info-finance__main-slot {
  .form-item {
    label {
      width: 160px;
      &.g-checkbox {
        width: 100%;
      }
    }
    .content-wrapper {
      flex: 1;
      .g-input {
        padding: 0 11px;
        height: 2rem;
        font-size: 16px;
      }
      .search__wrapper {
        .g-input {
          padding: 0;
        }
      }
      .g-select__wrapper--disabled {
        opacity: 0.5;
      }
    }
  }
  .ant-select-selector {
    border-color: #c4c4c4 !important;
    color: rgba(0, 0, 0, 0.65);
    border-radius: 5px !important;
  }
  .ant-select-focused:not(.ant-select-disabled).ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector {
    border-color: #c4c4c4 !important;
  }
  .is-approved {
    .g-input {
      opacity: 0.65;
      background-color: #c4c4c4;
    }
  }
}
</style>
