<template>
  <div :style="{ width: '100%' }">
    <div>
      <g-multiselect
        :width="600"
        class="filter-select-wrapper"
        :showApplyToAllChecked="true"
        :isApplyToAllChecked="isApplyAllWarehouse"
        @applyToAll="handleApplyAllByField('isApplyAllWarehouse', $event)"
      >
        <template #contentDropdown>
          <g-select
            class="filter-select"
            placeholder="Kho lấy hàng"
            :style="{ width: '100%', textAlign: 'center' }"
            :open="false"
            :options="listWareHouse"
            :value="warehouse"
          ></g-select>
        </template>
        <template #contentOption>
          <list-options
            :showAll="false"
            modeOption="simple"
            :options="listWareHouse"
            :checked-list-default="[warehouse]"
            @onChange="handleUpdateOrderWarehouse"
          />
        </template>
      </g-multiselect>
      <error-message-in-table
        :showMessage="validWarehouseState"
        message="Kho lấy thiếu"
      />
    </div>

    <div :style="{ marginTop: '5px' }">
      <g-multiselect
        class="filter-select-wrapper"
        :showApplyToAllChecked="true"
        :isApplyToAllChecked="isApplyAllPickTime"
        @applyToAll="handleApplyAllByField('isApplyAllPickTime', $event)"
      >
        <template #contentDropdown>
          <g-select
            class="filter-select"
            placeholder="Ca lấy hàng"
            :style="{ width: '100%', textAlign: 'center' }"
            :open="false"
            :options="listPickTime"
            :value="pick_time"
          ></g-select>
        </template>
        <template #contentOption>
          <list-options
            :showAll="false"
            modeOption="simple"
            :options="listPickTime"
            :checked-list-default="[pick_time]"
            @onChange="handleUpdateOrderPickTime"
          />
        </template>
      </g-multiselect>
      <error-message-in-table
        :showMessage="validPickTimeState"
        message="Ca lấy thiếu"
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
import useVuelidate from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";

export default defineComponent({
  name: "order-excel-col-warehouse",
  props: {
    warehouseData: {
      type: Object,
    },
    deliver_option: {
      type: Object,
    },
    pickTimeData: {
      type: Object,
    },
    listWareHouse: {
      type: Array,
      default() {
        return [];
      },
    },
    listPickTime: {
      type: Array,
      default() {
        return [];
      },
    },
    isApplyAllWarehouse: {
      type: Boolean,
      default: false,
    },
    isApplyAllPickTime: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    warehouse: {
      required,
    },
    pick_time: {
      required: requiredIf(function () {
        return !this.deliver_option;
      }),
    },
  },
  setup() {
    const v$ = useVuelidate();
    return {
      v$,
    };
  },
  components: {
    ListOptions,
    GMultiselect,
    GSelect,
    ErrorMessageInTable,
  },
  methods: {
    handleUpdateOrderPickTime(pickTime) {
      this.$emit("onUpdateItemByFieldName", {
        name: "pick_time",
        value: pickTime.dataOptions,
      });
      this.$emit("onUpdateOrderPickTime", pickTime);
    },
    handleUpdateOrderWarehouse(warehouse) {
      this.$emit("onUpdateItemByFieldName", {
        name: "warehouse",
        value: warehouse.dataOptions,
      });
      this.$emit("onUpdateOrderWarehouse", warehouse);
    },
    handleApplyAllByField(name, checked) {
      this.$emit("onApplyAllByField", name, checked);
    },
    multiSelectWarehouseLabel({ addressDetail }) {
      return addressDetail;
    },
  },
  computed: {
    validWarehouseState() {
      return this.v$.warehouse.$invalid;
    },
    validPickTimeState() {
      return this.v$.pick_time.$invalid;
    },
    warehouse() {
      if (typeof this.warehouseData?.value === "string") {
        return Number(this.warehouseData?.value);
      }
      return this.warehouseData?.value;
    },
    pick_time() {
      if (typeof this.pickTimeData?.value === "string") {
        return Number(this.pickTimeData?.value);
      }
      return this.pickTimeData?.value;
    },
    // showPickTime() {
    //   return (
    //     !this.deliver_option ||
    //     this.isXfastLoading ||
    //     this.fetchingCheckAllXFast
    //   );
    // },
  },
});
</script>

<style scoped></style>
