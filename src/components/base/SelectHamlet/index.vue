<template>
  <g-multiselect :visible="this.showMore" :width="500">
    <template #contentDropdown>
      <g-select
        ref="select"
        :class="{ 'g-select-error': showWarning }"
        placeholder="Tòa nhà/Hẻm/Đường"
        :value="idSelected"
        :style="{
          width: widthSelect ? widthSelect + 'px' : '100%',
          minWidth: '100px',
          maxWidth: '500px',
        }"
        @search="handleSearchAddress"
        :dropdownClassName="{
          'g-select-v2-dropdown': true,
          'dropdown-hamlet': true,
          'show-list': !this.showList,
        }"
        @change="handleChange"
        :options="hamletOptions"
        :show-search="showSearch"
        :filter-option="filterOptionCustom"
        @dropdownVisibleChange="handleVisibleList"
      >
      </g-select>
    </template>
    <template #contentOption>
      <div v-show="this.showMore">
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
import { computed, defineComponent, ref, toRefs, watch } from "vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import GSelect from "@/components/base/SelectBoxForAddress";
import ListAddress from "@/components/base/ListAddress/ListAddress";
import services from "@/services";
// Hook
import useHamlet from "@/hook/useHamlet";
import { converVietNamese } from "@/utils/convertVietNamese";
import { debounce } from "lodash";

// Mixins
import searchAddress from "@/plugins/mixins/searchAddress";

export default defineComponent({
  props: {
    type: String,
    idSelected: String,
    widthSelect: {
      type: Number,
    },
    wardId: {
      type: String,
      default: "",
    },
    provinceId: {
      type: String,
      default: "",
    },
    districtId: {
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
    addressObj: {
      type: Object,
      default() {
        return {};
      },
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

  unmounted() {
    clearTimeout(this.timer);
  },

  async beforeMount() {
    this.debouncedHanldeBrowseListAddress = debounce(
      this.handleBrowseListAddress,
      500
    );
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
      if (
        value &&
        this.special_address.length === 0 &&
        this.hamlet_address.length === 0
      ) {
        // Đang có dữ liệu
        this.showMore = true;
        this.showList = false;
        this.debouncedHanldeBrowseListAddress(value);
      } else {
        // clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // Đang chưa có dữ liệu
          this.showMore = false;
          this.showList = true;
          this.listAddress = [];
        }, 200);
      }
    },
    async handleBrowseListAddress(textSearch) {
      this.loading = true;
      if (this.wardId == "" && this.provinceId != "") {
        try {
          const params = {
            search: textSearch,
            level: 5,
            provinceId: this.provinceId,
            districtId: this.districtId || null,
          };
          await services.$address.browseSuggestAddress(params).then((res) => {
            if (res.success) {
              this.listAddress = res.data;
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
      this.loading = false;
    },
  },

  setup(props, { emit }) {
    const { wardId } = toRefs(props);
    const { special_address = [], hamlet_address = [] } = useHamlet(wardId);
    const corner_address = ref([]);

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

    watch(
      () => props.addressObj,
      () => {
        if (props.addressObj.customer_corner_id) {
          // TH có địa chỉ cấp 5
          corner_address.value = [
            {
              value: props.addressObj.customer_corner_id,
              label: props.addressObj.customer_corner,
            },
          ];
        }
        if (
          props.addressObj.customer_ward_id &&
          props.addressObj.customer_ward &&
          props.addressObj.customer_specific_id &&
          !special_address.value.find(
            (item) => item.value === props.addressObj.customer_specific_id
          )
        ) {
          // TH có địa chỉ đặc biệt.
          special_address.value.push({
            value: props.addressObj.customer_specific_id,
            label: props.addressObj.customer_specific,
          });
        }
      }
    );

    if (corner_address.value.length === 0) {
      corner_address.value.push({
        value: -1,
        label: "khác",
      });
    }

    const hamletOptions = computed(() => {
      return [
        {
          label: "Địa chỉ tòa nhà, bệnh viện, trường học, KCN ...",
          options: special_address.value,
        },
        {
          label: "Địa chỉ Đường, thôn, tổ ấp, ...",
          options: hamlet_address.value,
        },
        {
          label: "Khác",
          options: corner_address.value,
        },
      ];
    });

    return {
      special_address,
      hamletOptions,
      hamlet_address,
      filterOptionCustom:
        typeof props.filterOption === "function"
          ? props.filterOption
          : filterOptionCustom,
      handleChange,
    };
  },
});
</script>

<style lang="scss">
.g-spin-address {
  .ant-spin-dot {
    top: 50px !important;
  }
}
.dropdown-hamlet {
  width: 300px !important;
}
.show-list {
  display: none;
}
</style>
