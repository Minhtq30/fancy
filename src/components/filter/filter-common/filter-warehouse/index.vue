<template>
  <g-multiselect class="filter-select-wrapper" :width="550">
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Kho lấy hàng"
        :style="{ width: '120px', textAlign: 'center' }"
        :open="false"
        :options="options"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <list-options
        :options="options"
        @onChange="handleChange"
        :checkedListDefault="checkedList"
      />
    </template>
  </g-multiselect>
</template>

<script>
import GSelect from "@/components/base/SelectBoxInTable";
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "FilterWarehouse",
  components: {
    GSelect,
    GMultiselect,
    ListOptions,
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
  },
  setup(props, { emit }) {
    const getText = computed(() => {
      if (props.checkedList.length === 1) {
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
      if (props.checkedList.length > 0) {
        return `${props.checkedList.length} kho lấy hàng`;
      }
      return null;
    });

    const handleChange = (value) => {
      emit("onChange", value);
    };

    return {
      getText,
      handleChange,
    };
  },
});
</script>

<style scoped></style>
