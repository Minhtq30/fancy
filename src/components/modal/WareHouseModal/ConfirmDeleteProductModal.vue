<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :title="'Xóa sản phẩm'"
    @cancel="handleCancel"
  >
    <div class="confirm-delete-product-modal-wrapper">
      <div class="t-flex-1">
        <span>Bạn có chắc chắc muốn xóa các sản phẩm đã chọn?</span><br />
        <ul class="t-pl-4">
          <li
            class="medium-text"
            v-for="product in selectedProducts"
            :key="product.product_id"
          >
            {{ product.product_name }}
          </li>
        </ul>
      </div>
      <div class="t-flex">
        <g-button class="w-100 mr" @click="handleCancel"> Hủy </g-button>
        <g-button :loading="loading" class="w-100 ml danger" @click="onSubmit">
          Xóa
        </g-button>
      </div>
    </div>
  </g-modal>
</template>

<script>
import { GModal, GButton } from "@/components/elements";
import warehouseService from "@/services/warehouse.service";

export default {
  name: "ConfirmDeleteProductModal",
  props: ["visible", "handleCancel", "onSuccess", "selectedProducts"],
  components: {
    GModal,
    GButton,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    titleContent() {
      if (this.selectedProducts.length === 1) {
        return `Bạn có chắc muốn xoá sản phẩm ${this.selectedProducts[0]?.product_name}?`;
      }
      return `Bạn có chắc chắc muốn xóa ${this.selectedProducts.length} sản phẩm đã chọn?`;
    },
  },
  methods: {
    async onSubmit() {
      this.loading = true;

      try {
        if (this.selectedProducts.length === 1) {
          const productId = this.selectedProducts[0].product_id;
          const response = await warehouseService.deleteProduct(productId);
          if (response?.data?.success) {
            this.handleCancel();
            this.$message.success(response?.data?.message);
            this.$store.commit("warehouse/deleteProducts", [productId]);
            if (this.onSuccess) {
              this.onSuccess();
            }
          } else {
            this.$message.error(
              response.data.message || "Xóa sản phẩm thất bại"
            );
          }
        } else {
          // TODO: Xử lý TH xóa nhiều
        }
      } catch (error) {
        console.error(error);
        this.$message.error(
          error?.response.data.message || "Xóa sản phẩm thất bại"
        );
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-delete-product-modal-wrapper {
  color: #000;
  font-size: 16px;
}
</style>
