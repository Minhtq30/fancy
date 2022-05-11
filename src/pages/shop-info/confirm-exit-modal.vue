<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="378"
    :maskClosable="false"
    :title="'Thoát khỏi trang'"
    @cancel="handleCancel"
  >
    <div class="confirm-exit-modal-wrapper">
      <span>Các thay đổi của bạn chưa được lưu. Bạn vẫn muốn thoát trang?</span>
      <div class="wrapper-actions mt-1 flex t-justify-between">
        <g-button @click="handleCancel">Ở lại</g-button>
        <g-button @click="onSubmit">Thoát</g-button>
      </div>
    </div>
  </g-modal>
</template>

<script>
import { GButton, GModal } from "@/components/elements";

export default {
  name: "ConfirmExitModal",
  props: ["visible", "setVisible", "onSubmit"],
  components: {
    GButton,
    GModal,
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-exit-modal-wrapper {
  font-size: 16px;
  color: #000;
  button {
    width: 160px;
    &:last-child {
      color: #e13636;
      border-color: #e13636;
    }
  }
}
</style>
