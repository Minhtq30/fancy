<template>
  <g-dropdown v-model:visible="visible" :trigger="['click']">
    <slot name="contentDropdown" />
    <template #GOverlay>
      <div class="dropdown-content">
        <div v-if="showSearch" class="dropdown-content-input-search">
          <g-input-search
            v-model:value="textInput"
            placeholder="Tìm kiếm"
            @search="onSearch"
          />
        </div>
        <div v-if="showApplyToAllChecked" class="dropdown-content-input-all">
          <g-checkbox>
            <div :style="{ display: 'inline-block' }">
              {{ textApplyToAllChecked }}
            </div>
          </g-checkbox>
        </div>
        <div
          :style="{
            overflow: 'auto',
            maxHeight: `${maxHeight}px`,
            width: `${width}px`,
          }"
        >
          <div v-for="option in options" :key="option.key">
            <slot
              name="contentOption"
              :isSelected="option.value === value"
              :dataOption="option"
              :selectedKey="value"
            />
          </div>
        </div>
        <div v-if="showMore" class="dropdown-more">Xem thêm</div>
      </div>
    </template>
  </g-dropdown>
</template>

<script>
import { defineComponent, ref } from "vue";
import GInputSearch from "@/components/elements/input-search.vue";
import GDropdown from "@/components/elements/dropdown.vue";
import GCheckbox from "@/components/elements/checkbox.vue";

export default defineComponent({
  name: "Multiselect",
  components: {
    GInputSearch,
    GDropdown,
    GCheckbox,
  },
  props: {
    showApplyToAllChecked: {
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
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: String,
    },
    width: {
      type: Number,
      default: 400,
    },
    maxHeight: {
      type: Number,
      default: 200,
    },
  },
  setup(props, { emit }) {
    const textInput = ref("");
    const visible = ref(false);
    const onSearch = () => {
      emit("onSearch", textInput.value);
    };

    return {
      textInput,
      onSearch,
      visible,
    };
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
