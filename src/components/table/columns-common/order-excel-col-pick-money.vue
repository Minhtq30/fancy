<template>
  <div
    class="channel__item-col channel__item-code"
    @paste.prevent="handlePasteFromExcel($event)"
  >
    <input-in-table
      :formatter="currencyFormatter"
      v-model:value="pick_money"
      :debounce="debounceConfig"
    />
    <error-message-in-table :showMessage="validState" message="Quá phép" />
    <i v-if="validState" class="product-item-value-error">
      Vượt quá 20triệu VNĐ
    </i>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import InputInTable from "@/components/base/InputInTable";
import ErrorMessageInTable from "@/components/base/ErrorMessageInTable";

// Plugin
import commonMixin from "@/plugins/mixins/common";

export default defineComponent({
  name: "order-excel-col-pick-money",
  components: {
    InputInTable,
    ErrorMessageInTable,
  },
  mixins: [commonMixin],
  props: {
    dataSource: {
      type: Number,
      default: 0,
    },
    debounceConfig: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    pick_money: {
      get() {
        return this.dataSource;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "pick_money",
          value: nextValue,
        });
      },
    },
    validState() {
      const cash = this.vndToNumber(this.pick_money);
      return cash > 20000000;
    },
  },
  methods: {
    handlePasteFromExcel(event) {
      this.$emit("onPasteFromExcel", "pick_money", event);
    },
    /**
     * Convert text VND to Number.
     */
    vndToNumber(x) {
      if (!x) {
        return 0;
      }
      x = x.toString();
      x = x.replace(/\D/g, "");
      x = parseInt(x);
      return x;
    },
  },
});
</script>

<style lang="scss" scoped>
.channel__item-col {
  input {
    text-align: right;
    font-weight: bold;
  }
}
.product-item-value-error {
  color: var(--dangerColor);
  font-size: small;
}
</style>
