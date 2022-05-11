<template>
  <g-select
    ref="select"
    :class="{ 'g-select-error': showWarning }"
    placeholder="Tỉnh/TP"
    :value="idSelected ? `${idSelected}` : null"
    :style="{
      width: widthSelect ? widthSelect + 'px' : '100%',
      minWidth: '100px',
      maxWidth: '500px',
    }"
    @change="handleChange"
    :options="provinces"
    :show-search="showSearch"
    :filter-option="filterOptionCustom"
  >
  </g-select>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";

// Components
import GSelect from "@/components/base/SelectBoxForAddress";

// Hook
import useProvince from "@/hook/useProvince";
import { converVietNamese } from "@/utils/convertVietNamese";

export default defineComponent({
  props: {
    type: String,
    idSelected: {
      type: String,
      default: undefined,
    },
    widthSelect: {
      type: Number,
    },
    onChange: {
      type: Function,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    filterOption: {
      type: Function,
      default: undefined,
    },
    showWarning: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    GSelect,
  },

  setup(props, { emit }) {
    const store = useStore();
    const { provinces } = useProvince(store.state.global?.provinces);

    const handleChange = (value, option) => {
      emit("on-change", { value, option });
    };

    const filterOptionCustom = (input, option) => {
      return (
        converVietNamese(option.label.trim().toLowerCase()).indexOf(
          converVietNamese(input.toLowerCase())
        ) >= 0
      );
    };

    return {
      provinces,
      filterOptionCustom:
        typeof props.filterOption === "function"
          ? props.filterOption
          : filterOptionCustom,
      handleChange,
    };
  },
});
</script>
