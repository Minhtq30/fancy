<!-- eslint-disable -->
<template>
  <div class="wrapper">
    <div class="wrapper-right">
      <div class="spin-load-more" v-show="loadMore">
        <a-spin :indicator="indicator" :spinning="loadMore" />
        <span>Đang tải thêm ...</span>
      </div>
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
        @click="handleUpdateAll"
        :disabled="!hasChange || loadingUpGHTK || fetchingSaveOrder"
        class="footer-button"
      >
        <template #icon>
          <g-edit-icon />
        </template>
        <span>Lưu thay đổi</span>
      </g-button>
      <!--      <g-button-->
      <!--        :disabled="!selectedValidListOrder.length"-->
      <!--        @click="onSetVisibleExcelModal(true)"-->
      <!--        class="footer-button"-->
      <!--      >-->
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
          !selectedValidListOrder.length || loadingUpGHTK || fetchingSaveOrder
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
    :option="optionsPrint"
    :selected-list-order="listOrderPrint"
  />
</template>

<script>
import { h, ref } from "vue";
import { forEach } from "lodash";

// import GExportIcon from "@/components/icons/ExportIcon.vue";
import GPrintIcon from "@/components/icons/PrintIcon.vue";
import GUploadIcon from "@/components/icons/UploadIcon.vue";
import GEditIcon from "@/components/icons/EditIcon.vue";
import GRemoveIcon from "@/components/icons/RemoveIcon";
import GButton from "@/components/elements/button.vue";

import GExportExcelModal from "@/components/modal/ExportExcelModal.vue";
import GConfirmExcelOrderForm from "@/components/modal/ConfirmExcelOrderForm.vue";
import GPrintOrder from "@/components/modal/PrintOrderModal.vue";

import GConfirmPrintOrder from "@/components/popover/ConfirmPrintOrder.vue";
import { LoadingOutlined } from "@ant-design/icons-vue";

export default {
  name: "FooterOrderDraft",
  components: {
    GButton,
    // GExportIcon,
    GPrintIcon,
    GUploadIcon,
    GRemoveIcon,
    GEditIcon,
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
      orderIdPrint: "",
      optionPrint: {},
      timer: null,
    };
  },
  props: {
    selectedListOrder: Array,
    listOrder: Array,
    validListOrder: Array,
    selectedValidListOrder: Array,
    fetchingSaveOrder: Boolean,
    loadingUpGHTK: Boolean,
    hideUploadOrder: Boolean,
    ruleCheck: Boolean,
    loadMore: Boolean,
    listUpdate: Object,
  },
  computed: {
    hasChange() {
      let flag = false;
      forEach(this.validListOrder, (item) => {
        if (this.listUpdate[item.orderId] === "update" && !flag) {
          flag = true;
        }
      });

      return flag;
    },
    ruleCheckLocal: {
      get() {
        return this.ruleCheck;
      },
      set(event) {
        this.$emit("updateRuleCheck", event.target.checked);
      },
    },
    optionsPrint() {
      // Nếu là in đơn lẻ thì nhận option của đơn lẻ.
      if (this.orderIdPrint) {
        return this.optionPrint;
      }
      // Nếu ko có đơn lẻ để in thì nhận option của nhiều đơn
      return this.option;
    },
    listOrderPrint() {
      // Nếu là in đơn lẻ thì nhận option của đơn lẻ.
      if (this.orderIdPrint) {
        const order = this.listOrder.find(
          (item) => item.orderId === this.orderIdPrint
        );
        return [order];
      }
      // Nếu ko có đơn lẻ để in thì nhận option của nhiều đơn
      return this.selectedValidListOrder;
    },
  },
  methods: {
    handleUpdateAll() {
      this.$emit("updateAll");
    },
    handleUpdateOption(value) {
      this.option = value;
    },
    onPrintOrders(options = {}) {
      const { orderId, option } = options;
      if (orderId) {
        this.orderIdPrint = orderId;
        this.optionPrint = option;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.printOrder?.handlePrintOrders();
      }, 100);
    },
  },
  setup(props, { emit }) {
    const visibleExcelModal = ref(false);
    const visibleConfirmModal = ref(false);
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "20px",
      },
      spin: true,
    });

    const onSetVisibleExcelModal = (value) => {
      visibleExcelModal.value = value;
    };

    const onVisibleConfirmModal = (value) => {
      visibleConfirmModal.value = value;
    };

    const onSubmit = () => {
      emit("onSubmit");
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
      onSubmit,
      onAddNewOrder,
      onRemoveListOrder,
      indicator,
    };
  },
  unmounted() {
    clearTimeout(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: right;
  height: 68px;
  background: #fff;
  align-items: center;

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

  .remove-button {
    color: var(--dangerColor);
    border-color: var(--dangerColor);
  }

  .spin-load-more {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 140px;
    font-size: 0.876rem;
    margin-right: 15px;
    color: var(--primaryColor);
  }

  .wrapper-right {
    display: flex;
  }

  .term-des {
    color: var(--primaryColor);
    text-decoration: underline;
  }
}
</style>
