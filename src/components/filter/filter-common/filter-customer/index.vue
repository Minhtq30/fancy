<template>
  <g-multiselect class="filter-select-wrapper" :width="270" :maxHeight="295">
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Loại khách hàng"
        :style="{ width: '160px', textAlign: 'center' }"
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
      >
        <template #label="{ option }">
          <div :style="{ marginBottom: '3px' }">
            <div :style="{ display: 'inline-block' }">
              <g-color-customer :report-type="option.key" />
            </div>
            &nbsp;
            {{ option.title }}
          </div>
        </template>
      </list-options>
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
  name: "FilterCustomer",
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
  },
  setup(props, { emit }) {
    const getText = computed(() => {
      if (props.checkedList.length === 1) {
        const option = props.options.find(
          (item) => item.key === props.checkedList[0]
        ) || { title: "" };
        return option.title;
      }
      if (
        props.checkedList.length === props.options.length &&
        props.options.length > 0
      ) {
        return "Tất cả";
      }
      if (props.checkedList.length > 0) {
        return `${props.checkedList.length} loại khách hàng`;
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
