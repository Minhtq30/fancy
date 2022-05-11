<template>
  <div id="warehouse-page__export-history">
    <header-title @onBack="onBack" :no-action="true" :title="title" />
  </div>
</template>

<script>
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";

export default {
  components: {
    HeaderTitle,
  },
  data() {
    return {
      title: "Lịch sử xuất hàng GHTK",
    };
  },
  methods: {
    onBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
#warehouse-page__export-history {
  padding: 1rem;
}
</style>
