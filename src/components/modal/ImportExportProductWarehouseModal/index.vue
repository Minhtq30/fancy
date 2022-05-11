<template>
  <g-modal
    :visible="isVisible"
    :footer="null"
    :centered="true"
    :width="561"
    :title="isImport ? 'Tạo phiếu nhập' : 'Tạo phiếu xuất'"
    class="no-padding"
    @cancel="handleClose"
  >
    <import-export-product
      :timestamp="timestamp"
      :visible="isVisible"
      :isImport="isImport"
      :selectedProducts="selectedProducts"
      :selectedWarehouses="selectedWarehouses"
      :stations="stations"
      :onSuccess="onSuccessCallback"
    />
  </g-modal>
</template>

<script>
import { GModal } from "@/components/elements";
import ImportExportProduct from "./ImportExportProduct";

export default {
  name: "ImportExportProductWarehouseModal",
  props: [
    "isVisible",
    "isImport",
    "setIsVisible",
    "selectedProducts",
    "selectedWarehouses",
    "onSuccess",
    "stations",
  ],
  components: {
    ImportExportProduct,
    GModal,
  },
  data() {
    return {
      timestamp: null,
    };
  },
  methods: {
    handleClose() {
      this.setIsVisible(false);
    },
    handleUpdateProduct() {
      this.handleClose();
    },
    onSuccessCallback(products) {
      this.setIsVisible(false);
      if (this.onSuccess) {
        this.onSuccess(products);
      }
    },
  },
  watch: {
    isVisible(_isVisible) {
      if (_isVisible) {
        this.timestamp = new Date().getTime();
      }
    },
  },
};
</script>
