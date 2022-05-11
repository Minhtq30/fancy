<template>
  <g-multiselect
    class="filter-select-wrapper"
    :width="250"
    :maxHeight="200"
    :force-hide="visibleModal"
  >
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Thời gian tạo"
        :style="{ width: '150px', textAlign: 'center' }"
        :open="false"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <list-options
        :showAll="false"
        modeOption="simple"
        :options="optionsOne"
        :checkedListDefault="checkedList"
        @onChange="handleChangeSimple"
      >
        <template #label="{ option }">
          <div :style="{ marginBottom: '3px' }">
            {{ option.title }}
          </div>
        </template>
      </list-options>
    </template>
  </g-multiselect>
  <g-daterange-picker-modal
    :visible="visibleModal"
    :setVisible="handleSetVisibleModal"
    :onChange="handleChangeDaterangeValue"
    :from-date="fromDate"
    :to-date="toDate"
    :controlTime="false"
  />
</template>

<script>
import { defineComponent } from "vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GSelect from "@/components/base/SelectBoxInTable";

// Mixins
import commonMixin from "@/plugins/mixins/common";
import { find } from "lodash";
import moment from "moment";
import GDaterangePickerModal from "@/components/modal/DaterangePickerModal";

const OPTIONS_ONE = [
  {
    key: "today",
    data: {
      fromDate: moment().startOf("day"),
      toDate: moment().endOf("day"),
    },
    title: "Hôm nay",
    value: "today",
  },
  {
    key: "yesterday",
    data: {
      fromDate: moment().subtract(1, "day").startOf("day"),
      toDate: moment().subtract(1, "day").endOf("day"),
    },
    title: "Hôm qua",
    value: "yesterday",
  },
  {
    key: "7_days_ago",
    data: {
      fromDate: moment().subtract(7, "day").startOf("day"),
      toDate: moment().endOf("day"),
    },
    title: "7 ngày trước",
    value: "7_days_ago",
  },
  {
    key: "30_days_ago",
    data: {
      fromDate: moment().subtract(30, "day").startOf("day"),
      toDate: moment().endOf("day"),
    },
    title: "30 ngày trước",
    value: "30_days_ago",
  },
  {
    key: "this_week",
    data: {
      fromDate: moment().startOf("week"),
      toDate: moment().endOf("week"),
    },
    title: "Tuần này",
    value: "this_week",
  },
  {
    key: "this_month",
    data: {
      fromDate: moment().startOf("month"),
      toDate: moment().endOf("month"),
    },
    title: "Tháng này",
    value: "this_month",
  },
  {
    key: "last_month",
    data: {
      fromDate: moment().subtract(1, "months").startOf("month"),
      toDate: moment().subtract(1, "months").endOf("month"),
    },
    title: "Tháng trước",
    value: "last_month",
  },
  {
    key: "custom",
    data: {
      fromDate: moment().startOf("day"),
      toDate: moment().startOf("day"),
    },
    title: "Tùy chọn",
    value: "custom",
  },
  {
    key: "all",
    data: {
      fromDate: moment().startOf("day").subtract(3, "month"),
      toDate: moment().endOf("day"),
    },
    title: "Tất cả",
    value: "all",
  },
];

export default defineComponent({
  name: "FilterCreatedTime",
  components: {
    GDaterangePickerModal,
    GSelect,
    GMultiselect,
    ListOptions,
  },
  props: {
    checkedList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mixins: [commonMixin],
  data() {
    return {
      optionsOne: OPTIONS_ONE,
      from: "",
      to: "",
      fromDate: "",
      toDate: "",
      time: "",
      visibleModal: false,
      customValue: "",
    };
  },
  methods: {
    handleSetVisibleModal(_visibleModal) {
      this.visibleModal = _visibleModal;
    },
    openModal() {
      this.visibleModal = true;
    },
    handleChangeDaterangeValue(value) {
      console.log("handleChangeDaterangeValue");
      console.log(value);
      this.customValue =
        value.fromDate.format("DD/MM") + " - " + value.toDate.format("DD/MM");
      console.log(this.customValue);
      this.$emit("onChange", {
        from: value.fromDate.format("X"),
        to: value.toDate.format("X"),
      });
    },

    handleChange(value) {
      console.log(value);
      this.$emit("onChange", {
        from: this.from,
        to: this.to,
      });
    },
    handleChangeSimple({ value }) {
      this.time = value;
      console.log(value);
      if (value === "custom") {
        this.openModal();
      } else {
        let item = find(this.optionsOne, (x) => x.key === value);
        this.$emit("onChange", {
          from: item.data.fromDate.format("X"),
          to: item.data.toDate.format("X"),
        });
      }
    },
  },
  computed: {
    getText() {
      if (this.time === "custom") {
        return this.customValue;
      } else {
        let item = find(this.optionsOne, (x) => x.key === this.time);
        return item ? item.title : null;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.filter-from-to {
  padding: 0 10px 10px 10px;
}
.filter-from-to-item {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: self-end;
  input {
    text-align: right;
    padding-right: 5px !important;
    text-align: right;
  }
}
</style>
