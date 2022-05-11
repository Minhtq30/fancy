<template>
  <a-row class="form-item">
    <a-col :span="2">
      <div class="t-flex t-items-center t-h-full">
        <label
          for="customerPhone"
          class="t-flex t-justify-center t-items-center"
        >
          <phone-icon></phone-icon>
        </label>
      </div>
    </a-col>
    <a-col :span="22">
      <g-select
        v-model:selectedItem="selectedCustomer"
        :borderless="true"
        :required="true"
        :numberOnly="true"
        :innerErrorMessage="validate.customer_tel.innerError"
        :outerErrorMessage="validate.customer_tel.outerError"
        :data-source="listCustomerByPhoneDataSource"
        :loading="isFetchingCustomer"
        :has-suffix="true"
        inputId="customerPhone"
        placeholder="Nhập số điện thoại khách hàng"
        type="suggestion"
        @on-selection-change="(item) => onCustomerSelectionChange(item)"
        @on-input-blur="onCustomerInputBlur()"
        @on-input-change="(search) => onCustomerInputChange(search)"
        @keydown.space="(event) => event.preventDefault()"
      >
        <template v-slot:option="{ item }">
          <div class="t-flex t-flex-col">
            <b>
              {{ item.payload.name }} -
              {{ item.payload.tel }}
            </b>
            <small>{{ item.payload.add }}</small>
          </div>
        </template>

        <template v-slot:suffix>
          <div class="t-flex t-justify-end t-mt-2">
            <template
              v-for="(color, index) in customerDetail?.colors"
              :key="index"
            >
              <color-customer :report-type="color" />
            </template>
          </div>
        </template>
      </g-select>
    </a-col>
  </a-row>
  <a-row class="form-item">
    <a-col :span="2">
      <div class="t-flex t-items-center t-h-full">
        <label
          for="customerName"
          class="t-flex t-justify-center t-items-center"
        >
          <user-icon></user-icon>
        </label>
      </div>
    </a-col>
    <a-col :span="22">
      <g-input
        v-model="customer_fullname"
        inputId="customerName"
        placeholder="Tên khách hàng"
        :innerErrorMessage="validate.customer_fullname.innerError"
        @on-blur="onCustomerInputBlur"
        @input-change="updateCustomerInfo(false)"
      />
    </a-col>
  </a-row>
  <a-row class="form-item">
    <a-col :span="2">
      <div class="t-flex t-items-center t-h-full">
        <label
          for="customerAddress"
          class="t-flex t-justify-center t-items-center"
        >
          <home-icon></home-icon>
        </label>
      </div>
    </a-col>
    <a-col :span="22">
      <g-select
        v-model:selectedItem="selectedCustomerAddress"
        :borderless="true"
        ref="selectedCustomerAddress"
        :required="true"
        :innerErrorMessage="validate.customer_address.innerError"
        :outerErrorMessage="validate.customer_address.outerError"
        :data-source="listCustomerAddressDataSource"
        :loading="isFetchingCustomerAddress"
        inputId="customerAddress"
        placeholder="Địa chỉ chi tiết (Tòa nhà/Hẻm/Đường)"
        type="suggestion"
        @on-selection-change="(item) => onCustomerAddressSelectionChange(item)"
        @on-input-blur="onCustomerAddressInputBlur"
        @on-input-change="(search) => onCustomerAddressInputChange(search)"
      >
        <template v-slot:header>
          <b style="font-size: 16px; font-weight: 500; padding: 0.25em 0.5em">
            Chọn địa chỉ đặc biệt (Tòa nhà/Hẻm/Đường) để giao nhanh nhất
          </b>
        </template>
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
  <a-row class="form-item">
    <a-col :span="2">
      <div class="t-flex t-items-start t-h-full">
        <label
          for="customerAddress"
          class="t-flex t-justify-center t-items-center"
        >
          <marker-icon></marker-icon>
        </label>
      </div>
    </a-col>
    <a-col :span="22">
      <g-address-picker
        :ref="'addressPicker'"
        v-model:selected-item="selectedAddressPicker"
        :error="validate.selectedAddressPicker"
        @onChange="(value) => onAddressPickerChange(value)"
      ></g-address-picker>
    </a-col>
  </a-row>
  <span class="t-text-[#ff0000]">{{ blockedMessage }} </span>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState } from "vuex";

