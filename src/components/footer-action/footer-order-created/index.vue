<!-- eslint-disable -->
<template>
  <div class="wrapper">
    <div class="wrapper-left">
      <pagination
        :totalPages="totalPages"
        :loading="loadMore"
        @onChange="onChangePage"
      />
    </div>
    <div class="wrapper-right">
      <div class="spin-load-more" v-show="loadMore">
        <a-spin :indicator="indicator" :spinning="loadMore" />
        <span>Đang tải thêm ...</span>
      </div>
      <g-button
        :disabled="!selectedValidListOrder.length"
        @click="handleUpdateAll"
        class="footer-button"
      >
        <template #icon>
          <g-note-icon />
        </template>
        <span>Ghi chú {{ selectedListOrder.length }} ĐH</span>
      </g-button>
      <g-button
        :disabled="!selectedValidListOrder.length"
        @click="onSetVisibleExcelModal(true)"
        class="footer-button"
      >
        <template #icon>
          <g-export-icon />
        </template>
        <span>Xuất Excel {{ selectedValidListOrder.length }} ĐH</span>
      </g-button>
      <g-button
        @click="onPrintOrders"
        :disabled="!selectedValidListOrder.length"
        class="footer-button"
      >
        <template #icon>
          <g-print-icon />
        </template>
        <span>In {{ selectedValidListOrder.length }} ĐH</span>
      </g-button>
    </div>
  </div>
  <export-order-modal
    :visible="visibleExcelModal"
    :setVisible="onSetVisibleExcelModal"
    :selected-ids="listOrderIds"
  />
  <note-for-created-order-modal
    :visible="visibleNoteModal"
    :setVisible="onSetVisibleNoteModal"
    :packageLabels="packageLabels"
    :selectedListOrder="selectedListOrder"
    :expNotes="expNotes"
    :handleSubmit="handleSubmitUpdateNote"
  />
</template>

<script>
import { h, ref } from "vue";
import { chunk } from "lodash";
import services from "@/services";
import { v4 as uuidv4 } from "uuid";

// Component.
import GExportIcon from "@/components/icons/ExportIcon.vue";
import GPrintIcon from "@/components/icons/PrintIcon.vue";
import GNoteIcon from "@/components/icons/NoteIcon.vue";
import GButton from "@/components/elements/button.vue";
import Pagination from "@/components/Pagination.vue";

import NoteForCreatedOrderModal from "@/components/modal/NoteForCreatedOrderModal.vue";
import ExportOrderModal from "@/components/modal/ExportOrderModal.vue";

import { LoadingOutlined } from "@ant-design/icons-vue";
import { REDIRECT_URI } from "@/contants";
import { formatDateTimeRequest } from "@/utils/date";

const PRINT_URL = `${REDIRECT_URI}/khach-hang/in-don-hang`;

export default {
  name: "FooterOrderCreated",
  components: {
    Pagination,
    GButton,
    GExportIcon,
    GPrintIcon,
    GNoteIcon,
    ExportOrderModal,
    NoteForCreatedOrderModal,
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
      timestamp: new Date().getTime(),
    };
  },
  computed: {
    listOrderIds() {
      return this.selectedValidListOrder.map((x) => x.orderId);
    },
    selectedPackages() {
      return this.selectedListOrder.map((order) => ({
        ...order,
        custom_id: `${uuidv4()}_${this.timestamp}`,
      }));
    },
  },
  props: {
    selectedListOrder: Array,
    listOrder: Array,
    selectedValidListOrder: Array,
    fetchingSaveOrder: Boolean,
    loadingUpGHTK: Boolean,
    hideUploadOrder: Boolean,
    ruleCheck: Boolean,
    loadMore: Boolean,
    listUpdate: Object,
    limit: Number,
    totalPages: Number,
    packageLabels: Array,
    expNotes: Array,
    handleUpdateOrderById: Function,
  },
  methods: {
    handleUpdateAll() {
      this.timestamp = new Date().getTime();
      this.onSetVisibleNoteModal(true);
    },
    onPrintOrders() {
      const orderIds = this.selectedValidListOrder.map((x) => x.id);
      this.handlePrintOrder(orderIds);
    },
    handlePrintOrder(orderIds) {
      let query = "";
      for (const id of orderIds) {
        query += (query ? "&" : "?") + `data[package_id][${id}]=1`;
      }
      window.open(encodeURI(PRINT_URL + query), "_blank");
    },
    async handleUpdateItem(p, dataUpdate) {
      let _status;
      let _message;

      try {
        if (p.property.includes("bbs")) {
          dataUpdate.tags = dataUpdate.tags.filter((t) => t !== 6);
        }

        const response = await services.$package.updatePackageCreated(
          dataUpdate,
          p.orderId
        );

        if (response.success) {
          _status = "successed";
          _message = response.message;
          this.handleUpdateOrderById(
            p.id,
            dataUpdate.tags,
            dataUpdate.note.message,
            dataUpdate.note.replace_all
          );
        } else {
          _status = "failed";
          _message = response.message;
        }
      } catch (error) {
        _status = "failed";
        _message = "Oops! Something went wrong when call api.";
      }

      this.$store.commit("messagesSystem/updateMessage", {
        id: p.custom_id,
        dataUpdate: {
          status: _status,
          message: _message,
        },
      });
    },
    async handleChunkItem(chunkItem, dataUpdate) {
      let arrayPromise = [];

      for (const item of chunkItem) {
        arrayPromise.push(this.handleUpdateItem(item, dataUpdate));
      }

      await Promise.all(arrayPromise);
    },
    handleUpdateStatusMessage(orders, dataUpdate) {
      for (const order of orders) {
        this.$store.commit("messagesSystem/updateMessage", {
          id: order.custom_id,
          dataUpdate,
        });
      }
    },
    async handleSubmitUpdateNote(dataUpdate) {
      this.$store.commit("global/setVisibleMessagesSystemModal", true);

      let _messagesSystem = {};

      for (const order of this.selectedPackages) {
        _messagesSystem[order.custom_id] = {
          id: order.custom_id,
          type: "update_note_created_order",
          desc: `Cập nhật <b>ghi chú</b> đơn hàng <b>${order.alias}</b>`,
          status: "waitting",
          created: formatDateTimeRequest(new Date()),
        };
      }

      this.$store.commit("messagesSystem/addMultiMesssages", _messagesSystem);

      const chunks = chunk(this.selectedPackages, 20);

      for (const chunkItem of chunks) {
        this.handleUpdateStatusMessage(chunkItem, { status: "executing" });
        await this.handleChunkItem(chunkItem, dataUpdate);
      }
    },
  },
  setup(props, { emit }) {
    const visibleExcelModal = ref(false);
    const visibleNoteModal = ref(false);

    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "20px",
      },
      spin: true,
    });

    const onSetVisibleExcelModal = (value) => {
      visibleExcelModal.value = value;
    };

    const onSetVisibleNoteModal = (value) => {
      visibleNoteModal.value = value;
    };

    const onChangePage = (data) => {
      emit("handleChangePage", data);
    };

    return {
      visibleExcelModal,
      visibleNoteModal,
      onSetVisibleExcelModal,
      onSetVisibleNoteModal,
      onChangePage,
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
  justify-content: space-between;
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

  .wrapper-left {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
  }

  .term-des {
    color: var(--primaryColor);
    text-decoration: underline;
  }
}
</style>

<style lang="scss">
.wrapper-left {
  .ant-select-selection-item {
    font-size: 0.875rem !important;
  }
  button {
    font-size: 0.875rem !important;
  }
}
</style>
