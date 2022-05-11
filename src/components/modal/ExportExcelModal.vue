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
    <div class="export-order-modal-wrapper">
      <b class="uppercase"> Thông tin cần xuất Excel </b><br />
      <span>Vui lòng chọn các thông tin sau để xuất file</span><br />
      <div class="t-mt-3">
        <g-checkbox
          :checked="hiddenFields.length === 0"
          @change="handleChangeHiddenFields('all')"
        >
          Tất cả
        </g-checkbox>
      </div>
      <div class="options-wrapper flex t-mt-3">
        <div class="left_content">
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
      <div class="py-1">
        <b class="uppercase">Hình thức nhận</b>
      </div>
      <div class="receive-type mt-0">
        <g-checkbox :checked="receiveTypes.includes('directly')">
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
          <div class="input-email-wrapper">
            <g-checkbox
              :checked="!ignoreEmails.includes(index)"
              @change="handleChangeIgnoreEmail(index)"
            />
            <input placeholder="Nhập email nhận tệp tin Excel" />
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
        <g-checkbox :checked="receiveTypes.includes('gchat')">
          Gửi trực tiếp qua Chats
        </g-checkbox>
      </div>
      <div class="wrapper-btn-submit">
        <g-button class="primary w-100 mt-1"> Xác nhận </g-button>
      </div>
    </div>
  </g-modal>
</template>

<script>
import { GModal, GButton, GCheckbox } from "../elements";
import { removeAt } from "@/utils";

const leftOptionsInfo = [
  { title: "Mã ĐH", key: "id" },
  { title: "Mã ĐH shop", key: "id_order_shop" },
  { title: "Thông tin khách hàng", key: "customer_info" },
  { title: "thông tin sản phẩm", key: "product_info" },
];
const rightOptionsInfo = [
  { title: "Tiền CoD", key: "cod_price" },
  { title: "Thông tin lấy hàng", key: "receive_order" },
  { title: "Ghi chú", key: "note_info" },
  { title: "Thông tin vận chuyển", key: "express_info" },
];

export default {
  name: "OrderNoteModal",
  props: ["visible", "setVisible"],
  components: {
    GModal,
    GButton,
    GCheckbox,
  },
  data() {
    return {
      formType: "1",
      receiveEmails: [""],
      hiddenFields: [],
      receiveTypes: ["directly", "gchat"],
      ignoreEmails: [],
    };
  },
  computed: {
    leftOptions() {
      return leftOptionsInfo;
    },
    rightOptions() {
      return rightOptionsInfo;
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleOk() {
      console.log("ok");
    },
    handleAddEmail() {
      this.receiveEmails = this.receiveEmails.concat("");
    },
    handleRemoveEmailAt(index) {
      this.ignoreEmails = this.ignoreEmails.filter((item) => item !== index);
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
      this.ignoreEmails = this.ignoreEmails.includes(index)
        ? this.ignoreEmails.filter((item) => item !== index)
        : this.ignoreEmails.concat(index);
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) this.receiveEmails = [""];
    },
    formType() {
      this.hiddenFields = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.export-order-modal-wrapper {
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
    max-height: 94px;
    &.is-over {
      overflow-y: auto;
    }
    width: calc(100% + 30px);
    transform: translateX(-16px);
    padding: 0 15px;
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
      height: 22px;
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