import PhoneIcon from "@/components/icons/PhoneIcon";
import GSelect from "@/components/common/GSelect";
import ColorCustomer from "@/components/ColorCustomer";
import UserIcon from "@/components/icons/UserIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import MarkerIcon from "@/components/icons/MarkerIcon";
import GAddressPicker from "@/components/common/GAddressPicker";
import GInput from "@/components/common/GInput";
import { debounce, find, get, isArray, map, size, trim } from "lodash";
import services from "@/services";
import { ADDRESS_TYPE } from "@/contants";
import { isValidPhone } from "@/utils";

export default {
  name: "CustomerInfo",
  components: {
    GAddressPicker,
    MarkerIcon,
    ArrowRightIcon,
    HomeIcon,
    UserIcon,
    ColorCustomer,
    GInput,
    GSelect,
    PhoneIcon,
  },

  props: {
    error: {
      type: Object,
      default: () => {},
    },
    test: {
      type: Boolean,
      default: false,
    },
    orderType: {
      type: String,
      default: "express",
    },
    orderId: {
      type: String,
      default: "",
    },
    dataTracking: {
      type: Object,
      default: () => {},
    },
    updateDataTracking: {
      type: Function,
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
      customer_fullname: "",
      customer_address: "",
      tel: "",
      selectedCustomerAddress: "",
      selectedAddressBlock: {
        address_ids: [],
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
        customer_address: {
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
      isChosen: false,
      blockedMessage: "",
    };
  },

  computed: {
    ...mapState({
      shopType: (state) => Number(state.shop?.Shop?.shop_type),
    }),
    staff() {
      return this.$store.state?.shop.ShopStaff || {};
    },
  },

  created() {
    this.debounceSearchCustomerByPhone = debounce(
      this.searchCustomerByPhone,
      300
    );
    this.debounceSearchCustomerAddress = debounce(this.searchAddress, 300);
    this.debounceUpdateCustomerInfo = debounce(this.updateCustomerInfo, 300);
  },

  methods: {
    async searchCustomerByPhone(term) {
      if (size(trim(term)) === 0) return;
      this.isFetchingCustomer = true;
      let result = await services.$customer.browseCustomerByPhone(term);
      let data = get(result, "data", []);
      if (!isArray(data)) {
        data = [];
      }
      this.listCustomerByPhoneDataSource = map(data, (x) => {
        return {
          label: x.tel,
          value: x.id,
          description: x.ad,
          payload: x,
        };
      });
      this.isFetchingCustomer = false;
    },
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

    onCustomerSelectionChange(item) {
      if (item && item.payload) {
        this.tel = item.payload.tel;
        this.customer_fullname = item.payload.name;
        this.customer_address = item.payload.add;
        this.listCustomerAddressDataparseparseSource = [];
        this.selectedCustomerAddress = { label: item.payload.add };
        this.parseAddress();
      }
    },

    onCustomerInputBlur() {
      this.validateCustomer();
      if (
        !this.validate.customer_tel.innerError &&
        !this.validate.customer_tel.outerError
      ) {
        this.handleGetCustomerInfoByPhone([this.tel]);
      }
    },

    // Customer

    onCustomerInputChange(search) {
      this.tel = search;
      this.selectedCustomer = { label: search, value: search };
      if (search) {
        this.debounceSearchCustomerByPhone(search);
        this.debounceUpdateCustomerInfo(false);
      }
    },

    onAddressPickerChange(value) {
      this.handleUpdateDataTracking(value);
      this.validateCustomer();
      this.updateCustomerInfo();
      this.getListAddressBlocked();
    },

    onCustomerAddressSelectionChange(item) {
      this.isChosen = true;
      if (item && item.payload) {
        const oldValue = this.dataTracking[this.orderId] || [];
        this.updateDataTracking({
          ...this.dataTracking,
          [this.orderId]: [
            ...oldValue,
            {
              created: new Date().getTime(),
              id: "fancy_create_order",
              user_id: this.staff.id || "",
              address: item.payload.FullName,
              level_4_id: item.payload.AddressId,
              level_5_id: item.payload.HamletNodeId || "",
              province_id: item.payload.ProvinceId || "",
              district_id: item.payload.DistrictId || "",
              ward_id: item.payload.WardId || "",
              street_id: item.payload.StreetId || "",
              status: 0,
              pkg_order: "",
            },
          ],
        });
        this.customer_address = item.payload.FullName;
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
          this.updateCustomerInfo();
        }
      }
      this.getListAddressBlocked();
    },

    async getListAddressBlocked() {
      let value = {
        selectedProvince: {
          ...this.selectedAddressPicker.selectedProvince,
        },
        selectedDistrict: {
          ...this.selectedAddressPicker.selectedDistrict,
        },
        selectedWard: { ...this.selectedAddressPicker.selectedWard },
        selectedHamlet: { ...this.selectedAddressPicker.selectedHamlet },
      };
      this.selectedAddressBlock.address_ids = [];
      this.selectedAddressBlock.address_ids.push(
        value.selectedProvince.value,
        value.selectedDistrict.value,
        value.selectedWard.value,
        value.selectedHamlet.value
      );
      if (this.selectedAddressBlock.address_ids.every((element) => !element))
        return;
      let listAddressBlocked = {};
      try {
        const result = await services.$address.getListAddressBlocked({
          address_ids: this.selectedAddressBlock.address_ids,
        });
        if (result.success) {
          listAddressBlocked = result.data.block_address;
          const is_bbs = this.orderType.toLowerCase() == "bbs";
          const blockedAddress = listAddressBlocked.find(
            (item) =>
              ["", -1, this.shopType].includes(item.shop_type) &&
              (is_bbs ? item.bigsize.is_block : item.is_block)
          );
          this.blockedMessage = blockedAddress
            ? (is_bbs && blockedAddress?.bigsize?.type != "pick") ||
              (!is_bbs && blockedAddress?.type != "pick")
              ? blockedAddress.deliver_message
              : ""
            : "";
          if (this.blockedMessage != "") {
            message.error(this.blockedMessage);
            // eslint-disable-next-line vue/no-mutating-props
          } else {
            // eslint-disable-next-line vue/no-mutating-props
          }
        } else {
          console.log("Có lỗi khi phân tích địa chỉ.");
        }
      } catch (error) {
        console.log(error);
      }
    },

    onCustomerAddressInputBlur() {
      if (
        this.$refs.selectedCustomerAddress &&
        this.$refs.selectedCustomerAddress.isOpen === false
      ) {
        this.parseAddress(true);
      }
    },

    onCustomerAddressInputChange(search) {
      this.isChosen = false;
      this.selectedCustomerAddress = { label: search };
      this.customer_address = search;
      if (size(trim(search)) === 0) return;
      this.debounceSearchCustomerAddress(search);
    },

    validateCustomer() {
      let isValid = true;
      // Validate customer_tel
      this.validate.customer_tel.innerError = "";
      this.validate.customer_tel.outerError = "";
      if (!this.tel) {
        this.validate.customer_tel.innerError = "Nhập số điện thoại khách hàng";
        isValid = false;
      } else {
        if (isValidPhone(this.tel)) {
          isValid = true;
        } else {
          this.validate.customer_tel.outerError = "SĐT sai";
          isValid = false;
        }
      }
      // Validate customer_fullname
      this.validate.customer_fullname.innerError = "";
      this.validate.customer_fullname.outerError = "";
      if (size(trim(this.customer_fullname)) === 0) {
        this.validate.customer_fullname.innerError = "Thiếu tên khách hàng";
        isValid = false;
      }
      this.validate.customer_address.innerError = "";
      if (size(trim(this.customer_address)) === 0) {
        this.validate.customer_address.innerError = "Nhập địa chỉ chi tiết";
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

    parseAddress(isAddTracking = false) {
      services.$address
        .browseParseAddress({
          address: this.customer_address,
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
                label: "",
                value: "",
              };
              if (
                (!payload.customer_street_id ||
                  payload.customer_street_id == -1) &&
                (!payload.customer_specific_id ||
                  payload.customer_specific_id == -1)
              ) {
                selectedHamlet.label = addressPicker.selectedHamlet.label;
                selectedHamlet.value = addressPicker.selectedHamlet.value;
              } else {
                selectedHamlet.label = payload.customer_street_id
                  ? payload.customer_street
                  : payload.customer_specific;
                selectedHamlet.value = payload.customer_street_id
                  ? payload.customer_street_id
                  : payload.customer_specific_id;
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
              this.updateCustomerInfo();
              if (isAddTracking && !this.isChosen) {
                this.addDataTracking();
              }
            }
          }
        });
    },

    // ------------------------------------- PHONE -----------------------------
    /**
     * Call API lấy thông tin của khách hàng, theo số điện thoại.
     */
    async handleGetCustomerInfoByPhone(tels) {
      if (size(tels) === 0) {
        return;
      }
      try {
        const requestParam = {
          customer_tels: tels,
        };
        const result = await services.$customer.getCustomerColorByPhone(
          requestParam
        );
        if (result.success) {
          const customerInfo = find(
            get(result, "data"),
            (item) => `${item.tel}` === `${this.customer_tels}`
          );

          if (customerInfo) {
            const customerDetail = {
              tel: customerInfo.tel,
              reports: customerInfo.shipper_reports,
              flags: customerInfo.report,
            };
            const colors = [];
            if (customerInfo.colors.isBadReport) {
              colors.push("badReport");
            }
            if (customerInfo.colors.isGoodReport) {
              colors.push("goodReport");
            }
            if (customerInfo.colors.isBlue) {
              colors.push("trusted");
            }
            if (customerInfo.colors.isPurple) {
              colors.push("purple");
            }
            if (customerInfo.colors.isRed) {
              colors.push("red");
            }
            if (customerInfo.colors.isSuperred) {
              colors.push("superRed");
            }
            if (customerInfo.colors.isYellow) {
              colors.push("yellow");
            }
            customerDetail.colors = colors;
            this.customerDetail = customerDetail;
          }
          return true;
        }
      } catch (error) {
        console.log(error);
        this.customerDetail = {};
      }
    },

    updateCustomerInfo(isAddressChanged = true) {
      let isCustomerValid = this.validateCustomer();
      let value = {
        selectedProvince: {
          ...this.selectedAddressPicker.selectedProvince,
        },
        selectedDistrict: {
          ...this.selectedAddressPicker.selectedDistrict,
        },
        selectedWard: { ...this.selectedAddressPicker.selectedWard },
        selectedHamlet: { ...this.selectedAddressPicker.selectedHamlet },
        customer_fullname: this.customer_fullname,
        customer_address: this.customer_address,
        selectedCustomerAddress: this.selectedCustomerAddress,
        selectedAddressPicker: this.selectedAddressPicker,
        tel: this.tel,
        isCustomerValid: isCustomerValid,
        isAddressChanged: isAddressChanged,
      };
      this.$emit("update:customerInfo", value);
      // this.validateCustomer();
    },
    handleUpdateDataTracking(value) {
      const oldValue = this.dataTracking[this.orderId] || [];
      let _dataTracking = [];

      for (let index = 0; index < oldValue.length; index++) {
        const currentValue = oldValue[index];
        if (index !== oldValue.length - 1) {
          _dataTracking.push(currentValue);
        } else {
          _dataTracking.push({
            ...currentValue,
            level_4_id: value.selectedHamlet?.value || "",
            level_5_id: "",
            province_id: value.selectedProvince?.value || "",
            district_id: value.selectedDistrict?.value || "",
            ward_id: value.selectedWard?.value || "",
          });
        }
      }
      this.updateDataTracking({
        ...this.dataTracking,
        [this.orderId]: _dataTracking,
      });
    },
    addDataTracking() {
      const oldValue = this.dataTracking[this.orderId] || [];

      this.updateDataTracking({
        ...this.dataTracking,
        [this.orderId]: [
          ...oldValue,
          {
            created: new Date().getTime(),
            id: "fancy_create_order",
            user_id: this.staff.id || "",
            address: this.customer_address,
            level_4_id: this.selectedAddressPicker.selectedHamlet?.value || "",
            level_5_id: "",
            province_id:
              this.selectedAddressPicker.selectedProvince?.value || "",
            district_id:
              this.selectedAddressPicker.selectedDistrict?.value || "",
            ward_id: this.selectedAddressPicker.selectedWard?.value || "",
            street_id: "",
            status: 0,
            pkg_order: "",
          },
        ],
      });
    },
  },
  watch: {
    orderType() {
      this.getListAddressBlocked();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/create_order.scss";
</style>
