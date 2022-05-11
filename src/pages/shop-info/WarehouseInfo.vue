<template>
  <a-row class="form-item t-w-full">
    <a-col :span="24">
      <g-select
        v-model:selectedItem="selectedWarehouseAddress"
        :borderless="true"
        ref="selectedWarehouseAddress"
        :required="true"
        :innerErrorMessage="validate.warehouse_address.innerError"
        :outerErrorMessage="validate.warehouse_address.outerError"
        :data-source="listCustomerAddressDataSource"
        :loading="isFetchingCustomerAddress"
        inputId="customerAddress"
        placeholder="Địa chỉ chi tiết (Tòa nhà/Hẻm/Đường)"
        type="suggestion"
        @on-selection-change="(item) => onCustomerAddressSelectionChange(item)"
        @on-input-blur="onCustomerAddressInputBlur"
        @on-input-change="(search) => onCustomerAddressInputChange(search)"
      >
        <template v-slot:option="{ item }">
          <div class="t-flex t-flex-row t-justify-between t-w-full">
            <span>{{ item.label }}</span>
            <span>
              <arrow-right-icon :width="14" :height="14"> </arrow-right-icon>
            </span>
          </div>
        </template>
      </g-select>
    </a-col>
  </a-row>
  <a-row class="form-item t-w-full">
    <a-col :span="24">
      <g-address-picker
        :ref="'addressPicker'"
        v-model:selected-item="selectedAddressPicker"
        :error="validate.selectedAddressPicker"
        @onChange="(value) => onAddressPickerChange(value)"
        :is-pick="true"
      ></g-address-picker>
    </a-col>
  </a-row>
</template>

