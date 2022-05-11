<template>
  <g-multiselect
    :width="400"
    class="filter-select-wrapper"
    :show-search="true"
    :max-height="300"
    @onSearch="onSearch"
  >
    <template #contentDropdown>
      <g-select
        class="filter-select"
        placeholder="Sản phẩm"
        :style="{ width: '110px', textAlign: 'center' }"
        :open="false"
        :options="options"
        :value="getText"
      ></g-select>
    </template>
    <template #contentOption>
      <a-spin :spinning="loading">
        <div class="filter-empty" v-show="options.length === 0">
          Danh sách trống
        </div>
        <div v-show="options.length !== 0">
          <list-options
            :show-all="false"
            :options="options"
            @onChange="handleChange"
            :checkedListDefault="checkedList"
          >
            <template #label="{ option }">
              <div :style="{ marginBottom: '3px' }">
                {{ option.full_name }}
              </div>
            </template>
          </list-options>
        </div>
      </a-spin>
    </template>
  </g-multiselect>
</template>

<script>
import GSelect from "@/components/base/SelectBoxInTable";
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "FilterProduce",
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
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const getText = computed(() => {
      if (props.checkedList.length === 1) {
        const option = props.options.find(
          (item) => item.value === props.checkedList[0]
        ) || { full_name: "" };
        return option.full_name;
      }
      if (
        props.checkedList.length === props.options.length &&
        props.options.length > 0
      ) {
        return "Tất cả";
      }
      if (props.checkedList.length > 0) {
        return `${props.checkedList.length} sản phẩm`;
      }
      return null;
    });

    const handleChange = (value) => {
      emit("onChange", value);
    };

    const onSearch = (value) => {
      emit("onSearch", value);
    };

    return {
      getText,
      handleChange,
      onSearch,
    };
  },
});
</script>

<style scoped>
.filter-empty {
  padding: 10px 15px;
}
</style>
