<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="350"
    :title="`Cập nhật tọa độ`"
    @cancel="handleCancel"
  >
    <p>
      Vui lòng thực hiện theo các bước sau để cho phép GHTK truy cập vị trí của
      bạn:
    </p>
    <div class="t-flex">
      <b class="t-min-w-max t-mr-1">Bước 1:</b>
      <p>
        Trên cùng bên trái màn hình, chọn biểu tượng ... trong thanh địa chỉ web
      </p>
    </div>
    <div class="t-flex">
      <b class="t-min-w-max t-mr-1">Bước 2:</b>
      <p>
        Chọn <span class="t-font-extrabold">Site settings</span> (Cài đặt trang
        web)
      </p>
    </div>
    <div class="t-flex">
      <b class="t-min-w-max t-mr-1">Bước 3:</b>
      <p>
        Trong mục ... <span class="t-font-extrabold">Location</span> (Vị trí),
        chọn <span class="t-font-extrabold">Allow</span> (Cho phép)
      </p>
    </div>
    <div class="t-flex">
      <b class="t-min-w-max t-mr-1">Bước 4:</b>
      <p>Tải lại trang</p>
    </div>
  </g-modal>
</template>
<script>
import GModal from "../elements/modal";
export default {
  components: { GModal },
  props: ["visible", "setVisible"],
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
  },
};
</script>
