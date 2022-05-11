<template>
  <a-spin v-if="item.success" tip="Đang cập nhật ..." :spinning="loading">
    <div class="item-col" :style="columnsWrapper">
      <div class="item-cell">
        <col-action
          :isSelected="isSelected"
          :orderId="orderId"
          :selectManyMode="selectManyMode"
          @handleSelectOrder="handleSelectOrder"
        />
      </div>
      <div class="item-cell">
        <col-s-t-t
          :orderIndex="orderIndex"
          :currentPage="currentPage"
          :limit="limit"
          @onSwapOrder="handleSwapOrder"
          :hasRemoveButton="false"
        />
      </div>
      <div class="item-cell">
        <order-created-col-info-order :item="item" />
      </div>
      <div class="item-cell">
        <order-created-col-info-pick
          :item="item"
          :session="item.session"
          @onChange="handleChange"
        />
      </div>
      <div class="item-cell">
        <order-created-col-info-cod-product
          :item="item"
          :products="item.products"
          @onChange="handleChange"
          :debounceConfig="debounceConfig"
        />
      </div>
      <div class="item-cell">
        <order-created-col-note
          :expNotes="expNotes"
          :packageLabels="packageLabels"
          :item="item"
          @onChange="handleChange"
        />
      </div>
      <div class="item-cell">
        <col-action-created-button
          @onRemoveOrder="handleRemoveOrder"
          :orderId="orderId"
          :item="item"
          :updateType="updateType"
          :isError="isError"
        />
      </div>
    </div>
  </a-spin>
  <div :style="{ color: 'red' }" v-else><i>Lỗi tải thông tin đơn hàng.</i></div>
</template>

<script>
import { defineComponent } from "vue";
import { nanoid } from "nanoid";

import { get } from "lodash";

// Components
import ColAction from "@/components/table/columns-common/order-excel-col-action.vue";
import ColActionCreatedButton from "@/components/table/columns-common/order-created-col-action-button.vue";
import ColSTT from "@/components/table/columns-common/order-excel-col-stt.vue";

// Service
import services from "@/services";

