<!-- eslint-disable -->
<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :maskClosable="!loading"
    :title="'Đánh giá phiên'"
    @cancel="handleCancel"
  >
    <div class="order-note-modal-wrapper">
      <div>
        <div class="rate-info">
          <p class="t-font-medium t-text-center t-text-18 t-leading-4.5">
            {{ alias }}
          </p>
          <div class="t-flex t-text-16 t-leading-5">
            <p class="t-font-medium">{{ staff }}</p>
            <p class="t-absolute t-left-1/4">{{ name }}</p>
          </div>
          <div class="t-flex t-text-16 t-leading-5">
            <p class="t-font-medium">SĐT</p>
            <p class="t-absolute t-left-1/4">{{ phone }}</p>
          </div>
          <div class="t-flex t-text-16 t-leading-5 t-pb-1">
            <p class="t-absolute t-font-medium">{{ addressTitle }}</p>
            <p class="t-left-1/4" style="padding-left: 110px">{{ address }}</p>
          </div>
        </div>
        <div>
          <p class="t-text-center t-text-18 t-leading-4.5 t-text-black t-pt-3">
            Đánh giá của bạn giúp GHTK <br />
            hoàn thiện hơn mỗi ngày
          </p>
          <div v-if="satisfiedActive">
            <div
              class="t-flex t-justify-around t-text-16 t-leading-5 t-text-black"
            >
              <div class="t-flex t-flex-col t-items-center">
                <SatisfiedColor />
                <p class="t-text-primary">Hài lòng</p>
              </div>
              <div
                @click="toogleSatisfied"
                class="t-flex t-flex-col t-items-center"
              >
                <Unsatisfied id="click-unstatisfied" class="t-cursor-pointer" />
                <p>Không hài lòng</p>
              </div>
            </div>
            <div
              v-if="setVisibleRate"
              class="check-box-rate-satisfied t-pb-2 t-flex t-flex-col"
            >
              <div
                class="check-box-rate t-p-2 t-mb-2"
                v-for="item in satisfiedChoice"
                :key="item.key"
              >
                <g-checkbox
                  @change="handleChangeCheckbox(item.key)"
                  class="t-pb-2"
                  >{{ item.value }}</g-checkbox
                >
              </div>
            </div>
          </div>
          <div v-if="!satisfiedActive">
            <div
              class="t-flex t-justify-around t-text-16 t-leading-5 t-text-black"
            >
              <div
                @click="toogleSatisfied"
                class="t-flex t-flex-col t-items-center"
              >
                <Satisfied id="click-satisfied" class="t-cursor-pointer" />
                <p>Hài lòng</p>
              </div>
              <div class="t-flex t-flex-col t-items-center">
                <UnsatisfiedColor />
                <p class="t-text-primary">Không hài lòng</p>
              </div>
            </div>
            <div class="check-box-rate-satisfied t-pb-2 t-flex t-flex-col">
              <div
                class="check-box-rate t-p-2 t-mb-2"
                v-for="item in unSatisfiedChoice"
                :key="item"
              >
                <g-checkbox
                  class="t-pb-2"
                  id="1"
                  @change="handleChangeCheckbox(item.key)"
                  >{{ item.value }}</g-checkbox
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <g-textarea
        style="min-height: 92px"
        placeholder="Nhập ghi chú thêm"
        :class="{ invalid: errorMessage }"
        :value="note"
        :disabled="
          (!this.rate_details.includes(4) && this.rate_id == 1) ||
          (!this.rate_details.includes(3) && this.rate_id == 0)
        "
        @change="handleChange"
      />
      <span v-if="errorMessage" class="error-message mt">
        {{ errorMessage }}
      </span>
      <g-button
        :loading="loading"
        :disabled="(!note && this.rate_details.length == 0) || !!errorMessage"
        class="primary w-100 mt-1"
        @click="handleSubmit(session_id, notes, rate_id, rate_details)"
      >
        Xác nhận
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import GCheckbox from "@/components/elements/checkbox.vue";
import GButton from "../elements/button.vue";
import { GTextarea } from "../elements";
import Satisfied from "@/components/icons/SatisfiedIcon.vue";
import Unsatisfied from "@/components/icons/UnsatisfiedIcon.vue";
import SatisfiedColor from "@/components/icons/SatisfiedColorIcon.vue";
import UnsatisfiedColor from "@/components/icons/UnsatisfiedColorIcon.vue";
// import orderService from "@/services/order.service";

