<template>
  <div :style="{ height: '100%', width: '100%' }">
    <div
      class="g-daterange-picker-select-month-wrapper"
      v-click-outside="handleClickOutside"
    >
      <div
        :style="{
          fontWeight: 'bold',
          height: '100%',
          width: '100%',
        }"
        class="t-flex t-items-center t-justify-center"
        @click="onFocusInput"
      >
        {{ textDisplay || "Tùy chọn" }}
      </div>
      <div class="custom-list-options-wrapper" v-if="openDropdown">
        <div
          v-for="option in options"
          :key="option.key"
          class="option-item"
          :class="{ 'is-selected': type === option.key }"
          @click="handleSelectType(option)"
        >
          <span class="option-item__title t-text-black">
            {{ option.title }}
          </span>
          <br />
          <span class="option-item__value">
            {{ formatOptionValue(option) }}
          </span>
        </div>
      </div>
    </div>
    <g-daterange-picker-modal
      :visible="visibleModal"
      :setVisible="handleSetVisibleModal"
      :onChange="handleChangeDaterangeValue"
      :from-date="fromDate"
      :to-date="toDate"
      :controlTime="controlTime || false"
    />
  </div>
</template>

<script>
import GDaterangePickerModal from "./modal/DaterangePickerModal.vue";
import { formatMomentDate } from "@/utils/date";
// import GInput from "./elements/input.vue";
import moment from "moment";
// import { CloseIcon } from "@/components/icons";

export default {
  name: "GDaterangePicker",
  components: {
    GDaterangePickerModal,
  },
  props: [
    "placeholder",
    "fromDate",
    "toDate",
    "onChange",
    "maxHeight",
    "allowClear",
    "controlTime",
    "showCancelOption",
    "removeAll",
  ],
  data() {
    return {
      visibleModal: false,
      openDropdown: false,
      type: "",
      options: [
        {
          key: "yesterday",
          value: {
            fromDate: moment().subtract(1, "day").startOf("day"),
            toDate: moment().subtract(1, "day").endOf("day"),
          },
          title: "Hôm qua",
        },
        {
          key: "week",
          value: {
            fromDate: moment().startOf("week"),
            toDate: moment().endOf("week"),
          },
          title: "Tuần này",
        },
        {
          key: "month",
          value: {
            fromDate: moment().startOf("month"),
            toDate: moment().endOf("month"),
          },
          title: "Tháng này",
        },
        {
          key: "last_month",
          value: {
            fromDate: moment().subtract(1, "months").startOf("month"),
            toDate: moment().subtract(1, "months").endOf("month"),
          },
          title: "Tháng trước",
        },
        {
          key: "custom",
          value: {
            fromDate: moment().startOf("day"),
            toDate: moment().startOf("day"),
          },
          title: "Tùy chọn",
        },
        {
          key: "all",
          value: {
            fromDate: moment().startOf("day").subtract(3, "month"),
            toDate: moment().endOf("day"),
          },
          title: "Tất cả",
        },
      ],
      fromDateValue: this.fromDate,
      toDateValue: this.toDate,
      range: "",
    };
  },
  mounted() {
    this.initValue();
    if (this.removeAll == true) {
      this.options = this.options.filter((item) => item.key !== "all");
    }
    if (this.showCancelOption == true) {
      this.options.push({
        key: "cancel",
        fromDate: null,
        toDate: null,
        title: "Bỏ qua",
      });
    }
  },
  methods: {
    handleSetVisibleModal(_visibleModal) {
      this.visibleModal = _visibleModal;
    },
    openModal() {
      this.visibleModal = true;
    },
    handleChangeDaterangeValue({ fromDate = null, toDate = null }) {
      this.initValue();
      this.fromDateValue = fromDate;
      this.toDateValue = toDate;
      this.onChange({ fromDate, toDate, range: "" });
    },
    onFocusInput() {
      this.openDropdown = true;
    },
    handleClickOutside() {
      this.openDropdown = false;
    },
    setType(_type) {
      this.type = _type;
      this.openDropdown = false;
      if (_type === "custom") {
        this.visibleModal = true;
      }
    },
    formatOptionValue(option) {
      if (option.key == "cancel") return "";
      if (option.key === "today" || option.key === "yesterday") {
        return formatMomentDate(option.value.fromDate, "DD-MM");
      }
      if (option.key === "custom") {
        return "Chọn khoảng thời gian";
      }
      if (option.key === "all") {
        return "";
      }
      const _fromDate = formatMomentDate(option.value.fromDate, "DD-MM");
      const _toDate = formatMomentDate(option.value.toDate, "DD-MM");

      return `${_fromDate} đến ${_toDate}`;
    },
    initValue() {
      let _type = this.fromDateValue && this.toDateValue ? "custom" : "";

      if (this.fromDateValue && this.toDateValue) {
        for (const option of this.options) {
          if (
            option.key != "cancel" &&
            option.value.fromDate?._d.getTime() ===
              this.fromDateValue?._d.getTime() &&
            option.value.toDate?._d.getTime() === this.toDateValue?._d.getTime()
          ) {
            _type = option.key;
            break;
          }
        }
      }

      this.type = _type;
    },
    handleSelectType(option) {
      this.setType(option.key);
      if (option.key !== "custom") {
        this.onChange({ ...(option?.value || {}), range: option.key });
      }
    },
  },

  computed: {
    textDisplay() {
      if (this.type === "custom") {
        if (this.fromDateValue && this.toDateValue) {
          const _fromDate = formatMomentDate(this.fromDateValue, "DD-MM");
          const _toDate = formatMomentDate(this.toDateValue, "DD-MM");
          return `${_fromDate} đến ${_toDate}`;
        } else return "";
      }

      if (this.type === "all") return "Tất cả";

      let _textDisplay = "";

      for (let index = 0; index < this.options.length; index++) {
        if (this.options[index].key === this.type) {
          _textDisplay = this.options[index].title;
          break;
        }
      }

      return _textDisplay;
    },
    getStyle() {
      if (this.maxHeight) {
        return {
          maxHeight: this.maxHeight + "px",
          overflowY: "auto",
        };
      }
      return {};
    },
  },
  watch: {
    fromDateValue() {
      this.initValue();
    },
    toDateValue() {
      this.initValue();
    },
  },
};
</script>

