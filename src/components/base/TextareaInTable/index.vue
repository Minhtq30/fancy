<template>
  <textarea
    class="g-textarea-in-table"
    :type="type"
    :value="internalValue"
    spellcheck="false"
    @input="updateInternalValue"
  />
</template>

<script>
import _debounce from "lodash/debounce";

export default {
  name: "GTextAreaInTable",
  props: {
    value: String,
    type: { type: String, default: "text" },
    debounce: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      internalValue: this.value,
      touched: false,
      updateMore: _debounce(function (value) {
        this.touched = false;
        this.$emit("input", value);
        this.$emit("update:value", value);
      }, this.debounce),
    };
  },
  watch: {
    value(value) {
      if (!this.touched) this.internalValue = value;
    },
    debounce(value) {
      this.updateMore = _debounce(function (value) {
        this.touched = false;
        this.$emit("input", value);
        this.$emit("update:value", value);
      }, value);
    },
  },
  methods: {
    updateInternalValue(event) {
      this.touched = true;
      this.updateMore(event.target.value);
    },
  },
};
</script>

<style lang="scss">
.g-textarea-in-table {
  box-shadow: none;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #d7e0d4;
  padding: 12px 0 0;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: 100%;
  max-height: 3rem !important;
}
.g-textarea-in-table:focus {
  border-color: #069255;
  caret-color: #069255;
  outline: none;
}
</style>
