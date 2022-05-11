<!-- eslint-disable -->
<template>
  <div class="wrapper">
    <div class="wrapper-left">
      <g-button @click="onAddNewOrder" class="footer-button-create">
        <template #icon>
          <g-addtion-green />
        </template>
        Thêm đơn hàng
      </g-button>
      &#160;&#160;
      <g-checkbox v-model:checked="ruleCheckLocal">
        Tôi đã đọc và đồng ý
        <a
          target="_blank"
          class="term-des"
          href="https://admin.giaohangtietkiem.vn/files/templates/Bieuphi_Giaohangtietkiem.pdf"
          >Điều khoản & Quy định</a
        >.
      </g-checkbox>
    </div>
    <div class="wrapper-right">
      <g-button
        :disabled="!selectedListOrder.length"
        :class="{ 'remove-button': selectedListOrder.length }"
        class="footer-button"
        @click="onRemoveListOrder"
      >
        <template #icon>
          <g-remove-icon />
        </template>
        <span>Xóa {{ selectedListOrder.length }} ĐH</span>
      </g-button>
      <g-button
        :disabled="hideUploadOrder || loadingUpGHTK"
        @click="onSaveModal"
        class="footer-button"
      >
        <template #icon>
          <g-save-icon21 />
        </template>
        <span>Lưu nháp {{ selectedValidListOrder.length }} ĐH</span>
      </g-button>
      <!--      <g-button @click="onSetVisibleExcelModal(true)" class="footer-button">-->
      <!--        <template #icon>-->
      <!--          <g-export-icon />-->
      <!--        </template>-->
      <!--        <span>Xuất Excel {{ selectedValidListOrder.length }} ĐH</span>-->
      <!--      </g-button>-->
      <g-confirm-print-order
        :option="option"
        @updateOption="handleUpdateOption"
        @onPrintOrders="onPrintOrders"
      >
        <template #content>
          <g-button
            :disabled="!selectedValidListOrder.length"
            class="footer-button"
          >
            <template #icon>
              <g-print-icon />
            </template>
            <span>In thông tin {{ selectedValidListOrder.length }} ĐH</span>
          </g-button>
        </template>
      </g-confirm-print-order>
      <g-button
        :disabled="
          !selectedValidListOrder.length ||
          loadingUpGHTK ||
          fetchingSaveOrder ||
          hideUploadOrder
        "
        @click="onVisibleConfirmModal(true)"
        class="footer-button"
      >
        <template #icon>
          <g-upload-icon />
        </template>
        <span>Đăng {{ selectedValidListOrder.length }} ĐH</span>
      </g-button>
    </div>
  </div>
  <g-export-excel-modal
    :visible="visibleExcelModal"
    :setVisible="onSetVisibleExcelModal"
  />
  <g-confirm-excel-order-form
    :visible="visibleConfirmModal"
    :setVisible="onVisibleConfirmModal"
    :selectedList="selectedValidListOrder"
    @onSubmit="onSubmit"
  />
  <g-print-order
    ref="printOrder"
    :option="option"
    :selected-list-order="selectedValidListOrder"
  />
</template>

<script>
import { ref } from "vue";

import GAddtionGreen from "@/components/icons/AddtionGreen.vue";
import GSaveIcon21 from "@/components/icons/SaveIcon21.vue";
// import GExportIcon from "@/components/icons/ExportIcon.vue";
import GPrintIcon from "@/components/icons/PrintIcon.vue";
import GUploadIcon from "@/components/icons/UploadIcon.vue";
import GRemoveIcon from "@/components/icons/RemoveIcon";

import GCheckbox from "@/components/elements/checkbox.vue";
import GButton from "@/components/elements/button.vue";

import GExportExcelModal from "@/components/modal/ExportExcelModal.vue";
import GConfirmExcelOrderForm from "@/components/modal/ConfirmExcelOrderForm.vue";
import GPrintOrder from "@/components/modal/PrintOrderModal.vue";

import GConfirmPrintOrder from "@/components/popover/ConfirmPrintOrder.vue";

export default {
  name: "FooterOrderExcel",
  components: {
    GButton,
    GCheckbox,
    GAddtionGreen,
    GSaveIcon21,
    // GExportIcon,
    GPrintIcon,
    GUploadIcon,
    GRemoveIcon,
    GExportExcelModal,
    GPrintOrder,
    GConfirmPrintOrder,
    GConfirmExcelOrderForm,
  },
  data() {
    return {
      option: {
        hasClientId: true,
        hasSort: true,
      },
    };
  },
  props: {
    selectedListOrder: Array,
    selectedValidListOrder: Array,
    fetchingSaveOrder: Boolean,
    loadingUpGHTK: Boolean,
    hideUploadOrder: Boolean,
    ruleCheck: Boolean,
  },
  computed: {
    ruleCheckLocal: {
      get() {
        return this.ruleCheck;
      },
      set(event) {
        this.$emit("updateRuleCheck", event.target.checked);
      },
    },
  },
  methods: {
    handleUpdateOption(value) {
      this.option = value;
    },
    onPrintOrders() {
      this.$refs.printOrder?.handlePrintOrders();
    },
  },
  setup(props, { emit }) {
    const visibleExcelModal = ref(false);
    const visibleConfirmModal = ref(false);

    const onSetVisibleExcelModal = (value) => {
      visibleExcelModal.value = value;
    };

    const onVisibleConfirmModal = (value) => {
      visibleConfirmModal.value = value;
    };

    const onSubmit = () => {
      emit("onSubmit");
    };

    const onSaveModal = () => {
      emit("saveListOrder");
    };

    const onAddNewOrder = () => {
      emit("addNewOrder");
    };

    const onRemoveListOrder = () => {
      emit("removeListOrder");
    };

    return {
      visibleExcelModal,
      visibleConfirmModal,
      onSetVisibleExcelModal,
      onVisibleConfirmModal,
      onAddNewOrder,
      onSaveModal,
      onRemoveListOrder,
      onSubmit,
    };
  },
};
</script>

<style lang="scss">
.footer-button-create {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px !important;
  > span {
    margin-left: 10px;
  }
}
</style>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  height: 68px;
  background: #fff;
  align-items: center;

  .footer-button-create {
    margin-left: 10px;
    width: 200px;
    height: 40px;
  }

  .remove-button {
    color: var(--dangerColor);
    border-color: var(--dangerColor);
  }

  .footer-button {
    margin-left: 10px;
    width: 60px;
    height: 40px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    > span {
      margin-left: 5px;
      font-size: 0.875rem;
    }

    @media only screen and (min-width: 1376px) {
      width: 200px;
    }

    > span {
      display: none;
      @media only screen and (min-width: 1376px) {
        display: block;
        margin-left: 8px;
      }
    }
  }

  .term-des {
    color: var(--primaryColor);
    text-decoration: underline;
  }

  .wrapper-left {
    display: flex;
    align-items: center;
  }

  .wrapper-right {
    display: flex;
  }
}
</style>
