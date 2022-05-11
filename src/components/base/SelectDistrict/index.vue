<template>
  <g-multiselect :visible="this.showMore" :width="500">
    <template #contentDropdown>
      <g-select
        ref="select"
        :class="{ 'g-select-error': showWarning }"
        placeholder="Quận/Huyện"
        :value="idSelected"
        :style="{
          width: widthSelect ? widthSelect + 'px' : '100%',
          minWidth: '100px',
          maxWidth: '500px',
        }"
        @search="handleSearchAddress"
        :dropdownClassName="{
          'g-select-v2-dropdown': true,
          'show-list': !this.showList,
        }"
        @change="handleChange"
        :options="districts"
        :show-search="showSearch"
        :filter-option="filterOptionCustom"
        @dropdownVisibleChange="handleVisibleList"
      >
      </g-select>
    </template>
    <template #contentOption>
      <div v-show="showMore">
        <a-spin class="g-spin-address" :spinning="this.loading">
          <list-address
            @on-selected="handleSelectedAddressDetail"
            :list="listAddress"
          />
        </a-spin>
      </div>
    </template>
  </g-multiselect>
</template>

<script>
import { defineComponent, toRefs } from "vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import GSelect from "@/components/base/SelectBoxForAddress";
import ListAddress from "@/components/base/ListAddress/ListAddress";

// Hook
import useDistrict from "@/hook/useDistrict";
import { converVietNamese } from "@/utils/convertVietNamese";

// Mixins
import searchAddress from "@/plugins/mixins/searchAddress";

export default defineComponent({
  props: {
    type: String,
    idSelected: String,
    widthSelect: {
      type: Number,
    },
    provinceId: {
      type: String,
      default: "",
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
    ListAddress,
    GSelect,
    GMultiselect,
  },

  data() {
    return {
      listAddress: [],
      showMore: false,
      showList: false,
      timer: null,
      loading: false,
    };
  },

  mixins: [searchAddress],

  methods: {
    handleSelectedAddressDetail(data) {
      this.$emit("on-change-detail", data);
    },
    handleVisibleList(value) {
      this.showList = value;
    },
    handleSearchAddress(value) {
      if (value && this.districts.length === 0) {
        // Đang có dữ liệu
        this.showMore = true;
        this.showList = false;
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // Đang chưa có dữ liệu
          this.showMore = false;
          this.showList = true;
          this.listAddress = [];
        }, 200);
      }
    },
  },

  setup(props, { emit }) {
    const { provinceId } = toRefs(props);
    const { districts = [] } = useDistrict(provinceId);

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
      districts,
      filterOptionCustom:
        typeof props.filterOption === "function"
          ? props.filterOption
          : filterOptionCustom,
      handleChange,
    };
  },
});
</script>
