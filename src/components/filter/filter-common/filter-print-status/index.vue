<template>
  <g-multiselect class="filter-select-wrapper" :width="250" :maxHeight="200">
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Trạng thái in"
        :style="{ width: '150px', textAlign: 'center' }"
        :open="false"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <list-options
        :showAll="false"
        modeOption="simple"
        :options="optionsOne"
        :checkedListDefault="checkedList"
        @onChange="handleChangeSimple"
      >
        <template #label="{ option }">
          <div :style="{ marginBottom: '3px' }">
            {{ option.title }}
          </div>
        </template>
      </list-options>
    </template>
  </g-multiselect>
</template>

<script>
import { defineComponent } from "vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GSelect from "@/components/base/SelectBoxInTable";

// Mixins
import commonMixin from "@/plugins/mixins/common";
import { isNull } from "lodash";

const OPTIONS_ONE = [
  {
    key: "true",
    title: "Đã in",
    value: true,
  },
  {
    key: "false",
    title: "Chưa in",
    value: false,
  },
];

export default defineComponent({
  name: "FilterPrintStatus",
  components: {
    GSelect,
    GMultiselect,
    ListOptions,
  },
  props: {
    checkedList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mixins: [commonMixin],
  data() {
    return {
      optionsOne: OPTIONS_ONE,
      isPrintedLabel: null,
    };
  },
  methods: {
    handleChangeSimple({ value }) {
      this.isPrintedLabel = value;
      this.$emit("onChange", {
        isPrintedLabel: this.isPrintedLabel,
      });
    },
  },
  computed: {
    getText() {
      if (isNull(this.isPrintedLabel) || this.isPrintedLabel === undefined) {
        return null;
      }
      return this.isPrintedLabel ? "Đã in" : "Chưa in";
    },
  },
});
</script>

<style lang="scss" scoped></style>
