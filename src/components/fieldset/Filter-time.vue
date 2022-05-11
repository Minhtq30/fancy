<template>
  <ul class="choose-time-filter t-justify-end">
    <div v-on:click="changeQueryRange('day')" class="filter-time">
      <li :class="range === 'day' ? 'bgday' : ''" id="day-filter" tabindex="0">
        <b>Hôm nay</b>
      </li>
    </div>
    <div v-on:click="changeQueryRange('7_day_before')" class="filter-time">
      <li
        :class="range === '7_day_before' ? 'bgweek' : ''"
        id="week-filter"
        tabindex="1"
      >
        <b>7 ngày trước</b>
      </li>
    </div>
    <div v-on:click="changeQueryRange('30_day_before')" class="filter-time">
      <li
        :class="range === '30_day_before' ? 'bgmonth' : ''"
        id="month-filter"
        tabindex="2"
      >
        <b>30 ngày trước</b>
      </li>
    </div>

    <div class="filter-time t-relative">
      <li
        :class="range === 'custom' ? 'bgoption' : 'bgoption-default'"
        id="option-filter"
        tabindex="3"
      >
        <g-date-picker-select
          :placeholder="'Thời gian đăng đơn'"
          :onChange="handleChangeCustomerCreated"
        />
      </li>
    </div>
  </ul>
</template>

<script>
import { GDatePickerSelect } from "@/components";

export default {
  data() {
    return {
      range: "7_day_before",
    };
  },
  components: {
    GDatePickerSelect,
  },
  methods: {
    handleChangeCustomerCreated({ fromDate, toDate, range }) {
      this.range = "custom";
      this.$store.commit("overview/setQuery", {
        range: range ? range : "",
        from: fromDate ? fromDate.format("YYYY-MM-DD") : "",
        to: toDate ? toDate.format("YYYY-MM-DD") : "",
      });
    },

    changeQueryRange(range) {
      this.range = range;
      this.$store.commit("overview/setQuery", {
        range: range,
      });
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
    min-width: 150px;
    height: 40px;
    border-radius: 100px;
    border-color: #fff;
    background-color: #eaeaea;
    color: #069255;
    list-style: none;
    display: flex;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
    justify-content: center;
  }
}
.bgday {
  font-family: sans-serif;
  width: fit-content;
  text-align: center;
  border-radius: 100px;
  min-width: 150px;
  height: 40px;
  color: #fff;
  background-color: #069255;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bgweek {
  font-family: sans-serif;
  width: fit-content;
  text-align: center;
  border-radius: 100px;
  min-width: 150px;
  height: 40px;
  color: #fff;
  background-color: #069255;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bgmonth {
  font-family: sans-serif;
  width: fit-content;
  text-align: center;
  border-radius: 100px;
  min-width: 150px;
  height: 40px;
  color: #fff;
  background-color: #069255;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bgoption {
  font-family: sans-serif;
  width: fit-content;
  text-align: center;
  border-radius: 100px;
  min-width: 150px;
  height: 40px;
  color: #fff;
  background-color: #069255;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bgoption-default {
  font-family: sans-serif;
  width: fit-content;
  text-align: center;
  border-radius: 100px;
  min-width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
