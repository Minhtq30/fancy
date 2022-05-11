<template>
  <div class="pay-money" v-if="hasPayMoney">
    <span>{{ payMoney }}</span>
  </div>
  <div>
    <g-multiselect
      :width="300"
      class="filter-select-wrapper"
      :showApplyToAllChecked="true"
      :is-apply-to-all-checked="isApplyAllFreeShip"
      @applyToAll="handleApplyAllByField('isApplyAllFreeShip', $event)"
    >
      <template #contentDropdown>
        <g-select
          class="filter-select"
          placeholder="Phí ship"
          :style="{ width: '100%' }"
          :open="false"
          :options="whoPays"
          :value="shipPay"
        ></g-select>
      </template>
      <template #contentOption>
        <list-options
          :showAll="false"
          modeOption="simple"
          :options="whoPays"
          @onChange="handleUpdateOrderShipCusPay"
          :checked-list-default="[shipPay]"
        >
          <template #label="{ option }">
            {{ option.text }}
          </template>
        </list-options>
      </template>
    </g-multiselect>
    <error-message-in-table :showMessage="validShip" message="Thiếu" />
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

export default defineComponent({
  name: "order-excel-col-pay",
  props: {
    dataSource: {
      type: Object,
    },
    payMoney: {
      type: String,
      default: "0 đ",
    },
    whoPays: {
      type: Array,
      default() {
        return [];
      },
    },
    isApplyAllFreeShip: {
      type: Boolean,
      default: false,
    },
    hasPayMoney: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    shipPay() {
      return this.dataSource;
    },
    validShip() {
      return this.v$.shipPay.$invalid;
    },
  },
  validations: {
    shipPay: {
      required,
    },
  },
  setup() {
    const v$ = useVuelidate();
    return {
      v$,
    };
  },
  components: {
    GSelect,
    GMultiselect,
    ListOptions,
    ErrorMessageInTable,
  },
  methods: {
    handleUpdateOrderShipCusPay(shipObj) {
      this.$emit("onUpdateItemByFieldName", {
        name: "shipPay",
        value: shipObj.value,
      });
      this.$emit("onUpdateOrderShipCusPay", shipObj);
    },
    handleApplyAllByField(name, checked) {
      this.$emit("onApplyAllByField", name, checked);
    },
  },
});
</script>

<style scoped>
.pay-money {
  font-weight: 500;
}
</style>
