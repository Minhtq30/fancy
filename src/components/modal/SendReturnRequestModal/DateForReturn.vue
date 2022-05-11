<template>
  <div class="date-for-return">
    <div class="field-row">
      <span>Bấm để chọn thời gian bạn muốn</span>
    </div>
    <div class="field-row">
      <span class="label">Buổi lấy</span>
      <g-select
        :data-source="shiftOptions"
        v-model:selectedItem="shift"
        @on-selection-change="() => {}"
        class="t-flex-1 workshift-select ml"
        inputJustify="center"
        optionAlign="center"
        :showSearch="false"
        :borderless="true"
      >
        <template v-slot:option="{ item }">
          <div>
            {{ item.label }}
          </div>
        </template>
      </g-select>
    </div>
    <div class="field-row">
      <span class="label">Ngày lấy</span>
      <div class="wrapper-fake-select t-flex-1" @click="openModal">
        {{ formatSelectedDate }}
        <arrow-down-icon class="arrow-down-icon" />
      </div>
    </div>
    <div v-if="type === 1" class="description-return-date">
      Quý khách lưu ý: Chọn lịch ca lấy sáng trước 20h ngày hôm trước
    </div>
    <div class="field-row">
      <span class="label">Ghi chú</span>
      <input
        :value="note"
        @input="handleChangeNote"
        placeholder="Vui lòng nhập thêm chi tiết"
      />
    </div>
    <g-button :loading="loading" class="primary w-100" @click="handleSubmit">
      Xác nhận
    </g-button>
    <date-picker-single-modal
      :visible="visibleDatePicker"
      :onClose="onClose"
      :value="selectedDate"
      :onChange="onChange"
      :title="'Chọn ngày hẹn'"
    />
  </div>
</template>

<script>
import moment from "moment";
import { GSelect } from "@/components";
import GButton from "@/components/elements/button.vue";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import DatePickerSingleModal from "../DatePickerSingleModal.vue";
import ticketService from "@/services/ticket.service";
import { formatMomentDate } from "@/utils/date";

const SHIFT_OPTIONS = {
  1: "MORNING",
  2: "AFTERNOON",
  3: "EVENING",
};

export default {
  name: "DateForReturn",
  components: {
    GButton,
    GSelect,
    ArrowDownIcon,
    DatePickerSingleModal,
  },
  props: ["type", "session", "loading", "setLoading", "handleCancel"],
  data() {
    return {
      shift: { value: 1, label: "Sáng" },
      selectedDate: moment().startOf("day").add(1, "day"),
      shiftOptions: [
        { value: 1, label: "Sáng" },
        { value: 2, label: "Chiều" },
        { value: 3, label: "Tối" },
      ],
      visibleDatePicker: false,
      note: "",
    };
  },
  computed: {
    formatSelectedDate() {
      const dateTime = new Date(this.selectedDate);

      const date = dateTime.getDate().toString().padStart(2, "0");
      const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
      const year = dateTime.getFullYear();

      return `${date}-${month}-${year}`;
    },
  },
  methods: {
    onClose() {
      this.visibleDatePicker = false;
    },
    openModal() {
      this.visibleDatePicker = true;
    },
    onChange(value) {
      this.selectedDate = value;
    },
    handleChangeNote(event) {
      this.note = event.target.value;
    },
    async handleSubmit() {
      this.setLoading(true);

      try {
        const type = this.type === 1 ? 21 : 22;
        const shiftField = this.type === 1 ? "pick_shift" : "return_shift";
        const dateField = this.type === 1 ? "pick_date" : "return_date";

        const feedback = {
          [shiftField]: SHIFT_OPTIONS[this.shift.value],
          [dateField]: formatMomentDate(this.selectedDate),
          content: this.note,
        };
        const response = await ticketService.sendTicketSession(
          this.session.id,
          type,
          feedback
        );

        if (response.data.success) {
          this.handleCancel();
          this.$message.success(response.data.message);
        } else {
          this.$message.error(
            response.data.message || "Oops! Something went wrong when call api."
          );
        }
      } catch (error) {
        console.error(error);
        this.$message.error("Oops! Something went wrong when call api.");
      }
      this.setLoading(false);
    },
  },
};
</script>

<style lang="scss">
.workshift-select {
  input {
    font-size: 16px !important;
    // padding-right: 0.25rem !important;
  }
}
</style>
<style lang="scss" scoped>
@import "./detail.scss";

.date-for-return {
  .g-button {
    height: 40px;
  }
  .description-return-date {
    color: #808080;
    font-size: 14px;
    margin-bottom: 1rem;
  }
  .wrapper-fake-select {
    margin-left: 0.5rem;
    padding: 4px 0.25rem;
    border-bottom: 1px solid #c4c4c4;
    padding-right: 23px;
    position: relative;
    text-align: center;
    .arrow-down-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0.25rem;
    }
  }
}
</style>
