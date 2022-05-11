<template>
  <g-modal
    :visible="visible"
    :footer="false"
    :centered="true"
    :width="450"
    :title="`Cập nhật tọa độ địa chỉ`"
    @cancel="handleCancel"
  >
    <g-input placeholder="Số 8 Phạm Hùng Nam Từ Liêm hà nội"></g-input>
    <div class="t-flex t-justify-between t-mt-3">
      <div class="t-w-1/2 t-mr-2">
        <g-select class="t-w-full" placeholder="Phạm Hùng"></g-select>
      </div>
      <div class="t-w-1/2 t-ml-2">
        <g-select class="t-w-full" placeholder="Mễ Trì"></g-select>
      </div>
    </div>
    <div class="t-flex t-justify-between t-mt-3">
      <div class="t-w-1/2 t-mr-2">
        <g-select class="t-w-full" placeholder="Nam Từ Liêm"></g-select>
      </div>
      <div class="t-w-1/2 t-ml-2">
        <g-select class="t-w-full" placeholder="Hà Nội"></g-select>
      </div>
    </div>

    <div
      class="t-h-96 t-relative t-bg-black t-bg-opacity-50 t-mt-3"
      v-if="!isConfirm"
    >
      <div
        class="t-absolute t-w-2/3 t-h-full t-ml-20 t-flex t-flex-col t-justify-center t-text-center"
      >
        <p class="t-text-white">
          Shop vui lòng cho phép GHTK truy cập vị trí hiện tại để xác định tọa
          trên bản đồ, giúp đơn hàng được lấy nhanh nhất!
        </p>
        <g-button class="primary" @click="isConfirm = true"
          >Cho phép truy cập</g-button
        >
      </div>
    </div>

    <div class="t-mt-5" v-if="isConfirm">
      <p>Di chuyển bản đồ để ghim lại vị trí chính xác</p>
      <div class="t--mt-3">
        <a-input placeholder="Nhập địa chỉ đặc biệt để di chuyển nhanh hơn">
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>
      </div>
    </div>

    <div
      class="t-h-96 t-bg-black t-bg-opacity-50 t-mt-3"
      v-if="isConfirm"
    ></div>

    <div class="t-w-full t-mt-3">
      <g-button v-if="!isConfirm" class="t-w-full" disabled>Cập nhật</g-button>
      <g-button
        v-if="isConfirm"
        class="t-w-full primary"
        @click="isConfirm = false"
        >Cập nhật</g-button
      >
    </div>
  </g-modal>
</template>
<script>
import { GModal, GSelect, GButton } from "../elements";
import GInput from "../common/GInput";
import { SearchOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    GButton,
    GSelect,
    GInput,
    GModal,
    SearchOutlined,
  },
  props: ["visible", "setVisible"],
  data() {
    return {
      isConfirm: false,
    };
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeFormType(event) {
      this.formType = event.target.value;
    },
  },
};
</script>
<style lang="scss" scoped>
.ant-btn[disabled] {
  background-color: #919191;
  color: white;
}

.ant-input-affix-wrapper {
  border: none !important;
  border-bottom: 1px solid gray !important;
}
</style>
