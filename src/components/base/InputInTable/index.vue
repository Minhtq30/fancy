<template>
  <input
    ref="inputInTable"
    class="g-input-in-table"
    :type="type"
    :value="internalValue"
    spellcheck="false"
    @input="updateInternalValue"
  />
</template>

<script>
import _debounce from "lodash/debounce";

export default {
  name: "GInputInTable",
  props: {
    value: {
      type: String,
      default: "",
    },
    innerRef: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    debounce: {
      type: Number,
      default: 1,
    },
    formatter: {
      type: Function,
    },
  },
  data() {
    return {
      internalValue: this.getValue(this.value),
      touched: false,
      updateValue: _debounce(function (value) {
        this.touched = false;
        this.$emit("input", this.getValue(value));
        this.$emit("update:value", this.getValue(value));
      }, this.debounce),
    };
  },
  watch: {
    value(value) {
      if (!this.touched) {
        this.internalValue = this.getValue(value);
      }
    },
    debounce(value) {
      this.updateValue = _debounce(function (value) {
        this.touched = false;
        this.$emit("input", this.getValue(value));
        this.$emit("update:value", this.getValue(value));
      }, value);
    },
  },
  methods: {
    updateInternalValue(event) {
      this.touched = true;
      this.internalValue = this.getValue(event.target.value);
      this.updateValue(event.target.value);
    },
    getValue(value) {
      return typeof this.formatter === "function"
        ? this.formatter(value)
        : value;
    },
    getRefInput() {
      return this.$refs.inputInTable;
    },
  },
};
</script>

<style lang="scss">
.g-input-in-table {
  box-shadow: none;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #d7e0d4;
  padding: 12px 0 0;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: 100%;
  height: 2rem !important;
}
.g-input-in-table:focus {
  border-color: #069255;
  caret-color: #069255;
  outline: none;
}
</style>
