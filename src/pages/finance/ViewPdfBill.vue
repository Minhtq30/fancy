<template>
  <div class="wrapper">
    <div class="overlay" v-if="loading">
      <a-spin />
    </div>
    <iframe allowfullscreen :src="base64Data" />
  </div>
</template>

<script>
import financeService from "@/services/finance.service";

export default {
  components: {},
  data() {
    return {
      base64Data: "",
      loading: true,
    };
  },
  methods: {
    async getPdfFile(params) {
      try {
        const response = await financeService.getInvoicePdf(params);
        if (response.data.success) {
          this.base64Data = response.data.data.data;
        } else {
          this.$message.error(
            response.data.message ||
              "Lấy thông tin chi tiết hóa đơn VAT thất bại"
          );
        }
      } catch (error) {
        this.$message.error(
          error?.response.data.message ||
            "Lấy thông tin chi tiết hóa đơn VAT thất bại"
        );
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getPdfFile({ id: this.$route.params.id });
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  margin-left: -15px;
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #cccc;
  }
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
