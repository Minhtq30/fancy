<template>
  <div class="g-daterange-picker-select-wrapper">
    <div
      v-click-outside="handleClickOutside"
      :class="{ 'allow-clear': allowClear, 'has-value': fromDate && toDate }"
    >
      <a-tooltip :title="!!showTooltip ? textDisplay : ''">
        <g-input
          :value="textDisplay"
          :placeholder="placeholder || 'Chọn khoảng thời gian'"
          :readonly="true"
          @focus="onFocusInput"
        />
      </a-tooltip>
      <div
        class="list-options-wrapper"
        :style="{ ...getStyle }"
        :class="{ [`placement-${placement}`]: !!placement }"
        v-if="openDropdown"
      >
        <div
          v-for="option in options"
          :key="option.key"
          class="option-item"
          :class="{ 'is-selected': type === option.key }"
          @click="handleSelectType(option)"
        >
          <span
            class="option-item__title"
            :class="{ 'primary-text': option.key === 'all' }"
          >
            {{ option.title }}
          </span>
          <br />
          <span class="option-item__value">
            {{ formatOptionValue(option) }}
          </span>
        </div>
      </div>
      <img
        v-if="iconType === 'arrow'"
        class="action-icon suffix-icon"
        src="@/assets/icons/arrow_down_select.svg"
      />
      <img
        v-else
        class="action-icon suffix-icon"
        src="@/assets/icons/calendar.svg"
      />
      <close-icon
        v-if="allowClear"
        class="action-icon close-icon"
        :width="'14px'"
        :height="'14px'"
        :fill="'#bfbfbf'"
        @click="handleReset"
      />
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
import GInput from "./elements/input.vue";
import { CloseIcon } from "@/components/icons";
import {
  OPTION_DATE_TIME_PICKER,
  THREE_LAST_MONTH_DATE_RANGE,
  TWO_LAST_MONTH_DATE_RANGE,
} from "@/contants/date";

export default {
  name: "GDaterangePicker",
  components: {
    GDaterangePickerModal,
    GInput,
    CloseIcon,
  },
  props: [
    "optionDescription",
    "defaultOption",
    "showCancelOption",
    "removeOption",
    "placeholder",
    "fromDate",
    "toDate",
    "onChange",
    "maxHeight",
    "allowClear",
    "controlTime",
    "iconType",
    "isIncremental",
    "showTooltip",
    "isFilterTimeWalletLayout",
    "placement",
  ],
  data() {
    return {
      visibleModal: false,
      openDropdown: false,
      type: "",
      options: OPTION_DATE_TIME_PICKER.filter(
        (o) =>
          o.key !== (this.isIncremental ? "all" : "incremental") &&
          o.key !== (!this.showCancelOption ? "cancel" : "")
      ),
    };
  },
  mounted() {
    if (this.removeOption) {
      this.options = this.options.filter(
        (o) => !this.removeOption.includes(o.key)
      );
    }
    this.initValue();
    this.checkFilterTimeWalletLayout();
  },
  methods: {
    //sửa tạm theo màn ví , sau muốn tái sử dụng phải sửa lại
    checkFilterTimeWalletLayout() {
      if (this.isFilterTimeWalletLayout) {
        this.options.splice(
          this.options.length - 1,
          0,
          {
            key: "tow_last_month",
            value: TWO_LAST_MONTH_DATE_RANGE,
            title: "2 tháng trước",
          },
          {
            key: "three_last_month",
            value: THREE_LAST_MONTH_DATE_RANGE,
            title: "3 tháng trước",
          }
        );
      }
    },
    handleSetVisibleModal(_visibleModal) {
      this.visibleModal = _visibleModal;
    },
    openModal() {
      this.visibleModal = true;
    },
    handleChangeDaterangeValue(value) {
      this.onChange(value, this.type);
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
      if (this.optionDescription && option.key == this.optionDescription.key) {
        return this.optionDescription.description;
      }
      if (option.key == "cancel") return "";
      if (option.key === "incremental") {
        return "Tính cho đến hôm nay";
      }
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
      if (
        (!this.fromDate && this.toDate) ||
        (!this.fromDate && !this.toDate && this.isIncremental)
      ) {
        this.type = "incremental";
        return;
      }

      let _type = this.fromDate && this.toDate ? "custom" : "";

      if (this.fromDate && this.toDate) {
        for (const option of this.options) {
          if (
            option.value.fromDate?._d.getTime() ===
              this.fromDate?._d.getTime() &&
            option.value.toDate?._d.getTime() === this.toDate?._d.getTime()
          ) {
            _type = option.key;
            break;
          }
        }
      }

      this.type = _type;
    },
    handleSelectType(option) {
      if (option.key == "cancel") {
        let optDefault;
        if (this.defaultOption) {
          optDefault = this.options.find((o) => o.key === this.defaultOption);
        }
        this.type = this.isIncremental
          ? "incremental"
          : optDefault
          ? optDefault.key
          : "";
        if (!this.isIncremental && optDefault) option = optDefault;
        this.openDropdown = false;
      } else {
        this.setType(option.key);
      }
      if (option.key !== "custom") {
        this.handleChangeDaterangeValue(option.value);
      }
    },
    handleReset() {
      this.handleChangeDaterangeValue({
        fromDate: null,
        toDate: null,
      });
    },
  },
  computed: {
    textDisplay() {
      if (this.type === "custom") {
        if (this.fromDate && this.toDate) {
          const _fromDate = formatMomentDate(this.fromDate, "DD-MM");
          const _toDate = formatMomentDate(this.toDate, "DD-MM");
          return `${_fromDate} đến ${_toDate}`;
        } else return "";
      }

      if (this.type === "all") return "Tất cả";
      if (this.type === "incremental") return "Cộng dồn";

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
    fromDate() {
      this.initValue();
    },
    toDate() {
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
.g-daterange-picker-select-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  &.allow-clear.has-value {
    .suffix-icon {
      display: none;
    }
    .close-icon {
      display: block;
    }
  }
  .g-input {
    cursor: pointer;
    height: 32px;
    box-shadow: none !important;
    text-align: center;
    padding-right: 36px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .list-options-wrapper {
    border-radius: 5px;
    z-index: 9999;
    position: absolute;
    bottom: -5px;
    transform: translateY(100%);
    width: 100%;
    min-width: 181px;
    background-color: #fff;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    overflow: hidden;
    &.placement-right {
      right: 0;
    }
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
    }
  }
  .action-icon {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }
  .close-icon {
    cursor: pointer;
    display: none;
  }
}
</style>
