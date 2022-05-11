<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :maskClosable="!loading"
    :title="`Ghi chú đơn hàng ${formatedAlias(order.alias)}`"
    @cancel="handleCancel"
  >
    <div class="order-note-modal-wrapper">
      <g-textarea
        style="min-height: 92px"
        placeholder="Nhập ghi chú riêng cho đơn hàng"
        :class="{ invalid: errorMessage }"
        :value="note"
        @change="handleChange"
      />
      <span v-if="errorMessage" class="error-message mt">
        {{ errorMessage }}
      </span>
      <g-button
        :loading="loading"
        :disabled="!note || !!errorMessage"
        class="primary w-100 mt-1"
        @click="handleSubmit"
      >
        Xác nhận
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import GButton from "../elements/button.vue";
import { GTextarea } from "../elements";

export default {
  name: "OrderNoteModal",
  props: ["order", "visible", "setVisible"],
  components: {
    GModal,
    GButton,
    GTextarea,
  },
  data() {
    return {
      note: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleChange(event) {
      this.note = event.target.value;
    },
    formatedAlias(alias) {
      return alias?.slice(-9) || "";
    },
    async handleSubmit() {
      this.loading = true;

      try {
        const { success, message } = await this.$store.dispatch(
          "order/updateNote",
          {
            id: this.order.id,
            note: this.note,
          }
        );
        if (success) {
          this.setVisible(false);
          this.$message.success(message);
        } else {
          this.$message.error(message);
        }
      } catch (error) {
        this.$message.error(
          "Đã có lỗi xảy ra, hãy liên hệ CSKH để được hỗ trợ."
        );
      }

      this.loading = false;
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.note = "";
      }
    },
    note(_note) {
      this.errorMessage = _note.length > 120 ? "Tối đa 120 ký tự." : "";
    },
  },
};
</script>

<style lang="scss" scoped>
textarea.invalid {
  border-color: #da4838;
}
.error-message {
  color: #da4838;
  display: block;
}
</style>
