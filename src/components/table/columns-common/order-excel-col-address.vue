<template>
  <div
    class="channel__item-col channel__item-customer-address"
    @paste.prevent="handlePasteFromExcel($event)"
  >
    <g-multiselect ref="popupAddressRef" :width="500">
      <template #contentDropdown>
        <div class="address-text-wrap">
          <input-in-table
            ref="address"
            v-model:value="address"
            placeholder="Nhập địa chỉ"
            :debounce="debounceConfig"
            @focus="handleFocusInputAddress"
            @blur="debouncedHanldeParseAddress"
          />
          <a-spin
            class="spin-address"
            :spinning="fetchingParseAllAddress || loadingLocal"
            :indicator="indicator"
          />
        </div>
      </template>
      <template #contentOption>
        <a-spin class="g-spin-address" :spinning="loading">
          <list-address
            @on-selected="handleSelectAddress"
            :list="listAddress"
          />
        </a-spin>
      </template>
    </g-multiselect>
    <error-message-in-table
      :showMessage="validState"
      message="Thiếu địa chỉ khách hàng"
    />
    <div class="col-address-select">
      <select-hamlet
        :id-selected="
          addressObj.customer_hamlet_id ||
          addressObj.customer_corner_id ||
          addressObj.customer_specific_id
        "
        :addressObj="addressObj"
        :ward-id="addressObj.customer_ward_id || addressObj.customer_street_id"
        :province-id="addressObj.customer_province_id || ''"
        :district-id="addressObj.customer_district_id || ''"
        @on-change="
          handleAddressChange(
            'customer_hamlet_id',
            'customer_hamlet',
            [],
            $event
          )
        "
        @on-change-detail="handleUpdateAddressObj"
        :showWarning="
          !(
            addressObj.customer_hamlet_id ||
            addressObj.customer_corner_id ||
            addressObj.customer_specific_id
          )
        "
      />
      &nbsp;
      <select-ward
        :id-selected="
          addressObj.customer_ward_id || addressObj.customer_street_id
        "
        :district-id="addressObj.customer_district_id"
        @on-change="
          handleAddressChange(
            'customer_ward_id',
            'customer_ward',
            [
              'customer_hamlet_id',
              'customer_hamlet',
              'customer_corner_id',
              'customer_corner',
              'customer_specific_id',
              'customer_specific',
            ],
            $event
          )
        "
        @on-change-detail="handleUpdateAddressObj"
        :showWarning="
          !(addressObj.customer_ward_id || addressObj.customer_street_id)
        "
      />
    </div>
    <div class="col-address-select">
      <select-district
        :id-selected="addressObj.customer_district_id"
        :province-id="addressObj.customer_province_id"
        @on-change="
          handleAddressChange(
            'customer_district_id',
            'customer_district',
            [
              'customer_ward_id',
              'customer_ward',
              'customer_hamlet_id',
              'customer_hamlet',
              'customer_corner_id',
              'customer_corner',
              'customer_specific_id',
              'customer_specific',
              'customer_street_id',
              'customer_street',
            ],
            $event
          )
        "
        @on-change-detail="handleUpdateAddressObj"
        :showWarning="!addressObj.customer_district_id"
      />
      &nbsp;
      <select-province
        :id-selected="addressObj.customer_province_id"
        @on-change="
          handleAddressChange(
            'customer_province_id',
            'customer_province',
            [
              'customer_district_id',
              'customer_district',
              'customer_ward_id',
              'customer_ward',
              'customer_hamlet_id',
              'customer_hamlet',
              'customer_corner_id',
              'customer_corner',
              'customer_specific_id',
              'customer_specific',
              'customer_street_id',
              'customer_street',
            ],
            $event
          )
        "
        @on-change-detail="handleUpdateAddressObj"
        :showWarning="!addressObj.customer_province_id"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, h } from "vue";
import { debounce, get } from "lodash";

// Components
import { LoadingOutlined } from "@ant-design/icons-vue";
import SelectProvince from "@/components/base/SelectProvince";
import SelectDistrict from "@/components/base/SelectDistrict";
import SelectHamlet from "@/components/base/SelectHamlet";
import SelectWard from "@/components/base/SelectWard";
import InputInTable from "@/components/base/InputInTable";
import ErrorMessageInTable from "@/components/base/ErrorMessageInTable";
import ListAddress from "@/components/base/ListAddress/ListAddress";
import GMultiselect from "@/components/base/Multiselect";

