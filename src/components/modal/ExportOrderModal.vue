<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    title="Xuất Excel"
    @cancel="handleCancel"
  >
    <div class="export-order-modal-wrapper">
      <b class="uppercase" style="font-size: 16px"> Thông tin cần xuất Excel </b
      ><br />
      <span style="color: #808080; font-size: 16px"
        >Vui lòng chọn các thông tin sau để xuất file</span
      ><br />
      <a-radio-group
        class="px"
        :value="formType"
        @change="handleChangeFormType"
      >
        <g-radio :value="'1'">
          <span
            style="font-size: 16px"
            :class="{ 'medium-text': formType === '1' }"
            >Mẫu thông tin</span
          >
        </g-radio>
        <g-radio :value="'2'">
          <span
            style="font-size: 16px"
            :class="{ 'medium-text': formType === '2' }"
            >Mẫu đối soát</span
          >
        </g-radio>
      </a-radio-group>
      <div class="options-wrapper flex">
        <div class="left_content">
          <g-checkbox
            :checked="hiddenFields.length === 0"
            @change="handleChangeHiddenFields('all')"
            style="font-size: 16px"
            ><span style="font-size: 16px">Tất cả</span></g-checkbox
          >
          <g-checkbox
            v-for="option in leftOptions"
            :key="option.key"
            :checked="!hiddenFields.includes(option.key)"
            @change="handleChangeHiddenFields(option.key)"
          >
            <span style="font-size: 16px">{{ option.title }}</span>
          </g-checkbox>
        </div>
        <div class="right_content">
          <g-checkbox
            v-for="option in rightOptions"
            :key="option.key"
            :checked="!hiddenFields.includes(option.key)"
            @change="handleChangeHiddenFields(option.key)"
          >
            <span style="font-size: 16px">{{ option.title }}</span>
          </g-checkbox>
        </div>
      </div>
      <div
        class="py-1 flex align-items-center justify-content-space-between"
        style="padding-top: 1.5rem"
      >
        <div class="t-flex-1">
          <b class="uppercase">Hình thức nhận</b>
        </div>
        <div class="flex t-flex-1">
          <div>
            <g-checkbox
              :checked="type_file.includes('excel')"
              @change="handleChangeTypeExport('excel')"
              style="font-size: 16px"
              ><span style="font-size: 16px">Excel</span></g-checkbox
            >
          </div>
          <div class="ml-1">
            <g-checkbox
              :checked="type_file.includes('pdf')"
              @change="handleChangeTypeExport('pdf')"
              style="font-size: 16px"
              ><span style="font-size: 16px">PDF</span></g-checkbox
            >
          </div>
        </div>
      </div>
      <!-- <div class="receive-type mt-0" style="line-height: 32px">
        <g-checkbox :disabled="true" :checked="false">
          <span style="font-size: 16px">Tải trực tiếp về máy</span>
        </g-checkbox>
      </div> -->
      <div
        class="list-receive-emails"
        :class="{ 'is-over': receiveEmails.length > 3 }"
      >
        <div
          v-for="(email, index) in receiveEmails"
          :key="email.id"
          class="receive-type"
          style="line-height: 32px"
        >
          <div class="input-email-wrapper">
            <g-checkbox
              :checked="email.checked"
              @change="handleChangeIgnoreEmail(email.id)"
            />
            <div class="wrapper-input-email-receiver">
              <input
                style="font-size: 16px"
                placeholder="Nhập email nhận tệp tin Excel"
                @input="updateEmailAt($event, email.id)"
                :class="{
                  'in-valid': email.value && !isValidEmail(email.value),
                }"
              />
              <a-tooltip v-if="email.value && !isValidEmail(email.value)">
                <template #title> Định dạng email không hợp lệ </template>
                <info-icon class="icon-error-info" />
              </a-tooltip>
            </div>
          </div>
          <g-button
            v-if="index === 0"
            class="btn-add-email"
            @click="handleAddEmail"
          >
            <img src="@/assets/icons/plus_active.svg" />
            <span style="font-size: 16px">Email</span>
          </g-button>
          <g-button
            v-else
            class="btn-remove-email border-ranger"
            @click="handleRemoveEmailAt(email.id)"
          >
            <img src="@/assets/icons/remove.svg" />
          </g-button>
        </div>
      </div>
      <div class="receive-type" style="line-height: 32px">
        <g-checkbox
          :checked="receiveTypes.includes('chat')"
          @change="toggleSendToGchat"
        >
          <span style="font-size: 16px">Gửi trực tiếp qua Chats</span>
        </g-checkbox>
      </div>
      <div class="wrapper-btn-submit">
        <g-button
          class="primary w-100 mt-1"
          style="font-size: 16px"
          :loading="loading"
          @click="handleExport"
        >
          Xác nhận
        </g-button>
      </div>
    </div>
  </g-modal>