<script>
import GSelect from "@/components/common/GSelect";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import GAddressPicker from "@/components/common/GAddressPicker";
import { debounce, map, size, trim, get } from "lodash";
import services from "@/services";
import { ADDRESS_TYPE } from "@/contants";
export default {
  name: "WarehouseInfo",
  components: {
    GAddressPicker,
    ArrowRightIcon,
    GSelect,
  },

  props: {
    error: {
      type: Object,
      default: () => {},
    },
    wareHouseData: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      debounceSearchCustomerByPhone: null,
      debounceSearchCustomerAddress: null,
      debounceUpdateCustomerInfo: null,
      selectedCustomer: {},
      customerDetail: {},
      listCustomerByPhoneDataSource: [],
      listCustomerAddressDataSource: [],
      isFetchingCustomer: false,
      isFetchingCustomerAddress: false,
      selectedWarehouseAddress: {
        label: "",
      },
      selectedAddressPicker: {
        selectedProvince: {},
        selectedDistrict: {},
        selectedWard: {},
        selectedHamlet: {},
      },
      validate: {
        customer_tel: {
          innerError: "",
          outerError: "",
        },
        customer_fullname: {
          innerError: "",
          outerError: "",
        },
        warehouse_address: {
          innerError: "",
          outerError: "",
        },
        selectedAddressPicker: {
          selectedHamletError: "",
          selectedWardError: "",
          selectedDistrictError: "",
          selectedProvinceError: "",
        },
      },
    };
  },

  created() {
    this.selectedWarehouseAddress = this.wareHouseData;
    if (this.wareHouseData) {
      this.selectedWarehouseAddress.label =
        this.wareHouseData.payload.first_address;
    }
    this.selectedAddressPicker = get(this.wareHouseData, "selectedItem", {});
    this.debounceSearchCustomerAddress = debounce(this.searchAddress, 300);
    this.debounceUpdateCustomerInfo = debounce(this.updateWarehouseInfo, 300);
  },

  mounted() {
    // this.$refs.selectedWarehouseAddress.onInputClick();
    // this.selectedWarehouseAddress.label = this.selectedWarehouseAddress.labelEx;
  },

  methods: {
    async searchAddress(search) {
      this.isFetchingCustomerAddress = true;
      let result = await services.$address.browseSuggestAddress({
        search: search,
        level: 4,
      });
      this.isFetchingCustomerAddress = false;
      this.listCustomerAddressDataSource = map(result.data, (x) => {
        return {
          label: x.FullName,
          value: x.FullName,
          payload: x,
        };
      });
    },

    onAddressPickerChange() {
      this.validateCustomer();
      this.updateWarehouseInfo();
    },

    onCustomerAddressSelectionChange(item) {
      if (item && item.payload) {
        this.selectedWarehouseAddress.label = item.payload.FullName;
        const addressPicker = this.$refs["addressPicker"];
        if (addressPicker) {
          addressPicker.selectedProvince = {
            label: item.payload.Province,
            value: item.payload.ProvinceId,
          };
          addressPicker.selectedDistrict = {
            label: item.payload.District,
            value: item.payload.DistrictId,
          };
          addressPicker.selectedWard = {
            label: item.payload.Ward,
            value: item.payload.WardId,
          };
          addressPicker.selectedHamlet = {
            label: item.payload.Name,
            value: item.payload.AddressId,
          };
          this.selectedAddressPicker = {
            selectedProvince: { ...addressPicker.selectedProvince },
            selectedDistrict: { ...addressPicker.selectedDistrict },
            selectedWard: { ...addressPicker.selectedWard },
            selectedHamlet: { ...addressPicker.selectedHamlet },
          };
          this.validateCustomer();
          this.updateWarehouseInfo();
        }
      }
    },

    onCustomerAddressInputBlur() {
      if (
        this.$refs.selectedWarehouseAddress &&
        this.$refs.selectedWarehouseAddress.isOpen === false
      ) {
        this.parseAddress();
      }
    },

    onCustomerAddressInputChange(search) {
      this.selectedWarehouseAddress = { label: search };
      this.selectedWarehouseAddress.label = search;
      if (size(trim(search)) === 0) return;
      this.debounceSearchCustomerAddress(search);
    },

    validateCustomer() {
      let isValid = true;

      this.validate.warehouse_address.innerError = "";
      if (size(trim(get(this.selectedWarehouseAddress, "label", ""))) === 0) {
        this.validate.warehouse_address.innerError = "Nhập địa chỉ chi tiết";
        isValid = false;
      }

      if (!this.selectedAddressPicker.selectedProvince.value) {
        this.validate.selectedAddressPicker.selectedProvinceError = "Tỉnh/TP";
        isValid = false;
      } else {
        this.validate.selectedAddressPicker.selectedProvinceError = "";
      }
      if (!this.selectedAddressPicker.selectedDistrict.value) {
        this.validate.selectedAddressPicker.selectedDistrictError =
          "Quận/Huyện";
        isValid = false;
      } else {
        this.validate.selectedAddressPicker.selectedDistrictError = "";
      }
      if (!this.selectedAddressPicker.selectedWard.value) {
        this.validate.selectedAddressPicker.selectedWardError = "Phường/Xã";
        isValid = false;
      } else {
        this.validate.selectedAddressPicker.selectedWardError = "";
      }
      if (!this.selectedAddressPicker.selectedHamlet.value) {
        this.validate.selectedAddressPicker.selectedHamletError =
          "Tòa nhà/Hẻm/Đường";
        isValid = false;
      } else {
        this.validate.selectedAddressPicker.selectedHamletError = "";
      }
      return isValid;
    },

    parseAddress() {
      services.$address
        .browseParseAddress({
          address: this.selectedWarehouseAddress.label,
        })
        .then((result) => {
          if (result && result.data) {
            let payload = result.data;
            const addressPicker = this.$refs["addressPicker"];
            addressPicker.listDistrict = [];
            addressPicker.listProvince = [];
            addressPicker.listWard = [];
            addressPicker.listHamlet = [{ label: "Khác", value: -1 }];
            if (payload) {
              addressPicker.selectedProvince = {};
              addressPicker.selectedDistrict = {};
              addressPicker.selectedWard = {};
              addressPicker.selectedHamlet = {};
            }
            if (addressPicker && payload && size(payload) > 0) {
              let selectedProvince = {
                label: payload.customer_province
                  ? payload.customer_province
                  : addressPicker.selectedProvince.label,
                value: payload.customer_province_id
                  ? payload.customer_province_id
                  : addressPicker.selectedProvince.value,
              };
              let selectedDistrict = {
                label: payload.customer_district
                  ? payload.customer_district
                  : addressPicker.selectedDistrict.label,
                value: payload.customer_district_id
                  ? payload.customer_district_id
                  : addressPicker.selectedDistrict.value,
              };
              let selectedWard = {};
              if (payload.customer_street_id && payload.customer_street) {
                selectedWard = {
                  label: payload.customer_street
                    ? payload.customer_street
                    : addressPicker.selectedWard.label,
                  value: payload.customer_street_id
                    ? payload.customer_street_id
                    : addressPicker.selectedWard.value,
                };
              } else {
                selectedWard = {
                  label: payload.customer_ward
                    ? payload.customer_ward
                    : addressPicker.selectedWard.label,
                  value: payload.customer_ward_id
                    ? payload.customer_ward_id
                    : addressPicker.selectedWard.value,
                };
              }
              let selectedHamlet = {
                label: "Khác",
                value: "-1",
              };
              if (
                (!payload.customer_street_id ||
                  payload.customer_street_id == -1) &&
                (!payload.customer_specific_id ||
                  payload.customer_specific_id == -1)
              ) {
                selectedHamlet.label = addressPicker.selectedHamlet.label;
                selectedHamlet.value = addressPicker.selectedHamlet.value;
              }
              if (
                payload.customer_corner_id > -1 &&
                (!payload.customer_street_id ||
                  payload.customer_street_id == -1) &&
                (!payload.customer_specific_id ||
                  payload.customer_specific_id == -1)
              ) {
                selectedHamlet.value = payload.customer_corner_id;
                selectedHamlet.label = payload.customer_corner;
              }

              if (
                payload.customer_specific_id > -1 &&
                payload.customer_specific
              ) {
                selectedHamlet.value = payload.customer_specific_id;
                selectedHamlet.label = payload.customer_specific;
              }
              addressPicker.selectedProvince = selectedProvince;
              if (selectedProvince.value) {
                addressPicker.onSearchAddress(
                  selectedProvince.value,
                  ADDRESS_TYPE.DISTRICT,
                  "listDistrict"
                );
              }
              addressPicker.selectedDistrict = selectedDistrict;
              if (selectedDistrict.value) {
                addressPicker.onSearchAddress(
                  selectedDistrict.value,
                  ADDRESS_TYPE.WARD,
                  "listWard"
                );
              }
              addressPicker.selectedWard = selectedWard;
              if (selectedWard.value) {
                addressPicker.onSearchAddress(
                  selectedWard.value,
                  ADDRESS_TYPE.STREET,
                  "listHamlet"
                );
              }
              addressPicker.selectedHamlet = selectedHamlet;
              this.selectedAddressPicker = {
                selectedProvince: { ...selectedProvince },
                selectedDistrict: { ...selectedDistrict },
                selectedWard: { ...selectedWard },
                selectedHamlet: { ...selectedHamlet },
              };
              this.validateCustomer();
              this.updateWarehouseInfo();
            }
          }
        });
    },

    updateWarehouseInfo() {
      let value = {
        selectedProvince: {
          ...this.selectedAddressPicker.selectedProvince,
        },
        selectedDistrict: {
          ...this.selectedAddressPicker.selectedDistrict,
        },
        selectedWard: { ...this.selectedAddressPicker.selectedWard },
        selectedHamlet: { ...this.selectedAddressPicker.selectedHamlet },
        warehouse_address: get(this.selectedWarehouseAddress, "label", ""),
        selectedWarehouseAddress: this.selectedWarehouseAddress,
        selectedAddressPicker: this.selectedAddressPicker,
      };
      this.$emit("update:address", value);
      // this.validateCustomer();
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item {
  margin-bottom: 1.25em;

  .product__label {
    max-width: 165px;
    min-width: 165px;
    margin-right: 15px;
  }

  .product__control {
    flex: 1;
    width: -webkit-fill-available;
  }
}
</style>
