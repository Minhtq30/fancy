<template>
  <div class="header-right-detail-modal t-text-black">
    <g-multiselect placement="bottomRight" :maxHeight="325">
      <template #contentDropdown>
        <div
          class="header-right-detail-modal__title medium-text pointer"
          id="btn-detail-product-action"
        >
          Thao tác
        </div>
      </template>
      <template #contentOption>
        <div class="header-right-detail-modal__overlay">
          <div
            class="overlay-item flex pointer"
            @click="openEditModal"
            :class="{ 't-opacity-60': loadingGetDetail }"
          >
            <img src="@/assets/icons/edit_icon.svg" />
            <div class="ml">
              <span class="medium-text overlay-item__title">Sửa</span><br />
              <span class="overlay-item__description t-text-sm">
                Chỉnh sửa thông tin sản phẩm
              </span>
            </div>
          </div>
          <div
            class="overlay-item flex pointer"
            @click="openImportExportModal(false)"
          >
            <img src="@/assets/icons/export_icon.svg" />
            <div class="ml">
              <span class="medium-text overlay-item__title">Xuất</span><br />
              <span class="overlay-item__description t-text-sm">
                Tạo phiếu xuất chứa sản phẩm
              </span>
            </div>
          </div>
          <div
            class="overlay-item flex pointer"
            @click="openImportExportModal(true, false)"
          >
            <img src="@/assets/icons/import_icon.svg" />
            <div class="ml">
              <span class="medium-text overlay-item__title">Nhập</span><br />
              <span class="overlay-item__description t-text-sm">
                Tạo phiếu nhập chứa sản phẩm
              </span>
            </div>
          </div>
          <div class="overlay-item flex pointer" @click="handleCancel">
            <img src="@/assets/icons/close_icon.svg" />
            <div class="ml">
              <span class="medium-text overlay-item__title">Đóng</span><br />
              <span class="overlay-item__description t-text-sm">
                Đóng cửa sổ chứa sản phẩm
              </span>
            </div>
          </div>
          <div class="overlay-item flex pointer" @click="openModalDelete">
            <img src="@/assets/icons/remove_icon.svg" />
            <div class="ml">
              <span class="medium-text overlay-item__title">Xóa</span><br />
              <span class="overlay-item__description t-text-sm">
                Xóa sản phẩm khỏi kho
              </span>
            </div>
          </div>
        </div>
      </template>
    </g-multiselect>
  </div>
  <import-export-product-warehouse-modal
    :isVisible="visibleModal.importExport"
    :isImport="isImport"
    :setIsVisible="setVisibleModal('importExport')"
    :selectedProducts="selectedProducts"
    :selectedWarehouses="selectedWarehouses"
    :onSuccess="onSuccessImportExport"
    :stations="product.stations"
  />
  <confirm-delete-product-modal
    :visible="visibleModal.confirmDelete"
    :handleCancel="handleCancelConfirmDelete"
    :selectedProducts="[product]"
    :onSuccess="onSuccessDelete"
  />
</template>

<script>
import GMultiselect from "@/components/base/Multiselect";
import ImportExportProductWarehouseModal from "@/components/modal/ImportExportProductWarehouseModal/index.vue";
import ConfirmDeleteProductModal from "@/components/modal/WareHouseModal/ConfirmDeleteProductModal.vue";

export default {
  name: "ListActionProduct",
  props: [
    "handleCancel",
    "product",
    "setVisibleEditModal",
    "updateInventory",
    "loadingGetDetail",
  ],
  components: {
    GMultiselect,
    ImportExportProductWarehouseModal,
    ConfirmDeleteProductModal,
  },
  data() {
    return {
      visibleModal: {
        editProduct: false,
        importExport: false,
        confirmDelete: false,
      },
      isImport: false,
      noteAction:
        "Chức năng này chỉ thực hiện được khi đã chọn 1 kho và tồn kho > 0",
    };
  },
  computed: {
    selectedProducts() {
      return [
        {
          productId: this.product.product_id,
          productName: this.product.product_name || "",
          productImages: this.product?.images || [],
          totalAvailable: this.product.total_inventory || 0,
          selectedQuanlity: {
            value: 1,
            label: 1,
          },
          isSelected: true,
        },
      ];
    },
    selectedWarehouses() {
      if (this.isImport) return null;
      return (this.product?.stations || []).map((s) => s.id);
    },
  },
  methods: {
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleCloseDropdown() {
      const btn = document.getElementById("btn-detail-product-action");
      if (btn) btn.click();
    },
    openEditModal() {
      if (this.loadingGetDetail) return;
      this.handleCloseDropdown();
      this.setVisibleEditModal(true);
    },
    openImportExportModal(_isImport, _isDisabled) {
      if (_isDisabled) return;
      this.handleCloseDropdown();
      this.isImport = _isImport;
      this.visibleModal.importExport = true;
    },
    openModalDelete() {
      this.handleCloseDropdown();
      this.visibleModal.confirmDelete = true;
    },
    handleCancelConfirmDelete() {
      this.visibleModal.confirmDelete = false;
    },
    onSuccessImportExport(products) {
      for (const product of products) {
        if (product.id === this.product.product_id) {
          this.updateInventory(
            this.isImport ? product.number : -1 * product.number
          );
        }
      }
      this.$store.commit(
        "warehouse/updateInventory",
        products.map((p) => ({
          ...p,
          number: this.isImport ? p.number : -1 * p.number,
        }))
      );
    },
    onSuccessDelete() {
      this.handleCancel();
    },
  },
};
</script>
