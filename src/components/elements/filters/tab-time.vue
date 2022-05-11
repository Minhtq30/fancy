<template>
  <ul class="choose-time-filter t-justify-end">
    <div
      v-for="option in options"
      :key="option.key"
      v-on:click="handleClick(option)"
      class="filter-time"
      :class="{ 'is-active': range === option.key }"
    >
      <li>
        <b>{{ option.title }}</b>
      </li>
    </div>

    <div
      v-if="!notHasCustom"
      class="filter-time t-relative"
      :class="{ 'is-active': range === 'custom' }"
    >
      <li>
        <g-date-picker-select
          :key="refresh"
          :placeholder="'Thời gian'"
          :onChange="handleChangeCustomTime"
          :fromDate="range === 'custom' ? fromDate : null"
          :toDate="range === 'custom' ? toDate : null"
          :removeAll="removeAll"
          :showCancelOption="showCancelOption"
        />
      </li>
    </div>
  </ul>
</template>

<script>
import { GDatePickerSelect } from "@/components";

export default {
  name: "FilterTabTime",
  props: [
    "options",
    "onChange",
    "notHasCustom",
    "fromDate",
    "toDate",
    "showCancelOption",
    "removeAll",
  ],
  data() {
    return {
      range: "all",
      refresh: false,
    };
  },
  components: {
    GDatePickerSelect,
  },
  methods: {
    initValue() {
      let checkOption = false;
      if (this.fromDate && this.toDate) {
        for (const option of this.options) {
          if (
            option.key != "all" &&
            option.value.fromDate?._d.getTime() ===
              this.fromDate?._d.getTime() &&
            option.value.toDate?._d.getTime() === this.toDate?._d.getTime()
          ) {
            this.range = option.key;
            checkOption = true;
            break;
          }
        }
        if (!checkOption) {
          this.range = "custom";
        }
      }
    },
    handleClick(option) {
      this.range = option.key;
      this.onChange(option.value, option.key);
    },
    handleChangeCustomTime(dates) {
      if (dates.fromDate && dates.toDate) {
        this.range = "custom";
        this.onChange(dates);
      }
      if (dates.range == "cancel") {
        this.range = "all";
        this.onChange("all", null);
        this.refresh = !this.refresh;
      }
    },
  },
  watch: {
    toDate: {
      immediate: true,
      handler() {
        this.initValue();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.choose-time-filter {
  display: flex;
  margin: 0;

  .filter-time {
    font-family: sans-serif;
    width: fit-content;
    text-align: center;
    height: 32px;
    border-radius: 100px;
    border-color: #fff;
    background-color: #eaeaea;
    color: #069255;
    list-style: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    padding: 0 1rem;
    &:not(:last-child) {
      margin-right: 10px;
    }
    &.is-active {
      color: #fff;
      background-color: #069255;
    }
    @media only screen and (max-width: 1600px) {
      max-width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: sans-serif;
      font-size: 14px;
    }
  }
}
</style>
