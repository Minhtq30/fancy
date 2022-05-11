<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="650"
    :maskClosable="false"
    title="Tùy chọn khoảng thời gian"
    @cancel="handleCancel"
  >
    <div class="daterange-picker-modal-wrapper" v-if="visible">
      <div class="flex">
        <div class="calendar-from">
          <div class="flex from-time">
            <span class="label-type-value">Từ</span>
            <div v-if="!!controlTime" class="input-time-wrapper">
              <input-time :value="fromTime" :onChange="handleChangeFromTime" />
            </div>
          </div>
          <a-calendar
            :fullscreen="false"
            :header-render="headerRender"
            :locale="locale"
            :value="fromDateValue"
            @change="handleChangeFromDate"
          />
        </div>
        <div class="split" />
        <div class="calendar-to">
          <div class="flex to-time">
            <span class="label-type-value">Đến</span>
            <div v-if="!!controlTime" class="input-time-wrapper">
              <input-time
                :value="toTime"
                :onChange="handleChangeToTime"
                :errorMessage="errorMessage"
              />
            </div>
          </div>
          <a-calendar
            :fullscreen="false"
            :header-render="headerRender"
            :locale="locale"
            :value="toDateValue"
            :disabledDate="getDisabledToDate"
            @change="handleChangeToDate"
          />
        </div>
      </div>
      <g-button
        class="primary w-100 mt-1"
        @click="handleSubmit"
        :disabled="!!errorMessage"
      >
        Xác nhận
      </g-button>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import GButton from "../elements/button.vue";
import InputTime from "../elements/input-time.vue";
import nextMonthIcon from "@/assets/icons/next.svg";
import prevMonthIcon from "@/assets/icons/prev.svg";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import moment from "moment";
import "moment/locale/vi";
import { formatMomentDate } from "@/utils/date";

export default {
  name: "GDaterangePickerModal",
  props: [
    "visible",
    "setVisible",
    "onChange",
    "fromDate",
    "toDate",
    "controlTime",
  ],
  components: {
    GModal,
    GButton,
    InputTime,
  },
  data() {
    return {
      locale,
      fromDateValue: this.fromDate || moment().startOf("day"),
      toDateValue: this.toDate || moment().endOf("day"),
      errorMessage: "",
    };
  },
  computed: {
    fromTime() {
      return formatMomentDate(this.fromDateValue, "hh:mm");
    },
    toTime() {
      return formatMomentDate(this.toDateValue, "hh:mm");
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeFromDate(_fromDate) {
      this.fromDateValue = _fromDate;
    },
    handleChangeToDate(_toDate) {
      this.toDateValue = _toDate.endOf("day");
    },
    getDisabledToDate(value) {
      return value < this.fromDateValue;
    },
    handleSubmit() {
      if (this.onChange) {
        this.onChange({
          fromDate: this.fromDateValue,
          toDate: this.toDateValue,
        });
        this.setVisible(false);
      }
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
    handleChangeFromTime(_fromTime) {
      const date = formatMomentDate(this.fromDateValue, "YYYY-MM-DD");
      this.fromDateValue = moment(new Date(`${date} ${_fromTime}`));
    },
    handleChangeToTime(_toTime) {
      const date = formatMomentDate(this.toDateValue, "YYYY-MM-DD");
      this.toDateValue = moment(new Date(`${date} ${_toTime}`));
    },
  },
  watch: {
    fromDate(_fromDate) {
      this.fromDateValue = _fromDate;
    },
    toDate(_toDate) {
      this.toDateValue = _toDate;
    },
    toDateValue(_toDateValue) {
      if (this.fromDateValue > _toDateValue) {
        this.errorMessage = "Thời gian đến không hợp lệ";
      } else {
        this.errorMessage = "";
      }
    },
    visible(_visible) {
      if (!_visible) {
        this.fromDateValue = this.fromDate || moment().startOf("day");
        this.toDateValue = this.toDate || moment().endOf("day");
        this.errorMessage = "";
      }
    },
  },
};
</script>

<style lang="scss">
.dropdown-daterange-picker-modal {
  .ant-calendar-range-middle {
    display: none;
  }
  .ant-calendar-input-wrap {
    display: none;
  }
}
.daterange-picker-modal-wrapper {
  .split {
    width: 1px;
    background-color: #e0e0e0;
  }
  .calendar-from {
    padding-right: 30px;
  }
  .calendar-to {
    padding-left: 30px;
  }
  .calendar-from,
  .calendar-to {
    flex: 1;
    .from-time,
    .to-time {
      position: relative;
      height: 32px;
      align-items: center;
      .input-time-wrapper {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .label-type-value {
      font-size: 18px;
      font-weight: bold;
      padding-left: 12px;
    }
    .ant-fullcalendar-table {
      height: 175px;
      .ant-fullcalendar-column-header {
        height: 24px;
      }
    }
    .ant-fullcalendar-tbody {
      tr {
        height: 24px;
      }
    }
    .ant-fullcalendar-value:hover {
      border-radius: 50%;
    }
    .ant-fullcalendar-value:active {
      background-color: var(--primaryColor);
    }
    .ant-fullcalendar-selected-day .ant-fullcalendar-value,
    .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value {
      background-color: var(--primaryColor);
      border-radius: 50%;
      transition: none;
    }
    .ant-fullcalendar-today .ant-fullcalendar-value,
    .ant-fullcalendar-month-panel-current-cell .ant-fullcalendar-value {
      box-shadow: 0 0 0 1px var(--primaryColor) inset;
      border-radius: 50%;
    }
  }
  .ant-fullcalendar {
    border-top: none;
  }
  .ant-fullcalendar-calendar-body {
    padding: 0;
  }
  .ant-fullcalendar-disabled-cell .ant-fullcalendar-value {
    background-color: transparent !important;
    width: 24px !important;
    height: 24px !important;
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
