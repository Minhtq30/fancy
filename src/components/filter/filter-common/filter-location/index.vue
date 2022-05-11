<template>
  <g-multiselect
    :show-search="true"
    class="filter-select-wrapper"
    :maxHeight="255"
    @onSearch="onSearch"
  >
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Tùy chọn"
        :style="{ width: '110px', textAlign: 'center' }"
        :open="false"
        :options="options"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <list-options
        :show-all="false"
        :options="optionFilter"
        @onChange="handleChange"
        :checkedListDefault="checkedList"
      >
        <template #label="{ option }">
          {{ option.title }}
        </template>
      </list-options>
    </template>
  </g-multiselect>
</template>

<script>
import { computed, defineComponent } from "vue";

// component.
import GSelect from "@/components/base/SelectBoxInTable";
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";

// util
import { converVietNamese } from "@/utils/convertVietNamese";
import { uniqBy } from "lodash";

export default defineComponent({
  name: "FilterLocation",
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
  watch: {
    options(newValue) {
      this.optionFilter = newValue;
    },
  },
  data() {
    return {
      optionFilter: [],
    };
  },
  mounted() {
    this.optionFilter = this.options;
  },
  methods: {
    onSearch(textInput) {
      const optionSelected = this.options.filter((item) => {
        return this.checkedList.includes(item.value);
      });

      const optionFilterNew = this.options.filter((item) => {
        const label = converVietNamese(item.label).toLowerCase();
        const text = converVietNamese(textInput).toLowerCase();
        return !label.indexOf(text);
      });

      this.optionFilter = uniqBy(
        [...optionSelected, ...optionFilterNew],
        "value"
      );
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
        return `${props.checkedList.length} khu vực`;
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
