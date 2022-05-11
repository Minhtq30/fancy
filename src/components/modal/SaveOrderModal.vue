<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :title="`Thông báo`"
    @cancel="handleCancel"
  >
    <div class="flex t-justify-center t-my-3">
      <success-icon />
    </div>
    <div>
      <p class="t-text-base t-text-center">
        Bạn đã lưu thành công {{ numberSuccess }} đơn hàng nháp
      </p>
      <p v-if="numberFail > 0" class="t-text-base t-text-center">
        có {{ numberFail }} đơn hàng gặp lỗi trong quá trình lưu
      </p>
      <p class="t-text-center">vào lúc {{ date_time }}</p>
    </div>
    <div class="flex t-justify-center t-mb-2">
      <g-button
        @click="handleChangeRoute('/tao-don-hang/don-nhap')"
        class="primary"
        >Xem chi tiết ĐH</g-button
      >
    </div>
  </g-modal>
</template>
<script>
import { formatMomentDate } from "@/utils/date";
import moment from "moment";

// Components
import GModal from "../elements/modal";
import { SuccessIcon } from "@/components";
import GButton from "@/components/elements/button.vue";

export default {
  components: { GModal, SuccessIcon, GButton },
  props: ["visible", "setVisible", "numberSuccess", "numberFail"],
  computed: {
    date_time() {
      return formatMomentDate(moment(new Date()), "H:M ngày DD/MM/YYYY");
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeRoute(route) {
      this.handleCancel();
      this.$router.push(route);
    },
  },
};
</script>