const satisfiedChoices = [
  {
    key: 1,
    value: "Tất cả đều tuyệt vời",
  },
  {
    key: 2,
    value: "NV lấy hàng nhanh/nhiệt tình/thân thiện",
  },
  {
    key: 3,
    value: "NV lấy hàng xử lý vấn đề nhanh",
  },
  {
    key: 4,
    value: "Ý kiến khác (để lại đánh giá ở phần ghi chú)",
  },
];
const unSatisfiedChoices = [
  {
    key: 1,
    value: "NV lấy hàng thái độ kém/hỗ trợ chưa tốt",
  },
  {
    key: 2,
    value: "NV lấy hàng thái xử lý vấn đề chậm",
  },
  {
    key: 3,
    value: "Ý kiến khác (để lại đánh giá ở phần ghi chú)",
  },
];

export default {
  name: "OrderNoteModal",
  props: [
    "order",
    "visible",
    "setVisible",
    "name",
    "phone",
    "address",
    "id",
    "alias",
    "staff",
    "addressTitle",
    "message",
  ],
  components: {
    GModal,
    GButton,
    GTextarea,
    Satisfied,
    Unsatisfied,
    SatisfiedColor,
    UnsatisfiedColor,
    GCheckbox,
  },
  data() {
    return {
      note: "",
      loading: false,
      errorMessage: "",
      satisfiedActive: true,
      unsatisfiedActive: true,
      setVisibleRate: true,
      loadChoice: false,
      sessions: null,
      session_id: "",
      rate_id: "",
      rate_details: [],
    };
  },
  mounted() {
    this.satisfiedActive = true;
    this.rate_id = 1;
    this.rate_details = [];
  },
  computed: {
    unSatisfiedChoice() {
      return unSatisfiedChoices;
    },
    satisfiedChoice() {
      return satisfiedChoices;
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
      this.satisfiedActive = true;
      this.setVisibleRate = false;
      this.rate_details = [];
    },
    handleChange(event) {
      this.note = event.target.value;
    },
    handleChangeCheckbox(key) {
      console.log("checked = ", key);
      this.rate_details = this.rate_details.includes(key)
        ? this.rate_details.filter((field) => field !== key)
        : this.rate_details.concat(key);
    },
    async handleSubmit() {
      this.loading = true;

      try {
        await this.$store.dispatch("order/updateRate", {
          session_id: this.id,
          notes: this.note,
          rate_id: this.rate_id,
          rate_details: this.rate_details,
        });
        this.$message.success("Đánh giá phiên thành công!");
        this.setVisible(false);
      } catch (error) {
        console.log(error);
        this.$message.error("Đánh giá thất bại, xin thử lại!");
      }
      this.satisfiedActive = true;
      this.setVisibleRate = false;
      this.rate_details = [];
      this.loading = false;
    },
    toogleSatisfied(e) {
      console.dir(e.target);
      if (e.target.id == "click-unstatisfied") {
        this.satisfiedActive = false;
        this.note = "";
        this.rate_details = [];
      } else {
        this.satisfiedActive = true;
        this.note = "";
        this.rate_details = [];
      }
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.note = "";
        this.setVisibleRate = true;
      }
    },
    note(_note) {
      this.errorMessage = _note.length > 120 ? "Tối đa 120 ký tự." : "";
    },
    satisfiedActive() {
      if (this.satisfiedActive) this.rate_id = 1;
      if (!this.satisfiedActive) this.rate_id = 0;
    },
  },
};
</script>

<style lang="scss">
textarea.invalid {
  border-color: #da4838;
}
.error-message {
  color: #da4838;
  display: block;
}
.rate-info {
  color: #000000;
  border-bottom: 1px solid #e0e0e0;
  font-family: Roboto;
}
.check-box-rate {
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid green;
}
.check-box-rate-satisfied .check-box-rate .ant-checkbox-inner {
  width: 22px;
  height: 22px;
  border-color: #000 !important;
  border: 2px solid #000000;
}
</style>