<style lang="scss">
.g-select-daterange-picker {
  padding: 0 !important;
  .rc-virtual-list-holder {
    max-height: unset !important;
  }
  .rc-virtual-list-scrollbar {
    display: none;
  }
  .ant-select-item {
    &:not(:last-child) {
      border-bottom: 1px solid var(--grayColor);
    }
  }
}
.g-daterange-picker-select-month-wrapper {
  width: 100%;
  height: 100%;
  position: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  .g-input {
    cursor: pointer;
    height: 32px;
    box-shadow: none !important;
    text-align: center;
    padding-right: 36px;
  }
  .custom-list-options-wrapper {
    border-radius: 5px;
    z-index: 9999;
    position: absolute;
    right: -20px;
    bottom: -5px;
    transform: translateY(100%);
    width: 200px;
    background-color: #fff;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    overflow: hidden;
    .option-item {
      padding: 0.25em 0.6em;
      cursor: pointer;
      &:not(:last-child) {
        border-bottom: 1px solid #c4c4c4;
      }
      &:hover,
      &.is-selected {
        background-color: rgba(6, 146, 85, 0.6);
        .option-item__title,
        .option-item__value {
          color: #fff !important;
        }
      }
      &__value {
        color: #808080;
      }
      &:last-child {
        .option-item__title {
          color: var(--primaryColor);
        }
      }
    }
  }
  .calendar-icon {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }
}
.picker-month-overview {
  .calendar-from
    .ant-fullcalendar-month-panel-selected-cell
    .ant-fullcalendar-value {
    border-radius: 8px;
    width: 84px;
    height: 28px;
  }
  .calendar-from {
    padding: 0;
  }
  .calendar-from .ant-fullcalendar-today .ant-fullcalendar-value,
  .calendar-from
    .ant-fullcalendar-month-panel-current-cell
    .ant-fullcalendar-value,
  .calendar-to .ant-fullcalendar-today .ant-fullcalendar-value,
  .calendar-to
    .ant-fullcalendar-month-panel-current-cell
    .ant-fullcalendar-value {
    border-radius: 8px;
    width: 84px;
    height: 28px;
  }
  .calendar-from .ant-fullcalendar-value:hover {
    border-radius: 8px;
    width: 84px;
    height: 28px;
  }
}
</style>
