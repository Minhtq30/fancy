<template>
  <div
    class="channel__item-col channel__item-code"
    @paste.prevent="handlePasteFromExcel($event)"
  >
    <input-in-table v-model:value="client_id" :debounce="debounceConfig" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import InputInTable from "@/components/base/InputInTable";

export default defineComponent({
  name: "order-excel-col-code",
  components: {
    InputInTable,
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
  },
  computed: {
    client_id: {
      get() {
        return this.dataSource;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "client_id",
          value: nextValue,
        });
      },
    },
  },
  methods: {
    handlePasteFromExcel(event) {
      this.$emit("onPasteFromExcel", "client_id", event);
    },
  },
});
</script>

<style scoped></style>
