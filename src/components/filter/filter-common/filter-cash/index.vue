<template>
  <g-multiselect class="filter-select-wrapper" :width="250" :maxHeight="200">
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Tiền thu hộ"
        :style="{ width: '117px', textAlign: 'center' }"
        :open="false"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <list-options
        :showAll="false"
        modeOption="simple"
        :options="optionsOne"
        @onChange="handleChangeSimple"
        :checkedListDefault="checkedList"
      />
      <list-options
        :showAll="false"
        :options="optionsMulti"
        @onChange="handleChange"
        :checkedListDefault="checkedList"
      />
      <div v-show="cashFix.length > 0" class="filter-from-to">
        <div class="filter-from-to-item">
          <div>Từ</div>
          <div>
            <g-input-in-table
              @onChange="handleChangeInput"
              :formatter="currencyFormatter"
              v-model:value="from"
              :debounce="1000"
              :style="{ width: '190px' }"
            />
            <span>đ</span>
          </div>
        </div>
        <div class="filter-from-to-item">
          <div>đến</div>
          <div>
            <g-input-in-table
              :formatter="currencyFormatter"
              v-model:value="to"
              :debounce="1000"
              :style="{ width: '190px' }"
            />
            <span>đ</span>
          </div>
        </div>
      </div>
    </template>
  </g-multiselect>
</template>

<script>
import { defineComponent } from "vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GSelect from "@/components/base/SelectBoxInTable";
import GInputInTable from "@/components/base/InputInTable";

// Mixins
import commonMixin from "@/plugins/mixins/common";
import { size } from "lodash";

const OPTIONS_ONE = [
  { key: "increase", value: "increase", label: "Tăng dần" },
  { key: "decrease", value: "decrease", label: "Giảm dần" },
];

const OPTIONS_MULTI = [
  { key: "range", value: "range", label: "Khoảng giá trị" },
];

export default defineComponent({
  name: "FilterCash",
  components: {
    GSelect,
    GInputInTable,
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
      optionsMulti: OPTIONS_MULTI,
      from: 0,
      to: 0,
      cashFix: [],
      cashOption: [],
    };
  },
  watch: {
    to() {
      this.handleChangeInput();
    },
    from() {
      this.handleChangeInput();
    },
  },
  methods: {
    handleChangeInput() {
      // Nếu có tích vào khoảng giá trị mới bắn @onChange
      if (size(this.cashFix) > 0) {
        this.$emit("onChange", {
          data: [...this.cashFix, ...this.cashOption],
          dataRange: { from: this.from, to: this.to },
        });
      }
    },
    handleChange(value) {
      this.cashFix = value.checkedList;
      this.$emit("onChange", {
        data: [...this.cashFix, ...this.cashOption],
        dataRange: { from: this.from, to: this.to },
      });
    },
    handleChangeSimple({ value }) {
      this.cashOption = [value];
      this.$emit("onChange", {
        data: [...this.cashFix, ...this.cashOption],
        dataRange: { from: this.from, to: this.to },
      });
    },
  },
  computed: {
    getText() {
      if (this.checkedList.includes("range")) {
        // Nếu có tùy chọn thì hiển thị theo tùy chọn.
        return `${this.from}đ - ${this.to}đ`;
      }
      if (this.checkedList.includes("increase")) {
        return "Tăng dần";
      }
      if (this.checkedList.includes("decrease")) {
        return "Giảm dần";
      }
      return null;
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
