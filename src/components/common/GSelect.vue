<template>
  <div
    v-click-outside="onClickOutSide"
    :class="{
      'g-select__wrapper': true,
      'g-select__wrapper--disabled': disabled,
    }"
  >
    <div class="input__wrapper">
      <g-input
        :borderless="borderless"
        :class="['g-select__input']"
        :justify="inputJustify"
        :model-value="selectedItemLabel"
        :noBorder="noBorder"
        :placeholder="placeholder"
        :readonly="isReadonly"
        :required="required"
        :innerErrorMessage="innerErrorMessage"
        :outerErrorMessage="outerErrorMessage"
        :errorMessage="errorMessage"
        :numberOnly="numberOnly"
        :inputClass="[
          'g-input--annotation',
          {
            'g-input--hasSuffix': hasSuffix,
          },
        ]"
        type="text"
        @onFocus="onInputFocus"
        @onBlur="onInputBlur"
        @onClick="onInputClick"
        @update:model-value="onInputChange"
        @keyup.enter="handleCloseSelect"
      />
      <span v-if="hasSuffix" class="suffix__wrapper">
        <slot name="suffix"></slot>
      </span>

      <span
        class="arrow__annotation arrow__annotation--reverse"
        @click="onToggle"
        v-if="isOpen"
      >
        <arrow-down-icon></arrow-down-icon>
      </span>
      <span class="arrow__annotation" @click="onToggle" v-else>
        <arrow-down-icon></arrow-down-icon>
      </span>
    </div>
    <transition name="fade">
      <div
        v-if="isOpen"
        class="list__wrapper"
        :class="['list__wrapper', directionClass]"
      >
        <slot name="header" v-if="!isNoResult"></slot>
        <div v-if="isReadonly && showSearch" class="search__wrapper">
          <g-input
            :borderless="true"
            :inputSize="inputSize"
            ref="searchInput"
            @input-change="onInputChange"
            v-model="searchText"
            :placeholder="searchInputPlaceholder"
          />
        </div>
        <div class="result__wrapper">
          <div v-if="isNoResult" class="no-result">{{ noResult }}</div>
          <div
            v-else-if="loading"
            class="t-flex t-items-center t-justify-center"
          >
            <a-spin tip="Đang lấy dữ liệu"></a-spin>
          </div>
          <div v-else class="options_wrapper" ref="optionsWrapperRef">
            <div
              v-for="(item, itemIndex) in filteredDataSource"
              :key="item.value"
              :class="[
                'option',
                {
                  'option--selected': isOptionSelected(item),
                  ['option--' + optionAlign]: true,
                },
              ]"
              :title="item.label"
              @click="onClickOption($event, item)"
            >
              <slot name="option" :item="item" :index="itemIndex">
                <div v-if="multiple" class="t-flex t-items-center">
                  <a-checkbox
                    class="g-checkbox"
                    :checked="isOptionSelected(item)"
                  ></a-checkbox>
                  <span class="t-ml-2">{{ item.label }}</span>
                </div>
                <span v-else>{{ item.label }}</span>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import GInput from "@/components/common/GInput";
import { converVietNamese } from "@/utils/convertVietNamese";
import { filter, includes, size, findIndex, trim, toString } from "lodash";
import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import { DEFAULT_BBS_MAX_WEIGHT } from "@/contants/order";
import $ from "jquery";

