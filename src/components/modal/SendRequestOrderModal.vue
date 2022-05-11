<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :title="'Gửi yêu cầu'"
    @cancel="handleCancel"
  >
    <div class="send-request-order-modal-wrapper">
      <div class="mb-1">
        <span v-if="type === 'tra_shop'">
          Bạn có chắc chắn muốn gửi yêu cầu trả shop cho {{ totalSelected }} ĐH
          được chọn?
        </span>
        <span v-else-if="type === 'giao_lai'">
          Phí giao lại cho {{ totalSelected }} ĐH:
          <format-price :value="(totalSelected || 0) * 10000" /> đ. Vui lòng xác
          nhận yêu cầu giao lại cho {{ totalSelected }} ĐH được chọn.
        </span>
        <span v-else>
          Bạn đang gửi yêu cầu {{ titleByType }} cho {{ totalSelected }} ĐH
        </span>
      </div>
      <div
        v-if="!['tra_shop', 'giao_lai'].includes(type)"
        class="input-wrapper flex align-items-center"
      >
        <span>Ghi chú: </span>
        <input
          class="ml t-flex-1"
          placeholder="Vui lòng nhập thêm chi tiết"
          @keyup.enter="onSubmit"
          v-model="note"
        />
      </div>
      <g-button class="primary w-100" @click="onSubmit">Xác nhận</g-button>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal";
import GButton from "@/components/elements/button.vue";
import { objectRequestOptions } from "@/pages/operate/Operate.vue";
import FormatPrice from "../FormatPrice.vue";

export default {
  name: "SendRequestOrderModal",
  props: ["visible", "setVisible", "totalSelected", "handleSubmit", "type"],
  components: {
    GModal,
    GButton,
    FormatPrice,
  },
  data() {
    return {
      note: "",
    };
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    onSubmit() {
      const note =
        this.note || objectRequestOptions[this.type]?.default_message;

      this.handleSubmit(this.type, note);
      this.handleCancel();
    },
  },
  computed: {
    titleByType() {
      if (!this.type) return "";
      return objectRequestOptions[this.type]?.label?.toLowerCase();
    },
  },
  watch: {
    visible(_visible) {
      if (!_visible) {
        this.note = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.send-request-order-modal-wrapper {
  color: #000;
  font-size: 16px;
  .input-wrapper {
    margin-bottom: 1.5rem;
    input {
      outline: none;
      border: none;
      border-bottom: 1px solid var(--grayColor);
    }
  }
}
</style>
