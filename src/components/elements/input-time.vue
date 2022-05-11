<template>
  <div class="flex t-items-center g-input-time">
    <div class="wrapper-input-hour">
      <g-input
        :placeholder="'00'"
        :number-only="true"
        :borderless="false"
        @input="onChangeHours"
        @onBlur="onBlurHours"
        v-model="hoursValue"
      />
      <div class="icon-wrapper">
        <img
          class="icon-up pointer"
          :class="{ 'is-disabled': hoursValue === '23' }"
          src="@/assets/icons/icon_up_input_number.svg"
          @click="addHour"
        />
        <img
          class="icon-down pointer"
          :class="{ 'is-disabled': hoursValue === '00' }"
          src="@/assets/icons/icon_down_input_number.svg"
          @click="subHour"
        />
      </div>
    </div>
    <span class="split-hour-minute">:</span>
    <div class="wrapper-input-minute">
      <g-input
        :placeholder="'00'"
        :number-only="true"
        :borderless="false"
        @input="onChangeMinutes"
        @onBlur="onBlurMinutes"
        v-model="minutesValue"
      />
      <div class="icon-wrapper">
        <img
          class="icon-up pointer"
          :class="{ 'is-disabled': minutesValue === '59' }"
          src="@/assets/icons/icon_up_input_number.svg"
          @click="addMinute"
        />
        <img
          class="icon-down pointer"
          :class="{ 'is-disabled': minutesValue === '00' }"
          src="@/assets/icons/icon_down_input_number.svg"
          @click="subMinute"
        />
      </div>
    </div>
    <a-tooltip :title="errorMessage">
      <info-icon
        class="ml icon-error-description"
        :class="{ 'is-show': !!errorMessage }"
        :fill="'red'"
      />
    </a-tooltip>
  </div>
</template>

<script>
import GInput from "../common/GInput.vue";
import InfoIcon from "@/components/icons/InfoIcon.vue";

export default {
  name: "InputTime",
  components: {
    GInput,
    InfoIcon,
  },
  props: ["value", "onChange", "errorMessage"],
  data() {
    return {
      hoursValue: (this.value || "00:00").split(":")[0],
      minutesValue: (this.value || "00:00").split(":")[1],
    };
  },
  methods: {
    onChangeHours(event) {
      let _hour = event.target.value;
      if (Number(_hour) > 23) {
        _hour = "23";
      }
      console.log(_hour);
      this.hoursValue = _hour;
    },
    onChangeMinutes(event) {
      let _minute = event.target.value;
      if (Number(_minute) > 59) {
        _minute = "59";
      }
      console.log(_minute);
      this.minutesValue = _minute;
    },
    onBlurHours() {
      let _hour = this.hoursValue;
      if (!_hour) _hour = "00";

      this.hoursValue = _hour.padStart(2, "0");
    },
    onBlurMinutes() {
      let _minute = this.minutesValue;
      if (!_minute) _minute = "00";
      this.minutesValue = _minute.padStart(2, "0");
    },
    addHour() {
      let _hour = Number(this.hoursValue) + 1;
      this.hoursValue = _hour > 23 ? "23" : _hour.toString().padStart(2, "0");
    },
    subHour() {
      let _hour = Number(this.hoursValue) - 1;
      this.hoursValue = _hour < 0 ? "00" : _hour.toString().padStart(2, "0");
    },
    addMinute() {
      let _minute = Number(this.minutesValue) + 1;
      this.minutesValue =
        _minute > 59 ? "59" : _minute.toString().padStart(2, "0");
    },
    subMinute() {
      let _minute = Number(this.minutesValue) - 1;
      this.minutesValue =
        _minute < 0 ? "00" : _minute.toString().padStart(2, "0");
    },
  },
  watch: {
    hoursValue(_hour) {
      let hourValue = _hour || "00";
      if (hourValue !== this.hours) {
        if (Number(hourValue) > 23) hourValue = "23";
        if (this.onChange) {
          this.onChange(`${hourValue}:${this.minutesValue || "00"}`);
        }
      }
    },
    minutesValue(_minute) {
      let minuteValue = _minute || "00";
      if (minuteValue !== this.minutes) {
        if (minuteValue > 59) minuteValue = "59";
        if (this.onChange) {
          this.onChange(`${this.hoursValue || "00"}:${minuteValue}`);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.g-input-time {
  height: 32px;
  .wrapper-input-hour,
  .wrapper-input-minute {
    position: relative;
  }
  .split-hour-minute {
    margin: 0 4px;
  }
  .icon-wrapper {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    img {
      &:first-child {
        margin-bottom: 1px;
      }
      &:last-child {
        margin-top: 1px;
      }
      &.is-disabled {
        opacity: 0.65;
      }
    }
  }
  .icon-error-description {
    position: absolute;
    right: -20px;
    visibility: hidden;
    transition: 0.1s linear;
    opacity: 0;
    &.is-show {
      opacity: 1;
      right: -30px;
      visibility: visible;
    }
  }
}
</style>

<style lang="scss">
.g-input-time {
  .g-input {
    color: #000;
    font-weight: 500;
    padding-right: 10px !important;
    width: 40px !important;
    text-align: center;
  }
}
</style>