</template>

<script>
import { GModal, GButton, GCheckbox, GRadio } from "../elements";
import { isValidEmail, generateUUID } from "@/utils";
import orderService from "@/services/order.service";
import InfoIcon from "@/components/icons/InfoIcon.vue";

const leftOptionsInfo = [
  { title: "Mã ĐH", key: "alias" },
  { title: "Mã ĐH shop", key: "client_id" },
  { title: "Trạng thái đơn hàng", key: "package_status_id" },
  { title: "Thời gian tạo đơn", key: "created" },
  { title: "Thời gian hoàn thành", key: "done_at" },
  { title: "Khối lượng sản phẩm", key: "weight" },
  { title: "Thông tin khách hàng", key: "customer_information" },
  { title: "Tiền CoD", key: "pick_money" },
  { title: "Phí bảo hiểm", key: "insurance" },
  { title: "Phí giao hàng", key: "ship_money" },
];
const rightOptionsInfo = [
  { title: "Phí dịch vụ trả trước", key: "pre_paid_amount" },
  { title: "Phí dịch vụ cấn trừ", key: "prepayment_fee" },
  { title: "Phí dịch vụ hoàn lại", key: "return_trans_fee" },
  { title: "Phí chuyển hoàn", key: "return_fee" },
  { title: "Phí thay đổi địa chỉ giao", key: "ch_addr_fee" },
  { title: "Phí lưu kho", key: "store_fee" },
  { title: "Tiền tip", key: "prepayment_tip" },
  { title: "Phí dịch vụ đã thanh toán", key: "paid_service_fee" },
  { title: "Khuyến mãi", key: "discount" },
  { title: "Tiền shop thực nhận", key: "money_received_by_shop" },
  { title: "Ghi chú", key: "message" },
];

const leftOptionsAudit = [
  { title: "Mã ĐH", key: "alias" },
  { title: "Mã ĐH shop", key: "client_id" },
  { title: "Loại đơn", key: "order_type" },
  { title: "Đơn giao 1 phần", key: "return_part_package" },
  { title: "Thông tin khách hàng", key: "customer_information" },
  { title: "Thông tin sản phẩm", key: "product_information" },
  { title: "Khối lượng sản phẩm", key: "weight" },
  { title: "Tiền CoD", key: "pick_money" },
  { title: "Phí dịch vụ cuối cùng", key: "last_fee" },
  { title: "Phương thức vận chuyển", key: "transport" },
  { title: "Trạng thái đơn hàng", key: "package_status_id" },
];
const rightOptionsAudit = [
  { title: "Thời gian tạo đơn", key: "created" },
  { title: "Thời gian lấy thành công", key: "took_at" },
  { title: "Thời gian giao thành công", key: "done_at" },
  { title: "Thời gian trả hàng", key: "returned_at" },
  { title: "Thời gian đối soát", key: "audited_at" },
  { title: "Số lần lấy hàng", key: "nth_picked" },
  { title: "Số lần giao hàng", key: "nth_delivered" },
  { title: "Số lần trả hàng", key: "nth_returned" },
  { title: "Lý do delay giao hàng", key: "deliver_message" },
  { title: "Trạng thái trả hàng", key: "return_status" },
  { title: "Ghi chú đơn hàng", key: "message" },
];

