<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    title="Xuất Excel"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="export-excel-modal-wrapper t-text-black">
      <b class="uppercase t-text-black"> TÌm kiếm </b><br />
      <div>
        <div class="t-flex t-items-center t-justify-between t-mt-[10px]">
          <label class="t-text-black">Loại biên bản</label>
          <g-dropdown-select
            class="t-w-[300px]"
            :placeholder="'Trạng thái hóa đơn'"
            :options="reportTypeValue"
            :is-single="true"
            :value="[reportType]"
            :onChange="handleChangeReportType"
          />
        </div>
        <div
          class="t-flex t-items-center t-justify-between t-my-[15px]"
          v-if="reportType === 'export-summary-session'"
        >
          <label class="t-text-black t-flex-1">Thời gian tạo biên bản</label>
          <g-select
            class="t-w-[300px]"
            inputJustify="center"
            :show-search="false"
            optionAlign="center"
            :placeholder="'Chọn thời gian'"
            :data-source="formattedTimeWithdrawal"
            v-model:selected-item="timeWithdrawalSelected"
          ></g-select>
        </div>
        <div class="t-flex t-items-center t-justify-between t-mt-[15px]" v-else>
          <label class="t-text-black">
            {{
              reportType === "report-transaction"
                ? "Thời gian giao dịch"
                : "Thời gian tạo đơn hàng"
            }}
          </label>
          <g-daterange-picker-select
            class="t-w-[300px]"
            showCancelOption="true"
            :removeOption="removeOptionKey"
            :placeholder="'Thời gian'"
            :controlTime="true"
            :allowClear="true"
            :iconType="'arrow'"
            :showTooltip="true"
            :control-time="false"
            :onChange="handleChangeTime"
            :from-date="fromDate"
            :to-date="toDate"
          />
        </div>
        <div
          class="t-flex t-items-center t-justify-between t-my-[15px]"
          v-if="reportType === 'report-transaction'"
        >
          <label class="t-text-black">Loại giao dịch</label>
          <tree-select
            class="t-w-[300px]"
            :placeholder="'Loại giao dịch'"
            :options="typePayment"
            :value="paymentKeys"
            :onChange="handleChangeTypeOrder"
            :checkAll="true"
          ></tree-select>
        </div>
        <div
          class="t-flex t-items-center t-justify-between t-my-[15px]"
          v-if="reportType === 'export-package-money'"
        >
          <label class="t-text-black t-flex-1">Địa chỉ lấy hàng</label>
          <g-dropdown-select
            class="t-w-[300px]"
            :placeholder="'Kho lấy hàng'"
            :options="pickAddressList"
            :value="pickAddressId"
            :onChange="handleChangeStorage"
          />
        </div>
        <div
          class="t-flex t-items-center t-justify-between t-my-[15px]"
          v-if="reportType === 'export-package-money'"
        >
          <label class="t-text-black">Trạng thái đơn hàng</label>
          <g-dropdown-select
            class="t-w-[300px]"
            :placeholder="'Trạng thái đơn hàng'"
            :options="listPackageStatus"
            :value="packageStatusId"
            :onChange="handleChangePackageStatus"
          />
        </div>
      </div>
      <b class="uppercase t-text-black"> Thông tin cần xuất Excel </b><br />
      <span class="t-text-[#808080]"
        >Vui lòng chọn các thông tin sau để xuất file</span
      ><br />
      <div class="options-wrapper flex t-mt-3">
        <div class="left_content">
          <g-checkbox
            :checked="hiddenFields.length === 0"
            @change="handleChangeHiddenFields('all')"
            >Tất cả</g-checkbox
          >
          <g-checkbox
            v-for="option in leftOptions"
            :key="option.key"
            :checked="!hiddenFields.includes(option.key)"
            @change="handleChangeHiddenFields(option.key)"
          >
            {{ option.title }}
          </g-checkbox>
        </div>
        <div class="right_content">
          <g-checkbox
            v-for="option in rightOptions"
            :key="option.key"
            :checked="!hiddenFields.includes(option.key)"
            @change="handleChangeHiddenFields(option.key)"
          >
            {{ option.title }}
          </g-checkbox>
        </div>
      </div>
      <div class="t-pt-[15px]">
        <b class="uppercase">Hình thức nhận</b>
      </div>
      <div class="receive-type mt-0" v-if="false">
        <g-checkbox :checked="download" @change="download = !download">
          Tải trực tiếp về máy
        </g-checkbox>
      </div>
      <div
        class="list-receive-emails"
        :class="{ 'is-over': receiveEmails.length > 3 }"
      >
        <div
          v-for="(email, index) in receiveEmails"
          :key="index"
          class="receive-type"
        >
          <div class="input-email-wrapper t-flex">
            <g-checkbox
              :checked="email.checked"
              @change="handleChangeIgnoreEmail(index)"
            />
            <input
              v-model="receiveEmails[index].email"
              placeholder="Nhập email nhận tệp tin Excel"
              :class="{
                'in-valid': email.email && !isValidEmail(index),
              }"
            />
            <a-tooltip v-if="email.email && !isValidEmail(index)">
              <template #title> Định dạng email không hợp lệ </template>
              <info-icon class="icon-error-info t-ml-[5px]" />
            </a-tooltip>
          </div>
          <g-button
            v-if="index === 0"
            class="btn-add-email"
            @click="handleAddEmail"
          >
            <img src="@/assets/icons/plus_active.svg" /> <span>Email</span>
          </g-button>
          <g-button
            v-else
            class="btn-remove-email border-ranger"
            @click="handleRemoveEmailAt(index)"
          >
            <img src="@/assets/icons/remove.svg" />
          </g-button>
        </div>
      </div>
      <div class="receive-type">
        <g-checkbox :checked="gchats" @change="gchats = !gchats">
          Gửi trực tiếp qua Chats
        </g-checkbox>
      </div>
      <div class="wrapper-btn-submit">
        <g-button
          class="primary w-100 mt-1"
          @click="handleSubmit"
          :loading="loading"
        >
          Xác nhận
        </g-button>
      </div>
    </div>
  </g-modal>
