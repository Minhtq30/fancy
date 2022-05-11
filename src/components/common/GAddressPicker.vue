<template>
  <div class="address-picker__wrapper">
    <g-select
      v-model:selected-item="selectedHamlet"
      :noFilter="isSuggestion"
      :dataSource="isSuggestion ? listSuggestion || [] : listHamlet"
      :inputSize="50"
      inputJustify="center"
      searchInputPlaceholder="Nhập để tìm kiếm địa chỉ đặc biệt (Tòa nhà/Hẻm/Đường)"
      placeholder="Tòa nhà/Hẻm/Đường"
      :error-message="error.selectedHamletError"
      @clear-search="clearSearch"
      @on-selection-change="onHamletSelectionChange"
      @on-input-change="(search) => onHamletSearchChange(search)"
    ></g-select>
    <g-select
      v-model:selected-item="selectedWard"
      placeholder="Phường/Xã"
      :dataSource="listWard"
      inputJustify="center"
      :error-message="error.selectedWardError"
      @on-selection-change="onWardSelectionChange"
    ></g-select>
    <g-select
      v-model:selected-item="selectedDistrict"
      placeholder="Quận/Huyện"
      :dataSource="listDistrict"
      inputJustify="center"
      :error-message="error.selectedDistrictError"
      @on-selection-change="onDistrictSelectionChange"
    ></g-select>
    <g-select
      v-model:selected-item="selectedProvince"
      placeholder="Tỉnh/TP"
      :dataSource="listProvince"
      inputJustify="center"
      :error-message="error.selectedProvinceError"
      @on-selection-change="onProvinceSelectionChange"
    ></g-select>
  </div>
</template>

<script>
import GSelect from "@/components/common/GSelect";
import services from "@/services";
import { get, size } from "lodash";
import common from "@/utils/common";
import { ADDRESS_TYPE } from "@/contants";
import { isEmptyObject } from "@/utils";

