<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="400"
    :title="`Cập nhật tọa độ`"
    @cancel="handleCancel"
  >
    <p class="t-text-lg t-my-2">
      Vui lòng cho phép GHTK truy cập vị trí của bạn để lấy hàng nhanh nhất!
    </p>
    <div class="t-grid t-grid-cols-2 t-gap-4 t-mt-5 t-mb-2">
      <g-button :type="'danger'">Không cho phép</g-button>
      <g-button class="primary">Cho phép</g-button>
    </div>
  </g-modal>
</template>
<script>
import GModal from "../elements/modal";
import GButton from "../elements/button";
export default {
  components: { GButton, GModal },
  props: ["visible", "setVisible"],
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
  },
};
</script>
<style scoped>
.ant-btn-danger {
  color: red !important;
  border-color: red !important;
  background-color: white;
}

button {
  height: 3rem;
}
</style>
