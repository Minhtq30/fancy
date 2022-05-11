<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="350"
    :title="title || 'Chọn thời gian'"
    @cancel="onClose"
  >
    <div
      :class="{ 'daterange-picker-modal-wrapper': true, [classContent]: true }"
      class="daterange-picker-single-modal-wrapper"
      v-if="visible"
    >
      <div class="flex">
        <div class="calendar-from">
          <a-calendar
            :header-render="headerRender"
            :fullscreen="false"
            :locale="locale"
            :value="dateValue"
            :disabled-date="getDisabledDate"
            @change="handleChangeDate"
          />
        </div>
      </div>
      <g-button class="primary w-100 mt-1" @click="handleSubmit">
        Xác nhận
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import moment from "moment";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import GModal from "../elements/modal.vue";
import GButton from "../elements/button.vue";
import nextMonthIcon from "@/assets/icons/next.svg";
import prevMonthIcon from "@/assets/icons/prev.svg";

import "moment/locale/vi";

export default {
  name: "DatePickerSingleModal",
  props: ["value", "visible", "onChange", "onClose", "title"],
  components: {
    GModal,
    GButton,
  },
  data() {
    return {
      locale,
      dateValue: this.value || moment(),
    };
  },
  methods: {
    handleSubmit() {
      if (this.onChange) {
        this.onChange(this.dateValue);
        this.onClose();
      }
    },
    handleChangeDate(date) {
      this.dateValue = date;
    },
    getDisabledDate(value) {
      return value < moment().endOf("day");
    },
    headerRender({ value, onChange }) {
      const month = value.month();
      const year = value.year();

      const convertMonth = (_month) => {
        if (_month + 1 > 12) return 1;
        return (_month + 1).toString().padStart(2, "0");
      };

      return (
        <div class="calendar-header-wrapper">
          <img
            src={prevMonthIcon}
            onClick={() => {
              const newValue = value.clone();
              newValue.month(parseInt(month - 1, 10));
              onChange(newValue);
            }}
          />
          <span class="current-calue">
            Tháng {convertMonth(month)} {year}
          </span>
          <img
            src={nextMonthIcon}
            onClick={() => {
              const newValue = value.clone();
              newValue.month(parseInt(month + 1, 10));
              onChange(newValue);
            }}
          />
        </div>
      );
    },
  },
  watch: {
    value(_value) {
      this.dateValue = _value;
    },
  },
};
</script>

<style lang="scss">
.daterange-picker-single-modal-wrapper {
  .ant-fullcalendar-header {
    display: none;
  }
  .calendar-from {
    padding-right: 0;
  }
  .ant-fullcalendar-value {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-fullcalendar-disabled-cell .ant-fullcalendar-value {
    width: 24px;
    height: 24px;
  }
  .calendar-header-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    .current-calue {
      font-size: 15px;
      font-weight: bold;
    }
    img {
      cursor: pointer;
      padding: 0 13px;
    }
  }
}
</style>
