<template>
  <div class="channel__item-col channel__item-customer-name">
    <div
      class="channel__item-customer-name__info"
      @paste.prevent="handlePasteFromExcel($event)"
    >
      <input-in-table
        v-model:value="name"
        placeholder="Tên khách hàng"
        :debounce="debounceConfig"
      />
      <error-message-in-table
        :showMessage="validState"
        message="Tên KH thiếu"
      />
      <div class="t-flex t-justify-end t-mt-2">
        <template v-for="(color, index) in customerDetail?.colors" :key="index">
          <div class="t-flex t-mr-1">
            <color-customer :report-type="color" />
          </div>
        </template>
      </div>
      <a-tooltip :title="blockedMessage"
        ><span
          v-if="blockedMessage && blockedMessage != ''"
          class="text-ellipsis"
          style="color: red !important"
        >
          {{ blockedMessage }}</span
        ></a-tooltip
      >
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import InputInTable from "@/components/base/InputInTable";
import ErrorMessageInTable from "@/components/base/ErrorMessageInTable";
import ColorCustomer from "@/components/ColorCustomer";

// Validate
import { required, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default defineComponent({
  name: "order-excel-col-code",
  components: {
    ColorCustomer,
    InputInTable,
    ErrorMessageInTable,
  },
  props: {
    dataSource: {
      type: String,
      default: "",
    },
    debounceConfig: {
      type: Number,
      default: 1,
    },
    customerDetail: {
      type: Object,
    },
    blockedMessage: {
      type: String,
    },
  },
  computed: {
    name: {
      get() {
        return this.dataSource;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "name",
          value: nextValue,
        });
      },
    },
    validState() {
      return this.v$.name.$invalid;
    },
  },
  validations: {
    name: {
      required,
      minLength: minLength(1),
    },
  },
  setup() {
    const v$ = useVuelidate();
    return {
      v$,
    };
  },
  methods: {
    handlePasteFromExcel(event) {
      this.$emit("onPasteFromExcel", "name", event);
    },
  },
});
</script>

<style scoped></style>