export default {
  name: "GSelect",
  props: {
    hideSelectedOption: {
      type: Boolean,
      default: false,
    },
    selectedItem: [Object, Array],
    placeholder: {
      type: String,
      default: "Chọn",
    },
    searchInputPlaceholder: {
      type: String,
      default: "Nhập từ khóa",
    },
    noFilter: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Array,
      required: true,
      default: () => [],
    },
    noResult: {
      type: String,
      default: "Không có kết quả",
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    hasSuffix: {
      type: Boolean,
      default: false,
    },
    optionAlign: {
      type: String,
      default: "left",
    },
    numberOnly: {
      type: Boolean,
      default: false,
    },
    borderless: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    valueType: {
      type: String,
      default: "text",
    },
    type: {
      type: String,
      default: "default",
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
    inputSize: {
      type: Number,
      default: 0,
    },
    inputJustify: {
      type: String,
      default: "left",
    },
    direction: {
      type: String,
      default: "left",
    },
    max: {
      type: Number,
      default: DEFAULT_BBS_MAX_WEIGHT,
    },
    min: {
      type: Number,
      default: 1,
    },
    formatter: {
      type: Function,
    },
    isFormatInteger: {
      default: false,
      type: Boolean,
    },
  },
  components: { ArrowDownIcon, GInput },
  data() {
    return {
      searchText: "",
      isFocusing: false,
    };
  },
  watch: {
    isOpen() {
      if (!this.isOpen) {
        this.searchText = "";
        this.$emit("clear-search");
      }
    },
    selectedItem: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && this.multiple === false) {
          setTimeout(this.scrollToSelectedItem, 50);
        }
      },
      deep: true,
    },
  },
  computed: {
    isReadonly() {
      return this.type === "default";
    },
    /*
     * Kiểm tra hiển thị `list__wrapper`
     */
    isOpen() {
      return this.isFocusing;
    },
    /*
     * Kiểm tra hiển thị `NoResult`
     */
    isNoResult() {
      return size(this.filteredDataSource) === 0 && this.loading === false;
    },
    filteredDataSource() {
      if (this.type === "default" && this.showSearch && !this.noFilter) {
        let formattedSearchText = this.searchText
          ? converVietNamese(this.searchText.trim().toLowerCase())
          : "";
        if (size(formattedSearchText) === 0) return this.dataSource;
        return filter(this.dataSource, (x) =>
          includes(
            converVietNamese(x?.label?.trim()?.toLowerCase()),
            formattedSearchText
          )
        );
      } else if (this.type === "default" && !this.showSearch) {
        return this.dataSource;
      }
      return this.dataSource;
    },
    selectedItemLabel() {
      return this.selectedItem
        ? this.multiple
          ? `Chọn (${size(this.selectedItem)})`
          : this.hideSelectedOption
          ? ""
          : this.selectedItem.label
        : "";
    },
    directionClass() {
      return `list__wrapper--${this.direction}`;
    },
  },
  methods: {
    onToggle(e) {
      e.stopImmediatePropagation();
      this.isFocusing = !this.isFocusing;
    },
    handleCloseSelect() {
      this.isFocusing = false;
    },
    isOptionSelected(option) {
      if (this.multiple) {
        return (
          findIndex(this.selectedItem, (x) => x.value === option.value) > -1
        );
      } else {
        return this.selectedItem && this.selectedItem.value === option.value;
      }
    },
    onInputChange(value) {
      if (this.isFocusing === false) this.isFocusing = true;
      if (this.type === "suggestion") {
        if (this.valueType === "number") {
          let floatValue = parseFloat(trim(value));
          if (size(trim(value)) > 0 && floatValue) {
            if (typeof this.formatter === "function") {
              value = this.formatter(value);
            }
            if (!this.isFormatInteger) {
              if (!Number.isInteger(parseFloat(value))) {
                value = parseFloat(value).toFixed(1);
              }
              if (value.includes(".0")) {
                value = parseFloat(value).toFixed(0);
              }
            } else {
              value = parseFloat(value).toFixed(0);
            }
            if (value > this.max) {
              value = this.max;
            }
            if (value < this.min) {
              value = this.min;
            }
            this.$emit("update:selectedItem", {
              label: toString(value),
              value: parseFloat(value),
            });
          }
        }
      }
      this.$emit("on-input-change", value);
    },
    onClickOption(e, item) {
      e.stopImmediatePropagation();
      if (item?.value != this.selectedItem?.value) {
        let value = item;
        if (this.multiple) {
          value = [...this.selectedItem];
          let findedItemIndex = findIndex(
            this.selectedItem,
            (x) => x.value === item.value
          );
          if (findedItemIndex > -1) {
            value.splice(findedItemIndex, 1);
          } else {
            value.push(item);
          }
        }
        this.$emit("update:selectedItem", value);
        this.$emit("on-selection-change", value);
      }
      if (this.multiple) return;
      this.isFocusing = false;
    },
    onClickOutSide() {
      if (this.isOpen) {
        this.isFocusing = false;
      }
    },
    onSearch() {},
    onInputFocus() {
      this.isFocusing = true;
      setTimeout(this.scrollToSelectedItem, 50);
      setTimeout(() => {
        if (
          this.showSearch &&
          this.$refs.searchInput &&
          this.$refs.searchInput.$el
        ) {
          this.$refs.searchInput.$el.querySelector("input").focus();
        }
      }, 150);
    },
    onInputBlur() {
      setTimeout(() => this.$emit("on-input-blur"), 200);
    },
    onInputClick(value) {
      if (
        this.type === "suggestion" &&
        (value !== this.selectedItemLabel || size(this.dataSource) === 0)
      ) {
        this.$emit("on-input-change", value);
      }
      this.$emit("on-input-click");
    },
    scrollToSelectedItem() {
      const optionsWrapperRef = this.$refs.optionsWrapperRef;
      if (optionsWrapperRef) {
        const optionWrapperEl = $(optionsWrapperRef);
        const selectedItemEl = optionWrapperEl.find(".option--selected");
        if (selectedItemEl && selectedItemEl.position()) {
          const offsetTop =
            selectedItemEl.position().top -
            selectedItemEl.height() * 2 +
            (this.showSearch ? 2 : 0);

          $(optionWrapperEl).animate({ scrollTop: offsetTop }, 10, "linear");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$border-default: #c4c4c4;
$border-option: #dbdbdb;
.g-select__wrapper {
  position: relative;

  &--disabled {
    pointer-events: none;
  }

  .input__wrapper {
    min-height: 2em;
    position: relative;

    .g-select__input {
      &--noBorder {
        border: none;
        border-bottom-width: 0;
      }
    }

    .suffix__wrapper {
      position: absolute;
      right: 25px;
      top: calc(1em - 9px);
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .arrow__annotation {
      position: absolute;
      right: 11px;
      top: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .arrow__annotation--reverse {
      transform: rotate(180deg);
    }
  }

  .list__wrapper {
    min-width: 150px;
    width: fit-content;
    min-width: 100%;
    position: absolute;
    padding: 0.5em 0;
    border: 1px solid $border-default;
    border-radius: 4px;
    z-index: 10;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
    background-color: #fff;
    &--bottom {
      bottom: calc(2em + 5px);
    }
    &--top {
      top: calc(2em + 5px);
    }
    &--left {
      left: 0;
    }
    &--right {
      right: 0;
    }

    .search__wrapper {
      margin-left: 0.5em;
      margin-right: 0.5em;
      margin-bottom: 8px;
    }

    .result__wrapper {
      .no-result {
        // padding-top: 0.5em;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .options_wrapper {
        max-height: 250px;
        overflow-y: auto;
        .option {
          padding: 0.25em 0.5em;
          cursor: pointer;
          display: flex;
          align-items: center;

          span {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            color: #000;
          }

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background-color: rgba(6, 146, 85, 0.6);
            color: #fff;
            .t-text-primary,
            span {
              color: #fff;
            }
          }

          &--center {
            text-align: center;
            justify-content: center;
          }
          &--selected {
            background-color: rgba(6, 146, 85, 0.6);
            color: #fff;

            .t-text-primary,
            span {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped>
.search__wrapper >>> .ant-input {
  font-size: 13px !important;
  border: none;
}
.option--selected >>> .t-text-primary,
.options_wrapper .option:hover >>> .t-text-primary {
  color: #fff;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
