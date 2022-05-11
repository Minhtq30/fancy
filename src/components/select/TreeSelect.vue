<template>
  <div class="g-dropdown-select" v-click-outside="handleClickOutside">
    <g-input
      :value="textDisplay"
      :placeholder="placeholder"
      :readonly="true"
      @focus="onFocusInput"
    />
    <div
      class="list-options-wrapper"
      :class="{ 'placement-right': placement === 'right' }"
      :style="{ width, minWidth }"
      v-if="openDropdown"
    >
      <div
        v-for="option in options"
        :key="option.key"
        class="option-items"
        :class="
          option.children && option.children?.length !== 0
            ? ''
            : 'border-bottom'
        "
      >
        <div class="option-item">
          <div
            class="t-flex t-flex-1"
            @click="
              option.children && option.children?.length !== 0
                ? handleToggleParent(option.key)
                : handleToggle(option.key)
            "
          >
            <template v-if="option.key === 'all'">
              <g-checkbox :checked="isAllSelected" />
            </template>
            <g-checkbox
              v-else
              :checked="
                option.children && option.children?.length !== 0
                  ? option.children.every((ai) => this.value.includes(ai.key))
                  : value.includes(option.key)
              "
            />
            <span class="option-items__title">
              {{ option.title }}
            </span>
          </div>
          <div
            class="t-w-[20px] t-flex t-items-center t-justify-end"
            @click="handleClickShowChild(option.key)"
          >
            <arrow-right-icon
              v-if="option.children && option.children?.length !== 0"
              :class="keyShowChild.includes(option.key) ? 'rotate-icon' : ''"
              class="arrow-icon"
              :width="10"
              :height="10"
            ></arrow-right-icon>
          </div>
        </div>
        <div
          class="option-item option-item-child"
          v-for="child in option.children"
          :key="child.key"
          v-show="keyShowChild.includes(option.key)"
          @click="handleToggle(child.key)"
        >
          <g-checkbox :checked="value.includes(child.key)" />
          <span class="option-items__title">
            {{ child.title }}
          </span>
        </div>
      </div>
      <div class="options-item" v-if="options.length === 0">
        <span class="option-items__title">Không có kết quả</span>
      </div>
    </div>
    <img
      class="down-icon"
      src="@/assets/icons/arrow_down_select.svg"
      width="12"
      height="12"
    />
  </div>
</template>

<script>
import GInput from "../elements/input.vue";
import GCheckbox from "../elements/checkbox.vue";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";

export default {
  name: "TreeSelect",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    onChange: {
      type: Function,
      default: () => {},
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "Chọn giá trị",
    },
    width: {
      type: String,
      default: "100%",
    },
    minWidth: {
      type: String,
      default: "unset",
    },
    placement: {
      type: String,
      default: "",
    },
    callBackAfterChange: {
      type: Function,
    },
    tooltipPlacement: {
      type: String,
      default: "left",
    },
    checkAll: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ArrowRightIcon,
    GInput,
    GCheckbox,
  },
  data() {
    return {
      openDropdown: false,
      keyShowChild: [],
    };
  },
  mounted() {
    if (this.checkAll) {
      this.onChange(this.listFullKey);
    }
  },
  methods: {
    onFocusInput() {
      this.openDropdown = true;
    },
    handleClickOutside() {
      this.openDropdown = false;
    },
    //click mũi tên để hiện các con của 1 option
    handleClickShowChild(key) {
      this.keyShowChild = this.keyShowChild.includes(key)
        ? this.keyShowChild.filter((list) => list !== key)
        : this.keyShowChild.concat(key);
    },
    //khi click các option có phần tử con
    handleToggleParent(_value) {
      const newArr = this.options.filter((opt) => opt.key === _value);
      const newArr2 = newArr[0]?.children.map((opt) => opt.key);
      //lọc các key con của option được chọn , nếu đã có thì xóa , chưa có thì thêm vào this.value
      if (!newArr2.every((ai) => this.value.includes(ai))) {
        this.onChange(
          this.value.concat(
            newArr[0]?.children
              .map((opt) => opt.key)
              .filter((key) => {
                return !this.value.includes(key);
              })
          )
        );
      } else {
        this.onChange(this.value.filter((v) => !newArr2.includes(v)));
      }
    },
    //khi click các option không có phần tử con
    handleToggle(_value) {
      if (_value === "all") {
        this.onChange(this.value.length !== 0 ? [] : this.listFullKey);
      } else {
        this.onChange(
          !this.value.includes(_value)
            ? this.value.concat(_value)
            : this.value.filter((v) => v !== _value)
        );
      }
    },
  },
  computed: {
    //list full các key của options được truyền vào
    listFullKey() {
      const arr = this.options.filter((v) => v.key !== "all");
      //lấy ra các option có phần tử con
      const arr2 = arr.filter((a) => a.children && a.children?.length !== 0);
      const arr3 = [];
      //lấy các key của phần tử con
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr2[i].children.length; j++) {
          arr3.push(arr2[i].children[j].key);
        }
      }
      return this.options
        .filter(
          (v) => v.key !== "all" && !v.key.includes(arr2.map((a) => a.key))
        )
        .map((v) => v.key)
        .concat(arr3);
    },
    //list các key:title
    optionTitleByKey() {
      let _optionTitleByKey = {};
      let _optionTitleByKeyChild = {};
      for (const option of this.options) {
        if (option.key !== "all") {
          _optionTitleByKey[option.key] = option.title;
          for (const opt of option.children || []) {
            _optionTitleByKeyChild[opt.key] = opt.title;
          }
        }
      }
      return { ..._optionTitleByKey, ..._optionTitleByKeyChild };
    },
    //title xuất hiện trong input khi chọn
    textDisplay() {
      if (!this.value.length) return "";
      if (this.isAllSelected) return "Tất cả";
      if (this.value?.length === 1 && this.value[0] === "all") {
        return "Tất cả";
      }
      if (this.value.length === 1) {
        return this.optionTitleByKey[this.value[0]];
      }
      return `Đã chọn ${this.value.length}`;
    },
    isAllSelected() {
      return (
        this.value.filter((v) => v.key !== "all").length ===
        this.listFullKey.length
      );
    },
  },
  watch: {
    openDropdown(_openDropdown) {
      if (!_openDropdown && this.callBackAfterChange) {
        this.callBackAfterChange(this.value);
      }
    },
  },
};
</script>

<style lang="scss">
.g-dropdown-select {
  position: relative;
  .border-bottom {
    border-bottom: 1px solid var(--grayColor);
  }
  .g-input {
    height: 32px;
    padding-right: 36px;
    box-shadow: none !important;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .list-options-wrapper {
    border-radius: 5px;
    z-index: 9999;
    position: absolute;
    bottom: -5px;
    transform: translateY(100%);
    width: 100%;
    background-color: #fff;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    overflow: hidden;
    max-height: 339px;
    overflow-y: auto;
    &.placement-right {
      right: 0;
    }
    .option-items {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: auto;
      overflow: hidden;
      &__title {
        margin-left: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .option-item {
        position: relative;
        .arrow-icon {
          transition: 0.3s;
        }
        .rotate-icon {
          transform: rotateZ(90deg);
        }
      }
    }
    .option-item-child {
      flex-direction: row;
      padding-left: 20px !important;
      padding-top: 5px !important;
    }
    .option-item-child:last-child {
      border-bottom: 1px solid var(--grayColor);
    }
  }
  .down-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(0, 0, 0, 0.25);
    svg {
      width: 12px !important;
      height: 12px !important;
    }
  }
}
</style>