// Validate
import { required, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

// Mixins
import commonMixin from "@/plugins/mixins/common";
import addressMixin from "@/plugins/mixins/searchAddress";

export default defineComponent({
  name: "order-excel-col-address",
  components: {
    GMultiselect,
    ListAddress,
    SelectProvince,
    SelectDistrict,
    SelectHamlet,
    SelectWard,
    InputInTable,
    ErrorMessageInTable,
  },
  validations: {
    address: {
      required,
      minLength: minLength(2),
    },
  },
  computed: {
    validState() {
      return this.v$.address.$invalid;
    },
    address: {
      get() {
        return this.dataSource;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "address",
          value: nextValue,
        });

        if (nextValue) {
          this.showMore = true;
        } else {
          this.showMore = false;
        }

        this.debouncedHanldeBrowseListAddress(nextValue);
      },
    },
  },
  props: {
    typeView: {
      type: String,
      default: "view",
    },
    addressObj: {
      type: Object,
      default() {
        return {
          customer_province_id: undefined,
          customer_province: "",
          customer_district_id: undefined,
          customer_ward_id: undefined,
          customer_ward: "",
          customer_hamlet_id: undefined,
          customer_street_id: undefined,
          customer_street: "",
          customer_specific_id: undefined,
        };
      },
    },
    dataSource: {
      type: String,
      default: "",
    },
    debounceConfig: {
      type: Number,
      default: 1,
    },
    fetchingParseAllAddress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSelected: false,
      loading: false,
      loadingLocal: false,
      listAddress: [],
    };
  },
  async beforeMount() {
    this.debouncedHanldeBrowseListAddress = debounce(
      this.handleBrowseListAddress,
      150
    );
    this.debouncedHanldeParseAddress = debounce(
      this.handlePreParseAddress,
      200
    );
  },
  setup() {
    const v$ = useVuelidate();
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "20px",
      },
      spin: true,
    });

    return {
      v$,
      indicator,
    };
  },
  mixins: [commonMixin, addressMixin],
  methods: {
    handleFocusInputAddress() {
      if (this.address) {
        this.debouncedHanldeBrowseListAddress(this.address);
      }
    },
    handleSelectAddress(data) {
      this.isSelected = true;
      this.$emit("onUpdateItemByFieldName", {
        name: "address",
        value: data.FullName,
      });
      this.handleUpdateAddressObj(data);
      this.$refs.popupAddressRef.closeModal();
    },
    async handleBrowseListAddress(textSearch) {
      this.loading = true;
      this.listAddress = await this.getListAddressByName({
        search: textSearch,
        level: 4,
      });
      this.loading = false;
    },
    handleCheckIsFullAddress() {
      const addressObj = this.addressObj;
      return (
        get(addressObj, "customer_province_id") &&
        get(addressObj, "customer_province") &&
        get(addressObj, "customer_district_id") &&
        get(addressObj, "customer_district") &&
        ((get(addressObj, "customer_ward_id") &&
          get(addressObj, "customer_ward")) ||
          (get(addressObj, "customer_street_id") && addressObj,
          "customer_street")) &&
        get(addressObj, "customer_specific_id") &&
        get(addressObj, "customer_specific")
      );
    },
    async handlePreParseAddress() {
      if (!this.isSelected) {
        // const isFullAddress = this.handleCheckIsFullAddress();
        // !isFullAddress &&
        if (this.address) {
          const parseAddressParam = {
            address: this.address,
            tel: this.phone,
          };
          try {
            this.loadingLocal = true;
            const addressObj = await this.handleParseAddress(parseAddressParam);
            this.$emit("onUpdateAddressObj", addressObj);
            this.loadingLocal = false;
          } catch (e) {
            this.loadingLocal = false;
          } finally {
            this.loadingLocal = false;
          }
        }
      } else {
        this.isSelected = false;
      }
    },
    handleUpdateAddressObj(data) {
      this.$emit("onUpdateAddressObj", data);
    },
    handleAddressChange(key, keyObject, keysRemove = [], { value, option }) {
      const objRemoveKey = {};
      keysRemove.forEach((key) => {
        objRemoveKey[key] = undefined;
      });
      this.handleUpdateHardAddressObj({
        [key]: value,
        [keyObject]: option.label,
        ...objRemoveKey,
      });
    },
    handleUpdateHardAddressObj(data) {
      this.$emit("onHardUpdateAddressObj", {
        ...this.addressObj,
        ...data,
      });
    },
    handlePasteFromExcel(event) {
      const addressRef = this.$refs.address.getRefInput();
      this.$emit(
        "onPasteFromExcel",
        "address",
        event,
        null,
        addressRef.selectionStart,
        addressRef.selectionEnd
      );
    },
  },
});
</script>

<style scoped>
.channel__item-customer-address {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 3px;
}
.col-address-select {
  display: flex;
  margin-top: 5px;
  justify-content: space-between;
}
.address-text-wrap {
  position: relative;
}
.spin-address {
  position: absolute;
  bottom: 2px;
  right: 2px;
}
</style>
