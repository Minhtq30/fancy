<template>
  <a-modal
    class="rate-modal-v2"
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :maskClosable="!loading"
    @cancel="handleCancel"
  >
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <span class="t-cursor-pointer" @click="handleCancel">
          <svg
            width="12"
            height="12"
            viewBox="0 0 20 20"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2.01429L17.9857 0L10 7.98571L2.01429 0L0 2.01429L7.98571 10L0 17.9857L2.01429 20L10 12.0143L17.9857 20L20 17.9857L12.0143 10L20 2.01429Z"
              fill="#fff"
            />
          </svg>
        </span>
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[20px] t-font-medium t-h-[25px]"
          style="flex: 1; white-space: nowrap; text-overflow: ellipsis"
        >
          Chấm &nbsp;<RateStarWhite style="margin-bottom: -5px" />&nbsp; tuần
          {{ titleModal }}
        </h3>
        <a-popover
          placement="bottomRight"
          trigger="click"
          v-model:visible="visiblePopover"
        >
          <svg
            style="cursor: pointer"
            width="17"
            height="10"
            viewBox="0 0 17 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7463 2.12145L15.6758 2.05053L15.7463 2.12144C16.0274 1.842 16.0274 1.38874 15.7463 1.10932C15.4656 0.830227 15.0106 0.830228 14.7299 1.10932L8.42857 7.3733L2.12728 1.10932C1.84653 0.830227 1.39156 0.830227 1.11081 1.10932C0.82973 1.38873 0.82973 1.84203 1.11081 2.12145L7.92034 8.89068C8.20109 9.16977 8.65605 9.16977 8.93681 8.89068L15.7463 2.12145Z"
              fill="white"
              stroke="white"
              stroke-width="0.2"
            />
          </svg>
          <template v-slot:content
            ><p
              class="choice-week t-text-center t-mb-0 t-font-medium t-text-base t-p-3"
              @click="changetoCurrentWeek"
            >
              Tuần {{ this.getWeek() }} ({{ this.getTitleReview() }})
            </p>
            <p
              class="choice-week t-text-center t-mb-0 t-font-medium t-text-base t-p-3"
              @click="changetoLastWeek"
            >
              Tuần {{ this.getLastWeek() }} ({{ this.getLastTitleReview() }})
            </p>
          </template>
        </a-popover>
      </div>
    </template>
    <div class="order-note-modal-wrapper">
      <div>
        <slot name="header" />
        <div>
          <p class="t-text-center t-text-18 t-leading-4.5 t-text-black t-pt-3">
            Đánh giá của bạn giúp GHTK <br />
            hoàn thiện hơn mỗi ngày
          </p>
          <div
            class="t-flex t-items-center t-justify-around t-text-center t-cursor-pointer"
          >
            <div v-for="(type, index) in optionTypes" :key="index">
              <div @click="handleChangeType(type.key)">
                <keep-alive>
                  <component
                    :is="`${type.keyComponent}${
                      `${type.key}` === `${typeSelected}` ? 'Color' : ''
                    }`"
                  ></component>
                </keep-alive>
                <p
                  :class="{
                    't-text-primary': `${type.key}` === `${typeSelected}`,
                    't-font-medium': true,
                  }"
                >
                  {{ type.text }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div v-for="(type, index) in optionTypes" :key="index">
              <div
                class="t-flex t-flex-col t-items-center"
                v-show="`${type.key}` === `${typeSelected}`"
              >
                <div
                  class="check-box-rate t-p-2 t-mb-2 t-w-full"
                  v-for="item in type.listOptions"
                  :key="item.key"
                >
                  <g-checkbox
                    :checked="listOptionSelected.includes(item.key)"
                    @change="handleChangeCheckbox(item.key)"
                  >
                    {{ item.value }}
                  </g-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <g-textarea
        v-if="this.typeSelected == '1'"
        style="min-height: 92px"
        placeholder="Nhập ghi chú thêm"
        :class="{ invalid: errorMessage }"
        :value="good_notes"
        @change="handleChangeNote"
      />
      <g-textarea
        v-else
        style="min-height: 92px"
        placeholder="Nhập ghi chú thêm"
        :class="{ invalid: errorMessage }"
        :value="bad_notes"
        @change="handleChangeNote"
      />
      <span v-if="errorMessage" class="error-message mt">
        {{ errorMessage }}
      </span>
      <g-button
        v-if="this.typeSelected == '1'"
        :loading="loading"
        :disabled="
          (!good_notes && this.listOptionSelected.length === 0) ||
          !!errorMessage
        "
        class="primary w-100 mt-1"
        @click="handleSubmit"
      >
        Xác nhận
      </g-button>
      <g-button
        v-else
        :loading="loading"
        :disabled="
          (!bad_notes && this.listOptionSelected.length === 0) || !!errorMessage
        "
        class="primary w-100 mt-1"
        @click="handleSubmit"
      >
        Xác nhận
      </g-button>
    </div>
  </a-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import GCheckbox from "@/components/elements/checkbox.vue";
import GButton from "../elements/button.vue";
import { GTextarea } from "../elements";
import RateStarWhite from "@/components/icons/RateWhiteStar.vue";

// Icons
import Satisfied from "@/components/icons/SatisfiedIcon.vue";
import Unsatisfied from "@/components/icons/UnsatisfiedIcon.vue";
import SatisfiedColor from "@/components/icons/SatisfiedColorIcon.vue";
import UnsatisfiedColor from "@/components/icons/UnsatisfiedColorIcon.vue";
import { formatMomentDate } from "@/utils/date";

export default {
  name: "OrderNoteModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    setVisible: {
      type: Function,
      default() {
        return () => {};
      },
    },
    handleUpdateReview: {
      type: Function,
      default() {
        return () => {};
      },
    },
    optionTypes: {
      type: Array,
      default() {
        return [];
      },
    },
    listOptionSelected: {
      type: Array,
      default() {
        return [];
      },
    },
    typeSelected: {
      type: Array,
      default() {
        return [];
      },
    },
    good_notes: {
      type: String,
      default: "",
    },
    bad_notes: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Đánh giá",
    },
    time: {
      type: String,
      default: "",
    },
    titleModal: {
      type: String,
      default: "",
    },
  },
  components: {
    GModal,
    GButton,
    GTextarea,
    Satisfied,
    SatisfiedColor,
    Unsatisfied,
    UnsatisfiedColor,
    GCheckbox,
    RateStarWhite,
  },
  data() {
    return {
      loading: false,
      errorMessage: "",
      rate_details: [],
      show: true,
      visiblePopover: false,
    };
  },
  mounted() {
    this.rate_details = [];
  },
  methods: {
    getTitleReview() {
      const { textFirstDay, textLastDay } = this.getStartEndDayWeek();
      return `${textFirstDay} - ${textLastDay}`;
    },
    getLastTitleReview() {
      const { textFirstDay, textLastDay } = this.getStartEndDayLastWeek();
      return `${textFirstDay} - ${textLastDay}`;
    },
    getWeek() {
      return `${this.getNumberWeek()}/${this.getCurrentYear()}`;
    },
    getLastWeek() {
      return `${this.getNumberWeek() - 1}/${this.getCurrentYear()}`;
    },
    changetoCurrentWeek(week) {
      if (this.getNumberWeek() < 10) {
        week = "0" + `${this.getNumberWeek()}-${this.getCurrentYear()}`;
      } else {
        week = `${this.getNumberWeek()}-${this.getCurrentYear()}`;
      }
      this.$emit("onChangeCurr", week);
      this.visiblePopover = false;
    },
    changetoLastWeek(lastweek) {
      if (this.getNumberWeek() <= 10) {
        lastweek = "0" + `${this.getNumberWeek() - 1}-${this.getCurrentYear()}`;
      } else {
        lastweek = `${this.getNumberWeek() - 1}-${this.getCurrentYear()}`;
      }
      this.$emit("onChangeLast", lastweek);
      this.visiblePopover = false;
    },
    getNumberWeek() {
      const currentDate = new Date();
      const d = new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      if (Math.ceil(((d - yearStart) / 86400000 + 1) / 7) < 10) {
        return "0" + Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      } else {
        return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      }
    },
    getCurrentYear() {
      const currentDate = new Date();
      return currentDate.getFullYear();
    },
    getStartEndDayLastWeek() {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay() - 6; // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstday = new Date(curr.setDate(first));
      const lastday = new Date(curr.setDate(last));

      return {
        textFirstDay: formatMomentDate({ _d: firstday }, "DD/MM"),
        textLastDay: formatMomentDate({ _d: lastday }, "DD/MM"),
      };
    },
    getStartEndDayWeek() {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstday = new Date(curr.setDate(first));
      const lastday = new Date(curr.setDate(last));

      return {
        textFirstDay: formatMomentDate({ _d: firstday }, "DD/MM"),
        textLastDay: formatMomentDate({ _d: lastday }, "DD/MM"),
      };
    },
    handleChangeType(value) {
      this.$emit("onChangeType", value);
    },
    handleCancel() {
      this.setVisible(false);
      this.$emit("onClose");
    },
    handleChangeNote(event) {
      const note = event.target.value;
      this.$emit("onChangeNote", note);
    },
    handleChangeCheckbox(key) {
      const rateDetails = this.listOptionSelected.includes(key)
        ? this.listOptionSelected.filter((field) => field !== key)
        : this.listOptionSelected.concat(key);
      this.$emit("onChangeOption", rateDetails);
    },
    async handleSubmit() {
      this.loading = true;
      const response = await this.handleUpdateReview(
        this.good_notes,
        this.bad_notes,
        this.typeSelected,
        this.listOptionSelected,
        this.time
      );
      if (response.success) {
        this.setVisible(false);
      }
      this.loading = false;
    },
  },
  watch: {
    good_notes() {
      this.errorMessage =
        this.good_notes.length > 120 ? "Tối đa 120 ký tự." : "";
    },
    bad_notes() {
      this.errorMessage =
        this.bad_notes.length > 120 ? "Tối đa 120 ký tự." : "";
    },
    time: function (newVal, oldVal) {
      console.log(newVal + " " + oldVal);
    },
  },
};
</script>

<style lang="scss">
textarea.invalid {
  border-color: #da4838;
}
.rate-modal-v2 {
  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-header {
    background-color: var(--primaryColor) !important;
  }
}
.choice-week {
  cursor: pointer;
}
.choice-week:hover {
  background-color: var(--primaryColor);
  color: #fff;
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