// Util
import commonMixin from "@/plugins/mixins/common";
import pickTimeMixin from "@/plugins/mixins/pickTime";
import addressMixin from "@/plugins/mixins/searchAddress";
import OrderCreatedColInfoCodProduct from "@/components/table/columns-common/order-created-col-info-cod-product";
import OrderCreatedColInfoPick from "@/components/table/columns-common/order-created-col-info-pick";
import OrderCreatedColInfoOrder from "@/components/table/columns-common/order-created-col-info-order";
import OrderCreatedColNote from "@/components/table/columns-common/order-created-col-note";
import { formatDateTimeRequest } from "@/utils/date";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "order-created-item",
  components: {
    OrderCreatedColNote,
    OrderCreatedColInfoOrder,
    OrderCreatedColInfoPick,
    OrderCreatedColInfoCodProduct,
    ColAction,
    ColSTT,
    ColActionCreatedButton,
  },
  mixins: [commonMixin, pickTimeMixin, addressMixin],
  data() {
    return {
      loading: false,
    };
  },
  props: {
    item: {
      type: Object,
    },
    columnsWrapper: {
      type: Object,
    },
    orderId: {
      type: String,
    },
    orderIndex: {
      type: Number,
    },
    selectManyMode: {
      type: Function,
    },
    debounceConfig: {
      type: Number,
      default: 1,
    },
    // List data
    excelColumns: {
      type: Array,
    },
    expNotes: {
      type: Array,
    },
    packageLabels: {
      type: Array,
    },
    listUpdate: {
      type: Object,
    },
    listError: {
      type: Object,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 25,
    },
  },
  computed: {
    listPickTime() {
      const warehouse = get(this.item, "warehouse");
      const orderId = get(this.item, "orderId");
      if (!warehouse) {
        return [];
      }
      return this.$store.state.orderDraft.pickTimes[`${orderId}`] || [];
    },
    isSelected() {
      return (
        this.$store.state.orderDraft.selectedListOrder[this.orderId] || false
      );
    },
    updateType() {
      return this.listUpdate[this.orderId];
    },
    isError() {
      return this.listError[this.orderIndex];
    },
  },
  methods: {
    // ----------------------------------------------- ORDER --------------------------------------------------
    handleRemoveOrder() {
      // Call API hủy đơn hàng.
      this.loading = true;
      const response = services.$thunder.browseCancelOrder(this.item.orderId);
      this.loading = false;
      if (response.success) {
        // Hủy đơn hàng thành công.
        // Tip thông báo.
        message.success(`Hủy thành công đơn hàng: ${this.item.alias}`);
        this.$emit("onRemoveOrder", this.orderId);
      }
    },
    async handleChange({ data, key }) {
      // Call API theo key.
      this.loading = true;
      this.$store.commit("global/setVisibleMessagesSystemModal", true);
      const response = await services.$package.updatePackageCreated(
        data.params,
        this.orderId
      );
      this.loading = false;
      const orderId = nanoid(8);

      const messagesSystem = {
        id: orderId,
        type: key,
        message: response.message,
        created: formatDateTimeRequest(new Date()),
      };
      // Cache lại thông tin của phiên cập nhật.
      if (response.success) {
        messagesSystem.status = "successed";
        // Cập nhật trên giao diện khi API call thành công.
        switch (key) {
          case "pick_time": {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.pick_time_slot = data?.data?.pick_time_slot_text;
            // eslint-disable-next-line vue/no-mutating-props
            this.item.date_to_delay_pick = data?.data?.pick_date;
            messagesSystem.desc = `Cập nhật <b>phiên lấy hàng</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "note": {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.message = data?.data.notes.join(",");
            messagesSystem.desc = `Cập nhật <b>ghi chú</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "tags": {
            // eslint-disable-next-line vue/no-mutating-props
            this.item.tags = data?.params?.tags;
            messagesSystem.desc = `Cập nhật <b>tags</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "pick_money": {
            messagesSystem.desc = `Cập nhật <b>tiền COD</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "total_weight": {
            messagesSystem.desc = `Cập nhật <b>tổng khối lượng</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "product": {
            messagesSystem.desc = `Cập nhật <b>thông tin sản phẩm</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          default: {
            break;
          }
        }
      } else {
        messagesSystem.status = "failed";
        switch (key) {
          case "pick_time": {
            messagesSystem.desc = `Lỗi cập nhật <b>phiên lấy hàng</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "note": {
            messagesSystem.desc = `Lỗi cập nhật <b>ghi chú</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "tags": {
            messagesSystem.desc = `Lỗi cập nhật <b>tags</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "pick_money": {
            messagesSystem.desc = `Lỗi cập nhật <b>tiền COD</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "total_weight": {
            messagesSystem.desc = `Lỗi cập nhật <b>tổng khối lượng</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          case "product": {
            messagesSystem.desc = `Lỗi cập nhật <b>thông tin sản phẩm</b> của đơn hàng <b>${this.item.alias}</b>`;
            break;
          }
          default: {
            break;
          }
        }
      }

      this.$store.commit("messagesSystem/addMultiMesssages", {
        [orderId]: messagesSystem,
      });
    },
    handleSelectOrder(event) {
      this.$store.commit("orderDraft/selectOrder", {
        newSelectedOrder: {
          [this.orderId]: event.target.checked,
        },
      });
    },
    handleSwapOrder() {
      this.$emit("onSwapOrder", this.orderId);
    },
  },
});
</script>

<style lang="scss" scoped>
.item-col {
  width: -moz-fit-content;
  width: fit-content;
  display: grid;
  min-width: 100%;
  border-bottom: 1px solid #dbdbdb;
}
.item-cell {
  padding: 0.25rem;
  border-right: 1px solid #dbdbdb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-cell-none {
  border-right: 1px solid #dbdbdb;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
