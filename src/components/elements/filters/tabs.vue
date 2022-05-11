<template>
  <div
    class="filter-tab wrapper t-relative flex t-items-center t-justify-between"
    :class="{ [customClass]: true }"
    :style="{ 'max-width': `calc(100% - ${offsetLeft}px)` }"
  >
    <div class="inner">
      <div
        class="inner-content flex"
        :style="{ transform: `translateX(-${offset}px)` }"
      >
        <div
          v-for="option in options"
          class="option-item pointer"
          :key="option.key"
          :class="{
            'is-active': value.includes(option.key),
            'toggle-option-all':
              !checkOptionAllTag &&
              isDetailWalletLayout &&
              option.key === 'all',
            'is-all font-medium':
              isDetailWalletLayout &&
              option.key === 'all' &&
              value.includes('all'),
          }"
          @click="handleOnChange(option.key)"
        >
          {{ option.title }}
          <span v-if="extraInfoDetail && value.includes(option.key)"
            >{{ paymentQuantity(option.key) || 0 }} GD</span
          >
        </div>
      </div>
    </div>
    <div v-if="isShowNavigate" class="arrow-icon pointer">
      <img
        v-if="index !== 0"
        class="prev-icon"
        @click="prevIndex"
        src="@/assets/icons/menu_right_submenu_right.svg"
      />
      <img
        @click="nextIndex"
        :class="{ 'is-disabled': isDisabledForNext }"
        src="@/assets/icons/menu_right_submenu_right.svg"
      />
    </div>
  </div>
</template>

<script>
import { isEmptyObject } from "@/utils";

export default {
  name: "FilterTabs",
  props: [
    "options",
    "value",
    "onChange",
    "offsetLeft",
    "customClass",
    "isSingle",
    "extraInfoDetail",
    "isDetailWalletLayout",
  ],
  data() {
    return {
      index: 0,
      offset: 0,
      listItems: [],
      minusOffset: 0,
      totalWidth: 0,
      isShowNavigate: false,
      offsetValue: 0,
      checkOptionAllTag: true,
    };
  },
  updated() {
    this.listItems = document.querySelectorAll(
      `.${this.customClass} .option-item`
    );
    this.$nextTick(this.updateOffset);
    window.addEventListener("resize", this.updateOffset);

    const element = document.getElementById("menu-right-container");
    this.observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        const newValue = m.target.getAttribute(m.attributeName);
        this.$nextTick(() => {
          this.onClassChange(newValue, m.oldValue);
        });
      }
    });

    this.observer.observe(element, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["class"],
    });
  },
  computed: {
    isDisabledForNext() {
      return this.offset > this.offsetValue + 15;
    },
    isSelectedAll() {
      return this.value?.length === this.options?.length;
    },
  },
  methods: {
    paymentQuantity(key) {
      if (!isEmptyObject(this.extraInfoDetail) && this.isDetailWalletLayout) {
        const quanlity = this.extraInfoDetail[key] || 0;
        return quanlity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return 0;
    },
    handleOnChange(value) {
      if (this.isSingle) {
        this.onChange([value]);
      } else {
        if (value === "all") {
          if (this.isDetailWalletLayout) {
            this.checkOptionAllTag = !this.checkOptionAllTag;
            this.onChange(this.checkOptionAllTag ? ["all"] : [], true);
          } else {
            this.onChange(["all"], true);
          }
          // this.onChange(
          //   this.isSelectedAll
          //     ? ["all"]
          //     : this.options.map((option) => option.key)
          // );
        } else {
          let _value =
            this.value == ""
              ? [value]
              : this.value?.includes(value)
              ? this.value.filter((item) => item !== value)
              : this.value.concat(value);
          if (this.isDetailWalletLayout) {
            this.checkOptionAllTag = !_value.length;
          }
          if (_value.length !== 1) {
            if (
              !_value.includes("all") &&
              _value.length ===
                this.options.filter((option) => option.key !== "all").length
            ) {
              _value = _value.concat("all");
            } else {
              _value = _value.filter((item) => item !== "all");
            }
          }

          if (!_value.length) _value = ["all"];
          this.onChange(_value);
        }
      }
    },
    getTotalWidth() {
      let _width = 0;

      for (let index = 0; index < this.listItems.length; index++) {
        _width += this.listItems[index]?.clientWidth;
        if (index !== this.listItems.length - 1) {
          _width += 8;
        }
      }

      this.totalWidth = _width;
    },
    nextIndex() {
      if (this.isDisabledForNext) return;

      let _offset = 0;

      let _index = this.index + 1;

      for (let index = 0; index < _index; index++) {
        _offset += this.listItems[index]?.clientWidth + 8;
      }

      this.offset = _offset;
      this.index = _index;
    },
    prevIndex() {
      let _offset = 0;

      let _index = this.index - 1;

      for (let index = 0; index < _index; index++) {
        _offset += this.listItems[index]?.clientWidth + 8;
      }

      this.offset = _offset;
      this.index = _index;
    },
    onClassChange() {
      setTimeout(() => {
        this.updateOffset();
      }, 100);
    },
    updateOffset() {
      this.getTotalWidth();
      const el = document.querySelector(`.${this.customClass} .inner`);

      if (el) {
        const outerWidth = el.clientWidth;
        this.isShowNavigate = outerWidth < this.totalWidth;
        this.offsetValue = this.totalWidth - outerWidth;
        if (this.offsetValue < 0) {
          this.offset = 0;
        }
      }
    },
  },
  unmounted() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener("resize", this.updateOffset);
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  .inner {
    overflow: hidden;
    .inner-content {
      white-space: nowrap;
      transition: transform 0.15s linear;
    }
  }
  .option-item {
    flex: 1;
    height: 32px;
    line-height: 32px;
    background-color: #f2f2f2;
    border-radius: 30px;
    padding: 0 10px;
    border: 1px solid #dadada;
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
    &.is-active {
      background-color: #069255;
      border-color: #219653;
      color: #fff;
      font-weight: 400;
    }
    &.is-all {
      background-color: #fff;
      border-color: #dadada;
      color: #000;
    }
    &.font-medium {
      font-weight: 500 !important;
    }
  }
  .wrapper .inner .toggle-option-all {
    background: #f2f2f2;
    font-weight: 400 !important;
    span {
      display: none;
    }
  }
  .arrow-icon {
    display: flex;
    margin-left: 8px;
    height: 10px;
    img {
      &.is-disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    }
    .prev-icon {
      transform: rotate(180deg);
      margin-right: 0.5rem;
    }
  }
}
</style>
