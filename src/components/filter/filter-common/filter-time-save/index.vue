<template>
  <g-multiselect
    @onScrollEnd="handleScrollEnd"
    class="filter-select-wrapper"
    :width="205"
    :maxHeight="295"
  >
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Thời gian lưu đơn"
        :style="{ width: '155px', textAlign: 'center' }"
        :open="false"
        :options="options"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <div>
        <list-options
          :options="options"
          modeOption="simple"
          @onChange="handleChange"
          :show-all="false"
          :checkedListDefault="checkedList"
        >
          <template #label="{ option }">
            <div :style="{ marginBottom: '3px' }">
              <g-color-customer :report-type="option.key" />&nbsp;
              {{ option.title }}
            </div>
          </template>
        </list-options>
        <a-spin :spinning="loading">
          <div />
        </a-spin>
      </div>
    </template>
  </g-multiselect>
</template>

<script>
import { computed, defineComponent } from "vue";

// Components
import GSelect from "@/components/base/SelectBoxInTable";
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GColorCustomer from "@/components/ColorCustomer";

export default defineComponent({
  name: "FilterTimeSave",
  components: {
    GSelect,
    GMultiselect,
    ListOptions,
    GColorCustomer,
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    checkedList: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const getText = computed(() => {
      if (props.checkedList.length === 1 && props.checkedList[0]) {
        const option = props.options.find(
          (item) => item.value === props.checkedList[0]
        ) || { label: "" };
        return option.label;
      }
      if (
        props.checkedList.length === props.options.length &&
        props.options.length > 0
      ) {
        return "Tất cả";
      }
      if (props.checkedList.length > 1) {
        return `${props.checkedList.length} Thời gian`;
      }
      return null;
    });

    const handleChange = (value) => {
      emit("onChange", value);
    };

    const handleScrollEnd = () => {
      emit("onScrollEnd");
    };

    return {
      getText,
      handleChange,
      handleScrollEnd,
    };
  },
});
</script>

<style scoped></style>
