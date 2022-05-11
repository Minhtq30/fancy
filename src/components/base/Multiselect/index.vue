<template>
  <g-dropdown v-model:visible="visibleLocal" :trigger="['click']">
    <slot name="contentDropdown" />
    <template v-if="!forceHide" #GOverlay>
      <div class="dropdown-content">
        <div v-if="showSearch" class="dropdown-content-input-search">
          <a-input
            class="muitil-select-text-search"
            placeholder="Tìm kiếm"
            @change="onSearch"
            v-model:value="textInput"
          >
            <template #prefix>
              <search-active-icon />
            </template>
          </a-input>
        </div>
        <div v-if="showApplyToAllChecked" class="dropdown-content-input-all">
          <g-checkbox :checked="isApplyToAllChecked" @change="onApplyToAll">
            <div :style="{ display: 'inline-block', fontSize: '0.875rem' }">
              {{ textApplyToAllChecked }}
            </div>
          </g-checkbox>
        </div>
        <div
          @scroll="handleScroll"
          :style="{
            overflow: 'auto',
            maxHeight: `${maxHeight}px`,
            height: height > 0 ? `${height}px` : 'unset',
            width: !width ? '100%' : `${width}px`,
          }"
        >
          <slot name="contentOption" />
        </div>
        <div v-if="showMore" class="dropdown-more">Xem thêm</div>
      </div>
    </template>
  </g-dropdown>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import SearchActiveIcon from "@/components/icons/SearchActiveIcon.vue";
import GDropdown from "@/components/elements/dropdown.vue";
import GCheckbox from "@/components/elements/checkbox.vue";

export default defineComponent({
  name: "Multiselect",
  components: {
    SearchActiveIcon,
    GDropdown,
    GCheckbox,
  },
  props: {
    forceHide: {
      type: Boolean,
      default: false,
    },
    showApplyToAllChecked: {
      type: Boolean,
      default: false,
    },
    isApplyToAllChecked: {
      type: Boolean,
      default: false,
    },
    textApplyToAllChecked: {
      type: String,
      default: "Áp dụng cho tất cả",
    },
    applyToAllChecked: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "multiple",
    },
    showMore: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 0,
    },
    maxHeight: {
      type: Number,
      default: 240,
    },
    height: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const textInput = ref("");
    const visibleLocal = ref(props.visible);
    const onSearch = () => {
      emit("onSearch", textInput.value);
    };

    const onApplyToAll = (event) => {
      emit("applyToAll", event.target.checked);
    };

    const showModal = () => {
      visibleLocal.value = true;
    };

    const closeModal = () => {
      visibleLocal.value = false;
    };

    watch(visibleLocal, (newValue) => {
      if (!newValue) {
        emit("on-close-visible", newValue);
      }
    });

    watch(
      () => props.visible,
      (newValue) => {
        visibleLocal.value = newValue;
      }
    );

    return {
      onApplyToAll,
      textInput,
      onSearch,
      visibleLocal,
      closeModal,
      showModal,
    };
  },
  methods: {
    handleScroll(el) {
      const percentageScrolled =
        (el.srcElement.offsetHeight + el.srcElement.scrollTop) /
        el.srcElement.scrollHeight;

      if (percentageScrolled >= 1) {
        // Do something.
        this.$emit("onScrollEnd");
      }
    },
  },
});
</script>

<style lang="scss">
.dropdown-content-input-all {
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
}
.muitil-select-text-search {
  svg {
    width: 15px;
    height: 15px;
  }
  input {
    font-size: 0.875rem !important;
  }
}
</style>

<style scoped>
.dropdown-content-input-all {
  padding: 0 10px;
}
.dropdown-content-input-search {
  padding: 10px;
}
.dropdown-content {
  background: #fff;
  border-radius: 2px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
.dropdown-more {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #069255;
  cursor: pointer;
  border-top: 1px solid #dbdbdb;
}
.dropdown-more:hover {
  background: #069255;
  color: #fff;
  transition: background-color 150ms linear;
}
.g-checkbox {
  width: 100%;
  height: 40px;
  line-height: 40px;
}
</style>
