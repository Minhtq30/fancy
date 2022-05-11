<template>
  <div :style="{ width: '100%' }">
    <div>
      <g-multiselect
        :width="300"
        class="filter-select-wrapper"
        :showApplyToAllChecked="false"
      >
        <template #contentDropdown>
          <g-select
            class="filter-select"
            placeholder="Dịch vụ"
            :style="{ width: '100%' }"
            :open="false"
            :options="serviceMethods"
            :value="serviceMethod"
          ></g-select>
        </template>
        <template #contentOption>
          <list-options
            :showAll="false"
            modeOption="simple"
            :options="serviceMethodsDisable"
            @onChange="handleUpdateOrderServiceMethod"
            :checked-list-default="[serviceMethod]"
          >
            <template #label="{ option }">
              {{ option.text }}
            </template>
          </list-options>
        </template>
      </g-multiselect>
      <error-message-in-table
        :showMessage="validServiceMethod"
        message="Thiếu"
      />
    </div>
    <div :style="{ marginTop: '5px' }">
      <g-multiselect
        :width="300"
        class="filter-select-wrapper"
        :showApplyToAllChecked="true"
        :forceHide="!showOption || serviceMethod === 'BBS'"
        :is-apply-to-all-checked="isApplyAllTransport"
        @applyToAll="handleApplyAllByField('isApplyAllTransport', $event)"
      >
        <template #contentDropdown>
          <g-select
            class="filter-select"
            placeholder="Hình thức"
            :style="{ width: '100%' }"
            :open="false"
            :options="shipMethods"
            :value="shipMethod"
          ></g-select>
        </template>
        <template #contentOption>
          <list-options
            :showAll="false"
            modeOption="simple"
            :options="shipMethods"
            @onChange="handleUpdateOrderShipMethod"
            :checked-list-default="[shipMethod]"
          />
        </template>
      </g-multiselect>
      <error-message-in-table
        :showMessage="validShipMethod"
        :message="validShipMethodText"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GSelect from "@/components/base/SelectBoxInTable";
import ErrorMessageInTable from "@/components/base/ErrorMessageInTable";

// Validate
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { isEmpty } from "lodash";

export default defineComponent({
  name: "order-excel-col-vc",
  components: {
    GMultiselect,
    ListOptions,
    GSelect,
    ErrorMessageInTable,
  },
  setup() {
    const v$ = useVuelidate();
    return {
      v$,
    };
  },
  props: {
    provincesCache: {
      type: Array,
    },
    warehouseData: {
      type: Array,
    },
    addressData: {
      type: Array,
    },
    serviceData: {
      type: Object,
    },
    shipData: {
      type: Object,
    },
    shipMethods: {
      type: Array,
      default() {
        return [];
      },
    },
    serviceMethods: {
      type: Array,
      default() {
        return [];
      },
    },
    isApplyAllTransport: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    serviceMethodsDisable() {
      return this.serviceMethods.map((item) => {
        item.disabled = true;
        return item;
      });
    },
    serviceMethod() {
      return this.serviceData;
    },
    shipMethod() {
      return this.shipData;
    },
    validServiceMethod() {
      return this.v$.serviceMethod.$invalid;
    },
    validShipMethod() {
      return (
        this.v$.shipMethod.$invalid ||
        (this.typeRegion === "noi_tinh" && this.shipMethod === "fly")
      );
    },
    validShipMethodText() {
      if (this.v$.shipMethod.$invalid) {
        return "Thiếu";
      } else {
        return "sai";
      }
    },
    typeRegion() {
      return this.checkRegion(this.warehouseData, this.addressData);
    },
    showOption() {
      if (this.typeRegion === "noi_tinh") {
        this.$emit("onUpdateItemByFieldName", {
          name: "transport",
          value: "road",
        });
      }
      return this.typeRegion !== "noi_tinh" || this.validShipMethod;
    },
  },
  validations: {
    serviceMethod: {
      required,
    },
    shipMethod: {
      required,
    },
  },
  watch: {
    serviceMethod(newValue) {
      if (newValue === "BBS") {
        // Nếu là đơn BBS tự động chuyển transport về "road".
        this.$emit("onUpdateItemByFieldName", {
          name: "transport",
          value: "road",
        });
      }
    },
  },
  methods: {
    /**
     * Check cùng khu vực hay không.
     */
    checkRegion(wareHouse = {}, address = {}) {
      if (isEmpty(wareHouse) || isEmpty(address)) return null;

      if (`${wareHouse.province_id}` === `${address.customer_province_id}`) {
        return "noi_tinh";
      }

      if (
        `${this.provincesCache[wareHouse.province_id]?.region}` ===
        `${this.provincesCache[address.customer_province_id]?.region}`
      ) {
        return "noi_mien";
      } else {
        return "lien_mien";
      }
    },
    handleUpdateOrderShipMethod(shipMethod) {
      this.$emit("onUpdateItemByFieldName", {
        name: "transport",
        value: shipMethod.value,
      });
      this.$emit("onUpdateOrderShipMethod", shipMethod);
    },
    handleUpdateOrderServiceMethod(serviceMethod) {
      this.$emit("onUpdateItemByFieldName", {
        name: "transport_service",
        value: serviceMethod.value,
      });
      this.$emit("onUpdateOrderServiceMethod", serviceMethod);
    },
    handleApplyAllByField(name, checked) {
      this.$emit("onApplyAllByField", name, checked);
    },
  },
});
</script>

<style scoped></style>
