<template>
  <div class="g-input__wrapper">
    <input
      ref="input"
      :type="valueType"
      :id="inputId"
      :size="inputPlaceHolder.length || 22"
      :class="[
        'g-input',
        justifyClass,
        inputClass,
        {
          'g-input--borderless': borderless,
          'g-input--noBorder': noBorder,
          'g-input--hasError': hasError,
        },
      ]"
      :readonly="readonly"
      :value="inputValue"
      :title="inputTitle"
      :placeholder="inputPlaceHolder"
      :autocomplete="autocomplete"
      @input="onChangeInputValue"
      @focus="onFocus"
      @blur="onBlur"
      @click="onClick"
    />
    <transition name="inner">
      <div
        class="hasError t-text-warning t-w-full t-text-center"
        v-if="hasSelectError"
        @click="onFocus()"
      >
        {{ errorMessage }}
      </div>
    </transition>
    <transition name="inner">
      <span
        class="hasError t-text-warning"
        v-if="hasInnerError"
        @click="
          $refs.input.focus();
          onFocus();
        "
      >
        {{ innerErrorMessage }}
      </span>
    </transition>
    <transition name="outer">
      <div class="outerError t-text-warning" v-if="hasOuterError">
        {{ outerErrorMessage }}
      </div>
    </transition>
    <div class="g-input-suffix" v-if="hasSuffix">
      <slot name="suffix"> </slot>
    </div>
  </div>
</template>

<script>
import { size, trim } from "lodash";
import common from "@/utils/common";

export default {
  name: "GInput",
  props: {
    modelValue: [String, Number],
    iconType: String,
    placeholder: {
      type: String,
      default: "Nhập",
    },
    autocomplete: {
      type: String,
      default: "on",
    },
    inputId: String,
    inputClass: {
      type: [String, Object, Array],
    },

    justify: {
      type: String,
      default: "left",
    },
    borderless: {
      type: Boolean,
      default: true,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    numberOnly: {
      type: Boolean,
      default: false,
    },

    formatter: {
      type: Function,
    },
    parser: {
      type: Function,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    innerErrorMessage: {
      type: String,
      default: "",
    },
    outerErrorMessage: {
      type: String,
      default: "",
    },
    hasValueType: {
      type: Boolean,
      default: false,
    },
    valueType: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 0,
    },
    hasSuffix: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFocus: false,
    };
  },
  computed: {
    isShowIcon() {
      return (
        this.iconType &&
        this.iconType !== "" &&
        this.iconType !== null &&
        this.iconType !== undefined
      );
    },
    icon() {
      return `${this.iconType}-icon`;
    },
    justifyClass() {
      return `t-text-${this.justify}`;
    },
    inputValue() {
      return this.formatter ? this.formatter(this.modelValue) : this.modelValue;
    },
    inputTitle() {
      return this.hasError
        ? this.outerErrorMessage || this.innerErrorMessage
        : this.inputValue;
    },
    hasError() {
      return this.hasInnerError || this.hasOuterError || this.hasSelectError;
    },
    hasSelectError() {
      return size(this.errorMessage) > 0;
    },
    hasInnerError() {
      return size(this.innerErrorMessage) > 0 && this.isFocus === false;
    },
    hasOuterError() {
      return size(this.outerErrorMessage) > 0;
    },
    inputPlaceHolder() {
      return this.hasInnerError || this.hasSelectError ? "" : this.placeholder;
    },
  },
  methods: {
    onFocus() {
      this.isFocus = true;
      this.$emit("onFocus");
    },
    onClick() {
      this.isFocus = true;
      this.$emit("onClick", this.modelValue);
    },
    onBlur() {
      this.isFocus = false;
      this.$emit("onBlur");
    },
    onChangeInputValue(e) {
      let isUpdate = true;
      let inputValue = e.target.value;
      if (this.parser) {
        inputValue = this.parser(inputValue);
      }
      if (
        size(trim(inputValue)) > 0 &&
        this.numberOnly &&
        !common.isNumeric(inputValue)
      ) {
        inputValue = this.modelValue;
        if (this.$refs.input) {
          this.$refs.input.value = inputValue || "";
          isUpdate = false;
        }
      }
      if (isUpdate === true) {
        this.$emit("update:modelValue", inputValue);
        this.$emit("input-change", inputValue);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$border-default: #c4c4c4;
$border-error: #eb5757;
.g-input__wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  flex-direction: column;

  .g-input-icon__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1em;
  }
  .hasError {
    position: absolute;
    font-size: 16px;
  }
  .outerError {
    font-size: 16px;
    text-align: left;
  }
  .g-input-suffix {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .g-input {
    font-size: 14px;
    min-height: 2em;
    min-width: 100%;
    width: 100%;
    border-radius: 5px;
    border: 1px solid $border-default;
    padding: 4px 0.25rem;

    &--borderless {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid $border-default;
    }

    &--noBorder {
      border-radius: 0;
      border: none;
      border-bottom-width: 0;
    }

    &--annotation {
      padding-right: 23px;
    }
    &--hasSuffix {
      padding-right: 70px;
    }
    &--hasError {
      border-color: $border-error;
    }

    &:focus-visible {
      outline: none;
    }
  }
}
.outer-enter-active,
.outer-leave-active {
  transition: opacity 0.15s;
}
.outer-enter, .outer-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