export default {
  name: "OrderNoteModal",
  props: [
    "visible",
    "setVisible",
    "selectedIds",
    "exportExcelForAll",
    "exportFilter",
  ],
  components: {
    GModal,
    GButton,
    GCheckbox,
    GRadio,
    InfoIcon,
  },
  data() {
    const id = generateUUID();

    return {
      formType: "1",
      emails: {
        [id]: {
          id,
          value: "",
          checked: false,
        },
      },
      hiddenFields: [],
      receiveTypes: ["chat"],
      loading: false,
      type_file: ["excel"],
    };
  },
  computed: {
    leftOptions() {
      return this.formType === "2" ? leftOptionsInfo : leftOptionsAudit;
    },
    rightOptions() {
      return this.formType === "2" ? rightOptionsInfo : rightOptionsAudit;
    },
    receiveEmails() {
      let _receiveEmails = [];

      for (let id in this.emails) {
        if (this.emails[id]) {
          _receiveEmails.push(this.emails[id]);
        }
      }

      return _receiveEmails;
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeFormType(event) {
      this.formType = event.target.value;
    },
    handleAddEmail() {
      const id = generateUUID();
      this.emails = {
        ...this.emails,
        [id]: {
          id,
          value: "",
          checked: true,
        },
      };
    },
    handleRemoveEmailAt(id) {
      this.emails[id] = null;
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
    handleChangeIgnoreEmail(id) {
      this.emails[id] = {
        ...this.emails[id],
        checked: !this.emails[id].checked,
      };
    },
    updateEmailAt(event, id) {
      this.emails[id] = {
        ...this.emails[id],
        value: event.target.value,
        checked: event.target.value ? true : false,
      };
    },
    isValidEmail(_email) {
      return isValidEmail(_email);
    },
    toggleSendToGchat() {
      this.receiveTypes = this.receiveTypes.includes("chat")
        ? this.receiveTypes.filter((item) => item !== "chat")
        : this.receiveTypes.concat("chat");
    },
    async handleExport() {
      this.loading = true;

      try {
        const type = this.formType === "2" ? "audit" : undefined;

        const from = this.exportFilter?.customer_created_from;

        const to = this.exportFilter?.customer_created_to;

        const leftOptions = this.leftOptions
          .filter((item) => !this.hiddenFields.includes(item.key))
          .map((item) => item.key);

        const rightOptions = this.rightOptions
          .filter((item) => !this.hiddenFields.includes(item.key))
          .map((item) => item.key);

        const value = [...leftOptions, ...rightOptions];

        const email = this.receiveEmails
          .filter((item) => item.checked && this.isValidEmail(item.value))
          .map((item) => item.value);

        let export_type = [...this.receiveTypes];
        if (email.length !== 0) export_type.push("email");

        if (export_type.length === 2) export_type = "all";
        else export_type = export_type[0];
        let dataPost = {
          type,
          value,
          email,
          export_type,
          type_file: this.type_file,
        };

        if (this.exportExcelForAll) {
          dataPost.from = from;
          dataPost.to = to;
        } else {
          dataPost.order = this.selectedIds.map((item) => Number(item));
        }

        if (this.exportFilter) {
          const _exportFile = { ...this.exportFilter };

          delete _exportFile.page;
          delete _exportFile.limit;
          delete _exportFile.customer_created_from;
          delete _exportFile.customer_created_to;

          dataPost = { ...dataPost, ..._exportFile };
        }

        const response = await orderService.exportExcel(dataPost);

        if (response?.data?.success) {
          this.handleCancel();
          this.$message.success("Export Excel thành công!");
        } else {
          this.$message.error(response?.data?.message);
        }
      } catch (error) {
        console.error(error);
        this.$message.error(
          "Đã có lỗi xảy ra, hãy liên hệ CSKH để được hỗ trợ."
        );
      }

      this.loading = false;
    },
    handleChangeTypeExport(_type) {
      if (this.type_file.includes(_type)) {
        this.type_file = this.type_file.filter((t) => t !== _type);
      } else {
        this.type_file = this.type_file.concat(_type);
      }
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        const id = generateUUID();
        this.formType = "1";
        this.emails = {
          [id]: {
            id,
            value: "",
            checked: false,
          },
        };
        this.hiddenFields = [];
        this.receiveTypes = ["chat"];
        this.type_file = ["excel"];
      }
    },
    formType() {
      this.hiddenFields = [];
    },
    exportFilter(_exportFilter) {
      console.log(_exportFilter);
    },
  },
};
</script>

<style lang="scss" scoped>
.export-order-modal-wrapper {
  color: #000;
  .medium-text {
    font-weight: 500;
  }
  .options-wrapper {
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
  .receive-type {
    &:not(:first-child) {
      margin-top: 0.75rem;
    }
  }
  .list-receive-emails {
    margin-top: 0.75rem;
    max-height: 123px;
    &.is-over {
      overflow-y: auto;
    }
    width: calc(100% + 30px);
    transform: translateX(-16px);
    padding: 0 15px;
    .receive-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:not(:first-child) {
        margin-top: 0.75rem;
      }
    }
    .btn-add-email {
      height: 32px;
      width: 80px;
      justify-content: center;
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
      height: 32px;
      width: 32px;
      padding: 0 5px;
      img {
        height: 13px;
        transform: translate(0px, -1px);
      }
    }
    .input-email-wrapper {
      .wrapper-input-email-receiver {
        display: inline-flex;
        align-items: center;
        input {
          margin-left: 13px;
          border: none;
          outline: none;
          border-bottom: 1px solid var(--grayColor);
          width: 275px;
          transition: 0.15s linear;
          &:hover,
          &:active {
            border-bottom: 1px solid var(--primaryColor);
          }
          &.in-valid {
            border-bottom: 1px solid red;
          }
        }
      }
    }
  }
}
</style>
