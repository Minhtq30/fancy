<template>
  <g-multiselect class="filter-select-wrapper" :maxHeight="269">
    <template #contentDropdown>
      <g-select
        class="filter-select"
        :placeholder="placeholder"
        :style="{ width: '100%', textAlign: 'center' }"
        :open="false"
        :value="textGeneratedFromPickedOption"
      ></g-select>
    </template>
    <template #contentOption>
      <p
        class="t-m-0 t-text-[16px] t-font-medium t-px-[10px] t-my-[5px] t-text-black"
      >
        Gợi ý
      </p>
      <list-options
        :showAll="false"
        modeOption="simple"
        :options="optionsOne"
        @onChange="handleChangeSimple"
        :checkedListDefault="checkListData"
      />
      <p
        class="t-m-0 t-text-[16px] t-font-medium t-px-[10px] t-mt-[5px] t-text-black"
      >
        Tùy chỉnh
      </p>
      <div class="filter-from-to">
        <div class="filter-from-to-item t-mt-[5px] t-text-black">
          <div>Từ</div>
          <div class="t-mb-[4px]">
            <g-input
              class="input-filter-total-sell"
              @onChange="handleChangeInput"
              placeholder=""
              v-model="from"
              :debounce="1000"
              :numberOnly="true"
              :outerErrorMessage="validate.inputFrom"
              :formatter="$filters.integerFormatter"
              :parser="$filters.numberCommaParser"
              :style="{ width: '175px' }"
            />
          </div>
        </div>
        <div class="filter-from-to-item t-text-black">
          <div>Đến</div>
          <div class="t-mb-[4px]">
            <g-input
              class="input-filter-total-sell"
              placeholder=""
              v-model="to"
              @onChange="handleChangeInput"
              :debounce="1000"
              :numberOnly="true"
              :outerErrorMessage="validate.inputTo"
              :formatter="$filters.integerFormatter"
              :parser="$filters.numberCommaParser"
              :style="{ width: '175px' }"
            />
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
// import GInputInTable from "@/components/base/InputInTable";
import { GInput } from "@/components";
// Mixins
import commonMixin from "@/plugins/mixins/common";

export default defineComponent({
  name: "FilterTotal",
  components: {
    GSelect,
    GInput,
    GMultiselect,
    ListOptions,
  },
  props: {
    listOptionSelected: {
      type: Array,
      default() {
        return [];
      },
    },
    placeholder: String,
    checkedList: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultFromValue: {
      type: Number,
      default: null,
      required: false,
    },

    defaultToValue: {
      type: Number,
      default: null,
      required: false,
    },
  },
  mixins: [commonMixin],

  data() {
    return {
      optionsOne: this.listOptionSelected,
      from: "",
      to: "",
      textGeneratedFromPickedOption: null,
      validate: {
        inputFrom: "",
        inputTo: "",
      },
      checkListData: this.checkedList,
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

  mounted() {
    if (
      (this.defaultFromValue || this.defaultToValue) &&
      this.listOptionSelected.length
    ) {
      for (let i = 0; i < this.listOptionSelected.length; i++) {
        if (
          this.listOptionSelected[i].range.from === this.defaultFromValue &&
          this.listOptionSelected[i].range.to === this.defaultToValue
        ) {
          this.checkListData = [this.listOptionSelected[i].value];
          this.textGeneratedFromPickedOption = this.listOptionSelected[i].label;
          return;
        }
      }
    }
    if (this.defaultFromValue || this.defaultToValue) {
      this.from = this.defaultFromValue;
      this.to = this.defaultToValue;
      this.textGeneratedFromPickedOption = `${this.from} - ${this.to}`;
    }
  },
  methods: {
    handleChangeInput() {
      if (this.from && this.to) {
        if (Number(this.from) <= Number(this.to)) {
          this.checkListData = [];
          this.validate.inputTo = "";
          this.textGeneratedFromPickedOption = `${this.from} - ${this.to}`;
          this.$emit("onChange", {
            key: this.textGeneratedFromPickedOption,
            valueRange: { from: this.from, to: this.to },
          });
        } else {
          this.textGeneratedFromPickedOption = "";
          this.validate.inputTo = `Giá trị hợp lệ > ${this.from}`;
        }
      } else {
        this.textGeneratedFromPickedOption = null;
        this.validate.inputTo = "";
        this.$emit("onChange", {
          key: "",
          valueRange: {
            from: undefined,
            to: undefined,
          },
        });
      }
    },

    handleChangeSimple({ value }) {
      if (value === undefined) {
        this.textGeneratedFromPickedOption = null;
        this.$emit("onChange", {
          key: "",
          valueRange: {
            from: undefined,
            to: undefined,
          },
        });
        return;
      }
      const selectedOption = this.listOptionSelected.find(
        (item) => item.value === value
      );
      this.textGeneratedFromPickedOption = selectedOption.label;
      this.from = "";
      this.to = "";
      if (selectedOption) {
        this.$emit("onChange", {
          key: this.textGeneratedFromPickedOption,
          valueRange: {
            from: selectedOption.range.from,
            to: selectedOption.range.to,
          },
        });
      } else {
        this.$emit("onChange", {
          key: "",
          valueRange: {
            from: undefined,
            to: undefined,
          },
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.filter-from-to {
  padding: 0 10px 15px 10px;
}
.filter-from-to-item {
  margin-top: 0;
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
<style lang="scss">
.input-filter-total-sell {
  input {
    text-align: right;
    padding: 2px 0.25rem;
  }
  .outerError {
    font-size: 12px !important;
    text-align: right !important;
    right: 0;
    width: 100%;
    position: absolute;
    top: 30px;
    z-index: 99;
  }
}
</style>
