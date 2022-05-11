<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="350"
    :maskClosable="false"
    title="Tùy chọn tháng"
    @cancel="handleCancel"
  >
    <div
      :class="{ 'daterange-picker-modal-wrapper': true, [classContent]: true }"
      v-if="visible"
    >
      <div class="flex">
        <div class="calendar-from">
          <a-calendar
            :fullscreen="false"
            :header-render="headerRender"
            :locale="locale"
            :mode="'year'"
            :value="dateValue"
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
import GModal from "../elements/modal.vue";
import GButton from "../elements/button.vue";
import nextMonthIcon from "@/assets/icons/next.svg";
import prevMonthIcon from "@/assets/icons/prev.svg";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import moment from "moment";
import "moment/locale/vi";

export default {
  name: "GDatePickerModal",
  props: ["visible", "setVisible", "onChange", "date", "classContent"],
  components: {
    GModal,
    GButton,
  },
  data() {
    return {
      locale,
      dateValue: this.date || moment().startOf("day"),
      fromDateValue: "",
      toDateValue: "",
    };
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleChangeDate(_date) {
      this.dateValue = _date;
    },
    handleSubmit() {
      if (this.onChange) {
        this.onChange({
          fromDate: moment(this.dateValue).startOf("month"),
          toDate: moment(this.dateValue).endOf("month"),
          range: moment(this.dateValue).format("YYYY-MM"),
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
  },
  // watch: {
  //   date(_date) {
  //     this.dateValue = _date;
  //   },
  // },
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
    .label-type-value {
      font-size: 18px;
      font-weight: bold;
      padding-left: 12px;
    }
    .ant-fullcalendar-table {
      height: 175px;
      .ant-fullcalendar-column-header {
        height: 28px;
      }
    }
    .ant-fullcalendar-tbody {
      tr {
        height: 28px;
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
      display: flex;
      justify-content: center;
      align-items: center;
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
    margin-top: 15px;
  }
  .ant-fullcalendar-disabled-cell .ant-fullcalendar-value {
    background-color: transparent !important;
    width: 30px;
    height: 30px;
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
  .ant-fullcalendar-month-panel-cell .ant-fullcalendar-value {
    width: 70px;
    height: 28px;
  }

  .ant-fullcalendar-month {
    text-align: center;
    transition: all 0.3s;
    height: 70px;
  }
}
</style>
