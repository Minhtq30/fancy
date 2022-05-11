<template>
  <g-multiselect class="filter-select-wrapper" :width="165" :maxHeight="200">
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Ca lấy"
        :style="{ width: '84px', textAlign: 'center' }"
        :open="false"
        :options="options"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <div class="filter-empty" v-show="options.length === 0">
        Danh sách trống
      </div>
      <div v-show="options.length !== 0">
        <list-options
          :options="options"
          @onChange="handleChange"
          :checkedListDefault="checkedList"
        />
      </div>
    </template>
  </g-multiselect>
</template>

<script>
import GSelect from "@/components/base/SelectBoxInTable";
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "FilterPickTime",
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
        return `${props.checkedList.length} ca lấy`;
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

<style scoped>
.filter-empty {
  padding: 10px 15px;
}
</style>