</template>

<script>
import { GDaterangePickerSelect } from "@/components";
import { GModal, GButton, GCheckbox } from "../../elements";
import { isValidEmail, removeAt } from "@/utils";
import { message } from "ant-design-vue";
import financeService from "@/services/finance.service";
import TreeSelect from "@/components/select/TreeSelect";
import { PAYMENT_FINACE_TYPE } from "@/contants";
import moment from "moment";
import InfoIcon from "@/components/icons/InfoIcon";
import GDropdownSelect from "@/components/select/DropdownSelect.vue";
import GSelect from "@/components/common/GSelect";
import {
  OPTIONS_INFO_EXPORT_EXCEL,
  OPTIONS_REPORT_TYPE,
  PACKAGE_STATUS,
} from "@/contants/finance";

export default {
  props: ["visible", "setVisible"],
  components: {
    InfoIcon,
    TreeSelect,
    GModal,
    GButton,
    GCheckbox,
    GDaterangePickerSelect,
    GDropdownSelect,
    GSelect,
  },
  data() {
    return {
      removeOptionKey: ["all", "7_days_ago", "30_days_ago"],
      typePayment: PAYMENT_FINACE_TYPE,
      formType: "1",
      pickAddressId: [],
      packageStatusId: [],
      reportType: "export-summary-session",
      timeWithdrawalSelected: {},
      hiddenFields: [],
      gchats: true,
      download: true,
      loading: false,
      emails: [],
      paymentKeys: [],
      listTimeWithdrawal: [],
      fromDate: moment().startOf("isoWeek"),
      toDate: moment().endOf("isoWeek"),
      receiveEmails: [],
    };
  },
  mounted() {
    this.getTimeAutomaticWithdrawal();
    this.pickAddressId = this.pickAddressList
      .filter((p) => p.key !== "all")
      .map((p) => p.key);
    this.packageStatusId = this.listPackageStatus
      .filter((p) => p.key !== "all")
      .map((p) => p.key);
    this.receiveEmails.push({
      email: this.$store.state.shop.Shop.email || "",
      checked: true,
      checkEmail: true,
    });
  },
  computed: {
    leftOptions() {
      return OPTIONS_INFO_EXPORT_EXCEL.filter(
        (o) => o.reportType.includes(this.reportType) && o.alignItems === "left"
      );
    },
    rightOptions() {
      return OPTIONS_INFO_EXPORT_EXCEL.filter(
        (o) =>
          o.reportType.includes(this.reportType) && o.alignItems === "right"
      );
    },
    listOptions() {
      return this.leftOptions.concat(this.rightOptions);
    },
    listPackageStatus() {
      return PACKAGE_STATUS;
    },
    reportTypeValue() {
      return OPTIONS_REPORT_TYPE;
    },
    formattedTimeWithdrawal() {
      const formattedArray = this.listTimeWithdrawal.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      return formattedArray || [];
    },
    pickAddressList() {
      let pickAddressList = Array.isArray(this.$store.state.shop.PickAddress)
        ? this.$store.state.shop.PickAddress
        : [];
      const pickAddresses = pickAddressList.map((w) => ({
        ...w,
        key: w.id,
        title: w.first_address + ", " + w.last_address,
      }));
      if (pickAddresses.length) {
        return [{ key: "all", title: "Tất cả" }, ...pickAddresses];
      }
      return [];
    },
  },
  methods: {
    isValidEmail(index) {
      this.receiveEmails[index].checkEmail = isValidEmail(
        this.receiveEmails[index].email
      );
      return isValidEmail(this.receiveEmails[index].email);
    },
    handleChangeTypeOrder(_value) {
      this.paymentKeys = _value;
    },
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeTime(data) {
      this.fromDate = data.fromDate
        ? data.fromDate
        : moment().startOf("isoWeek");
      this.toDate = data.toDate ? data.toDate : moment().endOf("isoWeek");
    },
    handleChangeStorage(_value) {
      this.pickAddressId = _value;
    },
    handleChangePackageStatus(_value) {
      this.packageStatusId = _value;
    },
    handleChangeReportType(_value) {
      this.hiddenFields = [];
      if (_value.length !== 0) {
        this.reportType = _value.toString();
      } else {
        this.reportType = "export-summary-session";
      }
    },
    async getTimeAutomaticWithdrawal() {
      try {
        const response = await financeService.getTimeAutomaticWithdrawal();
        if (response?.data?.success) {
          this.listTimeWithdrawal = response?.data?.data?.list_date || [];
          this.timeWithdrawalSelected = this.formattedTimeWithdrawal[0] || {};
        }
      } catch (error) {
        console.log("Đã có lỗi xảy ra, vui lòng thử lại sau.");
      }
    },
    async handleSubmit() {
      const listOptions = this.listOptions
        .filter((list) => {
          return !this.hiddenFields.includes(list.key);
        })
        .map((list) =>
          this.reportType === "report-transaction" ? list.title : list.key
        );
      const mailArray = this.receiveEmails
        .filter((e) => e.email && e.checked && e.checkEmail)
        .map((e) => e.email);
      let data = {
        emails: mailArray || [],
        chats: this.gchats === true ? 1 : 0,
      };
      if (this.reportType === "report-transaction") {
        data = {
          ...data,
          fromDate: moment(this.fromDate).format("DD/MM/YYYY HH:mm:ss"),
          toDate: moment(this.toDate).format("DD/MM/YYYY HH:mm:ss"),
          paymentKeys: this.paymentKeys,
          displayCols: listOptions || [],
        };
      } else if (this.reportType === "export-summary-session") {
        data = {
          ...data,
          date: this.timeWithdrawalSelected.value,
          keys: listOptions || [],
        };
      } else if (this.reportType === "export-package-money") {
        data = {
          ...data,
          fromDate: moment(this.fromDate).format("DD/MM/YYYY"),
          toDate: moment(this.toDate).format("DD/MM/YYYY"),
          pickAddressId: this.pickAddressId || [],
          packageStatusId: this.packageStatusId || [],
          keys: listOptions || [],
        };
      }
      try {
        this.loading = true;
        const response = await financeService.exportExcel(
          data,
          this.reportType
        );
        if (response?.data?.success) {
          message.success(response.data.message || "Xuất file thành công!");
          let url = response.data.url;
          if (url) {
            window.open(url, "_blank");
          }
          this.setVisible(false);
        } else {
          message.error(
            response.data.message || "Đã có lỗi xảy ra, vui lòng thử lại!"
          );
        }
      } catch (error) {
        message.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
      }
      this.loading = false;
    },
    handleAddEmail() {
      this.receiveEmails = this.receiveEmails.concat({
        email: "",
        checked: true,
        checkEmail: true,
      });
    },
    handleRemoveEmailAt(index) {
      this.emails = this.emails.filter((item) => item !== index);
      this.receiveEmails = removeAt(this.receiveEmails, index);
    },
    handleChangeHiddenFields(key) {
      if (key === "all") {
        if (this.hiddenFields.length !== 0) this.hiddenFields = [];
      } else {
        this.hiddenFields = this.hiddenFields.includes(key)
          ? this.hiddenFields.filter((field) => field !== key)
          : this.hiddenFields.concat(key);
      }
    },
    handleChangeIgnoreEmail(index) {
      this.receiveEmails[index].checked = !this.receiveEmails[index].checked;
    },
  },
  watch: {
    visible(_visible) {
      if (_visible && this.receiveEmails?.length > 1) {
        this.receiveEmails = this.receiveEmails.filter(
          (e) => e.email !== "" && e.checked === true && e.checkEmail === true
        );
      }
    },
    formType() {
      this.hiddenFields = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.export-excel-modal-wrapper {
  .options-wrapper {
    height: 180px;
    overflow-y: auto;
    .left_content,
    .right_content {
      flex: 1;
      .g-checkbox {
        display: block;
        margin-left: 0;
        &:not(:first-child) {
          padding-top: 0.75rem;
        }
      }
    }
  }
  .list-receive-emails {
    max-height: 112px;
    padding: 0.75rem 10px 0.75rem 0;
    overflow: auto;
    &.is-over {
      overflow-y: auto;
    }
    .receive-type {
      height: 23px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:first-child) {
        margin-top: 0.75rem;
      }
    }
    .btn-add-email {
      height: 27px;
      padding: 0 5px;
      display: flex;
      align-items: center;
      img {
        height: 14px;
        margin-right: 5px;
      }
      span {
        transform: translateY(1px);
      }
    }
    .btn-remove-email {
      height: 22px;
      padding: 0 5px;
      display: flex;
      align-items: center;
      img {
        height: 13px;
        transform: translate(0px, -1px);
      }
    }
    .input-email-wrapper {
      input {
        margin-left: 13px;
        border: none;
        outline: none;
        border-bottom: 1px solid var(--grayColor);
        width: 275px;
        &:hover,
        &:active {
          border-bottom: 1px solid var(--primaryColor);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.export-excel-modal-wrapper {
  .g-daterange-picker-select-wrapper {
    input {
      font-size: 14px !important;
    }
  }
  .in-valid {
    border-bottom: 1px solid red !important;
  }
  .g-dropdown-select {
    input {
      font-size: 14px !important;
    }
  }
  .g-select__wrapper {
    input {
      cursor: pointer;
    }
  }
}
</style>
