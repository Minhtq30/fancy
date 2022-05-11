<template>
  <router-view></router-view>
</template>
<script>
export default {
  mounted() {
    this.getListWarehouses();
  },
  methods: {
    async getListWarehouses() {
      if (!this.warehouses) {
        const errorMessage = await this.$store.dispatch(
          "warehouse/getListWarehouses"
        );
        if (errorMessage) {
          this.$message.error(errorMessage);
        }
      }
    },
  },
};
</script>
