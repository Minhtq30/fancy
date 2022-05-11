<template>
  <router-view />
</template>

<script>
export default {
  mounted() {
    this.getListWarehouses();
  },
  computed: {
    warehouses() {
      return this.$store.state.warehouse.warehouses;
    },
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