export default {
  props: {
    selectedItem: Object,
    error: Object,
    isPick: {
      type: Boolean,
      default: false,
    },
  },
  components: { GSelect },
  computed: {
    isSuggestion() {
      return !this.selectedWard.value && !isEmptyObject(this.selectedProvince);
    },
    listProvince() {
      return this.$store.getters["global/getProvinces"];
    },
  },
  mounted() {
    if (this.selectedItem) {
      this.selectedProvince = get(this.selectedItem, "selectedProvince", {});
      if (this.selectedProvince && this.selectedProvince.value) {
        this.onSearchAddress(
          this.selectedProvince.value,
          ADDRESS_TYPE.DISTRICT,
          "listDistrict"
        );
      }
      this.selectedDistrict = get(this.selectedItem, "selectedDistrict", {});
      if (this.selectedDistrict && this.selectedDistrict.value) {
        this.onSearchAddress(
          this.selectedDistrict.value,
          ADDRESS_TYPE.WARD,
          "listWard"
        );
      }
      this.selectedWard = get(this.selectedItem, "selectedWard", {});
      if (this.selectedWard && this.selectedWard.value) {
        this.onSearchAddress(
          this.selectedWard.value,
          ADDRESS_TYPE.STREET,
          "listHamlet"
        );
      }
      this.selectedHamlet = get(this.selectedItem, "selectedHamlet", {
        label: null,
        value: null,
      });
    }
  },
  data() {
    return {
      hamletSearch: "",
      listSuggestion: [],
      listDistrict: [],
      listHamlet: [{ label: "Khác", value: -1 }],
      listWard: [],
      selectedProvince: {},
      selectedDistrict: {},
      selectedWard: {},
      selectedHamlet: {},
    };
  },
  watch: {
    selectedItem() {
      this.isSuggestion && this.hamletSearch != ""
        ? this.getSuggestionList()
        : "";
    },
  },
  methods: {
    async clearSearch() {
      this.hamletSearch = "";
      this.listSuggestion = [];
    },
    onCustomerAddressSelectionChange(item) {
      this.selectedProvince = {
        label: item.payload.Province,
        value: item.payload.ProvinceId,
      };
      this.selectedDistrict = {
        label: item.payload.District,
        value: item.payload.DistrictId,
      };
      this.selectedWard = {
        label: item.payload.Ward,
        value: item.payload.WardId,
      };
      this.selectedHamlet = {
        label: item.payload.Name,
        value: item.payload.AddressId,
      };
    },
    getSuggestionList() {
      // call api suggest
      try {
        const params = {
          search: this.hamletSearch,
          level: 5,
          provinceId: this.selectedProvince?.value,
          districtId: this.selectedDistrict?.value || null,
        };
        services.$address.browseSuggestAddress(params).then((res) => {
          if (res.success) {
            this.listSuggestion = res.data.map((x) => ({
              label: x.FullName,
              value: x.FullName,
              payload: x,
            }));
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    onHamletSearchChange(val) {
      this.hamletSearch = val;
      if (this.isSuggestion) this.getSuggestionList();
    },
    async onHamletSelectionChange(item) {
      if (this.isSuggestion) {
        this.onCustomerAddressSelectionChange(item);
        this.updateSelectedItem();
        await this.onSearchAddress(
          this.selectedDistrict.value,
          ADDRESS_TYPE.WARD,
          "listWard"
        );
        await this.onSearchAddress(
          this.selectedWard.value,
          ADDRESS_TYPE.STREET,
          "listHamlet"
        );
      } else {
        this.updateSelectedItem();
      }
      this.listSuggestion = [];
    },
    onProvinceSelectionChange(item) {
      this.selectedDistrict = {};
      this.selectedWard = {};
      this.selectedHamlet = {};
      this.listWard = [];
      this.listHamlet = [{ label: "Khác", value: -1 }];
      this.updateSelectedItem();
      if (item && item.value) {
        this.onSearchAddress(item.value, ADDRESS_TYPE.DISTRICT, "listDistrict");
      }
    },
    onDistrictSelectionChange(item) {
      this.selectedWard = {};
      this.selectedHamlet = {};
      this.listHamlet = [];
      this.updateSelectedItem();
      if (item && item.value) {
        this.onSearchAddress(item.value, ADDRESS_TYPE.WARD, "listWard");
      }
    },
    onWardSelectionChange(item) {
      this.selectedHamlet = {};
      this.updateSelectedItem();
      if (item && item.value) {
        this.onSearchAddress(item.value, ADDRESS_TYPE.STREET, "listHamlet");
      }
    },
    async onSearchAddress(parentId, type, dataSource) {
      let result;
      let isHamlet = false;
      try {
        if (type === ADDRESS_TYPE.STREET) {
          isHamlet = true;
          result = await services.$address.browseHamletAddress(
            parentId,
            this.isPick
          );
        } else {
          result = await services.$address.browseAddressList(parentId, type);
        }
        if (result && result.success) {
          let data = common.convertLabelValueDataSource({
            dataSource: get(
              result,
              isHamlet ? ["data", "hamlet_address"] : "data",
              []
            ),
            labelName: "name",
            valueName: "id",
          });
          if (size(data) === 0) {
            data = [{ label: "Khác", value: -1 }];
          } else if (dataSource === "listHamlet") {
            data.push({ label: "Khác", value: -1 });
          }
          this[dataSource] = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    updateSelectedItem() {
      let value = {
        selectedProvince: this.selectedProvince,
        selectedDistrict: this.selectedDistrict,
        selectedWard: this.selectedWard,
        selectedHamlet: this.selectedHamlet,
      };
      this.$emit("update:selectedItem", value);
      this.$emit("onChange", value);
    },
  },
};
</script>
<style lang="scss" scoped>
.address-picker__wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.75em;
}
</style>
